var global_view = {
    init:function(com, imageNames, leader, network, callback){

        var start,loading = new Loading(com),start;

        $(function () {
            $(window).on("resize orientationchange", function() {
                var w = $("#wrapper").width();
                var h = Math.floor(1206/750*w);
                var wh = $(window).height();
                $("#main").attr({width:w*2, height:h*2});
                mainTop = Math.floor(wh - h);
                $("#main").css("top", mainTop+"px");
                $("#main").css({transform:"translateX(-"+Math.floor(w/2)+"px) translateY(-"+Math.floor(h/2)+"px) scale(.5)"});
                $("#player .video").width(w);
                $("#player .video").height(h);

                $(".page, .page .content").width(w);
                $("#wrapper, .page, .page .content, #player").css("min-height", Math.max(h,wh)+"px");
                $("#page1").css("height", Math.max(h,544)+"px");
                $(".member #page3").css("height", Math.max(h,590)+"px");
                $("#page6").css("height", Math.max(h,608)+"px");
                $("#player .loading-box, #player .loading-container, #loading").css("height", wh+"px");

                var scale = wh/603;
                $("#player .loading-container canvas, #player .loading-container ul").css("transform", "translate(-50%, -50%) scale("+scale.toString()+")");
                $("#player .loading-container ul").css("marginTop", Math.floor(244*scale));

                var imgBoxW = $("#image-box").css("width");
                if(imgBoxW.indexOf("%")!=-1)
                {
                    imgBoxW = w*parseInt(imgBoxW)/100;
                }
                $("#image-box").height(parseInt(imgBoxW));
                var hitBoxW = $("#hit").css("width");
                if(hitBoxW.indexOf("%")!=-1)
                {
                    hitBoxW = parseInt(imgBoxW)*parseInt(hitBoxW)/100;
                }
                $(".hit-area, .controll").height(parseInt(hitBoxW));            

                var gap = parseInt(imgBoxW) - parseInt(hitBoxW);
                $("#hit, .controll").css("top", parseInt(gap/2)+"px");
                $("#hit-border").css("top", parseInt(gap/2)-5+"px");

                $('.hit-area').on('touchmove touchstart touchend', function(e) {
                    return false;
                });
                $(".active-btn").on("touchstart", function(e){
                    e.stopPropagation();
                    $(this).addClass("press");
                });
                $(".active-btn").on("touchend touchcancel", function(e){
                    e.stopPropagation();
                    $(this).removeClass("press");
                });
            });
            $(window).resize();
        });
        loading.on("loading_complete", function(e){
            console.log("loading_complete");
            loading.off(e);

            var showView = function(){
                com.on("show_complete", function(e){
                    com.off(e);
                    global_entry.on("show_complete", function(e){
                        global_entry.off(e);
                        console.log("entry show_complete");
                        if(callback) callback.apply();
                    });
                    global_entry.show();    
                });
                com.jumpShow("#step");
                var end = new Date().getTime();
                var time = (end - start)/1000;
                var imageSize = (leader)?Config.imageSizeLeader:Config.imageSizeMember;
                var speed = Math.floor(imageSize/time*8);
                if(!network) network = com.getTypeBySpeed(speed);
                global_entry.network = network;
                console.log("imageSize="+imageSize+"KB time="+time+" speed="+speed+"kbps network="+network);
            }

            var intervalId;

            $("#loading").hide();
            $("#page1").show();

            if(global_entry && global_entry.initialized)
            {
                showView();
            }
            else
            {
                intervalId = setInterval(function(){
                    if(global_entry && global_entry.initialized)
                    {
                        clearInterval(intervalId);
                        showView();
                    }                
                },100);
            }
        });
//console.log("1");
        loading.on("loading_start", function(e){
            console.log("loading_start");
            loading.off(e);  
            start = new Date().getTime();
        })
        loading.start(imageNames);
    }
};
var wh = $(window).height();
if(wh) $("#loading").css("height", $(window).height()+"px");
