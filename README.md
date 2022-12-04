# ak-tools
 AK's collections of useful things...cobbled together from various projects over the years...

install:

```bash
$ npm i ak-tools
```

use:
```javascript
const utils = require('ak-tools') 	//cjs
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

## Typedefs

<dl>
<dt><a href="#generalObject">generalObject</a> : <code>Object.&lt;string, any&gt;</code></dt>
<dd><p>generic for <code>{}</code> w/string keys</p>
</dd>
<dt><a href="#arrayOfObjects">arrayOfObjects</a> : <code><a href="#generalObject">Array.&lt;generalObject&gt;</a></code></dt>
<dd><p>generic for <code>[{},{},{}]</code></p>
</dd>
</dl>

<a name="files"></a>

## files
file management utilities



* [files](#files)
    * [.ls([dir], [objectMode])](#files.ls) ⇒ <code>Promise.&lt;(Array.&lt;string&gt;\|generalObject)&gt;</code>
    * [.rm(fileNameOrPath)](#files.rm) ⇒ <code>Promise.&lt;(string\|boolean\|void)&gt;</code>
    * [.touch(fileNameOrPath, [data], [isJson])](#files.touch) ⇒ <code>Promise.&lt;(string\|false)&gt;</code>
    * [.load(fileNameOrPath, [isJson], [encoding])](#files.load) ⇒ <code>Promise.&lt;(string\|generalObject\|arrayOfObjects)&gt;</code>
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
| [data] | <code>string</code> | <code>\\</code> | data to write; default `""` |
| [isJson] | <code>boolean</code> | <code>false</code> | is `data` JSON; default `false` |

**Example**  
```js
await touch('newfile.txt', data)  // => '/path/to/newfile.txt' || false
await touch('newfile.json', data, true)  // => '/path/to/newfile.json' || false
```
<a name="files.load"></a>

### files.load(fileNameOrPath, [isJson], [encoding]) ⇒ <code>Promise.&lt;(string\|generalObject\|arrayOfObjects)&gt;</code>
load a file into memory

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>Promise.&lt;(string\|generalObject\|arrayOfObjects)&gt;</code> - the file in memory  

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
make a directory

**Kind**: static method of [<code>files</code>](#files)  
**Returns**: <code>string</code> - the absolute path of the directory  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dirPath] | <code>string</code> | <code>\./tmp\</code> | path to create; default `./tmp` |

**Example**  
```js
const myTmpDir = mkdir('./tmp')
```
<a name="validation"></a>

## validation
data validation utilities



* [validation](#validation)
    * [.isJSONStr(string)](#validation.isJSONStr) ⇒ <code>boolean</code>
    * [.isJSON(data)](#validation.isJSON) ⇒ <code>boolean</code>
    * [.is(type, val)](#validation.is) ⇒ <code>boolean</code>
    * [.isNil(val)](#validation.isNil) ⇒ <code>boolean</code>
    * [.similar(o1, o2)](#validation.similar) ⇒ <code>boolean</code>

<a name="validation.isJSONStr"></a>

### validation.isJSONStr(string) ⇒ <code>boolean</code>
test if `string` has JSON structure

**Kind**: static method of [<code>validation</code>](#validation)  

| Param | Type |
| --- | --- |
| string | <code>string</code> | 

**Example**  
```js
isJSONStr('{"foo": "bar"}') // => true
```
<a name="validation.isJSON"></a>

### validation.isJSON(data) ⇒ <code>boolean</code>
test if `data` can be stringified as JSON

**Kind**: static method of [<code>validation</code>](#validation)  

| Param | Type |
| --- | --- |
| data | <code>string</code> \| <code>JSON</code> | 

**Example**  
```js
isJSON({foo: "bar"}) // => true
```
<a name="validation.is"></a>

### validation.is(type, val) ⇒ <code>boolean</code>
check if a `type` matches a `value`

**Kind**: static method of [<code>validation</code>](#validation)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>&#x27;string&#x27;</code> \| <code>any</code> | a native type like `Number` or `Boolean` |
| val | <code>any</code> | any value to check |

**Example**  
```js
is(Number, 42) // => true
```
<a name="validation.isNil"></a>

### validation.isNil(val) ⇒ <code>boolean</code>
check if a `val` is `null` or `undefined`

**Kind**: static method of [<code>validation</code>](#validation)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>any</code> | value to check |

**Example**  
```js
isNil(null) // => true
```
<a name="validation.similar"></a>

### validation.similar(o1, o2) ⇒ <code>boolean</code>
check if `a` and `b` have similar shape (keys), recusively

**Kind**: static method of [<code>validation</code>](#validation)  
**Returns**: <code>boolean</code> - do they have the same shape?  

| Param | Type | Description |
| --- | --- | --- |
| o1 | [<code>generalObject</code>](#generalObject) | first obj |
| o2 | [<code>generalObject</code>](#generalObject) | second obj |

**Example**  
```js
similar({a: "foo"}, {a: "bar"}) // => true
```
<a name="display"></a>

## display
display, formatting, and other "make it look right" utilities



* [display](#display)
    * [.comma(num)](#display.comma) ⇒ <code>string</code>
    * [.truncate(text, chars, [useWordBoundary])](#display.truncate) ⇒ <code>string</code>
    * [.bytesHuman(bytes, [si], [dp])](#display.bytesHuman) ⇒ <code>string</code>
    * [.json(data, [padding])](#display.json) ⇒ <code>string</code>
    * [.stripHTML(str)](#display.stripHTML) ⇒ <code>string</code>
    * [.multiReplace(str, [replacePairs])](#display.multiReplace) ⇒ <code>string</code>
    * [.replaceAll(oldVal, newVal)](#display.replaceAll) ⇒ <code>string</code>
    * [.toCSV(arr, [headers], [delimiter])](#display.toCSV) ⇒ <code>string</code>

<a name="display.comma"></a>

### display.comma(num) ⇒ <code>string</code>
turn a number into a comma separated value; `1000` => `"1,000"`

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - formatted number  

| Param | Type |
| --- | --- |
| num | <code>string</code> \| <code>number</code> | 

<a name="display.truncate"></a>

### display.truncate(text, chars, [useWordBoundary]) ⇒ <code>string</code>
truncate a string; using an elipses (`...`)

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - truncated string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | text to truncate |
| chars | <code>number</code> | <code>500</code> | # of max characters |
| [useWordBoundary] | <code>boolean</code> | <code>true</code> | don't break words; default `true` |

<a name="display.bytesHuman"></a>

### display.bytesHuman(bytes, [si], [dp]) ⇒ <code>string</code>
turn a number (of bytes) into a human readable string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - # of bytes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bytes | <code>number</code> |  | number of bytes to convert |
| [si] | <code>boolean</code> | <code>false</code> | threshold of 1000 or 1024; default `false` |
| [dp] | <code>number</code> | <code>2</code> | decmimal points; default `2` |

<a name="display.json"></a>

### display.json(data, [padding]) ⇒ <code>string</code>
stringify object to json

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - valid json  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>object</code> |  | any serializable object |
| [padding] | <code>number</code> | <code>2</code> | padding to use |

<a name="display.stripHTML"></a>

### display.stripHTML(str) ⇒ <code>string</code>
strip all `<html>` tags from a string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - sanitized string  
**Note**: note: `<br>` tags are replace with `\n`  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | string with html tags |

<a name="display.multiReplace"></a>

### display.multiReplace(str, [replacePairs]) ⇒ <code>string</code>
find and replace _many_ values in string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - multi-replaced string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | string to replace |
| [replacePairs] | <code>Array.&lt;Array&gt;</code> | <code>[[|],[&lt;],[&gt;]]</code> | shape: `[ [old, new] ]` |

<a name="display.replaceAll"></a>

### display.replaceAll(oldVal, newVal) ⇒ <code>string</code>
replace all occurance of `old` with `new`

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - replaced result  
**Note**: this can't be called on any string directly  

| Param | Type | Description |
| --- | --- | --- |
| oldVal | <code>string</code> \| <code>RegExp</code> | old value |
| newVal | <code>string</code> | new value |

<a name="display.toCSV"></a>

### display.toCSV(arr, [headers], [delimiter]) ⇒ <code>string</code>
convert array of arrays to CSV like string

**Kind**: static method of [<code>display</code>](#display)  
**Returns**: <code>string</code> - a valid CSV  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>Array.&lt;Array&gt;</code> |  | data of the form `[ [], [], [] ]` |
| [headers] | <code>Array.&lt;String&gt;</code> | <code>[]</code> | header column |
| [delimiter] | <code>string</code> | <code>\,\</code> | delimeter for cells; default `,` |

<a name="maths"></a>

## maths
functions for maths, crypto, and maths



* [maths](#maths)
    * [.dupeVals(array, [times])](#maths.dupeVals) ⇒ <code>Array.&lt;any&gt;</code>
    * [.rand(min, max)](#maths.rand) ⇒ <code>number</code>
    * [.avg(...nums)](#maths.avg) ⇒ <code>number</code>
    * [.calcSize(data)](#maths.calcSize) ⇒ <code>number</code>
    * [.round(number, [decimalPlaces])](#maths.round) ⇒ <code>number</code>
    * [.uid([length])](#maths.uid) ⇒ <code>string</code>
    * [.uuid()](#maths.uuid) ⇒ <code>string</code>
    * [.md5(data)](#maths.md5) ⇒ <code>string</code>

<a name="maths.dupeVals"></a>

### maths.dupeVals(array, [times]) ⇒ <code>Array.&lt;any&gt;</code>
duplicate values within an array N times

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>Array.&lt;any&gt;</code> - duplicated array  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array.&lt;any&gt;</code> |  | array to duplicate |
| [times] | <code>number</code> | <code>1</code> | number of dupes per item |

<a name="maths.rand"></a>

### maths.rand(min, max) ⇒ <code>number</code>
random integer between `min` and `max` (inclusive)

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>number</code> - random number  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| min | <code>number</code> | <code>1</code> | minimum |
| max | <code>number</code> | <code>100</code> | maximum |

<a name="maths.avg"></a>

### maths.avg(...nums) ⇒ <code>number</code>
calculate average of `...nums`

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>number</code> - average  

| Param | Type | Description |
| --- | --- | --- |
| ...nums | <code>number</code> | numbers to average |

<a name="maths.calcSize"></a>

### maths.calcSize(data) ⇒ <code>number</code>
calculate the size (on disk)

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>number</code> - estimated size in bytes  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>JSON</code> | JSON to estimate |

<a name="maths.round"></a>

### maths.round(number, [decimalPlaces]) ⇒ <code>number</code>
round a number to a number of decimal places

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| number | <code>number</code> |  | number to round |
| [decimalPlaces] | <code>number</code> | <code>0</code> | decimal places; default `0` |

<a name="maths.uid"></a>

### maths.uid([length]) ⇒ <code>string</code>
generate a random uid:
- `6NswVtnKWsvRGNTi0H2YtuqGwsqJi4dKW6qUgSiUx1XNctr4rkGRFOA9HRl9i60S`

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>string</code> - a uid of specified length  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [length] | <code>number</code> | <code>64</code> | length of id |

<a name="maths.uuid"></a>

### maths.uuid() ⇒ <code>string</code>
generated a uuid in v4 format:
- `72452488-ded9-46c1-8c22-2403ea924a8e`

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>string</code> - a uuid  
<a name="maths.md5"></a>

### maths.md5(data) ⇒ <code>string</code>
calculate the md5 hash of any data

**Kind**: static method of [<code>maths</code>](#maths)  
**Returns**: <code>string</code> - md5 hash of `data  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | data to hash |

