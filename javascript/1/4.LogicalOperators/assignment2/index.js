/*Write a function to determine if a given string is a palindrome.
` A palindrome is a string that reads the same forward and backward (ignoring spaces, punctuation, and case). */
function isPalindrome(str){
    let string = str.split(" ").join("").toLowerCase().replaceAll(/[, ? !]/g, "")
    let result = string.split("").reverse().join("")
    // console.log(string)
    // console.log(result)
    return result === string;

}
console.log(isPalindrome("A man, a plan, a canal, Panama") );
console.log(isPalindrome("Was it a car or a cat I saw ?"));
console.log(isPalindrome("Hello, World!"));

/*Write a function to reverse a given string. */
function reverse_string(string) {
    return string.split("").reverse().join("");
}
console.log(reverse_string("Hello, World!"));

// /*Write a function to find the longest palindromic substring in a given string. */
function longestPalindromicSubstring(s) {
    let longest = '';
    for (let i = 0; i < s.length; i++) {
        for (let j = i + 1; j <= s.length; j++) {
            let substring = s.slice(i, j);
            if (isPalindrome(substring) && substring.length > longest.length) {
                longest = substring;
            }
        }
    }
    
    return longest;
}

console.log(longestPalindromicSubstring('babad')); // 'bab' or 'aba'
console.log(longestPalindromicSubstring('cbbd'));  // 'bb'

/*Write a function to check if two given strings are anagrams of each other. 
Two strings are anagrams if they contain the same characters in the same frequency but in different orders. */
function areAnagrams( str1, str2 ) {
    let first = str1.toLowerCase().split("").sort();
    let second = str2.toLowerCase().split("").sort();

     if (first.length !== second.length) return false;
    
    for (let i = 0; i < first.length; i++) {
        if (first[i] !== second[i]) return false;
    }
    
    return true;

}
console.log(areAnagrams('Listen', 'Silent'));
console.log(areAnagrams('Hello' , 'World'));

/*Write a function to remove duplicate characters from a string while preserving the order of the first appearance of each character. */

function removeDuplicates(str) {
    let result = '';
    let string = [];

    for (let i = 0; i < str.length; i++) {
        if (!string[str[i]]) {
            result += str[i];
            string[str[i]] = true;
        }
    }
    
    return result;
}

console.log(removeDuplicates('programming')); 
console.log(removeDuplicates('hello world'));
console.log(removeDuplicates('aaaaa')); 
console.log(removeDuplicates('abcd')); 
console.log(removeDuplicates('aabbcc')); 

/*Write a function to count how many distinct palindromes are in a given string. 
A palindrome is considered distinct based on its start and end position in the string.*/

function countPalindromes(str) {
     let count = 0;
    let length = str.length;

    for (let i = 0; i < length; i++) {
        for (let j = i + 1; j <= length; j++) {
            let substring = str.slice(i, j);
            if (isPalindrome(substring)) {
                count++;
            }
        }
    }
    
    return count;

}

/*Write a function to find the longest common prefix string amongst an array of strings. 
If there is no common prefix, return an empty string.*/

function longestCommonPrefix(strs) {
    if (strs.length === 0) return '';

    let prefix = strs[0];

    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix)!== 0) {
            prefix = prefix.substring(0, prefix.length - 1);

            if (prefix.length === 0) return '';
        }
    }

    return prefix;
}

console.log(longestCommonPrefix(["flower", "flow", "flight"])); // "fl"
console.log(longestCommonPrefix(["dog", "racecar", "car"]));
console.log(longestCommonPrefix(["interspecies", "interstellar", "interstate"]));
console.log(longestCommonPrefix(["prefix", "prefixes", "preform"]));
console.log(longestCommonPrefix(["apple", "banana", "cherry"]));

/*Modify the palindrome function to be case insensitive, meaning it should ignore upper and lower case differences when checking for a palindrome.*/

function isCaseInsensitivePalindrome(str){
    let string = str.split(" ").join("").toLowerCase().replaceAll(/[, ? !]/g, "")
    let result = string.split("").reverse().join("")
    // console.log(string)
    // console.log(result)
    return result === string;

}

console.log(isCaseInsensitivePalindrome("Aba") );
console.log(isCaseInsensitivePalindrome("Racecar") );
console.log(isCaseInsensitivePalindrome("Palindrome") );
console.log(isCaseInsensitivePalindrome("Madam") );
console.log(isCaseInsensitivePalindrome("Hello") );









