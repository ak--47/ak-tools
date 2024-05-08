// AK's utils
// things to make things ... easier
const path = require('path');
const fs = require('fs').promises;
const { existsSync, mkdirSync } = require('fs');
const readline = require('readline');
const http = require("https");
const os = require("os");

/*
-------------------
NAMESPACES + TYPES
-------------------
*/

/**
 * file management utilities 
 * @namespace files
*/

/**
 * data validation utilities
 * @namespace validate
*/

/**
 * display, formatting, and other "make it look right" utilities
 * @namespace display
*/

/**
 * functions for maths, crypto, and maths
 * @namespace maths
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

/**
 * generic for `{}` w/string keys
 * @typedef {Object.<string, any>} generalObject
 */

/**
 * generic for `[{},{},{}]`
 * @typedef {generalObject[]} arrayOfObjects
 */

/*
------
FILES
------
*/

/** 
 * list directory contents
 * @example
 * await ls('./tmp') // => []
 * await ls('./tmp', true) // => {}
 * @param  {string} [dir='./'] - directory to enumerate; default `./`
 * @param  {boolean} [objectMode=false] - return `{name: path}` instead of `[path]`; default `false`
 * @returns {Promise<(string[] | generalObject)>} `[]` or `{}` of files in folder
 * @memberof files
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
 * @example
 * await rm('./myfile.txt') // => '/path/to/myfile.txt' || false
 * @param  {string} fileNameOrPath - file or path to be removed
 * @returns {Promise<(string|boolean|void)>} path or `false` if fail
 * @memberof files
 */
exports.rm = async function removeFileOrFolder(fileNameOrPath, log = true, throws = true) {
	let fileRemoved;
	try {
		fileRemoved = await fs.unlink(path.resolve(fileNameOrPath));
	} catch (e) {
		try {
			fileRemoved = await fs.rm(path.resolve(fileNameOrPath), { recursive: true, force: true });
		} catch (e) {
			if (log) {
				console.error(`${fileNameOrPath} not removed!`);
				console.error(e);
			}
			if (throws) {
				throw e;
			}
			return false;
		}
	}

	return fileRemoved;
};

/**
 * create a file
 * @example
 * await touch('newfile.txt', data)  // => '/path/to/newfile.txt' || false
 * await touch('newfile.json', data, true)  // => '/path/to/newfile.json' || false
 * @param  {string} fileNameOrPath - file to create
 * @param  {string | generalObject | arrayOfObjects} [data=""] - data to write; default `""`
 * @param  {boolean} [isJson=false] - is `data` JSON; default `false`
 * @returns {Promise<(string | false)>} the name of the file
 * @memberof files
 */
exports.touch = async function addFile(fileNameOrPath, data = "", isJson = false, log = true, throws = true) {
	let fileCreated;
	let dataToWrite = isJson ? exports.json(data) : data;

	try {
		//@ts-ignore
		fileCreated = await fs.writeFile(path.resolve(fileNameOrPath), dataToWrite, 'utf-8');
	} catch (e) {
		if (log) {
			console.error(`${fileNameOrPath} not created!`);
			console.error(e);
		}
		if (throws) {
			throw e;
		}
		return false;
	}

	return path.resolve(fileNameOrPath);

};

/**
 * load a file into memory
 * @example
 * await load('myfile.txt')  // => 'my file contents' || false
 * await load('myfile.json', true)  // => {my: "data"} || false
 * @param  {string} fileNameOrPath - file to create
 * @param  {boolean} [isJson=false] - is `data` JSON; default `false`
 * @param {string} [encoding=utf-8] - file encoring; default `utf-8`
 * @returns {Promise<(string | generalObject | arrayOfObjects | any)>} the file in memory
 * @memberof files
 */
exports.load = async function loadFile(fileNameOrPath, isJson = false, encoding = 'utf-8', log = true, throws = true) {
	let fileLoaded;

	try {
		// @ts-ignore
		fileLoaded = await fs.readFile(path.resolve(fileNameOrPath), encoding);
	} catch (e) {
		if (log) {
			console.error(`${fileNameOrPath} not loaded!`);
			console.error(e);
		}
		if (throws) {
			throw e;
		}
	}

	if (isJson) {
		// @ts-ignore
		fileLoaded = JSON.parse(fileLoaded);
	}

	return fileLoaded;
};

/**
 * make a directory with error handling and confirmation.
 * @example
 * const myTmpDir = mkdir('./tmp')
 * @param  {string} [dirPath="./tmp"] - path to create; default `./tmp`
 * @returns {string} the absolute path of the directory
 * @memberof files
 */
exports.mkdir = function (dirPath = "./tmp") {
    let fullPath = path.resolve(dirPath);
    if (!existsSync(fullPath)) {
        try {
            mkdirSync(fullPath, { recursive: true });
            // Check if the directory was created
            if (!existsSync(fullPath)) {
                throw new Error(`Failed to create directory at ${fullPath}`);
            }
        } catch (error) {
            console.error(`Error creating directory at ${fullPath}: ${error.message}`);
            throw error; // Rethrow or handle as necessary for your application's error handling strategy
        }
    }
    return fullPath;
};


/*
-----------
VALIDATION
-----------
*/

