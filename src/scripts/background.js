'use strict';
var videoUrl = '';
var video = {};
var domain = 'https://www.dreamstep.top';
// 加载完成
chrome.runtime.onInstalled.addListener(function() {
  console.log('onInstalled 加载完成');
  /*
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      var resourceUrl = details.url;
      if (resourceUrl.indexOf('.m3u8') > 0 && false) {
        var postUrl = 'https://www.dreamstep.top/api/setM3u8Url?url=' + encodeURIComponent(resourceUrl);
        fetch(postUrl, {
          method: 'GET',
          headers: {
            accept: 'application/json, application/xml, text/play, text/html',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With'
          },
          mode: 'cors',
          cache: 'default'
        })
          .then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                video['src'] = domain + data.data.local_url;
                video['type'] = 'video';
              });
            }
          })
          .catch(function(error) {
            console.log('error:', error);
          });
      } else if (resourceUrl.indexOf('.mp4') > 0) {
        video['src'] = details.url;
        video['type'] = 'video';
      }

      return { cancel: true };
    },
    { urls: [ '*://*.taobao.com/*', '*://*.alicdn.com/*' ], types: [] },
    null
  );
  */
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('background-request', request);
    // 获取当前tab
    if (request.type == 'refresh') {
      console.log('video:', video);
      console.log('background request:', request);
      console.log('background sender:', sender);
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        tabs &&
          tabs.length > 0 &&
          chrome.tabs.sendMessage(tabs[0].id, { type: 'refresh', video }, function(res) {
            console.log(tabs[0].id, video);
          });
      });
      sendResponse(true);
    }
  });
});
