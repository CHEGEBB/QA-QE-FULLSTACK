let age = 25;
const schoolName = "Greenwood High"
let studentsList = [];

//What is the difference between let, const, and var when declaring variables?
//let: keyword when used in declaring variables means that the variable can be reassigned a new value.
//const: keyword when used in declaring variables means that the variable cannot be reassigned a new value.
//var: keyword when used in declaring variables means that the variable can be reassigned a new value. It is the old way of declaring variables in JavaScript.

/*
Which of the following variable names is invalid?
let $price = 100;
let 1stPlace = "John";
let _score = 89;
let userName = "Alice"; 
*/
//valid variable names
let $price = 100;
let _score = 89;
let userName = "Alice";

// Why is the following variable name incorrect?
// const #taxRate = 0.16;
//The variable name is incorrect because it starts with a special character which is not allowed in JavaScript variable names

// Rewrite this variable name to follow best practices:let MyvariableNAME = "JavaScript";
let myVariableName = "JavaScript";

/*
What will be the output of the following?
console.log(typeof "Hello");
console.log(typeof 99);
console.log(typeof true);
console.log(typeof undefined);
*/

console.log(typeof "Hello"); // string
console.log(typeof 99); // number
console.log(typeof true); // boolean
console.log(typeof undefined); // undefined

/*Identify the data types in this array:
let data = ["Kenya", 34, false, { country: "USA" }, null];
*/

let data = ["Kenya", 34, false, { country: "USA" }, null];
console.log(typeof data[0]); // string
console.log(typeof data[1]); // number
console.log(typeof data[2]); // boolean
console.log(typeof data[3]); // object
console.log(typeof data[4]); //object

// How do you define a BigInt in JavaScript? Provide an example.
// BigInt is a built-in object that provides a way to represent whole numbers larger than 2^53 - 1, which is the largest number JavaScript can reliably represent 

let bigInt = 90000000000000000n
console.log(typeof bigInt); //bigInt

/*
Objects & Arrays
11. Create an object person with properties name, age, and city.
12. Add a new property email to the person object.
13. Declare an array fruits with three fruit names.
14. Access the second item in the fruits array
*/

const person = {
    name: "Chege Brian",
    age: 22,
    city: "Nyeri"
};
person.email = "chegephil24@gmail.com";

const fruits = ["kiwi", "grapes", "lime"];

console.log(fruits[1]); // grapes

/*
What will be the output of the following?
console.log("5" + 2);
console.log("5" - 2);
16. Convert the string "100" into a number.
17. Convert the number 50 into a string.
18. What will be the result of this operation?
console.log(5 + true);
*/

console.log("5" + 2); // "52"
console.log("5" - 2); // 3

let num1 = "100";
console.log(Number(num1)); // 100

let num2 = 50;
console.log(String(num2)); // "50"

console.log(5 + true); // 6

