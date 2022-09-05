const u = require('./index')

test('do tests work?', () => {
    expect(true).toBe(true)
})


//FILE MANAGEMENT
test('ls, rm, touch, mkdir, and load', async ()=>{
	await u.mkdir(`./testStuff/`)
	await u.touch(`./testStuff/foo.txt`, `foo`)
	await u.touch(`./testStuff/bar.json`, {foo: "bar"}, true)
	let files = await u.ls(`./testStuff`)
	let loaded = await u.load(`./testStuff/bar.json`, true)

	expect(files.length).toBe(2)
	expect(loaded.foo).toBe(`bar`)

	await u.rm(`./testStuff/foo.txt`)
	await u.rm(`./testStuff/bar.json`)
	let newFiles = await u.ls(`./testStuff/`)

	expect(newFiles.length).toBe(0)

	await u.rm(`./testStuff/`)
	expect(true).toBe(true)

})

//VALIDATION + DISPLAY
test('smart commas', ()=>{
	let numOne = 1000
	let numTwo = "1000"

	let resultOne = u.comma(numOne)
	let resultTwo = u.comma(numTwo)

	expect(resultOne).toBe('1,000')
	expect(resultTwo).toBe('1,000')

})


test('truncate', ()=>{
	let foo = u.truncate(`a four word string`, 10)

	expect(foo).toBe(`a four...`)
})


// GENERATORS + CALCULATIONS


// OBJECT UTILITES

test('deep clone', ()=>{
	const source = {
		foo : {
			bar : {
				baz : {
					qux : ['dux', 'mux', 'clux']
				},
				dude: 1
			},
			man : true
		},
		bro : "hey guys!"
	}

	const target = u.clone(source)

	const compareByEqual = JSON.stringify(source) === JSON.stringify(target)
	const compareByReference = source === target

	expect(compareByEqual).toBe(true);
	expect(compareByReference).toBe(false);
})

// ARRAY UTILITES

test('dupeValues', ()=>{
	let me = u.dupeVals(['he', 'she', 'they'], 2)

	expect(me.length).toBe(9)
})

// LOGGING





