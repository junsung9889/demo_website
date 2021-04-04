let selectedFilter = '';
let svg;
let rendered = false;
prism.registerWidget("MapChartWidget", {
    name: "MapChartWidget",
    family: "maps",
    title: "MapChartWidget",
    iconSmall: "/plugins/MapChartWidget/widget-icon-26.png",
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
                    maxitems: 1
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
            query.metadata.push(widget.metadata.panel("plan sales").items[0]);
            query.metadata.push(widget.metadata.panel("actual sales").items[0]);
            
            return query;
        },
        // prepares the widget-specific query result from the given result data-table
        processResult: function(widget, queryResult) {
            //지역들의 위,경도 좌표 지정
            const coords = {
                "서울": {"lat" : "37.532600","lon" : "127.024612"},
                "대전": {"lat" : "36.35111","lon" : "127.38500"},
                "경기": {"lat" : "37.361406","lon" : "127.396517"},
                "경남": {"lat" : "35.408670","lon" : "128.232210"},
                "광주": {"lat" : "35.160615","lon" : "126.851508"},
                "대구": {"lat" : "35.87209615618607","lon" : "128.60055994210455"},
                "부산": {"lat" : "35.17998913267344","lon" : "129.0751071575918"},
                "울산": {"lat" : "35.54010830463827","lon" : "129.31136460764057"},
                "인천": {"lat" : "37.45677811326679","lon" : "126.70476903022615"},
                "충남": {"lat" : "36.395899345947456","lon" : "126.79617869507643"},
                "충북": {"lat" : "36.85811054459181","lon" : "127.69949880809368"},
                "기타": {"lat" : "33.96877102883713","lon" : "129.62193463701524"}
            };

            let processedResult = [];
            queryResult.$$rows.forEach(function(item) {
                let region = item[0]['data'], plan = item[1]['data'], actual = item[2]['data'];
                //각 지역들의 이름,좌표,차트데이터1,2로 데이터를 가공, 배열로 삽입
                processedResult.push({
                    "name":region,
                    "lat":coords[region].lat,
                    "lon":coords[region].lon,
                    "data1":plan,
                    "data2":actual
                });
            });
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

        //차트의 최대 높이를 계산하기 위해, 데이터들 중의 최댓값을 계산
        let maxSales = 0;
        chartData.forEach(function(item) {
            if(maxSales < Math.max(item.data1, item.data2)) {
                maxSales = Math.max(item.data1, item.data2);
            }
        });
        //최대값에 해당하는 높이를 60으로 잡고 비율 계산
        let maxSalesFactor = 60/maxSales;

        //widget을 그릴 element
        let element = $(event.element);
        element[0].setAttribute("id", "MapChartElement");

        //d3 및 topojson 자바스크립트를 불러옴
        $.getScript("http://d3js.org/d3.v4.min.js", function() {
            $.getScript("http://d3js.org/topojson.v1.min.js", function() {
                const width = element.width(), height = element.height();
                //widget element->svg 를 추가하고, 전역변수 svg에 저장
                svg = d3.select("#MapChartElement")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

                //svg에 map을 그릴 영역 추가, class 는 map_path로,
                //widget.css에 스타일이 정의되어 있음.
                let map = svg.append("g").attr("id", "map").attr("class", "map_path");

                //d3의 기능 메르카토르 투사법이용
                //자세한 설명은 ref참조
                let projection = d3.geoMercator()
                                    .scale(1)
                                    .translate([0, 0]);

                //한국 지역 topojson파일 불러옴
                d3.json("http://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-provinces-2018-topo-simple.json", function(data) {
                    
                    const geojson = topojson.feature(data, data.objects.skorea_provinces_2018_geo);
                    const center = d3.geoCentroid(geojson);

                    const path = d3.geoPath().projection(projection);
                    const bounds = path.bounds(geojson);
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
                    .attr('d', path);
                    //한국 지도 렌더링

                    svg.append('g').selectAll('svg')
                            .data(chartData)
                            .enter()
                            .append("rect")
                            .attr('id', d => d.name+'gray')
                            //클릭(선택) 시 filtering을 한 후, opacity를 조정할 때 id를 식별가능할 수 있도록 지역명(d.name)으로 지정
                            .attr("class", "gray_bar")
                            //widget.css에 지정되어 있는 gray_bar style사용
                            .attr("width", 9)
                            .attr("height", d => d.data1*maxSalesFactor)
                            //height를 data1로 지정 (maxSalesFactor는 위에서 지정한 60/최대매출의 비율)
                            .attr('x' ,  d => projection([d.lon, d.lat])[0]-10)
                            .attr('y' ,  d => projection([d.lon, d.lat])[1]-d.data1*maxSalesFactor)
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
                            .data(chartData)
                            .enter()
                            .append("rect")
                            .attr('id', d => d.name+'red')
                            .attr("class", "red_bar")
                            .attr("width", 9)
                            .attr("height", d => d.data2*maxSalesFactor)
                            .attr('x' ,  d => projection([d.lon, d.lat])[0]+1)
                            .attr('y' ,  d => projection([d.lon, d.lat])[1]-d.data2*maxSalesFactor)
                            .on('click', d => filtering(d));
                    //빨간색차트를 렌더링

                    svg.append('g').selectAll('svg')
                            .data(chartData)
                            .enter()
                            .append("text")
                            .text(d => d.name)
                            .attr('x' ,  d => projection([d.lon, d.lat])[0])
                            .attr('y' ,  d => projection([d.lon, d.lat])[1]+13)
                            .attr("font-size", "13px")
                            .attr("font-weight", "bold")
                            .attr("text-anchor", "middle")
                            .attr("cursor", "pointer")
                            .on('click', d => filtering(d));
                    //지역명을 렌더링

                    svg.append('g').selectAll('svg')
                            .data(chartData)
                            .enter()
                            .append("text")
                            .text(d => {return parseInt(d.data2/d.data1*100)+ '%'})
                            .attr('x' ,  d => projection([d.lon, d.lat])[0])
                            .attr('y' ,  d => projection([d.lon, d.lat])[1]+26)
                            .attr("font-size", "13px")
                            .attr("font-weight", "bold")
                            .attr("text-anchor", "middle")
                            .attr("cursor", "pointer")
                            .on('click', d => filtering(d));
                    //목표,실적 달성률을 렌더링
                });
            });
        });
        
        console.log("render end");
    },
    destroy: function(s, e) {}
});

function filtering(d) {
//차트가 클릭되면 호출되는 함수

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
        prism.activeDashboard.filters.update(filter, {refresh: true, save: true});
    }
}