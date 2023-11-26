let detailImgs = [];
let maiImgs = [];
let classifySkuImgs = [];
let videos: any[] = [];
let attributes = [];
let path = '';

// title 路径加工
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let removeSpecialCharacters = function (str: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let regex = /[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
  return str.replace(regex, '');
};

// meta
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getMetaInfo = function () {
  let baseArr = [];
  let title = 'title:' + window.document.title || '淘宝临时下载';
  baseArr.push(title);
  var metaTags = document.getElementsByTagName('meta');
  for (var i = 0; i < metaTags.length; i++) {
    var metaTag = metaTags[i];
    var metaName = metaTag.getAttribute('name');
    if (metaName === 'description' || metaName === 'keywords') {
      var metaContent = metaTag.getAttribute('content');
      var text = metaName + ':' + metaContent;
      baseArr.push(text);
    }
  }
  return baseArr;
};

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

window.onload = function () {
  path =
    (window.document.title && removeSpecialCharacters(window.document.title)) || '淘宝详情资源下载';
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('content-script request:', request);
    console.log('content-script sender:', sender);
    if (request && request.type === 'refresh') {
      maiImgs = getMaiImgs() || [];
      detailImgs = getDetailImages();
      classifySkuImgs = getClassifySkuImgs();
      attributes = getAttributes();

      if (request.video && videos[0]) {
        videos[0]['imgSrc'] = request.video.src;
        videos[0]['msg'] = request.video.msg;
        videos[0]['isServer'] = request.video.isServer;
        videos[0]['scdata'] = request.video.scdata;
      }
      console.log('detailImgs:', detailImgs);
      console.log('maiImgs:', maiImgs);
      console.log('videos:', videos);
      console.log('classifySkuImgs:', classifySkuImgs);
      console.log('attributes:', attributes);

      chrome.runtime.sendMessage(
        {
          taobaoDetail: {
            detail: detailImgs,
            mian: maiImgs,
            video: videos,
            sku: classifySkuImgs,
            attr: attributes,
          },
        },
        function () {
          console.log('content-script-getImgNode:', '成功！');
        }
      );
      chrome.storage.local.set({ taobaoDetail: { detailImgs, maiImgs } }, function () {
        console.log('content-StorageArea-set:', '成功！');
      });
      sendResponse(true);
    }
  });
};

// 获取详情数据
let getDetailImages = function () {
  detailImgs = [];
  let nodeTop = document.querySelectorAll('#description')[0];
  let images = nodeTop.getElementsByTagName('img');
  if (images && images.length > 0) {
    for (var i = 0; i < images.length; i++) {
      if (images[i] && images[i].getAttribute('align') === 'absmiddle') {
        var index = i + 1;
        var obj = {};
        obj['src'] = images[i].getAttribute('data-ks-lazyload')
          ? images[i].getAttribute('data-ks-lazyload')
          : images[i].getAttribute('src');
        obj['title'] = 'detail_' + index;
        obj['filename'] = 'detail_' + index + '.jpg';
        obj['type'] = 'img';
        obj['size'] = '800x800';
        obj['path'] = path;
        obj['from'] = 'detail';
        obj['format'] = 'JPG';
        obj['msg'] = '';
        obj['isServer'] = false;
        detailImgs.push(obj);
      }
    }
  }
  return detailImgs;
};

