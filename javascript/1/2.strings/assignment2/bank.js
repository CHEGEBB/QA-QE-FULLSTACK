import bcrypt from 'bcryptjs';

function verifyPassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
}

function verifyMFA(inputMfaCode, correctMfaCode) {
    return inputMfaCode === correctMfaCode;
}

function checkBalance(balance, withdrawalAmount) {
    return balance >= withdrawalAmount;
}

function checkDailyLimit(withdrawalAmount, dailyLimit) {
    return withdrawalAmount <= dailyLimit;
}

function processWithdrawal(user, inputPassword, inputMfaCode, withdrawalAmount) {
    if (!(verifyPassword(inputPassword, user.inputPassword))) {
        return 'Transaction failed: Incorrect password.';
    }
    if (!verifyMFA(inputMfaCode, user.correctMfaCode)) {
        return 'Transaction failed: MFA failed.';
    }
    if (!checkBalance(user.balance, withdrawalAmount)) {
        return 'Transaction failed: Insufficient balance.';
    }
    if (!checkDailyLimit(withdrawalAmount, user.dailyLimit)) {
        return 'Transaction failed: Amount exceeds daily limit.';
    }

    user.balance -= withdrawalAmount;
    return 'Transaction successful! New Balance: ' + user.balance;
}

// Test data setup
const testUser = {
    inputPassword: bcrypt.hashSync('password123', 10), 
    correctMfaCode: '123456',
    balance: 1000,
    dailyLimit: 500
};

// Test cases
async function runTests() {
    console.log('Starting tests...\n');

    // Test 1: Successful withdrawal
    console.log('Test 1: Valid withdrawal');
    console.log(await processWithdrawal(
        testUser,
        'password123',
        '123456',
        200
    ));

    // Test 2: Wrong password
    console.log('\nTest 2: Wrong password');
    console.log(await processWithdrawal(
        testUser,
        'wrongpassword',
        '123456',
        200
    ));

    // Test 3: Wrong MFA code
    console.log('\nTest 3: Wrong MFA code');
    console.log(await processWithdrawal(
        testUser,
        'password123',
        '000000',
        200
    ));

    // Test 4: Insufficient balance
    console.log('\nTest 4: Insufficient balance');
    console.log(await processWithdrawal(
        testUser,
        'password123',
        '123456',
        2000
    ));

    // Test 5: Exceeds daily limit
    console.log('\nTest 5: Exceeds daily limit');
    console.log(await processWithdrawal(
        testUser,
        'password123',
        '123456',
        600
    ));
}

runTests();

/*Why is it important to store passwords in a hashed format? What security
advantage does this provide over plain text passwords? */
//When we store passwords in a hashed format, it is more secure than storing them in plain text. Hashing is a one-way function that converts the password into a fixed-length string of characters. This means that even if the hashed password is exposed, it is difficult to reverse-engineer the original password. 
// In contrast, storing passwords in plain text makes them vulnerable to unauthorized access if the database is compromised. Hashing passwords helps protect user data and maintain the confidentiality of sensitive information.

/*How does implementing MFA enhance the security of the transaction process?
What types of attacks does it help prevent? */
//Implementing Multi-Factor Authentication (MFA) enhances the security of the transaction process by adding an additional layer of verification beyond just a password. MFA requires users to provide two or more forms of verification, such as a password and a one-time code sent to their phone or email. This helps prevent unauthorized access even if the password is compromised.

/*Why is it necessary to check the account balance before allowing a withdrawal?
What risks are involved if this step is skipped? */
//It is necessary to check the account balance before allowing a withdrawal to ensure that the account has sufficient funds to cover the requested amount. If this step is skipped, there is a risk of overdrawing the account, which can lead to overdraft fees, declined transactions, and negative balances. Checking the account balance helps prevent financial losses and ensures that the transaction is processed accurately.

/*What purpose does the daily transaction limit serve? How does it help in
preventing fraudulent or excessive withdrawals? */
//The daily transaction limit serves to limit the amount of money that can be withdrawn from an account within a 24-hour period. This helps prevent fraudulent or excessive withdrawals by setting a cap on the maximum amount that can be withdrawn in a single day. If a transaction exceeds the daily limit, it may be flagged as suspicious and require additional verification or be declined altogether. Setting a daily limit helps protect the account from unauthorized access and limits the potential impact of fraudulent activities.

/*If you were to add extra features, such as fraud detection (e.g., detecting
abnormal withdrawal patterns), how would you go about doing this? What
additional data would you track to detect fraud? */
//To add fraud detection features, you could track additional data such as the frequency and amount of withdrawals, the location of the transactions, and the time of day the transactions occur. By analyzing this data, you can detect abnormal withdrawal patterns that may indicate fraudulent activity. For example, if there are multiple withdrawals in quick succession or from different locations, it could be a sign of unauthorized access. You could also implement machine learning algorithms to detect patterns and anomalies in the data to improve fraud detection capabilities.