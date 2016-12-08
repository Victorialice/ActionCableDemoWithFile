var Player = Class.get({
    data:null
/*    ,basepath:""*/
    ,videoFrame:0
    ,messageFrame:0
    ,messageFrameNum:0
    ,maxFrame:0
    ,currentMaxFrame:0
    ,minFrame:0
    ,loader:null
    ,currentFrame:0
    ,assets:[]
    ,fps:12
    ,api:null
    ,com:null
    ,isLast:false
    ,bgm:null
    ,markers:null
    ,lastOffset:0
    ,init:function(api, com)
    {
        var t = this;
        this.api = api;
        this.com = com;
        api.on("loading_start_success", function(e, data){
console.log("loading_start_success network="+data.network+" message_id="+data.message_id+" replay="+data.replay+" users_id="+data.users_id);             
            if(t.data==null) t.data = {};
            t.data.network = data.network;
            t.data.message_id = data.message_id;
            t.data.replay = data.replay;
            t.data.users_id  = data.users_id;
            t.data.total_users = data.users_id.length;
            if(data.replay=="1")
            {
                $("#player .float").fadeOut(500);
                setTimeout(function() {
                    t.api.loadingComplete();
                }, 500);
                return;
            }
            t.startLoading(true);
        });        
        api.on("animation_start", function(e, data){
//console.log("animation_start");
            t.animationStart();
        });
        api.on("animation_update", function(e, data){
//console.log("animation_update");
            t.update(data, true);
        });
        api.on("uploads_share_success", function(e, data){
//console.log("uploads_share_success");            
            t.api.shareOk("1");            
        });
        api.on("share_ok_success", function(e, data){
//console.log("share_ok_success");
            if(data.type == "1")
            {
                var url = Config.shareUrl+"?gid="+api.gid;
            }
            if(data.type == "2")
            {
                var url = Config.topUrl;                
            }
            $(".float #player-menu-box .player-menu-btn").fadeOut(500, function(){
                window.location.href = url;
            });
        });
        $("#replay-btn").on("click", function(e){
            e.preventDefault();
            $("#player-menu-box").hide();
            var maxLength = Config.length + Config.interval;
            t.replay(maxLength, Config.interval);
        });
        $("#share-btn").on("click", function(e){
            e.preventDefault();
            $(this).off(e);
            var canvas  = document.getElementById("main");
            var shareImage  = canvas.toDataURL("image/jpeg");
            shareImage = shareImage.replace(/^data:image\/jpeg;base64,/, '');
            t.api.uploads(shareImage, "3");
        });
        $("#top-btn").on("click", function(e){
            e.preventDefault();
            $(this).off(e);
            api.shareOk("2");            
        });
    }
    ,start:function(total_ms, update_ms)
    {
//console.log("player.start");
//        this.data = data;
        this.interval = update_ms;
        this.api.loadingStart(total_ms, update_ms, "0");
    }
    ,replay:function(total_ms, update_ms)
    {
        this.interval = update_ms;
        this.api.loadingStart(total_ms, update_ms, "1");
    }
    ,completeHandler:function (event) 
    {
        console.log("completeHandler");
        var t = global_player;
        $("#progress").remove();
/*
        t.bgm = createjs.Sound.createInstance("bgm");
        t.bgm.setVolume(0.5);
        t.bgm.addEventListener("complete", function(){
            //alert("sound complete")
        });
*/
        t.loader.removeEventListener("progress", t.progressHandler);
        t.loader.removeEventListener("fileload", t.fileloadHandler);
        t.loader.removeEventListener("complete", t.completeHandler);
        t.loader.removeEventListener("error", t.errorHandler);

        t.api.loadingComplete();
    }
    ,showMenu: function(){
        var wh = $(window).height();
        $("#player .float").height(wh);
        $("#player .float").fadeIn(500);
        setTimeout(function(){
            $("#player-menu-box").fadeIn(500);
        }, 500);
    }
}, PlayerCommon);





