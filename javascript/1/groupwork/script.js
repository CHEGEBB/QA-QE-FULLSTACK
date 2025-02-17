document.addEventListener('DOMContentLoaded', function(){
const user = {
    id: "USER-123456",
    name: {
        first: "Alice",
        last: "Liddell"
    },
    email: "alice@example.com",
    address: {
        shipping: {
            street: "123 Rabbit Hole",
            city: "Wonderland",
            state: "Fantasy",
            postalCode: "12345",
            country: "WL"
        },
        billing: {
            street: "456 Mad Hatter Lane",
            city: "Tea Party",
            state: "Fantasy",
            postalCode: "67890",
            country: "WL"
        }
    },
    payment: {
        total: "100.00",
        currency: "USD",
        details: {
            subtotal: "75.00",
            tax: "15.00",
            shipping: "10.00"
        },
        transactions: [
            {
                id: "TXN-123", amount: "50.00", description: "Magic Potion"
            },
            { id: "TXN-456", amount: "50.00", description: "Enchanted Sword" }
        ]
    }
};

const {id,name:{first:firstName,last:lastName},email, address:{shipping:{street:shippingStreet, city:shippingCity, state:shippingState,postalCode:shippingPostalCode, country:shippingCountry},billing:{street:billingStreet, city:billingCity, state:billingState, postalcode:billingPostalCode, country:billingCountry}},payment:{total,currency,details:{subtotal,tax,shipping},transactions:[{id:id1, amount:amount1,description:description1},{id:id2, amount:amount2, description:description2}]}} = user;

const personalInfo = document.getElementById('personal-info');
const shippingAddress = document.getElementById('shipping-address');
const billingAddress = document.getElementById('billing-address');
const transactions = document.getElementById('transactions');


const firstname = document.createElement('h2');
firstname.textContent = `Name: ${firstName} ${lastName}`
personalInfo.appendChild(firstname)

const emailAddress = document.createElement('h2');
emailAddress.textContent = `Email: ${email}`
// firstname.appendChild(firstName)
personalInfo.appendChild(emailAddress)

const addressDetails = document.createElement('h2');
addressDetails.textContent = 'address details :';
shippingAddress.appendChild(addressDetails)

const sDetails = document.createElement('h3');
sDetails.textContent = 'shipping details :';
shippingAddress.appendChild(sDetails)

const shippingDetails = document.createElement('ul');
const shippingDetail = document.createElement('li');
shippingDetails.appendChild(shippingDetail);

shippingDetail.textContent = `Street: ${shippingStreet}, City: ${shippingCity}, State: ${shippingState}, Postal Code: ${shippingPostalCode}, Country: ${shippingCountry}`;

shippingAddress.appendChild(shippingDetails);

const bDetails = document.createElement('h3');
bDetails.textContent = 'billing details :';
shippingAddress.appendChild(bDetails)

const billingDetails = document.createElement('ul');
const billingDetail = document.createElement('li');
billingDetails.appendChild(billingDetail);

billingDetail.textContent = `Street: ${billingStreet}, City: ${billingCity}, State: ${billingState}, Postal Code: ${billingPostalCode}, Country: ${billingCountry}`;

billingAddress.appendChild(billingDetails);

const tDetails = document.createElement('h2');
tDetails.textContent = 'transaction details :';
transactions.appendChild(tDetails)

const transactionsDetails = document.createElement('ul');
const transactionDetail = document.createElement('li');
transactionsDetails.appendChild(transactionDetail);

transactionDetail.textContent = `Total: ${total} ${currency}, Subtotal: ${subtotal}, Tax: ${tax}, Shipping: ${shipping}, Transactions: ${id1} - ${amount1} ${description1}, ${id2} - ${amount2} ${description2}`;

transactions.appendChild(transactionsDetails);




})