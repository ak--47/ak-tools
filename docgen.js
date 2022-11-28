// @ts-nocheck
const jsdoc2md = require('jsdoc-to-markdown');
const prefix = require('./baseReadMe');
const u = require('./index');
const path = require('path')

function main() {
	const genDocs = jsdoc2md.renderSync({ files: './index.js', "heading-depth": 3 });
	const docs = prefix.concat(genDocs);
	const written = u.touch('./README.md', docs);
	written
		.then((data) => {
			console.log(`${path.resolve(data)} was written`);
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

