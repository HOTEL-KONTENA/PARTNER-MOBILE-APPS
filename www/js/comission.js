$(function() {
    var d = new Date();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var h = d.getDate();
    var y = d.getFullYear();
    let fd  = y+'-'+m+'-'+h;

    $('.loading').hide();
    $('#comissionDate').val(fd);

    this.reloadComission()
});


function onBackToDashboard(){
    window.location.href = "dashboard.html";
}

function reloadComission (){
    let pid = 0
    let ps  = JSON.parse(sessionStorage.getItem('user.partners'));
    for (let i in ps) {
        if(ps[i].membership){
            pid     = ps[i].id
        }
    }

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
                    var html = '<div class="item fields"><div class="row"><div class="col-20"><p class="align-center">'+d+'<br/>'+m+'<br/>'+Y+'</p></div><div class="col-50"><p class="text-grey-500 wrap"><strong>'+money(this.amount)+'</strong><br/>'+this.note+'</p></div><div class="col"><br/><h1 class="text-green text-strong align-right vertical-align-bottom">'+money(this.balance)+'</h1></div></div></div>';
                    $('#historical').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}
