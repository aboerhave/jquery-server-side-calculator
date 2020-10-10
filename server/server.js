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

// get data coming from the client.js file
app.post('/operation', (req, res) => {
    // req.body is data that comes from client.js
    console.log('hello from post request', req.body);
    calculationsArray.push(req.body);
    console.log('calculationsArray', calculationsArray);
    let newValue = req.body;
    console.log('newValue', newValue);
    console.log('newValue.value1', newValue.value1);
    console.log('newValue.operator', newValue.operator);
    console.log('newValue.value2', newValue.value2);
    console.log('newValue', newValue);
    
    let result = mathOperation(Number(newValue.value1), newValue.operator, Number(newValue.value2));
    console.log('result', result);
    
    res.sendStatus(200);
})

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
    
    
}









// start up server
app.listen(PORT, () => {
    console.log('Up and running on port: ', PORT);
    
});