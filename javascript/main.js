import chalk from 'chalk';
const num1 = 3;
const num2 = 4;

const sum = num1 + num2;
const subtract = num1 - num2;
const multiply = num1 * num2;
const divide = num1 / num2;

console.log( chalk.blue("addition is : ")+ sum  + chalk.red(", subtract is : ")  + subtract + chalk.green(", multiply is : ") + multiply + chalk.yellow(", divide is : ") + divide);