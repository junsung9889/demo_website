Sisense.connect('https://sisense.zalesia.co.kr:8002') // replace with your Sisense server address
  .then((app) => {
    // dash1
    app.dashboards.load('602c6e38218e9a002d1c4938') //replace with your dashboard id
      .then((dash) => {
        // dash.widgets.get('6010d09f85b957002b99df6e').container = document.getElementById("widget1"); //replace with one of your widgets' id.
        //dash.widgets.get('6010d0c485b957002b99df72').container = document.getElementById("widget2"); //replace with another of your widgets' id.
        dash.widgets.get('602c7093218e9a002d1c4973').container = document.getElementById("widget3"); //replace with another of your widgets' id.

        let indi_widget0 = dash.widgets.get('602c7089218e9a002d1c496f');
        indi_widget0.container = document.getElementById('blank0');
        indi_widget0.on('processresult', function(w, e) {
          document.getElementById('indicator_value0').innerHTML = e.result.value.text;
        });

        let indi_widget = dash.widgets.get('602c708e218e9a002d1c4971');
        indi_widget.container = document.getElementById('blank');
        indi_widget.on('processresult', function(w, e) {
          document.getElementById('indicator_value1').innerHTML = e.result.value.text;
        });

        // // dashboard title text
        // $('#dash1 #title_string').text(dash.$$model.title);
        //

        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });

    // dash 2
    app.dashboards.load('602c6e38218e9a002d1c4938') //replace with your dashboard id
      .then((dash) => {
        dash.widgets.get('602c6f45218e9a002d1c4945').container = document.getElementById("widget4"); //replace with one of your widgets' id.
        dash.widgets.get('602c6f4e218e9a002d1c4949').container = document.getElementById("widget5"); //replace with one of your widgets' id.
        dash.widgets.get('602c6f8f218e9a002d1c494f').container = document.getElementById("widget6"); //replace with one of your widgets' id.
        dash.widgets.get('602c7002218e9a002d1c495b').container = document.getElementById("widget7"); //replace with one of your widgets' id.
        dash.widgets.get('602c7007218e9a002d1c495d').container = document.getElementById("widget8"); //replace with one of your widgets' id.
        dash.widgets.get('602c700b218e9a002d1c495f').container = document.getElementById("widget9"); //replace with one of your widgets' id.
        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });

    // dash 3
    app.dashboards.load('602c6e38218e9a002d1c4938') //replace with your dashboard id
      .then((dash) => {
        // dash.widgets.get('602c7056218e9a002d1c496b').container = document.getElementById("widget30"); //replace with another of your widgets' id.
        // dash.widgets.get('601118b685b957002b99e14b').container = document.getElementById("widget11"); //replace with another of your widgets' id.
        // dash.widgets.get('6011193585b957002b99e155').container = document.getElementById("widget12"); //replace with another of your widgets' id.

        let indi_widget3 = dash.widgets.get('602c704a218e9a002d1c4965');
        indi_widget3.container = document.getElementById('blank3');
        indi_widget3.on('processresult', function(w, e) {
          document.getElementById('indicator_value4').innerHTML = e.result.value.text;
        });

        let indi_widget1 = dash.widgets.get('602c704d218e9a002d1c4967');
        indi_widget1.container = document.getElementById('blank1');
        indi_widget1.on('processresult', function(w, e) {
          document.getElementById('indicator_value2').innerHTML = e.result.value.text;
        });

        let indi_widget2 = dash.widgets.get('602c7051218e9a002d1c4969');
        indi_widget2.container = document.getElementById('blank2');
        indi_widget2.on('processresult', function(w, e) {
          document.getElementById('indicator_value3').innerHTML = e.result.value.text;
        });

        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });

    // dash 4
    app.dashboards.load('602c6e38218e9a002d1c4938') //replace with your dashboard id
      .then((dash) => {
        dash.widgets.get('602c70a9218e9a002d1c4977').container = document.getElementById("widget40"); //replace with one of your widgets' id.
        dash.widgets.get('602c70ac218e9a002d1c4979').container = document.getElementById("widget41"); //replace with another of your widgets' id.

        $("#widget40").show();
        $("#widget41").show();

        $("#widget40").css("position", "absolute").css("z-index", "2");
        $("#widget41").css("position", "absolute").css("z-index", "1");

        dash.renderFilters(document.getElementById("filters"));
        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });
    // dash 5

    app.dashboards.load('6018aaa4218e9a002d1c4482') //replace with your dashboard id
      .then((dash) => {
        dash.widgets.get('602cb1fa218e9a002d1c4acb').container = document.getElementById("widget50"); //replace with one of your widgets' id.
        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });

    // dash 6
    app.dashboards.load('6018aaa4218e9a002d1c4482') //replace with your dashboard id
      .then((dash) => {
        dash.widgets.get('6018ad9a218e9a002d1c4490').container = document.getElementById("widget60"); //replace with one of your widgets' id.
        dash.widgets.get('6018ac1e218e9a002d1c4487').container = document.getElementById("widget61"); //replace with another of your widgets' id.

        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });

    // dash 7
    app.dashboards.load('602e0160218e9a002d1c4dc3') //replace with your dashboard id
      .then((dash) => {
        dash.widgets.get('602e01c8218e9a002d1c4dcc').container = document.getElementById("widget70"); //replace with one of your widgets' id.\
        dash.widgets.load('602e01c8218e9a002d1c4dcc').then(function(widget) {
          $('#dash7 #title_string').text(widget.title);
        });
        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });
    // dash 8
    app.dashboards.load('602e0160218e9a002d1c4dc3') //replace with your dashboard id
      .then((dash) => {
        dash.widgets.get('602e0240218e9a002d1c4dd2').container = document.getElementById("widget80"); //replace with one of your widgets' id.\
        // widget title text
        dash.widgets.load('602e0240218e9a002d1c4dd2').then(function(widget) {
          $('#dash8 #title_string').text(widget.title);
        });
        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });
    // dash 9
    app.dashboards.load('602e0160218e9a002d1c4dc3') //replace with your dashboard id
      .then((dash) => {
        dash.widgets.get('602e0342218e9a002d1c4dd9').container = document.getElementById("widget90"); //replace with one of your widgets' id.\
        // widget title text
        dash.widgets.load('602e0342218e9a002d1c4dd9').then(function(widget) {
          $('#dash9 #title_string').text(widget.title);
        });
        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });
    // dash 10
    app.dashboards.load('602e0160218e9a002d1c4dc3') //replace with your dashboard id
      .then((dash) => {
        dash.widgets.get('602e059c218e9a002d1c4df0').container = document.getElementById("widget100"); //replace with one of your widgets' id.\
        dash.widgets.load('602e059c218e9a002d1c4df0').then(function(widget) {
          $('#dash10 #title_string').text(widget.title);
        });
        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });
    // dash 11
    app.dashboards.load('602e0160218e9a002d1c4dc3') //replace with your dashboard id
      .then((dash) => {
        dash.widgets.get('602e041e218e9a002d1c4de5').container = document.getElementById("widget110"); //replace with one of your widgets' id.\
        dash.widgets.load('602e041e218e9a002d1c4de5').then(function(widget) {
          $('#dash11 #title_string').text(widget.title);
        });
        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });

  }).catch((e) => {
    console.error(e);
  });

//dash3
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
context.fillStyle = "#bfbfbf";
context.fillRect(0, 0, 100, 100);
var canvas2 = document.getElementById("myCanvas2");
var context2 = canvas2.getContext("2d");
context2.fillStyle = "#808080";
context2.fillRect(0, 0, 100, 100);
var canvas3 = document.getElementById("myCanvas3");
var context3 = canvas3.getContext("2d");
context3.fillStyle = "#808080";
context3.fillRect(0, 0, 100, 100);
var canvas4 = document.getElementById("myCanvas4");
var context4 = canvas4.getContext("2d");
context4.fillStyle = "#d7d7d7";
context4.fillRect(0, 0, 100, 100);
var canvas5 = document.getElementById("myCanvas5");
var context5 = canvas5.getContext("2d");
context5.fillStyle = "#ff0000";
context5.fillRect(0, 0, 100, 100);

function filterPoint() {
  let selectedWidgetId = document.getElementById('selectedPoint').value;
  if (selectedWidgetId === "widget40") {
    $("#widget40").show();
    $("#widget41").hide();
  } else {
    $("#widget40").hide();
    $("#widget41").show();
  }
}
