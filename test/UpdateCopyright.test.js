var fs = require('fs');
var assert = require('chai').assert;
var chromelauncher = require('chrome-launcher');
var CDP = require('chrome-remote-interface');

var html = './test/UpdateCopyright.test.html';
var js = './modules/UpdateCopyright.js';

function fetch(filename) {
  return fs.readFileSync(filename, 'utf-8');
}

async function startHeadlessChrome() {
  try {
    return await chromelauncher.launch({
      port: 9222,
      startingUrl: 'about:blank',
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
      // logLevel: 'verbose'
    });
  } catch(error) {
    console.error(error);
  }
}

describe('UpdateCopyright', function() {
  it('2017と変更されているか', function(done) {
    startHeadlessChrome().then(function(chrome) {

      CDP(async function (client) {
        var Page = client.Page;
        var Runtime = client.Runtime;
        var Console = client.Console;
        await Page.enable();
        await Runtime.enable();
        await Console.enable();

        Console.messageAdded(function(title) {
          console.log(title);
        });

        await Page.addScriptToEvaluateOnLoad({
          scriptSource: fetch(js)
        });
        var blank = await Page.navigate({ url: 'about:blank' });

        Page.loadEventFired();

        await Page.setDocumentContent({
          frameId: blank.frameId,
          html: fetch(html)
        });

        var exp = `(function() {
          var module = new UpdateCopyright();
          module.init();
          var el = document.body.querySelector('.copyright');
          // console.log(el);
          return el.innerHTML;
        })()`;

        var title = await Runtime.evaluate({
          expression: exp
        });

        // console.log(title);
        try {
          assert.equal(title.result.value, '2017');
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
