$(function() {
    this.statSection()
    this.rateSection()
    $("#listPoint").show()
    $("#listRate").hide()
    $("span.numbers").digits();
});

function statSection (){
    let point = 0
    let perc  = 0
    let pid  = 0
    let ps = JSON.parse(sessionStorage.getItem('user.partners'));
    for (let i in ps) {
        point = point + ps[i].membership.total_point
        $("#taName").html(ps[i].name);
        $("#taLevel").html(ps[i].membership.level + " MEMBER");
        $("#taLevelNow").html(ps[i].membership.level);
        $("#taLevelNext").html(ps[i].membership.level_next);
        $("#taLevelAchieve").html(ps[i].membership.level_achieve);
        perc    = ps[i].membership.percentage_achieve;
        pid     = ps[i].id;
    }
    $("#pointTotal").html(point);

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
    this.pointSection(pid)
}

function pointSection (pid){
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: "http://128.199.145.173:6888/partner/point",
        data: { start: 'first day of this month', end: 'now', partner_id : pid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".points").remove(); //remove all the tr's except first ,As you are using it as table headers.            

                $(msg.data).each(function () {
                    var d = new Date(this.date).getDate();
                    var m = mN[new Date(this.date).getMonth()];
                    var Y = new Date(this.date).getFullYear();
                    var html = '<div class="item points"><div class="left"><p class="align-center">'+d+'<br/><small>'+m+' '+Y+'</small></p></div><p class="text-green">'+money(this.amount)+'</p><p class="text-grey-500">'+this.note+'</p><div class="right align-right text-small"><ul><li><h1 class="text-green text-strong">'+money(this.balance)+'</h1></li></ul></div></div>';
                    $('#listPoint').append(html); //append your new tr
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

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: "http://128.199.145.173:6888/partner/rate",
        data: { start: 'today', end: '+ 2 week'},
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".rates").remove(); //remove all the tr's except first ,As you are using it as table headers.            

                $(msg.data).each(function () {
                    var d = new Date(this.date).getDate();
                    var m = mN[new Date(this.date).getMonth()];
                    var Y = new Date(this.date).getFullYear();
                    var html = '<div class="item rates"><div class="left"><p class="align-center">'+d+'<br/><small>'+m+' '+Y+'</small></p></div><p class="text-green">'+money(this.net)+'</p><p class="text-grey-500">'+this.room_type.name+'</p></div>';
                    $('#listRate').append(html); //append your new tr
                    $("#taRateNow").html(money(this.net));
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

function openTabPoint (){
    $("#listPoint").show();
    $("#listRate").hide();
}

function openTabRate (){
    $("#listPoint").hide();
    $("#listRate").show();
}

function money(n) {
    return n.toLocaleString('en-US', {minimumFractionDigits: 0});
}

$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}
