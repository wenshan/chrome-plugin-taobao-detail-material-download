let detail: any[] = [];
let mian = [];
let sku = [];
let video = [];
let attr = [];
let metaObj = {};
let windowRunParams = {
  productInfoComponent: {
    id: '',
    subject: '',
  },
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let productId = '';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let productName = '';

// meta
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getMetaInfo = function () {
  let baseArr = [];
  let title = 'title:' + window.document.title || 'Aliexpress';
  baseArr.push(title);
  var metaTags = document.getElementsByTagName('meta');
  for (var i = 0; i < metaTags.length; i++) {
    var metaTag = metaTags[i];
    var metaName = metaTag.getAttribute('property');
    var metaContent = metaTag.getAttribute('content');
    if (metaName && metaContent) {
      var text = metaName + ':' + metaContent;
      baseArr.push(text);
      // @ts-ignore
      metaObj[metaName] = metaTag.getAttribute('content');
    }
  }
  return baseArr;
};
getMetaInfo();
// 获取页面全局变量 runParams
let getPageRunParams = function () {
  let scriptBody = document.querySelectorAll('head script');
  if (scriptBody && scriptBody.length) {
    for (var i = 0; i < scriptBody.length; i++) {
      if (scriptBody[i].innerHTML.indexOf('window.runParams') > -1) {
        let runParamsStr = scriptBody[i].innerHTML;
        // @ts-ignore
        let windowRunParams = JSON.parse(/data:\s?(\{[\s\S]*?)\};/gm.exec(runParamsStr)[1]);
        return windowRunParams;
      }
    }
  }
};

// 获取链接的filename
let getFilename = function (url: string, index: number) {
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
  productId =
    (windowRunParams &&
      windowRunParams.productInfoComponent &&
      windowRunParams.productInfoComponent.id) ||
    '';
  productName =
    (windowRunParams &&
      windowRunParams.productInfoComponent &&
      windowRunParams.productInfoComponent.subject) ||
    '';
  // @ts-ignore
  let fileNamePath = 'Aliexpress_' + productId;
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('content-script request:', request);
    console.log('content-script sender:', sender);
    if (request && request.type === 'background-refresh') {
      sendResponse(request);
      // @ts-ignore
      mian = getMaiImgs() || [];
      detail = getDetailImages();
      sku = getClassifySkuImgs();
      attr = getAttributes();
      video = getMainVideo();
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
      });
      chrome.storage.local.set({ taobaoDetail: { taobaoDetailObj, fileNamePath } }, function () {
        console.log('content-StorageArea-set:', '成功！');
      });
    }
  });
};
// 获取视频数据
let getMainVideo = function () {
  video = [];
  let javascriptBody = document.querySelectorAll('script[type="application/ld+json"]')[0];
  // @ts-ignore
  if (javascriptBody && javascriptBody.innerText.indexOf('@context') > -1) {
    // @ts-ignore
    let jsParse = JSON.parse(javascriptBody.innerText);
    let videoPath = jsParse.filter((item: { [x: string]: string }) => {
      return 'VideoObject' === item['@type'];
    });
    if (videoPath && videoPath[0] && videoPath[0].contentUrl) {
      let srcPath = videoPath[0].contentUrl;
      let filename = srcPath && getFilename(srcPath, 0);
      let title = filename && filename.split('.')[0];
      let src = videoPath[0].thumbnailUrl[0];
      let imgSrc = srcPath;
      let type = 'video';
      let size = '720';
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
  // @ts-ignore
  if (windowRunParams && windowRunParams.productDescComponent) {
    // @ts-ignore
    let { descriptionUrl } = windowRunParams.productDescComponent;
    fetch(descriptionUrl)
      .then((response) => {
        if (response.status === 200) {
          response.text().then((data) => {
            // eslint-disable-next-line array-callback-return
            Array.from(data.matchAll(/img.+?src=\"([^\"]+)/g)).map(function (item: any, index) {
              let srcPath = item[1];
              let filename = srcPath && getFilename(srcPath, index);
              let title = filename && filename.split('.')[0];
              let src = srcPath;
              let imgSrc = srcPath;
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
              detail.push(obj);
            });
          });
        } else {
          detail = [];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return detail;
};

// 获取主图
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getMaiImgs = function () {
  mian = [];
  debugger;
  // @ts-ignore
  if (windowRunParams && windowRunParams.imageComponent) {
    debugger;
    // @ts-ignore
    let { imagePathList } = windowRunParams.imageComponent;
    if (imagePathList && imagePathList.length > 0) {
      for (let i = 0; i < imagePathList.length; i++) {
        let srcPath = imagePathList[i];
        let filename = srcPath && getFilename(srcPath, i);
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
  // @ts-ignore
  if (windowRunParams && windowRunParams.skuComponent) {
    // @ts-ignore
    let { productSKUPropertyList } = windowRunParams.skuComponent;
    let { skuPropertyValues } = productSKUPropertyList[0];
    if (skuPropertyValues && skuPropertyValues.length) {
      for (let i = 0; i < skuPropertyValues.length; i++) {
        if (skuPropertyValues[i]) {
          let srcPath = skuPropertyValues[i].skuPropertyImagePath;
          let filename = srcPath && getFilename(srcPath, i);
          let title = filename && filename.split('.')[0];
          let src = srcPath;
          let imgSrc = srcPath;
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
    }
  }
  return sku;
};

// 获取规格描述
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getAttributes = function () {
  attr = [];
  let baseInfo = getMetaInfo();
  let des = baseInfo.join(' \n ');
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
  return attr;
};
export {};
