var assert = require('chai').assert;
var chromelauncher = require('chrome-launcher');
var CDP = require('chrome-remote-interface');
var url = 'http://www.seiwa-chemical.net/example/';

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

describe('chromeのテスト', function() {
  it('titleを評価できるか', function(done) {

    startHeadlessChrome().then(function(chrome) {

      CDP(async function (client) {
        var Page = client.Page;
        var Runtime = client.Runtime;
        await Page.enable();
        await Runtime.enable();
        await Page.navigate({url: url});

        await Page.loadEventFired();

        var exp = `document.querySelector('title').innerHTML`;
        var title = await Runtime.evaluate({
          expression: exp 
        });

        try {
          assert.equal(title.result.value, 'postcss');
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
