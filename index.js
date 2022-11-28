// AK's utils
// things to make things ... easier
const path = require('path');
const fs = require('fs').promises;
const { existsSync, mkdirSync } = require('fs');
const readline = require('readline');
const http = require("https");
const os = require("os");

/*
-----------
NAMESPACES
-----------
*/

/**
 * file management utilities 
 * @namespace files
*/

/**
 * data validation utilities
 * @namespace validation
*/

/**
 * display, formatting, and other "make it look right" utilities
 * @namespace display
*/

/**
 * functions for maths, crypto, and calculations
 * @namespace calculations
*/

/**
 * object utilities
 * @namespace objects
*/

/**
 * array utilities
 * @namespace arrays
*/

/**
 * function utilities 
 * @namespace functions
*/

/**
 * logging, timers and other diagnostic utilities
 * @namespace logging
*/

/*
------
FILES
------
*/

/** 
 * list directory contents
 * @memberof files
 * @param  {string} [dir="./"] - directory to enumerate; default `./`
 * @param  {boolean} [objectMode=false] - return `{name: path}` instead of `[path]`; default `false`
 * @returns {Promise<any>} `[]` of files in folder
 */
exports.ls = async function listFiles(dir = "./", objectMode = false) {
	let fileList = await fs.readdir(dir);
	if (!objectMode) {
		return fileList.map(fileName => path.resolve(`${dir}/${fileName}`));
	}
	let results = {};
	for (const fileName of fileList) {
		// let keyName = fileName.split('.')
		results[fileName] = path.resolve(`${dir}/${fileName}`);
	}
	return results;
};

/**
 * remove a file or directory
 * @memberof files
 * @param  {string} fileNameOrPath - file or path to be removed
 * @returns {(Promise<string|boolean|void>)} path or `false` if fail
 */
exports.rm = async function removeFileOrFolder(fileNameOrPath) {
	let fileRemoved;
	try {
		fileRemoved = await fs.unlink(path.resolve(fileNameOrPath));
	} catch (e) {
		try {
			fileRemoved = await fs.rm(path.resolve(fileNameOrPath), { recursive: true, force: true });
		} catch (e) {
			console.error(`${fileNameOrPath} not removed!`);
			console.error(e);
			return false;
		}
	}

	return fileRemoved;
};

/**
 * create a file
 * @memberof files
 * @param  {string} fileNameOrPath - file to create
 * @param  {string} [data=""] - data to write; default `""`
 * @param  {boolean} [isJson=false] - is `data` JSON; default `false`
 * @returns {(Promise<string | false>)} the name of the file
 */
exports.touch = async function addFile(fileNameOrPath, data = "", isJson = false) {
	let fileCreated;
	let dataToWrite = isJson ? exports.json(data) : data;

	try {
		fileCreated = await fs.writeFile(path.resolve(fileNameOrPath), dataToWrite, 'utf-8');
	} catch (e) {
		console.error(`${fileNameOrPath} not created!`);
		console.error(e);
		return false;
	}

	return path.resolve(fileNameOrPath);

};

/**
 * load a filed into memory
 * @memberof files
 * @param  {string} fileNameOrPath - file to create
 * @param  {boolean} [isJson=false] - is `data` JSON; default `false`
 * @param {string} [encoding=utf-8] - file encoring; default `utf-8`
 */
exports.load = async function loadFile(fileNameOrPath, isJson = false, encoding = 'utf-8') {
	let fileLoaded;

	try {
		// @ts-ignore
		fileLoaded = await fs.readFile(path.resolve(fileNameOrPath), encoding);
	} catch (e) {
		console.error(`${fileNameOrPath} not loaded!`);
		console.error(e);
	}

	if (isJson) {
		// @ts-ignore
		fileLoaded = JSON.parse(fileLoaded);
	}

	return fileLoaded;
};

/**
 * make a directory
 * @memberof files
 * @param  {string} [dirPath="./tmp"] - path to create; default `./tmp`
 */
exports.mkdir = function (dirPath = `./tmp`) {
	let fullPath = path.resolve(dirPath);
	!existsSync(fullPath) ? mkdirSync(fullPath) : undefined;
	return fullPath;
};

/*
-----------
VALIDATION
-----------
*/

