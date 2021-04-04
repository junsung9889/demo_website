Sisense.connect('https://sisense.zalesia.co.kr:8002') // replace with your Sisense server address
.then((app) => {
    app.dashboards.load('602dc774218e9a002d1c4d0f') //replace with your dashboard id
    .then((dash) => {
        dash.widgets.get('602dca8b218e9a002d1c4d1e').container = document.getElementById("finance_widget"); //replace with one of your widgets' id.

        dash.refresh();
    })
    .catch((e) => {
        console.error(e);
    });
})
.catch((e) => {
    console.error(e);
});
