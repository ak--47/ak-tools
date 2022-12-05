// @ts-nocheck
const jsdoc2md = require('jsdoc-to-markdown');
const prefix = require('./baseReadMe');
const u = require('./index');
const path = require('path');

function main() {
	const genDocs = jsdoc2md
		.renderSync({ files: './index.js', "heading-depth": 2 })
		.replace('## Object', '## API')
		.replaceAll(` : <code>object</code>`, "")
		.replaceAll(`**Kind**: global namespace  `, "")
		.replaceAll(`&quot;`, "")
		.replaceAll('.exports', "")
		.replaceAll(typeDefsPrefix, "")
		.replaceAll(typeDefsSuffix, "");
		
	const docs = prefix.concat(genDocs).trim();
	const written = u.touch('./README.md', docs);
	u.copy(docs);
	written
		.then((data) => {
			console.log(`\n${path.resolve(data)} was written\n\nit's also on your clipboard ;p\n\n`);
		})
		.catch((e) => {
			console.error(`docs failed!\n${e}`);
		});

}



const typeDefsPrefix = String.raw`## Typedefs

<dl>
<dt><a href="#generalObject">generalObject</a> : <code>Object.&lt;string, any&gt;</code></dt>
<dd><p>generic for <code>{}</code> w/string keys</p>
</dd>
<dt><a href="#arrayOfObjects">arrayOfObjects</a> : <code><a href="#generalObject">Array.&lt;generalObject&gt;</a></code></dt>
<dd><p>generic for <code>[{},{},{}]</code></p>
</dd>
<dt><a href="#filterCallback">filterCallback</a> : <code>function</code></dt>
<dd></dd>
</dl>`

const typeDefsSuffix = `<a name="generalObject"></a>

## generalObject : <code>Object.&lt;string, any&gt;</code>
generic for \`{}\` w/string keys

**Kind**: global typedef  
<a name="arrayOfObjects"></a>

## arrayOfObjects : [<code>Array.&lt;generalObject&gt;</code>](#generalObject)
generic for \`[{},{},{}]\`

**Kind**: global typedef  
<a name="filterCallback"></a>

## filterCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| keyOrValue | <code>string</code> | object's value or key to test |`

try {
	main();
}
catch (e) {
	console.log(`FAIL`);
	console.log(e);
}

