
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

## API
### Objects

<dl>
<dt><a href="#files">files</a> : <code>object</code></dt>
<dd><p>file managment</p>
</dd>
<dt><a href="#validation">validation</a> : <code>object</code></dt>
<dd><p>data validation utilities</p>
</dd>
<dt><a href="#display">display</a> : <code>object</code></dt>
<dd><p>display, formatting, and other &quot;make it look right&quot; utilities</p>
</dd>
<dt><a href="#calculations">calculations</a> : <code>object</code></dt>
<dd><p>functions for maths, crypto, and calculations</p>
</dd>
<dt><a href="#objects">objects</a> : <code>object</code></dt>
<dd><p>object utilities</p>
</dd>
<dt><a href="#arrays">arrays</a> : <code>object</code></dt>
<dd><p>array utilities</p>
</dd>
<dt><a href="#functions">functions</a> : <code>object</code></dt>
<dd><p>function utilities</p>
</dd>
<dt><a href="#logging">logging</a> : <code>object</code></dt>
<dd><p>logging, timers and other diagnostic utilities</p>
</dd>
</dl>

### Functions

<dl>
<dt><a href="#ls">ls([dir], [objectMode])</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>list directory contents</p>
</dd>
<dt><a href="#rm">rm(fileNameOrPath)</a> ⇒ <code>Promise.&lt;(string|boolean|void)&gt;</code></dt>
<dd><p>remove a file or directory</p>
</dd>
<dt><a href="#touch">touch(fileNameOrPath, [data], [isJson])</a> ⇒ <code>Promise.&lt;(string|false)&gt;</code></dt>
<dd><p>create a file</p>
</dd>
<dt><a href="#load">load(fileNameOrPath, [isJson], [encoding])</a></dt>
<dd><p>load a filed into memory</p>
</dd>
<dt><a href="#mkdir">mkdir([dirPath])</a></dt>
<dd><p>make a directory</p>
</dd>
<dt><a href="#isJSONStr">isJSONStr(string)</a> ⇒ <code>boolean</code></dt>
<dd><p>test if <code>string</code> has JSON structure; if <code>true</code> it can be safely parsed</p>
</dd>
<dt><a href="#isJSON">isJSON(data)</a> ⇒ <code>boolean</code></dt>
<dd><p>test if <code>data</code> can be stringified as JSON</p>
</dd>
<dt><a href="#is">is(type, val)</a> ⇒ <code>boolean</code></dt>
<dd><p>check if a <code>type</code> matches a <code>value</code></p>
</dd>
<dt><a href="#isNil">isNil(val)</a> ⇒ <code>boolean</code></dt>
<dd><p>check if a <code>val</code> is <code>null</code> or <code>undefined</code></p>
</dd>
<dt><a href="#comma">comma(num)</a> ⇒ <code>string</code></dt>
<dd><p>turn a number into a comma separated value; <code>1000</code> =&gt; <code>&quot;1,000&quot;</code></p>
</dd>
<dt><a href="#truncate">truncate(text, chars, [useWordBoundary])</a> ⇒ <code>string</code></dt>
<dd><p>truncate a string; using an elipses (<code>...</code>)</p>
</dd>
<dt><a href="#bytesHuman">bytesHuman(bytes, [si], [dp])</a> ⇒ <code>string</code></dt>
<dd><p>turn a number (of bytes) into a human readable string</p>
</dd>
<dt><a href="#json">json(data, [padding])</a> ⇒ <code>string</code></dt>
<dd><p>stringify object to json</p>
</dd>
<dt><a href="#stripHTML">stripHTML(str)</a> ⇒ <code>string</code></dt>
<dd><p>strip all <code>&lt;html&gt;</code> tags from a string</p>
</dd>
<dt><a href="#multiReplace">multiReplace(str, [replacePairs])</a> ⇒ <code>string</code></dt>
<dd><p>find and replace <em>many</em> values in string</p>
</dd>
<dt><a href="#replaceAll">replaceAll(oldVal, newVal)</a> ⇒ <code>string</code></dt>
<dd><p>replace all occurance of <code>old</code> with <code>new</code></p>
</dd>
<dt><a href="#toCSV">toCSV(arr, [headers], [delimiter])</a> ⇒ <code>string</code></dt>
<dd><p>convert array of arrays to CSV like string</p>
</dd>
<dt><a href="#dupeVals">dupeVals(array, [times])</a> ⇒ <code>Array.&lt;any&gt;</code></dt>
<dd><p>duplicate values within an array N times</p>
</dd>
<dt><a href="#rand">rand(min, max)</a> ⇒ <code>number</code></dt>
<dd><p>random integer between <code>min</code> and <code>max</code> (inclusive)</p>
</dd>
<dt><a href="#avg">avg(...nums)</a> ⇒ <code>number</code></dt>
<dd><p>calculate average of <code>...nums</code></p>
</dd>
<dt><a href="#calcSize">calcSize(data)</a> ⇒ <code>number</code></dt>
<dd><p>calculate the size (on disk)</p>
</dd>
<dt><a href="#round">round(number, [decimalPlaces])</a> ⇒ <code>number</code></dt>
<dd><p>round a number to a number of decimal places</p>
</dd>
<dt><a href="#uid">uid([length])</a> ⇒ <code>string</code></dt>
<dd><p>generate a random uid:</p>
<ul>
<li><code>6NswVtnKWsvRGNTi0H2YtuqGwsqJi4dKW6qUgSiUx1XNctr4rkGRFOA9HRl9i60S</code></li>
</ul>
</dd>
<dt><a href="#uuid">uuid()</a> ⇒ <code>string</code></dt>
<dd><p>generated a uuid in v4 format:</p>
<ul>
<li><code>72452488-ded9-46c1-8c22-2403ea924a8e</code></li>
</ul>
</dd>
<dt><a href="#rnKeys">rnKeys(obj, newKeys)</a> ⇒ <code>Object</code></dt>
<dd><p>rename object keys with a mapping object <code>{oldKey: newKey}</code></p>
</dd>
<dt><a href="#rnVals">rnVals(obj, pairs)</a> ⇒ <code>Object</code></dt>
<dd><p>rename object values using a mapping array</p>
</dd>
<dt><a href="#objFilter">objFilter(hash, test_function)</a> ⇒ <code>Object</code></dt>
<dd><p>filter arrays by values or objects by keys</p>
</dd>
<dt><a href="#objClean">objClean(obj)</a> ⇒</dt>
<dd><p>removes the following from deeply nested objects:</p>
<ul>
<li><code>null</code></li>
<li><code>undefined</code> </li>
<li><code>{}</code></li>
<li><code>[]</code></li>
</ul>
</dd>
<dt><a href="#objDefault">objDefault(obj, defs)</a> ⇒ <code>Object</code></dt>
<dd><p>apply default props to an object; don&#39;t override values from source</p>
</dd>
<dt><a href="#objMatch">objMatch(obj, source)</a> ⇒ <code>boolean</code></dt>
<dd><p>deep equality match for any two objects</p>
</dd>
<dt><a href="#clone">clone(thing, [opts])</a> ⇒ <code>Object</code></dt>
<dd><p>an efficient way to clone an Object; outpreforms <code>JSON.parse(JSON.strigify())</code> by 100x</p>
</dd>
<dt><a href="#typecastInt">typecastInt(obj, [isClone])</a> ⇒ <code>Object</code></dt>
<dd><p>visit every property of an object a turn &quot;number&quot; values into numbers</p>
<ul>
<li>ex: <code>{foo: {bar: &#39;42&#39;}}</code> =&gt; <code>{foo: {bar: 42}}</code></li>
</ul>
</dd>
<dt><a href="#awaitObj">awaitObj(obj)</a> ⇒ <code>Promise</code></dt>
<dd><p>utility to <code>await</code> object values</p>
<ul>
<li>ex: <code>{foo: await bar()}</code></li>
</ul>
</dd>
<dt><a href="#removeNulls">removeNulls(objWithNullOrUndef)</a> ⇒ <code>Object</code></dt>
<dd><p>explicitly remove keys with <code>null</code> or <code>undefined</code> values; mutates object</p>
<ul>
<li>ex: <code>{foo: &quot;bar&quot;, baz: null}</code> =&gt; <code>{foo: &quot;bar&quot;}</code></li>
</ul>
</dd>
<dt><a href="#makeInteger">makeInteger(value)</a> ⇒ <code>number</code> | <code>NaN</code></dt>
<dd><p>check if a value is an integer, if so return it</p>
</dd>
<dt><a href="#dedupe">dedupe(arrayOfThings)</a> ⇒ <code>Array.&lt;any&gt;</code></dt>
<dd><p>de-dupe array of objects w/Set, stringify, parse</p>
</dd>
<dt><a href="#dedupeVal">dedupeVal(arr, keyNames)</a> ⇒ <code>Array.&lt;any&gt;</code></dt>
<dd><p>de-dupe array of objects by value of specific keys</p>
</dd>
<dt><a href="#chunk">chunk(sourceArray, chunkSize)</a> ⇒ <code>Array.&lt;any&gt;</code></dt>
<dd><p>chunk array of objects into array of arrays with each less than or equal to <code>chunkSize</code></p>
<ul>
<li><code>[{},{},{},{}]</code> =&gt; <code>[[{},{}],[{},{}]]</code></li>
</ul>
</dd>
<dt><a href="#shuffle">shuffle(array, [mutate])</a> ⇒ <code>Array.&lt;any&gt;</code></dt>
<dd><p>fisher-yates shuffle of array elements</p>
</dd>
<dt><a href="#range">range(min, max, [step])</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>the classic python built-in for generating arrays of integers</p>
</dd>
<dt><a href="#deepFlat">deepFlat(arr)</a> ⇒ <code>Array.&lt;any&gt;</code></dt>
<dd><p>recursively and deeply flatten a nested array of objects</p>
<ul>
<li>ex: <code>[ [ [{},{}], {}], {} ]</code> =&gt; <code>[{},{},{},{}]</code></li>
</ul>
</dd>
<dt><a href="#strToArr">strToArr(str)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>extract words from a string as an array</p>
<ul>
<li>ex <code>&quot;foo bar baz&quot;</code> =&gt; <code>[&#39;foo&#39;,&#39;bar&#39;,&#39;baz&#39;]</code></li>
</ul>
</dd>
<dt><a href="#attempt">attempt(fn, ...args)</a></dt>
<dd><p><code>try{} catch{}</code> a function; return results</p>
</dd>
<dt><a href="#times">times(n, iteratee)</a></dt>
<dd><p>do a function <code>N</code> times</p>
</dd>
<dt><a href="#throttle">throttle(func, wait, [options])</a></dt>
<dd><p>throttle a functions&#39;s execution every <code>N</code> ms</p>
</dd>
<dt><a href="#compose">compose()</a> ⇒ <code>function</code></dt>
<dd><p>compose functions, left-to-right</p>
<ul>
<li>ex: <code>c(a,b,c)</code> =&gt; <code>a(b(c()))</code></li>
</ul>
</dd>
<dt><a href="#id">id(any)</a> ⇒ <code>any</code></dt>
<dd><p>a function which returns it&#39;s value</p>
</dd>
<dt><a href="#cLog">cLog(data, message, [severity])</a></dt>
<dd><p>a cloud function compatible <code>console.log()</code></p>
</dd>
<dt><a href="#log">log(item, [depth], [maxDepth])</a> ⇒ <code>void</code></dt>
<dd><p>a comprehensive logging utility in all terminal environments</p>
</dd>
<dt><a href="#progress">progress(thing, p, message)</a> ⇒ <code>void</code></dt>
<dd><p>dumb progress bar; incrementing console message</p>
<ul>
<li>ex: <code>thing message #</code></li>
</ul>
</dd>
<dt><a href="#time">time(label)</a> ⇒ <code>Timer</code></dt>
<dd><p>returns a timer with the following API</p>
<ul>
<li><code>timer.start()</code></li>
<li><code>timer.end()</code></li>
<li><code>timer.report()</code></li>
<li><code>timer.prettyTime()</code></li>
</ul>
</dd>
<dt><a href="#quickTime">quickTime(callback)</a></dt>
<dd><p>a very quick way to check the length of a function; uses <code>console.time</code></p>
<ul>
<li>ex: <code>timeTaken(main)</code></li>
</ul>
</dd>
<dt><a href="#tracker">tracker([app], [token], [distinct_id])</a> ⇒ <code>function</code></dt>
<dd><p>track stuff to mixpanel</p>
<ul>
<li>ex: <code>var t = track(); t(&#39;foo&#39;, {bar: &quot;baz&quot;})</code></li>
</ul>
</dd>
<dt><a href="#sleep">sleep(ms)</a></dt>
<dd><p>arbitrary sleep for <code>N</code> ms</p>
</dd>
</dl>

<a name="files"></a>

### files : <code>object</code>
file managment

**Kind**: global namespace  
<a name="validation"></a>

### validation : <code>object</code>
data validation utilities

**Kind**: global namespace  
<a name="display"></a>

### display : <code>object</code>
display, formatting, and other "make it look right" utilities

**Kind**: global namespace  
<a name="calculations"></a>

### calculations : <code>object</code>
functions for maths, crypto, and calculations

**Kind**: global namespace  
<a name="objects"></a>

### objects : <code>object</code>
object utilities

**Kind**: global namespace  
<a name="arrays"></a>

### arrays : <code>object</code>
array utilities

**Kind**: global namespace  
<a name="functions"></a>

### functions : <code>object</code>
function utilities

**Kind**: global namespace  
<a name="logging"></a>

### logging : <code>object</code>
logging, timers and other diagnostic utilities

**Kind**: global namespace  
<a name="ls"></a>

### ls([dir], [objectMode]) ⇒ <code>Promise.&lt;any&gt;</code>
list directory contents

**Kind**: global function  
**Returns**: <code>Promise.&lt;any&gt;</code> - `[]` of files in folder  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dir] | <code>string</code> | <code>&quot;\&quot;./\&quot;&quot;</code> | directory to enumerate; default `./` |
| [objectMode] | <code>boolean</code> | <code>false</code> | return `{name: path}` instead of `[path]`; default `false` |

<a name="rm"></a>

### rm(fileNameOrPath) ⇒ <code>Promise.&lt;(string\|boolean\|void)&gt;</code>
remove a file or directory

**Kind**: global function  
**Returns**: <code>Promise.&lt;(string\|boolean\|void)&gt;</code> - path or `false` if fail  

| Param | Type | Description |
| --- | --- | --- |
| fileNameOrPath | <code>string</code> | file or path to be removed |

<a name="touch"></a>

### touch(fileNameOrPath, [data], [isJson]) ⇒ <code>Promise.&lt;(string\|false)&gt;</code>
create a file

**Kind**: global function  
**Returns**: <code>Promise.&lt;(string\|false)&gt;</code> - the name of the file  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fileNameOrPath | <code>string</code> |  | file to create |
| [data] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | data to write; default `""` |
| [isJson] | <code>boolean</code> | <code>false</code> | is `data` JSON; default `false` |

<a name="load"></a>

### load(fileNameOrPath, [isJson], [encoding])
load a filed into memory

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fileNameOrPath | <code>string</code> |  | file to create |
| [isJson] | <code>boolean</code> | <code>false</code> | is `data` JSON; default `false` |
| [encoding] | <code>string</code> | <code>&quot;utf-8&quot;</code> | file encoring; default `utf-8` |

<a name="mkdir"></a>

### mkdir([dirPath])
make a directory

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dirPath] | <code>string</code> | <code>&quot;\&quot;./tmp\&quot;&quot;</code> | path to create; default `./tmp` |

<a name="isJSONStr"></a>

### isJSONStr(string) ⇒ <code>boolean</code>
test if `string` has JSON structure; if `true` it can be safely parsed

**Kind**: global function  

| Param | Type |
| --- | --- |
| string | <code>string</code> | 

<a name="isJSON"></a>

### isJSON(data) ⇒ <code>boolean</code>
test if `data` can be stringified as JSON

**Kind**: global function  

| Param | Type |
| --- | --- |
| data | <code>string</code> \| <code>JSON</code> | 

<a name="is"></a>

### is(type, val) ⇒ <code>boolean</code>
check if a `type` matches a `value`

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | a native type like `Number` or `Boolean` |
| val | <code>any</code> | any value to check |

<a name="isNil"></a>

### isNil(val) ⇒ <code>boolean</code>
check if a `val` is `null` or `undefined`

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>any</code> | value to check |

<a name="comma"></a>

### comma(num) ⇒ <code>string</code>
turn a number into a comma separated value; `1000` => `"1,000"`

**Kind**: global function  
**Returns**: <code>string</code> - formatted number  

| Param | Type |
| --- | --- |
| num | <code>string</code> \| <code>number</code> | 

<a name="truncate"></a>

### truncate(text, chars, [useWordBoundary]) ⇒ <code>string</code>
truncate a string; using an elipses (`...`)

**Kind**: global function  
**Returns**: <code>string</code> - truncated string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | text to truncate |
| chars | <code>number</code> | <code>500</code> | # of max characters |
| [useWordBoundary] | <code>boolean</code> | <code>true</code> | don't break words; default `true` |

<a name="bytesHuman"></a>

### bytesHuman(bytes, [si], [dp]) ⇒ <code>string</code>
turn a number (of bytes) into a human readable string

**Kind**: global function  
**Returns**: <code>string</code> - # of bytes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bytes | <code>number</code> |  | number of bytes to convert |
| [si] | <code>boolean</code> | <code>false</code> | threshold of 1000 or 1024; default `false` |
| [dp] | <code>number</code> | <code>2</code> | decmimal points; default `2` |

<a name="json"></a>

### json(data, [padding]) ⇒ <code>string</code>
stringify object to json

**Kind**: global function  
**Returns**: <code>string</code> - valid json  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>object</code> |  | any serializable object |
| [padding] | <code>number</code> | <code>2</code> | padding to use |

<a name="stripHTML"></a>

### stripHTML(str) ⇒ <code>string</code>
strip all `<html>` tags from a string

**Kind**: global function  
**Returns**: <code>string</code> - sanitized string  
**Note**: note: `<br>` tags are replace with `\n`  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | string with html tags |

<a name="multiReplace"></a>

### multiReplace(str, [replacePairs]) ⇒ <code>string</code>
find and replace _many_ values in string

**Kind**: global function  
**Returns**: <code>string</code> - multi-replaced string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | string to replace |
| [replacePairs] | <code>Array.&lt;Array&gt;</code> | <code>[[&quot;|&quot;],[&quot;&lt;&quot;],[&quot;&gt;&quot;]]</code> | shape: `[ [old, new] ]` |

<a name="replaceAll"></a>

### replaceAll(oldVal, newVal) ⇒ <code>string</code>
replace all occurance of `old` with `new`

**Kind**: global function  
**Returns**: <code>string</code> - replaced result  
**Note**: this can't be called on any string directly  

| Param | Type | Description |
| --- | --- | --- |
| oldVal | <code>string</code> \| <code>RegExp</code> | old value |
| newVal | <code>string</code> | new value |

<a name="toCSV"></a>

### toCSV(arr, [headers], [delimiter]) ⇒ <code>string</code>
convert array of arrays to CSV like string

**Kind**: global function  
**Returns**: <code>string</code> - a valid CSV  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>Array.&lt;Array&gt;</code> |  | data of the form `[ [], [], [] ]` |
| [headers] | <code>Array.&lt;String&gt;</code> | <code>[]</code> | header column |
| [delimiter] | <code>string</code> | <code>&quot;,&quot;</code> | delimeter for cells; default `,` |

<a name="dupeVals"></a>

### dupeVals(array, [times]) ⇒ <code>Array.&lt;any&gt;</code>
duplicate values within an array N times

**Kind**: global function  
**Returns**: <code>Array.&lt;any&gt;</code> - duplicated array  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array.&lt;any&gt;</code> |  | array to duplicate |
| [times] | <code>number</code> | <code>1</code> | number of dupes per item |

<a name="rand"></a>

### rand(min, max) ⇒ <code>number</code>
random integer between `min` and `max` (inclusive)

**Kind**: global function  
**Returns**: <code>number</code> - random number  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| min | <code>number</code> | <code>1</code> | minimum |
| max | <code>number</code> | <code>100</code> | maximum |

<a name="avg"></a>

### avg(...nums) ⇒ <code>number</code>
calculate average of `...nums`

**Kind**: global function  
**Returns**: <code>number</code> - average  

| Param | Type | Description |
| --- | --- | --- |
| ...nums | <code>number</code> | numbers to average |

<a name="calcSize"></a>

### calcSize(data) ⇒ <code>number</code>
calculate the size (on disk)

**Kind**: global function  
**Returns**: <code>number</code> - estimated size in bytes  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>JSON</code> | JSON to estimate |

<a name="round"></a>

### round(number, [decimalPlaces]) ⇒ <code>number</code>
round a number to a number of decimal places

**Kind**: global function  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| number | <code>number</code> |  | number to round |
| [decimalPlaces] | <code>number</code> | <code>0</code> | decimal places; default `0` |

<a name="uid"></a>

### uid([length]) ⇒ <code>string</code>
generate a random uid:
- `6NswVtnKWsvRGNTi0H2YtuqGwsqJi4dKW6qUgSiUx1XNctr4rkGRFOA9HRl9i60S`

**Kind**: global function  
**Returns**: <code>string</code> - a uid of specified length  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [length] | <code>number</code> | <code>64</code> | length of id |

<a name="uuid"></a>

### uuid() ⇒ <code>string</code>
generated a uuid in v4 format:
- `72452488-ded9-46c1-8c22-2403ea924a8e`

**Kind**: global function  
**Returns**: <code>string</code> - a uuid  
<a name="rnKeys"></a>

### rnKeys(obj, newKeys) ⇒ <code>Object</code>
rename object keys with a mapping object `{oldKey: newKey}`

**Kind**: global function  
**Returns**: <code>Object</code> - new object with renamed keys  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | object to rename |
| newKeys | <code>Object</code> | map of form `{oldKey: newKey}` |

<a name="rnVals"></a>

### rnVals(obj, pairs) ⇒ <code>Object</code>
rename object values using a mapping array

**Kind**: global function  
**Returns**: <code>Object</code> - object with renamed values  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| pairs | <code>Array.&lt;Array&gt;</code> | `[['old', 'new']]` |

<a name="objFilter"></a>

### objFilter(hash, test_function) ⇒ <code>Object</code>
filter arrays by values or objects by keys

**Kind**: global function  
**Returns**: <code>Object</code> - filtered object  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>Object</code> | object or array to filter |
| test_function | <code>function</code> | a function which is called on keys/values |

<a name="objClean"></a>

### objClean(obj) ⇒
removes the following from deeply nested objects:
- `null`
- `undefined` 
- `{}`
- `[]`

**Kind**: global function  
**Returns**: cleaned object  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="objDefault"></a>

### objDefault(obj, defs) ⇒ <code>Object</code>
apply default props to an object; don't override values from source

**Kind**: global function  
**Returns**: <code>Object</code> - an object which has `defs` props  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | original object |
| defs | <code>Object</code> | props to add without overriding |

<a name="objMatch"></a>

### objMatch(obj, source) ⇒ <code>boolean</code>
deep equality match for any two objects

**Kind**: global function  
**Returns**: <code>boolean</code> - do objects match?  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 
| source | <code>Object</code> | 

<a name="clone"></a>

### clone(thing, [opts]) ⇒ <code>Object</code>
an efficient way to clone an Object; outpreforms `JSON.parse(JSON.strigify())` by 100x

**Kind**: global function  
**Returns**: <code>Object</code> - copied object  

| Param | Type | Description |
| --- | --- | --- |
| thing | <code>Object</code> | object to clone |
| [opts] | <code>unknown</code> |  |

<a name="typecastInt"></a>

### typecastInt(obj, [isClone]) ⇒ <code>Object</code>
visit every property of an object a turn "number" values into numbers
- ex: `{foo: {bar: '42'}}` => `{foo: {bar: 42}}`

**Kind**: global function  
**Returns**: <code>Object</code> - object with all "numbers" as proper numbers  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>object</code> |  | object to traverse |
| [isClone] | <code>boolean</code> | <code>false</code> | default `false`; if `true` will mutate the passed in object |

<a name="awaitObj"></a>

### awaitObj(obj) ⇒ <code>Promise</code>
utility to `await` object values
- ex: `{foo: await bar()}`

**Kind**: global function  
**Returns**: <code>Promise</code> - the resolved values of the object's keys  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | object |

<a name="removeNulls"></a>

### removeNulls(objWithNullOrUndef) ⇒ <code>Object</code>
explicitly remove keys with `null` or `undefined` values; mutates object
- ex: `{foo: "bar", baz: null}` => `{foo: "bar"}`

**Kind**: global function  
**Returns**: <code>Object</code> - an object without `null` or `undefined` values  

| Param | Type | Description |
| --- | --- | --- |
| objWithNullOrUndef | <code>Object</code> | an object with `null` or `undefined` values |

<a name="makeInteger"></a>

### makeInteger(value) ⇒ <code>number</code> \| <code>NaN</code>
check if a value is an integer, if so return it

**Kind**: global function  
**Returns**: <code>number</code> \| <code>NaN</code> - a `number` or `NaN`  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | a value to test |

<a name="dedupe"></a>

### dedupe(arrayOfThings) ⇒ <code>Array.&lt;any&gt;</code>
de-dupe array of objects w/Set, stringify, parse

**Kind**: global function  
**Returns**: <code>Array.&lt;any&gt;</code> - deduped array  

| Param | Type | Description |
| --- | --- | --- |
| arrayOfThings | <code>any</code> | array to dedupe |

<a name="dedupeVal"></a>

### dedupeVal(arr, keyNames) ⇒ <code>Array.&lt;any&gt;</code>
de-dupe array of objects by value of specific keys

**Kind**: global function  
**Returns**: <code>Array.&lt;any&gt;</code> - deduped array of objected  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;any&gt;</code> | array to dedupe |
| keyNames | <code>Array.&lt;string&gt;</code> | keynames to dedupe values on |

<a name="chunk"></a>

### chunk(sourceArray, chunkSize) ⇒ <code>Array.&lt;any&gt;</code>
chunk array of objects into array of arrays with each less than or equal to `chunkSize`
- `[{},{},{},{}]` => `[[{},{}],[{},{}]]`

**Kind**: global function  
**Returns**: <code>Array.&lt;any&gt;</code> - chunked array  

| Param | Type | Description |
| --- | --- | --- |
| sourceArray | <code>Array.&lt;any&gt;</code> | array to batch |
| chunkSize | <code>number</code> | max length of each batch |

<a name="shuffle"></a>

### shuffle(array, [mutate]) ⇒ <code>Array.&lt;any&gt;</code>
fisher-yates shuffle of array elements

**Kind**: global function  
**Returns**: <code>Array.&lt;any&gt;</code> - shuffled array  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array.&lt;any&gt;</code> |  | array to shuffle |
| [mutate] | <code>boolean</code> | <code>false</code> | mutate array in place? default: `false` |

<a name="range"></a>

### range(min, max, [step]) ⇒ <code>Array.&lt;number&gt;</code>
the classic python built-in for generating arrays of integers

**Kind**: global function  
**Returns**: <code>Array.&lt;number&gt;</code> - a range of integers  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| min | <code>number</code> |  | starting number |
| max | <code>number</code> |  | ending nunber |
| [step] | <code>number</code> | <code>1</code> | step for each interval; default `1` |

<a name="deepFlat"></a>

### deepFlat(arr) ⇒ <code>Array.&lt;any&gt;</code>
recursively and deeply flatten a nested array of objects
- ex: `[ [ [{},{}], {}], {} ]` => `[{},{},{},{}]`

**Kind**: global function  
**Returns**: <code>Array.&lt;any&gt;</code> - flat array  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;any&gt;</code> | array to flatten |

<a name="strToArr"></a>

### strToArr(str) ⇒ <code>Array.&lt;string&gt;</code>
extract words from a string as an array
- ex `"foo bar baz"` => `['foo','bar','baz']`

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - extracted words  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | string to extract from |

<a name="attempt"></a>

### attempt(fn, ...args)
`try{} catch{}` a function; return results

**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 
| ...args | <code>any</code> | 

<a name="times"></a>

### times(n, iteratee)
do a function `N` times

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | number of times |
| iteratee | <code>function</code> | function to run |

<a name="throttle"></a>

### throttle(func, wait, [options])
throttle a functions's execution every `N` ms

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| func | <code>function</code> |  | function to throttle |
| wait | <code>number</code> |  | ms to wait between executiations |
| [options] | <code>object</code> | <code>{leading: true, trailing: false}</code> |  |

<a name="compose"></a>

### compose() ⇒ <code>function</code>
compose functions, left-to-right
- ex: `c(a,b,c)` => `a(b(c()))`

**Kind**: global function  
**Returns**: <code>function</code> - a composed chain of functions  
<a name="id"></a>

### id(any) ⇒ <code>any</code>
a function which returns it's value

**Kind**: global function  
**Returns**: <code>any</code> - the same thing  

| Param | Type | Description |
| --- | --- | --- |
| any | <code>any</code> | anything |

<a name="cLog"></a>

### cLog(data, message, [severity])
a cloud function compatible `console.log()`

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>string</code> \| <code>JSON</code> |  | data to log |
| message | <code>string</code> |  | accopanying message |
| [severity] | <code>string</code> | <code>&quot;&#x60;INFO&#x60;&quot;</code> | [ google sev label](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity); default `INFO` |

<a name="log"></a>

### log(item, [depth], [maxDepth]) ⇒ <code>void</code>
a comprehensive logging utility in all terminal environments

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>any</code> |  | an item to log |
| [depth] | <code>number</code> | <code>0</code> | depth to log |
| [maxDepth] | <code>number</code> | <code>100</code> | maximum nested depth |

<a name="progress"></a>

### progress(thing, p, message) ⇒ <code>void</code>
dumb progress bar; incrementing console message
- ex: `thing message #`

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| thing | <code>string</code> | what is being |
| p | <code>number</code> | the number to show |
| message | <code>string</code> | - |

<a name="time"></a>

### time(label) ⇒ <code>Timer</code>
returns a timer with the following API
- `timer.start()`
- `timer.end()`
- `timer.report()`
- `timer.prettyTime()`

**Kind**: global function  
**Returns**: <code>Timer</code> - a time  

| Param | Type | Description |
| --- | --- | --- |
| label | <code>string</code> | name for timer |

<a name="quickTime"></a>

### quickTime(callback)
a very quick way to check the length of a function; uses `console.time`
- ex: `timeTaken(main)`

**Kind**: global function  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="tracker"></a>

### tracker([app], [token], [distinct_id]) ⇒ <code>function</code>
track stuff to mixpanel
- ex: `var t = track(); t('foo', {bar: "baz"})`

**Kind**: global function  
**Returns**: <code>function</code> - func with signature: `(event, props = {}, cb = ()=>{})`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [app] | <code>string</code> | <code>&quot;&#x27;akTools&#x27;&quot;</code> | value of `$source` prop |
| [token] | <code>string</code> | <code>&quot;\&quot;99a1209a992b3f9fba55a293e211186a\&quot;&quot;</code> | mixpanel token |
| [distinct_id] | <code>string</code> | <code>&quot;os.userInfo().username&quot;</code> | distinct_id |

<a name="sleep"></a>

### sleep(ms)
arbitrary sleep for `N` ms

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>number</code> | amount of time to sleep |

