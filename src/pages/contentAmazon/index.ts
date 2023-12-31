/* eslint-disable @typescript-eslint/no-unused-vars */
let detail: any[] = [];
let mian = [];
let sku = [];
let video = [];
let attr = [];
let windowRunParams = {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let productId = '';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let productName = '';
// 获取页面全局变量 runParams
let getPageRunParams = function () {
  let scriptBody = document.querySelectorAll('body script');
  if (scriptBody && scriptBody.length) {
    for (var i = 0; i < scriptBody.length; i++) {
      // @ts-ignore
      if (scriptBody[i] && scriptBody[i].innerText.indexOf('ImageBlockBTF') > -1) {
        let jsonData;
        try {
          // @ts-ignore
          let runParamsStr = scriptBody[i].innerText;
          // @ts-ignore
          let runParamsStrTOW = runParamsStr.match(/\(.*?\)/g)[4];
          let windowRunParams = runParamsStrTOW
            .substring(2, runParamsStrTOW.length - 2)
            .replace(/'/g, '-')
            .replace(/\f/g, '-')
            .replace(/\n/g, '-')
            .replace(/\t/g, '-')
            .replace(/\\/g, '\\\\');
          console.log(JSON.parse(windowRunParams));
          jsonData = JSON.parse(windowRunParams);
        } catch (err) {
          console.log('JSON.parse 出错了：' + err);
        }
        return jsonData;
      }
    }
  }
};

// 获取链接的filename
let getFilename = function (url: string, index: string | number) {
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
      filename = name + '-' + index + '.' + format;
    }
  }
  return filename;
};

// 获取原始url

window.onload = function () {
  windowRunParams = getPageRunParams();
  // @ts-ignore
  let fileNamePath = windowRunParams.title.split(',')[0];
  chrome.runtime &&
    chrome.runtime.onMessage &&
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      console.log('content-script request:', request);
      console.log('content-script sender:', sender);
      if (request && request.type === 'background-refresh') {
        // @ts-ignore
        mian = getMaiImgs(windowRunParams) || [];
        detail = getDetailImages();
        sku = getClassifySkuImgs(windowRunParams) || [];
        attr = getAttributes(windowRunParams);
        video = getMainVideo(windowRunParams);
        console.log('fileNamePath:', fileNamePath);
        console.log('mian:', mian);
        console.log('detail:', detail);
        console.log('sku:', sku);
        console.log('attr:', attr);
        console.log('video:', video);

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
          taobaoDetail[key].map((item: { filename: string | number }) => {
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
          console.log('content-data-res-3:', res);
          sendResponse(request);
        });
        chrome.storage.local.set({ taobaoDetail: { taobaoDetailObj, fileNamePath } }, function () {
          console.log('content-StorageArea-set:', '成功！');
        });
        return true;
      }
    });
};
// 获取视频数据
let getMainVideo = function (data: { videos?: any }) {
  video = [];
  if (data && data.videos && data.videos.length) {
    for (var i = 0; i < data.videos.length; i++) {
      let srcPath = data.videos[i].url;
      let filename = srcPath && getFilename(srcPath, i);
      let title = data.videos[i].title;
      let src = data.videos[i].slateUrl;
      let imgSrc = srcPath;
      let type = 'video';
      let size = data.videos[i].videoWidth + 'x' + data.videos[i].videoHeight;
      let from = 'main';
      let format = 'MP4';
      let msg = '';
      let isServer = true;
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
          msg,
          isServer,
          state,
        }
      );
      video.push(obj);
    }
  }
  return video;
};
// 获取详情数据
let getDetailImages = function () {
  detail = [];
  let node = document.querySelectorAll('#aplus')[0];
  let nodeImg = node.getElementsByTagName('img');
  if (nodeImg && nodeImg.length) {
    for (var i = 0; i < nodeImg.length; i++) {
      if (nodeImg[i].getAttribute('data-src')) {
        let srcPath = nodeImg[i].getAttribute('data-src');
        let filename = srcPath && getFilename(srcPath, i);
        let title = filename && filename.split('.')[0];
        let src = srcPath;
        let imgSrc = srcPath;
        let size = '800x800';
        let type = 'img';
        let from = 'detail';
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
        detail.push(obj);
      }
    }
  }
  return detail;
};

// 获取主图
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getMaiImgs = function (data: { colorImages?: any; colorToAsin?: any }) {
  mian = [];
  // @ts-ignore
  if (data && data.colorImages && data.colorToAsin) {
    for (let ket in data.colorImages) {
      if (data.colorImages[ket] && data.colorImages[ket].length > 0) {
        let srcPath = data.colorImages[ket][0].hiRes;
        let filename = srcPath && getFilename(srcPath, data.colorToAsin[ket].asin || 'main');
        let title = filename && filename.split('.')[0];
        let src = srcPath;
        let imgSrc = srcPath;
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
        mian.push(obj);
      }
    }
    return mian;
  }
};

// 获取分类信息
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getClassifySkuImgs = function (data: { colorImages?: any }) {
  sku = [];
  // @ts-ignore
  if (data && data.colorImages) {
    for (let ket in data.colorImages) {
      if (data.colorImages[ket] && data.colorImages[ket].length > 0) {
        for (var i = 0; i < data.colorImages[ket].length; i++) {
          let srcPath = data.colorImages[ket][i].hiRes;
          let filename = srcPath && getFilename(srcPath, ket);
          let title = filename && filename.split('.')[0];
          let src = srcPath;
          let imgSrc = srcPath;
          let type = 'img';
          let size = '800x800';
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
          sku.push(obj);
        }
      }
    }
  }
  return sku;
};

// 获取规格描述
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getAttributes = function (data: { title?: any }) {
  attr = [];
  let des = [];
  let node = document.querySelectorAll('#aplus')[0];
  let nodeP = node.getElementsByTagName('p');
  let nodeH1 = node.getElementsByTagName('h1');
  let nodeH2 = node.getElementsByTagName('h2');
  let nodeH3 = node.getElementsByTagName('h3');
  let baseInfo = 'title:' + data.title || 'Aliexpress';
  if (nodeH1 && nodeH1.length) {
    for (var i = 0; i < nodeH1.length; i++) {
      if (nodeH1[i] && nodeH1[i].innerText) {
        des.push(nodeH1[i].innerText);
      }
    }
  }
  if (nodeH2 && nodeH2.length) {
    for (var i = 0; i < nodeH2.length; i++) {
      if (nodeH2[i] && nodeH2[i].innerText) {
        des.push(nodeH2[i].innerText);
      }
    }
  }
  if (nodeH3 && nodeH3.length) {
    for (var i = 0; i < nodeH3.length; i++) {
      if (nodeH3[i] && nodeH3[i].innerText) {
        des.push(nodeH3[i].innerText);
      }
    }
  }
  if (nodeP && nodeP.length) {
    for (var i = 0; i < nodeP.length; i++) {
      if (nodeP[i] && nodeP[i].innerText) {
        des.push(nodeP[i].innerText);
      }
    }
  }
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
  attr.push(obj);
  return attr;
};
export {};
