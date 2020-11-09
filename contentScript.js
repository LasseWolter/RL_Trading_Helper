console.log("content script landed");

chrome.runtime.onMessage.addListener(
  function(request,_, sendResponse) {
    if (request.greeting === "hello") {
      console.log('received message');
      //sendResponse({farewell: "goodbye"});
    } 
  });
