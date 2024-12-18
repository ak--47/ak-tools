/* cSpell:disable */
// @ts-nocheck
const u = require('./index');
const fs = require('fs');
const path = require('path');

test('do tests work?', () => {
	expect(true).toBe(true);
});


//FILES
describe('files', () => {
	test('ls, rm, touch, mkdir, and load', async () => {
		await u.mkdir(`./testStuff/`);
		await u.touch(`./testStuff/foo.txt`, `foo`);
		await u.touch(`./testStuff/bar.json`, { foo: "bar" }, true);
		let files = await u.ls(`./testStuff`);
		let loaded = await u.load(`./testStuff/bar.json`, true);

		expect(files.length).toBe(2);
		expect(loaded.foo).toBe(`bar`);

		await u.rm(`./testStuff/foo.txt`);
		await u.rm(`./testStuff/bar.json`);
		let newFiles = await u.ls(`./testStuff/`);

		expect(newFiles.length).toBe(0);

		await u.rm(`./testStuff/`);
		expect(true).toBe(true);

	});
});




describe('isDirectoryOrFile', () => {
	const testDir = './tmp';
	const testFile = './tmp/testFile.txt';

	beforeAll(() => {
		// Setup: create a test directory and file
		if (!fs.existsSync(testDir)) {
			fs.mkdirSync(testDir);
		}
		fs.writeFileSync(testFile, 'Hello, world!');
	});

	afterAll(() => {
		// Cleanup: remove the test directory and file
		if (fs.existsSync(testFile)) {
			fs.unlinkSync(testFile);
		}
		if (fs.existsSync(testDir)) {
			fs.rmdirSync(testDir);
		}
	});

	test('should return "directory" for a directory', () => {
		const result = u.isDirOrFile(testDir);
		expect(result).toBe('directory');
	});

	test('should return "file" for a file', () => {
		const result = u.isDirOrFile(testFile);
		expect(result).toBe('file');
	});

	test('should return false for a non-existent path', () => {
		const result = u.isDirOrFile('./nonExistentPath');
		expect(result).toBe(false);
	});
});

