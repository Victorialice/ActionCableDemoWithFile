var Entry = Class.get({
    message:null
    ,users_id:[]
    ,initialized:false
    ,com:null
    ,api:null
    ,currentPage:null
    ,originalImage:null
    ,isCtrlShowed:false
    ,loading:null
    ,postImage:null
    ,isStartReady:false
    ,uploadUserQueue:null
    ,uploadTimerIntervalId:null
    ,network:0
    ,init:function(api, com)
    {
        var t = this;
        t.com = com;
        t.api = api;
        t.currentPage = "page1-1";
        t.uploadUserQueue = new QueueHandler();
        t.uploadUserQueue.add(t, t.showUploadUserImage, "show_upload_user_image_complete");

        api.on("message_success", function(e, data)
        {
//console.log("message_success");
            api.off(e);
//            global_com.checkNetwork();
            try
            {
                api.userNetwork(t.network);
            }catch(e){}

            t.loading.on("loading_complete", function(e){
                t.loading.off(e);
                $("#loading").hide();
                var flg = false;
                $("#entry, #step").fadeIn(500, function(e){
                    if(flg) return;
                    flg = true;
                    t.gotoPage("page4");
                });
                clearInterval(t.uploadTimerIntervalId);
            });
            t.loading.stop();
        });
        api.on("uploads_success", function(e, data)
        {
//console.log("uploads_success");
            api.off(e);
            global_api.connection();
        });
        api.on("uploads_failed", function(e, error_code)
        {
            console.log("uploads_failed");
            var url = "error.html?code="+error_code;
            window.location.href = url;
        });
        api.on("connection_success", function(e, data){
            api.off(e);
//console.log("connection_success");

            api.on("user_upload_success", function(e, data)
            {
                t.uploadSuccess(data.uid);
//                $("#qrcode").append("<p>"+data.uid+"</p>");
            });
            api.on("user_upload_close_success", function(e, data)
            {
//console.log("user_upload_close_success");
                t.gotoPage("page6");
            });
            api.on("user_turn_success", function(e, data)
            {
                t.showStart();
//console.log("user_turn_success turn_id="+data.turn_id+" total_users="+data.total_users);
            });
            api.on("user_turn_reset_success", function(e, data){
                t.resetStart();
//console.log("user_turn_reset_success");
            });
            if(data && data.debug) return;
            api.setMessage(t.message);

        });
        /*
        global_com.on("check_network_success", function(e, data)
        {
console.log("check_network_success"+" time="+data.time+" network="+data.network+" speed="+data.speed);
            try
            {
                api.userNetwork(data.network);
            }catch(e){}

            t.loading.on("loading_complete", function(e){
                t.loading.off(e);
                $("#loading").hide();
                var flg = false;
                $("#entry, #step").fadeIn(500, function(e){
                    if(flg) return;
                    flg = true;
                    t.gotoPage("page4");
                });
                clearInterval(t.uploadTimerIntervalId);
            });
            t.loading.stop();
        });
*/
        $(function () {
            var w = $("#wrapper").width();
            $(window).on("resize orientationchange", function() {
                var floatImgW = Math.floor(540 / 750 * w);
                $("#page5 .float .img").height(floatImgW);
                $("#page5 .float .img").css("marginTop", Math.floor(-floatImgW/2));
                $("#page5 .float .cheer").css("marginTop", Math.floor(-floatImgW/2-178/2));
            });
            $(window).resize();
        });
        
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

/*
        $('#file').on('click', function(e) {
            e.preventDefault();
            wx.chooseImage({
            success: function (res) {
                images.localId = res.localIds;
                jQuery(function(){
                    $.each( res.localIds, function(i, n){
    //                    $("#img").append('<img src="'+n+'" /> <br />');
                    });
                });
                }
            });            
        });*/
        $("#cut-btn").on("click", function(e){
//        $("#cut-btn").on("touchstart", function(e){
            e.preventDefault();
            t.gotoPage("page2");
        });
        $("#page1 .back-btn").on("click", function(e){
            e.preventDefault();
            t.gotoPage("page1-1");           
        });
        $("#next-btn").on("click", function(e){
            e.preventDefault();
            $("input[name=message]").attr("checked",false);
            t.gotoPage("page3");
        });
        $("#page2 .back-btn").on("click", function(e){
            e.preventDefault();
            t.gotoPage("page1-2");
        });
        $("#message-form input").on("change", function(e){
            e.preventDefault();
            $("#upload_button").removeClass("disabled");
            t.message = $("input[name=message]:checked").val();
        });
        $('#upload_button').on('click', function(e) {
            e.preventDefault();
            $(this).addClass("disabled");
            var flg = false;
            $("#step, #entry").fadeOut(500, function(){
                if(flg) return;
                flg = true;
                $("#loading").show();
                $("#page3").hide();
                t.loading.start();
                t.uploadTimerIntervalId = setTimeout(function(){
                    clearInterval(t.uploadTimerIntervalId);
                    window.location.href = Config.errorUrl+"?code=F00005";
                    return;
                }, Config.timeout);
                api.uploads(t.postImage, "1");
            });
        });
        $("#page3 .back-btn").on("click", function(e){
            e.preventDefault();
            t.message = "";
            $("#upload_button").addClass("disabled");
            t.gotoPage("page2");
        });
        $("#p4_next_button").on("click", function(e){
            e.preventDefault();
            t.gotoPage("page5");
        });
        $("#entry_close").on("click", function(e){
            e.preventDefault();    
            $(this).addClass("disabled");
            api.userUploadClose();
        });
        $("#p6_ok_button").on("click", function(e){
            e.preventDefault();
            t.gotoPage("page7");
        });
        $("#p6_reset_button").on("click", function(e){
            e.preventDefault();    
            api.userTurnReset();
            $("#p6_reset_button").hide();
        });
        $("#page7 .heart .text-box").on("click", function(e){
            e.preventDefault();
            if(!t.isStartReady) return;
            var data = {};
//            data.total_users = t.users_id.length;
            t.trigger("entry_complete", data);
        });

        t.loading = new Loading2(com);

        var srcKeeper = document.getElementById('src_keeper');
        TouchPhoto.init(srcKeeper);
        
        setTimeout(function(){
            t.initialized = true;
            t.trigger("entry_init_complete");
        },500);
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
    ,memberJoin: function(uid, callback)
    {
        console.log(uid+" memberJoin");
        var t = this;
        var url = Config.uploadpath + t.api.gid + "/" + uid + "/original.jpg";
        var h = $(window).height();
        $("#page5 .float").height(h);
        $("#page5 .float .img img").attr("src", url).on("load", function(e){
            $(this).off(e);
            console.log(uid+" load_complete");
            $("#page5 .float").fadeIn(500);
            setTimeout(function(){
                $("#page5 .float .img").fadeIn(500);
            }, 100)
            setTimeout(function(){
                t.com.jumpShow("#page5 .float .cheer", null, 250);
            }, 600);
            callback.apply();
        });
    }
    ,uploadSuccess: function(uid){
//console.log("uploadSuccess uid="+uid);
        t.uploadUserQueue.push([uid]);
    }
    ,showUploadUserImage:function(uid)
    {
        var url, t = this;
//console.log("user_uploads_success");
        t.users_id.push(uid);
        t.memberJoin(uid, function(){
            setTimeout(function(){
                $("#entry_close").removeClass("disabled");
                url = Config.basepath + "images/leader/member_number_txt.png";
                $("#page5 .number-box").css("background-image", "url("+url+")");
                url = Config.basepath + "images/leader/entry_number_"+ (t.users_id.length+1).toString() +".png";
                $("#page5 .number-box .number").show().css("background-image", "url("+url+")");
                $("#page5 .float").fadeOut(500);
            }, 2000);
            setTimeout(function(){
                t.com.scaleAnimation("#page5 .number-box .number");
            }, 2500);
            setTimeout(function(){
                t.trigger("show_upload_user_image_complete");
            }, 3000);            
        });
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
                if(t.currentPage == "page4")
                    t.gotoPage3fromPage4();
                break;
            case "page4":
                if(t.currentPage == "page1-1")
                    t.gotoPage4fromPage1_1();
                if(t.currentPage == "page3")
                    t.gotoPage4fromPage3();
                break;
            case "page5":
                if(t.currentPage == "page1-1")
                    t.gotoPage5fromPage1_1();
                if(t.currentPage == "page4")
                    t.gotoPage5fromPage4();
                break;
            case "page6":
                if(t.currentPage == "page1-1")
                    t.gotoPage6fromPage1_1();
                if(t.currentPage == "page5")
                    t.gotoPage6fromPage5();
                break;
            case "page7":
                if(t.currentPage == "page1-1")
                    t.gotoPage7fromPage1_1();
                if(t.currentPage == "page6")
                    t.gotoPage7fromPage6();
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
            t.com.changeStep("step1");
            $("#page2").fadeIn(500);
        }, 500);
    }
    ,gotoPage3fromPage1_1:function(){
        $("#page1").hide();
        this.currentPage = "page3";
        t.com.changeStep("step2");
        $("#page3").show();
    }
    ,gotoPage3fromPage2:function(){
        var t = this;
        $("#page2").fadeOut(500);
        setTimeout(function(){
            t.currentPage = "page3";

            $("#page3 .title h2, #page3 .title .cookie, #page3 #message-form .message-item").hide();
            $("#page3").fadeIn(500);
            setTimeout(function(){
                t.com.changeStep("step2");
                t.com.jumpShow("#page3 .title h2");
                setTimeout(function(){
                    t.com.jumpShow("#page3 .title .cookie-l");
                }, 100);
                setTimeout(function(){
                    t.com.jumpShow("#page3 .title .cookie-r");
                }, 200);
                var delay = 300;
                $("#page3 #message-form .message-item").each(function(i, element){
                    setTimeout(function(){
                        t.com.jumpShow(element);
                    }, delay);
                    delay+=100;
                });
            }, 500);
        }, 500);
    }
    ,gotoPage3fromPage4:function(){

    }
    ,startAnimation:function(){

//console.log("startAnimation");
        var t = this;
        var anim = new Animation();
        var canvasElement = document.getElementById("ready-animation");
        var file = Config.basepath + "images/leader/sprites.png";
        var frames = [
            // x, y, width, height, imageIndex*, regX*, regY*
            [524, 380, 156, 206, 0, -35, 0]
            ,[293, 380, 231, 190, 0, -47, -32]
            ,[376, 190, 210, 190, 0, -47, -32]
            ,[0, 380, 293, 190, 0, -47, -32]
            ,[0, 190, 376, 190, 0, -47, -32]
            ,[0, 0, 459, 190, 0, -47, -32]
         ];
        var animations = {
            walk: {
                frames: [0, 1, 2, 3, 4, 5],
                speed:0.1
            }
        }
        anim.start(canvasElement, file, frames, animations, "walk", .5);
    }
    ,gotoPage4fromPage1_1:function(){
        var t = this;
        $("#page1").hide();
        t.currentPage = "page4";
        t.com.changeStep("step3");
        $("#page4").show();
        t.startAnimation();
    }
    ,gotoPage4fromPage3:function(){
        var  t = this;
        window.scrollTop = 0;
        this.currentPage = "page4";
        t.com.changeStep("step3");            
        var items = "#page4 .title, #page4 .text1, #page4 .box .baloon1, #page4 .box .peaple, #page4 .box .text2, #page4 .box .baloon2, #page4 .box .animation";
        $(items).hide();
        $("#page4").fadeIn(500);
        var delay = 300;
        $(items).each(function(i, element){
            $(element).css("z-index", "100");
            setTimeout(function(){
                t.com.jumpShow(element);                    
            }, delay);
            delay+=100;
        });
        t.startAnimation();
    }
    ,gotoPage5fromPage1_1:function(){
        var t = this;
        t.gotoPage5fromPage4();
        $("#page1").hide();
        setTimeout(function(){
            t.api.gid = "iaoobent";
            t.api.trigger("connection_success", {debug:true});
            t.api.trigger("user_upload_success", {uid:"270"});
        }, 1000);
        $("#entry_close").off("click").on("click", function(e){
            t.gotoPage("page6");
        });
    }
    ,gotoPage5fromPage4:function(){
        var t = this;
        $("#qrcode").append(t.api.qrHtml);
        var width  =parseInt(480 / 750 * $("#wrapper").width());
        var size = parseInt(width / $("#qrcode table tr").size());
        $("#qrcode table td").width(size).height(size);
//console.log("td size="+Math.sqrt($("#page5 #qrcode table tr td").size()));
        var row = Math.sqrt($("#page5 #qrcode table tr td").size());
        $("#qrcode").width(row*size);
        $("#page4").hide();
        t.currentPage = "page5";
        $("#step").hide();
        $("#page5 .number-box .number, #page5 .float, #page5 .float .cheer, #page5 .float .img").hide();
        $("#page5").show();        
    }
    ,gotoPage6fromPage1_1:function(){
        var t = this;
        $("#step").hide();
        $("#page1").hide();

        var length = 8;
        t.gotoPage6fromPage5(length);
    }
    ,gotoPage6fromPage5:function(length){
        var t = this;
        var delay = 0;
//console.log(t.users_id);
        if(length==null) length = t.users_id.length+1;

        $("#page6 .title-box .number").addClass("number"+length.toString());
        $("#page6 .box .smartphone").addClass("smartphone"+length.toString());

        $("#page5").fadeOut(500);

        t.currentPage = "page6";

        var list = ["#page6 .title-box .text", "#page6 .title-box .number", "#page6 .cookie-l", "#page6 .cookie-r", "#page6 .box .baloon", "#page6 .btn-set-L .ok-btn"];
        $(list.join(",")).hide();

        $("#page6").fadeIn(500);

        delay = 500;

        $("#page6 .title-box .text, #page6 .title-box .number, #page6 .cookie-l, #page6 .cookie-r").each(function(i, element){
            $(element).css("z-index", "100");
            setTimeout(function(){
                t.com.jumpShow(element);                    
            }, delay);
            delay+=100;
        });
        delay += 500;

        setTimeout(function(){
            t.com.baloonAnimation("#page6 .box .baloon");
        }, delay);
        delay += 500;
        setTimeout(function(){
            $("#page6 .btn-set-L .ok-btn").fadeIn(500);
        }, delay);
    }
    ,gotoPage7fromPage1_1:function(){
        var t = this;
        $("#step").hide();
        $("#page1").hide();
        t.gotoPage7fromPage6();

        setTimeout(function(){
            t.showStart();
        }, 2000);
//return;
        setTimeout(function(){
            t.resetStart();
        }, 5000)
    }
    ,showStart:function(){
        var t = this;
        if(t.currentPage == "page6") t.gotoPage7fromPage6();
        $("#page7 .ready-txt").fadeOut(100);
        $("#page7 .heart .text-box .number-txt").fadeOut(100);
        t.com.on("scale_complete", function(e){
            $(this).off(e);
            $("#page7 .heart .text-box .start-txt").fadeIn(100);
            $("#page7 .text").fadeIn(100);
        });
        t.com.scaleUp("#page7 .heart", 0.74, 1.0, 200);
        delay = 500;
        $("#page7 .cookie").each(function(i, element){
            $(element).css("z-index", "100");
            if($(element).hasClass("Top"))
            {
                setTimeout(function(){
                    t.com.jumpShow(element);                    
                }, delay);
            }
            else
            {
                setTimeout(function(){
                    t.com.jumpShow(element, null, null, "marginBottom", -50);
                }, delay);
            }
            delay+=100;
        });        
        t.isStartReady = true;
    }
    ,resetStart:function(){
        var t = this;
        t.isStartReady = false;
        $("#page7 .reset").hide();
        $("#page7 .cookie").fadeOut(100);
        setTimeout(function(){
            $("#page7 .ready-txt").fadeIn(100);
            $("#page7 .text, #page7 .heart .text-box .start-txt").fadeOut(100);            
            t.com.on("scale_complete", function(e){
                $(this).off(e);
                $("#page7 .heart .text-box .number-txt").fadeIn(100);
                $("#page7 .reset").fadeIn();
            });
            t.com.scaleUp("#page7 .heart", 1.0, 0.74, 200);
        }, 500);
    }
    ,gotoPage7fromPage6:function(){
        var t = this;
        $("#page6").fadeOut(500);
        $("#page7").fadeIn(500);
    }    
}, EntryCommon);