/**
 * test if `string` has JSON structure; if `true` it can be safely parsed
 * @memberof validation
 * @param  {string} string
 * @returns {boolean}
 */
exports.isJSONStr = function hasJsonStructure(string) {
	if (typeof string !== 'string') return false;
	try {
		const result = JSON.parse(string);
		const type = Object.prototype.toString.call(result);
		return type === '[object Object]' ||
			type === '[object Array]';
	} catch (err) {
		return false;
	}
};

/**
 * test if `data` can be stringified as JSON
 * @memberof validation
 * @param  {string | JSON} data
 * @returns {boolean}
 */
exports.isJSON = function canBeStrinigified(data) {
	try {
		let attempt = JSON.stringify(data);
		if (attempt?.startsWith('{') || attempt?.startsWith('[')) {
			if (attempt?.endsWith('}') || attempt?.endsWith(']')) {
				return true;
			}
			else {
				return false;
			}
		}

		else {
			return false;
		}

	}

	catch (e) {
		return false;
	}
};

/**
 * check if a `type` matches a `value`
 * @memberof validation
 * @param  {any} type - a native type like `Number` or `Boolean`
 * @param  {any} val - any value to check
 * @returns {boolean}
 */
exports.is = function isPrimiativeType(type, val) {
	if (typeof type === 'string') {
		return typeof val === type;
	}
	return ![, null].includes(val) && val.constructor === type;
};

/**
 * check if a `val` is `null` or `undefined`
 * @memberof validation
 * @param  {any} val - value to check
 * @returns {boolean}
 */
exports.isNil = function isNullOrUndefined(val) {
	return val === undefined || val === null;
};

/*
-------
DISPLAY
-------
*/

/**
 * turn a number into a comma separated value; `1000` => `"1,000"`
 * @memberof display
 * @param  {(string | number)} num
 * @returns {string} formatted number 
 */
exports.comma = function addCommas(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * truncate a string; using an elipses (`...`)
 * @memberof display
 * @param  {string} text - text to truncate
 * @param  {number} chars=500 - # of max characters
 * @param  {boolean} [useWordBoundary=true] - don't break words; default `true`
 * @returns {string} truncated string
 * 
 */
exports.truncate = function intelligentlyTruncate(text, chars = 500, useWordBoundary = true) {
	if (!text) {
		return "";
	}
	if (text.length <= chars) {
		return text;
	}
	var subString = text.substr(0, chars - 1);
	return (useWordBoundary ?
		subString.substr(0, subString.lastIndexOf(' ')) :
		subString) + "...";
};

/**
 * turn a number (of bytes) into a human readable string
 * @memberof display
 * @param  {number} bytes - number of bytes to convert
 * @param  {boolean} [si=false] - threshold of 1000 or 1024; default `false`
 * @param  {number} [dp=2] - decmimal points; default `2`
 * @returns {string} # of bytes
 */
exports.bytesHuman = function (bytes, si = false, dp = 2) {
	//https://stackoverflow.com/a/14919494
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}

	const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** dp;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


	return bytes.toFixed(dp) + ' ' + units[u];
};

/** stringify object to json
 * @memberof display
 * @param  {object} data - any serializable object
 * @param  {number} [padding=2] - padding to use
 * @returns {string} valid json
 */
exports.json = function stringifyJSON(data, padding = 2) {
	return JSON.stringify(data, null, padding);
};

/**
 * strip all `<html>` tags from a string
 * @memberof display
 * @param  {string} str string with html tags
 * @returns {string} sanitized string
 * @note note: `<br>` tags are replace with `\n`
 */
exports.stripHTML = function removeHTMLEntities(str) {
	return str.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]*>?/gm, '');
};

/**
 * find and replace _many_ values in string
 * @memberof display
 * @param  {string} str - string to replace
 * @param  {Array[]} [replacePairs=[["|"],["<"],[">"]]] shape: `[ [old, new] ]`
 * @returns {string} multi-replaced string
 */
exports.multiReplace = function (str, replacePairs = [
	["|"],
	["<"],
	[">"]
]) {
	let text = str;
	for (const pair of replacePairs) {
		// @ts-ignore
		text = text?.replaceAll(pair[0], pair[1] || " ");
	}

	//kill multiple spaces
	return text.split(" ").filter(x => x).join(" ");
};

