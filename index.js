// AK's utils
// things to make things ... easier
const path = require('path');
const fs = require('fs').promises;
const { existsSync, mkdirSync } = require('fs');
const readline = require('readline');
const http = require("https");
const os = require("os");


/*
-----
TYPES
-----
*/

/**
 * Arbitrary data
 * @typedef {(string|object[])} Data
 */



/*
------
FILES
------
*/

/** 
 * list directory contents
 * @param  {string} [dir=./] - directory to enumerate; default `./`
 * @param  {boolean} [objectMode=false] - return `{name: path}` instead of `[path]`; default `false`
 * @returns {string[]} `[]` of files in folder
 */
exports.ls = async function listFiles(dir = "./", objectMode = false) {
	let fileList = await fs.readdir(dir);
	if (!objectMode) {
		return fileList.map(fileName => path.resolve(`${dir}/${fileName}`));
	}
	let results = {};
	for (fileName of fileList) {
		// let keyName = fileName.split('.')
		results[fileName] = path.resolve(`${dir}/${fileName}`);
	}
	return results;
};

/**
 * remove a file or directory
 * @param  {string} fileNameOrPath - file or path to be removed
 * @returns {(string|boolean)} path or `false` if fail
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
 * @param  {string} fileNameOrPath - file to create
 * @param  {Data} [data=""] - data to write; default `""`
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
 * @param  {string} fileNameOrPath - file to create
 * @param  {boolean} [isJson=false] - is `data` JSON; default `false`
 * @param {string} [encoding=utf-8] - file encoring; default `utf-8`
 */
exports.load = async function loadFile(fileNameOrPath, isJson = false, encoding = 'utf-8') {
	let fileLoaded;

	try {
		fileLoaded = await fs.readFile(path.resolve(fileNameOrPath), encoding);
	} catch (e) {
		console.error(`${fileNameOrPath} not loaded!`);
		console.error(e);
	}

	if (isJson) {
		fileLoaded = JSON.parse(fileLoaded);
	}

	return fileLoaded;
};

/**
 * make a directory
 * @param  {string} [dirPath=./tmp] - path to create; default `./tmp`
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
 * @param  {string} data
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
 * @param  {(string | number)} num
 * @returns {string} formatted number 
 */
exports.comma = function addCommas(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * truncate a string; using an elipses (`...`)
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
 * @param  {object} data - any serializable object
 * @param  {number} [padding=2] - padding to use
 * @returns {string} valid json
 */
exports.json = function stringifyJSON(data, padding = 2) {
	return JSON.stringify(data, null, padding);
};

/**
 * strip all `<html>` tags from a string
 * @param  {string} str string with html tags
 * @returns {string} sanitized string
 * @note note: `<br>` tags are replace with `\n`
 */
exports.stripHTML = function removeHTMLEntities(str) {
	return str.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]*>?/gm, '');
};

/**
 * find and replace _many_ values in string
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
		text = text?.replaceAll(pair[0], pair[1] || " ");
	}

	//kill multiple spaces
	return text.split(" ").filter(x => x).join(" ");
};

/**
 * replace all occurance of `old` with `new`
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
 * @param  {Array[]} arr - data of the form `[ [], [], [] ]`
 * @param  {String[]} [headers=[]] - header column 
 * @param  {string} [delimiter=,] - delimeter for cells; default `,`
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
 *
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
 * @param  {...number} ...nums - numbers to average
 * @returns {number} average
 */
exports.avg = function calcAverage(...nums) {
	return nums.reduce((acc, val) => acc + val, 0) / nums.length;
};

/**
 * calculate the size (on disk)
 * @param  {JSON} data - JSON to estimate
 * @returns {number} estimated size in bytes
 */
exports.calcSize = function estimateSizeOnDisk(data) {
	//caculates size in bytes; assumes utf-8 encoding: https://stackoverflow.com/a/63805778 
	return Buffer.byteLength(JSON.stringify(data));
};

/**
 * round a number to a number of decimal places
 * @param  {number} number - number to round
 * @param  {number} [decimalPlaces=0] - decimal places; default `0`
 * @returns {number} rounded number
 */
exports.round = function roundsNumbers(number, decimalPlaces = 0) {
	//https://gist.github.com/djD-REK/068cba3d430cf7abfddfd32a5d7903c3
	return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);
};

/**
 * generate a random uid:
 * - `6NswVtnKWsvRGNTi0H2YtuqGwsqJi4dKW6qUgSiUx1XNctr4rkGRFOA9HRl9i60S`
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
 * @returns {string} a uuid 
 */
exports.uuid = function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};


/*
-------
OBJECTS
-------
*/

