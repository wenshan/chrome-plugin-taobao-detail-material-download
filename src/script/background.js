'use strict';
// 加载完成
chrome.runtime.onInstalled.addListener(function () {
  console.log('加载完成');
  // 获取当前tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabId){
    console.log('tabId_onInstalled:', tabId);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // 获取当前tab
  if (request.type == 'img' || request.type == 'video') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
      console.log('tabId_addListener:', tabs);
      tabs && tabs.length > 0 && chrome.tabs.sendMessage(tabs[0].id, request, function(res){
        console.log(tabs[0].id, request);
        console.log('res:', res);
      });
    });
  }
});

chrome.storage.local.onChanged.addListener(function (data){
  console.log('backgroud-storage-onChanged:', data);
});