/**
 * replace all occurance of `old` with `new`
 * @memberof display
 * @param  {(string | RegExp)} oldVal - old value
 * @param  {(string)} newVal - new value
 * @returns {string} replaced result 
 * @note this can't be called on any string directly
 */
exports.replaceAll = function (oldVal, newVal) {

	// If a regex pattern
	if (Object.prototype.toString.call(oldVal).toLowerCase() === '[object regexp]') {
		return this.replace(oldVal, newVal);
	}

	// If a string
	return this.replace(new RegExp(oldVal, 'g'), newVal);

};

/**
 * convert array of arrays to CSV like string
 * @memberof display
 * @param  {Array[]} arr - data of the form `[ [], [], [] ]`
 * @param  {String[]} [headers=[]] - header column 
 * @param  {string} [delimiter=","] - delimeter for cells; default `,`
 * @returns {string} a valid CSV
 */
exports.toCSV = function arrayToCSV(arr, headers = [], delimiter = ',') {
	if (!delimiter) {
		delimiter = `,`;
	}
	let body = arr.map(v => v.map(x => `"${x}"`).join(delimiter)).join('\n');
	if (headers) {
		const topRow = headers.map(x => `"${x}"`).join(delimiter);
		body = `${topRow}\n${body}`;
	}

	return body;
};

/*
------------
CALCULATIONS
------------
*/

/**
 * duplicate values within an array N times
 * @memberof calculations
 * @param  {any[]} array - array to duplicate
 * @param  {number} [times=1] -  number of dupes per item
 * @returns {any[]} duplicated array
 */
exports.dupeVals = function duplicateArrayValues(array, times = 1) {
	let dupeArray = [];

	for (let i = 0; i < times + 1; i++) {
		array.forEach(item => dupeArray.push(item));
	}

	return dupeArray;
};

/**
 * random integer between `min` and `max` (inclusive)
 * @memberof calculations
 * @param  {number} min=1 - minimum
 * @param  {number} max=100 - maximum
 * @returns {number} random number
 */
exports.rand = function generateRandomNumber(min = 1, max = 100) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * calculate average of `...nums`
 * @memberof calculations
 * @param  {...number} nums - numbers to average
 * @returns {number} average
 */
exports.avg = function calcAverage(...nums) {
	return nums.reduce((acc, val) => acc + val, 0) / nums.length;
};

/**
 * calculate the size (on disk)
 * @memberof calculations
 * @param  {JSON} data - JSON to estimate
 * @returns {number} estimated size in bytes
 */
exports.calcSize = function estimateSizeOnDisk(data) {
	//caculates size in bytes; assumes utf-8 encoding: https://stackoverflow.com/a/63805778 
	return Buffer.byteLength(JSON.stringify(data));
};

/**
 * round a number to a number of decimal places
 * @memberof calculations
 * @param  {number} number - number to round
 * @param  {number} [decimalPlaces=0] - decimal places; default `0`
 * @returns {number} rounded number
 */
exports.round = function roundsNumbers(number, decimalPlaces = 0) {
	//https://gist.github.com/djD-REK/068cba3d430cf7abfddfd32a5d7903c3
	// @ts-ignore
	return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);
};

/**
 * generate a random uid:
 * - `6NswVtnKWsvRGNTi0H2YtuqGwsqJi4dKW6qUgSiUx1XNctr4rkGRFOA9HRl9i60S`
 * @memberof calculations
 * @param  {number} [length=64] length of id 
 * @returns {string} a uid of specified length
 */
exports.uid = function makeUid(length = 64) {
	//https://stackoverflow.com/a/1349426/4808195
	var result = [];
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() *
			charactersLength)));
	}
	return result.join('');
};

/**
 * generated a uuid in v4 format:
 * - `72452488-ded9-46c1-8c22-2403ea924a8e`
 * @memberof calculations
 * @returns {string} a uuid 
 */
exports.uuid = function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

/** 
 * calculate the md5 hash of any data
 * @memberof calculations
 * @param {any} data - data to hash
 * @returns {string} md5 hash of `data
 */
