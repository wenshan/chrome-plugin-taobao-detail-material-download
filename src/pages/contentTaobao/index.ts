let lifestyle_image_link: any[] | undefined = [];
let image_link: any[] | undefined = [];
let additional_image_link: any[] | undefined = [];
let sku: any[] | undefined = [];
let video: any[] | undefined = [];
let attr: any[] | undefined = [];
let fileNamePath: string = '';
let itemId: string = '';
let onePrice: string | null = '';

let extractValueByKey = function (key: string, longString: string, index: number) {
  const regex = new RegExp(`{[^{}]*"${key}"\\s*:\\s*("[^"]*"|\\d+|true|false|null)[^{}]*}`, 'g');
  let result = null;
  let match;
  while ((match = regex.exec(longString)) !== null) {
    try {
      const jsonMatch = JSON.parse(match[index]);
      if (jsonMatch.hasOwnProperty(key)) {
        result = jsonMatch[key];
        break;
      }
    } catch (error) {
      // Ignore parsing errors
    }
  }
  return result;
};
console.log(extractValueByKey);

let getScriptVariable = function () {
  video = [];
  let scripts = document.querySelectorAll('script');
  if (scripts && scripts.length > 0) {
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i]) {
        let str = scripts[i].innerText;
        if (str && str.indexOf('window.Json =') > -1) {
          let videoId = extractValueByKey('videoId', str, 0);
          let src = extractValueByKey('videoUrl', str, 0);
          let imgSrc = extractValueByKey('mainPicUrl', str, 0);
          let filename = imgSrc && getFilename(imgSrc);
          let title = filename && filename.split('.')[0];
          let type = 'MP4';
          let from = 'video';
          let format = 'MP4';
          console.log('videoId:', videoId);
          console.log('videoUrl:', src);
          console.log('mainPicUrl:', imgSrc);
          if (videoId && src && imgSrc) {
            let obj = Object.assign(
              {},
              { videoId, src, imgSrc, title, filename, itemId, type, from, format }
            );
            video.push(obj);
          }
        }
      }
    }
  }
};

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
    var name = '';
    if (arr[0] && arr[0].indexOf('_') > -1) {
      name = arr[0].split('_')[0];
    } else {
      name = arr[0];
    }
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
  let trsFormat;
  // @ts-ignore
  let urlStr = url && url.split('?') > -1 ? url.split('?')[0] : url;
  if (urlStr && urlStr.indexOf('!!') !== -1) {
    let trs = urlStr.split('!!');
    preUrl = trs[1];
    if (preUrl.indexOf('.jpg') > -1) {
      let tres = preUrl.split('.jpg');
      trsFormat = tres[0] + '.jpg';
    }
    if (preUrl.indexOf('.png') > -1) {
      let tres = preUrl.split('.png');
      trsFormat = tres[0] + '.png';
    }
    realUrl = trs[0] + '!!' + trsFormat;
  } else {
    realUrl = urlStr;
  }
  if (realUrl && realUrl.indexOf('http') !== -1) {
    return realUrl;
  } else {
    return 'https:' + realUrl;
  }
};

// 获取详情数据
let getLifestyleImageLink = function () {
  lifestyle_image_link = [];
  let imagesNode;
  if (document.querySelector('#struct-descRepublicOfSell')) {
    imagesNode = document.querySelectorAll(
      '#struct-descRepublicOfSell .lite-editor-panel img.image--pJ64U'
    );
  }
  if (document.querySelector('#cke_1_contents')) {
    imagesNode = document.querySelectorAll('#cke_1_contents .cke_editable_themed img');
  }
  if (imagesNode && imagesNode.length > 0) {
    for (let i = 0; i < imagesNode.length; i++) {
      if (imagesNode[i]) {
        let srcPath = imagesNode[i].getAttribute('src') || '';
        let filename = srcPath && getFilename(srcPath);
        let title = `${filename && filename.split('.')[0]}_${i + 1}`;
        let src = originalSrc(srcPath);
        let imgSrc = originalSrc(srcPath);
        let type = 'img';
        let size = '';
        let from = 'detail';
        let format = 'JPG';
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
            itemId,
          }
        );
        lifestyle_image_link.push(obj);
      }
    }
  }
};

