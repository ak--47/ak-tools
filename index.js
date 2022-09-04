// AK's utils
// things to make things ... easier

//only vanilla deps
const path = require('path')
const fs = require('fs').promises
const { execSync } = require("child_process")
const readline = require('readline');


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

exports.commas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.truncate = function (text, chars = 500, useWordBoundary = true) {
    if (!text) {
        return ""
    }
    if (text.length <= chars) {
        return text;
    }
    var subString = text.substr(0, chars - 1);
    return (useWordBoundary ?
        subString.substr(0, subString.lastIndexOf(' ')) :
        subString) + "...";
};


exports.dupeValues = function (array, times = 1) {
    let dupeArray = [];

    for (let i = 0; i < times + 1; i++) {
        array.forEach(item => dupeArray.push(item));
    }

    return dupeArray;
}


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

exports.replaceAll = function (str, newStr) {

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
exports.round = function (number, decimalPlaces = 0) {
    return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces)
}


//utility function for visiting every single key on an object
exports.ensureIntegers = function (obj, isClone = false) {
    let target;
    if (isClone) {
        target = obj
    } else {
        target = exports.deepClone(obj)
    }

    Object.keys(target).forEach(key => {

        //recursion :(
        if (typeof target[key] === 'object') {
            exports.ensureIntegers(target[key], true);
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
}

//the best way to find strings that are integers in disguise
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#a_stricter_parse_function
function makeInteger(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value);
    } else {
        return NaN;
    }
}


//the best logging function ever
//https://stackoverflow.com/a/27610197/4808195
exports.log = function (item, maxDepth = 100, depth = 0) {
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


exports.deepDeDupe = function (arrayOfThings) {
    return Array.from(new Set(arrayOfThings.map(JSON.stringify))).map(JSON.parse)
    //another way: https://stackoverflow.com/a/56757215/4808195
    //[].filter((v, i, a) => a.findIndex(t => (t.funnelName === v.funnelName)) === i);
}

exports.capitalize = function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

//array shuffling
//https://stackoverflow.com/a/12646864/4808195
exports.shuffle = function(array, mutate = false) {
	let target;
	if (mutate) {
		target = array
	}
	else {
		target = exports.deepClone(array)
	}
    for (let i = target.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [target[i], target[j]] = [target[j], target[i]];
    }

    return target;
};

//random string makin'
//https://stackoverflow.com/a/1349426/4808195
exports.makeId = function(length = 64) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
};


exports.range = function (min, max, step = 1) {
	const result = [];
	step = !step ? 1 : step;
    max = max / step;
    for (var i = min; i <= max; i++) {
        result.push(i * step);
    }
    return result;
};

exports.showProgress = function(thing, p) {
    //readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${thing} processed ... ${p}`);
}