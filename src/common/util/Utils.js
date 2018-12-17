//check whether an obj is number.
import {startWith} from "../filter/str";

export function isInteger(obj) {
  return typeof obj === 'number' && obj % 1 === 0
}

export function isAndroid() {
  let u = navigator.memberAgent;


  //android终端
  return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;

}

export function isIOS() {
  let u = navigator.memberAgent;

  //ios终端
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}


//判断当前是否是微信浏览器
export function isWeixinBrowser() {
  let ua = navigator.userAgent.toLowerCase();
  if (ua) {
    if (ua.toLowerCase().indexOf("micromessenger") !== -1) {
      return true;
    }
  }
}

//判断当前是否是往测试数据库写内容
export function isProductionEnv() {
  let host = window.location.host;
  return startWith(host, "erhua.howimetmrright.com");
}

//check whether an obj is empty
export function isEmptyObject(obj) {

  for (let key in obj) {
    return false;
  }
  return true
}


//两个id是否相等
export function isIdEqual(id1, id2) {

  return (id1 + "") === (id2 + "");


}

export function isLocalStorageNameSupported() {
  let testKey = 'test';
  let storage = window.localStorage;
  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}


export function readLocalStorage(key) {
  if (isLocalStorageNameSupported()) {
    return window.localStorage[key];
  } else {
    console.error("not support localStorage.");
    return null;
  }
}

export function saveToLocalStorage(key, content) {
  if (isLocalStorageNameSupported()) {
    window.localStorage[key] = content;
  } else {
    console.error("not support localStorage.");
  }
}

export function removeLocalStorage(key) {
  if (isLocalStorageNameSupported()) {
    window.localStorage.removeItem(key);
  } else {
    console.error("not support localStorage.");
  }
}


//获取一个function的名字
export function functionName(func) {
  // Match:
  // - ^          the beginning of the string
  // - function   the word 'function'
  // - \s+        at least some white space
  // - ([\w\$]+)  capture one or more valid JavaScript identifier characters
  // - \s*        optionally followed by white space (in theory there won't be any here,
  //              so if performance is an issue this can be omitted[1]
  // - \(         followed by an opening brace
  //
  let result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString())

  return result ? result[1] : '' // for an anonymous function there won't be a match
}

/*
高亮部分文字

DEMO:
document.getElementById("setSelection").onmousedown = function() {
    var input = document.getElementById("i");
    setInputSelection(input, 4, 7);
    return false;
};

<input id="i" type="text" value="One two three">
<input type="button" value="Set selection" id="setSelection">
 */
export function setInputSelection(input, startPos, endPos) {
  input.focus();
  if (typeof input.selectionStart !== "undefined") {
    input.selectionStart = startPos;
    input.selectionEnd = endPos;
  } else if (document.selection && document.selection.createRange) {
    // IE branch
    input.select();
    let range = document.selection.createRange();
    range.collapse(true);
    range.moveEnd("character", endPos);
    range.moveStart("character", startPos);
    range.select();
  }
}

//在字符串a后面追加字符串b
export function appendString(a, b, seperator = "") {

  if (a === null || typeof a !== "string") {
    return b;
  } else {
    return a + seperator + b;
  }
}

//获取当前的host
export function currentHost() {
  return window.location.protocol + "//" + window.location.host;
}


//调用某个函数，安全的调用
export function safeCallback(callback) {
  if (typeof callback === "function") {
    return callback
  } else {
    return function () {
    }
  }
}

//https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
// Opera 8.0+
export function isOpera() {
  return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

}

// Firefox 1.0+
export function isFirefox() {
  return typeof InstallTrigger !== 'undefined';
}

// Safari 3.0+ "[object HTMLElementConstructor]"
export function isSafari() {
  return /constructor/i.test(window.HTMLElement) || (function (p) {
    return p.toString() === "[object SafariRemoteNotification]";
  })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

}

// Internet Explorer 6-11
export function isIE() {
  return /*@cc_on!@*/false || !!document.documentMode;
}

// Edge 20+
export function isEdge() {
  return !isIE() && !!window.StyleMedia;
}

// Chrome 1+
export function isChrome() {
  return !!window.chrome && !!window.chrome.webstore;
}

// Blink engine detection
export function isBlink() {
  return (isChrome() || isOpera()) && !!window.CSS;
}
