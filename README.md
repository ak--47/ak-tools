# ak-tools
 AK's (nearly typesafe) collections of useful things...cobbled together from various projects over the years...

install:

```bash
$ npm i ak-tools
```

use:
```javascript
const utils = require('ak-tools') 	//cjs
import {* as utils} from 'ak-tools' 	//esm
```

verify
```bash
$ npm run test
```

if using an IDE with jsdoc support you should have a good experience. 

## demo
```javascript
/**
 * make a folder, and a file
 * measure it... remove it
 * time the whole thing
**/
const u = require('ak-tools');
const timer = u.time('myProcess')
timer.start()

const newFolder = u.mkdir('./tmp')
const myData = [{foo: "bar"}, {baz: "qux"}]
const file = await u.touch('./tmp/data.json', u.dupeVals(myData, 1000), true);
const contents = await u.load(file)

const size = u.calcSize(u.json(contents))
const del = u.rm('./tmp/data.json')
timer.end(false)

const diag = { size: u.bytesHuman(size),...timer.report(false) }
u.log(diag)
```

## APIs

<dl>
<dt><a href="#files">files</a></dt>
<dd><p>file management utilities</p>
</dd>
<dt><a href="#validate">validate</a></dt>
<dd><p>data validation utilities</p>
</dd>
<dt><a href="#display">display</a></dt>
<dd><p>display, formatting, and other make it look right utilities</p>
</dd>
<dt><a href="#maths">maths</a></dt>
<dd><p>functions for maths, crypto, and maths</p>
</dd>
<dt><a href="#objects">objects</a></dt>
<dd><p>object utilities</p>
</dd>
<dt><a href="#arrays">arrays</a></dt>
<dd><p>array utilities</p>
</dd>
<dt><a href="#functions">functions</a></dt>
<dd><p>function utilities</p>
</dd>
<dt><a href="#logging">logging</a></dt>
<dd><p>logging, timers and other diagnostic utilities</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#makeName">makeName()</a> ⇒ <code>string</code></dt>
<dd><p>generate a random name (adjective + noun + verb + adverb)</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#generalObject">generalObject</a> : <code>Object.&lt;string, any&gt;</code></dt>
<dd><p>generic for <code>{}</code> w/string keys</p>
</dd>
<dt><a href="#arrayOfObjects">arrayOfObjects</a> : <code><a href="#generalObject">Array.&lt;generalObject&gt;</a></code></dt>
<dd><p>generic for <code>[{},{},{}]</code></p>
</dd>
<dt><a href="#GCSUri">GCSUri</a></dt>
<dd></dd>
<dt><a href="#filterCallback">filterCallback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="files"></a>

## files
file management utilities



