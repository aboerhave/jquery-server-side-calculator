// This is the client.js file for the assignment for week 8 of Prime Digital Academy for Adame Boerhave.
// It was created 10/9/2020 - 10/11/2020

$(document).ready(onReady);

// string to display
let outputLine = '';
let outputBoolean = false;  // This boolean signals whether a result was just displayed
let operatorBoolean = true; // This boolean signals whether an operator has just been pressed

// stuff to do on page load
function onReady() {
    // button listeners for first calculator
    $('#equalsBtn').on('click', submitOperation);
    $('#clearBtn').on('click', clearFunction);
    // button listeners for second calculator
    $('.numberBtn').on('click', concatenateNumber);
    $('.operatorBtn').on('click', concatenateOperator);
    $('#clearButton2').on('click', buttonCalcClear);
    $('#submitBtn').on('click', calculateEquation);
    $('#backspaceBtn').on('click', backspaceFunction);
    $('#clearEntries').on('click', clearServer);
    // listener for clicking on text results to print in display box
    $('#calcWithButtonsOutputSection').on('click', '.listOutput', printToDisplay);
    
    // get the previous calculations to put on the screen.
    getCalculations();          // get function for first calculator
    getButtonCalculations();    // get function for second calc
}   // end onReady fn

// this function takes the desired equation from the DOM and posts
// it to the server
function submitOperation() {
    // values from input boxes and operator buttons
    let value1 = $('#firstValue').val().trim();
    let operator = $('input:radio[name=operator]:checked').val();
    let value2 = $('#secondValue').val().trim();
    console.log('inputs', value1, operator, value2);
    // check for values in boxes
    if (value1 == '' || value2 == '') {
        alert('Please enter values in all of the boxes');
        return;
    }
    if (operator == undefined) {            // check for operator selected
        alert('Please select an operator to use');
        return;
    }
    if (operator == '/' && value2 == '0') { // check for divide by 0
        alert('Can\'t divide by zero!');
        return;
    }
    // post request
    $.ajax({
        method: 'POST',
        url: '/operation',
        data: {
            value1: value1,
            operator: operator,
            value2: value2
        }
    }).then(function(response) {
        // response that comes from the server
        console.log('response', response);
        // clear inputs
        $('#firstValue').val('');
        $('.sign').prop('checked', false);
        $('#secondValue').val('');
        getCalculations();  // call to get request
    }).catch(function(error){
        // notify if an error
        alert(error);
    });
}   // end submitOperation fn

// want to use GET request to get calculations previously completed that are
// now in the calculationsArray
function getCalculations() {
    console.log('get request');
    $.ajax({
        method: 'GET',
        url: '/previousResults'
    }).then(function (response) {
        console.log('response', response);
        printCalcsToDom(response);  // call function to display previous calcs
    });
}   // end getCalculations fn

// function to print previous calculations to DOM
function printCalcsToDom(dataToAppend) {
    console.log('printCalcsToDom');
    // want to empty and start over
    $('#outputSection').empty();
    for (calculation of dataToAppend) {
        $('#outputSection').append(`
            <li>    
                <p>
                    ${calculation.value1} ${calculation.operator} ${calculation.value2} = ${calculation.result}
                <p>
            </li>    
        `);
    }
}   // end printCalcsToDom fn


// clears all the inputs when the C button clicked
function clearFunction() {
    console.log('clear clicked');
    $('#firstValue').val('');
    $('.sign').prop('checked', false);
    $('#secondValue').val('');
}   // end clearFunction


//////////////////////////////////////SECTION FOR FUNCTIONS FOR STRETCH BUTTON CALCULATOR//////////////////////////////////////////////////

