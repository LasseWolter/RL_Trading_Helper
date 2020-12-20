// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//chrome.runtime.onInstalled.addListener(function() {
//});

// Allows every js-script in extension to display desktop notifications
// Type of the message needs to be 'notification' and the options for 
// the notification are set in the options field. 
// EXAMPLE
// chrome.runtime.sendMessage('', {
//    type: 'notification',
//    options: {
//        title: 'Username successfully update',
//        message: 'New Username: ' + uname,
//        iconUrl: 'images/rl_icon_100.png',
//         type: 'basic'
//     }
// });
chrome.runtime.onMessage.addListener( data => {
    if (data.type === 'notification') {
        chrome.notifications.create('', data.options);
    }
});
