console.log(companyId);
var socket = io('/dashboard/'+companyId);

socket.on('news', function (data) {
  console.log(data);

  $( document ).find("[data-id='" + data.employee + "']").remove();

if(data.event){
    $('#present').append(`<p data-id="${data.employee}">${data.handler}</p>`)
} else{
    $('#absent').append(`<p data-id="${data.employee}">${data.handler}</p>`)
}

})
