/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  console.log('reason:', reason);
  if (reason === 'update' || reason === 'install') {
    console.log('加载完成');
    console.log('version:', chrome.runtime.getManifest().version);
    // var video = {};
    // var videos = [];
    // var domain = 'https://www.dreamstep.top';
    var fileNamePath = '';
    var contentData = {};
    var currentTab = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log('currentTab:', currentTab[0]);

    // 监听 props  content 消息
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      console.log('background request:', request);
      console.log('background sender:', sender);
      // get popup refresh
      if (request.type === 'popup-refresh' && contentData && fileNamePath) {
        sendResponse({
          type: 'content-data',
          format: 'taobao',
          data: contentData,
          fileNamePath,
        });
      }
      // get content-data
      if (request.type === 'content-data' && request.data && request.fileNamePath) {
        fileNamePath = request.fileNamePath;
        contentData = request.data;
        sendResponse(request);
      }

      if (request.type === 'push-data' && request.data && request.title) {
        // var resourceUrl = 'https://api.limeetpet.com/api/product/createProductPushData';
        var resourceUrl = 'http://127.0.0.1:7001/api/product/createProductPushData';
        var postUrl = resourceUrl;
        var postData = {
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhvdV92ZUBob3RtYWlsLmNvbSIsImlhdCI6MTczNjM0NDU2MX0.cDoQX2m8NrN0Uhi1AdwukfGhFoyquiTcePZVw1AiXMQ',
          data: request.data,
          title: request.title,
        };
        console.log('postData:', postData);
        fetch(postUrl, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: JSON.stringify(postData),
        })
          .then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                console.log('data.get response:', data);
              });
            }
          })
          .catch(function (error) {
            console.log('error:', error);
          })
          .finally(function () {
            console.log('完成');
          });
        sendResponse(true);
      }

      return true;
    });
    // 监听 content-data 数据存储
    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`
        );
      }
    });
  }
});
export {};
