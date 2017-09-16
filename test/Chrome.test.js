var mocha = require('mocha');
var assert = require('chai').assert;
var chromelauncher = require('chrome-launcher');
var CDP = require('chrome-remote-interface');
var url = 'http://www.seiwa-chemical.net/example/';

/*
chromelauncher.launch({
  startingUrl: 'target:blank',
  chromeFlags: ['--headless', '--disable-gpu']
}).then(function(chrome) {
  console.log(`dubugging port running on ${chrome.port}`);
});
*/

CDP(async function (client) {
  var Page = client.Page;

  await Page.enable();
  await Page.navigate({url: url});

  await client.DOM.getDocument(function(error, res) {
    var options = {
      nodeId: res.root.nodeId,
      selector: 'title'
    };

    client.DOM.querySelector(options, function(error, res) {
      //console.log(error);
      options = {
        nodeId: res.nodeId
      };
      client.DOM.getOuterHTML(options, function(error, res) {
        return res;
      });
    });
  });

  await function(res) {
    console.log(res);
  };
});

/*
describe('chromeのテスト', function() {
  it('titleタグをチェック', function() {

    CDP(function(client) {
      client.Page
        .enable()
        .then(function() {
          return client.Page.navigate({ url: url });
        })
        .then(function() {
          client.DOM.getDocument(function(error, params) {
            if (error) {
              console.error(params);
              return;
            };

            var title = client.DOM.querySelector('title');
            console.log(title);
          });
        })
    }).on('error', function(err) {
      console.error(err);
    });

  });
});
*/