/**
 * test if `string` has JSON structure
 * @example
 * isJSONStr('{"foo": "bar"}') // => true
 * @param  {string} string
 * @returns {boolean}
 * @memberof validate
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
 * @example
 * isJSON({foo: "bar"}) // => true
 * @param  {string | JSON} data
 * @returns {boolean}
 * @memberof validate
 */
exports.isJSON = function canBeStringified(data) {
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
 * @example
 * is(Number, 42) // => true
 * @param  {'string' | any} type - a native type like `Number` or `Boolean`
 * @param  {any} val - any value to check
 * @returns {boolean}
 * @memberof validate
 */
exports.is = function isPrimitiveType(type, val) {
	if (typeof type === 'string') {
		return typeof val === type;
	}
	return ![, null].includes(val) && val.constructor === type;
};

/**
 * check if a `val` is `null` or `undefined`
 * @example
 * isNil(null) // => true
 * @param  {any} val - value to check
 * @returns {boolean}
 * @memberof validate
 */
exports.isNil = function isNullOrUndefined(val) {
	return val === undefined || val === null;
};

/**
 * check if `a` and `b` have similar shape (keys), recursively
 * @example
 * similar({a: "foo"}, {a: "bar"}) // => true
 * @param {generalObject} o1 - first obj
 * @param {generalObject} o2 - second obj
 * @returns {boolean} do they have the same shape?
 * @memberof validate
 */
exports.similar = function deepSameKeys(o1, o2) {
	// https://stackoverflow.com/a/41802431
	// Both nulls = same
	if (o1 === null && o2 === null) {
		return true;
	}

	// Get the keys of each object
	const o1keys = o1 === null ? new Set() : new Set(Object.keys(o1));
	const o2keys = o2 === null ? new Set() : new Set(Object.keys(o2));
	if (o1keys.size !== o2keys.size) {
		// Different number of own properties = not the same
		return false;
	}

	// Look for differences, recursing as necessary
	for (const key of o1keys) {
		if (!o2keys.has(key)) {
			// Different keys
			return false;
		}

		// Get the values and their types
		const v1 = o1[key];
		const v2 = o2[key];
		const t1 = typeof v1;
		const t2 = typeof v2;
		if (t1 === "object") {
			if (t2 === "object" && !deepSameKeys(v1, v2)) {
				return false;
			}
		} else if (t2 === "object") {
			// We know `v1` isn't an object
			return false;
		}
	}

	// No differences found
	return true;
};

/** 
 * @typedef {object} GCSUri
 * @property {string} uri
 * @property {string} bucket
 * @property {string} file
 */

/**
 * turn a gcs uri into a bucket and file
 * @example
 * parseGCSUri(`gcs://foo/bar.txt`) // => {uri: "gcs://foo/bar.txt", bucket: "foo", file: "bar.txt"}
 * @param  {string} uri
 * @returns {GCSUri}
 * @memberof validate
 */
exports.parseGCSUri = function (uri) {
	// ? https://www.npmjs.com/package/google-cloud-storage-uri-parser
	let prefix;
	if (uri.startsWith("gs://")) prefix = "gs://";
	if (uri.startsWith("gcs://")) prefix = "gcs://";
	if (!prefix) throw `invalid gcs uri: ${uri}`;
	const REG_EXP = new RegExp(`^${prefix}([^/]+)/(.+)$`);
	let bucket = uri.replace(REG_EXP, "$1");
	let file = uri.replace(REG_EXP, "$2");
	if (!file) file = "";
	if (!bucket) bucket = uri.split(prefix)[0];
	if (bucket.endsWith("/")) bucket = bucket.slice(0, -1);
	if (bucket.startsWith(prefix)) bucket = bucket.slice(prefix.length);
	if (file === uri) file = "";
	return {
		uri,
		bucket,
		file
	};
};

/** turns a string into a boolean
 * @param  {string} string
 * @memberof validate
 */
exports.toBool = function stringToBoolean(string) {
	if (typeof string !== "string") {
		return Boolean(string);
	}

	switch (string.toLowerCase().trim()) {
		case "true":
			return true;
		case "yes":
			return true;
		case "1":
			return true;
		case "false":
			return false;
		case "no":
			return false;
		case "0":
			return false;
		case "":
			return false;
		default:
			return Boolean(string);
	}
}


/*
-------
DISPLAY
-------
*/

/**
 * turn a number into a comma separated (human readable) string
 * @example
 * comma(1000) // => "1,000"
 * @param  {(string | number)} num
 * @returns {string} formatted number 
 * @memberof display
 */
exports.comma = function addCommas(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * truncate a string w/ellipses 
 * @example
 * truncate('foo bar baz', 3) // => 'foo...'
 * @param  {string} text - text to truncate
 * @param  {number} [chars=500] - # of max characters
 * @param  {boolean} [useWordBoundary=true] - don't break words; default `true`
 * @returns {string} truncated string
 * @memberof display
 * 
 */
exports.truncate = function intelligentlyTruncate(text, chars = 500, useWordBoundary = true) {
	if (!text) {
		return "";
	}
	if (text.length <= chars) {
		return text;
	}
	var subString = text.substring(0, chars - 1);
	return (useWordBoundary ?
		subString.substring(0, subString.lastIndexOf(' ')) :
		subString) + "...";
};

/**
 * turn a number (of bytes) into a human readable string
 * @example
 * bytesHuman(10000000) // => '9.54 MiB'
 * @param  {number} bytes - number of bytes to convert
 * @param  {number} [dp=2] - decimal points; default `2`
 * @param  {boolean} [si=false] - threshold of 1000 or 1024; default `false`
 * @returns {string} # of bytes
 * @memberof display
 */
exports.bytesHuman = function (bytes, dp = 2, si = true) {
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
 * @example
 * json({foo: "bar"}) => '{"foo": "bar"}'
 * @param  {object} data - any serializable object
 * @param  {number} [padding=2] - padding to use
 * @returns {string | false} valid json
 * @memberof display
 */
exports.json = function stringifyJSON(data, padding = 2) {
	try {
		return JSON.stringify(data, null, padding);
	}

	catch (e) {
		return false;
	}
};

/**
 * strip all `<html>` tags from a string
 * @param  {string} str string with html tags
 * @example
 * stripHTML(`<div>i am <br/>text`) // => "i am \n text"
 * @returns {string} sanitized string
 * @note note: `<br>` tags are replace with `\n`
 * @memberof display
 */
exports.stripHTML = function removeHTMLEntities(str) {
	return str.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]*>?/gm, '');
};

/**
 * find and replace _many_ values in string
 * @example
 * multiReplace('red fish said', [["red", "blue"],["said"]]) // => "blue fish"
 * @param  {string} str - string to replace
 * @param  {Array<Array<string, string>>} [replacePairs=[["|"],["<"],[">"]]] shape: `[ [old, new] ]`
 * @returns {string} multi-replaced string
 * @memberof display
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
 * replace all occurrence of `old` with `new`
 * @example
 * 'foo bar'.replaceAll('foo', 'qux') // => 'qux bar'
 * @param  {(string | RegExp)} oldVal - old value
 * @param  {(string)} newVal - new value
 * @returns {string} replaced result 
 * @memberof display
 * @note this CAN be called on any string directly
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
 * @example
 * toCSV([[1,2],[3,4]], ["foo", "bar"]) // => '"foo","bar"\n"1","2"\n"3","4"'
 * @param  {Array<String[] | Number[]>} arr - data of the form `[ [], [], [] ]`
 * @param  {String[]} [headers=[]] - header column 
 * @param  {string} [delimiter=","] - delimiter for cells; default `,`
 * @returns {string} a valid CSV
 * @memberof display
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

/**
 * serialize a base64 string
 * @example
 * unBase64(`eyJmb28iOiAiYmFyIn0=`) => {"foo": "bar"}
 * @param {string} b64Str - base64 encoded JSON data 
 * @returns dict or array of data
 * @memberof display
 */
exports.unBase64 = function decodeBase64ToJson(b64Str) {
	const data = Buffer.from(b64Str, 'base64').toString('binary');
	try {
		return JSON.parse(data);
	}
	catch (e) {
		return data;
	}
};

/*
-----
MATHS
-----
*/

/**
 * random integer between `min` and `max` (inclusive)
 * @example
 * rand(1,10) // 1 or 2 or 3 ... or 10
 * @param  {number} min=1 - minimum
 * @param  {number} max=100 - maximum
 * @returns {number} random number
 * @note this is not cryptographically safe
 * @memberof maths
 */
exports.rand = function generateRandomNumber(min = 1, max = 100) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * calculate average of `...nums`
 * @example
 * avg(1,2,3) // => 2
 * @param  {...number} nums - numbers to average
 * @returns {number} average
 * @memberof maths
 */
exports.avg = function calcAverage(...nums) {
	return nums.reduce((acc, val) => acc + val, 0) / nums.length;
};

/**
 * calculate the size (on disk)
 * @example
 * calcSize({foo: "bar"}) // => 13
 * @param  {(string | generalObject)} data - JSON to estimate
 * @returns {number} estimated size in bytes
 * @memberof maths
 */
exports.calcSize = function estimateSizeOnDisk(data) {
	//calculates size in bytes; assumes utf-8 encoding: https://stackoverflow.com/a/63805778 
	return Buffer.byteLength(JSON.stringify(data));
};

/**
 * round a number to a number of decimal places
 * @example
 * round(3.14159, 3) // => 3.142
 * @param  {number} number - number to round
 * @param  {number} [decimalPlaces=0] - decimal places; default `0`
 * @returns {number} rounded number
 * @memberof maths
 */
exports.round = function roundsNumbers(number, decimalPlaces = 0) {
	//https://gist.github.com/djD-REK/068cba3d430cf7abfddfd32a5d7903c3
	// @ts-ignore
	return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);
};

