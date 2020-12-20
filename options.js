sbmtUname = document.getElementById('sbmt-uname');

sbmtUname.onclick = function updateUsername() {
    let uname = document.getElementById('uname-input').value;
    if (uname) {
        chrome.storage.sync.set({'username': uname}, function () {
            console.log('New Username is: ' + uname);
            showNotification();
        });
    }
}

function showNotification() {
    var el = document.getElementById("noti");
    el.style.display = 'block';
    setTimeout(() => {el.style.display = 'none'}, 1500);
}
