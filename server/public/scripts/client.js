


$(document).ready(onReady);

function onReady() {
    $('#equalsBtn').on('click', submitOperation);
    
}

// this function should take the desired equation from the DOM
function submitOperation() {
    let value1 = Number($('#firstValue').val());
    let operator = $('input:radio[name=operator]:checked').val();
    let value2 = Number($('#secondValue').val());
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
        
    }).catch(function(error){
        // notify if an error
        alert(error);
    });
}
