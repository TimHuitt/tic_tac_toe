// Challenge: 08-removeEnds
// Difficulty: Basic
// Prompt:
// - Write a function called removeEnds that accepts a single string argument, then returns the a string with the first and last characters removed.
// - If the length of the string argument is less than 3, return an empty string.
// Examples:
// removeEnds(‘SEI Rocks!’); //=> “EI Rocks”
// removeEnds(‘a’); //=> “” (empty string)

function removeEnds(str) {

  for (let i = 0; i < str.length; i++) {
    newStr = []
    if (i === 0 || i === str.length - 1) {
      newStr.push(str[i])
    }else {
      newStr.push(str[i])
    }
      
    console.log(newStr)
  }

}

console.log(removeEnds('testing'))

