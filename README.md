# ak-tools
 AK's collections of useful things...cobbled together from various projects over the years...

install:

```bash
$ npm i ak-tools
```

use:
```javascript
const utils = require('ak-tools') 		//cjs
import {* as utils} from 'ak-tools' 	//esm
```

if using an IDE with jsdoc support you should have a good experience. 


## APIs

<dl>
<dt><a href="#files">files</a></dt>
<dd><p>file management utilities</p>
</dd>
<dt><a href="#validation">validation</a></dt>
<dd><p>data validation utilities</p>
</dd>
<dt><a href="#display">display</a></dt>
<dd><p>display, formatting, and other &quot;make it look right&quot; utilities</p>
</dd>
<dt><a href="#calculations">calculations</a></dt>
<dd><p>functions for maths, crypto, and calculations</p>
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

<a name="files"></a>

## files
file management utilities



* [files](#files)
    * [.exports.ls([dir], [objectMode])](#files.exports.ls) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.exports.rm(fileNameOrPath)](#files.exports.rm) ⇒ <code>Promise.&lt;(string\|boolean\|void)&gt;</code>
    * [.exports.touch(fileNameOrPath, [data], [isJson])](#files.exports.touch) ⇒ <code>Promise.&lt;(string\|false)&gt;</code>
    * [.exports.load(fileNameOrPath, [isJson], [encoding])](#files.exports.load)
    * [.exports.mkdir([dirPath])](#files.exports.mkdir)

<a name="files.exports.ls"></a>

### files.exports.ls([dir], [objectMode]) ⇒ <code>Promise.&lt;any&gt;</code>
list directory contents

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>Promise.&lt;any&gt;</code> - `[]` of files in folder  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dir] | <code>string</code> | <code>&quot;\&quot;./\&quot;&quot;</code> | directory to enumerate; default `./` |
| [objectMode] | <code>boolean</code> | <code>false</code> | return `{name: path}` instead of `[path]`; default `false` |

<a name="files.exports.rm"></a>

### files.exports.rm(fileNameOrPath) ⇒ <code>Promise.&lt;(string\|boolean\|void)&gt;</code>
remove a file or directory

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>Promise.&lt;(string\|boolean\|void)&gt;</code> - path or `false` if fail  

| Param | Type | Description |
| --- | --- | --- |
| fileNameOrPath | <code>string</code> | file or path to be removed |

<a name="files.exports.touch"></a>

### files.exports.touch(fileNameOrPath, [data], [isJson]) ⇒ <code>Promise.&lt;(string\|false)&gt;</code>
create a file

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>Promise.&lt;(string\|false)&gt;</code> - the name of the file  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fileNameOrPath | <code>string</code> |  | file to create |
| [data] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | data to write; default `""` |
| [isJson] | <code>boolean</code> | <code>false</code> | is `data` JSON; default `false` |

<a name="files.exports.load"></a>

### files.exports.load(fileNameOrPath, [isJson], [encoding])
load a filed into memory

**Kind**: static method of [<code>files</code>](#files)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fileNameOrPath | <code>string</code> |  | file to create |
| [isJson] | <code>boolean</code> | <code>false</code> | is `data` JSON; default `false` |
| [encoding] | <code>string</code> | <code>&quot;utf-8&quot;</code> | file encoring; default `utf-8` |

<a name="files.exports.mkdir"></a>

### files.exports.mkdir([dirPath])
make a directory

**Kind**: static method of [<code>files</code>](#files)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dirPath] | <code>string</code> | <code>&quot;\&quot;./tmp\&quot;&quot;</code> | path to create; default `./tmp` |

<a name="validation"></a>

## validation
data validation utilities



* [validation](#validation)
    * [.exports.isJSONStr(string)](#validation.exports.isJSONStr) ⇒ <code>boolean</code>
    * [.exports.isJSON(data)](#validation.exports.isJSON) ⇒ <code>boolean</code>
    * [.exports.is(type, val)](#validation.exports.is) ⇒ <code>boolean</code>
    * [.exports.isNil(val)](#validation.exports.isNil) ⇒ <code>boolean</code>

<a name="validation.exports.isJSONStr"></a>

### validation.exports.isJSONStr(string) ⇒ <code>boolean</code>
test if `string` has JSON structure; if `true` it can be safely parsed

**Kind**: static method of [<code>validation</code>](#validation)  

| Param | Type |
| --- | --- |
| string | <code>string</code> | 

<a name="validation.exports.isJSON"></a>

### validation.exports.isJSON(data) ⇒ <code>boolean</code>
test if `data` can be stringified as JSON

**Kind**: static method of [<code>validation</code>](#validation)  

| Param | Type |
| --- | --- |
| data | <code>string</code> \| <code>JSON</code> | 

<a name="validation.exports.is"></a>

### validation.exports.is(type, val) ⇒ <code>boolean</code>
check if a `type` matches a `value`

**Kind**: static method of [<code>validation</code>](#validation)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | a native type like `Number` or `Boolean` |
| val | <code>any</code> | any value to check |

<a name="validation.exports.isNil"></a>

### validation.exports.isNil(val) ⇒ <code>boolean</code>
check if a `val` is `null` or `undefined`

**Kind**: static method of [<code>validation</code>](#validation)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>any</code> | value to check |

<a name="display"></a>

## display
display, formatting, and other "make it look right" utilities



* [display](#display)
    * [.exports.comma(num)](#display.exports.comma) ⇒ <code>string</code>
    * [.exports.truncate(text, chars, [useWordBoundary])](#display.exports.truncate) ⇒ <code>string</code>
    * [.exports.bytesHuman(bytes, [si], [dp])](#display.exports.bytesHuman) ⇒ <code>string</code>
    * [.exports.json(data, [padding])](#display.exports.json) ⇒ <code>string</code>
    * [.exports.stripHTML(str)](#display.exports.stripHTML) ⇒ <code>string</code>
    * [.exports.multiReplace(str, [replacePairs])](#display.exports.multiReplace) ⇒ <code>string</code>
    * [.exports.replaceAll(oldVal, newVal)](#display.exports.replaceAll) ⇒ <code>string</code>
    * [.exports.toCSV(arr, [headers], [delimiter])](#display.exports.toCSV) ⇒ <code>string</code>

<a name="display.exports.comma"></a>

### display.exports.comma(num) ⇒ <code>string</code>
turn a number into a comma separated value; `1000` => `"1,000"`

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - formatted number  

| Param | Type |
| --- | --- |
| num | <code>string</code> \| <code>number</code> | 

<a name="display.exports.truncate"></a>

### display.exports.truncate(text, chars, [useWordBoundary]) ⇒ <code>string</code>
truncate a string; using an elipses (`...`)

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - truncated string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | text to truncate |
| chars | <code>number</code> | <code>500</code> | # of max characters |
| [useWordBoundary] | <code>boolean</code> | <code>true</code> | don't break words; default `true` |

<a name="display.exports.bytesHuman"></a>

### display.exports.bytesHuman(bytes, [si], [dp]) ⇒ <code>string</code>
turn a number (of bytes) into a human readable string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - # of bytes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bytes | <code>number</code> |  | number of bytes to convert |
| [si] | <code>boolean</code> | <code>false</code> | threshold of 1000 or 1024; default `false` |
| [dp] | <code>number</code> | <code>2</code> | decmimal points; default `2` |

<a name="display.exports.json"></a>

### display.exports.json(data, [padding]) ⇒ <code>string</code>
stringify object to json

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - valid json  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>object</code> |  | any serializable object |
| [padding] | <code>number</code> | <code>2</code> | padding to use |

<a name="display.exports.stripHTML"></a>

### display.exports.stripHTML(str) ⇒ <code>string</code>
strip all `<html>` tags from a string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - sanitized string  
**Note**: note: `<br>` tags are replace with `\n`  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | string with html tags |

<a name="display.exports.multiReplace"></a>

### display.exports.multiReplace(str, [replacePairs]) ⇒ <code>string</code>
find and replace _many_ values in string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - multi-replaced string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | string to replace |
| [replacePairs] | <code>Array.&lt;Array&gt;</code> | <code>[[&quot;|&quot;],[&quot;&lt;&quot;],[&quot;&gt;&quot;]]</code> | shape: `[ [old, new] ]` |

<a name="display.exports.replaceAll"></a>

### display.exports.replaceAll(oldVal, newVal) ⇒ <code>string</code>
replace all occurance of `old` with `new`

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - replaced result  
**Note**: this can't be called on any string directly  

| Param | Type | Description |
| --- | --- | --- |
| oldVal | <code>string</code> \| <code>RegExp</code> | old value |
| newVal | <code>string</code> | new value |

<a name="display.exports.toCSV"></a>

### display.exports.toCSV(arr, [headers], [delimiter]) ⇒ <code>string</code>
convert array of arrays to CSV like string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - a valid CSV  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>Array.&lt;Array&gt;</code> |  | data of the form `[ [], [], [] ]` |
| [headers] | <code>Array.&lt;String&gt;</code> | <code>[]</code> | header column |
| [delimiter] | <code>string</code> | <code>&quot;\&quot;,\&quot;&quot;</code> | delimeter for cells; default `,` |

<a name="calculations"></a>

## calculations
functions for maths, crypto, and calculations



* [calculations](#calculations)
    * [.exports.dupeVals(array, [times])](#calculations.exports.dupeVals) ⇒ <code>Array.&lt;any&gt;</code>
    * [.exports.rand(min, max)](#calculations.exports.rand) ⇒ <code>number</code>
    * [.exports.avg(...nums)](#calculations.exports.avg) ⇒ <code>number</code>
    * [.exports.calcSize(data)](#calculations.exports.calcSize) ⇒ <code>number</code>
    * [.exports.round(number, [decimalPlaces])](#calculations.exports.round) ⇒ <code>number</code>
    * [.exports.uid([length])](#calculations.exports.uid) ⇒ <code>string</code>
    * [.exports.uuid()](#calculations.exports.uuid) ⇒ <code>string</code>
    * [.exports.md5(data)](#calculations.exports.md5) ⇒ <code>string</code>

<a name="calculations.exports.dupeVals"></a>

### calculations.exports.dupeVals(array, [times]) ⇒ <code>Array.&lt;any&gt;</code>
duplicate values within an array N times

**Kind**: static method of [<code>calculations</code>](#calculations)  
**Returns**: <code>Array.&lt;any&gt;</code> - duplicated array  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array.&lt;any&gt;</code> |  | array to duplicate |
| [times] | <code>number</code> | <code>1</code> | number of dupes per item |

<a name="calculations.exports.rand"></a>

### calculations.exports.rand(min, max) ⇒ <code>number</code>
random integer between `min` and `max` (inclusive)

**Kind**: static method of [<code>calculations</code>](#calculations)  
**Returns**: <code>number</code> - random number  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| min | <code>number</code> | <code>1</code> | minimum |
| max | <code>number</code> | <code>100</code> | maximum |

<a name="calculations.exports.avg"></a>

### calculations.exports.avg(...nums) ⇒ <code>number</code>
calculate average of `...nums`

**Kind**: static method of [<code>calculations</code>](#calculations)  
**Returns**: <code>number</code> - average  

| Param | Type | Description |
| --- | --- | --- |
| ...nums | <code>number</code> | numbers to average |

<a name="calculations.exports.calcSize"></a>

### calculations.exports.calcSize(data) ⇒ <code>number</code>
calculate the size (on disk)

**Kind**: static method of [<code>calculations</code>](#calculations)  
**Returns**: <code>number</code> - estimated size in bytes  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>JSON</code> | JSON to estimate |

<a name="calculations.exports.round"></a>

### calculations.exports.round(number, [decimalPlaces]) ⇒ <code>number</code>
round a number to a number of decimal places

**Kind**: static method of [<code>calculations</code>](#calculations)  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| number | <code>number</code> |  | number to round |
| [decimalPlaces] | <code>number</code> | <code>0</code> | decimal places; default `0` |

<a name="calculations.exports.uid"></a>

### calculations.exports.uid([length]) ⇒ <code>string</code>
generate a random uid:
- `6NswVtnKWsvRGNTi0H2YtuqGwsqJi4dKW6qUgSiUx1XNctr4rkGRFOA9HRl9i60S`

**Kind**: static method of [<code>calculations</code>](#calculations)  
**Returns**: <code>string</code> - a uid of specified length  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [length] | <code>number</code> | <code>64</code> | length of id |

<a name="calculations.exports.uuid"></a>

### calculations.exports.uuid() ⇒ <code>string</code>
generated a uuid in v4 format:
- `72452488-ded9-46c1-8c22-2403ea924a8e`

**Kind**: static method of [<code>calculations</code>](#calculations)  
**Returns**: <code>string</code> - a uuid  
<a name="calculations.exports.md5"></a>

### calculations.exports.md5(data) ⇒ <code>string</code>
calculate the md5 hash of any data

**Kind**: static method of [<code>calculations</code>](#calculations)  
**Returns**: <code>string</code> - md5 hash of `data  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | data to hash |

<a name="objects"></a>

## objects
object utilities



* [objects](#objects)
    * [.exports.rnKeys(obj, newKeys)](#objects.exports.rnKeys) ⇒ <code>Object</code>
    * [.exports.rnVals(obj, pairs)](#objects.exports.rnVals) ⇒ <code>Object</code>
    * [.exports.objFilter(hash, test_function)](#objects.exports.objFilter) ⇒ <code>Object</code>
    * [.exports.objClean(obj)](#objects.exports.objClean) ⇒ <code>Object</code>
    * [.exports.objDefault(obj, defs)](#objects.exports.objDefault) ⇒ <code>Object</code>
    * [.exports.objMatch(obj, source)](#objects.exports.objMatch) ⇒ <code>boolean</code>
    * [.exports.clone(thing, [opts])](#objects.exports.clone) ⇒ <code>Object</code>
    * [.exports.typecastInt(obj, [isClone])](#objects.exports.typecastInt) ⇒ <code>Object</code>
    * [.exports.awaitObj(obj)](#objects.exports.awaitObj) ⇒ <code>Promise</code>
    * [.exports.removeNulls(objWithNullOrUndef)](#objects.exports.removeNulls) ⇒ <code>Object</code>

<a name="objects.exports.rnKeys"></a>

### objects.exports.rnKeys(obj, newKeys) ⇒ <code>Object</code>
rename object keys with a mapping object `{oldKey: newKey}`

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - new object with renamed keys  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | object to rename |
| newKeys | <code>Object</code> | map of form `{oldKey: newKey}` |

<a name="objects.exports.rnVals"></a>

### objects.exports.rnVals(obj, pairs) ⇒ <code>Object</code>
rename object values using a mapping array

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - object with renamed values  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| pairs | <code>Array.&lt;Array&gt;</code> | `[['old', 'new']]` |

<a name="objects.exports.objFilter"></a>

### objects.exports.objFilter(hash, test_function) ⇒ <code>Object</code>
filter arrays by values or objects by keys

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - filtered object  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>Object</code> | object or array to filter |
| test_function | <code>function</code> | a function which is called on keys/values |

<a name="objects.exports.objClean"></a>

### objects.exports.objClean(obj) ⇒ <code>Object</code>
removes the following from deeply nested objects:
- `null`
- `undefined` 
- `{}`
- `[]`

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - cleaned object  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="objects.exports.objDefault"></a>

### objects.exports.objDefault(obj, defs) ⇒ <code>Object</code>
apply default props to an object; don't override values from source

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - an object which has `defs` props  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | original object |
| defs | <code>Object</code> | props to add without overriding |

<a name="objects.exports.objMatch"></a>

### objects.exports.objMatch(obj, source) ⇒ <code>boolean</code>
deep equality match for any two objects

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>boolean</code> - do objects match?  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 
| source | <code>Object</code> | 

<a name="objects.exports.clone"></a>

### objects.exports.clone(thing, [opts]) ⇒ <code>Object</code>
an efficient way to clone an Object; outpreforms `JSON.parse(JSON.strigify())` by 100x

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - copied object  

| Param | Type | Description |
| --- | --- | --- |
| thing | <code>Object</code> | object to clone |
| [opts] | <code>unknown</code> |  |

<a name="objects.exports.typecastInt"></a>

### objects.exports.typecastInt(obj, [isClone]) ⇒ <code>Object</code>
visit every property of an object a turn "number" values into numbers
- ex: `{foo: {bar: '42'}}` => `{foo: {bar: 42}}`

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - object with all "numbers" as proper numbers  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>object</code> |  | object to traverse |
| [isClone] | <code>boolean</code> | <code>false</code> | default `false`; if `true` will mutate the passed in object |

<a name="objects.exports.awaitObj"></a>

### objects.exports.awaitObj(obj) ⇒ <code>Promise</code>
utility to `await` object values
- ex: `{foo: await bar()}`

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Promise</code> - the resolved values of the object's keys  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | object |

<a name="objects.exports.removeNulls"></a>

### objects.exports.removeNulls(objWithNullOrUndef) ⇒ <code>Object</code>
explicitly remove keys with `null` or `undefined` values; mutates object
- ex: `{foo: "bar", baz: null}` => `{foo: "bar"}`

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - an object without `null` or `undefined` values  

| Param | Type | Description |
| --- | --- | --- |
| objWithNullOrUndef | <code>Object</code> | an object with `null` or `undefined` values |

<a name="arrays"></a>

## arrays
array utilities



* [arrays](#arrays)
    * [.exports.dedupe(arrayOfThings)](#arrays.exports.dedupe) ⇒ <code>Array.&lt;any&gt;</code>
    * [.exports.dedupeVal(arr, keyNames)](#arrays.exports.dedupeVal) ⇒ <code>Array.&lt;any&gt;</code>
    * [.exports.chunk(sourceArray, chunkSize)](#arrays.exports.chunk) ⇒ <code>Array.&lt;any&gt;</code>
    * [.exports.shuffle(array, [mutate])](#arrays.exports.shuffle) ⇒ <code>Array.&lt;any&gt;</code>
    * [.exports.range(min, max, [step])](#arrays.exports.range) ⇒ <code>Array.&lt;number&gt;</code>
    * [.exports.deepFlat(arr)](#arrays.exports.deepFlat) ⇒ <code>Array.&lt;any&gt;</code>
    * [.exports.strToArr(str)](#arrays.exports.strToArr) ⇒ <code>Array.&lt;string&gt;</code>

<a name="arrays.exports.dedupe"></a>

### arrays.exports.dedupe(arrayOfThings) ⇒ <code>Array.&lt;any&gt;</code>
de-dupe array of objects w/Set, stringify, parse

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - deduped array  

| Param | Type | Description |
| --- | --- | --- |
| arrayOfThings | <code>any</code> | array to dedupe |

<a name="arrays.exports.dedupeVal"></a>

### arrays.exports.dedupeVal(arr, keyNames) ⇒ <code>Array.&lt;any&gt;</code>
de-dupe array of objects by value of specific keys

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - deduped array of objected  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;any&gt;</code> | array to dedupe |
| keyNames | <code>Array.&lt;string&gt;</code> | keynames to dedupe values on |

<a name="arrays.exports.chunk"></a>

### arrays.exports.chunk(sourceArray, chunkSize) ⇒ <code>Array.&lt;any&gt;</code>
chunk array of objects into array of arrays with each less than or equal to `chunkSize`
- `[{},{},{},{}]` => `[[{},{}],[{},{}]]`

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - chunked array  

| Param | Type | Description |
| --- | --- | --- |
| sourceArray | <code>Array.&lt;any&gt;</code> | array to batch |
| chunkSize | <code>number</code> | max length of each batch |

<a name="arrays.exports.shuffle"></a>

### arrays.exports.shuffle(array, [mutate]) ⇒ <code>Array.&lt;any&gt;</code>
fisher-yates shuffle of array elements

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - shuffled array  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array.&lt;any&gt;</code> |  | array to shuffle |
| [mutate] | <code>boolean</code> | <code>false</code> | mutate array in place? default: `false` |

<a name="arrays.exports.range"></a>

### arrays.exports.range(min, max, [step]) ⇒ <code>Array.&lt;number&gt;</code>
the classic python built-in for generating arrays of integers

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;number&gt;</code> - a range of integers  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| min | <code>number</code> |  | starting number |
| max | <code>number</code> |  | ending nunber |
| [step] | <code>number</code> | <code>1</code> | step for each interval; default `1` |

<a name="arrays.exports.deepFlat"></a>

### arrays.exports.deepFlat(arr) ⇒ <code>Array.&lt;any&gt;</code>
recursively and deeply flatten a nested array of objects
- ex: `[ [ [{},{}], {}], {} ]` => `[{},{},{},{}]`

**Kind**: static method of [<code>arrays</code>](#arrays)  
**Returns**: <code>Array.&lt;any&gt;</code> - flat array  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;any&gt;</code> | array to flatten |

<a name="arrays.exports.strToArr"></a>

### arrays.exports.strToArr(str) ⇒ <code>Array.&lt;string&gt;</code>
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
    * [.exports.attempt(fn, ...args)](#functions.exports.attempt)
    * [.exports.times(n, iteratee)](#functions.exports.times)
    * [.exports.throttle(func, wait, [options])](#functions.exports.throttle)
    * [.exports.compose()](#functions.exports.compose) ⇒ <code>function</code>
    * [.exports.id(any)](#functions.exports.id) ⇒ <code>any</code>

<a name="functions.exports.attempt"></a>

### functions.exports.attempt(fn, ...args)
`try{} catch{}` a function; return results

**Kind**: static method of [<code>functions</code>](#functions)  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 
| ...args | <code>any</code> | 

<a name="functions.exports.times"></a>

### functions.exports.times(n, iteratee)
do a function `N` times

**Kind**: static method of [<code>functions</code>](#functions)  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | number of times |
| iteratee | <code>function</code> | function to run |

<a name="functions.exports.throttle"></a>

### functions.exports.throttle(func, wait, [options])
throttle a functions's execution every `N` ms

**Kind**: static method of [<code>functions</code>](#functions)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| func | <code>function</code> |  | function to throttle |
| wait | <code>number</code> |  | ms to wait between executiations |
| [options] | <code>object</code> | <code>{leading: true, trailing: false}</code> |  |

<a name="functions.exports.compose"></a>

### functions.exports.compose() ⇒ <code>function</code>
compose functions, left-to-right
- ex: `c(a,b,c)` => `a(b(c()))`

**Kind**: static method of [<code>functions</code>](#functions)  
**Returns**: <code>function</code> - a composed chain of functions  
<a name="functions.exports.id"></a>

### functions.exports.id(any) ⇒ <code>any</code>
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
    * [.exports.cLog(data, message, [severity])](#logging.exports.cLog)
    * [.exports.log(item, [depth], [maxDepth])](#logging.exports.log) ⇒ <code>void</code>
    * [.exports.progress(thing, p, message)](#logging.exports.progress) ⇒ <code>void</code>
    * [.exports.time(label)](#logging.exports.time) ⇒ <code>Timer</code>
    * [.exports.quickTime(callback)](#logging.exports.quickTime)
    * [.exports.tracker([app], [token], [distinct_id])](#logging.exports.tracker) ⇒ <code>function</code>
    * [.exports.sleep(ms)](#logging.exports.sleep)
    * [.exports.clip(data)](#logging.exports.clip) ⇒ <code>void</code>

<a name="logging.exports.cLog"></a>

### logging.exports.cLog(data, message, [severity])
a cloud function compatible `console.log()`

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>string</code> \| <code>JSON</code> |  | data to log |
| message | <code>string</code> |  | accopanying message |
| [severity] | <code>string</code> | <code>&quot;&#x60;INFO&#x60;&quot;</code> | [ google sev label](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity); default `INFO` |

<a name="logging.exports.log"></a>

### logging.exports.log(item, [depth], [maxDepth]) ⇒ <code>void</code>
a comprehensive logging utility in all terminal environments

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>any</code> |  | an item to log |
| [depth] | <code>number</code> | <code>0</code> | depth to log |
| [maxDepth] | <code>number</code> | <code>100</code> | maximum nested depth |

<a name="logging.exports.progress"></a>

### logging.exports.progress(thing, p, message) ⇒ <code>void</code>
dumb progress bar; incrementing console message
- ex: `thing message #`

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Description |
| --- | --- | --- |
| thing | <code>string</code> | what is being |
| p | <code>number</code> | the number to show |
| message | <code>string</code> | - |

<a name="logging.exports.time"></a>

### logging.exports.time(label) ⇒ <code>Timer</code>
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

<a name="logging.exports.quickTime"></a>

### logging.exports.quickTime(callback)
a very quick way to check the length of a function; uses `console.time`
- ex: `timeTaken(main)`

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="logging.exports.tracker"></a>

### logging.exports.tracker([app], [token], [distinct_id]) ⇒ <code>function</code>
track stuff to mixpanel
- ex: `var t = track(); t('foo', {bar: "baz"})`

**Kind**: static method of [<code>logging</code>](#logging)  
**Returns**: <code>function</code> - func with signature: `(event, props = {}, cb = ()=>{})`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [app] | <code>string</code> | <code>&quot;&#x27;akTools&#x27;&quot;</code> | value of `$source` prop |
| [token] | <code>string</code> | <code>&quot;\&quot;99a1209a992b3f9fba55a293e211186a\&quot;&quot;</code> | mixpanel token |
| [distinct_id] | <code>string</code> | <code>&quot;os.userInfo().username&quot;</code> | distinct_id |

<a name="logging.exports.sleep"></a>

### logging.exports.sleep(ms)
arbitrary sleep for `N` ms

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>number</code> | amount of time to sleep |

<a name="logging.exports.clip"></a>

### logging.exports.clip(data) ⇒ <code>void</code>
copy arbitrary data to your clipboard

**Kind**: static method of [<code>logging</code>](#logging)  
**Returns**: <code>void</code> - but there's data on your clipboard!  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | data to put on your clipboard |