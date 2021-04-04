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

Sisense.connect('https://sisense.zalesia.co.kr:8002') // replace with your Sisense server address
.then((app) => {
    app.dashboards.load('602cbe8d218e9a002d1c4b2a') //replace with your dashboard id
    .then((dash) => {
        //dash.renderFilters(document.getElementById("filters"));
        //dash_saved = dash;
        dash.renderFilters(document.getElementById("mapFilterRender"));
        dash.widgets.get('602cc126218e9a002d1c4b48').container = document.getElementById("widget2"); //replace with another of your widgets' id.
        dash.widgets.get('602cc709218e9a002d1c4b9a').container = document.getElementById("widget3"); //replace with another of your widgets' id.
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
