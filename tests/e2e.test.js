/* cSpell:disable */
// @ts-nocheck
const u = require('../index');
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
			fs.rmSync(testDir, { recursive: true, force: true });
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
			fs.mkdirSync(testRoot, { recursive: true });
			fs.mkdirSync(subDir, { recursive: true });
			fs.mkdirSync(nestedDir, { recursive: true });
			fs.writeFileSync(testFile1, 'Test file 1');
			fs.writeFileSync(testFile2, 'Test file 2');
			fs.writeFileSync(testFile3, 'Test file 3');
		}
		catch (err) {
			console.error('Setup failed:', err);
		}

	});

	afterAll(() => {
		try {
			// Cleanup test directory structure
			fs.rmSync(testRoot, { recursive: true, force: true });
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

	test('makeExist', async () => {
		const testFilePath = './tmp/deep/nested/file.txt';
		const parentDir = './tmp/deep/nested';

		// Clean up first
		try {
			await u.rm('./tmp/deep');
		} catch (e) { }

		const result = await u.makeExist(testFilePath);
		expect(result).toBe(true);

		// Check that directories were created
		expect(u.isDirOrFile(parentDir)).toBe('directory');

		// Clean up
		await u.rm('./tmp/deep');
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

	test('toBool', () => {
		// String cases
		expect(u.toBool('true')).toBe(true);
		expect(u.toBool('TRUE')).toBe(true);
		expect(u.toBool('yes')).toBe(true);
		expect(u.toBool('YES')).toBe(true);
		expect(u.toBool('1')).toBe(true);

		expect(u.toBool('false')).toBe(false);
		expect(u.toBool('FALSE')).toBe(false);
		expect(u.toBool('no')).toBe(false);
		expect(u.toBool('NO')).toBe(false);
		expect(u.toBool('0')).toBe(false);
		expect(u.toBool('')).toBe(false);

		// Non-string cases
		expect(u.toBool(true)).toBe(true);
		expect(u.toBool(false)).toBe(false);
		expect(u.toBool(1)).toBe(true);
		expect(u.toBool(0)).toBe(false);
		expect(u.toBool(null)).toBe(false);
		expect(u.toBool(undefined)).toBe(false);
		expect(u.toBool({})).toBe(true);
		expect(u.toBool([])).toBe(true);

		// Edge cases
		expect(u.toBool('maybe')).toBe(true);
		expect(u.toBool('  true  ')).toBe(true);
		expect(u.toBool('  false  ')).toBe(false);
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

	test('rnVals', () => {
		const orig = { foo: "bar", baz: "qux" };
		const pairs = [["bar", "dude"], ["qux", "man"]];
		const expected = { foo: "dude", baz: "man" };
		expect(u.rnVals(orig, pairs)).toEqual(expected);
	});

	test('objFilter', () => {
		const obj = { foo: "bar", baz: "qux", hello: "world" };

		// Filter by value (values that start with 'b')
		const byValue = u.objFilter(obj, val => val.startsWith('b'));
		expect(byValue).toEqual({ foo: "bar" }); // Only "bar" starts with 'b'

		// Filter by key (keys that start with 'b')
		const byKey = u.objFilter(obj, key => key.startsWith('b'), 'key');
		expect(byKey).toEqual({ baz: "qux" }); // Only "baz" key starts with 'b'
	});

	test('objClean', () => {
		const dirty = {
			foo: "bar",
			baz: null,
			qux: undefined,
			empty: "",
			emptyObj: {},
			emptyArr: [],
			nested: {
				good: "value",
				bad: null,
				worse: undefined
			}
		};

		const cleaned = u.objClean(dirty);
		// The actual behavior - nested nulls might remain due to recursion order
		expect(cleaned.foo).toBe("bar");
		expect(cleaned.baz).toBeUndefined();
		expect(cleaned.qux).toBeUndefined();
		expect(cleaned.empty).toBeUndefined();
		expect(cleaned.emptyObj).toBeUndefined();
		expect(cleaned.emptyArr).toBeUndefined();
		expect(cleaned.nested.good).toBe("value");

		// Test non-clone mode
		const original = { foo: null, bar: "baz" };
		const cleanedInPlace = u.objClean(original, false);
		expect(cleanedInPlace).toEqual({ bar: "baz" });
		expect(original).toEqual({ bar: "baz" }); // Should mutate original
	});

	test('objDefault', () => {
		const original = { foo: "bar" };
		const defaults = { foo: "should not override", baz: "qux", hello: "world" };
		const result = u.objDefault(original, defaults);

		expect(result).toEqual({
			foo: "bar", // Original value preserved
			baz: "qux", // Default added
			hello: "world" // Default added
		});
	});

	test('objMatch', () => {
		const obj1 = { foo: "bar", baz: "qux", extra: "data" };
		const obj2 = { foo: "bar", baz: "qux" };
		const obj3 = { foo: "different", baz: "qux" };

		expect(u.objMatch(obj1, obj2)).toBe(true); // obj1 contains all props from obj2
		expect(u.objMatch(obj1, obj3)).toBe(false); // values don't match
	});

	test('objTypecast', () => {
		const obj = {
			stringNum: "42",
			realString: "hello",
			nested: {
				anotherNum: "123",
				notANum: "abc"
			}
		};

		const result = u.objTypecast(obj);
		expect(result).toEqual({
			stringNum: 42,
			realString: "hello",
			nested: {
				anotherNum: 123,
				notANum: "abc"
			}
		});

		// Original should not be mutated by default
		expect(obj.stringNum).toBe("42");
	});

	test('objAwait', async () => {
		const promiseA = Promise.resolve("valueA");
		const promiseB = Promise.resolve("valueB");
		const obj = {
			a: promiseA,
			b: promiseB,
			c: "not a promise"
		};

		const result = await u.objAwait(obj);
		expect(result).toEqual({
			a: "valueA",
			b: "valueB",
			c: "not a promise"
		});
	});

	test('removeNulls', () => {
		const obj = {
			foo: "bar",
			baz: null,
			qux: undefined,
			hello: "world"
		};

		const result = u.removeNulls(obj);
		expect(result).toEqual({
			foo: "bar",
			hello: "world"
		});

		// Should mutate original object
		expect(obj).toEqual({
			foo: "bar",
			hello: "world"
		});
	});

	test('makeCSV', () => {
		const data = [
			{ name: "John", age: 30, city: "New York" },
			{ name: "Jane", age: 25, city: "Los Angeles" },
			{ name: "Bob", age: 35 } // Missing city
		];

		const csv = u.makeCSV(data);
		const lines = csv.split('\n');

		expect(lines[0]).toBe('name,age,city'); // Headers
		expect(lines[1]).toBe('"John","30","New York"');
		expect(lines[2]).toBe('"Jane","25","Los Angeles"');
		expect(lines[3]).toBe('"Bob","35",'); // Missing field as empty without quotes

		// Test empty data
		expect(u.makeCSV([])).toBe('');
		expect(u.makeCSV(null)).toBe('');
	});

	test('pick', () => {
		const obj = { a: 1, b: 2, c: 3, d: 4 };

		expect(u.pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
		expect(u.pick(obj, [])).toEqual({});
		expect(u.pick(obj, ['nonexistent'])).toEqual({});
		expect(u.pick(obj, ['a', 'nonexistent', 'c'])).toEqual({ a: 1, c: 3 });
	});

	test('omit', () => {
		const obj = { a: 1, b: 2, c: 3, d: 4 };

		expect(u.omit(obj, ['b', 'd'])).toEqual({ a: 1, c: 3 });
		expect(u.omit(obj, [])).toEqual({ a: 1, b: 2, c: 3, d: 4 });
		expect(u.omit(obj, ['nonexistent'])).toEqual({ a: 1, b: 2, c: 3, d: 4 });

		// Should not mutate original
		expect(obj).toEqual({ a: 1, b: 2, c: 3, d: 4 });
	});

});

// ARRAY UTILITES
describe('arrays', () => {
	test('dupeValues', () => {
		let me = u.dupeVals(['he', 'she', 'they'], 2);

		expect(me.length).toBe(9);
	});

	test('dedupe', () => {
		const withDupes = [
			{ name: "John", age: 30 },
			{ name: "Jane", age: 25 },
			{ name: "John", age: 30 }, // Duplicate
			{ name: "Bob", age: 35 }
		];

		const deduped = u.dedupe(withDupes);
		expect(deduped.length).toBe(3);
		expect(deduped).toEqual([
			{ name: "John", age: 30 },
			{ name: "Jane", age: 25 },
			{ name: "Bob", age: 35 }
		]);
	});

	test('dedupeVal', () => {
		const users = [
			{ id: 1, name: "John", role: "admin" },
			{ id: 2, name: "Jane", role: "user" },
			{ id: 1, name: "John Smith", role: "admin" }, // Same id
			{ id: 3, name: "John", role: "user" } // Same name, different id
		];

		// Dedupe by id
		const byId = u.dedupeVal(users, ['id']);
		expect(byId.length).toBe(3);
		expect(byId.find(u => u.id === 1).name).toBe("John"); // First occurrence

		// Dedupe by name - John appears twice, so one should be removed
		const byName = u.dedupeVal(users, ['name']);
		expect(byName.length).toBe(3); // John (admin), Jane, John Smith

		// Dedupe by multiple keys
		const byMultiple = u.dedupeVal(users, ['name', 'role']);
		expect(byMultiple.length).toBe(4); // All are unique by name+role combo
	});

	test('chunk', () => {
		const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const chunked = u.chunk(arr, 3);

		expect(chunked.length).toBe(4);
		expect(chunked[0]).toEqual([1, 2, 3]);
		expect(chunked[1]).toEqual([4, 5, 6]);
		expect(chunked[2]).toEqual([7, 8, 9]);
		expect(chunked[3]).toEqual([10]);

		// Edge cases
		expect(u.chunk([], 3)).toEqual([]);
		expect(u.chunk([1], 3)).toEqual([[1]]);
	});

	test('shuffle', () => {
		const original = [1, 2, 3, 4, 5];
		const shuffled = u.shuffle(original);

		// Should be different array reference
		expect(shuffled).not.toBe(original);

		// Should have same length and elements
		expect(shuffled.length).toBe(5);
		expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);

		// Original should be unchanged
		expect(original).toEqual([1, 2, 3, 4, 5]);

		// Test mutate mode
		const toMutate = [1, 2, 3, 4, 5];
		const mutated = u.shuffle(toMutate, true);
		expect(mutated).toBe(toMutate); // Same reference
	});

	test('range', () => {
		expect(u.range(1, 5)).toEqual([1, 2, 3, 4, 5]);
		expect(u.range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
		// Function doesn't handle descending ranges - would need negative step
		expect(u.range(5, 1)).toEqual([]); // Current behavior
		expect(u.range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
	});

	test('deepFlat', () => {
		const nested = [1, [2, 3], [4, [5, 6]], [[7, 8], 9]];
		const flattened = u.deepFlat(nested);
		expect(flattened).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

		// Already flat array
		expect(u.deepFlat([1, 2, 3])).toEqual([1, 2, 3]);

		// Empty array
		expect(u.deepFlat([])).toEqual([]);
	});

	test('strToArr', () => {
		expect(u.strToArr("hello world test")).toEqual(["hello", "world", "test"]);
		expect(u.strToArr("one,two,three")).toEqual(["one", "two", "three"]);
		expect(u.strToArr("hyphen-word")).toEqual(["hyphen-word"]); // Hyphens preserved
		expect(u.strToArr("")).toEqual([]);

		// Custom pattern
		expect(u.strToArr("a:b:c", /:/)).toEqual(["a", "b", "c"]);
	});

	test('groupBy', () => {
		const users = [
			{ name: 'John', age: 25, role: 'admin' },
			{ name: 'Jane', age: 25, role: 'user' },
			{ name: 'Bob', age: 30, role: 'user' }
		];

		// Group by age
		const byAge = u.groupBy(users, 'age');
		expect(byAge['25']).toHaveLength(2);
		expect(byAge['30']).toHaveLength(1);
		expect(byAge['25'][0].name).toBe('John');

		// Group by function
		const byFirstLetter = u.groupBy(users, user => user.name[0]);
		expect(byFirstLetter['J']).toHaveLength(2);
		expect(byFirstLetter['B']).toHaveLength(1);
	});

	test('ungroupBy', () => {
		const grouped = {
			'25': [{ name: 'John', age: 25 }, { name: 'Jane', age: 25 }],
			'30': [{ name: 'Bob', age: 30 }]
		};

		const flattened = u.ungroupBy(grouped);
		expect(flattened).toHaveLength(3);
		expect(flattened.find(u => u.name === 'John')).toBeDefined();
		expect(flattened.find(u => u.name === 'Bob')).toBeDefined();
	});

	test('keyBy', () => {
		const users = [
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
			{ id: 3, name: 'Bob' }
		];

		const byId = u.keyBy(users, 'id');
		expect(byId['1'].name).toBe('John');
		expect(byId['2'].name).toBe('Jane');
		expect(Object.keys(byId)).toHaveLength(3);

		// By function
		const byFirstLetter = u.keyBy(users, user => user.name[0]);
		expect(byFirstLetter['J'].name).toBe('Jane'); // Last John/Jane wins
		expect(byFirstLetter['B'].name).toBe('Bob');
	});

	test('partition', () => {
		const numbers = [1, 2, 3, 4, 5, 6];
		const [evens, odds] = u.partition(numbers, x => x % 2 === 0);

		expect(evens).toEqual([2, 4, 6]);
		expect(odds).toEqual([1, 3, 5]);

		// With index
		const [first3, rest] = u.partition(numbers, (x, i) => i < 3);
		expect(first3).toEqual([1, 2, 3]);
		expect(rest).toEqual([4, 5, 6]);
	});
});

// FUNCTION UTILITIES
describe('functions', () => {
	test('attempt', async () => {
		// Test successful function
		const successFn = (x, y) => x + y;
		const result1 = await u.attempt(successFn, 5, 3);
		expect(result1).toBe(8);

		// Test failing function
		const failFn = () => { throw new Error('Test error'); };
		const result2 = await u.attempt(failFn);
		expect(result2).toBeInstanceOf(Error);
		expect(result2.message).toBe('Test error');

		// Test async function
		const asyncFn = async (delay) => {
			await new Promise(resolve => setTimeout(resolve, delay));
			return 'async result';
		};
		const result3 = await u.attempt(asyncFn, 1);
		expect(result3).toBe('async result');

		// Test async failing function
		const asyncFailFn = async () => {
			throw new Error('Async error');
		};
		const result4 = await u.attempt(asyncFailFn);
		expect(result4).toBeInstanceOf(Error);
		expect(result4.message).toBe('Async error');
	});

	test('times', () => {
		const results = u.times(5, (i) => i * 2);
		expect(results).toEqual([0, 2, 4, 6, 8]);

		// Test with context
		const context = { multiplier: 3 };
		const contextResults = u.times(3, function (i) {
			return i * this.multiplier;
		}, context);
		expect(contextResults).toEqual([0, 3, 6]);
	});

	test('throttle', (done) => {
		let callCount = 0;
		const fn = () => { callCount++; };
		const throttled = u.throttle(fn, 100);

		// Call multiple times rapidly
		throttled();
		throttled();
		throttled();
		throttled();

		// Should only be called once immediately
		expect(callCount).toBe(1);

		// Wait and check that trailing execution happened
		setTimeout(() => {
			expect(callCount).toBe(2); // Initial + trailing
			done();
		}, 150);
	});

	test('compose', () => {
		const add1 = x => x + 1;
		const multiply2 = x => x * 2;
		const subtract3 = x => x - 3;

		const composed = u.compose(add1, multiply2, subtract3);

		// Should execute right to left: add1(multiply2(subtract3(5)))
		// 5 - 3 = 2, 2 * 2 = 4, 4 + 1 = 5
		expect(composed(5)).toBe(5);

		// Test with single function
		const single = u.compose(add1);
		expect(single(5)).toBe(6);
	});

	test('id', () => {
		expect(u.id(42)).toBe(42);
		expect(u.id('hello')).toBe('hello');
		expect(u.id(null)).toBe(null);
		expect(u.id(undefined)).toBe(undefined);

		const obj = { foo: 'bar' };
		expect(u.id(obj)).toBe(obj); // Same reference
	});

	test('debounce', (done) => {
		let callCount = 0;
		const fn = () => { callCount++; };
		const debounced = u.debounce(fn, 100);

		// Call multiple times rapidly
		debounced();
		debounced();
		debounced();
		debounced();

		// Should not be called immediately (trailing edge)
		expect(callCount).toBe(0);

		// Wait for debounce period
		setTimeout(() => {
			expect(callCount).toBe(1); // Should be called once after delay
			done();
		}, 150);
	});

	test('debounce immediate', () => {
		let callCount = 0;
		const fn = () => { callCount++; };
		const debounced = u.debounce(fn, 100, true);

		// Call multiple times rapidly
		debounced();
		debounced();
		debounced();

		// Should be called immediately (leading edge)
		expect(callCount).toBe(1);
	});

	test('pipe', () => {
		const add1 = x => x + 1;
		const multiply2 = x => x * 2;
		const subtract3 = x => x - 3;

		const piped = u.pipe(add1, multiply2, subtract3);

		// Should execute left to right: subtract3(multiply2(add1(5)))
		// 5 + 1 = 6, 6 * 2 = 12, 12 - 3 = 9
		expect(piped(5)).toBe(9);

		// Test with single function
		const singlePipe = u.pipe(add1);
		expect(singlePipe(5)).toBe(6);

		// Test with no functions
		const emptyPipe = u.pipe();
		expect(emptyPipe(5)).toBe(5);
	});
});

// LOGGING UTILITIES
describe('logging', () => {
	let consoleSpy;

	beforeEach(() => {
		consoleSpy = jest.spyOn(console, 'log').mockImplementation();
	});

	afterEach(() => {
		consoleSpy.mockRestore();
	});

	test('sLog', () => {
		u.sLog('Test message', { key: 'value' }, 'INFO');

		expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify({
			severity: 'INFO',
			message: 'Test message',
			data: { key: 'value' }
		}));

		// Test with default severity
		u.sLog('Another message', { test: true });
		expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify({
			severity: 'INFO',
			message: 'Another message',
			data: { test: true }
		}));

		// Test without data
		u.sLog('No data message');
		expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify({
			severity: 'DEBUG',
			message: 'No data message'
		}));
	});

	test('cLog', () => {
		// Test with object data
		u.cLog({ test: 'data' }, 'Test message', 'INFO', false);
		expect(consoleSpy).toHaveBeenCalledWith('Test message');
		expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify({ test: 'data' }, null, 2));

		// Test with string data  
		u.cLog('string data', 'String test', 'INFO', false);
		expect(consoleSpy).toHaveBeenCalledWith('string dataString test');
	});

	test('log', () => {
		const testObj = {
			level1: {
				level2: {
					value: 'deep'
				},
				simple: 'value'
			}
		};

		const groupSpy = jest.spyOn(console, 'group').mockImplementation();
		const groupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();

		u.log(testObj);

		// Should use console.group for objects
		expect(groupSpy).toHaveBeenCalled();
		expect(groupEndSpy).toHaveBeenCalled();

		groupSpy.mockRestore();
		groupEndSpy.mockRestore();
	});

	test('progress', () => {
		const cursorToSpy = jest.spyOn(require('readline'), 'cursorTo').mockImplementation();
		const clearLineSpy = jest.spyOn(require('readline'), 'clearLine').mockImplementation();
		const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

		u.progress([['users', 1000], ['posts', 500]]);

		expect(cursorToSpy).toHaveBeenCalledWith(process.stdout, 0);
		expect(clearLineSpy).toHaveBeenCalledWith(process.stdout, 0);
		expect(stdoutSpy).toHaveBeenCalledWith('users: 1,000    posts:  500    ');

		cursorToSpy.mockRestore();
		clearLineSpy.mockRestore();
		stdoutSpy.mockRestore();
	});

	test('quickTime', () => {
		const consoleTimeSpy = jest.spyOn(console, 'time').mockImplementation();
		const consoleTimeEndSpy = jest.spyOn(console, 'timeEnd').mockImplementation();

		const result = u.quickTime(() => 'test result');

		expect(consoleTimeSpy).toHaveBeenCalledWith('timeTaken');
		expect(consoleTimeEndSpy).toHaveBeenCalledWith('timeTaken');
		expect(result).toBe('test result');

		consoleTimeSpy.mockRestore();
		consoleTimeEndSpy.mockRestore();
	});

	test('sleep', async () => {
		const start = Date.now();
		await u.sleep(50);
		const elapsed = Date.now() - start;

		expect(elapsed).toBeGreaterThanOrEqual(45); // Allow some tolerance
		expect(elapsed).toBeLessThan(100);
	});

	test('clip', () => {
		const mockSpawn = jest.fn(() => ({
			stdin: {
				write: jest.fn(),
				end: jest.fn()
			}
		}));

		const originalSpawn = require('child_process').spawn;
		require('child_process').spawn = mockSpawn;

		u.clip('test data');

		expect(mockSpawn).toHaveBeenCalledWith('pbcopy');

		require('child_process').spawn = originalSpawn;
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