


$(document).ready(onReady);

function onReady() {
    $('#equalsBtn').on('click', submitOperation);
    $('#clearBtn').on('click', clearFunction);

    // get the previous calculations to put on the screen.
    getCalculations();
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