// 获取主图
let getMaiImgs = function () {
  maiImgs = [];
  videos = [];
  let nodeTop = document.querySelectorAll('#J_UlThumb')[0];
  let thumbImgs = nodeTop.getElementsByTagName('li');
  if (thumbImgs && thumbImgs.length > 0) {
    for (let i = 0; i < thumbImgs.length; i++) {
      let obj = {};
      let title = 'main_' + i;
      if (thumbImgs[i] && thumbImgs[i].getAttribute('id') === 'J_VideoThumb') {
        let nodeImg = thumbImgs[i].getElementsByTagName('img')[0];
        let src =
          nodeImg.getAttribute('src') && nodeImg.getAttribute('src').split('.jpg')[0] + '.jpg';
        title = 'main_' + i;
        obj['src'] = src && src.indexOf('http') > 0 ? src : 'https:' + src;
        obj['title'] = title;
        obj['imgSrc'] = src && src.indexOf('http') > 0 ? src : 'https:' + src;
        obj['filename'] = title + '.mp4';
        obj['type'] = 'video';
        obj['size'] = '720';
        obj['path'] = path;
        obj['from'] = 'main';
        obj['format'] = 'MP4';
        obj['msg'] = '';
        obj['isServer'] = true;
        videos.push(obj);
      } else {
        let nodeImg = thumbImgs[i].getElementsByTagName('img')[0];
        let src = nodeImg.getAttribute('src').split('.jpg')[0] + '.jpg';
        title = 'main_' + i;
        obj['src'] = src && src.indexOf('http') > 0 ? src : 'https:' + src;
        obj['title'] = title;
        obj['imgSrc'] = src && src.indexOf('http') > 0 ? src : 'https:' + src;
        obj['filename'] = title + '.jpg';
        obj['type'] = 'img';
        obj['size'] = '800x800';
        obj['path'] = path;
        obj['from'] = 'main';
        obj['format'] = 'JPG';
        obj['msg'] = '';
        obj['isServer'] = false;
        maiImgs.push(obj);
      }
    }
    return maiImgs;
  }
};

// 获取分类信息
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getClassifySkuImgs = function () {
  classifySkuImgs = [];
  let nodeTop = document.querySelectorAll('#J_isku')[0];
  let nodeUl = nodeTop.getElementsByClassName('tb-img')[0];
  let nodeCurrent = nodeUl && nodeUl.getElementsByTagName('a');
  if (nodeTop && nodeUl && nodeCurrent.length > 0) {
    for (let i = 0; i < nodeCurrent.length; i++) {
      let obj = {};
      let title = nodeCurrent[i].getElementsByTagName('span')[0].innerText;
      let strTemp =
        nodeCurrent[i].getAttribute('style') && nodeCurrent[i].getAttribute('style')
          ? nodeCurrent[i].getAttribute('style').match(/\((.+?)\)/g)[0]
          : '';
      let srcPath = strTemp && strTemp.substring(1, strTemp.length - 1);
      let src = srcPath && srcPath.indexOf('http') > 0 ? srcPath : 'https:' + srcPath;
      obj['title'] = 'sku_' + title;
      obj['src'] = src.split('.jpg')[0] + '.jpg';
      obj['imgSrc'] = src.split('.jpg')[0] + '.jpg';
      obj['filename'] = title + '.jpg';
      obj['type'] = 'img';
      obj['path'] = path;
      obj['from'] = 'sku';
      obj['format'] = 'JPG';
      obj['msg'] = '';
      obj['isServer'] = false;
      classifySkuImgs.push(obj);
    }
  }
  return classifySkuImgs;
};

// 获取规格描述
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getAttributes = function () {
  attributes = [];
  let strArr = [];
  let baseInfo = getMetaInfo();
  let nodeTop = document.querySelectorAll('#attributes')[0];
  let nodeUl = nodeTop.getElementsByClassName('attributes-list')[0];
  let nodeCurrent = nodeUl.getElementsByTagName('li');
  if (nodeTop && nodeUl && nodeCurrent.length > 0) {
    let obj = {};
    for (let i = 0; i < nodeCurrent.length; i++) {
      let tx = nodeCurrent[i].innerText || '';
      strArr.push(tx);
    }
    obj['des'] = baseInfo.concat(strArr).join(' \n ');
    obj['type'] = 'txt';
    obj['path'] = path;
    obj['from'] = 'attributes';
    obj['format'] = 'txt';
    obj['msg'] = '';
    obj['isServer'] = false;
    attributes.push(obj);
  }
  return attributes;
};
