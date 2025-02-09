import bcrypt from 'bcryptjs';

// Test data setup
const testUser = {
    inputPassword: bcrypt.hashSync('password123', 10), // Creating a hashed password
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