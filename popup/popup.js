let USER = "";
let FOLLOWS = [];

// FUNCTIONS
function _userProfile(name, url) {
    const user = document.createElement('div');
    user.classList.add('user');

    const userImg = document.createElement('img');
    userImg.src = url;
    userImg.style.borderRadius = "50%";

    const userName = document.createElement('a');
    userName.href = "https://leetcode.com/" + name;
    userName.onclick = function() {
        chrome.tabs.create({ url: "https://leetcode.com/" + name });
    }
    userName.innerHTML = name;

    const trashcan = document.createElement('button');
    const trashcanImg = document.createElement('img');
    trashcanImg.src = "../assets/trashcan.png";
    trashcanImg.classList.add('trashcan');
    trashcan.appendChild(trashcanImg);
    trashcan.addEventListener('click', function() {
        user.remove();
        FOLLOWS = FOLLOWS.filter((b) => b[0] != name);
        chrome.storage.sync.set({ [USER]: JSON.stringify(FOLLOWS) });
    });

    user.appendChild(userImg);
    user.appendChild(userName);
    user.appendChild(trashcan);

    return user;
}
function toast(account) {
    account = account.toLowerCase();
    const toast = document.getElementById('toast');
    const toastBody = toast.querySelector('.toast-body');

    fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `
        query {
            matchedUser(username: "` + account + `") {
                profile {
                    userAvatar
                }
            }
        }
        ` 
    }),
    })
    .then(res => {return res.json()})
    .then(response => {
        if (response['data']['matchedUser'] == null || account == "") {
            toastBody.style.backgroundColor = "lightcoral";
            toastBody.innerHTML = "Cannot find account \"" + account + "\"";
        }
        else {
            if (account == USER.toLowerCase()) {
                toastBody.style.backgroundColor = "lightcoral";
                toastBody.innerHTML = "You cannot follow yourself!";
                return;
            }
            else if (FOLLOWS.filter((b) => b[0] == account).length > 0) {
                toastBody.style.backgroundColor = "lightcoral";
                toastBody.innerHTML = "You are already following \"" + account + "\"!";
                return;
            }
            else {
                toastBody.style.backgroundColor = "lightgreen";
                toastBody.innerHTML = "You are now following \"" + account + "\"!";
                return response['data']['matchedUser']['profile']['userAvatar'];
            }
        }
    })
    .then(data => {
        if (data) {
            FOLLOWS.push([account, data]);
            chrome.storage.sync.set({ [USER]: JSON.stringify(FOLLOWS) });
            display('following');
        }
    });
    
    setTimeout(function() {
        toast.style.opacity = 1;
    }, 100);
    setTimeout(function() {
        toast.style.opacity = 0;
    }, 3000);
}
function setUp() {
    chrome.runtime.sendMessage({'popupIsOpen': true});
    chrome.storage.sync.get(['user'], (obj) => {
        USER = obj['user'];
    });

    const popup = document.querySelector('body');
    const screenHeight = window.screen.height;

    const popupWidth = screenHeight * 0.4;
    const popupHeight = Math.min(512, popupWidth * 1.618);

    popup.style.width = popupWidth + 'px';
    popup.style.height = popupHeight + 'px';

    chrome.storage.sync.get(['loggedIn'], (obj) => {
        if (obj['loggedIn']) {
            document.getElementById('loginTrue').style.display = "flex";
            document.getElementById('loginFalse').style.display = "none";
        }
        else {
            document.getElementById('loginTrue').style.display = "none";
            document.getElementById('loginFalse').style.display = "flex";
        }
    });

    chrome.storage.sync.get(['dark-mode'], (obj) => {
        if (obj['dark-mode'] == "true") {
            darkMode();
        }
    });

    document.querySelector('.btn').classList.add('selected');

    setTimeout(function() {
        chrome.storage.sync.get([USER], (obj) => {
            FOLLOWS = obj[USER] ? JSON.parse(obj[USER]) : [];
            display('following');
        });
    }, 10);
    
}
function darkMode() {
    document.body.classList.toggle('dark-mode');
    const darkMode = document.body.classList.contains('dark-mode');
    document.querySelector('#toggle-mode-button1').textContent = darkMode ? 'Light Mode' : 'Dark Mode';
    document.querySelector('#toggle-mode-button2').textContent = darkMode ? 'Light Mode' : 'Dark Mode';
    chrome.storage.sync.set({ ['dark-mode']: JSON.stringify(darkMode) });
}
function display(selected) {
    const display = document.querySelector('.display');

    switch (selected) {
        case 'following':
            display.innerHTML = '';

            FOLLOWS.forEach(element => {
                display.appendChild(_userProfile(element[0], element[1]));
            });
            
            document.querySelector('.selected').classList.remove('selected');
            document.querySelector('.btn').classList.add('selected');

            break;
        case 'friends':
            display.innerHTML = 'TODO: FRIENDS FEATURE COMING SOON';
            break;
        case 'requests':
            display.innerHTML = 'TODO: REQUESTS FEATURE COMING SOON';
            break;
    };

}

// ON STARTUP
document.addEventListener('DOMContentLoaded', setUp);

// BUTTON ACTIONS
document.getElementById('add-follow').addEventListener('click', function() {
    toast(document.getElementById('account').value);
    document.getElementById('account').value = "";
});
document.getElementById('leetcode-problems').addEventListener('click', function() {
    chrome.tabs.create({ url: "https://leetcode.com/problemset/all/" });
});
document.getElementById('leetcode-profile').addEventListener('click', function() {
    chrome.tabs.create({ url: "https://leetcode.com/" + USER });
});
document.getElementById('leetcode-login').addEventListener('click', function() {
    chrome.tabs.create({ url: "https://leetcode.com/accounts/login/" });
});
document.getElementById('about').addEventListener('click', function() {
    chrome.tabs.create({ url: "https://github.com/AndFang/LeetBoard" });
});
document.getElementById('info').addEventListener('click', function() {
    chrome.tabs.create({ url: "https://github.com/AndFang/LeetBoard/wiki" });
});
document.querySelector('#toggle-mode-button1').addEventListener('click', () => {
    darkMode();
});
document.querySelector('#toggle-mode-button2').addEventListener('click', () => {
    darkMode();
});
document.querySelectorAll('.btn').forEach(btnEl => {
    btnEl.addEventListener('click', () => {
        document.querySelector('.selected').classList.remove('selected');
        btnEl.classList.toggle('selected');

        display(btnEl.id);
    });
});