/**
 * generate a random uid:
 * @example
 * uid(4) // => 'AwD9rbntSj'
 * @param  {number} [length=64] length of id; default `64` 
 * @returns {string} a uid of specified length
 * @note not cryptographically safe
 * @memberof maths
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
 * @example
 * uuid() // => "f47e2fdf-e387-4a39-9bb9-80b0ed950b48"
 * @returns {string} a uuid 
 * @note not cryptographically safe
 * @memberof maths
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
 * @example
 * md5({foo: "bar"}) // => "d41d8cd98f00b204e9800998ecf8427e"
 * @param {any} data - data to hash
 * @returns {string} md5 hash of `data
 * @memberof maths
 */
exports.md5 = function calcMd5Hash(data) {
	var hc = "0123456789abcdef";
	function rh(n) { var j, s = ""; for (j = 0; j <= 3; j++) s += hc.charAt((n >> (j * 8 + 4)) & 0x0F) + hc.charAt((n >> (j * 8)) & 0x0F); return s; }
	function ad(x, y) { var l = (x & 0xFFFF) + (y & 0xFFFF); var m = (x >> 16) + (y >> 16) + (l >> 16); return (m << 16) | (l & 0xFFFF); }
	function rl(n, c) { return (n << c) | (n >>> (32 - c)); }
	function cm(q, a, b, x, s, t) { return ad(rl(ad(ad(a, q), ad(x, t)), s), b); }
	function ff(a, b, c, d, x, s, t) { return cm((b & c) | ((~b) & d), a, b, x, s, t); }
	function gg(a, b, c, d, x, s, t) { return cm((b & d) | (c & (~d)), a, b, x, s, t); }
	function hh(a, b, c, d, x, s, t) { return cm(b ^ c ^ d, a, b, x, s, t); }
	function ii(a, b, c, d, x, s, t) { return cm(c ^ (b | (~d)), a, b, x, s, t); }
	function sb(x) {
		var i; var nblk = ((x.length + 8) >> 6) + 1; var blks = new Array(nblk * 16); for (i = 0; i < nblk * 16; i++) blks[i] = 0;
		for (i = 0; i < x.length; i++) blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
		blks[i >> 2] |= 0x80 << ((i % 4) * 8); blks[nblk * 16 - 2] = x.length * 8; return blks;
	}
	var i, x = sb(data), a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, olda, oldb, oldc, oldd;
	for (i = 0; i < x.length; i += 16) {
		olda = a; oldb = b; oldc = c; oldd = d;
		a = ff(a, b, c, d, x[i + 0], 7, -680876936); d = ff(d, a, b, c, x[i + 1], 12, -389564586); c = ff(c, d, a, b, x[i + 2], 17, 606105819);
		b = ff(b, c, d, a, x[i + 3], 22, -1044525330); a = ff(a, b, c, d, x[i + 4], 7, -176418897); d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
		c = ff(c, d, a, b, x[i + 6], 17, -1473231341); b = ff(b, c, d, a, x[i + 7], 22, -45705983); a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
		d = ff(d, a, b, c, x[i + 9], 12, -1958414417); c = ff(c, d, a, b, x[i + 10], 17, -42063); b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
		a = ff(a, b, c, d, x[i + 12], 7, 1804603682); d = ff(d, a, b, c, x[i + 13], 12, -40341101); c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
		b = ff(b, c, d, a, x[i + 15], 22, 1236535329); a = gg(a, b, c, d, x[i + 1], 5, -165796510); d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
		c = gg(c, d, a, b, x[i + 11], 14, 643717713); b = gg(b, c, d, a, x[i + 0], 20, -373897302); a = gg(a, b, c, d, x[i + 5], 5, -701558691);
		d = gg(d, a, b, c, x[i + 10], 9, 38016083); c = gg(c, d, a, b, x[i + 15], 14, -660478335); b = gg(b, c, d, a, x[i + 4], 20, -405537848);
		a = gg(a, b, c, d, x[i + 9], 5, 568446438); d = gg(d, a, b, c, x[i + 14], 9, -1019803690); c = gg(c, d, a, b, x[i + 3], 14, -187363961);
		b = gg(b, c, d, a, x[i + 8], 20, 1163531501); a = gg(a, b, c, d, x[i + 13], 5, -1444681467); d = gg(d, a, b, c, x[i + 2], 9, -51403784);
		c = gg(c, d, a, b, x[i + 7], 14, 1735328473); b = gg(b, c, d, a, x[i + 12], 20, -1926607734); a = hh(a, b, c, d, x[i + 5], 4, -378558);
		d = hh(d, a, b, c, x[i + 8], 11, -2022574463); c = hh(c, d, a, b, x[i + 11], 16, 1839030562); b = hh(b, c, d, a, x[i + 14], 23, -35309556);
		a = hh(a, b, c, d, x[i + 1], 4, -1530992060); d = hh(d, a, b, c, x[i + 4], 11, 1272893353); c = hh(c, d, a, b, x[i + 7], 16, -155497632);
		b = hh(b, c, d, a, x[i + 10], 23, -1094730640); a = hh(a, b, c, d, x[i + 13], 4, 681279174); d = hh(d, a, b, c, x[i + 0], 11, -358537222);
		c = hh(c, d, a, b, x[i + 3], 16, -722521979); b = hh(b, c, d, a, x[i + 6], 23, 76029189); a = hh(a, b, c, d, x[i + 9], 4, -640364487);
		d = hh(d, a, b, c, x[i + 12], 11, -421815835); c = hh(c, d, a, b, x[i + 15], 16, 530742520); b = hh(b, c, d, a, x[i + 2], 23, -995338651);
		a = ii(a, b, c, d, x[i + 0], 6, -198630844); d = ii(d, a, b, c, x[i + 7], 10, 1126891415); c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
		b = ii(b, c, d, a, x[i + 5], 21, -57434055); a = ii(a, b, c, d, x[i + 12], 6, 1700485571); d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
		c = ii(c, d, a, b, x[i + 10], 15, -1051523); b = ii(b, c, d, a, x[i + 1], 21, -2054922799); a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
		d = ii(d, a, b, c, x[i + 15], 10, -30611744); c = ii(c, d, a, b, x[i + 6], 15, -1560198380); b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
		a = ii(a, b, c, d, x[i + 4], 6, -145523070); d = ii(d, a, b, c, x[i + 11], 10, -1120210379); c = ii(c, d, a, b, x[i + 2], 15, 718787259);
		b = ii(b, c, d, a, x[i + 9], 21, -343485551); a = ad(a, olda); b = ad(b, oldb); c = ad(c, oldc); d = ad(d, oldd);
	}
	return rh(a) + rh(b) + rh(c) + rh(d);
};

