/*Write a JavaScript function to check whether an 'input' is a string or not.
Test Data:
console.log(is_string('w3resource')); // true
○ console.log(is_string([1, 2, 4, 0])); // false
*/

function is_string (input){
    if(typeof input === 'string'){
        return true;
    } else {
        return false;
    }
}
console.log(is_string('w3resource'));
console.log(is_string([1, 2, 4, 0])); 

/*Write a JavaScript function to check whether a string is blank or not.
Test Data:
console.log(is_Blank('')); // true
○ console.log(is_Blank('abc')); // false
*/
function is_Blank (input){
    if(input.trim() === ''){
        return true;
    } else {
        return false;
    }
}

console.log(is_Blank(''));
console.log(is_Blank('abc'));

/*Write a JavaScript function to split a string and convert it into an array of words.
○ Test Data:
console.log(string_to_array("Robin Singh")); // ["Robin", "Singh"]
*/
function string_to_array (input){
    return input.split(" ");
}

console.log(string_to_array("Robin Singh"));

/*Write a JavaScript function to extract a specified number of characters from a
string.
○ Test Data:
console.log(truncate_string("Robin Singh", 4)); // "Robi"
*/
function truncate_string (input, number){
    return input.slice(0, number);
}
console.log(truncate_string("Robin Singh", 4));

/*
Write a JavaScript function to convert a string into abbreviated form.
○ Test Data:
console.log(abbrev_name("Robin Singh")); // "Robin S."
*/

function abbrev_name (input){
    let name = input.split(" ");
    return name[0] + " " + name[1].charAt(0) + ".";
}
console.log(abbrev_name("Robin Singh")); // "Robin S."

/*
Write a JavaScript function that hides email addresses to prevent unauthorized
access.
○ Test Data:
console.log(protect_email("robin_singh@example.com")); //
"robin...@example.com"
*/
function protect_email(input){
    const email_start = input.indexOf("_");
    const email_end = input.lastIndexOf("@");
    const substring= input.substring(email_start, email_end);
    return input.replace(substring, "...");


}

console.log(protect_email("robin_singh@example.com"));

/*Write a JavaScript function to parameterize a string.
○ Test Data:
console.log(string_parameterize("Robin Singh from USA.")); //
"robin-singh-from-usa */

function string_parameterize(input){
    return input.toLowerCase().replaceAll((" "), "-")
}
console.log(string_parameterize("Robin Singh from USA.")); // "robin-singh-from-usa"


/*Write a JavaScript function to capitalize the first letter of a string.
○ Test Data:
console.log(capitalize('js string exercises')); // "Js string exercises"*/
function capitalize(input){
    return input.charAt(0).toUpperCase() + input.slice(1);
}
console.log(capitalize('js string exercises')); // "Js string exercises"

/*Write a JavaScript function to capitalize the first letter of each word in a string.
○ Test Data:
console.log(capitalize_Words('js string exercises')); // "Js String Exercises"*/
function capitalize_Words(input){
    return input.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

console.log(capitalize_Words('js string exercises')); // "Js String Exercises"

/*Write a JavaScript function that converts uppercase letters to lowercase and vice
versa.
○ Test Data:
console.log(swapcase('AaBbc')); // "aAbBC"*/

function swapcase(input){
    return input.split("").map(letter => letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase()).join("");
}

console.log(swapcase('AaBbc')); // "aAbBC"

/*Write a JavaScript function to convert a string into camel case.
○ Test Data:
console.log(camelize("JavaScript Exercises")); // "JavaScriptExercises"*/

function camelize(input) {
    const words = input.split(" ");
    const camelCaseWords = words.map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return camelCaseWords.join("");
}

console.log(camelize("JavaScript Exercises")); // "javaScriptExercises"

/*Write a JavaScript function to uncamelize a string.
Test Data:
console.log(uncamelize('helloWorld')); // "hello world"
○ console.log(uncamelize('helloWorld','-')); // "hello-world" */
function uncamelize(input, space = ' ') {
    const words = [];
    let word = '';
    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (char === char.toUpperCase() && i !== 0) {
            words.push(word.toLowerCase());
            word = char; 
        } else {
            word += char;
        }
    }
    words.push(word.toLowerCase()); 
    return words.join(space);
}

console.log(uncamelize('helloWorld')); // "hello world"
console.log(uncamelize('helloWorld', '-')); // "hello-world"

/*Write a JavaScript function to concatenate a given string n times.
○ Test Data:
console.log(repeat('Ha!', 3)); // "Ha!Ha!Ha!"*/
function repeat(input, n){
    return input.repeat(n);
}

console.log(repeat('Ha!', 3)); // "Ha!Ha!Ha!"

/*Write a JavaScript function to insert a string within another string at a given
position.
Test Data:
console.log(insert('We are doing some exercises.', 'JavaScript ', 18));
○ // "We are doing some JavaScript exercises."*/
function insert(input, str, n) {
    return input.split('').map((letter, index) => {
        if (index === n) {
            return str + letter;
        }
        return letter;
    }).join('');
}

console.log(insert('We are doing some exercises.', 'JavaScript ', 18)); // "We are doing some JavaScript exercises."

/*
Write a JavaScript function that formats a number with the correct suffix (1st,
2nd, etc.).
○ Test Data:
console.log(humanize_format(301)); // "301st"
 */
function humanize_format(input) {
    const s = ['th','st','nd','rd'];
    return input + (s[input % 10] || s[0]); 
   }
   
console.log(humanize_format(301)); // "301st"

/*Write a JavaScript function to truncate a string and append "...".
Test Data:
console.log(text_truncate('We are doing JS string exercises.', 15, '!!'));
○ // "We are doing !!" */

function text_truncate(input, length, ending) {
    if (input.length > length) {
        return input.substring(0, length - ending.length) + ending;
    } else {
        return input;
    }
}

console.log(text_truncate('We are doing JS string exercises.', 15, '!!')); // "We are doing !!"

/*Write a JavaScript function to chop a string into chunks.
○ Test Data:
console.log(string_chop('w3resource', 3)); // ["w3r", "eso", "urc", "e"] */
function string_chop(input, length) {
    const result = [];
    
    for (let i = 0; i < input.length; i += length) {
        result.push(input.slice(i, i + length));
    }
    
    return result;
}

console.log(string_chop('w3resource', 3)); // ["w3r", "eso", "urc", "e"]

/*Write a JavaScript function to count occurrences of a substring in a string.
Test Data:
console.log(count("The quick brown fox jumps over the lazy dog", 'the')); */

function count(str, searchStr) {
    const lowerStr = str.toLowerCase();
    const lowerSearchStr = searchStr.toLowerCase();

    return lowerStr.split(lowerSearchStr).length - 1;
}

console.log(count("The quick brown fox jumps over the lazy dog", 'the')); // 2

/*Write a JavaScript function that reverses the binary representation of a number
and returns its decimal form.
○ Test Data:
console.log(reverse_binary(100)); // 19 */

function reverse_binary(input) {
    const binary = input.toString(2);
    const reversedBinary = binary.split('').reverse().join('');
    return parseInt(reversedBinary, 2);
}

console.log(reverse_binary(100)); // 19

/*Write a JavaScript function to pad a string to a specified length.
○ Test Data:
console.log(formatted_string('0000', 123, 'l')); // "0123" */

function formatted_string(pad, input, position) {
    let str = input.toString();
    while (str.length < pad.length) {
        str = '0' + str;
    }
    return str;
}

console.log(formatted_string('0000', 123, 'l')); // "0123"