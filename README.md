#SISENSE MAP CHART WIDGET


##1.	요약

 D3(v4)의 TOPOJSON기능을 활용하여 한국 지형정보를 가진 TOPOJSON(.json)으로 지도를 렌더링한 후, {지역명, 목표매출, 실제매출} 데이터를 이용해 해당 위치에 차트를 렌더링하고, 해당 차트 클릭 시 지역단위 DASHBOARD FILTERING을 수행하는 WIDGET입니다.

*	지도 이미지를 이용해 간단히 렌더링하고, 경/위도 좌표와 이미지 좌표의 비율을 계산해서 차트를 렌더링할 수도 있지만, TOPOJSON에는 지역의 범위와 경계 등의 정보가 포함되어 있어 원하는 지역만 특별한 스타일로 렌더링하는 방식 등, 지도를 원하는대로 자유롭게 렌더링할 수 있습니다.
( 본 WIDGET은 지도 렌더링의 목적으로만 TOPOJSON을 이용 )

 ![image](https://user-images.githubusercontent.com/80762743/137685094-48a5cd4f-32ca-42d5-a8c6-34e129bc3629.png)
<WIDGET의 출력>

##2.	REFERENCE

한국 TOPOJSON : 3가지 다른 LEVEL로 지역을 나눈 TOPOJSON 제공 (GITHUB)
D3 TOPOJSON 활용 : D3 로 TOPOJSON을 활용하는 방법 설명 (BLOG)
SISENSE DASHBOARD FILTER : DASHBOARD FILTERING을 수행하는 함수 설명
SISENSE METADATA-ITEM : FILTER정보를 가진 객체 설명
SISENSE JAQL SYNTAX : FILTER정보를 가진 객체 설명

##3.	설명
보다 자세한 내용은 소스코드의 주석을 참고바랍니다.

##processResult
buildQuery에서 넘어온 데이터들을, 차트출력에 알맞은 데이터로 가공합니다.
[{name:서울, lat:…, lon:…, data1:…, data2:…}, {name:부산, …}, …]
와 같은 형식으로, 각각의 데이터들을 key, value로 구성하고 배열 형태로 가공합니다.
*	d3.data(), .enter() 함수들을 쉽게 활용하기 위한 형태

##render
JQUERY getScript함수를 이용해 D3 와 TOPOJSON 자바스크립트를 웹에서 불러오고, d3.json()함수를 이용해 한국 지형 TOPOJSON(.json)파일 또한 웹에서 불러옵니다.
*	SISENSE PLUGIN로컬 폴더에 D3(v4) 자바스크립트와 한국지형 TOPOJSON(.json)파일을 저장한 후 불러오는 방식을 시도해 보았지만,
-	SISENSE자체에서 사용하는 D3 때문에, 로컬에서 불러온 D3(v4) 자바스크립트는 사용 불가.(version4 문법 사용시 오류 발생)
-	.json파일은 PLUGIN폴더에 존재해도, PLUGIN실행 시 웹 서버 상에 같이 올라가지 않아서 사용 불가.

###1)	D3 TOPOJSON기능을 활용해 메르카토르 투사법으로 한국 지도를 출력합니다.
(자세한 코드 설명 REF. D3 TOPOJSON 활용 참고)

###2)	d3.data(), .enter() 함수를 이용하여 processResult에서 가공된 데이터들을 한 번에 차트로 렌더링 합니다.

###3)	차트가 클릭(선택)되면, Filtering(d) 함수가 호출되고, 이 함수에서 DASHBOARD FILTER를 적용한 후, DASHBOARD를 REFRESH합니다.
*	나머지 차트의 OPACITY(투명도)를 감소시켜 해당 차트를 강조하는 부분은, REFRESH후에 다시 RENDER가 호출될 때 render함수에서 시행됩니다.
Filtering(d) 함수에서 시행할 수 있지만, REFRESH후에 투명도 조절 애니메이션이 나타나는 것이 사용자가 보기에 더 편하다고 판단했습니다.


#MAPChartWidget2

기존 MapChartWidget에 추가된 기능
###1.	줌 인 아웃 기능
 
 
###2.	특정 시,도 선택시 시,도 안 세부적인 구,시 별로 정보가 표시된다.
 
 
###3.	시,도 글자 위에 마우스 커서를 올리면 정보의 수치가 툴팁으로 표현된다.
 
 
###4.	오른쪽 상단에 막대차트의 제목이 표현된다.
 
 

코드 설명

  
##setMaxScale
   원래 막대 높이 조절을 위해 render부분에 사용되던 부분이었다. 도시별로 불러올 필요가 있어 따로 함수로 분리해두었다.
   
##Province_clicked_event
   시 도별로 zoomLevel 확대되는 정도의 차이를 설정하였고 일단 첫번째 화면에도 서울시 내 모든 구, 경기도 내 모든시 등등 모든 차트가 그려졌지만 다 가려져있는 상태이다. 그래서 시,도를 클릭할 때 마다 세부적인 구/시 별로 차트랑 내용이 보였다 안보였다 가 되게 설정하였다. 

Ex) svg.selectAll('.Seoul').style("display","none");
Seoul이란 클라스의 display를 none으로 설정하여 안보이게 설정하였다.

##renderProvince
   d3랑 topojson 자바스크립트를 불러오고 한국지역 topojson파일을 불러와 맵을 그려주고 맨처음 화면의 한국 지형에 따른 시,도 별 차트랑 정보를 그려준다. render함수내에서 main함수 역할을 하며 여러가지 전역변수를 설정해주고 마지막에는 renderSeoul, renderGyeonggi, renderIncheon을 불러와 실행해준다. 뒤 3가지 함수에서도 전역변수를 사용하는데 javascript언어 특성상 동기적으로 실행되어 render에서 순서대로 실행 시 정의가 안되어 오류가 난다. 그래서 renderProvince 마지막에서 실행해주고 있다. 오른쪽 위 상단 바 정보 표시, 툴팁 또한 정의해주고 있다. 툴팁의 경우 마우스 hover에따른 함수 실행으로 보였다 안보였다 설정해주었다.

##renderSeoul, renderGyeonggi, renderIncheon
   renderProvince함수랑 같으며 시,도별 상세한 정보를 표시해준다. 자세한 내용은 코드 주석 참고 바랍니다.

