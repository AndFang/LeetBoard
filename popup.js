// FUNCTIONS
function toast(account) {
    const toast = document.getElementById('toast');
    const toastBody = toast.querySelector('.toast-body');

    fetch("https://leetcode.com/" + account)
    .then(response => {
        if (!response.ok || account == "") {
            toastBody.style.backgroundColor = "lightcoral";
            switch (response.status) {
                case 404:
                    toastBody.innerHTML = "Cannot find account \"" + account + "\"";
                    break;
                case 429:
                    toastBody.innerHTML = "Too many requests. Please try again later.";
                    break;
                case 200:
                    toastBody.innerHTML = "Please enter an account name.";
                    break;
                default:
                    toastBody.innerHTML = "Error " + response.status + ". Please try again later.";
                    break;
            }
        }
        else {
            toastBody.style.backgroundColor = "lightgreen";
            toastBody.innerHTML = "You are now following \"" + account + "\"!";
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
    const popup = document.querySelector('body');
    const screenHeight = window.screen.height;

    const popupWidth = screenHeight * 0.4;
    const popupHeight = popupWidth * 1.618;

    popup.style.width = popupWidth + 'px';
    popup.style.height = popupHeight + 'px';

    let loggedIn = false;
    chrome.cookies.getAll({"url": "https://www.leetcode.com/problemset/all/"})
    .then(data => {
        data.forEach(element => {
            if (element["name"] == "LEETCODE_SESSION") {
                loggedIn = true;
            }
        });
    });

    setTimeout(function() {
        if (loggedIn) {
            document.getElementById('loginTrue').style.display = "flex";
            document.getElementById('loginFalse').style.display = "none";

        }
        else {
            document.getElementById('loginTrue').style.display = "none";
            document.getElementById('loginFalse').style.display = "flex";
        }
    }, 10);
}

// ON STARTUP
document.addEventListener('DOMContentLoaded', setUp);

// BUTTON ACTIONS
document.getElementById('add-follow').addEventListener('click', function() {
    let account = document.getElementById('account').value;
    toast(account);
});
document.getElementById('leetcode-problems').addEventListener('click', function() {
    chrome.tabs.create({ url: "https://leetcode.com/problemset/all/" });
});
document.getElementById('leetcode-login').addEventListener('click', function() {
    chrome.tabs.create({ url: "https://leetcode.com/accounts/login/" });
});
document.querySelector('#toggle-mode-button1').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('#toggle-mode-button1').textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});
document.querySelector('#toggle-mode-button2').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('#toggle-mode-button2').textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});