/**
 * rename object keys with a mapping object `{oldKey: newKey}`
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
 * @param  {Object} obj
 * @param  {Array[]} pairs `[['old', 'new']]`
 * @returns {Object} object with renamed values
 */
exports.rnVals = function renameValues(obj, pairs) {
	return JSON.parse(exports.multiReplace(JSON.stringify(obj), pairs));
};

/**
 * filter arrays by values or objects by keys
 * @param  {Object} hash - object or array to filter
 * @param  {callback} test_function - a function which is called on keys/values 
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
 * @param  {Object} obj
 * @returns cleaned object
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
 * @param  {Object} obj - original object
 * @param  {Object} ...defs - props to add without overriding
 * @returns {Object} an object which has `defs` props
 */
exports.objDefault = function assignDefaultProps(obj, ...defs) {
	return Object.assign({}, obj, ...defs.reverse(), obj);
};

/**
 * deep equality match for any two objects
 * @param  {Object} obj
 * @param  {Object} source
 * @returns {boolean} do objects match?
 */
exports.objMatch = function doObjectsMatch(obj, source) {
	return Object.keys(source).every(key => obj.hasOwnProperty(key) && obj[key] === source[key]);
};

/**
 * an efficient way to clone an Object; outpreforms `JSON.parse(JSON.strigify())` by 100x
 * @param  {Object} thing - object to clone
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
 * @param  {Object} objWithNullOrUndef - an object with `null` or `undefined` values
 * @returns {Object} an object without `null` or `undefined` values
 */
exports.removeNulls = function(objWithNullOrUndef) {
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
 * @param  {unknown} value - a value to test
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
 * @param  {} arrayOfThings
 */
exports.dedupe = function deepDeDupe(arrayOfThings) {
	return Array.from(new Set(arrayOfThings.map(JSON.stringify))).map(JSON.parse);
};

/**
 * @param  {} arr
 * @param  {} keyNames=[]
 */
exports.dedupeVal = function dedupeByValues(arr, keyNames = []) {
	// https://stackoverflow.com/a/56757215/4808195
	return arr.filter((v, i, a) => a.findIndex(v2 => keyNames.every(k => v2[k] === v[k])) === i);

};

/**
 * @param  {} sourceArray
 * @param  {} chunkSize
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
 * @param  {} array
 * @param  {} mutate=false
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
 * @param  {} min
 * @param  {} max
 * @param  {} step=1
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
 * @param  {} arr
 */
exports.deepFlat = function deepFlatten(arr) {
	return [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));
};

/**
 * @param  {} str
 * @param  {} pattern=/[^a-zA-Z-]+/
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
 * @param  {} fn
 * @param  {} ...args
 */
exports.attempt = async function tryToExec(fn, ...args) {
	try {
		return await fn(...args);
	} catch (e) {
		return e instanceof Error ? e : new Error(e);
	}
};

/**
 * @param  {} n
 * @param  {} iteratee
 * @param  {} context
 */
exports.times = function doNTimes(n, iteratee, context) {
	var accum = Array(Math.max(0, n));
	iteratee = optimizeCb(iteratee, context, 1);
	for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	return accum;
};

/**
 * @param  {} func
 * @param  {} wait
 * @param  {true} options={leading
 * @param  {true}} trailing
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
 * 
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

/*
-------
LOGGING
-------
*/

/**
 * @param  {"bar"}} data={foo
 * @param  {} message
 * @param  {} severity=`INFO`
 */
exports.cLog = function cloudFunctionLogger(data = { foo: "bar" }, message, severity = `INFO`) {
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
				message: message || `${moduleName || 'CF'} log`,
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
 * @param  {} item
 * @param  {} maxDepth=100
 * @param  {} depth=0
 */
exports.log = function comprehensiveLog(item, maxDepth = 100, depth = 0) {
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
 * @param  {} thing
 * @param  {} p
 */
exports.progress = function showProgress(thing, p) {
	//readline.clearLine(process.stdout);
	readline.cursorTo(process.stdout, 0);
	process.stdout.write(`${thing} processed ... ${p}`);
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
			result += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1]);
		};
		return result.trim();
	}
}
/**
 * @param  {} label
 */
exports.time = function (label) {
	return new Timer(label);
};

/**
 * @param  {} callback
 */
exports.quickTime = function timeTaken(callback) {
	console.time('timeTaken');
	const r = callback();
	console.timeEnd('timeTaken');
	return r;
};

/**
 * @param  {} app='akTools'
 * @param  {} token="99a1209a992b3f9fba55a293e211186a"
 * @param  {} distinct_id=os.userInfo(
 * @param  {} .username
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
					app: app,
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
 * @param  {} ms
 */
exports.sleep = function pauseFor(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};


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