/**
 * generate a random name (adjective + noun + verb + adverb)
 * @return {string} a random name
 */
exports.makeName = function generateName(words = 3, separator = "-") {
	const adjs = [
		"autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark",
		"summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter",
		"patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue",
		"billowing", "broken", "cold", "damp", "falling", "frosty", "green",
		"long", "late", "lingering", "bold", "little", "morning", "muddy", "old",
		"red", "rough", "still", "small", "sparkling", "throbbing", "shy",
		"wandering", "withered", "wild", "black", "young", "holy", "solitary",
		"fragrant", "aged", "snowy", "proud", "floral", "restless", "divine",
		"polished", "ancient", "purple", "lively", "nameless", "gentle", "gleaming", "furious", "luminous", "obscure", "poised", "shimmering", "swirling",
		"sombre", "steamy", "whispering", "jagged", "melodic", "moonlit", "starry", "forgotten",
		"peaceful", "restive", "rustling", "sacred", "ancient", "haunting", "solitary", "mysterious",
		"silver", "dusky", "earthy", "golden", "hallowed", "misty", "roaring", "serene", "vibrant",
		"stalwart", "whimsical", "timid", "tranquil", "vast", "youthful", "zephyr", "raging",
		"sapphire", "turbulent", "whirling", "sleepy", "ethereal", "tender", "unseen", "wistful"
	];

	const nouns = [
		"waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning",
		"snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter",
		"forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook",
		"butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly",
		"feather", "grass", "haze", "mountain", "night", "pond", "darkness",
		"snowflake", "silence", "sound", "sky", "shape", "surf", "thunder",
		"violet", "water", "wildflower", "wave", "water", "resonance", "sun",
		"wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper",
		"frog", "smoke", "star", "glow", "wave", "riverbed", "cliff", "deluge", "prairie", "creek", "ocean",
		"peak", "valley", "starlight", "quartz", "woodland", "marsh", "earth", "canopy",
		"petal", "stone", "orb", "gale", "bay", "canyon", "watercourse", "vista", "raindrop",
		"boulder", "grove", "plateau", "sand", "mist", "tide", "blossom", "leaf", "flame",
		"shade", "coil", "grotto", "pinnacle", "scallop", "serenity", "abyss", "skyline",
		"drift", "echo", "nebula", "horizon", "crest", "wreath", "twilight", "balm", "glimmer"
	];

	const verbs = [
		"dancing", "whispering", "flowing", "shimmering", "swirling", "echoing", "sparkling", "glistening",
		"cascading", "drifting", "glowing", "rippling", "quivering", "singing", "twinkling", "radiating",
		"enveloping", "enchanting", "captivating", "embracing", "embracing", "illuminating", "pulsating", "gliding",
		"soaring", "wandering", "meandering", "dazzling", "cuddling", "embracing", "caressing", "twisting",
		"twirling", "tumbling", "surging", "glimmering", "gushing", "splashing", "rolling", "splintering",
		"splintering", "crescendoing", "whirling", "bursting", "shining", "gushing", "emerging", "revealing",
		"emerging", "unfolding", "unveiling", "emerging", "surrounding", "unveiling", "materializing", "revealing"
	];
	
	const adverbs = [
		"gracefully", "softly", "smoothly", "gently", "tenderly", "quietly", "serenely", "peacefully",
		"delicately", "effortlessly", "subtly", "tranquilly", "majestically", "silently", "calmly", "harmoniously",
		"elegantly", "luminously", "ethereally", "mysteriously", "sublimely", "radiantly", "dreamily", "ethereally",
		"mesmerizingly", "hypnotically", "mystically", "enigmatically", "spellbindingly", "enchantingly", "fascinatingly",
		"bewitchingly", "captivatingly", "entrancingly", "alluringly", "rapturously", "seductively", "charismatically",
		"seductively", "envelopingly", "ensnaringly", "entrancingly", "intoxicatingly", "irresistibly", "transcendentally",
		"envelopingly", "rapturously", "intimately", "intensely", "tangibly", "vividly", "intensely", "deeply"
	];

	let string;
	const cycle = [adjs, nouns, verbs, adverbs];
	for (let i = 0; i < words; i++) {
		const index = i % cycle.length;
		// ? http://stackoverflow.com/a/17516862/103058
		const word = cycle[index][Math.floor(Math.random() * cycle[index].length)];
		if (!string) {
			string = word;
		} else {
			string += separator + word;
		}
	}
	
	return string;	

}

