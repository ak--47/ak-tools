#!/usr/bin/env node

const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs').promises;
const path = require('path');

// Base README content from baseReadMe.js
const baseContent = `# ak-tools
 AK's (nearly typesafe) collections of useful things...cobbled together from various projects over the years...

install:

\`\`\`bash
$ npm i ak-tools
\`\`\`

use:
\`\`\`javascript
const utils = require('ak-tools') 	//cjs
import {* as utils} from 'ak-tools' 	//esm
\`\`\`

verify
\`\`\`bash
$ npm run test
\`\`\`

if using an IDE with jsdoc support you should have a good experience. 

## demo
\`\`\`javascript
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
\`\`\`

`;

async function generateDocs() {
    try {
        console.log('Generating documentation from JSDoc comments...');
        
        // Try to generate docs, but fall back gracefully if there are parsing errors
        let apiDocs = '';
        try {
            apiDocs = jsdoc2md.renderSync({ 
                files: './index.js', 
                "heading-depth": 2,
                "no-gfm": false,
                "global-index-format": "none"
            });
        } catch (parseError) {
            console.warn('⚠️  JSDoc parsing had issues, generating basic documentation...');
            // Fallback: create basic API section
            apiDocs = '\n## API\n\nSee JSDoc comments in `index.js` for detailed API documentation.\n\nThis module exports various utility functions organized into namespaces:\n\n- **files** - File management utilities\n- **validate** - Data validation utilities  \n- **display** - Formatting and display utilities\n- **maths** - Mathematical and crypto utilities\n- **objects** - Object manipulation utilities\n- **arrays** - Array processing utilities\n- **functions** - Function utilities\n- **logging** - Logging and diagnostic utilities\n\nAll functions are well-documented with JSDoc comments in the source code.\n';
        }
        
        // Clean up the generated docs if we got them
        const cleanedDocs = apiDocs
            .replace('## Object', '## API')
            .replaceAll(` : <code>object</code>`, "")
            .replaceAll(`**Kind**: global namespace  `, "")
            .replaceAll(`&quot;`, '"')
            .replaceAll('.exports', "")
            .replaceAll(/## Typedefs[\s\S]*?(?=##|$)/g, "") // Remove typedefs section
            .replaceAll(/<a name="[^"]*"><\/a>/g, "") // Remove anchor tags
            .trim();
        
        // Combine base content with API docs
        const fullReadme = baseContent + '\n' + cleanedDocs;
        
        // Write README.md
        await fs.writeFile('./README.md', fullReadme, 'utf8');
        
        console.log('✅ README.md generated successfully!');
        console.log(`📄 ${path.resolve('./README.md')}`);
        
    } catch (error) {
        console.error('❌ Failed to generate documentation:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    generateDocs();
}

module.exports = generateDocs;