describe('details', () => {
	const testRoot = './tmp/test_details';
	const subDir = path.join(testRoot, 'subdir');
	const nestedDir = path.join(subDir, 'nested');
	const testFile1 = path.join(testRoot, 'test1.txt');
	const testFile2 = path.join(subDir, 'test2.txt');
	const testFile3 = path.join(nestedDir, 'test3.txt');

	beforeAll(() => {
		try {
			// Create test directory structure
			fs.mkdirSync(testRoot);
			fs.mkdirSync(subDir);
			fs.mkdirSync(nestedDir);
			fs.writeFileSync(testFile1, 'Test file 1');
			fs.writeFileSync(testFile2, 'Test file 2');
			fs.writeFileSync(testFile3, 'Test file 3');
		}
		catch (err) { }

	});

	afterAll(() => {
		try {
			// Cleanup test directory structure
			fs.unlinkSync(testFile3);
			fs.unlinkSync(testFile2);
			fs.unlinkSync(testFile1);
			fs.rmdirSync(nestedDir);
			fs.rmdirSync(subDir);
			fs.rmdirSync(testRoot);
		} catch (err) { }
	});

	test('should return false for non-existent path', () => {
		const result = u.details('./nonexistent/path');
		expect(result).toBe(false);
	});

	test('should correctly identify and describe a file', () => {
		const result = u.details(testFile1);

		expect(result).toEqual(expect.objectContaining({
			type: 'file',
			path: path.resolve(testFile1),
			name: 'test1.txt',
			infos: expect.any(Object)
		}));
	});

	test('should correctly describe a directory with its contents', () => {
		const result = u.details(testRoot);

		expect(result).toEqual(expect.objectContaining({
			type: 'directory',
			path: path.resolve(testRoot),
			name: 'test_details',
			infos: expect.any(Object),
			folders: expect.any(Object),
			files: expect.any(Array)
		}));

		// Check root level file
		expect(result.files).toHaveLength(1);
		expect(result.files[0].name).toBe('test1.txt');

		// Check subdirectory
		expect(result.folders).toHaveProperty('subdir');
		expect(result.folders.subdir.type).toBe('directory');
	});

	test('should handle nested directory structures recursively', () => {
		const result = u.details(testRoot);

		// Check first level
		expect(result.folders.subdir.files).toHaveLength(1);
		expect(result.folders.subdir.files[0].name).toBe('test2.txt');

		// Check second level
		expect(result.folders.subdir.folders.nested.files).toHaveLength(1);
		expect(result.folders.subdir.folders.nested.files[0].name).toBe('test3.txt');
	});

	test('should respect maxDepth option', () => {
		const result = u.details(testRoot, { maxDepth: 1 });

		// Should have first level
		expect(result.folders.subdir).toBeDefined();
		expect(result.folders.subdir.files).toHaveLength(0);

		// Should not have second level
		expect(result.folders.subdir.folders).toEqual({});
	});

	test('should respect exclude option', () => {
		const result = u.details(testRoot, {
			exclude: ['test2.txt', 'nested']
		});

		// Should not have excluded file
		expect(result.folders.subdir.files).toHaveLength(0);

		// Should not have excluded directory
		expect(result.folders.subdir.folders).not.toHaveProperty('nested');
	});

	// test('should include correct file information', () => {
	// 	const result = u.details(testFile1);
	// 	debugger;
	// 	expect(result.infos).toEqual(expect.objectContaining({
	// 		size: expect.any(Number),
	// 		mtime: expect.any(Date),
	// 		ctime: expect.any(Date),
	// 		birthtime: expect.any(Date)
	// 	}));
	// });

	test('should handle empty directories', () => {
		// Create an empty directory
		const emptyDir = path.join(testRoot, 'empty');
		fs.mkdirSync(emptyDir);

		const result = u.details(emptyDir);

		expect(result).toEqual(expect.objectContaining({
			type: 'directory',
			path: path.resolve(emptyDir),
			name: 'empty',
			folders: {},
			files: []
		}));

		// Cleanup
		fs.rmdirSync(emptyDir);
	});


});

//VALIDATION


describe('validation', () => {

	test('is JSON str', () => {
		let jsonLike = `{"foo": "bar", "baz": [1,2,3]}`;
		let actualJson = { "foo": "bar", "baz": [1, 2, 3] };

		expect(u.isJSONStr(jsonLike)).toBe(true);
		expect(u.isJSONStr(actualJson)).toBe(false);

	});

	test('is JSON', () => {
		let actualJson = { "foo": "bar", "baz": [1, 2, 3] };
		let notJSON = "deal with it";

		expect(u.isJSON(actualJson)).toBe(true);
		expect(u.isJSON(notJSON)).toBe(false);
	});

	test('is {type}', () => {
		let stringObject = new String('sup');
		let aString = `foo`;
		let aNumber = 42;
		let aBoolean = false;
		let anObject = { foo: "bar" };
		let anArray = [1, 2, 3, 4];

		expect(u.is(String, stringObject)).toBe(true);
		expect(u.is("string", aString)).toBe(true);
		expect(u.is(Number, aNumber)).toBe(true);
		expect(u.is(Boolean, aBoolean)).toBe(true);
		expect(u.is(Object, anObject)).toBe(true);
		expect(u.is(Array, anArray)).toBe(true);
	});

	test('is nil', () => {
		let aNull = null;
		let und;
		let notNil = `deal with it`;

		expect(u.isNil(aNull)).toBe(true);
		expect(u.isNil(und)).toBe(true);
		expect(u.isNil(notNil)).toBe(false);
	});

	test('similar', () => {
		let a = { foo: "bar" };
		let b = { foo: "baz" };
		let c = { foo: "bar", qux: "dux" };

		expect(u.similar(a, b)).toBe(true);
		expect(u.similar(a, c)).toBe(false);
	});

	test('gcs uri parsing', () => {
		let uri = `gs://bucket-name/path/to/file.txt`;
		let uriAlso = `gcs://bucket-name/path/to/file.txt`;
		let uriMoar = `gcs://bucket-name/file.txt`;
		let uriNoFile = `gs://bucket-name/`;
		let uriNoTrailingSlash = `gs://bucket-name`;
		let expected = { uri: `gs://bucket-name/path/to/file.txt`, bucket: `bucket-name`, file: `path/to/file.txt` };
		let alsoExpected = { uri: `gcs://bucket-name/path/to/file.txt`, bucket: `bucket-name`, file: `path/to/file.txt` };
		let moarExpected = { uri: `gcs://bucket-name/file.txt`, bucket: `bucket-name`, file: `file.txt` };
		let noFileExpected = { uri: `gs://bucket-name/`, bucket: `bucket-name`, file: `` };
		let noTrailingSlashExpected = { uri: `gs://bucket-name`, bucket: `bucket-name`, file: `` };

		expect(u.parseGCSUri(uri)).toStrictEqual(expected);
		expect(u.parseGCSUri(uriAlso)).toStrictEqual(alsoExpected);
		expect(u.parseGCSUri(uriMoar)).toStrictEqual(moarExpected);
		expect(u.parseGCSUri(uriNoFile)).toStrictEqual(noFileExpected);
		expect(u.parseGCSUri(uriNoTrailingSlash)).toStrictEqual(noTrailingSlashExpected);

		function badUri() {
			u.parseGCSUri(`https://google.com`);
		}
		expect(badUri).toThrow(`invalid gcs uri: https://google.com`);
	});

});

