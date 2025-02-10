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