exports.md5 = function calcMd5Hash(data) {
	var hc="0123456789abcdef";
    function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {
        var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    var i,x=sb(data),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
    for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
        a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
        b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
        c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
        d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
        b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
        d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
        a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
        b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
        c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
        d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
        a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
        b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
        c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
        d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
        a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
        b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
        c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
        d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
        a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
        b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
}


/*
-------
OBJECTS
-------
*/

/**
 * rename object keys with a mapping object `{oldKey: newKey}`
 * @memberof objects
 * @param  {Object} obj - object to rename
 * @param  {Object} newKeys - map of form `{oldKey: newKey}`
 * @returns {Object} new object with renamed keys
 */
exports.rnKeys = function renameObjectKeys(obj, newKeys) {
	//https://stackoverflow.com/a/45287523
	const keyValues = Object.keys(obj).map(key => {
		const newKey = newKeys[key] || key;
		return {
			[newKey]: obj[key]
		};
	});
	return Object.assign({}, ...keyValues);
};

/**
 * rename object values using a mapping array
 * @memberof objects
 * @param  {Object} obj
 * @param  {Array[]} pairs `[['old', 'new']]`
 * @returns {Object} object with renamed values
 */
exports.rnVals = function renameValues(obj, pairs) {
	return JSON.parse(exports.multiReplace(JSON.stringify(obj), pairs));
};

/**
 * filter arrays by values or objects by keys
 * @memberof objects
 * @param  {Object} hash - object or array to filter
 * @param  {Function} test_function - a function which is called on keys/values 
 * @returns {Object} filtered object
 */
exports.objFilter = function filterObjectKeys(hash, test_function) {
	var filtered, key, keys, i;
	keys = Object.keys(hash);
	filtered = {};
	for (i = 0; i < keys.length; i++) {
		key = keys[i];
		if (test_function(hash[key])) {
			filtered[key] = hash[key];
		}
	}
	return filtered;
};

/**
 * removes the following from deeply nested objects:
 * - `null`
 * - `undefined` 
 * - `{}`
 * - `[]` 
 * @memberof objects
 * @param  {Object} obj
 * @returns {Object} cleaned object
 */
exports.objClean = function removeFalsyValues(obj) {
	//where objects have falsy values, delete those keys
	let target = JSON.parse(JSON.stringify(obj));

	function isObject(val) {
		if (val === null) { return false; }
		return ((typeof val === 'function') || (typeof val === 'object'));
	}

	const isArray = target instanceof Array;

	for (var k in target) {
		// falsy values
		if (!Boolean(target[k])) {
			isArray ? target.splice(k, 1) : delete target[k];
		}

		//empty strings
		if (target[k] === "") {
			delete target[k];
		}

		// empty arrays
		if (Array.isArray(target[k]) && target[k]?.length === 0) {
			delete target[k];
		}

		// empty objects
		if (isObject(target[k])) {
			if (JSON.stringify(target[k]) === '{}') {
				delete target[k];
			}
		}

		// recursion
		if (isObject(target[k])) {
			exports.objClean(target[k]);
		}
	}

	return target;
};

/**
 * apply default props to an object; don't override values from source
 * @memberof objects
 * @param  {Object} obj - original object
 * @param  {Object} defs - props to add without overriding
 * @returns {Object} an object which has `defs` props
 */
exports.objDefault = function assignDefaultProps(obj, ...defs) {
	return Object.assign({}, obj, ...defs.reverse(), obj);
};

/**
 * deep equality match for any two objects
 * @memberof objects
 * @param  {Object} obj
 * @param  {Object} source
 * @returns {boolean} do objects match?
 */
exports.objMatch = function doObjectsMatch(obj, source) {
	return Object.keys(source).every(key => obj.hasOwnProperty(key) && obj[key] === source[key]);
};

/**
 * an efficient way to clone an Object; outpreforms `JSON.parse(JSON.strigify())` by 100x
 * @memberof objects
 * @param  {Object} thing - object to clone
 * @param {unknown} [opts]
 * @returns {Object} copied object
 */
exports.clone = function deepClone(thing, opts) {
	var newObject = {};
	if (thing instanceof Array) {
		return thing.map(function (i) { return exports.clone(i, opts); });
	} else if (thing instanceof Date) {
		return new Date(thing);
	} else if (thing instanceof RegExp) {
		return new RegExp(thing);
	} else if (thing instanceof Function) {
		// @ts-ignore
		return opts && opts.newFns ?
			new Function('return ' + thing.toString())() :
			thing;
	} else if (thing instanceof Object) {
		Object.keys(thing).forEach(function (key) {
			newObject[key] = exports.clone(thing[key], opts);
		});
		return newObject;
	} else if ([undefined, null].indexOf(thing) > -1) {
		return thing;
	} else {
		if (thing.constructor.name === 'Symbol') {
			return Symbol(thing.toString()
				.replace(/^Symbol\(/, '')
				.slice(0, -1));
		}
		// return _.clone(thing);  // If you must use _ ;)
		return thing.__proto__.constructor(thing);
	}
};

/**
 * visit every property of an object a turn "number" values into numbers
 * - ex: `{foo: {bar: '42'}}` => `{foo: {bar: 42}}`
 * @memberof objects
 * @param  {object} obj - object to traverse
 * @param  {boolean} [isClone=false] - default `false`; if `true` will mutate the passed in object
 * @returns {Object} object with all "numbers" as proper numbers
 */
exports.typecastInt = function mutateObjValToIntegers(obj, isClone = false) {
	//utility function for visiting every single key on an object
	let target;
	if (isClone) {
		target = obj;
	} else {
		target = exports.clone(obj);
	}

	Object.keys(target).forEach(key => {

		//recursion :(
		if (typeof target[key] === 'object') {
			exports.typecastInt(target[key], true);
		}

		//ewww ... mutating the input
		else if (typeof target[key] === 'string') {
			//check if it can be parsed
			const parsed = makeInteger(target[key]);
			//if it's NaN, don't changed it
			target[key] = isNaN(parsed) ? target[key] : parsed;
		}
	});

	return target;
};

/**
 * utility to `await` object values
 * - ex: `{foo: await bar()}`
 * @memberof objects
 * @param  {object} obj object
 * @returns {Promise} the resolved values of the object's keys
 */
exports.awaitObj = function resolveObjVals(obj) {
	// https://stackoverflow.com/a/53112435
	const keys = Object.keys(obj);
	const values = Object.values(obj);
	return Promise.all(values)
		.then(resolved => {
			const res = {};
			for (let i = 0; i < keys.length; i += 1) {
				res[keys[i]] = resolved[i];
			}
			return res;
		});
};

/**
 * explicitly remove keys with `null` or `undefined` values; mutates object
 * - ex: `{foo: "bar", baz: null}` => `{foo: "bar"}`
 * @memberof objects
 * @param  {Object} objWithNullOrUndef - an object with `null` or `undefined` values
 * @returns {Object} an object without `null` or `undefined` values
 */
exports.removeNulls = function (objWithNullOrUndef) {
	for (let key in objWithNullOrUndef) {
		if (objWithNullOrUndef[key] === null) {
			delete objWithNullOrUndef[key];
		}

		if (objWithNullOrUndef[key] === undefined) {
			delete objWithNullOrUndef[key];
		}

	}
	return objWithNullOrUndef;
};

/**
 * check if a value is an integer, if so return it
 * @ignore
 * @param  {string} value - a value to test
 * @returns {(number | NaN)} a `number` or `NaN`
 */
function makeInteger(value) {
	//the best way to find strings that are integers in disguise
	if (/^[-+]?(\d+|Infinity)$/.test(value)) {
		return Number(value);
	} else {
		return NaN;
	}
}

/*
-------
ARRAYS
--------
*/

/**
 * de-dupe array of objects w/Set, stringify, parse
 * @memberof arrays
 * @param  {any} arrayOfThings - array to dedupe
 * @returns {any[]} deduped array
 */
exports.dedupe = function deepDeDupe(arrayOfThings) {
	// @ts-ignore
	return Array.from(new Set(arrayOfThings.map(JSON.stringify))).map(JSON.parse);
};

/**
 * de-dupe array of objects by value of specific keys
 * @memberof arrays
 * @param  {any[]} arr - array to dedupe
 * @param  {string[]} keyNames - keynames to dedupe values on
 * @returns {any[]} deduped array of objected
 */
exports.dedupeVal = function dedupeByValues(arr, keyNames) {
	// https://stackoverflow.com/a/56757215/4808195
	return arr.filter((v, i, a) => a.findIndex(v2 => keyNames.every(k => v2[k] === v[k])) === i);

};

/**
 * chunk array of objects into array of arrays with each less than or equal to `chunkSize`
 * - `[{},{},{},{}]` => `[[{},{}],[{},{}]]`
 * @memberof arrays
 * @param  {any[]} sourceArray - array to batch
 * @param  {number} chunkSize - max length of each batch
 * @returns {any[]} chunked array
 */
exports.chunk = function chunkArray(sourceArray, chunkSize) {
	return sourceArray.reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / chunkSize);

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = []; // start a new chunk
		}

		resultArray[chunkIndex].push(item);

		return resultArray;
	}, []);
};

