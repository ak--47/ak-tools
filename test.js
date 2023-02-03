/* cSpell:disable */
// @ts-nocheck
const u = require('./index');

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

});

// ARRAY UTILITES
describe('arrays', () => {
	test('dupeValues', () => {
		let me = u.dupeVals(['he', 'she', 'they'], 2);

		expect(me.length).toBe(9);
	});
});

describe('loggers', () => {
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
})




