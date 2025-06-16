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


## API

See JSDoc comments in `index.js` for detailed API documentation.

This module exports various utility functions organized into namespaces:

- **files** - File management utilities
- **validate** - Data validation utilities  
- **display** - Formatting and display utilities
- **maths** - Mathematical and crypto utilities
- **objects** - Object manipulation utilities
- **arrays** - Array processing utilities
- **functions** - Function utilities
- **logging** - Logging and diagnostic utilities

All functions are well-documented with JSDoc comments in the source code.