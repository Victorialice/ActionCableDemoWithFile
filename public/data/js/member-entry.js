var Entry = Class.get({
    initialized:false
    ,com:null
    ,api:null
    ,currentPage:null
    ,originalImage:null
    ,isCtrlShowed:false
    ,loading:null
    ,isCtrlShowed:false
    ,loading:null
    ,postImage:null
    ,turn_id:null
    ,uploadTimerIntervalId:null
    ,network:0
    ,init:function(api, com)
    {
        var t = this;
        var srcKeeper = document.getElementById('src_keeper');
        var trun_id = "";

        t.com = com;
        t.api = api;
        t.currentPage = "page1-1";

        api.on("uploads_success", function(e, data)
        {
            console.log("uploads_success");
            api.connection();        
        });
        api.on("uploads_failed", function(e, error_code)
        {
            console.log("uploads_failed");
            window.location.href = Config.errorUrl+"?code="+error_code;
        });
        api.on("connection_success", function(e, data){
console.log("connection_success");
            api.off(e);
            api.on("user_turn_success", function(e, data){
                console.log("user_turn_success turn_id="+data.turn_id);
                t.turn_id = data.turn_id;
                t.displayTurnNumber();
            });
            api.on("user_upload_close_success", function(e, data)
            {
                console.log("user_upload_close_success");
                t.gotoPage("page4");
            });
            api.on("user_turn_reset_success", function(e, data){
                console.log("user_turn_reset_success");
                t.turn_id = null;
                t.resetTurnNumber();
            });
            /* 
            try
            {
                com.checkNetwork();
            }
            catch(e) {
                console.log(e);
            }*/
            try
            {
                api.userNetwork(t.network);                
            }catch(e){}

            t.loading.on("loading_complete", function(e){
                t.loading.off(e);
                $("#loading").hide();
                $("#entry, #step").fadeIn(500);
                setTimeout(function(){
                    $("#entry, #step").fadeIn(500, function(e){
                        t.gotoPage("page3");
                    });                        
                }, 500);
                clearInterval(t.uploadTimerIntervalId);
            });
            t.loading.stop();
        });
        /*
        com.on("check_network_success", function(e, data)
        {
console.log("check_network_success"+" time="+data.time+" network="+data.network+" speed="+data.speed);
            try
            {
                api.userNetwork(data.network);                
            }catch(e){}

            t.loading.on("loading_complete", function(e){
                t.loading.off(e);
                $("#loading").hide();
                $("#entry, #step").fadeIn(500);
                setTimeout(function(){
                    $("#entry, #step").fadeIn(500, function(e){
                        t.gotoPage("page3");
                    });                        
                }, 500);
                clearInterval(t.uploadTimerIntervalId);
            });
            t.loading.stop();
        });
*/
        $('#file').on('change', function(e) {
            e.preventDefault();
            var file = this.files[0];
            ResizeImage.resizeImage(file, 0, srcKeeper).then(function(resize_image, no, w) {
                $("#src_keeper").width(w);
                var canvasData = resize_image.replace(/^data:image\/jpeg;base64,/, '');
                t.originalImage = resize_image;
                t.postImage = canvasData;
                t.gotoPage("page1-2");
                $('#file').wrap('<form>').closest('form').get(0).reset();
                $('#file').unwrap();
            });
            $("#btn-image").hide();
            $("#cut-btn").show();
        });
        $("#page1 .back-btn").on("click", function(e){
            e.preventDefault();    
            t.gotoPage("page1-1");           
        });

        $("#page2 .back-btn").on("click", function(e){
            e.preventDefault();
            t.gotoPage("page1-2");
        });
        $("#cut-btn").on("click", function(e){
            e.preventDefault();
            t.gotoPage("page2");
        });
        $("#next-btn").on("click", function(e){
            e.preventDefault();
            $(this).addClass("disabled");
            $("#step, #entry").fadeOut(500);
            setTimeout(function(){
                $("#loading").show();
                $("#page2").hide();
                t.loading.start();
                t.uploadTimerIntervalId = setTimeout(function(){
                    clearInterval(t.uploadTimerIntervalId);
                    window.location.href = Config.errorUrl+"?code=F00005";
                    return;
                }, Config.timeout);
                api.uploads(t.postImage, "2");
            }, 500);
        });
        $("#tap_button").on("click", function(e){
            e.preventDefault();
            $("#page4 .select-box").hide();
/*
t.turn_id = "2";
t.displayTurnNumber();
return;
*/
            api.userTurn();
        });
        t.loading = new Loading2(com);
        TouchPhoto.init(srcKeeper);
//        api.connection();
        setTimeout(function(){
            t.initialized = true;
            t.trigger("entry_init_complete");
        },500);
    }
    ,uploadTest:function()
    {
        var t = this;
        if( t.currentPage != "page2" ) return;
        $("#step, #entry").fadeOut(500);
        setTimeout(function(){
            $("#loading").show();
            $("#page2").hide();
            t.loading.start();
            t.api.uploads(t.postImage, "2");                
        }, 500);        
    }
    ,show:function(){
        console.log("show");
        t = this;
        $("#page1 div.content").show();
        t.com.jumpShow("#page1 .title1-1");
        setTimeout(function(){
            t.com.jumpShow("#page1 .cut");            
        },500);
        setTimeout(function(){
            t.com.on("show_complete", function(e){
                t.com.off(e);
                t.trigger("show_complete");
            });
            t.com.jumpShow("#form-box");
        },1000);
    }
    ,gotoPage:function(page){
        var t = this;
        switch(page)
        {
            case "page1-1":
                t.gotoPage1_1fromPage1_2();
                break;
            case "page1-2":
                if(t.currentPage == "page1-1")
                    t.gotoPage1_2fromPage1_1();
                if(t.currentPage == "page2")
                    t.gotoPage1_2fromPage2();
                break;
            case "page2":
                if(t.currentPage == "page1-1")
                    t.gotoPage2fromPage1_1();
                if(t.currentPage == "page1-2")
                    t.gotoPage2fromPage1_2();
                if(t.currentPage == "page3")
                    t.gotoPage2fromPage3();
                break;
            case "page3":
                if(t.currentPage == "page1-1")
                    t.gotoPage3fromPage1_1();
                if(t.currentPage == "page2")
                    t.gotoPage3fromPage2();
                break;
            case "page4":
                if(t.currentPage == "page1-1")
                    t.gotoPage4fromPage1_1();
                if(t.currentPage == "page3")
                    t.gotoPage4fromPage3();
                break;
            default:
                break;
        }
    }
    ,gotoPage2fromPage3:function(){
        var t = this;
        $("#page3").fadeOut(500);
        this.currentPage = "page2";
        setTimeout(function(){
            t.com.changeStep("step2");
            $("#page2").fadeIn(500);
        }, 500);
    }
    ,gotoPage3fromPage1_1:function(){
        var t = this;
        $("#page1").hide();

        t.gotoPage3fromPage2();
    }
    ,gotoPage3fromPage2:function(){
        var t = this;
        window.scrollTop = 0;
        t.currentPage = "page3";
        t.com.changeStep("step3");    
        var items = "#page3 .title h2, #page3 .text1, #page3 .box .baloon .baloon-item, #page3 .box .animation #ready-animation";
        $(items).hide();
        $("#page2").fadeOut(500);
        $("#page3").fadeIn(500);
        var delay = 300;
        $(items).each(function(i, element){
            $(element).css("z-index", "100");
            setTimeout(function(){
                t.com.jumpShow(element);                    
            }, delay);
            delay+=500;
        });
        t.startAnimation();
    }
    ,startAnimation:function(){
        var t = this;
        var anim = new Animation();
        var canvasElement = document.getElementById("ready-animation");
        var file = Config.basepath + "images/member/sprites.png";
        var frames = [
            // x, y, width, height, imageIndex*, regX*, regY*
            [459, 0, 246, 232, 0, -36, 0]
            ,[0, 380, 314, 193, 0, -36, -42]
            ,[314, 380, 293, 190, 0, -36, -42]
            ,[0, 190, 376, 190, 0, -36, -42]
            ,[0, 0, 459, 190, 0, -36, -42]
         ];
        var animations = {
            walk: {
                frames: [0, 1, 2, 3, 4],
                speed:0.1
            }
        }
        anim.start(canvasElement, file, frames, animations, "walk", .5);
    }
    ,gotoPage4fromPage1_1:function(){
        var t = this;
        $("#page1").hide();
        t.gotoPage4fromPage3();
    }
    ,gotoPage4fromPage3:function(){
        var t = this;
        $("#step").hide();
        t.currentPage = "page4";
        $("#page3").fadeOut(500);
        $("#page4").fadeIn(500);
        t.startTapAnimation();
    }
    ,startTapAnimation:function(){
        var t = this;
        var anim = new Animation();
        var canvasElement = document.getElementById("tap-animation");
        var file = Config.basepath + "images/member/tap_sprites.png";
        var frames = [
            // x, y, width, height, imageIndex*, regX*, regY*
            [0,    372, 452, 205, 0, -83, -60]
            ,[0,   577, 452, 372, 0, -83, -2]
            ,[452, 372, 452, 372, 0, -83, -2]
            ,[0,     0, 533, 372, 0, -83, -2]
         ];
        var animations = {
            walk: {
                frames: [0, 1, 2, 3],
                speed:0.1
            }
        }
        anim.start(canvasElement, file, frames, animations, "walk", .5);
    }
    ,displayTurnNumber:function(){
        var turn_id = t.turn_id;
        $("#page4 .number-box .number").removeClass(function(index, className) {
             return (className.match(/\bis-\S+/g) || []).join(' ');
        }).addClass("is-number"+turn_id)
        $("#page4 .number-box").show();
    }
    ,resetTurnNumber:function(){
        $("#page4 .number-box").fadeOut();
        $("#page4 .select-box").fadeIn();
    }
}, EntryCommon);



