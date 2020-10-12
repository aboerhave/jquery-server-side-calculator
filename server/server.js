// require express - gives us a function
const express = require('express');
// require body-parser to parse through data
const bodyParser = require('body-parser');

// creates instance of express by calling the function returned above - gives us an object
const app = express();
const PORT = 5000;

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({extended: true}));

// array to store calculations after they are posted for first calculator
let calculationsArray = [];
// array to store calculations after they are posted for second calculator
let buttonCalculationsArray = [];

// This section is the POST request for the data coming from the client.js file for the first calculator
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
})  // end post /operation

// This is the GET request section to send the calculationsArray to the client.js file for the first calculator
app.get('/previousResults', (req, res) => {
    console.log('operations get request');
    res.send(calculationsArray);
}); // end GET /previousResults

// This function does the math for the first calculator after taking values and an operator from the post section
function mathOperation(value1, operator, value2) {
    console.log(value1, operator, value2);
    // switch statement depending on operator entered
    switch (operator) {
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

//////////////////////////////////////////////////////// SECTION FOR CALCULATOR WITH BUTTON INTERFACE //////////////////////////////////////////////

// POST for expresions from calculator with interface
app.post('/buttonCalculation', (req, res) => {
    console.log('hello from /submitCalculation post', req.body);
    // here I want to pull apart the req.body object and get the values
    // and operator separated
    let expressionObject = req.body.outputLine;
    let arrayOfExpression = expressionObject.split(' ');
    console.log('arrayOfExpression', arrayOfExpression);
    let arrayToExamine = arrayOfExpression.slice(0,arrayOfExpression.length);
    console.log('arrayToExamine', arrayToExamine);
    let result = doTheMath(arrayToExamine);
    arrayOfExpression.push('=');
    arrayOfExpression.push(result);
    console.log('arrayOfExpression after calculation', arrayOfExpression);
    buttonCalculationsArray.push(arrayOfExpression);   
    console.log('buttonsCalculationsArray', buttonCalculationsArray);
     
    res.sendStatus(200);    
})  // end post /buttonCalculation

// want to take array and find first three elements to calculate based on math order of operations
function doTheMath(array) {
    console.log('array in doTheMath', array);
    let numberOfIterations = Math.floor(array.length/2);
    let result;
    for (let i = 0; i < numberOfIterations; i++) {
        console.log('i', i);
        console.log('array', array);
        let multiplyIndex = array.indexOf('X');
        let divideIndex = array.indexOf('÷');
        console.log('mIndex', multiplyIndex);
        if (multiplyIndex > -1 && divideIndex > -1) {
            // if multiply comes before divide
            if(multiplyIndex < divideIndex){
                console.log('option1');
                
                arrayToCheck = array.splice(multiplyIndex-1, 3);
                console.log('arrayToCheck', arrayToCheck);
                let value1 = arrayToCheck[0];
                let operator = arrayToCheck[1];
                let value2 = arrayToCheck[2];
                result = buttonMathOperation(value1, operator, value2);
                array.splice(multiplyIndex-1,0,result);
            }
            // if divide comes before multiplication
            else if(divideIndex < multiplyIndex) {
                console.log('option2');
                arrayToCheck = array.splice(divideIndex-1, 3);
                console.log('arrayToCheck', arrayToCheck);
                let value1 = arrayToCheck[0];
                let operator = arrayToCheck[1];
                let value2 = arrayToCheck[2];
                result = buttonMathOperation(value1, operator, value2);
                array.splice(divideIndex-1,0,result);
            }
        }
        // if only multiply
        else if (multiplyIndex > 0) {
            console.log('option 3');
            console.log('multiplyIndex', multiplyIndex);
            arrayToCheck = array.splice(multiplyIndex-1, 3);
            console.log('arrayToCheck', arrayToCheck);
            let value1 = arrayToCheck[0];
            let operator = arrayToCheck[1];
            let value2 = arrayToCheck[2];
            result = buttonMathOperation(value1, operator, value2);
            console.log('result', result);
            array.splice(multiplyIndex-1,0,result);
            console.log('array', array);
        }
        // if only divide
        else if(divideIndex > 0) {
            console.log('option4');
            arrayToCheck = array.splice(divideIndex-1, 3);
            console.log('arrayToCheck', arrayToCheck);
            let value1 = arrayToCheck[0];
            let operator = arrayToCheck[1];
            let value2 = arrayToCheck[2];
            result = buttonMathOperation(value1, operator, value2);
            console.log('result', result);
            array.splice(divideIndex-1,0,result);
            console.log('array', array);
        }
        // should only be addition and subtraction left here
        else {
            console.log('option5');
            arrayToCheck = array.splice(0, 3);
            console.log('arrayToCheck', arrayToCheck);
            let value1 = arrayToCheck[0];
            let operator = arrayToCheck[1];
            let value2 = arrayToCheck[2];
            result = buttonMathOperation(value1, operator, value2);
            console.log('result', result);
            array.splice(0 ,0 ,result);
            console.log('array', array);
        }
    }
    return array[0];    // returns the last value in the array which should only be the result left
}   // end doTheMath fn

// This function does the math for the calculator with the button interface.
// It is only different from the other one because it still has operators as X and ÷
function buttonMathOperation(value1, operator, value2) {
    console.log("buttonMathOperation", value1, operator, value2);
    // switch statement for doing the math calculation depending on operator
    switch(operator) {
        case "+":
            console.log('addition');
            return Number(value1) + Number(value2);            
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
} // end buttonMathOperation fn

// section for get request to get previous calculations to client.js
app.get('/previousButtonResults', (req, res) => {
    console.log('button get request');
    res.send(buttonCalculationsArray);
})  // end get /previousButtonResults

// DELETE request to delete the previous calculations from the second calculator
app.delete('/delete', (req, res) => {
    console.log('delete request');
    buttonCalculationsArray.splice(0, buttonCalculationsArray.length);
    console.log('buttonCalculationsArray', buttonCalculationsArray);
    res.sendStatus(200);
})  // end delete request

// start up server
app.listen(PORT, () => {
    console.log('Up and running on port: ', PORT);
    
}); // end listem