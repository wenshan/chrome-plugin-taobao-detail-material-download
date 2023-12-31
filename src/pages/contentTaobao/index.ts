let detail = [];
let mian = [];
let sku = [];
let video: any[] | undefined = [];
let attr = [];
/*
let microscopeData = {
  userid: '',
};
*/

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

// 获取链接的filename
let getFilename = function (url: string) {
  var filename = '';
  var urlPath = '';
  if (url) {
    if (url.indexOf('?') > -1) {
      urlPath = url.split('?')[0];
    } else {
      urlPath = url;
    }
    var filenameOne =
      // @ts-ignore
      (urlPath.match(/[^/\\&?]+\.\w+$/) && urlPath.match(/[^/\\&?]+\.\w+$/)[0]) || '';
    var arr = filenameOne.split('.');
    var name = arr[0];
    var format = arr[1] && arr[1].indexOf('_') > 0 ? arr[1].split('_')[0] : arr[1];
    if (name && format) {
      filename = name + '.' + format;
    }
  }
  return filename;
};

// 获取原始url
// 获取原始url
let originalSrc = function (url: string) {
  let realUrl;
  let preUrl;
  let trsFromat;
  // @ts-ignore
  let urlStr = url && url.split('?') > -1 ? url.split('?')[0] : url;
  if (urlStr && urlStr.indexOf('!!') !== -1) {
    let trs = urlStr.split('!!');
    preUrl = trs[1];
    if (preUrl.indexOf('.jpg') > -1) {
      let trse = preUrl.split('.jpg');
      trsFromat = trse[0] + '.jpg';
    }
    if (preUrl.indexOf('.png') > -1) {
      let trse = preUrl.split('.png');
      trsFromat = trse[0] + '.png';
    }
    realUrl = trs[0] + '!!' + trsFromat;
  } else {
    realUrl = urlStr;
  }
  if (realUrl && realUrl.indexOf('http') !== -1) {
    return realUrl;
  } else {
    return 'https:' + realUrl;
  }
};

window.onload = function () {
  console.log('onload:', 'onload');
  let fileNamePath =
    (window.document.title && removeSpecialCharacters(window.document.title)) || 'Taobao';
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('content-script request:', request);
    console.log('content-script sender:', sender);
    if (request && request.type === 'background-refresh') {
      mian = getMaiImgs() || [];
      detail = getDetailImages();
      sku = getClassifySkuImgs();
      attr = getAttributes();
      video = getVideo();

      console.log('request.video:', request.video);
      console.log('detail:', detail);
      console.log('mian:', mian);
      console.log('video:', video);
      console.log('sku:', sku);
      console.log('attr:', attr);
      let taobaoDetail = {
        detail,
        mian,
        video,
        sku,
        attr,
      };

      let taobaoDetailObj = {};

      for (let key in taobaoDetail) {
        // eslint-disable-next-line array-callback-return
        // @ts-ignore
        taobaoDetail[key].map((item) => {
          // @ts-ignore
          taobaoDetailObj[item.filename] = item;
        });
      }
      const message = {
        type: 'content-data',
        taobaoDetail,
        fileNamePath,
        taobaoDetailObj,
      };
      chrome.runtime.sendMessage(message, function (res) {
        console.log('content-data-res:', res);
      });
      chrome.storage.local.set({ taobaoDetail: { taobaoDetailObj, fileNamePath } }, function () {
        console.log('content-StorageArea-set:', '成功！');
      });
      sendResponse(request);
    }
  });
};

// 获取视频
let getVideo = function () {
  video = [];
  var meta = document.querySelector('meta[name="microscope-data"]');
  var scripts = document.querySelectorAll('script');
  var imgVedioID;
  var nodeTop;
  if (meta) {
    // @ts-ignore
    var userId = meta.content.match(/userid=(\d+);/);
    if (userId) {
      userId = userId[1];
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].innerText) {
          if (!imgVedioID) {
            imgVedioID = scripts[i].innerText.match(/"videoId":"(\d+)"/);
            nodeTop = document.querySelectorAll('#J_VideoThumb')[0];
            if (imgVedioID && nodeTop) {
              imgVedioID = imgVedioID[1];
              let thumbImgs = nodeTop.getElementsByTagName('img')[0];
              let srcPath = (thumbImgs && thumbImgs.getAttribute('src')) || '';
              let imgSrc =
                'https://cloud.video.taobao.com/play/u/' +
                userId +
                '/p/1/e/6/t/1/' +
                imgVedioID +
                '.mp4';
              let filename = srcPath && getFilename(srcPath);
              let title = filename && filename.split('.')[0];
              let src = srcPath && originalSrc(srcPath);
              let type = 'video';
              let size = '400x400';
              let from = 'main';
              let format = 'MP4';
              let msg = '';
              let isServer = false;
              let state = true;
              let obj = Object.assign(
                {},
                {
                  filename,
                  title,
                  src,
                  imgSrc,
                  type,
                  size,
                  from,
                  format,
                  isServer,
                  state,
                  msg,
                }
              );
              video.push(obj);
              return video;
            }
          }
        }
      }
    }
  }
};