/**
 * fisher-yates shuffle of array elements
 * @memberof arrays
 * @param  {any[]} array - array to shuffle
 * @param  {boolean} [mutate=false] - mutate array in place? default: `false`
 * @returns {any[]} shuffled array
 */
exports.shuffle = function shuffleArrayVals(array, mutate = false) {
	//https://stackoverflow.com/a/12646864/4808195
	let target;
	if (mutate) {
		target = array;
	} else {
		target = exports.clone(array);
	}
	for (let i = target.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[target[i], target[j]] = [target[j], target[i]];
	}

	return target;
};

/**
 * the classic python built-in for generating arrays of integers
 * @memberof arrays
 * @param  {number} min - starting number
 * @param  {number} max - ending nunber
 * @param  {number} [step=1] - step for each interval; default `1`
 * @return {number[]} a range of integers
 */
exports.range = function buildRangeArray(min, max, step = 1) {
	const result = [];
	step = !step ? 1 : step;
	max = max / step;
	for (var i = min; i <= max; i++) {
		result.push(i * step);
	}
	return result;
};

/**
 * recursively and deeply flatten a nested array of objects
 * - ex: `[ [ [{},{}], {}], {} ]` => `[{},{},{},{}]`
 * @memberof arrays
 * @param  {any[]} arr - array to flatten
 * @returns {any[]} flat array
 */
