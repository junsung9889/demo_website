var url = window.location.href;
var nav = url.slice(window.location.href.indexOf('?') + 1);
nav = nav.split('=');
nav = nav[1];

if (nav == 'warningKPI') {
  $('.rows').hide();
  $('.red').show();
}
