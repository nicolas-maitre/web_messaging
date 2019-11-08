$(document).ready(function () {

  function second_passed() {
    $('.clock').removeClass('is-off');
  }
  setTimeout(second_passed, 2000)

  $('.switcher').on('click', function(e) {
    e.preventDefault();
    $('.screen').toggleClass('glitch');
  });


  var newDate = new Date();
  newDate.setDate(newDate.getDate());
  var timeMinute = 15;
  var timeSeconde = timeMinute * 60 +1;

  function convert(time) {
    var reste = time;
    var result = '';

    var nbHours = Math.floor(reste / 3600);
    reste -= nbHours * 3600

    var nbMinute = Math.floor(reste / 60);
    reste -= nbMinute * 60;

    var nbSeconds = reste;

    if (nbMinute < 10){
      nbMinute = "0"+ nbMinute;
    }
    if (nbSeconds < 10){
      nbSeconds = "0"+ nbSeconds;
    }

    //change color after 10 min
    if (nbMinute < 10){      
      document.body.style.color = "red";
    }

    //change color after 5 min red and white after 1 sec
    if (nbMinute < 5 ){
      if (nbSeconds % 2 == 0){
        document.body.style.color = "red";
      }else{
        document.body.style.color = "white";
      }
    }


    result = nbMinute + ":" + nbSeconds;
    return result;
}

  setInterval( function() {
    if (timeSeconde != 0){
      timeSeconde--
    }
    var realTime =  convert(timeSeconde);

    $('.time').html(realTime);
    $('.time').attr('data-time', realTime);

  }, 1000);

});