// DISPLAY

describe('display', () => {

	test('smart commas', () => {
		let numOne = 1000;
		let numTwo = "1000";

		let resultOne = u.comma(numOne);
		let resultTwo = u.comma(numTwo);

		expect(resultOne).toBe('1,000');
		expect(resultTwo).toBe('1,000');

	});


	test('truncate', () => {
		let foo = u.truncate(`a four word string`, 10);

		expect(foo).toBe(`a four...`);
	});

	test('bytes human', () => {
		let num = 1551859712;
		let answer = "1.4 GiB";
		expect(u.bytesHuman(num, 1, false)).toBe(answer);
	});

	test('json', () => {
		let canbeJson = { foo: 'bar', baz: 'qux' };
		let result = `{"foo":"bar","baz":"qux"}`;

		expect(u.json(canbeJson, 0)).toEqual(result);
	});

	test('strip html', () => {
		let htmlString = `<p>i am paragraph</p> <a href="">i am link</a>`;
		let answer = `i am paragraph i am link`;
		expect(u.stripHTML(htmlString)).toEqual(answer);
	});

	test('multi replace', () => {
		let string = `foo bar baz qux`;
		let replaceMap = [['foo', 'dude'], ['bar', 'car'], ['qux']];
		let answer = `dude car baz`;

		expect(u.multiReplace(string, replaceMap)).toEqual(answer);
	});

	test('replace all', () => {
		let string = `i am hungry`;
		let answer = `i am thirsty`;
		string.replaceAll = u.replaceAll;
		string = string.replaceAll('hungry', 'thirsty');

		expect(string).toEqual(answer);
	});

	test('to csv', () => {
		let arr = [[1, 2, 3], [4, 6, 7], [7, 8, 9]];
		let headers = ['foo', 'bar', 'baz'];
		let answer = `"foo","bar","baz"\n"1","2","3"\n"4","6","7"\n"7","8","9"`;

		expect(u.toCSV(arr, headers)).toEqual(answer);
	});

	test('unbase64', () => {
		let data = `eyJmb28iOiAiYmFyIn0=`;
		let res = u.unBase64(data);
		let answer = { foo: "bar" };
		expect(res).toStrictEqual(answer);
	});

});

// MATHS

