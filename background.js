const leetcode = 'https://leetcode.com'
const problems = 'https://leetcode.com/problems'

const State = {'Inactive': 0, 'Active': 1, 'Session': 2 };

const changeBadge = async (tab) => {
    var state = State.Inactive;
    chrome.action.setBadgeText({
        text: ' '
    });

    if (tab.url) {
        if (tab.url.includes(problems) && !tab.url.includes('problemset/all')) {
            const problem = tab.url.split('/')[4];
            state = State.Session;
        }
        else if (tab.url.includes(leetcode)) {
            state = State.Active;
        }

        switch (state) {
            case State.Inactive:
                chrome.action.setBadgeBackgroundColor({
                    color: 'yellow'
                });
                break;
            case State.Active:
                chrome.action.setBadgeBackgroundColor({
                    color: 'green'
                });
                break;
            case State.Session:
                chrome.action.setBadgeBackgroundColor({
                    color: 'red'
                });
                break;
        }
    }
};

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    changeBadge(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [t] = await chrome.tabs.query(queryOptions);

    if (t.id === tabId)
    {
        changeBadge(tab);
    }
});

function setUpPopup() {
    let user = "";
    let loggedIn = false;
    chrome.cookies.getAll({"url": "https://www.leetcode.com/problemset/all/"})
    .then(data => {
        data.forEach(element => {
            if (element["name"] == "LEETCODE_SESSION") {
                loggedIn = true;

                fetch("https://leetcode.com/")
                .then(response => {
                    return response.text();
                })
                .then(data => {
                    ind = data.indexOf('username');
                    user1 = data.indexOf('\'', ind);
                    user2 = data.indexOf('\'', user1 + 1);
                    user = data.substring(user1 + 1, user2);
                });
            }
        });
    });

    setTimeout(function() {
        chrome.storage.sync.set({ ['loggedIn']: loggedIn });
        chrome.storage.sync.set({ ['user']: user });
    }, 1000);
}

setUpPopup();

chrome.runtime.onMessage.addListener(function(message, sender) {
    if(message.popupIsOpen) {
        setUpPopup();
    }
});