// 白底图
let getImageLink = function () {
  image_link = [];
  let nodeImg = document.querySelector('#struct-whiteBgImage img');
  if (nodeImg) {
    let srcPath = nodeImg.getAttribute('src') || '';
    let filename = srcPath && getFilename(srcPath);
    let title = filename && filename.split('.')[0];
    let src = srcPath && originalSrc(srcPath);
    let imgSrc = srcPath && originalSrc(srcPath);
    let type = 'img';
    let size = '_';
    let from = 'white'; // white background
    let format = 'JPG';
    image_link.push(
      Object.assign({}, { filename, title, src, imgSrc, type, size, from, format, itemId })
    );
  }
};
// 获取主图
let getAdditionalImageLink = function () {
  additional_image_link = [];
  let nodeWrap = document.querySelectorAll('#struct-mainImagesGroup div.drag-item');
  if (nodeWrap && nodeWrap.length > 0) {
    for (let i = 0; i < nodeWrap.length; i++) {
      let image = nodeWrap[i].getElementsByTagName('img')[0];
      if (nodeWrap[i] && image) {
        let srcPath = image.getAttribute('src') || '';
        let filename = srcPath && getFilename(srcPath);
        let title = `${filename && filename.split('.')[0]}_${i + 1}`;
        let src = srcPath && originalSrc(srcPath);
        let imgSrc = srcPath && originalSrc(srcPath);
        let type = 'img';
        let size = '_';
        let from = 'main';
        let format = 'JPG';
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
            itemId,
          }
        );
        additional_image_link.push(obj);
      }
    }
  }
};

// 获取分类信息
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let getClassifySkuImgs = function () {
  sku = [];
  let skuColorObj = {};
  // 颜色
  let colorNodeUl = document.querySelectorAll('#struct-saleProp li.has-upload-img');
  if (colorNodeUl && colorNodeUl.length > 0) {
    for (let i = 0; i < colorNodeUl.length; i++) {
      let image = colorNodeUl[i].getElementsByTagName('img')[0];
      let title = colorNodeUl[i].getElementsByTagName('input')[0].getAttribute('value');
      let srcPath = image && image.getAttribute('src');
      let filename = srcPath && getFilename(srcPath);
      let src = srcPath && originalSrc(srcPath);
      let imgSrc = srcPath && originalSrc(srcPath);
      let size = '';
      let type = 'img';
      let from = 'sku';
      let format = 'JPG';
      if (title) {
        // @ts-ignore
        skuColorObj[title] = Object.assign(
          {},
          { filename, src, imgSrc, title, size, type, from, format, itemId }
        );
      }
    }
    console.log('skuColorObj:', skuColorObj);
    // 价格
    let nodeTr = document.querySelectorAll('#struct-sku tr.sku-table-row');
    if (nodeTr && nodeTr.length > 0) {
      for (let i = 0; i < nodeTr.length; i++) {
        let priceNode = nodeTr[i].getElementsByTagName('td')[1];
        let titleNode = nodeTr[i].getElementsByTagName('td')[0];
        let title2 = titleNode.getElementsByTagName('span')[0].innerText;
        let price =
          (priceNode && priceNode.getElementsByTagName('input')[0].getAttribute('value')) || 0;
        // @ts-ignore
        let obj = Object.assign({}, skuColorObj[title2], { title: title2, price });
        // @ts-ignore
        sku.push(obj);
      }
    }
    return sku;
  }
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
        itemId,
      }
    );
    // @ts-ignore
    attr.push(obj);
  }
};

let getFileNamePath = function () {
  fileNamePath = '';
  let node = document.querySelector('#struct-title input');
  if (node) {
    fileNamePath = node.getAttribute('value') || '';
  }
};

let getItemId = function () {
  itemId = '';
  var search = window.document.location.search;
  if (search && search.indexOf('itemId=') > -1) {
    let temp = search.split('=')[1];
    if (temp && temp.indexOf('&') > -1) {
      itemId = temp.split('&')[0];
    } else {
      itemId = temp;
    }
  }
};

// 一口价
let getOnePrice = function () {
  onePrice = '';
  let nodeTop = document.querySelectorAll('#struct-price input')[0];
  onePrice = nodeTop.getAttribute('value');
};
let run = function () {
  console.log('contentTaobao onload:', 'onload');
  // 清理数据
  chrome.storage.local.set({ contentData: {} }, function () {
    console.log('content-storage-set:', '清理成功！');
  });
  getOnePrice();
  getItemId();
  getImageLink();
  getFileNamePath();
  getAdditionalImageLink();
  getLifestyleImageLink();
  getClassifySkuImgs();
  getScriptVariable();
  // sku = getClassifySkuImgs();
  // attr = getAttributes();
  console.log(getAttributes);
  let data = {
    lifestyle_image_link,
    image_link,
    additional_image_link,
    video,
    sku,
    attr,
  };
  const messageData = {
    type: 'content-data',
    format: 'taobao',
    data,
    fileNamePath,
    itemId,
    onePrice,
  };
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'popup-refresh') {
      window.scrollTo({
        top: document.body.scrollHeight - 500,
        behavior: 'smooth',
      });
      run();
      sendResponse(messageData);
    }
    return true;
  });
  chrome.storage.local.set({ contentData: messageData }, function () {
    console.log('content-storage-set:', '成功！');
  });
};
window.onload = run;

export {};
