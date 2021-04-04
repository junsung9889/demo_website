// let filter = {
//     jaql: {
//         dim: "[SIKOREA.BRAND]",
//         datatype: "text",
//         title: "BRAND",
//         collapsed: true,
//         filter: {
//             explicit: true,
//             multiSelection: true,
//             exclude: {
//               members: [
//                 "딥디크"
//               ]
//           }
//         }
//     },
//     isCascading: false
// };
//
// let dash_saved;

Sisense.connect('http://demo.zalesia.com:40845') // replace with your Sisense server address
.then((app) => {
    app.dashboards.load('6018f408b259d8002d9b3cf0') //replace with your dashboard id
    .then((dash) => {
        //dash.renderFilters(document.getElementById("filters"));
        //dash_saved = dash;
        dash.renderFilters(document.getElementById("filters"));
        dash.widgets.get('601a2f1e9dc973002df9c42a').container = document.getElementById("widget2"); //replace with another of your widgets' id.
        dash.widgets.get('601a04999dc973002df9c3b9').container = document.getElementById("widget3"); //replace with another of your widgets' id.
        dash.refresh();
    })
    .catch((e) => {
        console.error(e);
    });
})
.catch((e) => {
    console.error(e);
});

// function a(){
//   dash_saved.$$model.filters.update(filter, {refresh:true, save:true});
// }
