screen.orientation.lock('portrait-primary').then(function success() {
    console.log("Successfully locked the orientation");
}, function error(errMsg) {
    console.log("Error locking the orientation :: " + errMsg);
});

$(function() {
    var d = new Date();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var h = d.getDate();
    var y = d.getFullYear();
    let fd  = y+'-'+m+'-'+h;

    $('.loading').hide();
    $('#date').val(fd);
    $('#pointDate').val(fd);
    $('#comissionDate').val(fd);

    this.statSection()
    this.rateSection()
    $("span.numbers").digits();

    hash = $(window.location.hash);
    if (hash.length === 0) {
        $("#homeTab").click(); //Activate first tab
    }else{
        hash.click()
    }

    this.reloadPoint();
});


function openMyTab(id, tab){
    $(".tab-content").removeClass('active');
    $(".tab .icon").removeClass('active');
    
    $('.loading').show();
    setTimeout(function() 
    {
      $('.loading').hide();
      $("#"+id).addClass('active');
      $("#"+tab).addClass('active');
      if(tab==="rateTab"){
          var swiper = new Swiper('.swiper-container', {
              slidesPerView: 3,
              spaceBetween: 20
          });
      }

      if(tab==="homeTab"){
        this.reloadMe()
      }
    }, 600);

}

function openMySubTab(tab){
    $(".subtab").hide();
    $("#"+tab).show();
}

function statSection (){
    let point = 0
    let perc  = 0
    let pid  = 0
    let ps = JSON.parse(sessionStorage.getItem('user.partners'));
    $(".teamName").html(sessionStorage.getItem('user.name'));
    for (let i in ps) {
        if(ps[i].membership){
            point = point + ps[i].membership.total_point
            $(".teamRole").html("PR " + ps[i].name);
            $("#taName").html(ps[i].name);
            $("#taLevel").html(ps[i].membership.level + " MEMBER");
            $("#taLevelNow").html(ps[i].membership.level);
            $("#taLevelNext").html(ps[i].membership.next_level);
            $("#points").html((ps[i].membership.total_point/1000) + "K");
            $("#comissions").html((ps[i].membership.total_comission/1000) + "K");
            let selisih = ps[i].membership.next_level_target - ps[i].membership.level_achieve;
            if(selisih > 0){
                $("#taLevelAchieve").html(selisih+" more");
            }else{
                $("#taLevelAchieve").html("accomplished");
            }
            perc    = ps[i].membership.percentage_achieve;
            pid     = ps[i].id;
            $("#pid").val(pid);
        }
    }
    $("#kontena svg").remove();
    var bar = new ProgressBar.Line(kontena, {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      color: '#f44336',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: {width: '100%', height: '100%'}
    });

    bar.animate(perc);  // Number from 0.0 to 1.0
    // this.pointSection(pid)
}

