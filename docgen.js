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
		.replaceAll('.exports', "");
		
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





try {
	main();
}
catch (e) {
	console.log(`FAIL`);
	console.log(e);
}

