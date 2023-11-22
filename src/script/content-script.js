'use strict';

  var detailImgs = [];
  var maiImgs = [];
  var videos = [];
  window.onload = function() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log('content-script request:', request);
      console.log('content-script sender:', sender);
      if (request && request.type === 'refresh' ) {
        detailImgs = getDetailImages();
        maiImgs = getMaiImgs();
        if (request.video) {
          videos.push(request.video);
        }
        console.log('detailImgs:', detailImgs);
        console.log('maiImgs:', maiImgs);
        chrome.runtime.sendMessage({'taobaoDetail': { detailImgs, maiImgs, videos}}, function(){
          console.log('content-script-getImgNode:', '成功！');
        });
        chrome.storage.local.set({'taobaoDetail': {detailImgs, maiImgs}}, function() {
          console.log('content-StorageArea-set:', '成功！');
        });
        sendResponse(true);
      }
    });
  };

  // 获取详情数据
  var getDetailImages = function () {
    detailImgs = [];
    var nodeTop = document.querySelectorAll('#description')[0];
    var images = nodeTop.getElementsByTagName('img');
    if (images && images.length > 0) {
      for (var i = 0; i < images.length; i++) {
        if (images[i] && images[i].getAttribute('align') == 'absmiddle') {
          var index = i + 1;
          var obj = {};
          obj['src'] = images[i].getAttribute('data-ks-lazyload')? images[i].getAttribute('data-ks-lazyload') : images[i].getAttribute('src');
          obj['title'] = 'detail_' + index;
          obj['filename'] = 'detail_' + index + '.jpg';
          obj['type'] = 'img';
          detailImgs.push(obj);
        }
      }
    }
    return detailImgs;
  }

  // 获取主图
  var getMaiImgs = function () {
    maiImgs = [];
    var nodeTop = document.querySelectorAll('#J_UlThumb')[0];
    var thumbImgs = nodeTop.getElementsByTagName('li');
    if (thumbImgs && thumbImgs.length > 0) {
      for (var i = 0; i < thumbImgs.length; i++) {
        var obj = {};
        var title = 'main_' + i;
        if (thumbImgs[i] && thumbImgs[i].getAttribute('id') == 'J_VideoThumb') {
          var nodeVideo = document.querySelectorAll('.lib-video')[0].getElementsByTagName('video')[0];
          var imgSrc = nodeVideo.getAttribute('poster').split('.jpg')[0] + '.jpg';
          title = 'main_' + i;
          obj['src'] = '';
          obj['blob'] = nodeVideo.getAttribute('src');
          obj['title'] = title;
          obj['imgSrc'] = imgSrc;
          obj['filename'] = title + '.mp4';
          obj['type'] = 'video';
          maiImgs.push(obj);
        } else {
          var nodeImg = thumbImgs[i].getElementsByTagName('img')[0];
          var src = nodeImg.getAttribute('src').split('.jpg')[0] + '.jpg';
          title = 'main_' + i;
          obj['src'] = src;
          obj['title'] = title;
          obj['imgSrc'] = src;
          obj['filename'] = title + '.jpg';
          obj['type'] = 'img';
          maiImgs.push(obj);
        }
      }
      return maiImgs;
    }
  }
