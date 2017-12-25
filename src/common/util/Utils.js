//check whether an obj is number.
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
