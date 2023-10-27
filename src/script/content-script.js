'use strict';

  var linksArr = [];
  var selecType = '';

  // 获取操作信息
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    selecType = request.type;
    if ( request.type === 'img' ) {
      getImgNode();
    } else if (request.type === 'video') {
      getVideoNode();
    }
  });

  // 获取页面的所有节点数据
  // video
  var getVideoNode = function(){
    linksArr = [];
    var videoPreUrl = 'https://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/';
    var linkOrg = {};
    var list = document.getElementsByClassName('VideoList_videoItem__+R8HI');
    
    if ( list && list.length > 0 ) {
      for (var i = 0; i < list.length; i++) {
        linkOrg = {};
        var imgSrcOriginal;
        var id = list[i].getAttribute('id');
        var imgNode = list[i].getElementsByTagName('img')[0];
        var imgSrc = imgNode.getAttribute('src');
        var imgTitle = imgNode.getAttribute('title');
        linkOrg['id'] = id;
        linkOrg['src'] = videoPreUrl + id + '.mp4';
        linkOrg['title'] = imgTitle;

        if (imgSrc.indexOf('.jpg') > 0) {
          imgSrcOriginal = imgSrc.split('.jpg')[0] + '.jpg';
        }
        if (imgSrc.indexOf('.png') > 0) {
          imgSrcOriginal = imgSrc.split('.png')[0] + '.png';
        }
        if (imgSrc.indexOf('.jpeg') > 0) {
          imgSrcOriginal = imgSrc.split('.jpeg')[0] + '.jpeg';
        }

        linkOrg['imgSrc'] = imgSrcOriginal;
        linkOrg['filename'] = imgTitle + '.mp4';
        linksArr.push(linkOrg);
      }
    }
    console.log(linksArr);
    chrome.runtime.sendMessage({'taobaoDL': {type: 'video', data: linksArr}}, function(){
      console.log('content-script-getImgNode:', '成功！');
    });
    chrome.storage.local.set({'taobaoDL': {type: 'video', data: linksArr}}, function() {
      console.log('content-StorageArea-set:', '成功！');
    })
    return linksArr;
  };
  // img
  var getImgNode = function(){
    linksArr = [];
    var imgListAll = document.getElementsByClassName('PicturesShow_PicturesShow_main-document-show__1VRbK');
    // document.getElementsByClassName('PicturesShow_PicturesShow_main-document-show__1VRbK')[4].getElementsByClassName('PicturesShow_pic_background__9vQkm')[0].getElementsByClassName('PicturesShow_pic_imgBox__dIL2f')[0].getElementsByTagName('img')[0]
    if (imgListAll && imgListAll.length > 0) {
      for (var i=0;i<imgListAll.length;i++){
        var linkOrg = {};
        var src;
        var imgOriginal;
        var title;
        var titleOriginal;
        var fileType;
        if (imgListAll[i].getElementsByClassName('PicturesShow_pic_background__9vQkm')[0] && imgListAll[i].getElementsByClassName('PicturesShow_pic_background__9vQkm')[0].getElementsByClassName('PicturesShow_pic_imgBox__dIL2f')[0] && imgListAll[i].getElementsByClassName('PicturesShow_pic_background__9vQkm')[0].getElementsByClassName('PicturesShow_pic_imgBox__dIL2f')[0].getElementsByTagName('img')[0] ) {
          src = imgListAll[i].getElementsByClassName('PicturesShow_pic_background__9vQkm')[0].getElementsByClassName('PicturesShow_pic_imgBox__dIL2f')[0] && imgListAll[i].getElementsByClassName('PicturesShow_pic_background__9vQkm')[0].getElementsByClassName('PicturesShow_pic_imgBox__dIL2f')[0].getElementsByTagName('img')[0].getAttribute('src');
          if (src.indexOf('.jpg') > 0) {
            imgOriginal = src.split('.jpg')[0] + '.jpg';
            fileType = '.jpg';
          }
          if (src.indexOf('.png') > 0) {
            imgOriginal = src.split('.png')[0] + '.png';
            fileType = '.png';
          }
          if (src.indexOf('.jpeg') > 0) {
            imgOriginal = src.split('.jpeg')[0] + '.jpeg';
            fileType = '.jpeg';
          }
          if (src.indexOf('.gif') > 0) {
            imgOriginal = src.split('.gif')[0] + '.gif';
            fileType = '.gif';
          }

          linkOrg['src'] = imgOriginal;
          linkOrg['imgSrc'] = imgOriginal;
          if (imgListAll[i].getElementsByClassName('PicturesShow_tooltipText__fE5Hl')[0]) {
            title = imgListAll[i].getElementsByClassName('PicturesShow_tooltipText__fE5Hl')[0].innerHTML;
            titleOriginal = title.split(fileType)[0];
            linkOrg['title'] = titleOriginal
            linkOrg['filename'] = titleOriginal + fileType;
          }
          linksArr.push(linkOrg);
        }
      }
    }
    chrome.runtime.sendMessage({'taobaoDL': {type: 'img', data: linksArr}}, function(){
      console.log('content-script-getImgNode:', '成功！');
    });
    chrome.storage.local.set({'taobaoDL': {type: 'img', data: linksArr}}, function() {
      console.log('content-StorageArea-set:', '成功！');
    })
    return linksArr;
  };