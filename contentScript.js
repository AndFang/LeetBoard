(() => {
    const problem = document.location.href.split('/')[4];

    const fetchFriendList = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([problem], (obj) => {
                resolve(obj[problem] ? JSON.parse(obj[problem]) : []);
            });
        });
    };

    const addFriendList = () => {

    };

    const temp = fetchFriendList();

    console.log(problem);
    console.log(temp);
})();