// This function runs on a click of a number.  If there is a previous display there, the number
// replaces it.  It sets states of the booleans.
function concatenateNumber() {
    if (outputBoolean == true) {
        outputLine = "";
    }
    console.log('a number button has been clicked');
    let stuffToAdd = $(this).data('value');
    outputLine += `${stuffToAdd}`; 
    console.log('outputLine', outputLine);
    $('#displayOutput').empty();
    $('#displayOutput').append(outputLine);
    operatorBoolean = false;
    outputBoolean = false;
}   // end concatenateNumber fn

// This function runs on click of an operator button.  It does not let the user press the button if the last
// thing in the display is an operator
function concatenateOperator() {
    if (operatorBoolean == true) {
        alert('please enter another number before an operator');
        return;
    }
    console.log('an operator has been clicked');
    $('#displayOutput').empty();
    let op = $(this).data('value')
    outputLine += ` ${op} `;
    $('#displayOutput').append(outputLine); 
    outputBoolean = false;
    operatorBoolean = true;
}   // end concatenateOperator fn

// This function deletes a character if the left arrow button is pressed
function backspaceFunction() {
    console.log('backspace function clicked');
    outputLine = outputLine.toString();
    outputLine = outputLine.slice(0, -1);
    $('#displayOutput').empty();
    $('#displayOutput').append(outputLine); 
}   // end backspaceFunction

// This function makes the POST request with the equation that is in the display of the calculator
function calculateEquation() {
    console.log('equals button clicked');
    // I am sending the string with numbers and operators to the server
    if (operatorBoolean == true) {
        alert('the equation cannot end with an operator');
        return;
    }
    $.ajax({
        method: 'POST',
        url: '/buttonCalculation',
        data: {outputLine}
    }).then(function(response) {
        console.log('response', response);
        getButtonCalculations();
        $('#displayOutput').empty();
        $('#displayOutput').append(outputLine);
        outputBoolean = true; 
    }).catch(function(error){
        alert(error);
    });
}   // end calculateEquation fn

// This function clears the display
function buttonCalcClear() {
    console.log('clear button clicked');
    outputLine = "";
    $('#displayOutput').empty();
    $('#displayOutput').append(outputLine);
}   // end buttonCalcClear fn

// This function gets an array of previous calculations from the server
function getButtonCalculations() {
    console.log('get request for button section');
    $.ajax({
        method: 'GET',
        url: '/previousButtonResults'
    }).then(function (response){
        console.log('response', response);
        printButtonCalcsToDom(response);
    });
}   // end getButtonCalculations

// This function takes the array from the server and prints it to the screen
function printButtonCalcsToDom(expressions) {
    console.log('in the printing results function for calc 2');
    $('#calcWithButtonsOutputSection').empty();
    for(expression of expressions) {       
        console.log('expression', expression);
        let newString = expression.join();
        let outputString = newString.replace(/,/g, ' ')
        console.log('outputString', outputString);
        
        $('#calcWithButtonsOutputSection').append(`
            <li>
                <p class="listOutput">
                    ${outputString}
                </p>
            </li>
        `);
    }
    if (expressions.length > 0) {
    outputLine = expressions[expressions.length-1].slice(-1)[0];
    console.log('outputLine From print function', outputLine);
    $('#displayOutput').empty();
    $('#displayOutput').append(outputLine);
    }
} // end of printButtonCalcsToDom function

// This function requests to clear the array of calculations on the server
function clearServer() {
    console.log('delete request');
    $.ajax({
        method: 'DELETE',
        url: '/delete'
    }).then(function(response){
        console.log('response', response);
        getButtonCalculations();
    });
}   // end clearServer fn

// This function is called when one of the output lines is clicked on and it puts it back
// in the display to recalculate, if desired
function printToDisplay() {
    console.log('printToDisplay function');
    let text = $(this).text().trim();
    console.log('text', text);   
    let end = text.indexOf('=');
    let textToDisplay = text.slice(0,end-1);
    $('#displayOutput').empty();
    $('#displayOutput').append(textToDisplay);
    outputLine = textToDisplay;
    operatorBoolean = false;
}   // end printToDisplay fn