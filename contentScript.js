console.log("content script landed");

chrome.runtime.onMessage.addListener(function (request) {
    if (request.bumpAll === "yes") {
        console.log('received request to bump');
        // List with Bump Buttons
        let queryString = ".rlg-trade__action.rlg-trade__bump.--bump "
        let bumpBtns = document.querySelectorAll(queryString);
        // Return if there are no such buttons and show dialog to user
        if (bumpBtns.length <= 0) {
            window.alert("Bump Failed.\nEither you don't have any trades or you are not logged in");
            return;
        }

        // If there are buttons, click all of them to bump all
        for (let btn of bumpBtns) {
            btn.click()
        }
    }
});

let sidebar = document.createElement('div');
sidebar.setAttribute('id', 'saved-searches-div');
let heading = document.createElement('h4');
heading.innerText = 'Saved Searches';
sidebar.appendChild(heading);

let list = document.createElement('ul');
sidebar.appendChild(list);
document.body.appendChild(sidebar)

let searches = [];
chrome.storage.sync.get({savedSearches: []}, function (result) {
    searches = result.savedSearches;
    for (let search of searches) {
        let item = document.createElement('li');
        let itemLink = document.createElement('a');
        itemLink.href = search.link;
        itemLink.innerText = search.name;
        item.appendChild(itemLink);
        list.appendChild(item);
    }
})



let applyDiv = document.querySelector("div.rlg-trade-filter-content > form > div:nth-child(3) > div.col-1-5");
// Change 1/5 width of one button into 2 buttons with width 1/8 and 1/12
// Explanation: 1/5(5/25) is roughly equal to 1/12+1/8 (5/24), so the space will be used well
applyDiv.classList.add('col-1-8'); // to make width 1/8
let saveDiv = applyDiv.cloneNode(true);  // deep clone to also clone the btn within the div
saveDiv.style.width = "calc(100%/12)" // to make width 1/12

let saveBtn = saveDiv.firstElementChild;
saveBtn.innerText = 'Save';
saveBtn.href = 'google.com';
saveBtn.onclick = saveSearch;

saveDiv.appendChild(saveBtn);
applyDiv.parentNode.appendChild(saveDiv);

function saveSearch(e) {
    e.preventDefault();
    let search = {}
    search.name = 'test';
    search.link = window.location.href;

    // Idea for following code taken from https://stackoverflow.com/questions/16605706/store-an-array-with-chrome-storage-local
    // By passing an object you can define default values e.g.: []
    chrome.storage.sync.get({savedSearches: []}, function (result) {
        let savedSearches = result.savedSearches;
        savedSearches.push(search);
        chrome.storage.sync.set({savedSearches: savedSearches}, () => {
            console.log('saved');
            alert('saved');
        })
    });
}
