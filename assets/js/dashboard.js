var presentNumber = presentNumber;
var absentNumber = absentNumber;

console.log("present", presentNumber);
console.log("absent", absentNumber);

var socket = io('/dashboard/'+companyId);

socket.on('news', function (data) {

 // Remove employee from the list
 $( document ).find("[data-id='" + data.employee + "']").remove();
// Append to right list
if(data.event){
    absentNumber --;
    presentNumber ++;
    $('#present_employees_number').text(presentNumber);
    $('#absent_employees_number').text(absentNumber);
    $('#present').prepend(`<p data-id="${data.employee}">${data.handler}</p>`)
} else{
    absentNumber ++;
    presentNumber --;
    $('#present_employees_number').text(presentNumber);
    $('#absent_employees_number').text(absentNumber);
    $('#absent').prepend(`<p data-id="${data.employee}">${data.handler}</p>`)
}

})
//  Document ready
$(function() {
    $('#present_employees_number').text(presentNumber);
    $('#absent_employees_number').text(absentNumber);
})