function pointSection (pid){
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];

    const start = $('#pointDate').val();

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/partner/point",
        data: { start: start, end: start+' + 1 day', partner_id : pid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".fields").remove(); //remove all the tr's except first ,As you are using it as table headers.     
                if(!msg.data.length){
                    var html = '<div class="item align-center fields"><i class="float-center" style="font-size:11px;">belum ada data</i></div>'
                    $('#historical').append(html); //append your new tr
                }

                $(msg.data).each(function () {
                    var d = new Date(this.date).getDate();
                    var m = mN[new Date(this.date).getMonth()];
                    var Y = new Date(this.date).getFullYear();
                    var html = '<div class="item fields"><div class="row"><div class="col-20"><p class="align-center">'+d+'<br/>'+m+'<br/>'+Y+'</p></div><div class="col-50"><p class="text-grey-500 wrap"><strong>'+money(this.amount)+'</strong><br/>'+this.note+'</p></div><div class="col"><h1 class="text-green text-strong align-right vertical-align-bottom">'+money(this.balance)+'</h1></div></div></div>';
                    $('#historical').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

function comissionSection (pid){
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];

    const start = $('#comissionDate').val();

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/partner/comission",
        data: { start: start, end: start+' + 1 day', partner_id : pid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".fields").remove(); //remove all the tr's except first ,As you are using it as table headers.     
                if(!msg.data.length){
                    var html = '<div class="item align-center fields"><i class="float-center" style="font-size:11px;">belum ada data</i></div>'
                    $('#historical').append(html); //append your new tr
                }

                $(msg.data).each(function () {
                    var d = new Date(this.date).getDate();
                    var m = mN[new Date(this.date).getMonth()];
                    var Y = new Date(this.date).getFullYear();
                    var html = '<div class="item fields"><div class="row"><div class="col-20"><p class="align-center">'+d+'<br/>'+m+'<br/>'+Y+'</p></div><div class="col-50"><p class="text-grey-500 wrap"><strong>'+money(this.amount)+'</strong><br/>'+this.note+'</p></div><div class="col"><h1 class="text-green text-strong align-right vertical-align-bottom">'+money(this.balance)+'</h1></div></div></div>';
                    $('#historical').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

function rateSection (){
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];

    const start = $('#date').val();

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/partner/rates",
        data: { start: start, end: start+" + 1 week"},
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".swiper-slide").remove(); //remove all the tr's except first ,As you are using it as table headers.            

                $(msg.data).each(function () {
                    var d = new Date(this.date).getDate();
                    var mx = mN[new Date(this.date).getMonth()];
                    var m = new Date(this.date).getMonth() + 1;
                    var Y = new Date(this.date).getFullYear();
                    var html='<div class="swiper-slide" id="harga'+d+'" onClick="reloadPrice(`'+Y+'-'+m+'-'+d+'`, `harga'+d+'`)"><p class="align-center">'+d+'/'+m+'/'+Y+'</p><p class="align-center text-small text-light text-grey-400">Mulai</p><p class="align-center text-big text-green text-bold">'+money(this.net)+'</p></div>';
                    $('.swiper-wrapper').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

function reloadMe (){
    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/whoami",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                sessionStorage.setItem('user.id', msg.data.user.id);
                sessionStorage.setItem('user.name',msg.data.user.name);
                sessionStorage.setItem('user.username',msg.data.user.username);
                sessionStorage.setItem('user.jwt',msg.data.jwt_token);
                sessionStorage.setItem('user.partners',JSON.stringify(msg.data.user.partners));
                this.statSection();
            }else{
                alert(msg.message);
            }
        }
    });
}

function reloadRate(){
    this.rateSection()
    this.openMyTab('myTabRates', 'rateTab')
}

function reloadPoint(){
    this.pointSection($('#pid').val())
    this.openMyTab('myTabHome', 'homeTab')
    this.openMySubTab('pointTab')
}

function reloadComission(){
    this.comissionSection($('#pid').val())
    this.openMyTab('myTabHome', 'homeTab')
    this.openMySubTab('comissionTab')
}

function reloadPrice (date, id){
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];
    $(".rates").remove(); //remove all the tr's except first ,As you are using it as table headers.            

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/partner/rate",
        data: { start: date},
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(msg.data).each(function () {
                    var d = new Date(this.date).getDate();
                    var mx = mN[new Date(this.date).getMonth()];
                    var m = new Date(this.date).getMonth();
                    var Y = new Date(this.date).getFullYear();
                    if(this.room_rates.length){
                        var html = '<div class="item rates"><div class="row"><div class="col-75"><p class="text-grey-500 wrap">'+this.name+'</p></div><div class="col"><h1 class="text-green text-strong align-right" style="margin-top:0px !important">'+money(this.room_rates[0].net)+'</h1></div></div></div>';
                        $('#listRate').append(html); //append your new tr
                        for (var i = 0; i < this.room_rates.length; i++) {
                            var html = '<div class="item rates"><div class="row"><div class="col-75"><p class="text-grey-500 wrap align-right" style="font-size:12px !important">'+this.room_rates[i].title+'</p></div><div class="col"><h1 class="text-grey-500 align-right" style="margin-top:0px !important; font-size:12px !important">'+money(this.room_rates[i].net)+'</h1></div></div></div>';
                            $('#listRate').append(html); //append your new tr
                        }
                    }
                    if(this.bottom_rates.length){
                        var html = '<div class="item rates"><div class="row"><div class="col-75"><p class="text-grey-500 wrap align-right" style="font-size:12px !important">Bottom Rate</p></div><div class="col"><h1 class="text-grey-500 align-right" style="margin-top:0px !important; font-size:12px !important">'+money(this.bottom_rates[0].price)+'</h1></div></div></div>';
                        $('#listRate').append(html); //append your new tr
                    }
                });
            }else{
                alert(msg.message);
            }
        }
    });

    $(".swiper-slide .text-big").removeClass('text-white');
    $(".swiper-slide .text-big").addClass('text-green');
    $(".swiper-slide").removeClass('green');
    $("#"+id).addClass('green')
    $("#"+id+' .text-big').removeClass('text-green')
    $("#"+id+' .text-big').addClass('text-white')
}

function money(n) {
    return n.toLocaleString('en-US', {minimumFractionDigits: 0});
}

$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}

