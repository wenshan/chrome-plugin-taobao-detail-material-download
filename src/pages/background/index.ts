var video = {};
var domain = 'https://www.dreamstep.top';
// 加载完成
chrome.runtime.onInstalled.addListener(function () {
  console.log('加载完成');
  chrome.webRequest.onBeforeRequest.addListener(
    function (details: { url: any }) {
      var resourceUrl = details.url;
      if (resourceUrl.indexOf('.m3u8') > 0) {
        console.log('m3u8:', details.url);
        var postUrl =
          'https://www.dreamstep.top/api/setM3u8Url?url=' + encodeURIComponent(resourceUrl);
        fetch(postUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With',
          },
          mode: 'cors',
          cache: 'default',
        })
          .then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                console.log('setM3u8Url response:', data);
                video['src'] = domain + data.data.local_url;
                video['type'] = 'video';
                video['isServer'] = true;
                video['msg'] = '已完成视频流媒体m3u8格式转换成MP4';
                video['scformat'] = 'm3u8';
                video['scdata'] = data.data;
              });
            }
          })
          .catch(function (error) {
            console.log('error:', error);
          });
      } else if (resourceUrl.indexOf('.mp4') > 0) {
        console.log('mp4:', details.url);
        video['src'] = details.url;
        video['type'] = 'video';
        video['isServer'] = false;
        video['msg'] = '';
        video['scformat'] = 'mp4';
        video['scdata'] = {};
      }

      return { cancel: true };
    },
    { urls: ['*://*.taobao.com/*', '*://*.alicdn.com/*'], types: [] }
  );
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('background-request', request);
  // 获取当前tab
  if (request.type === 'refresh') {
    console.log('video:', video);
    console.log('background request:', request);
    console.log('background sender:', sender);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      tabs &&
        tabs.length > 0 &&
        chrome.tabs.sendMessage(tabs[0].id, { type: 'refresh', video }, function (res) {
          console.log(tabs[0].id, video);
        });
    });
    sendResponse(true);
  }
});
