// require express - gives us a function
const express = require('express');
// require body-parser to parse through data
const bodyParser = require('body-parser');

// creates instance of express by calling the function
// returned above - gives us an object
const app = express();
const PORT = 5000;

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({extended: true}));

let calculationsArray = [];
let buttonCalculationsArray = [];

// get data coming from the client.js file
app.post('/operation', (req, res) => {
    // req.body is data that comes from client.js
    console.log('hello from post request', req.body);
    console.log('calculationsArray', calculationsArray);
    let newValue = req.body;
    console.log('newValue', newValue);
    console.log('newValue.value1', newValue.value1);
    console.log('newValue.operator', newValue.operator);
    console.log('newValue.value2', newValue.value2);
    console.log('newValue', newValue);
    let result = mathOperation(Number(newValue.value1), newValue.operator, Number(newValue.value2));
    newValue.result = result;

    console.log('result', result);
    console.log('new object', newValue);
    calculationsArray.push(newValue);
    console.log('updated array', calculationsArray);
    
    
    res.sendStatus(200);
})

// need get request so client.js can GET data of previous calculations from
// the server
app.get('/previousResults', (req, res) => {
    console.log('operations get request');
    res.send(calculationsArray);
    
});


function mathOperation(value1, operator, value2) {
    console.log(value1, operator, value2);
    
    switch(operator) {
        case "+":
            console.log('addition');
            return value1 + value2;            
        case '-':
            console.log('subtraction');
            return value1 - value2;
        case '*':
            console.log('multiplication');
            return value1 * value2;
        case '/':
            console.log('division');
            return value1 / value2;
    }
} // end mathOperation function

// POST for expresions from calculator with interface
app.post('/buttonCalculation', (req, res) => {
    console.log('hello from /submitCalculation post', req.body);
    // here I want to pull apart the req.body object and get the values
    // and operator separated
    let expressionObject = req.body.outputLine;
    let arrayOfExpression = expressionObject.split(' ');
    console.log('arrayOfExpression', arrayOfExpression);
    let value1 = Number(arrayOfExpression[0]);
    let operator = arrayOfExpression[1];
    let value2 = Number(arrayOfExpression[2]);
    let result = buttonMathOperation(value1, operator, value2);
    arrayOfExpression.push(result);
    console.log('arrayOfExpression after calculation', arrayOfExpression);
    buttonCalculationsArray.push(arrayOfExpression);   
    console.log('buttonsCalculationsArray', buttonCalculationsArray);
     
    res.sendStatus(200);    
})

// this one is just different because it still has operators as X and ÷
function buttonMathOperation(value1, operator, value2) {
    console.log(value1, operator, value2);
    
    switch(operator) {
        case "+":
            console.log('addition');
            return value1 + value2;            
        case '-':
            console.log('subtraction');
            return value1 - value2;
        case 'X':
            console.log('multiplication');
            return value1 * value2;
        case '÷':
            console.log('division');
            return value1 / value2;
    }
} // end mathOperation function

// want to do get request to get previous calculations to client.js
app.get('/previousButtonResults', (req, res) => {
    console.log('button get request');
    res.send(buttonCalculationsArray);
})

// start up server
app.listen(PORT, () => {
    console.log('Up and running on port: ', PORT);
    
});