document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('checkPage');
    var copyButton = document.getElementById('copy');
    checkPageButton.addEventListener('click', function () {
        init();
    }, false);
    copyButton.addEventListener('click', function () {
        copyToClipboard();
    }, false);
    init();
}, false);

function init() {
    chrome.tabs.getSelected(null, function (tab) {
        let target = tab.url.split("/site")[0];
        document.getElementById("target").innerHTML = target;
        getCookiesAndPopulate(tab.url, "ucn");
        getCookiesAndPopulate(tab.url, "XSRF-TOKEN");
        getCookiesAndPopulate(tab.url, "JSESSIONID");
    });
}
function getCookiesAndPopulate(url, id) {
    getCookies(url, id, function (value) {
        if (value) {
            document.getElementById("cookies").style.display = 'block';
            document.getElementById("empty").style.display = 'none';
            document.getElementById(id).innerHTML = value;
        } else {
            document.getElementById("cookies").style.display = 'none';
            document.getElementById("empty").style.display = 'block';
        }
    });
}

function getCookies(domain, name, callback) {
    chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
        if (callback && cookie) {
            callback(cookie.value);
        } else if (callback && !cookie) {
            callback(null)
        }
    });
}

function copyToClipboard(){
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = document.getElementById("cookies").innerText;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
}
