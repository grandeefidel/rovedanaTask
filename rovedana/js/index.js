
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
function httpRequest() {
    var ajax = null,
        response = null,
        self = this;

    this.method = null;
    this.url = null;
    this.async = true;
    this.data = null;

    this.send = function() {
        ajax.open(this.method, this.url, this.asnyc);
        ajax.send(this.data);
    };

    if(window.XMLHttpRequest) {
        ajax = new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
        try {
            ajax = new ActiveXObject("Msxml2.XMLHTTP.6.0");
        }
        catch(e) {
            try {
                ajax = new ActiveXObject("Msxml2.XMLHTTP.3.0");
            }
            catch(error) {
                self.fail("not supported");
            }
        }
    }

    if(ajax == null) {
        return false;
    }

    ajax.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                self.success(this.responseText);
            }
            else {
                self.fail(this.status + " - " + this.statusText);
            }
        }
    };
}
function timeSince(date) {
    return new Date(date*1000).toLocaleTimeString("en-US") ;
    // 1547903356
    // 1504095567183
}

var headlinesIDs = [];
var page = getUrlParameter('paginate');
if(isNaN(page) || page == undefined || page == 0 || page == ""){
    page = 0;
}
var request = new httpRequest();
request.method = "GET";
request.url = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
request.success = function(e) {
    printHeadlines(e);
};
request.send();

function printHeadlines(e){
    document.getElementById("display").innerHTML = "";
    headlinesIDs = JSON.parse(e);
    var total = headlinesIDs.length;
    var pull = 30 + parseInt(page);
    if(total < 30){
        pull = total;
    }
    console.log("Page: "+page);
    console.log("Pull: "+pull);

    for(var i=page; i<pull; i++){
        var id = headlinesIDs[i];
        var request = new httpRequest();
        request.method = "GET";
        request.url = "https://hacker-news.firebaseio.com/v0/item/"+id+".json?print=pretty";
        request.success = function(e) {
            if(i == page)
                console.log(e);
            e = JSON.parse(e);
            var content = document.getElementById("headlines").innerHTML;
            document.getElementById("headlines").innerHTML = content+`<div class="newsContainer">
                `+(parseInt(i)+1)+`. &nbsp;<a class="lista" href="index.html?newsid=`+id+`.json?print=pretty">
                    `+e.title+`
                </a><a class="lista" href="`+e.url+`">(`+e.url.split("/")[2].replace("www.", "")+`)</a><br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <small class="lista" style="font-size:12px; margin-top:7px">`+e.score+` points by `+e.by+` `+timeSince(e.score)+`&nbsp;|&nbsp;<span style="color:green"> `+e.kids.length+` comments</span></small></div>
            `;
        };
        request.send();
    }
    if(pull < total){
        var content = document.getElementById("headlines").innerHTML;
        if(page == 0){
            document.getElementById("headlines").innerHTML = content+`<hr>
                <a type="button" class="paginationBtn" style="margin-top:10px; margin-bottom:10px;" href="index.html?paginate=`+pull+`">
                    See More ...
                </a><hr>
            `;
        }else{
            document.getElementById("headlines").innerHTML = content+`<hr>
                <div><a class="paginationBtn" style="margin-top:10px; margin-bottom:10px; href="index.html?paginate=`+parseInt(page-30)+`">
                    << Previous Page
                </a><a class="paginationBtn" style="margin-top:10px; margin-bottom:10px; href="index.html?paginate=`+pull+`" style="float:right">
                    Next Page >>
                </a></div><hr>
            `;
        }
    }
}
