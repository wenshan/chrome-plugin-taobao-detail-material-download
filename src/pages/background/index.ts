chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  console.log('reason:', reason);
  if (reason === 'update' || reason === 'install') {
    console.log('加载完成');
    console.log('version:', chrome.runtime.getManifest().version);
    var video = {};
    var videos = [];
    var domain = 'https://www.dreamstep.top';
    var fileNamePath = '';
    var taobaoDetailObj = '';
    var currentTab = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log('currentTab:', currentTab[0]);

    chrome.webRequest.onBeforeRequest.addListener(
      function (details) {
        console.log(details.url);
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
                  video['imgSrc'] = domain + data.data.local_url;
                  video['src'] = domain + data.data.local_img;
                  video['filename'] = data.data.filename;
                  video['type'] = 'video';
                  video['isServer'] = true;
                  video['msg'] = '已完成视频流媒体m3u8格式转换成MP4';
                  video['scformat'] = 'm3u8';
                  video['scdata'] = data.data;
                  video['state'] = true;
                });
              } else {
                video['state'] = false;
              }
            })
            .catch(function (error) {
              video['state'] = false;
              console.log('error:', error);
            })
            .finally(function () {
              // @ts-ignore
              videos.push(video);
            });
        } else if (resourceUrl.indexOf('.mp4') > 0) {
          console.log('mp4:', details.url);
          video['imgSrc'] = details.url;
          video['type'] = 'video';
          video['isServer'] = false;
          video['msg'] = '';
          video['scformat'] = 'mp4';
          video['scdata'] = {};
          video['state'] = true;
          // @ts-ignore
          videos.push(video);
        }
        return { cancel: true };
      },
      {
        urls: [
          '*://*.taobao.com/*',
          '*://*.alicdn.com/*',
          '*://*.tmall.com/*',
          '*://*.tmall.hk/*',
          '*://*.detail.tmall.com/*',
        ],
        types: [],
      }
    );
    chrome.downloads.onDeterminingFilename.addListener(function (downloadItem, suggest) {
      console.log('下载监听完成');
      console.log('onDeterminingFilename-downloadItem:', downloadItem);
      console.log('onDeterminingFilename-fileNamePath:', fileNamePath);
      console.log('onDeterminingFilename-taobaoDetailObj:', taobaoDetailObj);
      let currentItem = taobaoDetailObj[downloadItem.filename];
      console.log(
        'suggest-filename',
        fileNamePath + '/' + currentItem.from + '/' + currentItem.filename
      );
      if (currentItem && fileNamePath && currentItem.from && currentItem.filename) {
        suggest({
          filename: fileNamePath + '/' + currentItem.from + '/' + currentItem.filename,
          conflictAction: 'overwrite',
        });
      }
    });
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      console.log('background request:', request);
      console.log('background sender:', sender);
      // get popup refresh
      if (request.type === 'popup-refresh') {
        const message = {
          type: 'background-refresh',
          videos,
        };
        // to content
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
          console.log('tabs:', tabs[0]);
          if (tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, message, (res) => {
              console.log('background-refresh-res-2', res);
              sendResponse(message);
            });
          }
        });
        return true;
      }
      // get content
      if (request.type === 'content-data' && request.taobaoDetail && request.fileNamePath) {
        fileNamePath = request.fileNamePath;
        taobaoDetailObj = request.taobaoDetailObj;
        sendResponse(request);
      }
      return true;
    });
  }
});
export {};
