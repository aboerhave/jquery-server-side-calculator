


$(document).ready(onReady);

function onReady() {
    $('#equalsBtn').on('click', submitOperation);
    $('#clearBtn').on('click', clearFunction);
}

// this function should take the desired equation from the DOM
function submitOperation() {
    let value1 = $('#firstValue').val();
    let operator = $('input:radio[name=operator]:checked').val();
    let value2 = $('#secondValue').val();
    console.log('inputs', value1, operator, value2);
    
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
        
    }).catch(function(error){
        // notify if an error
        alert(error);
    });
}

// clears all the inputs when the C button clicked
function clearFunction() {
    console.log('clear clicked');
    $('#firstValue').val('');
    $('.sign').prop('checked', false);
    $('#secondValue').val('');
}