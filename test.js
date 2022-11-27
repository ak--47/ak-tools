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

});

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
		expect(u.bytesHuman(num, false, 1)).toBe(answer);
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

});

// CALCULATIONS

describe('calculations', ()=>{
	
})


// OBJECT UTILITES

describe('objects', () => {

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

// LOGGING





