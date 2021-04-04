
function openNav(menu) {
  document.getElementById("mySidenav").style.width = "273px";
  active(menu);
}

function closeNav(menu) {
  document.getElementById("mySidenav").style.width = "0";
  if(menu){
    $('#dash').removeClass('active');
    $('#sales').removeClass('active');
    $('#inventory').removeClass('active');
    $('#finance').removeClass('active');
    $('#admin').removeClass('active');
  }
  if(menu == 'dash'){
    $('#dash').addClass('active');
  }
  else if(menu == 'sales'){
    $('#sales').addClass('active');
  }
  else if(menu == 'inventory'){
    $('#inventory').addClass('active');
  }
  else if(menu == 'finance'){
    $('#finance').addClass('active');
  }
  else if(menu == 'admin'){
    $('#admin').addClass('active');
  }
}

function active(menu){
  $('.navbar-nav').children('li.active').removeClass('active');
  if(menu == 'dash' || menu == undefined){
    $('#dash').addClass('active');
    $('.closebtn').html('DASHBOARD<div style="float:right; margin-right:6px; margin-top:1px;"><img src="../DEMO_IMG/close-arrow.png"></div>');
    $('.dropdown-btn').html(`<div style="line-height:37px;">
      <img src="../DEMO_IMG/indicator.png" style=" margin-left: -6px; margin-right: 6px; float:left;">
      Dashboard
    </div>`)
    $('.dropdown-container').html(`<li><a href="../dash.html?category=allKPI"><img src="../DEMO_IMG/bulletnoselect.png">종합</a></li>`)
  }
  else if(menu == 'sales'){
    $('#sales').addClass('active');
    $('.closebtn').html('SALES<div style="float:right; margin-right:6px; margin-top:1px;"><img src="../DEMO_IMG/close-arrow.png"></div>');
    $('.dropdown-btn').html(`<div style="line-height:37px;">
      <img src="../DEMO_IMG/indicator.png" style=" margin-left: -6px; margin-right: 6px; float:left;">
      Sales
    </div>`)
    $('.dropdown-container').html(`<li><a href="../BrandSales/BrandSales.html?nav=sales" class="active"><img src="../DEMO_IMG/bulletnoselect.png">브랜드별 매출</a></li>
                        <li><a href="../MapChartWeb/webServer.html?nav=sales"><img src="../DEMO_IMG/bulletnoselect.png">지역별 매출</a></li>`)
  }
  else if(menu == 'inventory'){
    $('#inventory').addClass('active');
    $('.closebtn').html('INVENTORY<div style="float:right; margin-right:6px; margin-top:1px;"><img src="../DEMO_IMG/close-arrow.png"></div>');
    $('.dropdown-btn').html(`<div style="line-height:37px;">
      <img src="../DEMO_IMG/indicator.png" style=" margin-left: -6px; margin-right: 6px; float:left;">
      Inventory
    </div>`)
    $('.dropdown-container').html(`<li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">재고 회전일수 트랜드</a></li>
                        <li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">채널별 재고 회전일수</a></li>`)
  }
  else if(menu == 'finance'){
    $('#finance').addClass('active');
    $('.closebtn').html('FINANCE<div style="float:right; margin-right:6px; margin-top:1px;"><img src="../DEMO_IMG/close-arrow.png"></div>');
    $('.dropdown-btn').html(`<div style="line-height:37px;">
      <img src="../DEMO_IMG/indicator.png" style=" margin-left: -6px; margin-right: 6px; float:left;">
      Finance
    </div>`)
    $('.dropdown-container').html(`<li><a href="../Finance/webServer.html"><img src="../DEMO_IMG/bulletnoselect.png">수익성종합 총괄표</a></li>`)
  }
  else if(menu == 'admin'){
    $('#admin').addClass('active');
    $('.closebtn').html('ADMIN<div style="float:right; margin-right:6px; margin-top:1px;"><img src="../DEMO_IMG/close-arrow.png"></div>');
    $('.dropdown-btn').html(`<div style="line-height:37px;">
      <img src="../DEMO_IMG/indicator.png" style=" margin-left: -6px; margin-right: 6px; float:left;">
      시스템 관리
    </div>`)
    $('.dropdown-container').html(`<li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">메뉴 Master 관리</a></li>
                        <li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">사용자 Master 관리</a></li>
                        <li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">권한그룹 Master 관리</a></li>
                        <li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">권한 Master 관리</a></li>
                        <li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">권한 적용 사용자 Master 관리</a></li>
                        <li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">기간별 방문현황</a></li>
                        <li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">시간대별 방문현황</a></li>
                        <li><a href="#"><img src="../DEMO_IMG/bulletnoselect.png">사용자별 화면 조회현황</a></li>`)
  }
}
var url = window.location.href;
var nav = url.slice(window.location.href.indexOf('?') + 1);
nav = nav.split('=');
nav = nav[1];