* [files](#files)
    * [.ls([dir], [objectMode])](#files.ls) ⇒ <code>Promise.&lt;(Array.&lt;string&gt;\|generalObject)&gt;</code>
    * [.rm(fileNameOrPath)](#files.rm) ⇒ <code>Promise.&lt;(string\|boolean\|void)&gt;</code>
    * [.touch(fileNameOrPath, [data], [isJson])](#files.touch) ⇒ <code>Promise.&lt;(string\|false)&gt;</code>
    * [.load(fileNameOrPath, [isJson], [encoding])](#files.load) ⇒ <code>Promise.&lt;(string\|generalObject\|arrayOfObjects\|any)&gt;</code>
    * [.mkdir([dirPath])](#files.mkdir) ⇒ <code>string</code>

<a name="files.ls"></a>

### files.ls([dir], [objectMode]) ⇒ <code>Promise.&lt;(Array.&lt;string&gt;\|generalObject)&gt;</code>
list directory contents

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>Promise.&lt;(Array.&lt;string&gt;\|generalObject)&gt;</code> - `[]` or `{}` of files in folder  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dir] | <code>string</code> | <code>&#x27;./&#x27;</code> | directory to enumerate; default `./` |
| [objectMode] | <code>boolean</code> | <code>false</code> | return `{name: path}` instead of `[path]`; default `false` |

**Example**  
```js
await ls('./tmp') // => []
await ls('./tmp', true) // => {}
```
<a name="files.rm"></a>

### files.rm(fileNameOrPath) ⇒ <code>Promise.&lt;(string\|boolean\|void)&gt;</code>
remove a file or directory

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>Promise.&lt;(string\|boolean\|void)&gt;</code> - path or `false` if fail  

| Param | Type | Description |
| --- | --- | --- |
| fileNameOrPath | <code>string</code> | file or path to be removed |

**Example**  
```js
await rm('./myfile.txt') // => '/path/to/myfile.txt' || false
```
<a name="files.touch"></a>

### files.touch(fileNameOrPath, [data], [isJson]) ⇒ <code>Promise.&lt;(string\|false)&gt;</code>
create a file

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>Promise.&lt;(string\|false)&gt;</code> - the name of the file  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fileNameOrPath | <code>string</code> |  | file to create |
| [data] | <code>string</code> \| [<code>generalObject</code>](#generalObject) \| [<code>arrayOfObjects</code>](#arrayOfObjects) | <code>\\</code> | data to write; default `""` |
| [isJson] | <code>boolean</code> | <code>false</code> | is `data` JSON; default `false` |

**Example**  
```js
await touch('newfile.txt', data)  // => '/path/to/newfile.txt' || false
await touch('newfile.json', data, true)  // => '/path/to/newfile.json' || false
```
<a name="files.load"></a>

### files.load(fileNameOrPath, [isJson], [encoding]) ⇒ <code>Promise.&lt;(string\|generalObject\|arrayOfObjects\|any)&gt;</code>
load a file into memory

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>Promise.&lt;(string\|generalObject\|arrayOfObjects\|any)&gt;</code> - the file in memory  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fileNameOrPath | <code>string</code> |  | file to create |
| [isJson] | <code>boolean</code> | <code>false</code> | is `data` JSON; default `false` |
| [encoding] | <code>string</code> | <code>utf-8</code> | file encoring; default `utf-8` |

**Example**  
```js
await load('myfile.txt')  // => 'my file contents' || false
await load('myfile.json', true)  // => {my: "data"} || false
```
<a name="files.mkdir"></a>

### files.mkdir([dirPath]) ⇒ <code>string</code>
make a directory with error handling and confirmation.

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>string</code> - the absolute path of the directory  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dirPath] | <code>string</code> | <code>\./tmp\</code> | path to create; default `./tmp` |

**Example**  
```js
const myTmpDir = mkdir('./tmp')
```
<a name="validate"></a>

## validate
data validation utilities



* [validate](#validate)
    * [.isJSONStr(string)](#validate.isJSONStr) ⇒ <code>boolean</code>
    * [.isJSON(data)](#validate.isJSON) ⇒ <code>boolean</code>
    * [.is(type, val)](#validate.is) ⇒ <code>boolean</code>
    * [.isNil(val)](#validate.isNil) ⇒ <code>boolean</code>
    * [.similar(o1, o2)](#validate.similar) ⇒ <code>boolean</code>
    * [.parseGCSUri(uri)](#validate.parseGCSUri) ⇒ [<code>GCSUri</code>](#GCSUri)
    * [.toBool(string)](#validate.toBool)

<a name="validate.isJSONStr"></a>

### validate.isJSONStr(string) ⇒ <code>boolean</code>
test if `string` has JSON structure

**Kind**: static method of [<code>validate</code>](#validate)  

| Param | Type |
| --- | --- |
| string | <code>string</code> | 

**Example**  
```js
isJSONStr('{"foo": "bar"}') // => true
```
<a name="validate.isJSON"></a>

### validate.isJSON(data) ⇒ <code>boolean</code>
test if `data` can be stringified as JSON

**Kind**: static method of [<code>validate</code>](#validate)  

| Param | Type |
| --- | --- |
| data | <code>string</code> \| <code>JSON</code> | 

**Example**  
```js
isJSON({foo: "bar"}) // => true
```
<a name="validate.is"></a>

### validate.is(type, val) ⇒ <code>boolean</code>
check if a `type` matches a `value`

**Kind**: static method of [<code>validate</code>](#validate)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>&#x27;string&#x27;</code> \| <code>any</code> | a native type like `Number` or `Boolean` |
| val | <code>any</code> | any value to check |

**Example**  
```js
is(Number, 42) // => true
```
<a name="validate.isNil"></a>

### validate.isNil(val) ⇒ <code>boolean</code>
check if a `val` is `null` or `undefined`

**Kind**: static method of [<code>validate</code>](#validate)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>any</code> | value to check |

**Example**  
```js
isNil(null) // => true
```
<a name="validate.similar"></a>

### validate.similar(o1, o2) ⇒ <code>boolean</code>
check if `a` and `b` have similar shape (keys), recursively

**Kind**: static method of [<code>validate</code>](#validate)  
**Returns**: <code>boolean</code> - do they have the same shape?  

| Param | Type | Description |
| --- | --- | --- |
| o1 | [<code>generalObject</code>](#generalObject) | first obj |
| o2 | [<code>generalObject</code>](#generalObject) | second obj |

**Example**  
```js
similar({a: "foo"}, {a: "bar"}) // => true
```
<a name="validate.parseGCSUri"></a>

### validate.parseGCSUri(uri) ⇒ [<code>GCSUri</code>](#GCSUri)
turn a gcs uri into a bucket and file

**Kind**: static method of [<code>validate</code>](#validate)  

| Param | Type |
| --- | --- |
| uri | <code>string</code> | 

**Example**  
```js
parseGCSUri(`gcs://foo/bar.txt`) // => {uri: "gcs://foo/bar.txt", bucket: "foo", file: "bar.txt"}
```
<a name="validate.toBool"></a>

### validate.toBool(string)
turns a string into a boolean

**Kind**: static method of [<code>validate</code>](#validate)  

| Param | Type |
| --- | --- |
| string | <code>string</code> | 

<a name="display"></a>

## display
display, formatting, and other "make it look right" utilities



* [display](#display)
    * [.comma(num)](#display.comma) ⇒ <code>string</code>
    * [.truncate(text, [chars], [useWordBoundary])](#display.truncate) ⇒ <code>string</code>
    * [.bytesHuman(bytes, [dp], [si])](#display.bytesHuman) ⇒ <code>string</code>
    * [.json(data, [padding])](#display.json) ⇒ <code>string</code> \| <code>false</code>
    * [.stripHTML(str)](#display.stripHTML) ⇒ <code>string</code>
    * [.multiReplace(str, [replacePairs])](#display.multiReplace) ⇒ <code>string</code>
    * [.replaceAll(oldVal, newVal)](#display.replaceAll) ⇒ <code>string</code>
    * [.toCSV(arr, [headers], [delimiter])](#display.toCSV) ⇒ <code>string</code>
    * [.unBase64(b64Str)](#display.unBase64) ⇒

<a name="display.comma"></a>

### display.comma(num) ⇒ <code>string</code>
turn a number into a comma separated (human readable) string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - formatted number  

| Param | Type |
| --- | --- |
| num | <code>string</code> \| <code>number</code> | 

**Example**  
```js
comma(1000) // => "1,000"
```
<a name="display.truncate"></a>

### display.truncate(text, [chars], [useWordBoundary]) ⇒ <code>string</code>
truncate a string w/ellipses

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - truncated string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | text to truncate |
| [chars] | <code>number</code> | <code>500</code> | # of max characters |
| [useWordBoundary] | <code>boolean</code> | <code>true</code> | don't break words; default `true` |

**Example**  
```js
truncate('foo bar baz', 3) // => 'foo...'
```
<a name="display.bytesHuman"></a>

### display.bytesHuman(bytes, [dp], [si]) ⇒ <code>string</code>
turn a number (of bytes) into a human readable string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - # of bytes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bytes | <code>number</code> |  | number of bytes to convert |
| [dp] | <code>number</code> | <code>2</code> | decimal points; default `2` |
| [si] | <code>boolean</code> | <code>false</code> | threshold of 1000 or 1024; default `false` |

**Example**  
```js
bytesHuman(10000000) // => '9.54 MiB'
```
<a name="display.json"></a>

### display.json(data, [padding]) ⇒ <code>string</code> \| <code>false</code>
stringify object to json

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> \| <code>false</code> - valid json  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>object</code> |  | any serializable object |
| [padding] | <code>number</code> | <code>2</code> | padding to use |

**Example**  
```js
json({foo: "bar"}) => '{"foo": "bar"}'
```
<a name="display.stripHTML"></a>

### display.stripHTML(str) ⇒ <code>string</code>
strip all `<html>` tags from a string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - sanitized string  
**Note**: note: `<br>` tags are replace with `\n`  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | string with html tags |

**Example**  
```js
stripHTML(`<div>i am <br/>text`) // => "i am \n text"
```
<a name="display.multiReplace"></a>

### display.multiReplace(str, [replacePairs]) ⇒ <code>string</code>
find and replace _many_ values in string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - multi-replaced string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | string to replace |
| [replacePairs] | <code>Array.&lt;Array.&lt;string, string&gt;&gt;</code> | <code>[[|],[&lt;],[&gt;]]</code> | shape: `[ [old, new] ]` |

**Example**  
```js
multiReplace('red fish said', [["red", "blue"],["said"]]) // => "blue fish"
```
<a name="display.replaceAll"></a>

### display.replaceAll(oldVal, newVal) ⇒ <code>string</code>
replace all occurrence of `old` with `new`

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - replaced result  
**Note**: this CAN be called on any string directly  

| Param | Type | Description |
| --- | --- | --- |
| oldVal | <code>string</code> \| <code>RegExp</code> | old value |
| newVal | <code>string</code> | new value |

**Example**  
```js
'foo bar'.replaceAll('foo', 'qux') // => 'qux bar'
```
<a name="display.toCSV"></a>

### display.toCSV(arr, [headers], [delimiter]) ⇒ <code>string</code>
convert array of arrays to CSV like string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - a valid CSV  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>Array.&lt;(Array.&lt;String&gt;\|Array.&lt;Number&gt;)&gt;</code> |  | data of the form `[ [], [], [] ]` |
| [headers] | <code>Array.&lt;String&gt;</code> | <code>[]</code> | header column |
| [delimiter] | <code>string</code> | <code>\,\</code> | delimiter for cells; default `,` |

**Example**  
```js
toCSV([[1,2],[3,4]], ["foo", "bar"]) // => '"foo","bar"\n"1","2"\n"3","4"'
```
<a name="display.unBase64"></a>

### display.unBase64(b64Str) ⇒
serialize a base64 string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: dict or array of data  

| Param | Type | Description |
| --- | --- | --- |
| b64Str | <code>string</code> | base64 encoded JSON data |

**Example**  
```js
unBase64(`eyJmb28iOiAiYmFyIn0=`) => {"foo": "bar"}
```
<a name="maths"></a>

## maths
functions for maths, crypto, and maths



* [maths](#maths)
    * [.rand(min, max)](#maths.rand) ⇒ <code>number</code>
    * [.avg(...nums)](#maths.avg) ⇒ <code>number</code>
    * [.calcSize(data)](#maths.calcSize) ⇒ <code>number</code>
    * [.round(number, [decimalPlaces])](#maths.round) ⇒ <code>number</code>
    * [.uid([length])](#maths.uid) ⇒ <code>string</code>
    * [.uuid()](#maths.uuid) ⇒ <code>string</code>
    * [.md5(data)](#maths.md5) ⇒ <code>string</code>

<a name="maths.rand"></a>

### maths.rand(min, max) ⇒ <code>number</code>
random integer between `min` and `max` (inclusive)

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>number</code> - random number  
**Note**: this is not cryptographically safe  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| min | <code>number</code> | <code>1</code> | minimum |
| max | <code>number</code> | <code>100</code> | maximum |

**Example**  
```js
rand(1,10) // 1 or 2 or 3 ... or 10
```
<a name="maths.avg"></a>

### maths.avg(...nums) ⇒ <code>number</code>
calculate average of `...nums`

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>number</code> - average  

| Param | Type | Description |
| --- | --- | --- |
| ...nums | <code>number</code> | numbers to average |

**Example**  
```js
avg(1,2,3) // => 2
```
<a name="maths.calcSize"></a>

### maths.calcSize(data) ⇒ <code>number</code>
calculate the size (on disk)

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>number</code> - estimated size in bytes  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> \| [<code>generalObject</code>](#generalObject) | JSON to estimate |

**Example**  
```js
calcSize({foo: "bar"}) // => 13
```
<a name="maths.round"></a>

### maths.round(number, [decimalPlaces]) ⇒ <code>number</code>
round a number to a number of decimal places

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| number | <code>number</code> |  | number to round |
| [decimalPlaces] | <code>number</code> | <code>0</code> | decimal places; default `0` |

**Example**  
```js
round(3.14159, 3) // => 3.142
```
<a name="maths.uid"></a>

### maths.uid([length]) ⇒ <code>string</code>
generate a random uid:

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>string</code> - a uid of specified length  
**Note**: not cryptographically safe  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [length] | <code>number</code> | <code>64</code> | length of id; default `64` |

**Example**  
```js
uid(4) // => 'AwD9rbntSj'
```
<a name="maths.uuid"></a>

### maths.uuid() ⇒ <code>string</code>
generated a uuid in v4 format:

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>string</code> - a uuid  
**Note**: not cryptographically safe  
**Example**  
```js
uuid() // => "f47e2fdf-e387-4a39-9bb9-80b0ed950b48"
```
<a name="maths.md5"></a>

### maths.md5(data) ⇒ <code>string</code>
calculate the md5 hash of any data

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>string</code> - md5 hash of `data  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | data to hash |

**Example**  
```js
md5({foo: "bar"}) // => "d41d8cd98f00b204e9800998ecf8427e"
```
<a name="objects"></a>

## objects
object utilities



* [objects](#objects)
    * [.rnKeys(obj, newKeys)](#objects.rnKeys) ⇒ [<code>generalObject</code>](#generalObject)
    * [.rnVals(obj, pairs)](#objects.rnVals) ⇒ [<code>generalObject</code>](#generalObject)
    * [.objFilter(hash, test_function, [keysOrValues])](#objects.objFilter) ⇒ [<code>generalObject</code>](#generalObject)
    * [.objClean(obj, [clone])](#objects.objClean) ⇒ [<code>generalObject</code>](#generalObject)
    * [.objDefault(obj, defs)](#objects.objDefault) ⇒ [<code>generalObject</code>](#generalObject)
    * [.objMatch(obj, source)](#objects.objMatch) ⇒ <code>boolean</code>
    * [.objClone(thing, [opts])](#objects.objClone) ⇒ <code>Object</code>
    * [.objTypecast(obj, [isClone])](#objects.objTypecast) ⇒ <code>Object</code>
    * [.objAwait(obj)](#objects.objAwait) ⇒ [<code>Promise.&lt;generalObject&gt;</code>](#generalObject)
    * [.removeNulls(objWithNullOrUndef)](#objects.removeNulls) ⇒ <code>Object</code>
    * [.flatten(obj, roots, sep)](#objects.flatten) ⇒ <code>Object</code>
    * [.objMap(object, mapFn)](#objects.objMap) ⇒ <code>Object</code>
    * [.getKey(object, value)](#objects.getKey) ⇒ <code>string</code>

<a name="objects.rnKeys"></a>

### objects.rnKeys(obj, newKeys) ⇒ [<code>generalObject</code>](#generalObject)
rename object keys with a mapping object

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: [<code>generalObject</code>](#generalObject) - new object with renamed keys  

| Param | Type | Description |
| --- | --- | --- |
| obj | [<code>generalObject</code>](#generalObject) | object to rename |
| newKeys | [<code>generalObject</code>](#generalObject) | map of form `{oldKey: newKey}` |

**Example**  
```js
rnKeys({foo: 'bar'}, {foo: 'baz'}) // => {baz: "bar"}
```
<a name="objects.rnVals"></a>

### objects.rnVals(obj, pairs) ⇒ [<code>generalObject</code>](#generalObject)
rename object values using a mapping array

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: [<code>generalObject</code>](#generalObject) - object with renamed values  

| Param | Type | Description |
| --- | --- | --- |
| obj | [<code>generalObject</code>](#generalObject) |  |
| pairs | <code>Array.&lt;Array.&lt;string, string&gt;&gt;</code> | `[['old', 'new']]` |

**Example**  
```js
rnVals({foo: "bar"}, [["bar","baz"]) // => {foo: "baz"}
```
<a name="objects.objFilter"></a>

### objects.objFilter(hash, test_function, [keysOrValues]) ⇒ [<code>generalObject</code>](#generalObject)
filter objects by values or objects by keys; like `map()` for objects

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: [<code>generalObject</code>](#generalObject) - filtered object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| hash | [<code>generalObject</code>](#generalObject) |  | object or array to filter |
| test_function | [<code>filterCallback</code>](#filterCallback) |  | a function which is called on keys/values |
| [keysOrValues] | <code>key</code> \| <code>value</code> | <code>value</code> | test keys or values; default `value` |

**Example**  
```js
const d = {foo: "bar", baz: "qux"}
objFilter(d, x => x.startsWith('b')) // => {foo: "bar"}
objFilter(d, x => x.startsWith('f'), 'key') // => {foo: "bar"}
```
<a name="objects.objClean"></a>

### objects.objClean(obj, [clone]) ⇒ [<code>generalObject</code>](#generalObject)
removes the following from deeply nested objects:
- `null` | `undefined` | `{}` | `[]` | `""`

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: [<code>generalObject</code>](#generalObject) - cleaned object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | [<code>generalObject</code>](#generalObject) |  | object to clean |
| [clone] | <code>boolean</code> | <code>true</code> | should produce a new object? default `true` |

**Example**  
```js
objClean({foo: null, bar: undefined, baz: ""}) // => {}
```
<a name="objects.objDefault"></a>

### objects.objDefault(obj, defs) ⇒ [<code>generalObject</code>](#generalObject)
apply default props to an object; don't override values from source

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: [<code>generalObject</code>](#generalObject) - an object which has `defs` props  

| Param | Type | Description |
| --- | --- | --- |
| obj | [<code>generalObject</code>](#generalObject) | original object |
| defs | <code>Object</code> | props to add without overriding |

**Example**  
```js
objDefault({foo: "bar"}, {foo: "qux", b: "m"}) // => {foo: 'bar', b: 'm'}
```
<a name="objects.objMatch"></a>

### objects.objMatch(obj, source) ⇒ <code>boolean</code>
deep equality match for any two objects

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>boolean</code> - do objects A & B (deeply) match?  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | object A |
| source | <code>Object</code> | object B |

**Example**  
```js
objMatch({f: {g: {h: 42}}}, {f: {g: {x: 42}}}) // => false
```
<a name="objects.objClone"></a>

### objects.objClone(thing, [opts]) ⇒ <code>Object</code>
efficient object cloning; outperforms `parse(stringify())` by 100x

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - deep copy of object  

| Param | Type | Description |
| --- | --- | --- |
| thing | <code>Object</code> | object to clone |
| [opts] | <code>Object</code> |  |

**Example**  
```js
objClone({f: {g: {h : 42}}}) // => { f: { g: { h: 42 } } }
```
<a name="objects.objTypecast"></a>

### objects.objTypecast(obj, [isClone]) ⇒ <code>Object</code>
visit every property of an object; turn "number" values into numbers

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - object with all "numbers" as proper numbers  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>object</code> |  | object to traverse |
| [isClone] | <code>boolean</code> | <code>false</code> | default `false`; if `true` will mutate the passed in object |

**Example**  
```js
objTypecast({foo: {bar: '42'}}) // => {foo: {bar: 42}}
```
<a name="objects.objAwait"></a>

### objects.objAwait(obj) ⇒ [<code>Promise.&lt;generalObject&gt;</code>](#generalObject)
utility to `await` object values

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: [<code>Promise.&lt;generalObject&gt;</code>](#generalObject) - the resolved values of the object's keys  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object.&lt;string, Promise&gt;</code> | object |

**Example**  
```js
//bar is a promise
await objAwait({foo: bar()}) // => {foo: "resolved_bar"}
```
<a name="objects.removeNulls"></a>

### objects.removeNulls(objWithNullOrUndef) ⇒ <code>Object</code>
explicitly remove keys with `null` or `undefined` values

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - an object without `null` or `undefined` values  
**Note**: WARNING mutates object  

| Param | Type | Description |
| --- | --- | --- |
| objWithNullOrUndef | <code>Object</code> | an object with `null` or `undefined` values |

**Example**  
```js
removeNulls({foo: "bar", baz: null}) // => {foo: "bar"}
```
<a name="objects.flatten"></a>

### objects.flatten(obj, roots, sep) ⇒ <code>Object</code>
deeply flatten as nested object; use `.` notation for nested keys

**Kind**: static method of [<code>objects</code>](#objects)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>Object</code> |  | object to flatten |
| roots | <code>Array</code> | <code>[</code> | lineage for recursion |
| sep | <code>string</code> | <code>&#x27;.&#x27;</code> | separator to use |

**Example**  
```js
flatten({foo: {bar: "baz"}}) => {"foo.bar": "baz"}
```
<a name="objects.objMap"></a>

### objects.objMap(object, mapFn) ⇒ <code>Object</code>
map over an object's values and return a new object

**Kind**: static method of [<code>objects</code>](#objects)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | object iterate |
| mapFn | <code>function</code> | function with signature `(val) => {}` |

**Example**  
```js
objMap({foo: 2, bar: 4}, val => val * 2) => {foo: 4, bar: 8}
```
<a name="objects.getKey"></a>

### objects.getKey(object, value) ⇒ <code>string</code>
find a key in an object that has a particular value

**Kind**: static method of [<code>objects</code>](#objects)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | object to search for |
| value | <code>Object</code> | value withing that object to search for |

**Example**  
```js
getKey({foo: "bar"}, "bar") => "foo"
```
<a name="arrays"></a>

## arrays
array utilities



* [arrays](#arrays)
    * [.dupeVals(array, [times])](#arrays.dupeVals) ⇒ <code>Array.&lt;any&gt;</code>
    * [.dedupe(arrayOfThings)](#arrays.dedupe) ⇒ <code>Array.&lt;any&gt;</code>
    * [.dedupeVal(arr, keyNames)](#arrays.dedupeVal) ⇒ <code>Array.&lt;any&gt;</code>
    * [.chunk(sourceArray, chunkSize)](#arrays.chunk) ⇒ <code>Array.&lt;any&gt;</code>
    * [.shuffle(array, [mutate])](#arrays.shuffle) ⇒ <code>Array.&lt;any&gt;</code>
    * [.range(min, max, [step])](#arrays.range) ⇒ <code>Array.&lt;number&gt;</code>
    * [.deepFlat(arr)](#arrays.deepFlat) ⇒ <code>Array.&lt;any&gt;</code>
    * [.strToArr(str)](#arrays.strToArr) ⇒ <code>Array.&lt;string&gt;</code>

<a name="arrays.dupeVals"></a>

### arrays.dupeVals(array, [times]) ⇒ <code>Array.&lt;any&gt;</code>
duplicate values within an array N times

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - duplicated array  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array.&lt;any&gt;</code> |  | array to duplicate |
| [times] | <code>number</code> | <code>1</code> | number of dupes per item; default `1` |

**Example**  
```js
dupeVals(["a","b","c"]) // => [ 'a', 'b', 'c', 'a', 'b', 'c' ]
```
<a name="arrays.dedupe"></a>

### arrays.dedupe(arrayOfThings) ⇒ <code>Array.&lt;any&gt;</code>
de-dupe array of objects w/Set, stringify, parse

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - deduped array  

| Param | Type | Description |
| --- | --- | --- |
| arrayOfThings | <code>any</code> | array to dedupe |

<a name="arrays.dedupeVal"></a>

### arrays.dedupeVal(arr, keyNames) ⇒ <code>Array.&lt;any&gt;</code>
de-dupe array of objects by value of specific keys

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - deduped array of objected  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;any&gt;</code> | array to dedupe |
| keyNames | <code>Array.&lt;string&gt;</code> | key names to dedupe values on |

<a name="arrays.chunk"></a>

### arrays.chunk(sourceArray, chunkSize) ⇒ <code>Array.&lt;any&gt;</code>
chunk array of objects into array of arrays with each less than or equal to `chunkSize`
- `[{},{},{},{}]` => `[[{},{}],[{},{}]]`

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - chunked array  

| Param | Type | Description |
| --- | --- | --- |
| sourceArray | <code>Array.&lt;any&gt;</code> | array to batch |
| chunkSize | <code>number</code> | max length of each batch |

<a name="arrays.shuffle"></a>

### arrays.shuffle(array, [mutate]) ⇒ <code>Array.&lt;any&gt;</code>
fisher-yates shuffle of array elements

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - shuffled array  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array.&lt;any&gt;</code> |  | array to shuffle |
| [mutate] | <code>boolean</code> | <code>false</code> | mutate array in place? default: `false` |

<a name="arrays.range"></a>

### arrays.range(min, max, [step]) ⇒ <code>Array.&lt;number&gt;</code>
the classic python built-in for generating arrays of integers

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;number&gt;</code> - a range of integers  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| min | <code>number</code> |  | starting number |
| max | <code>number</code> |  | ending number |
| [step] | <code>number</code> | <code>1</code> | step for each interval; default `1` |

<a name="arrays.deepFlat"></a>

### arrays.deepFlat(arr) ⇒ <code>Array.&lt;any&gt;</code>
recursively and deeply flatten a nested array of objects
- ex: `[ [ [{},{}], {}], {} ]` => `[{},{},{},{}]`

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - flat array  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;any&gt;</code> | array to flatten |

<a name="arrays.strToArr"></a>

### arrays.strToArr(str) ⇒ <code>Array.&lt;string&gt;</code>
extract words from a string as an array
- ex `"foo bar baz"` => `['foo','bar','baz']`

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;string&gt;</code> - extracted words  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | string to extract from |

<a name="functions"></a>

## functions
function utilities



* [functions](#functions)
    * [.attempt(fn, ...args)](#functions.attempt)
    * [.times(n, iteratee)](#functions.times)
    * [.throttle(func, wait, [options])](#functions.throttle)
    * [.compose()](#functions.compose) ⇒ <code>function</code>
    * [.id(any)](#functions.id) ⇒ <code>any</code>

<a name="functions.attempt"></a>

### functions.attempt(fn, ...args)
`try{} catch{}` a function; return results

**Kind**: static method of [<code>functions</code>](#functions)  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 
| ...args | <code>any</code> | 

<a name="functions.times"></a>

### functions.times(n, iteratee)
do a function `N` times

**Kind**: static method of [<code>functions</code>](#functions)  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | number of times |
| iteratee | <code>function</code> | function to run |

<a name="functions.throttle"></a>

### functions.throttle(func, wait, [options])
throttle a functions's execution every `N` ms

**Kind**: static method of [<code>functions</code>](#functions)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| func | <code>function</code> |  | function to throttle |
| wait | <code>number</code> |  | ms to wait between executions |
| [options] | <code>object</code> | <code>{leading: true, trailing: false}</code> |  |

<a name="functions.compose"></a>

### functions.compose() ⇒ <code>function</code>
compose functions, left-to-right
- ex: `c(a,b,c)` => `a(b(c()))`

**Kind**: static method of [<code>functions</code>](#functions)  
**Returns**: <code>function</code> - a composed chain of functions  
<a name="functions.id"></a>

### functions.id(any) ⇒ <code>any</code>
a function which returns it's value

**Kind**: static method of [<code>functions</code>](#functions)  
**Returns**: <code>any</code> - the same thing  

| Param | Type | Description |
| --- | --- | --- |
| any | <code>any</code> | anything |

<a name="logging"></a>

## logging
logging, timers and other diagnostic utilities



* [logging](#logging)
    * [.sLog([message], data, [severity])](#logging.sLog)
    * [.logger(initialProps)](#logging.logger)
    * ~~[.cLog(data, [message], [severity], [isCloud])](#logging.cLog)~~
    * [.log(item, [depth], [maxDepth])](#logging.log) ⇒ <code>void</code>
    * [.progress(thing, p, message)](#logging.progress) ⇒ <code>void</code>
    * [.time(label)](#logging.time) ⇒ <code>Timer</code>
    * [.quickTime(callback)](#logging.quickTime)
    * [.tracker([app], [token], [distinct_id])](#logging.tracker) ⇒ <code>function</code>
    * [.sleep(ms)](#logging.sleep)
    * [.clip(data)](#logging.clip) ⇒ <code>void</code>
    * [.prettyTime(milliseconds)](#logging.prettyTime) ⇒ <code>string</code>

<a name="logging.sLog"></a>

### logging.sLog([message], data, [severity])
a cloud function compatible `console.log()`

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [message] | <code>string</code> |  | accompanying message |
| data | <code>string</code> \| <code>JSON</code> \| <code>object</code> |  | data to log; preferably structured |
| [severity] | <code>string</code> | <code>&#x60;INFO&#x60;</code> | [ google sev label](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity); default `INFO` |

<a name="logging.logger"></a>

### logging.logger(initialProps)
create a structured logger with initial properties

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type |
| --- | --- |
| initialProps | <code>any</code> | 

**Example**  
```js
// Creating a new structured logger with initial properties
const logger = createStructuredLogger({ app: "MyApp", module: "Main" });

// Logging a message with the structured logger
logger.log("Application started", { user: "JohnDoe" });

// Creating a child logger inheriting initial properties and adding new ones
const childLogger = logger.createChild({ subModule: "Auth" });

// Logging a message with the child logger
childLogger.log("User logged in", { user: "JohnDoe" }, "INFO");
```
<a name="logging.cLog"></a>

### ~~logging.cLog(data, [message], [severity], [isCloud])~~
***Deprecated***

a cloud function compatible `console.log()`

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>string</code> \| <code>JSON</code> \| <code>object</code> |  | data to log; preferably structured |
| [message] | <code>string</code> |  | accompanying message |
| [severity] | <code>string</code> | <code>&#x60;INFO&#x60;</code> | [ google sev label](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity); default `INFO` |
| [isCloud] | <code>boolean</code> | <code>true</code> | force cloud logging |

<a name="logging.log"></a>

### logging.log(item, [depth], [maxDepth]) ⇒ <code>void</code>
a comprehensive logging utility in all terminal environments

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>any</code> |  | an item to log |
| [depth] | <code>number</code> | <code>0</code> | depth to log |
| [maxDepth] | <code>number</code> | <code>100</code> | maximum nested depth |

<a name="logging.progress"></a>

### logging.progress(thing, p, message) ⇒ <code>void</code>
dumb progress bar; incrementing console message
- ex: `thing message #p`

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Description |
| --- | --- | --- |
| thing | <code>string</code> | what is being |
| p | <code>number</code> | the number to show |
| message | <code>string</code> | - |

<a name="logging.time"></a>

### logging.time(label) ⇒ <code>Timer</code>
returns a timer with the following API
- `timer.start()`
- `timer.end()`
- `timer.report()`
- `timer.prettyTime()`

**Kind**: static method of [<code>logging</code>](#logging)  
**Returns**: <code>Timer</code> - a time  

| Param | Type | Description |
| --- | --- | --- |
| label | <code>string</code> | name for timer |

<a name="logging.quickTime"></a>

### logging.quickTime(callback)
a very quick way to check the length of a function; uses `console.time`
- ex: `timeTaken(main)`

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="logging.tracker"></a>

### logging.tracker([app], [token], [distinct_id]) ⇒ <code>function</code>
track stuff to mixpanel
- ex: `var t = track(); t('foo', {bar: "baz"})`

**Kind**: static method of [<code>logging</code>](#logging)  
**Returns**: <code>function</code> - func with signature: `(event, props = {}, cb = (res)=>{})`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [app] | <code>string</code> | <code>&#x27;akTools&#x27;</code> | value of `$source` prop |
| [token] | <code>string</code> | <code>\99a1209a992b3f9fba55a293e211186a\</code> | mixpanel token |
| [distinct_id] | <code>string</code> | <code>os.userInfo().username</code> | distinct_id |

<a name="logging.sleep"></a>

### logging.sleep(ms)
arbitrary sleep for `N` ms

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>number</code> | amount of time to sleep |

<a name="logging.clip"></a>

### logging.clip(data) ⇒ <code>void</code>
copy arbitrary data to your clipboard

**Kind**: static method of [<code>logging</code>](#logging)  
**Returns**: <code>void</code> - but there's data on your clipboard!  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | data to put on your clipboard |

<a name="logging.prettyTime"></a>

### logging.prettyTime(milliseconds) ⇒ <code>string</code>
create human readable time from milliseconds

**Kind**: static method of [<code>logging</code>](#logging)  
**Returns**: <code>string</code> - human readable time  

| Param | Type | Description |
| --- | --- | --- |
| milliseconds | <code>number</code> | time to format |

<a name="makeName"></a>

## makeName() ⇒ <code>string</code>
generate a random name (adjective + noun + verb + adverb)

**Kind**: global function  
**Returns**: <code>string</code> - a random name  
<a name="generalObject"></a>

## generalObject : <code>Object.&lt;string, any&gt;</code>
generic for `{}` w/string keys

**Kind**: global typedef  
<a name="arrayOfObjects"></a>

## arrayOfObjects : [<code>Array.&lt;generalObject&gt;</code>](#generalObject)
generic for `[{},{},{}]`

**Kind**: global typedef  
<a name="GCSUri"></a>

## GCSUri
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| uri | <code>string</code> | 
| bucket | <code>string</code> | 
| file | <code>string</code> | 

<a name="filterCallback"></a>

## filterCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| keyOrValue | <code>string</code> | object's value or key to test |