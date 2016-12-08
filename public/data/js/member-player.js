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
    ,markers:null
    ,lastOffset:0
    ,init:function(api, com)
    {
        var t = this;
        this.api = api;
        this.com = com;
        api.on("loading_start_success", function(e, data){
console.log("loading_start_success network="+data.network+" message_id="+data.message_id+" replay="+data.replay+" users_id="+data.users_id); 
            t.data.network = data.network;
            t.data.message_id = data.message_id;
            t.data.replay = data.replay;
            t.data.users_id = data.users_id;
            t.data.total_users = data.users_id.length;
            if(data.replay=="1")
            {
                $("#player .float").fadeOut(500);
                setTimeout(function() {
                    t.api.loadingComplete();
                }, 500);
                return;
            }
            t.startLoading();
        });        
        api.on("user_turn_success", function(e, data){
//console.log("user_turn_success turn_id="+data.turn_id);
            if(t.data==null) 
            {
                t.data = {};
            }
            t.data.turn_id = data.turn_id;            
        });
        api.on("animation_start", function(e, data){
//console.log("animation_start");
            t.animationStart();
        });
        api.on("animation_update", function(event, data){
//console.log("animation_update");
            t.update(data);
        });
        api.on("uploads_share_success", function(e, data){
//console.log("uploads_share_success");            
            api.shareOk("1");            
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
            window.location.href = url;
        });
    }
    ,completeHandler:function (event) 
    {
    //return;
        var t = global_player;
        $("#progress").remove();

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
    }
}, PlayerCommon);