exports.deepFlat = function deepFlatten(arr) {
	return [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));
};

/**
 * extract words from a string as an array
 * - ex `"foo bar baz"` => `['foo','bar','baz']`
 * @memberof arrays
 * @param  {string} str - string to extract from
 * @returns {string[]} extracted words
 */
exports.strToArr = function extractWords(str, pattern = /[^a-zA-Z-]+/) {
	return str.split(pattern).filter(Boolean);
};

/*
---------
FUNCTIONS
---------
*/

/**
 * `try{} catch{}` a function; return results
 * @memberof functions
 * @param  {Function} fn
 * @param  {...any} args
 */
exports.attempt = async function tryToExec(fn, ...args) {
	try {
		return await fn(...args);
	} catch (e) {
		return e instanceof Error ? e : new Error(e);
	}
};

/**
 * do a function `N` times
 * @memberof functions
 * @param  {number} n - number of times
 * @param  {Function} iteratee - function to run
 */
exports.times = function doNTimes(n, iteratee, context) {
	var accum = Array(Math.max(0, n));
	iteratee = optimizeCb(iteratee, context, 1);
	for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	return accum;
};

/**
 * throttle a functions's execution every `N` ms
 * @memberof functions
 * @param  {function} func - function to throttle
 * @param  {number} wait - ms to wait between executiations
 * @param  {object} [options={leading: true, trailing: false}]
 */