describe('maths', () => {

	test('random', () => {
		let min = 10;
		let max = 14;
		u.times(50, () => {
			let rand = u.rand(min, max);
			expect(rand).toBeGreaterThan(9);
			expect(rand).toBeLessThan(15);
		});


	});

	test('average', () => {
		let nums = [2, 4, 6, 8];
		expect(u.avg(...nums)).toBe(5);

	});

	test('calcSize', () => {
		let obj = { foo: "bar", baz: "qux" };
		expect(u.calcSize(obj)).toBe(25);

	});

	test('round', () => {
		let num = 4.21;
		let otherNum = 4.5;

		expect(u.round(num)).toBe(4);
		expect(u.round(otherNum)).toBe(5);

	});

	test('uid', () => {
		let uid = u.uid();
		let longuid = u.uid(128);

		expect(uid.length).toBe(64);
		expect(longuid.length).toBe(128);

		const manyUid = [];

		u.times(1000, () => {
			manyUid.push(u.uid());
		});


		expect(u.dedupe(manyUid).length).toBe(1000);

	});

	test('uuid', () => {
		const uuids = [];

		u.times(1000, () => {
			uuids.push(u.uuid());
		});



		expect(u.dedupe(uuids).length).toBe(1000);
	});

	test('nameMaker', () => {
		const uuids = [];

		u.times(1000, () => {
			uuids.push(u.makeName(10));
		});

		expect(u.dedupe(uuids).length).toBe(1000);

		const threeName = u.makeName(3);
		const fourName = u.makeName(4);
		const fiveName = u.makeName(5);

		expect(threeName.split('-').length).toBe(3);
		expect(fourName.split('-').length).toBe(4);
		expect(fiveName.split('-').length).toBe(5);


	});

});


// OBJECT UTILITES

describe('objects', () => {
	test('dupe array', () => {
		let arr = [1];
		let answer = [1, 1, 1, 1, 1];

		expect(u.dupeVals(arr, 4)).toEqual(answer);
	});
	test('rename keys', () => {
		const oldObj = { foo: "bar", baz: "qux" };
		const newObj = { dude: "bar", man: "qux" };
		const mapping = { foo: "dude", baz: "man" };
		expect(u.rnKeys(oldObj, mapping)).toEqual(newObj);
	});

	test('deep clone', () => {
		const source = {
			foo: {
				bar: {
					baz: {
						qux: ['dux', 'mux', 'clux']
					},
					dude: 1
				},
				man: true
			},
			bro: "hey guys!"
		};

		const target = u.clone(source);

		const compareByEqual = JSON.stringify(source) === JSON.stringify(target);
		const compareByReference = source === target;

		expect(compareByEqual).toBe(true);
		expect(compareByReference).toBe(false);
	});

	test('flatten', () => {
		const orig = { foo: { bar: "baz" } };
		const target = { "foo.bar": "baz" };
		expect(u.flatten(orig)).toEqual(target);
	});

	test('map', () => {
		const orig = { foo: 2, bar: 4 };
		const target = { foo: 4, bar: 8 };
		const op = u.objMap(orig, function (v) {
			return v * 2;
		});
		expect(op).toEqual(target);
	});

	test('getKey', () => {
		const orig = { foo: "bar" };
		const target = "foo";
		const op = u.getKey(orig, "bar");
		expect(op).toBe(target);
	});

});

// ARRAY UTILITES
describe('arrays', () => {
	test('dupeValues', () => {
		let me = u.dupeVals(['he', 'she', 'they'], 2);

		expect(me.length).toBe(9);
	});
});

describe('trackers', () => {
	test('tracker with cb', (done) => {
		let track = u.tracker('akTools');
		track('ping', { 'pong': 'dong' }, (res) => {
			expect(res.length).toBe(2);
			expect(res[0].error).toBe(null);
			expect(res[1].error).toBe(null);
			expect(res[0].status).toBe(1);
			expect(res[1].status).toBe(1);
			done();
		});
	});

	test('tracker w/out cb', () => {
		let track = u.tracker('akTools');
		track('ping', { 'pong': 'mong' });
	});



});


