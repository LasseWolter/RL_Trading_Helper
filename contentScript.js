console.log("content script landed");

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
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