/*
-------
OBJECTS
-------
*/

/**
 * rename object keys with a mapping object
 * @example
 * rnKeys({foo: 'bar'}, {foo: 'baz'}) // => {baz: "bar"}
 * @param  {generalObject} obj - object to rename
 * @param  {generalObject} newKeys - map of form `{oldKey: newKey}`
 * @returns {generalObject} new object with renamed keys
 * @memberof objects
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
* @example
 * rnVals({foo: "bar"}, [["bar","baz"]) // => {foo: "baz"}
 * @param  {generalObject} obj
 * @param  {Array<Array<string, string>>} pairs `[['old', 'new']]`
 * @returns {generalObject} object with renamed values
 * @memberof objects
 */
exports.rnVals = function renameValues(obj, pairs) {
	return JSON.parse(exports.multiReplace(JSON.stringify(obj), pairs));
};

/**
* @callback filterCallback
* @param {string} keyOrValue object's value or key to test
*/

/**
 * filter objects by values or objects by keys; like `map()` for objects
 * @example
 * const d = {foo: "bar", baz: "qux"}
 * objFilter(d, x => x.startsWith('b')) // => {foo: "bar"}
 * objFilter(d, x => x.startsWith('f'), 'key') // => {foo: "bar"}
 * @param  {generalObject} hash - object or array to filter
 * @param  {filterCallback} test_function - a function which is called on keys/values 
 * @param  {"key" | "value"} [keysOrValues="value"] - test keys or values; default `value`
 * @returns {generalObject} filtered object
 * @memberof objects
 */
