let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function (element) {
    chrome.tabs.query({active: true, currentWindow: true},  function(tabs) {
      console.log("hello");
      newUrl = "https://rocket-league.com/trading?filterItem=661&filterCertification=0&filterPaint=0&filterMinCredits=0&filterMaxCredits=100000&filterPlatform%5B%5D=2&filterSearchType=2&filterItemType=2"
      chrome.tabs.update(tabs[0].id, {url: newUrl});   
      //chrome.tabs.sendMessage(tabs[0].id, {greeting:"hello"});
    });
};


