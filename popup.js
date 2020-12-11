let changeColor = document.getElementById('changeColor');
let openRLTrade = document.getElementById('openRLTrade');

chrome.storage.sync.get('color', function (data) {
    //changeColor.style.backgroundColor = data.color;
    //changeColor.setAttribute('value', data.color);
});

openRLTrade.onclick = function (element) {
    let newURL = "https://rocket-league.com/trading";
    chrome.tabs.create({url: newURL});
}

changeColor.onclick = function (element) {
    let user = "trade4thewin" // currently hardcoded
    let newURL = "https://rocket-league.com/trades/" + user;

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.update(tabs[0].id, {url: newURL}, function (tab) {
            // Once URL is update, send the message to bump all
            chrome.tabs.onUpdated.addListener( function listener(tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.tabs.sendMessage(tab.id, {bumpAll: "yes"});
                }
            });
        });
    });
};


