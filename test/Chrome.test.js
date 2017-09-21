var fs = require('fs');
var assert = require('chai').assert;
var chromelauncher = require('chrome-launcher');
var CDP = require('chrome-remote-interface');

var html = './test/Chrome.test.html';
// var js = './modules/UpdateCopyright.js';

function fetch(filename) {
  return fs.readFileSync(filename, 'utf-8');
}

async function startHeadlessChrome() {
  try {
    return await chromelauncher.launch({
      port: 9222,
      startingUrl: 'target:blank',
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });
  } catch(error) {
    console.error(error);
  }
}

describe('chrome-headlessのテスト', function() {
  it('titleを評価できるか', function(done) {

    startHeadlessChrome().then(function(chrome) {

      CDP(async function (client) {
        var Page = client.Page;
        var Runtime = client.Runtime;
        await Page.enable();
        await Runtime.enable();

        var blank = await Page.navigate({ url: 'target:blank' });
        await Page.setDocumentContent({
          frameId: blank.frameId,
          html: fetch(html)
        });

        // await Page.addScriptToEvaluateOnLoad({
        //   scriptSource: js
        // });

        // await Page.loadEventFired();

        var exp = `document.querySelector('title').innerHTML`;
        var title = await Runtime.evaluate({
          expression: exp 
        });

        try {
          assert.equal(title.result.value, 'sample');
        } catch(error) {
          return done(error);
        } finally {
          client.close();
          chrome.kill();
        }

        done();
      });
    });
  });
});
