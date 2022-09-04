const u = require('./index')

test('do tests work?', () => {
    expect(true).toBe(true)
})


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

	const target = u.deepClone(source)

	const compareByEqual = JSON.stringify(source) === JSON.stringify(target)
	const compareByReference = source === target

	expect(compareByEqual).toBe(true);
	expect(compareByReference).toBe(false);
})


test('smart commas', ()=>{
	let numOne = 1000
	let numTwo = "1000"

	let resultOne = u.smartComma(numOne)
	let resultTwo = u.smartComma(numTwo)

	expect(resultOne).toBe('1,000')
	expect(resultTwo).toBe('1,000')

})