exports.objFilter = function filterObjectKeys(hash, test_function, keysOrValues = "value") {
	let key, i;
	const iterator = Object.keys(hash);
	const filtered = {};

	for (i = 0; i < iterator.length; i++) {
		key = iterator[i];
		if (keysOrValues === 'value') {
			if (test_function(hash[key])) {
				filtered[key] = hash[key];
			}
		}
		if (keysOrValues === 'key') {
			if (test_function(key.toString())) {
				filtered[key] = hash[key];
			}
		}
	}

	return filtered;
};

/**
 * removes the following from deeply nested objects:
 * - `null` | `undefined` | `{}` | `[]` | `""` 
 * @example
 * objClean({foo: null, bar: undefined, baz: ""}) // => {}
 * @param  {generalObject} obj object to clean
 * @param {boolean} [clone=true] should produce a new object? default `true`
 * @returns {generalObject} cleaned object
 * @memberof objects
 */
exports.objClean = function removeFalsyValues(obj, clone = true) {
	let target;
	//where objects have falsy values, delete those keys
	if (clone) target = JSON.parse(JSON.stringify(obj));
	if (!clone) target = obj;

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
 * @example
 * objDefault({foo: "bar"}, {foo: "qux", b: "m"}) // => {foo: 'bar', b: 'm'}
 * @param  {generalObject} obj - original object
 * @param  {Object} defs - props to add without overriding
 * @returns {generalObject} an object which has `defs` props
 * @memberof objects
 */
exports.objDefault = function assignDefaultProps(obj, ...defs) {
	return Object.assign({}, obj, ...defs.reverse(), obj);
};

/**
 * deep equality match for any two objects
 * @example
 * objMatch({f: {g: {h: 42}}}, {f: {g: {x: 42}}}) // => false
 * @param  {Object} obj - object A
 * @param  {Object} source - object B
 * @returns {boolean} do objects A & B (deeply) match?
 * @memberof objects
 */
exports.objMatch = function doObjectsMatch(obj, source) {
	return Object.keys(source).every(key => obj.hasOwnProperty(key) && obj[key] === source[key]);
};

/**
 * efficient object cloning; outperforms `parse(stringify())` by 100x
 * @example
 * objClone({f: {g: {h : 42}}}) // => { f: { g: { h: 42 } } }
 * @param  {Object} thing - object to clone
 * @param {Object} [opts]
 * @returns {Object} deep copy of object
 * @memberof objects
 */
exports.objClone = function deepClone(thing, opts) {
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
 * visit every property of an object; turn "number" values into numbers
 * @example
 * objTypecast({foo: {bar: '42'}}) // => {foo: {bar: 42}}
 * @param  {object} obj - object to traverse
 * @param  {boolean} [isClone=false] - default `false`; if `true` will mutate the passed in object
 * @returns {Object} object with all "numbers" as proper numbers
 * @memberof objects
 */
exports.objTypecast = function mutateObjValToIntegers(obj, isClone = false) {
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
 * @example
 * //bar is a promise
 * await objAwait({foo: bar()}) // => {foo: "resolved_bar"}
 * @param  {Object<string, Promise>} obj object
 * @returns {Promise<generalObject>} the resolved values of the object's keys
 * @memberof objects
 */
exports.objAwait = function resolveObjVals(obj) {
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
 * explicitly remove keys with `null` or `undefined` values
 * @example
 * removeNulls({foo: "bar", baz: null}) // => {foo: "bar"}
 * @param  {Object} objWithNullOrUndef - an object with `null` or `undefined` values
 * @returns {Object} an object without `null` or `undefined` values
 * @note WARNING mutates object
 * @memberof objects
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


/**
 * deeply flatten as nested object; use `.` notation for nested keys
 * @example
 * flatten({foo: {bar: "baz"}}) => {"foo.bar": "baz"}
 * @param  {Object} obj object to flatten
 * @param  {Array} roots=[] lineage for recursion
 * @param  {string} sep='.' separator to use
 * @memberof objects
 * @return {Object}
 */
exports.flatten = function flattenObjectWithDotNotation(obj, roots = [], sep = '.') {
	// ? https://stackoverflow.com/a/61602592
	// find props of given object
	return Object.keys(obj)
		// return an object by iterating props
		.reduce((memo, prop) => Object.assign(
			// create a new object
			{},
			// include previously returned object
			memo,
			Object.prototype.toString.call(obj[prop]) === '[object Object]'
				// keep working if value is an object
				? exports.flatten(obj[prop], roots.concat([prop]), sep)
				// include current prop and value and prefix prop with the roots
				: { [roots.concat([prop]).join(sep)]: obj[prop] }
		), {});
};

/**
 * map over an object's values and return a new object
 * @example
 * objMap({foo: 2, bar: 4}, val => val * 2) => {foo: 4, bar: 8}
 * @param  {Object} object object iterate
 * @param  {function} mapFn function with signature `(val) => {}`
 * @return {Object}
 * @memberof objects
 */
exports.objMap = function mapOverObjectProps(object, mapFn) {
	return Object.keys(object).reduce(function (result, key) {
		result[key] = mapFn(object[key]);
		return result;
	}, {});
};



/**
 * find a key in an object that has a particular value
 * @example
 * getKey({foo: "bar"}, "bar") => "foo"
 * @param  {Object} object object to search for
 * @param  {Object} value value withing that object to search for
 * @return {string}
 * @memberof objects
 */
exports.getKey = function getObjKeysByValue(object, value) {
	// ? https://stackoverflow.com/a/28191966
	return Object.keys(object).find(key => object[key] === value);
};

/*
-------
ARRAYS
--------
*/

/**
 * duplicate values within an array N times
 * @example
 * dupeVals(["a","b","c"]) // => [ 'a', 'b', 'c', 'a', 'b', 'c' ]
 * @param  {any[]} array - array to duplicate
 * @param  {number} [times=1] -  number of dupes per item; default `1`
 * @returns {any[]} duplicated array
 * @memberof arrays
 */
exports.dupeVals = function duplicateArrayValues(array, times = 1) {
	let dupeArray = [];

	for (let i = 0; i < times + 1; i++) {
		array.forEach(item => dupeArray.push(item));
	}

	return dupeArray;
};

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
 * @param  {string[]} keyNames - key names to dedupe values on
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
 * @param  {number} max - ending number
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
 * @param  {number} wait - ms to wait between executions
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
	return any;
};

/*
-------
LOGGING
-------
*/


/**
 * a cloud function compatible `console.log()`
 * @memberof logging
 * @param  {string} [message] - accompanying message
 * @param  {(string | JSON | object)} data - data to log; preferably structured
 * @param  {string} [severity=`INFO`] - {@link https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity | google sev label}; default `INFO`
 * 
 */
exports.sLog = function structuredLogger(message = "LOG:", data = {}, severity = 'INFO') {
	// Create a structured log with a severity level and message
	let structuredLog = {
		severity: severity,
		message: message,
		// Include additional properties from data at the same level as severity and message
		data: data
	};

	// Stringify the structured log and print it to the console
	console.log(JSON.stringify(structuredLog));
	return;
};


/**
 * create a structured logger with initial properties
 * @memberof logging
 * @example
* // Creating a new structured logger with initial properties
 * const logger = createStructuredLogger({ app: "MyApp", module: "Main" });
 * 
 * // Logging a message with the structured logger
 * logger.log("Application started", { user: "JohnDoe" });
 * 
 * // Creating a child logger inheriting initial properties and adding new ones
 * const childLogger = logger.createChild({ subModule: "Auth" });
 * 
 * // Logging a message with the child logger
 * childLogger.log("User logged in", { user: "JohnDoe" }, "INFO");
 * 
 * @param  {any} initialProps
 */
exports.logger = function createStructuredLogger(initialProps = {}) {
	return new StructuredLogger(initialProps);
};


class StructuredLogger {
	// The constructor of the class, where we initialize the properties
	constructor(initialProps = {}) {
		this.initialProps = initialProps;
	}

	// A method to create a child logger with inherited and additional properties
	createChild(additionalProps = {}) {
		return new StructuredLogger({ ...this.initialProps, ...additionalProps });
	}

	// The sLog method, adapted to include both initial and custom properties
	log(message = "LOG:", data = {}, severity = 'INFO') {
		let structuredLog = {
			severity: severity,
			message: message,
			data: { ...this.initialProps, ...data }
		};
		console.log(JSON.stringify(structuredLog));
		return;
	}
}


/**
 * a cloud function compatible `console.log()`
 * @memberof logging
 * @param  {(string | JSON | object)} data - data to log; preferably structured
 * @param  {string} [message] - accompanying message
 * @param  {string} [severity=`INFO`] - {@link https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity | google sev label}; default `INFO`
 * @param  {boolean} [isCloud=true] - force cloud logging
 * @deprecated use logger instead
 * 
 */
exports.cLog = function cloudFunctionLogger(data, message, severity = `INFO`, isCloud = true) {
	// not GCP
	// ? https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
	if (!process.env["FUNCTION_TARGET"] || !process.env["FUNCTION_SIGNATURE_TYPE"] || !isCloud) {
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
				message: message || `cloud log`,
			},
				data
			);

			console.log(JSON.stringify(structuredLog));
		}

		else {
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
 * - ex: `thing message #p`
 * @memberof logging
 * @param {string} thing - what is being 
 * @param {number} p - the number to show
 * @param {string} message - 
 * @returns {void}
 */
exports.progress = function showProgress(thing = "", p = "", message = "") {
	readline.cursorTo(process.stdout, 0);
	const msg = `${thing} ${message} ${exports.comma(p)}`.trim()
	process.stdout.write(`${msg}\t`);

};

class Timer {
	constructor(label) {
		this.label = label;
		this.startTime = null;
		this.endTime = null;
		this.delta = null;
		this.running = false;
		this.cycles = 0;
		this.stop = this.end;
	}
	start() {
		this.startTime = Date.now();
		this.running = true;
	}
	end(consoleOutput = false) {
		if (this.running) {
			this.running = false;
			this.cycles++;
			const endTime = Date.now();
			this.endTime = endTime;

			// @ts-ignore
			const currentDelta = this.endTime - this.startTime;
			if (!this.delta) {
				this.delta = currentDelta;
			}

			else {
				this.delta += currentDelta;
			}


			if (consoleOutput) {
				console.log(`${this.label}: ${this.prettyTime(this.delta)}`);
			}

		}
		else {
			console.log(`${this.label} has not been started...`);
		}

		return this.prettyTime(this.delta);
	}
	report(consoleOutput = true) {
		if (consoleOutput) {
			console.log(`${this.label} took ${this.prettyTime(this.delta)}`);
		}
		return {
			label: this.label,
			start: this.startTime || 0,
			end: this.endTime || 0,
			delta: this.delta || 0,
			human: this.prettyTime(this.delta),
			cycles: this.cycles

		};
	}
	prettyTime(milliseconds) {
		let totalSeconds = milliseconds / 1000;

		const levels = [
			[Math.floor(totalSeconds / 31536000), 'years'],
			[Math.floor((totalSeconds % 31536000) / 86400), 'days'],
			[Math.floor(((totalSeconds % 31536000) % 86400) / 3600), 'hours'],
			[Math.floor((((totalSeconds % 31536000) % 86400) % 3600) / 60), 'minutes']
		];

		let seconds = (totalSeconds % 60).toFixed(2);  // Round seconds to two decimal places
		levels.push([seconds, 'seconds']);  // Add seconds to levels array

		let result = '';

		for (let i = 0, max = levels.length; i < max; i++) {
			if (levels[i][0] == 0 || (i === max - 1 && levels[i][0] == "0.00")) continue;
			result += ` ${levels[i][0]} ${levels[i][0] === 1 ? levels[i][1].slice(0, -1) : levels[i][1]}`;
		}
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
 * @returns {function} func with signature: `(event, props = {}, cb = (res)=>{})`
 */
exports.tracker = function sendToMixpanel(app = 'akTools', token = "99a1209a992b3f9fba55a293e211186a", distinct_id = os.userInfo().username) {
	return function (eventName = "ping", props = {}, callback = (res) => { }) {
		const responses = [];
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
				let res;
				try {
					res = JSON.parse(body.toString('utf-8'));
				}
				catch (e) {
					res = body.toString('utf-8');
				}
				responses.push(res);
				if (responses.length === 2) {
					callback(responses);
				}
			});
		});

		reqEv.on('error', (e) => {
			// noop
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
				let res;
				try {
					res = JSON.parse(body.toString('utf-8'));
				}
				catch (e) {
					res = body.toString('utf-8');
				}
				responses.push(res);
				if (responses.length === 2) {
					callback(responses);
				}
			});
		});

		reqU.on('error', (e) => {
			// noop
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
};


/*
--------
ALIASES
--------
*/
exports.objFilt = exports.objFilter;
exports.copy = exports.clip;
exports.cleanObj = exports.objClean;
exports.clone = exports.objClone;
exports.awaitObj = exports.objAwait;
exports.typecastInt = exports.objTypecast;
exports.timer = exports.time;

exports.files = {
	ls: exports.ls,
	rm: exports.rm,
	touch: exports.touch,
	load: exports.load,
	mkdir: exports.mkdir
};
exports.validate = {
	isJSONStr: exports.isJSONStr,
	isJSON: exports.isJSON,
	is: exports.is,
	isNil: exports.isNil,
	similar: exports.similar
};
exports.display = {
	comma: exports.comma,
	truncate: exports.truncate,
	bytesHuman: exports.bytesHuman,
	json: exports.json,
	stripHTML: exports.stripHTML,
	multiReplace: exports.multiReplace,
	replaceAll: exports.replaceAll,
	toCSV: exports.toCSV
};
exports.maths = {
	rand: exports.rand,
	avg: exports.avg,
	calcSize: exports.calcSize,
	round: exports.round,
	uid: exports.uid,
	uuid: exports.uuid,
	md5: exports.md5,
	randName: exports.makeName
};
exports.objects = {
	rnKeys: exports.rnKeys,
	rnVals: exports.rnVals,
	objClean: exports.objClean,
	objDefault: exports.objDefault,
	objMatch: exports.objMatch,
	objClone: exports.objClone,
	objTypecast: exports.objTypecast,
	objAwait: exports.objAwait,
	removeNulls: exports.removeNulls,
	flatten: exports.flatten,
	objMap: exports.objMap,
	getKey: exports.getKey

};
exports.arrays = {};
exports.functions = {};
exports.logging = {};


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