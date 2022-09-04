// AK's utils
// things to make things ... easier

//only vanilla deps
const path = require('path')
const fs = require('fs').promises
const { createReadStream } = require('fs')
const { execSync } = require("child_process")
const makeDir = require('fs').mkdirSync


exports.listFiles = async function (dir = "./") {
    let fileList = await fs.readdir(dir);
    let results = {};
    for (fileName of fileList) {
        results[fileName.split('.')[0]] = path.resolve(`${dir}/${fileName}`);
    }
    return results
}


exports.removeFile = function (fileNameOrPath) {
    const removed = execSync(`rm -rf ${fileNameOrPath}`)
    return true;
}


exports.deepClone = function (thing, opts) {
    var newObject = {};
    if (thing instanceof Array) {
        return thing.map(function (i) { return exports.deepClone(i, opts); });
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
            newObject[key] = exports.deepClone(thing[key], opts);
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
}

exports.smartComma = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


exports.smartTruncate = function (text, n = 500, useWordBoundary = true) {
    if (!text) {
        return ""
    }
    if (text.length <= n) {
        return text;
    }
    var subString = text.substr(0, n - 1);
    return (useWordBoundary ?
        subString.substr(0, subString.lastIndexOf(' ')) :
        subString) + "...";
};

exports.stripHTML = function (str) {
    return str.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]*>?/gm, '')
}
exports.multiReplace = function (str, replacePairs = [
    ["|"],
    ["<"],
    [">"]
]) {
    let text = str;
    for (const pair of replacePairs) {
        text = text?.replaceAll(pair[0], pair[1] || " ")
    }

    //kill multiple spaces
    return text.split(" ").filter(x => x).join(" ")
}

exports.replaceAll = function(str, newStr){

	// If a regex pattern
	if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
		return this.replace(str, newStr);
	}

	// If a string
	return this.replace(new RegExp(str, 'g'), newStr);

};

exports.randNum = function (min = 1, max = 100) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//https://stackoverflow.com/a/45287523
exports.renameKeys = function (obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
        const newKey = newKeys[key] || key
        return {
            [newKey]: obj[key]
        }
    })
    return Object.assign({}, ...keyValues)
}

exports.objectFilter = function (hash, test_function) {
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
}

exports.chunkArray = function (sourceArray, chunkSize) {
    return sourceArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
}

//where objects have falsy values, delete those keys
exports.cleanObject = function (obj) {
    //dirtyClone
	let target = JSON.parse(JSON.stringify(obj))

    function isObject(val) {
        if (val === null) { return false; }
        return ((typeof val === 'function') || (typeof val === 'object'));
    }

    const isArray = target instanceof Array;

    for (var k in target) {
        // falsy values
        if (!Boolean(target[k])) {
            isArray ? target.splice(k, 1) : delete target[k]
        }

        //empty strings
        if (target[k] === "") {
            delete target[k]
        }

        // empty arrays
        if (Array.isArray(target[k]) && target[k]?.length === 0) {
            delete target[k]
        }

        // empty objects
        if (isObject(target[k])) {
            if (JSON.stringify(target[k]) === '{}') {
                delete target[k]
            }
        }

        // recursion
        if (isObject(target[k])) {
            exports.cleanObject(target[k])
        }
    }

    return target
}


//https://stackoverflow.com/a/14919494
exports.bytesHuman = function (bytes, si = false, dp = 2) {
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
}
//helper to open the finder
exports.revealMac = function (path, callback) {
    path = path || '/';
    let p = spawn('open', [path]);
    p.on('error', (err) => {
        p.kill();
        return callback(err);
    });
}

exports.json = function (data) {
    return JSON.stringify(data, null, 2)
}
//caculates size in bytes; assumes utf-8 encoding: https://stackoverflow.com/a/63805778 
exports.calcSize = function (event) {
    return Buffer.byteLength(JSON.stringify(event))
}
//https://gist.github.com/djD-REK/068cba3d430cf7abfddfd32a5d7903c3
exports.roundAccurately = function (number, decimalPlaces = 0) {
    return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces)
}