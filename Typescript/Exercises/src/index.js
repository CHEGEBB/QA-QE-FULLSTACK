"use strict";
//Exercise 1
function getUsername(username) {
    if (username !== null) {
        return `User: ${username}`;
    }
    else {
        return 'Guest';
    }
}
const result = getUsername('Alice');
const result2 = getUsername(null);
console.log(result);
console.log(result2);
function move(direction, distance) {
    console.log(`Move: ${direction}, ${distance}`);
}
move('up', 10);
move('left', 5);
move('right', 10);
//Exercise 3
function validateUsername(username) {
    if (username !== null) {
        return username.length > 5;
    }
    return false;
}
console.log(validateUsername('yobiiiiiii'));
const handleResponse = (response) => {
    if ('data' in response) {
        return response.data.id;
    }
    else {
        throw new Error(response.error);
    }
};
//Exercise 6
const somethingDangerous = () => {
    if (Math.random() > 0.5) {
        throw new Error('Something went wrong');
    }
    return 'all good';
};
try {
    somethingDangerous();
}
catch (error) {
    if (true) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error('An unexpected error occurred');
        }
    }
}
//Exercise 7
const parseValue = (value) => {
    if (typeof value === 'object' &&
        value !== null &&
        'data' in value &&
        typeof value.data === 'object' &&
        value.data !== null &&
        'id' in value.data &&
        typeof value.data.id === 'string') {
        return value.data.id;
    }
    throw new Error('Parsing error!');
};
const squareShape = {
    kind: 'square',
    sideLength: 5
};
function calculateArea(shape) {
    if (shape.kind === 'circle') {
        return Math.PI * shape.radius * shape.radius;
    }
    else if (shape.kind === 'square') {
        return shape.sideLength * shape.sideLength;
    }
    else {
        throw new Error('Invalid shape');
    }
}
console.log(calculateArea(squareShape));
//Exercise 9
function calculateArea2(shape) {
    switch (shape.kind) {
        case 'circle':
            return Math.PI * shape.radius * shape.radius;
            break;
        case 'square':
            return shape.sideLength * shape.sideLength;
            break;
        default:
            throw new Error('Invalid shape');
    }
}
console.log(calculateArea2(squareShape));