exports.throttle = function throttle(func, wait, options = { leading: true, trailing: true }) {
	var timeout, context, args, result;
	var previous = 0;
	if (!options) options = {};

	var later = function () {
		previous = options.leading === false ? 0 : Date.now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};

	var throttled = function () {
		var _now = Date.now();
		if (!previous && options.leading === false) previous = _now;
		var remaining = wait - (_now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = _now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};

	throttled.cancel = function () {
		clearTimeout(timeout);
		previous = 0;
		timeout = context = args = null;
	};

	return throttled;
};

/**
 * compose functions, left-to-right
 * - ex: `c(a,b,c)` => `a(b(c()))`
 * @memberof functions
 * @returns {function} a composed chain of functions
 */
exports.compose = function composeFns() {
	var args = arguments;
	var start = args.length - 1;
	return function () {
		var i = start;
		var result = args[start].apply(this, arguments);
		while (i--) result = args[i].call(this, result);
		return result;
	};
};

/**
 * a function which returns it's value 
 * @memberof functions
 * @param  {any} any - anything
 * @return {any} the same thing
 */
exports.id = function identity(any) {
	return any
}

/*
-------
LOGGING
-------
*/

/**
 * a cloud function compatible `console.log()`
 * @memberof logging
 * @param  {(string | JSON)} data - data to log
 * @param  {string} message - accopanying message
 * @param  {string} [severity=`INFO`] - {@link https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity| google sev label}; default `INFO`
 * 
 */
exports.cLog = function cloudFunctionLogger(data, message, severity = `INFO`) {
	if (global?.isTest) {
		if (exports.isJSON(data)) {
			if (message) console.log(message);
			if (data) console.log(JSON.stringify(data, null, 2));
		}

		else {
			if (message) console.log(message);
			if (data) console.log(data);
		}
	}

	//probably GCP
	else {
		if (exports.isJSON(data)) {
			// https://cloud.google.com/functions/docs/monitoring/logging#writing_structured_logs
			const structuredLog = Object.assign({
				severity: severity,
				message: message || `${global.moduleName || 'CF'} log`,
			},
				data
			);

			console.log(JSON.stringify(structuredLog));
		}

		else {
			// https://cloud.google.com/functions/docs/monitoring/logging
			if (message) console.log(message);
			if (data) console.log(data);
		}
	}

	return true;

};

/**
 * a comprehensive logging utility in all terminal environments
 * @memberof logging
 * @param  {any} item - an item to log
 * @param  {number} [depth=0] - depth to log
 * @param  {number} [maxDepth=100] - maximum nested depth
 * @returns {void}
 */
exports.log = function comprehensiveLog(item, depth = 0, maxDepth = 100) {
	//the best logging function ever
	//https://stackoverflow.com/a/27610197/4808195
	if (depth > maxDepth) {
		console.log(item);
		return;
	}
	if (typeof item === 'object' && item !== null) {
		Object.entries(item).forEach(([key, value]) => {
			console.group(key + ' : ' + (typeof value));
			exports.log(value, maxDepth, depth + 1);
			console.groupEnd();
		});
	} else {
		console.log(item);
	}
};

/**
 * dumb progress bar; incrementing console message
 * - ex: `thing message #`
 * @memberof logging
 * @param {string} thing - what is being 
 * @param {number} p - the number to show
 * @param {string} message - 
 * @returns {void}
 */
exports.progress = function showProgress(thing, p, message = `processed ...`) {
	//readline.clearLine(process.stdout);
	readline.cursorTo(process.stdout, 0);
	process.stdout.write(`${thing} ${message} ${exports.comma(p)}`);
};

class Timer {
	constructor(label) {
		this.label = label;

		this.startTime = null;
		this.endTime = null;
		this.delta = null;
	}
	start() {
		this.startTime = Date.now();
	}
	end(consoleOutput = true) {
		const endTime = Date.now();
		this.endTime = endTime;

		// @ts-ignore
		const delta = this.endTime - this.startTime;
		this.delta = delta;

		if (consoleOutput) {
			console.log(`${this.label}: ${this.prettyTime(delta)}`);
		}
	}
	report(consoleOutput = true) {
		if (consoleOutput) {
			console.log(`${this.label} took ${this.prettyTime(this.delta)}`);
		}
		return {
			label: this.label,
			start: this.startTime,
			end: this.endTime,
			delta: this.delta,
			human: this.prettyTime(this.delta)

		};
	}
	prettyTime(miliseconds) {
		let seconds = miliseconds / 1000;
		const levels = [
			[Math.floor(seconds / 31536000), 'years'],
			[Math.floor((seconds % 31536000) / 86400), 'days'],
			[Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
			[Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
			[(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
		];
		let result = '';

		for (var i = 0, max = levels.length; i < max; i++) {
			if (levels[i][0] === 0) continue;
			// @ts-ignore
			result += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1]);
		};
		return result.trim();
	}
}

/**
 * returns a timer with the following API
 * - `timer.start()`
 * - `timer.end()`
 * - `timer.report()`
 * - `timer.prettyTime()`
 * @memberof logging
 * @param  {string} label - name for timer
 * @return {Timer} a time
 */
exports.time = function (label) {
	return new Timer(label);
};

/**
 * a very quick way to check the length of a function; uses `console.time`
 * - ex: `timeTaken(main)`
 * @memberof logging
 * @param  {function} callback
 */
exports.quickTime = function timeTaken(callback) {
	console.time('timeTaken');
	const r = callback();
	console.timeEnd('timeTaken');
	return r;
};

/**
 * track stuff to mixpanel
 * - ex: `var t = track(); t('foo', {bar: "baz"})`
 * @memberof logging
 * @param  {string} [app='akTools'] - value of `$source` prop
 * @param  {string} [token="99a1209a992b3f9fba55a293e211186a"] - mixpanel token
 * @param  {string} [distinct_id=os.userInfo().username] - distinct_id
 * @returns {function} func with signature: `(event, props = {}, cb = ()=>{})`
 */
exports.tracker = function sendToMixpanel(app = 'akTools', token = "99a1209a992b3f9fba55a293e211186a", distinct_id = os.userInfo().username) {
	return function (eventName = "ping", props = {}, callback = (res) => { return res; }) {

		const optionsEv = {
			"method": "POST",
			"hostname": "api.mixpanel.com",
			"path": "/track?verbose=1",
			"headers": {
				"Content-Type": "application/json",
				"Accept": "text/plain",
			}
		};

		const reqEv = http.request(optionsEv, function (res) {
			const chunks = [];

			res.on("data", function (chunk) {
				chunks.push(chunk);
			});

			res.on("end", function () {
				const body = Buffer.concat(chunks);
				prof(JSON.parse(body.toString()), callback);
			});
		});

		const payloadEv = [
			{
				event: eventName,
				properties: {
					token: token,
					distinct_id: distinct_id,
					$source: app,
					...props
				}
			}
		];
		reqEv.write(JSON.stringify(payloadEv));
		reqEv.end();

		function prof(prior, callback) {

			const optionsU = {
				"method": "POST",
				"hostname": "api.mixpanel.com",
				"path": "/engage?verbose=1",
				"headers": {
					"Content-Type": "application/json",
					"Accept": "text/plain",
				}
			};

			const reqU = http.request(optionsU, function (res) {
				const chunks = [];

				res.on("data", function (chunk) {
					chunks.push(chunk);
				});

				res.on("end", function () {
					const body = Buffer.concat(chunks);
					const res = JSON.parse(body.toString('utf-8'));
					callback([prior, res]);
				});
			});

			const payloadU = [{
				$token: token,
				$distinct_id: distinct_id,
				$set: {
					$name: distinct_id
				}
			}];
			reqU.write(JSON.stringify(payloadU));
			reqU.end();

		};
	};
};

/**
 * arbitrary sleep for `N` ms
 * @memberof logging
 * @param {number} ms - amount of time to sleep
 */
exports.sleep = function pauseFor(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * copy arbitrary data to your clipboard
 * @memberof logging
 * @param  {any} data - data to put on your clipboard
 * @returns {void} but there's data on your clipboard!
 */
exports.clip = function copyToClipboard(data) {
    var proc = require('child_process').spawn('pbcopy'); 
    proc.stdin.write(data); proc.stdin.end();
}


/*
--------
ALIASES
--------
*/
exports.copy = exports.clip


// ripped out of underscore; should not be called directly
function optimizeCb(func, context, argCount) {
	if (context === void 0) return func;
	switch (argCount == null ? 3 : argCount) {
		case 1: return function (value) {
			return func.call(context, value);
		};

		case 3: return function (value, index, collection) {
			return func.call(context, value, index, collection);
		};
		case 4: return function (accumulator, value, index, collection) {
			return func.call(context, accumulator, value, index, collection);
		};
	}
	return function () {
		return func.apply(context, arguments);
	};
}