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



