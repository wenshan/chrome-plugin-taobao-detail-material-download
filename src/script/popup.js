'use strict';

  var links = '';
  var linksArr = [];
  var linkOrg = {};
  var html = '无数据';
  var linkType = 'video';
  var downloadId = '#download';
  var selectimgId = '#selectimg';
  var selectvideoId = '#selectvideo';

  // 获取传单SRC
  function showLinks (request) {
    var tx = '';
    linkType = request && request.taobaoDL && request.taobaoDL.type;

    var data = request && request.taobaoDL && request.taobaoDL.data;

    if ( linkType == 'video') {
      tx = '视频' + data.length;
    } else {
      tx = '图片' + data.length;
    }

    if (data && data.length > 0) {
      $(data).each(function(index, item){
        html= html + '<tr class="list" data-src="'+ item.src +'" data-filename="'+ item.filename +'"><td><input type="checkbox" checked="false" id=checkbox_'+ index +'></td><td class="imgbox"><img src='+ item.imgSrc +'></img</td><td class="title">'+ item.title +'</td><td><span class="copylink">copy链接</span></td></tr>';
      });

    } else {
      html = '<tr class="list"><td>无数据</td></tr>';
    }

    $('#links').find('tr').remove('.list');
    $('#links').find('tr').after(html);
    $('#popupLinks').find('h3').html(tx);
  }
  // 下载图片
  function downloadCheckedLinks() {
    // 收件所有的选择checked的src
    var downloadSrc = [];
    $('#links').find("input:checked").parent().parent().each(function(index, item){
      var obj = {};
      var src = $(item).attr('data-src');
      obj['url'] = src;
      obj['filename'] = $(item).attr('data-filename');
      if (src) {
        downloadSrc.push(obj);
      }
    });

    // 执行下载
    $(downloadSrc).each(function(index, item){
      chrome.downloads.download(item, function(id) { 
        console.log('第'+ index + '文件下载完成:' + item.filename);
      });
      if (downloadSrc.length == (index + 1)) {
        alert('下载'+ downloadSrc.length +'个文件完成');
      }
    });
  }

  window.onload = function() {
    console.log('onload');
    chrome.runtime.sendMessage({type: 'refresh'});
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log('popup sender:', sender);
      if (request && request.taobaoVideo) {
        console.log('popup-video', request);
        sendResponse(true);
      }
      if (request && request.taobaoDetail) {
        console.log('popup-img', request);
        // showLinks(request);
        sendResponse(true);
      } else {
        alert('无数据');
      }
    });

    $('#download').click(function(){
      downloadCheckedLinks();
    });
  }

  // background.js
chrome.action.onClicked.addListener((tab) => {
  debugger;
  console.log('Hello, world!');
});