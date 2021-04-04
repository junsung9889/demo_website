Sisense.connect('https://sisense.zalesia.co.kr:8002') // replace with your Sisense server address
.then((app) => {
    app.dashboards.load('602ca248218e9a002d1c4a3b') //replace with your dashboard id
    .then((dash) => {
        dash.widgets.get('602cbd18218e9a002d1c4b17').container = document.getElementById("map_widget"); //replace with one of your widgets' id.
        dash.widgets.get('602cbd9e218e9a002d1c4b21').container = document.getElementById("chart_widget"); //replace with another of your widgets' id.
        dash.widgets.get('602cbe18218e9a002d1c4b23').container = document.getElementById("table_widget"); //replace with another of your widgets' id.
        dash.renderFilters(document.getElementById('mapFilterRender'));
        dash.refresh();
    })
    .catch((e) => {
        console.error(e);
    });
})
.catch((e) => {
    console.error(e);
});
