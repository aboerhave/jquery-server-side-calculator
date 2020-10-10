


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
    
}
