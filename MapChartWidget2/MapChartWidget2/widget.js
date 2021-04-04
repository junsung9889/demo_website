let selectedFilter = '';
let svg,map,projection,path,geojson,center,bounds;
let rendered = false;
let CENTERED;
let isSeoul = false;
let width,height;
let size = 0;
let title1, title2;
const SPECIAL_CITIES = ['서울특별시', '인천광역시', '대전광역시', '대구광역시', '부산광역시', '울산광역시', '광주광역시', '세종특별자치시', '제주특별자치도'];
//지역들의 위,경도 좌표 지정
let coords1 = {
    "서울": {"lat" : "37.532600","lon" : "127.024612","plan":0,"actual":0},
    "대전": {"lat" : "36.35111","lon" : "127.38500","plan":0,"actual":0},
    "경기": {"lat" : "37.361406","lon" : "127.396517","plan":0,"actual":0},
    "경남": {"lat" : "35.408670","lon" : "128.232210","plan":0,"actual":0},
    "광주": {"lat" : "35.160615","lon" : "126.851508","plan":0,"actual":0},
    "대구": {"lat" : "35.87209615618607","lon" : "128.60055994210455","plan":0,"actual":0},
    "부산": {"lat" : "35.17998913267344","lon" : "129.0751071575918","plan":0,"actual":0},
    "울산": {"lat" : "35.54010830463827","lon" : "129.31136460764057","plan":0,"actual":0},
    "인천": {"lat" : "37.45677811326679","lon" : "126.70476903022615","plan":0,"actual":0},
    "충남": {"lat" : "36.395899345947456","lon" : "126.79617869507643","plan":0,"actual":0},
    "충북": {"lat" : "36.85811054459181","lon" : "127.69949880809368","plan":0,"actual":0},
    "기타": {"lat" : "33.96877102883713","lon" : "129.62193463701524","plan":0,"actual":0}
};
let coords2 = {
    "서울강남구": {"lat":"37.4959854","lon":"127.0664091"},
    "서울강북구": {"lat":"37.6469954","lon":"127.0147158"},
    "서울광진구": {"lat":"37.5481445","lon":"127.0857528"},
    "서울서대문구": {"lat":"37.5820369","lon":"126.9356665"},
    "서울서초구": {"lat":"37.4769528","lon":"127.0378103"},
    "서울송파구": {"lat":"37.5048534","lon":"127.1144822"},
    "서울양천구": {"lat":"37.5270616","lon":"126.8561534"},
    "서울영등포구": {"lat":"37.520641","lon":"126.9139242"},
    "서울용산구": {"lat":"37.5311008","lon":"126.9810742"},
    "서울종로구": {"lat":"37.5990998","lon":"126.9861493"},
    "서울중구": {"lat":"37.5579452","lon":"126.9941904"},
    "경기부천시": {"lat":"37.50215102976904","lon":"126.78911980227893"},
    "경기성남시": {"lat":"37.410199174746275","lon":"127.01279725259601"},
    "경기용인시": {"lat":"37.2197242982841","lon":"127.22011410780807"},
    "경기의정부시": {"lat":"37.738657781834206","lon":"127.0712255061439"},
    "경기하남시": {"lat":"37.54434967683224","lon":"127.24200869650971"},
    "인천남구": {"lat":"37.443710783634145","lon":"126.68991684370002"},
    "인천미추홀구": {"lat":"37.48032321641144","lon":"126.5598041158173"}
};
prism.registerWidget("MapChartWidget2", {
    name: "MapChartWidget2",
    family: "maps",
    title: "MapChartWidget2",
    iconSmall: "/plugins/MapChartWidget2/widget-icon.png",
    // sizing must be stated
    sizing: {
        defaultHeight: 400,
        defaultWidth: 400
    },
    data: {
        selection: [],
        defaultQueryResult: {},
        panels: [
            //dimension panel
            {
                name: 'region',
                type: 'visible',
                metadata: {
                    types: ['dimensions'],
                    maxitems: 2
                }
            },
            {
                name: 'plan sales',
                type: 'visible',
                metadata: {
                    types: ['measures'],
                    maxitems: 1
                }
            },
            {
                name: 'actual sales',
                type: 'visible',
                metadata: {
                    types: ['measures'],
                    maxitems: 1
                }
            }
        ],
        // builds a jaql query from the given widget
        buildQuery: function(widget) {
            //
            // building jaql query object from widget metadata
            var query = {
                datasource: widget.datasource,
                metadata: []
            };
            
            query.metadata.push(widget.metadata.panel("region").items[0]);
            query.metadata.push(widget.metadata.panel("region").items[1]);
            query.metadata.push(widget.metadata.panel("plan sales").items[0]);
            query.metadata.push(widget.metadata.panel("actual sales").items[0]);
            
            return query;
            
        },
        // prepares the widget-specific query result from the given result data-table
        processResult: function(widget, queryResult) {
            title1 = widget.metadata.panel('plan sales').items[0].jaql.title;
            title2 = widget.metadata.panel('actual sales').items[0].jaql.title;
            console.log(queryResult);
            let processedResult = [];
            queryResult.$$rows.forEach(function(item) {
                let region1 = item[0]['data'];
                let region2 = item[1]['data'];
				let plan = item[2]['data'];
				let actual = item[3]['data'];
                coords1[region1].plan += plan;
                coords1[region1].actual += actual;
                //각 지역들의 이름,좌표,차트데이터1,2로 데이터를 가공, 배열로 삽입
                if(region1 == "서울"){
                    processedResult.push({
                        "name":region1 + region2,
                        "lat":coords2[region1 + region2].lat,
                        "lon":coords2[region1 + region2].lon,
                        "data1":plan,
                        "data2":actual
                    });
                }
            });
            queryResult.$$rows.forEach(function(item) {
                let region1 = item[0]['data'];
                let region2 = item[1]['data'];
				let plan = item[2]['data'];
				let actual = item[3]['data'];
                //각 지역들의 이름,좌표,차트데이터1,2로 데이터를 가공, 배열로 삽입
                if(region1 == "경기"){
                    processedResult.push({
                        "name":region1 + region2,
                        "lat":coords2[region1 + region2].lat,
                        "lon":coords2[region1 + region2].lon,
                        "data1":plan,
                        "data2":actual
                    });
                }
            });
            queryResult.$$rows.forEach(function(item) {
                let region1 = item[0]['data'];
                let region2 = item[1]['data'];
				let plan = item[2]['data'];
				let actual = item[3]['data'];
                //각 지역들의 이름,좌표,차트데이터1,2로 데이터를 가공, 배열로 삽입
                if(region1 == "인천"){
                    processedResult.push({
                        "name":region1 + region2,
                        "lat":coords2[region1 + region2].lat,
                        "lon":coords2[region1 + region2].lon,
                        "data1":plan,
                        "data2":actual
                    });
                }
            });
            for(key in coords1){
                processedResult.push({
                    "name":key,
                    "lat":coords1[key].lat,
                    "lon":coords1[key].lon,
                    "data1":coords1[key].plan,
                    "data2":coords1[key].actual
                });
            }

            //원래
            //{지역이름, 데이터1, 데이터2}였던 것을
            //{지역이름, 경도, 위도, 데이터1, 데이터2}로 좌표정보를 추가함과 동시에 key, value로 정보를 저장하고
            //배열로 만드는 것
			
            return processedResult;
        }
    },
    render: function(widget, event) {
        //차트 클릭(선택) 시 필터가 적용되고, refresh가 되는데, 이 때 render가 다시 실행되는 것을 방지
        //rendering이 이미 되어있고, render가 다시 호출되었다는 것은 refresh상태 이므로
        //선택된 차트, 혹은 선택해제된 차트에 따라 차트들의 opacity를 조정함
        //filtering함수에서 직접 opacity를 조정해도 되지만, refresh후에 opacity가 조정되는 것이 디자인적으로 더 좋다고 판단
        if(rendered == true) {
            if(selectedFilter == '') {
                console.log('refreshed delete');
                svg.selectAll('rect').transition().duration(500).style('opacity', 1.0);
            } else {
                console.log('refreshed selected');
                svg.selectAll('rect').transition().duration(500).style('opacity', 0.3);
                svg.select('#'+selectedFilter+'red').transition().duration(500).style('opacity', 1.0);
                svg.select('#'+selectedFilter+'gray').transition().duration(500).style('opacity', 1.0);
            }
            return;
            //refresh 상태이므로 렌더할 필요 없음. 함수 종료
        } else {
            rendered = true;
        }
        //processedResult를 받아옴
        let chartData = widget.queryResult;
        
        //widget을 그릴 element
        let element = $(event.element);
        element[0].setAttribute("id", "MapChartElement");
        renderProvince(chartData,element);
        console.log("render ended");
    },
    destroy: function(s, e) {}
});
//차트별로 최대높이에따른 수치 구해주는 함수
function setMaxScale(data){
    let maxSales = 0;
    data.forEach(function(item) {
        if(maxSales < Math.max(item.data1, item.data2)) {
            maxSales = Math.max(item.data1, item.data2);
        }
    });
    //최대값에 해당하는 높이를 60으로 잡고 비율 계산
    let factor = 60/maxSales;

    return factor;
}
//지역 클릭시 filter적용
function filtering(d) {
//차트가 클릭되면 호출되는 함수
    console.log(d);

    if(d.name == selectedFilter) {
    //이미 선택되어있는 차트를 한번더 선택하면, 선택해제
        console.log('deleted');
        selectedFilter = '';
        prism.activeDashboard.filters.remove('[SIKOREA.REGION1]');
        prism.activeDashboard.refresh();
    } else {
    //선택 시 필터를 업데이트
        console.log('selected');
        selectedFilter = d.name;
        let filter = {
            jaql: {
                dim: "[SIKOREA.REGION1]",
                datatype: "text",
                title: "region",
                collapsed: true,
                filter: {
                    explicit: true,
                    multiSelection: true,
                    members: [d.name]
                }
            },
            isCascading: false
        }
        //dashboard의 filter를 적용시키고 refresh 옵션 적용
        prism.activeDashboard.filters.update(filter, {refresh: true, save: false});
    }
}
//지역을 클릭했을시 작용 확대 축소 및 차트 보임/가림 설정
function province_clicked_event(d){
    var x,y,zoomLevel;

    if(d && CENTERED != d){
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        if (d.properties.name == '제주특별자치도' || d.properties.name == '인천광역시')
            zoomLevel = 5;
        else if (SPECIAL_CITIES.indexOf( d.properties.name) != -1)
            zoomLevel = 15;
        else
            zoomLevel = 3;
        CENTERED = d;
        console.log('centered',CENTERED);
    }
    else{
        x = width/2;
        y = height/2;
        zoomLevel = 1;
        CENTERED = null;
    }
    //확대를 얼만큼 할껀지 정해주고 있다.

    map.selectAll("path")
        .classed("active", CENTERED && function(d) { return d === CENTERED;});
 
    map.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");

    //서울 클릭했을때 서울 주요도시 차트를 보이게 하고 나머지 안보이게한다. 반대의 경우 다시 가리고 다른것들 보이게설정.
    if(d.properties.name == '서울특별시'){

        if(svg.selectAll(".province").style("display") != "none"){
            svg.selectAll(".province").style("display","none");
            svg.selectAll(".province gray_bar").style("display","none");
            svg.selectAll(".province red_bar").style("display","none");
        }
        else if(svg.selectAll('.Seoul').style("display") != "none"){
            svg.selectAll(".province").style("display","flex");
            svg.selectAll(".province gray_bar").style("display","flex");
            svg.selectAll(".province red_bar").style("display","flex");
        }
        if(svg.selectAll('.Seoul').style("display") == "none"){
            svg.selectAll('.Seoul').style("display","flex");
            svg.selectAll('.Seoul gray_bar').style("display","flex");
            svg.selectAll('.Seoul red_bar').style("display","flex");
            svg.selectAll('.Gyeonggi').style("display","none");
            svg.selectAll('.Gyeonggi gray_bar').style("display","none");
            svg.selectAll('.Gyeonggi red_bar').style("display","none");
            svg.selectAll('.Incheon').style("display","none");
            svg.selectAll('.Incheon gray_bar').style("display","none");
            svg.selectAll('.Incheon red_bar').style("display","none");
        }
        else{
            svg.selectAll('.Seoul').style("display","none");
            svg.selectAll('.Seoul gray_bar').style("display","none");
            svg.selectAll('.Seoul red_bar').style("display","none");
        }
    }
    else if(d.properties.name == '경기도'){

        if(svg.selectAll(".province").style("display") != "none"){
            svg.selectAll(".province").style("display","none");
            svg.selectAll(".province gray_bar").style("display","none");
            svg.selectAll(".province red_bar").style("display","none");
        }
        else if(svg.selectAll('.Gyeonggi').style("display") != "none"){
            svg.selectAll(".province").style("display","flex");
            svg.selectAll(".province gray_bar").style("display","flex");
            svg.selectAll(".province red_bar").style("display","flex");
        }
        if(svg.selectAll('.Gyeonggi').style("display") == "none"){
            svg.selectAll('.Gyeonggi').style("display","flex");
            svg.selectAll('.Gyeonggi gray_bar').style("display","flex");
            svg.selectAll('.Gyeonggi red_bar').style("display","flex");
            svg.selectAll('.Seoul').style("display","none");
            svg.selectAll('.Seoul gray_bar').style("display","none");
            svg.selectAll('.Seoul red_bar').style("display","none");
            svg.selectAll('.Incheon').style("display","none");
            svg.selectAll('.Incheon gray_bar').style("display","none");
            svg.selectAll('.Incheon red_bar').style("display","none");
        }
        else{
            svg.selectAll('.Gyeonggi').style("display","none");
            svg.selectAll('.Gyeonggi gray_bar').style("display","none");
            svg.selectAll('.Gyeonggi red_bar').style("display","none");
        }
    }
    else if(d.properties.name == '인천광역시'){

        if(svg.selectAll(".province").style("display") != "none"){
            svg.selectAll(".province").style("display","none");
            svg.selectAll(".province gray_bar").style("display","none");
            svg.selectAll(".province red_bar").style("display","none");
        }
        else if(svg.selectAll('.Incheon').style("display") != "none"){
            svg.selectAll(".province").style("display","flex");
            svg.selectAll(".province gray_bar").style("display","flex");
            svg.selectAll(".province red_bar").style("display","flex");
        }
        if(svg.selectAll('.Incheon').style("display") == "none"){
            svg.selectAll('.Incheon').style("display","flex");
            svg.selectAll('.Incheon gray_bar').style("display","flex");
            svg.selectAll('.Incheon red_bar').style("display","flex");
            svg.selectAll('.Seoul').style("display","none");
            svg.selectAll('.Seoul gray_bar').style("display","none");
            svg.selectAll('.Seoul red_bar').style("display","none");
            svg.selectAll('.Gyeonggi').style("display","none");
            svg.selectAll('.Gyeonggi gray_bar').style("display","none");
            svg.selectAll('.Gyeonggi red_bar').style("display","none");
        }
        else{
            svg.selectAll('.Incheon').style("display","none");
            svg.selectAll('.Incheon gray_bar').style("display","none");
            svg.selectAll('.Incheon red_bar').style("display","none");
        }
    }
    // 서울,경기,인천 외 다른 지역 클릭시 원래대로 돌아간다.
    else{
        if(svg.selectAll(".province").style("display") == "none"){
            svg.selectAll(".province").style("display","flex");
            svg.selectAll(".province gray_bar").style("display","flex");
            svg.selectAll(".province red_bar").style("display","flex");
        }
        if(svg.selectAll('.Seoul').style("display") != "none"){
            svg.selectAll('.Seoul').style("display","none");
            svg.selectAll('.Seoul gray_bar').style("display","none");
            svg.selectAll('.Seoul red_bar').style("display","none");
        }
        if(svg.selectAll('.Gyeonggi').style("display") != "none"){
            svg.selectAll('.Gyeonggi').style("display","none");
            svg.selectAll('.Gyeonggi gray_bar').style("display","none");
            svg.selectAll('.Gyeonggi red_bar').style("display","none");
        }
        if(svg.selectAll('.Incheon').style("display") != "none"){
            svg.selectAll('.Incheon').style("display","none");
            svg.selectAll('.Incheon gray_bar').style("display","none");
            svg.selectAll('.Incheon red_bar').style("display","none");
        }
    }

    //도, 서울,경기,인천,지역의 배율에따른 확대,축소 설정
    svg.selectAll(".province").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");
    svg.selectAll(".province gray_bar").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");
    svg.selectAll(".province red_bar").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");

    svg.selectAll(".Seoul").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");
    svg.selectAll(".Seoul gray_bar").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");
    svg.selectAll(".Seoul red_bar").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");

    svg.selectAll(".Gyeonggi").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");
    svg.selectAll(".Gyeonggi gray_bar").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");
    svg.selectAll(".Gyeonggi red_bar").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");

    svg.selectAll(".Incheon").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");
    svg.selectAll(".Incheon gray_bar").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");
    svg.selectAll(".Incheon red_bar").transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / zoomLevel + "px");
}
//도별 지도 차트 생성
function renderProvince(chartData,element){

    let maxSalesFactor = setMaxScale(chartData.slice(18));    
     //d3 및 topojson 자바스크립트를 불러옴
     $.getScript("http://d3js.org/d3.v4.min.js", function() {
        $.getScript("http://d3js.org/topojson.v1.min.js", function() {

            width = element.width();
            height = element.height();
            //widget element->svg 를 추가하고, 전역변수 svg에 저장
            svg = d3.select("#MapChartElement")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("font-size",width/70);

            size = width/50;

            //svg에 map을 그릴 영역 추가, class 는 map_path로,
            //widget.css에 스타일이 정의되어 있음.
            map = svg.append("g").attr("id", "map").attr("class", "map_path");

            //d3의 기능 메르카토르 투사법이용
            //자세한 설명은 ref참조
            projection = d3.geoMercator()
                                .scale(1)
                                .translate([0, 0]);			
            //한국 지역 topojson파일 불러옴
            d3.json("http://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-provinces-2018-topo-simple.json", function(data) {
                
                geojson = topojson.feature(data, data.objects.skorea_provinces_2018_geo);
                center = d3.geoCentroid(geojson);

                path = d3.geoPath().projection(projection);
                bounds = path.bounds(geojson);
                const widthScale = (bounds[1][0] - bounds[0][0]) / width;
                const heightScale = (bounds[1][1] - bounds[0][1]) / height;
                const scale = 1 /Math.max(widthScale, heightScale);
                const xoffset = width/2 - scale * (bounds[1][0] + bounds[0][0]) /2 + 10;
                const yoffset = height/2 - scale * (bounds[1][1] + bounds[0][1])/2 + 10;
                const offset = [xoffset, yoffset];
                projection.scale(scale).translate(offset);
                //topojson의 활용
                //미리 설정한 메르카토르 투사법으로 위,경도를 지역상에 매핑, 축적과 translate설정
                //자세한 설명 ref. 참조

                map.selectAll("path")
                .data(geojson.features)
                .enter().append("path")
                .attr('d', path)
                .on('click',d => province_clicked_event(d));
                //한국 지도 렌더링
                
                svg.append('g').selectAll('svg')
                .data(chartData.slice(18))
                .enter()
                .append("rect")
                .attr('id', d => d.name+'gray')
                //클릭(선택) 시 filtering을 한 후, opacity를 조정할 때 id를 식별가능할 수 있도록 지역명(d.name)으로 지정
                .attr("class", "province gray_bar")
                        //widget.css에 지정되어 있는 gray_bar style사용
                        .attr("width", "1em")
                        .attr("height", d => (d.data1*maxSalesFactor/15).toString()+'em')
                        //height를 data1로 지정 (maxSalesFactor는 위에서 지정한 60/최대매출의 비율)
                        .attr('x' ,  d => `calc(`+projection([d.lon, d.lat])[0]+`px - 1em)`)
                        .attr('y' ,  d => `calc(`+projection([d.lon, d.lat])[1]+`px - `+(d.data1*maxSalesFactor/15)+`em)`)
                        //x, y좌표를 위에서 설정한 메르카토르 projection변수(함수)를 이용해 위,경도좌표에서 화면상의 좌표로 변환
                        .on('click', d => filtering(d));
                        
                        //클릭 시 호출되는 함수 지정
                //processResult에서 가공한 데이터를 이용해, 차트를 한번에 렌더링
                //chartData에 processedResult가 들어있음
                //chartData(processedResult)의 형식은 배열로, [{지역명1,좌표1,데이터1,...}, {지역명2, 좌표2, 데이터2,...}, ...]로
                //각각 데이터들이 인덱스로서 자리를 차지하고 있음.
                //data(chartData).enter()함수를 이용해서 데이터를 바인딩하면, attr지정과 같은 것들을 함수로 사용할 수 있음
                //(~~.forEach(function(item){...})와 비슷)
                //함수의 매개변수에는 각 데이터의 객체가 들어있다고 생각.
                //예: .attr("height", d => d.data1*...) 는, height를 각 데이터들의 data1의 value로 지정하겠다는 뜻
                //회색차트를 렌더링
                
                svg.append('g').selectAll('svg')
                .data(chartData.slice(18))
                .enter()
                .append("rect")
                .attr('id', d => d.name+'red')
                .attr("class", "province red_bar")
                .attr("width", "1em")
                .attr("height", d => (d.data2*maxSalesFactor/15).toString()+'em')
                .attr('x' ,  d => `calc(`+projection([d.lon, d.lat])[0]+`px + 0.2em)`)
                        .attr('y' ,  d => `calc(`+projection([d.lon, d.lat])[1]+`px - `+(d.data2*maxSalesFactor/15)+`em)`)
                        .on('click', d => filtering(d));
                //빨간색차트를 렌더링
                
                svg.append('g').selectAll('svg')
                .data(chartData.slice(18))
                .enter()
                .append("text")
                .attr("class","province")
                .text(d => d.name)
                .attr('x' ,  d => projection([d.lon, d.lat])[0])
                .attr('y' ,  d => projection([d.lon, d.lat])[1]+10)
                .attr("font-size",'10px')
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .attr("cursor", "pointer")
                .on('click', d => filtering(d))
                .on("mouseover", function(d) {
                    tooltip
                        .attr('x', projection([d.lon, d.lat])[0]+10)
                        .attr('y' , projection([d.lon, d.lat])[1])
                        .style("display","flex");
                    tooltipText1
                        .attr('x', projection([d.lon, d.lat])[0]+15)
                        .attr('y' , projection([d.lon, d.lat])[1]+10)
                        .text("목표액 : " + parseInt(d.data1/100000000)+"억")
                        .style("display","flex");
                    tooltipText2
                        .attr('x', projection([d.lon, d.lat])[0]+15)
                        .attr('y' , projection([d.lon, d.lat])[1]+25)
                        .text("매출액 : " + parseInt(d.data2/100000000)+"억")
                        .style("display","flex");
                    })
                .on("mouseout",  function() { tooltip.style("display","none"); tooltipText1.style("display","none"); tooltipText2.style("display","none");});
                //지역명을 렌더링, 마우스 hover에따른 툴팁 보임/가림
                
                svg.append('g').selectAll('svg')
                .data(chartData.slice(18))
                .enter()
                        .append("text")
                        .attr("class","province")
                        .text(d => {return parseInt(d.data2/d.data1*100)+ '%'})
                        .attr('x' ,  d => projection([d.lon, d.lat])[0])
                        .attr('y' ,  d => projection([d.lon, d.lat])[1]+20)
                        .attr("font-size",'10px')
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "middle")
                        .attr("cursor", "pointer")
                        .on('click', d => filtering(d));
                //목표,실적 달성률을 렌더링

                var tooltip = svg.append("rect")
                    .attr('class','toolTip')
                    .attr('width','80px')
                    .attr('height','30px')
                    .attr('rx','5px')
                    .attr('ry','5px')
                    .style("display","none");
                var tooltipText1 = svg.append("text").attr('class','toolTipText1').style("display","none");
                var tooltipText2 = svg.append("text").attr('class','toolTipText2').style("display","none");
                //툴팁과 툴팁 텍스트 정의
                console.log(1234);
                            
                svg.append('rect')
                    .attr('class','gray_bar')
                    .attr('width','10px')
                    .attr('height','10px')
                    .attr('x', projection([129.80481047309468, 38.48392699833793])[0])
                    .attr('y', projection([129.80481047309468, 38.48392699833793])[1]);
                svg.append('text')
                    .attr('x',projection([129.80481047309468, 38.48392699833793])[0]+15)
                    .attr('y',projection([129.80481047309468, 38.48392699833793])[1]+8)
                    .attr("font-size",'10px')
                    .attr("font-weight", "bold")
                    .text(title1);
                svg.append('rect')
                    .attr('class','red_bar')
                    .attr('width','10px')
                    .attr('height','10px')
                    .attr('x',projection([129.80481047309468, 38.48392699833793])[0])
                    .attr('y',projection([129.80481047309468, 38.48392699833793])[1]+15);
                svg.append('text')
                    .attr('x',projection([129.80481047309468, 38.48392699833793])[0]+15)
                    .attr('y',projection([129.80481047309468, 38.48392699833793])[1]+23)
                    .attr("font-size",'10px')
                    .attr("font-weight", "bold")
                    .text(title2);
                //오른쪽 상단에 막대 내용 표시

                renderSeoul(chartData.slice(0,11));
                renderGyeonggi(chartData.slice(11,16));
                renderIncheon(chartData.slice(16,18));
                //서울,경기,인천 내 구,도시별 차트 그려주기
            });
        });
    });
}
//서울 구별 차트 생성
function renderSeoul(chartData){

    let maxSalesFactor = setMaxScale(chartData);
    //d3 및 topojson 자바스크립트를 불러옴
    $.getScript("http://d3js.org/d3.v4.min.js", function() {
        $.getScript("http://d3js.org/topojson.v1.min.js", function() {
                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("rect")
                        .attr('id', d => d.name+'gray')
                        //클릭(선택) 시 filtering을 한 후, opacity를 조정할 때 id를 식별가능할 수 있도록 지역명(d.name)으로 지정
                        .attr("class", "Seoul gray_bar")
                        //widget.css에 지정되어 있는 gray_bar style사용
                        .attr("width", '0.1em')
                        .attr("height", d => (d.data1*maxSalesFactor/150).toString()+'em')
                        //height를 data1로 지정 (maxSalesFactor는 위에서 지정한 60/최대매출의 비율)
                        .attr('x' ,  d => `calc(`+projection([d.lon, d.lat])[0]+`px - 0.1em)`)
                        .attr('y' ,  d => `calc(`+projection([d.lon, d.lat])[1]+`px - `+(d.data1*maxSalesFactor/150)+`em)`);

                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("rect")
                        .attr('id', d => d.name+'red')
                        .attr("class", "Seoul red_bar")
                        .attr("width", '0.1em')
                        .attr("height", d => (d.data2*maxSalesFactor/150).toString()+'em')
                        .attr('x' ,  d => `calc(`+projection([d.lon, d.lat])[0]+`px + 0.02em)`)
                        .attr('y' ,  d => `calc(`+projection([d.lon, d.lat])[1]+`px - `+(d.data2*maxSalesFactor/150)+`em)`);
                //빨간색차트를 렌더링

                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("text")
                        .attr("class","Seoul")
                        .text(d => d.name)
                        .attr('x' ,  d => projection([d.lon, d.lat])[0])
                        .attr('y' ,  d => projection([d.lon, d.lat])[1]+ size/13)
                        .attr("font-size",'0.1em')
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "middle")
                        .attr("cursor", "pointer");
                //지역명을 렌더링

                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("text")
                        .attr("class","Seoul")
                        .text(d => {return parseInt(d.data2/d.data1*100)+ '%'})
                        .attr('x' ,  d => projection([d.lon, d.lat])[0])
                        .attr('y' ,  d => projection([d.lon, d.lat])[1]+ size/6.5)
                        .attr("font-size",'0.1em')
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "middle")
                        .attr("cursor", "pointer");
                //목표,실적 달성률을 렌더링

                svg.selectAll('.Seoul').style("display","none");
                svg.selectAll('.Seoul gray_bar').style("display","none");
                svg.selectAll('.Seoul red_bar').style("display","none");

            });
        });
}
//경기 시별 차트 생성
function renderGyeonggi(chartData){

    let maxSalesFactor = setMaxScale(chartData);
    //d3 및 topojson 자바스크립트를 불러옴
    $.getScript("http://d3js.org/d3.v4.min.js", function() {
        $.getScript("http://d3js.org/topojson.v1.min.js", function() {
                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("rect")
                        .attr('id', d => d.name+'gray')
                        //클릭(선택) 시 filtering을 한 후, opacity를 조정할 때 id를 식별가능할 수 있도록 지역명(d.name)으로 지정
                        .attr("class", "Gyeonggi gray_bar")
                        //widget.css에 지정되어 있는 gray_bar style사용
                        .attr("width", '0.5em')
                        .attr("height", d => (d.data1*maxSalesFactor/30).toString()+'em')
                        //height를 data1로 지정 (maxSalesFactor는 위에서 지정한 60/최대매출의 비율)
                        .attr('x' ,  d => `calc(`+projection([d.lon, d.lat])[0]+`px - 0.55em)`)
                        .attr('y' ,  d => `calc(`+projection([d.lon, d.lat])[1]+`px - `+(d.data1*maxSalesFactor/30)+`em)`);

                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("rect")
                        .attr('id', d => d.name+'red')
                        .attr("class", "Gyeonggi red_bar")
                        .attr("width", '0.5em')
                        .attr("height", d => (d.data2*maxSalesFactor/30).toString()+'em')
                        .attr('x' ,  d => `calc(`+projection([d.lon, d.lat])[0]+`px + 0.1em)`)
                        .attr('y' ,  d => `calc(`+projection([d.lon, d.lat])[1]+`px - `+(d.data2*maxSalesFactor/30)+`em)`);
                //빨간색차트를 렌더링

                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("text")
                        .attr("class","Gyeonggi")
                        .text(d => d.name)
                        .attr('x' ,  d => projection([d.lon, d.lat])[0])
                        .attr('y' ,  d => projection([d.lon, d.lat])[1]+ size/3)
                        .attr("font-size",'0.4em')
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "middle")
                        .attr("cursor", "pointer");
                //지역명을 렌더링

                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("text")
                        .attr("class","Gyeonggi")
                        .text(d => {return parseInt(d.data2/d.data1*100)+ '%'})
                        .attr('x' ,  d => projection([d.lon, d.lat])[0])
                        .attr('y' ,  d => projection([d.lon, d.lat])[1]+ size/1.5)
                        .attr("font-size",'0.4em')
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "middle")
                        .attr("cursor", "pointer");
                //목표,실적 달성률을 렌더링

                svg.selectAll('.Gyeonggi').style("display","none");
                svg.selectAll('.Gyeonggi gray_bar').style("display","none");
                svg.selectAll('.Gyeonggi red_bar').style("display","none");

            });
        });
}
//인천 구별 차트 생성
function renderIncheon(chartData){

    let maxSalesFactor = setMaxScale(chartData);
    //d3 및 topojson 자바스크립트를 불러옴
    $.getScript("http://d3js.org/d3.v4.min.js", function() {
        $.getScript("http://d3js.org/topojson.v1.min.js", function() {
                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("rect")
                        .attr('id', d => d.name+'gray')
                        //클릭(선택) 시 filtering을 한 후, opacity를 조정할 때 id를 식별가능할 수 있도록 지역명(d.name)으로 지정
                        .attr("class", "Incheon gray_bar")
                        //widget.css에 지정되어 있는 gray_bar style사용
                        .attr("width", '0.3em')
                        .attr("height", d => (d.data1*maxSalesFactor/50).toString()+'em')
                        //height를 data1로 지정 (maxSalesFactor는 위에서 지정한 60/최대매출의 비율)
                        .attr('x' ,  d => `calc(`+projection([d.lon, d.lat])[0]+`px - 0.35em)`)
                        .attr('y' ,  d => `calc(`+projection([d.lon, d.lat])[1]+`px - `+(d.data1*maxSalesFactor/50)+`em)`);

                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("rect")
                        .attr('id', d => d.name+'red')
                        .attr("class", "Incheon red_bar")
                        .attr("width", '0.3em')
                        .attr("height", d => (d.data2*maxSalesFactor/50).toString()+'em')
                        .attr('x' ,  d => `calc(`+projection([d.lon, d.lat])[0]+`px + 0.05em)`)
                        .attr('y' ,  d => `calc(`+projection([d.lon, d.lat])[1]+`px - `+(d.data2*maxSalesFactor/50)+`em)`);
                //빨간색차트를 렌더링

                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("text")
                        .attr("class","Incheon")
                        .text(d => d.name)
                        .attr('x' ,  d => projection([d.lon, d.lat])[0])
                        .attr('y' ,  d => projection([d.lon, d.lat])[1]+ size/4)
                        .attr("font-size",'0.3em')
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "middle")
                        .attr("cursor", "pointer");
                //지역명을 렌더링

                svg.append('g').selectAll('svg')
                        .data(chartData)
                        .enter()
                        .append("text")
                        .attr("class","Incheon")
                        .text(d => {return parseInt(d.data2/d.data1*100)+ '%'})
                        .attr('x' ,  d => projection([d.lon, d.lat])[0])
                        .attr('y' ,  d => projection([d.lon, d.lat])[1]+ size/2)
                        .attr("font-size",'0.3em')
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "middle")
                        .attr("cursor", "pointer");
                //목표,실적 달성률을 렌더링

                svg.selectAll('.Incheon').style("display","none");
                svg.selectAll('.Incheon gray_bar').style("display","none");
                svg.selectAll('.Incheon red_bar').style("display","none");

            });
        });
}