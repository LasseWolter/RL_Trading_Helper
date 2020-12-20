let UNAME = "" // holding the username of the user

let openRLTrade = document.getElementById('openRLTrade');
openRLTrade.onclick = function () {
    let newURL = "https://rocket-league.com/trading";
    chrome.tabs.create({url: newURL});
}

let bumpAll = document.getElementById('bumpAll');
bumpAll.onclick = function () {
    let user = '';
    chrome.storage.sync.get(['username'], function (result) {
        if (result.username) {
            user = result.username;
        } else {
            alert('Please set your username on the options page')
        }

        let newURL = "https://rocket-league.com/trades/" + user;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.update(tabs[0].id, {url: newURL}, function (tab) {
                // Once URL is update, send the message to bump all
                chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                    if (info.status === 'complete' && tabId === tab.id) {
                        chrome.tabs.onUpdated.removeListener(listener);
                        chrome.tabs.sendMessage(tab.id, {bumpAll: "yes"});
                    }
                });
            });
        });
    });
};

let optionsLink = document.getElementById('options-link');
optionsLink.onclick = function () {
    chrome.tabs.create({'url': "/options.html" } )

}

function updateUname() {
    chrome.storage.sync.get('username', (res) => {
        if (res.username) {
            UNAME = res.username;
        }
        document.getElementById('uname-span').innerText = UNAME;
    });
}

updateUname();
