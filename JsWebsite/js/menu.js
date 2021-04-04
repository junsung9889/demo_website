
$(document).ready(function(){
  // dropdown on sidebar
  var dropdown = document.getElementsByClassName("dropdown-btn");
  var i;
  var tim;
  for (i = 0; i < dropdown.length; i++) {
  	dropdown[i].addEventListener("click", function() {
  		this.classList.toggle("active");
  		var dropdownContent = this.nextElementSibling;
  		if (dropdownContent.style.display === "block") {
  			dropdownContent.style.display = "none";
  		} else {
  			dropdownContent.style.display = "block";
  		}
  	});
  }

  // error..
  $('.star').click(function(){
    // remove within slash for name.
    var imgName = $(this).attr('src').replace(/^.*\//, '');
    if( imgName == 'cardicon_favorit.png'){
      $(this).attr('src','DEMO_IMG/cardicon_favorit_sel.png');
    }
    else{
      $(this).attr('src','DEMO_IMG/cardicon_favorit.png');
    }
  });
});

function play(){
  $("#myCarousel").carousel({
  "interval": 1000
  });
  // var imgName = $(this).children('img').attr('src').replace(/^.*\//, '');
  // if(imgName == 'start.png'){
  //   $(this).children('img').attr('src')
  // }
  // else{
  //   $(this).children('img').attr('src')
  // }
  // $('.carousel').carousel({
  //     interval: 1000
  // });
}
