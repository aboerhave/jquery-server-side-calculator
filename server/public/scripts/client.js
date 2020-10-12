// This is the assignment for week 8 of Prime Digital Academy for Adame Boerhave.
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
}

// this function should take the desired equation from the DOM
function submitOperation() {
    let value1 = $('#firstValue').val().trim();
    let operator = $('input:radio[name=operator]:checked').val();
    let value2 = $('#secondValue').val().trim();
    console.log('inputs', value1, operator, value2);

    if (value1 == '' || value2 == '') {
        alert('Please enter values in all of the boxes');
        return;
    }
    if (operator == undefined) {
        alert('Please select an operator to use');
        return;
    }
    if (operator == '/' && value2 == '0') {
        alert('Can\'t divide by zero!');
        return;
    }
    
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
        getCalculations();
    }).catch(function(error){
        // notify if an error
        alert(error);
    });
}

// want to use GET request to get calculations previously completed that are
// now in the calculationsArray
function getCalculations() {
    console.log('get request');
    $.ajax({
        method: 'GET',
        url: '/previousResults'
    }).then(function (response) {
        console.log('response', response);
        printCalcsToDom(response);
    });
}


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
}


// clears all the inputs when the C button clicked
function clearFunction() {
    console.log('clear clicked');
    $('#firstValue').val('');
    $('.sign').prop('checked', false);
    $('#secondValue').val('');
}


////////////TRYING TO DO STRETCH BUTTON CALCULATOR///////////////////////

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
}

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
}

function backspaceFunction() {
    console.log('backspace function clicked');
    outputLine = outputLine.toString();
    outputLine = outputLine.slice(0, -1);
    $('#displayOutput').empty();
    $('#displayOutput').append(outputLine); 
}

function calculateEquation() {
    console.log('equals button clicked');
    // need to put the POST stuff here
    // I am sending the string with numbers and operators
    // to the server
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

}

function buttonCalcClear() {
    console.log('clear button clicked');
    outputLine = "";
    $('#displayOutput').empty();
    $('#displayOutput').append(outputLine);
}

function getButtonCalculations() {
    console.log('get request for button section');
    $.ajax({
        method: 'GET',
        url: '/previousButtonResults'
    }).then(function (response){
        console.log('response', response);
        printButtonCalcsToDom(response);
    });
}

// function printButtonCalcsToDom(expressions) {
//     console.log('in the printing results function for calc 2');
//     $('#calcWithButtonsOutputSection').empty();
//     for(expression of expressions) {       
//         console.log('expression', expression);
        
//         $('#calcWithButtonsOutputSection').append(`
//             <li>    
//                 <p class="listOutput">`);
//                     for (let i = 0; i < expression.length; i++) {
//                         $('#calcWithButtonsOutputSection').append(` ${expression[i]}`);
//                     }           
//         // $('#calcWithButtonsOutputSection').append(`
//         //             </p>
//         //     </li>
//         // `);
//     }
//     if (expressions.length > 0) {
//     outputLine = expressions[expressions.length-1].slice(-1)[0];
//     console.log('outputLine From print function', outputLine);
//     $('#displayOutput').empty();
//     $('#displayOutput').append(outputLine);
//     }
// } // end of printButtonCalcsToDom function

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



// want to clear server data
function clearServer() {
    console.log('delete request');
    $.ajax({
        method: 'DELETE',
        url: '/delete'
    }).then(function(response){
        console.log('response', response);
        getButtonCalculations();
    });
    
}

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
}