<a name="objects"></a>

## objects
object utilities



* [objects](#objects)
    * [.rnKeys(obj, newKeys)](#objects.rnKeys) ⇒ <code>Object</code>
    * [.rnVals(obj, pairs)](#objects.rnVals) ⇒ <code>Object</code>
    * [.objFilter(hash, test_function)](#objects.objFilter) ⇒ <code>Object</code>
    * [.objClean(obj)](#objects.objClean) ⇒ <code>Object</code>
    * [.objDefault(obj, defs)](#objects.objDefault) ⇒ <code>Object</code>
    * [.objMatch(obj, source)](#objects.objMatch) ⇒ <code>boolean</code>
    * [.clone(thing, [opts])](#objects.clone) ⇒ <code>Object</code>
    * [.typecastInt(obj, [isClone])](#objects.typecastInt) ⇒ <code>Object</code>
    * [.awaitObj(obj)](#objects.awaitObj) ⇒ <code>Promise</code>
    * [.removeNulls(objWithNullOrUndef)](#objects.removeNulls) ⇒ <code>Object</code>

<a name="objects.rnKeys"></a>

### objects.rnKeys(obj, newKeys) ⇒ <code>Object</code>
rename object keys with a mapping object `{oldKey: newKey}`

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - new object with renamed keys  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | object to rename |
| newKeys | <code>Object</code> | map of form `{oldKey: newKey}` |

<a name="objects.rnVals"></a>

### objects.rnVals(obj, pairs) ⇒ <code>Object</code>
rename object values using a mapping array

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - object with renamed values  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| pairs | <code>Array.&lt;Array&gt;</code> | `[['old', 'new']]` |

<a name="objects.objFilter"></a>

### objects.objFilter(hash, test_function) ⇒ <code>Object</code>
filter arrays by values or objects by keys

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - filtered object  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>Object</code> | object or array to filter |
| test_function | <code>function</code> | a function which is called on keys/values |

<a name="objects.objClean"></a>

### objects.objClean(obj) ⇒ <code>Object</code>
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

<a name="objects.objDefault"></a>

### objects.objDefault(obj, defs) ⇒ <code>Object</code>
apply default props to an object; don't override values from source

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - an object which has `defs` props  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | original object |
| defs | <code>Object</code> | props to add without overriding |

<a name="objects.objMatch"></a>

### objects.objMatch(obj, source) ⇒ <code>boolean</code>
deep equality match for any two objects

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>boolean</code> - do objects match?  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 
| source | <code>Object</code> | 

<a name="objects.clone"></a>

### objects.clone(thing, [opts]) ⇒ <code>Object</code>
an efficient way to clone an Object; outpreforms `JSON.parse(JSON.strigify())` by 100x

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - copied object  

| Param | Type | Description |
| --- | --- | --- |
| thing | <code>Object</code> | object to clone |
| [opts] | <code>unknown</code> |  |

<a name="objects.typecastInt"></a>

### objects.typecastInt(obj, [isClone]) ⇒ <code>Object</code>
visit every property of an object a turn "number" values into numbers
- ex: `{foo: {bar: '42'}}` => `{foo: {bar: 42}}`

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Object</code> - object with all "numbers" as proper numbers  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>object</code> |  | object to traverse |
| [isClone] | <code>boolean</code> | <code>false</code> | default `false`; if `true` will mutate the passed in object |

<a name="objects.awaitObj"></a>

### objects.awaitObj(obj) ⇒ <code>Promise</code>
utility to `await` object values
- ex: `{foo: await bar()}`

**Kind**: static method of [<code>objects</code>](#objects)  
**Returns**: <code>Promise</code> - the resolved values of the object's keys  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | object |

<a name="objects.removeNulls"></a>

### objects.removeNulls(objWithNullOrUndef) ⇒ <code>Object</code>
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
    * [.dedupe(arrayOfThings)](#arrays.dedupe) ⇒ <code>Array.&lt;any&gt;</code>
    * [.dedupeVal(arr, keyNames)](#arrays.dedupeVal) ⇒ <code>Array.&lt;any&gt;</code>
    * [.chunk(sourceArray, chunkSize)](#arrays.chunk) ⇒ <code>Array.&lt;any&gt;</code>
    * [.shuffle(array, [mutate])](#arrays.shuffle) ⇒ <code>Array.&lt;any&gt;</code>
    * [.range(min, max, [step])](#arrays.range) ⇒ <code>Array.&lt;number&gt;</code>
    * [.deepFlat(arr)](#arrays.deepFlat) ⇒ <code>Array.&lt;any&gt;</code>
    * [.strToArr(str)](#arrays.strToArr) ⇒ <code>Array.&lt;string&gt;</code>

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
| keyNames | <code>Array.&lt;string&gt;</code> | keynames to dedupe values on |

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
| max | <code>number</code> |  | ending nunber |
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
| wait | <code>number</code> |  | ms to wait between executiations |
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
    * [.cLog(data, message, [severity])](#logging.cLog)
    * [.log(item, [depth], [maxDepth])](#logging.log) ⇒ <code>void</code>
    * [.progress(thing, p, message)](#logging.progress) ⇒ <code>void</code>
    * [.time(label)](#logging.time) ⇒ <code>Timer</code>
    * [.quickTime(callback)](#logging.quickTime)
    * [.tracker([app], [token], [distinct_id])](#logging.tracker) ⇒ <code>function</code>
    * [.sleep(ms)](#logging.sleep)
    * [.clip(data)](#logging.clip) ⇒ <code>void</code>

<a name="logging.cLog"></a>

### logging.cLog(data, message, [severity])
a cloud function compatible `console.log()`

**Kind**: static method of [<code>logging</code>](#logging)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>string</code> \| <code>JSON</code> \| <code>object</code> |  | data to log |
| message | <code>string</code> |  | accopanying message |
| [severity] | <code>string</code> | <code>&#x60;INFO&#x60;</code> | [ google sev label](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity); default `INFO` |

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
- ex: `thing message #`

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
**Returns**: <code>function</code> - func with signature: `(event, props = {}, cb = ()=>{})`  

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

<a name="generalObject"></a>

## generalObject : <code>Object.&lt;string, any&gt;</code>
generic for `{}` w/string keys

**Kind**: global typedef  
<a name="arrayOfObjects"></a>

## arrayOfObjects : [<code>Array.&lt;generalObject&gt;</code>](#generalObject)
generic for `[{},{},{}]`

**Kind**: global typedef