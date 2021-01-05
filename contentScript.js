chrome.runtime.onMessage.addListener(function (request) {
    if (request.bumpAll === "yes") {
        // Pass keepBumping boolean to bumpAll function 
        bumpAll(request.keepBumping)
    }
});

// Bumps all trades
// In case of keepBumping===true this function calls itself recursively
function bumpAll(keepBumping = false) {
    // List with Bump Buttons
    let timestamp = new Date().toLocaleTimeString();
    console.log(timestamp + ": Bumping Trades")
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
    if (keepBumping) {
        // Wait 15 minutes (and 5 seconds :D )before next bump
        setTimeout(bumpAll.bind(this, true), 905000);
    } 
}

// Add Save Button to the filter-div using the native style
let applyDiv = document.querySelector("div.rlg-trade-filter-content > form > div:nth-child(3) > div.col-1-5");
if (applyDiv) {
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
}

// Add Sidebar containing your saved searches
let sidebar = document.createElement('div');
sidebar.setAttribute('id', 'saved-searches-div');

let sidebarToggleBtn = document.createElement('Button');
sidebarToggleBtn.setAttribute('id', 'sidebar-toggle-btn');
sidebarToggleBtn.innerHTML = '&#10025';
sidebarToggleBtn.onclick = toggleSidebar;
sidebar.appendChild(sidebarToggleBtn);

let heading = document.createElement('h4');
heading.innerText = 'Saved Searches';
sidebar.appendChild(heading);


let list = document.createElement('ul');
list.setAttribute('id', 'saved-searches-list');

let toggle_edit_btn = document.createElement('button');
toggle_edit_btn.innerText = 'edit items';
toggle_edit_btn.classList.add('btn-toggle-edit');
toggle_edit_btn.onclick = function () {
    let list_items = document.querySelectorAll('#saved-searches-div .saved-search-item .btn-del');
    for (let item of list_items) {
        if (item.style.display === 'none') {
            item.style.display = 'block';
            toggle_edit_btn.innerText = 'done'
        } else {
            item.style.display = 'none'
            toggle_edit_btn.innerText = 'edit items';
        }
    }
}


sidebar.appendChild(list);
sidebar.appendChild(document.createElement('hr'));
sidebar.appendChild(toggle_edit_btn);
document.body.appendChild(sidebar)
// Fill list with saved searches
populateSavedSearches()

// Recall last state of sidebar
recallSidebarState();

// Recall which state the sidebar was in (collapsed or not) and display it that way
// If sidebarState is undefined set the value to collapsed
function recallSidebarState() {
    chrome.storage.sync.get({sidebarState: 'collapsed'}, function (result) {
        let state = result.sidebarState;
        if (state === 'collapsed') {
            let sidebarWidth = getComputedStyle(sidebar).width;
            sidebar.style.right = `-${sidebarWidth}` // the width property already contains 'px' at the end
        } else {
            sidebar.style.right = '0px'
        }
        // Before the display is none to avoid flickering on pageload
        sidebar.style.display = 'block';
    })
}

// Toggle Sidebar and put current state in chrome storage
// No default value for sidebarState needed bc this has already been checked when page was loaded 
function toggleSidebar() {
    chrome.storage.sync.get('sidebarState', function (result) {
        let state = result.sidebarState;
        if (state === 'collapsed') {
            sidebar.style.right = '0px'
            state = 'open';
        } else {
            let sidebarWidth = getComputedStyle(sidebar).width;
            sidebar.style.right = `-${sidebarWidth}` // the width property already contains 'px' at the end
            state = 'collapsed'
        }
        chrome.storage.sync.set({'sidebarState': state}, () => {})
    })
}

// Populate the list of saved searches in the sidebar
function populateSavedSearches(keepEditing = false) {
    chrome.storage.sync.get({savedSearches: {}}, function (result) {

        // Clear list before populating it again
        list.innerHTML = '';

        let searches = result.savedSearches;
        for (let id in searches) {
            // Get the search object corresponding to this id
            let search = searches[id];

            // Create an item for this serach 
            let item = document.createElement('li');
            item.classList.add('saved-search-item'); // styling in style.css

            // Add a link to this item -> for the corresponding search 
            let itemLink = document.createElement('a');
            itemLink.href = search.link;
            itemLink.innerText = search.name;
            item.appendChild(itemLink);

            // Add Delete Button for this item
            let btn_del = document.createElement('button');
            btn_del.classList.add('btn-del'); // to allow custom styling (see styles.css)
            btn_del.innerHTML = '&#10005'; // code for a cross ->  X

            // In case the call came from an item deletion we want to keep editing 
            if (keepEditing) {
                btn_del.style.display = 'block';
            } else {
                btn_del.style.display = 'none'; // hide btn by default
            }
            btn_del.onclick = deleteSearch.bind(this, search.id);
            item.appendChild(btn_del);



            // Set the id of this attribute to the id of the serach-object
            // This is used for referencing the corresponding search object in chrome storage 
            // (e.g. when deleting this item)
            item.setAttribute('id', search.id);
            list.appendChild(item);
        }
    })
}


// Save the CURRENTLY OPEN search (NOT the one that would be applied when APPLY is clicked)
// Searches are stored in an object in the chrome storage
// This object - named savedSearches - functions like a dictionary with:
//     key: id
//     value: {id: _, name: _, link: _}
function saveSearch(e) {
    e.preventDefault();
    let search = {}
    search.id = Date.now() // generate uid - that it's guessable isn't important for this application 
    let item = document.querySelector("#filterItem_chosen > a > span").innerText;
    let colour = document.querySelector("#filterPaint_chosen > a > span").innerText;
    search.name = `${colour} ${item}`
    search.link = window.location.href;

    // Idea for following code taken from https://stackoverflow.com/questions/16605706/store-an-array-with-chrome-storage-local
    // By passing an object you can define default values e.g.: []
    chrome.storage.sync.get({savedSearches: {}}, function (result) {
        let searches = result.savedSearches;
        searches[search.id] = search;
        chrome.storage.sync.set({savedSearches: searches}, () => {
            populateSavedSearches();
            alert('Search successfully saved :)');
        })
    });
}

// Remove the saved search with the given id from chrome storage
function deleteSearch(id) {
    chrome.storage.sync.get({savedSearches: {}}, function (result) {
        let searches = result.savedSearches;
        delete searches[id];
        chrome.storage.sync.set({savedSearches: searches}, () => {
            populateSavedSearches(true);
        })
    })
}