describe('structured logger', () => {
	let consoleSpy;

	beforeEach(() => {
		consoleSpy = jest.spyOn(console, 'log').mockImplementation();
	});

	afterEach(() => {
		consoleSpy.mockRestore();
	});

	test('logs', () => {
		const initialProps = { app: 'TestApp', module: 'TestModule' };
		const testLogger = u.logger(initialProps);

		testLogger.log('Test message', { user: 'testUser' });

		expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify({
			severity: 'INFO',
			message: 'Test message',
			data: { ...initialProps, user: 'testUser' }
		}));
	});

	test('child logs', () => {
		const initialProps = { app: 'TestApp', module: 'TestModule' };
		const additionalProps = { subModule: 'TestSubModule' };
		const parentLogger = u.logger(initialProps);
		const childLogger = parentLogger.createChild(additionalProps);

		childLogger.log('Child message', { user: 'testUser' });

		expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify({
			severity: 'INFO',
			message: 'Child message',
			data: { ...initialProps, ...additionalProps, user: 'testUser' }
		}));
	});

	test('severity', () => {
		const testLogger = u.logger({});
		const message = 'Severity test message';
		const severities = ['INFO', 'ERROR', 'WARN'];

		severities.forEach(severity => {
			testLogger.log(message, {}, severity);
			expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify({
				severity,
				message,
				data: {}
			}));
		});
	});


	test("obfuscate", () => {
		// Empty string
		expect(u.obfuscate("")).toBe("");

		// Single character
		expect(u.obfuscate("A")).toBe("*");

		// Two characters
		expect(u.obfuscate("AB")).toBe("A*");

		// Three characters
		expect(u.obfuscate("ABC")).toBe("A*C");

		// Four characters
		expect(u.obfuscate("ABCD")).toBe("A**D");

		// Longer strings
		expect(u.obfuscate("ABCDE")).toBe("A***E");
		expect(u.obfuscate("Hello")).toBe("H***o");

		// Preserve spaces
		expect(u.obfuscate("Test String")).toBe("T*** S****g");

		// Non-string input (e.g. number)
		expect(u.obfuscate(12345)).toBe("1***5");
	});
});


// TIMER
describe('timer', () => {
	// Mock Date.now()
	let now;
	beforeAll(() => {
		now = Date.now;
		Date.now = jest.fn();
	});

	afterAll(() => {
		Date.now = now;
	});

	test('accuracy', () => {
		Date.now.mockReturnValueOnce(1000).mockReturnValueOnce(5000); // Mock start and end times (e.g., 4 seconds apart)
		const timer = u.time('Test Timer');
		timer.start();
		timer.end();

		expect(timer.report().delta).toBe(4000); // Check if the delta is 4 seconds in milliseconds
		expect(timer.report().human).toBe('4.00 seconds');
	});

	test('multiple cycles', () => {
		Date.now
			.mockReturnValueOnce(1000).mockReturnValueOnce(3000) // First cycle: 2 seconds
			.mockReturnValueOnce(5000).mockReturnValueOnce(11000); // Second cycle: 6 seconds

		const timer = u.time('Test Timer');
		timer.start();
		timer.end();
		timer.start();
		timer.end();

		expect(timer.report().cycles).toBe(2);
		expect(timer.report().delta).toBe(8000); // Total of 8 seconds
		expect(timer.report().human).toBe('8.00 seconds');
	});

	test('pretty time', () => {
		Date.now.mockReturnValueOnce(1000).mockReturnValueOnce(3605000); // 1 hour, 1 second apart
		const timer = u.time('Test Timer');
		timer.start();
		timer.end();

		expect(timer.report().human).toBe('1 hour 4.00 seconds');
	});

	test('not started', () => {
		const timer = u.time('Test Timer');
		const consoleSpy = jest.spyOn(console, 'log');
		timer.end();

		expect(consoleSpy).toHaveBeenCalledWith('Test Timer has not been started...');
		consoleSpy.mockRestore();
	});

	// Additional tests as needed...

	test('pretty time (standalone)', () => {
		const timeFoo = u.prettyTime(3605000);
		expect(timeFoo).toBe('1 hour 5.00 seconds');

		const timeBar = u.prettyTime(3605230);
		expect(timeBar).toBe('1 hour 5.23 seconds');

		const timeBaz = u.prettyTime(3600000);
		expect(timeBaz).toBe('1 hour');

		const timeQux = u.prettyTime(3605236);
		expect(timeQux).toBe('1 hour 5.24 seconds');

	});
});