// 获取详情数据
let getDetailImages = function () {
  detail = [];
  let nodeTop = document.querySelectorAll('#description')[0];
  let images = nodeTop.getElementsByTagName('img');
  if (images && images.length > 0) {
    for (var i = 0; i < images.length; i++) {
      if (images[i]) {
        let srcPath =
          (images[i].getAttribute('data-ks-lazyload')
            ? images[i].getAttribute('data-ks-lazyload')
            : images[i].getAttribute('src')) || '';

        let filename = srcPath && getFilename(srcPath);
        let title = filename && filename.split('.')[0];
        let src = originalSrc(srcPath);
        let imgSrc = originalSrc(srcPath);
        let type = 'img';
        let size = '';
        let from = 'detail';
        let format = 'JPG';
        let isServer = false;
        let state = true;
        let msg = '';
        let obj = Object.assign(
          {},
          {
            filename,
            title,
            src,
            imgSrc,
            type,
            size,
            from,
            format,
            isServer,
            state,
            msg,
          }
        );
        // @ts-ignore
        detail.push(obj);
      }
    }
  }
  return detail;
};

// 获取主图
let getMaiImgs = function () {
  mian = [];
  video = [];
  let nodeTop = document.querySelectorAll('#J_UlThumb')[0];
  let thumbImgs = nodeTop.getElementsByTagName('li');
  if (thumbImgs && thumbImgs.length > 0) {
    for (let i = 0; i < thumbImgs.length; i++) {
      if (thumbImgs[i]) {
        let nodeImg = thumbImgs[i].getElementsByTagName('img')[0];
        let srcPath = (nodeImg && nodeImg.getAttribute('src')) || '';
        let filename = srcPath && getFilename(srcPath);
        let title = filename && filename.split('.')[0];
        let src = srcPath && originalSrc(srcPath);
        let imgSrc = srcPath && originalSrc(srcPath);
        let type = 'img';
        let size = '800x800';
        let from = 'main';
        let format = 'JPG';
        let msg = '';
        let isServer = false;
        let state = true;
        let obj = Object.assign(
          {},
          {
            filename,
            title,
            src,
            imgSrc,
            type,
            size,
            from,
            format,
            isServer,
            state,
            msg,
          }
        );
        // @ts-ignore
        mian.push(obj);
      }
    }
    return mian;
  }
};

// 获取分类信息
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getClassifySkuImgs = function () {
  sku = [];
  let nodeTop = document.querySelectorAll('#J_isku')[0];
  let nodeUl = nodeTop.getElementsByClassName('tb-img')[0];
  let nodeCurrent = nodeUl && nodeUl.getElementsByTagName('a');
  if (nodeTop && nodeUl && nodeCurrent && nodeCurrent.length > 0) {
    for (let i = 0; i < nodeCurrent.length; i++) {
      let title = nodeCurrent[i].getElementsByTagName('span')[0].innerText;
      let strTemp =
        nodeCurrent[i] &&
        // @ts-ignore
        nodeCurrent[i].getAttribute('style') &&
        // @ts-ignore
        nodeCurrent[i].getAttribute('style').match(/\((.+?)\)/g)[0];
      let srcUrl = strTemp && strTemp.substring(1, strTemp.length - 1);
      let srcPath = (srcUrl && srcUrl.indexOf('http') === -1 ? 'https:' + srcUrl : srcUrl) || '';
      let filename = srcPath && getFilename(srcPath);
      let src = srcPath && originalSrc(srcPath);
      let imgSrc = srcPath && originalSrc(srcPath);
      let size = '800x800';
      let type = 'img';
      let from = 'sku';
      let format = 'JPG';
      let msg = '';
      let isServer = false;
      let state = true;
      let obj = Object.assign(
        {},
        {
          filename,
          title,
          src,
          imgSrc,
          type,
          size,
          from,
          format,
          isServer,
          state,
          msg,
        }
      );
      // @ts-ignore
      sku.push(obj);
    }
  }
  return sku;
};

// 获取规格描述
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getAttributes = function () {
  attr = [];
  let strArr = [];
  let baseInfo = getMetaInfo();
  let nodeTop = document.querySelectorAll('#attributes')[0];
  let nodeUl = nodeTop.getElementsByClassName('attributes-list')[0];
  let nodeCurrent = nodeUl.getElementsByTagName('li');
  if (nodeTop && nodeUl && nodeCurrent.length > 0) {
    for (let i = 0; i < nodeCurrent.length; i++) {
      if (nodeCurrent[i]) {
        let tx = nodeCurrent[i].innerText || '';
        strArr.push(tx);
      }
    }
    let des = baseInfo.concat(strArr).join(' \n ');
    let src = 'http://dreamstep.top/MP_verify_NS12w9k3Hl93pPRJ.txt';
    let imgSrc = 'http://dreamstep.top/MP_verify_NS12w9k3Hl93pPRJ.txt';
    let filename = 'MP_verify_NS12w9k3Hl93pPRJ.txt';
    let title = 'MP_verify_NS12w9k3Hl93pPRJ';
    let type = 'txt';
    let from = 'attr';
    let format = 'txt';
    let msg = '';
    let isServer = false;
    let state = true;
    let obj = Object.assign(
      {},
      {
        des,
        filename,
        title,
        src,
        imgSrc,
        type,
        from,
        format,
        isServer,
        state,
        msg,
      }
    );
    // @ts-ignore
    attr.push(obj);
  }
  return attr;
};
export {};
