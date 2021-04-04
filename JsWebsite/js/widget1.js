Sisense.connect('https://sisense.zalesia.co.kr:8002') // replace with your Sisense server address
  .then((app) => {
    // dash1
    app.dashboards.load('60384bfc7899c4002dc8851f') //replace with your dashboard id
      .then((dash) => {
        // dash.widgets.get('6010d09f85b957002b99df6e').container = document.getElementById("widget1"); //replace with one of your widgets' id.
        //dash.widgets.get('6010d0c485b957002b99df72').container = document.getElementById("widget2"); //replace with another of your widgets' id.
        dash.widgets.get('60384d887899c4002dc88529').container = document.getElementById("widget3"); //replace with another of your widgets' id.
        dash.refresh();
      })
      .catch((e) => {
        console.error(e);
      });
  }).catch((e) => {
    console.error(e);
  });
