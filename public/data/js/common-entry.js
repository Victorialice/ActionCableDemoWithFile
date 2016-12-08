var EntryCommon = Class.get({
    gotoPage1_2fromPage1_1:function(){
        var t = this;
        t.com.on("hide_all_complete", function(e){
            console.log("hide_all_complete");
            $("#page1 div.content").hide();
            t.com.off(e);
            t.currentPage = "page1-2";
            t.com.on("show_complete", function(e){
                t.com.off(e);
                $("#page1 .btn-set a").removeClass("disabled");
//                $("#page1 #image-box, .btn-set").fadeIn(500);
                $("#page1 #image-box").fadeIn(500, function(){
                    $("#page1 .btn-set").fadeIn(500);
                    if(t.isCtrlShowed) return;
                    $("#page1 #pinch").fadeIn(500).delay(1500).fadeOut(500, function(){
                        $("#page1 #cross-arrow").fadeIn(500).delay(1500).fadeOut(500, function(){
//                            $("#page1 .btn-set").show().fadeIn(500);
                        });
                    });
                    t.isCtrlShowed = true;
                });

            })
            t.com.jumpShow("#page1 .title1-2");
        });
        t.com.hideAll(["#page1 .title1-1", "#page1 .cut", "#form-box"]);        
    }
    ,gotoPage1_1fromPage1_2:function(){
        var t = this;
        var flg = false;
        $("#page1 .btn-set a").addClass("disabled");
        $("#page1 #image-box,#page1 .btn-set, #page1 .title1-2").fadeOut(500, function(e){
            if(flg) return;
            t.com.off(e);
            t.currentPage = "page1-1";
            t.show();
            flg = true;
        });
    }
    ,gotoPage1_2fromPage2:function(){
        $("#page2").hide();
        this.currentPage = "page1-2";
        $("#page1 .btn-set a").removeClass("disabled");
        $("#page1").show();        
    }
    ,gotoPage2fromPage1_1:function(){
        var t = this;
        $("#page1").hide();

        var size = $("#img img").width();
        t.postImage = ResizeImage.adaptImage($("#img img").attr("src"), size, size, 0, 0).replace(/^data:image\/jpeg;base64,/, '');

        this.currentPage = "page2";
        $("#page2").show();        
    }
    ,gotoPage2fromPage1_2:function(){
        var t = this;
        var _w = $("#src_keeper").width();
        var _h = $("#src_keeper").height();

        var wrapperW = $("#wrapper").width();
        var imgBoxW = $("#image-box").css("width");

        $("#page1 .btn-set a").addClass("disabled");

        if(imgBoxW.indexOf("%")!=-1)
        {
            imgBoxW = wrapperW*parseFloat(imgBoxW)/100;
        }
        var margineLeft = $("#hit").css("marginLeft");
        if(margineLeft.indexOf("%")!=-1)
        {
            margineLeft = parseFloat( margineLeft) / 100 * imgBoxW;
        }
        var initX = parseInt(margineLeft);
        var initY = parseInt($("#hit").css("top"));

        var pos = TouchPhoto.calculatePosition(_w, _h, initX, initY);
        
        var size = $("#hit").width()*1/TouchPhoto.transform.scale;
        var displayImage = new Image();
        var srcKeeper = document.getElementById('src_keeper');
        var scale = Math.max(1.0, srcKeeper.naturalWidth/$("#image-box").width());
        size = parseInt(scale*size);
        pos.x = parseInt(scale*pos.x);
        pos.y = parseInt(scale*pos.y);
        var adaptedImage = ResizeImage.adaptImage(t.originalImage, size, size, -pos.x, -pos.y);
        displayImage.src = adaptedImage;
        t.postImage = adaptedImage.replace(/^data:image\/jpeg;base64,/, '');
        $("#img").empty();
        $("#img").append(displayImage);
        $("#img").append('<div class="border"></div>');
        $("#page1").hide();

        $("#page2 .title h2, #page2 .cookie").hide();

        t.com.jumpShow("#page2 .cookie-l");
        setTimeout(function(){
            t.com.jumpShow("#page2 .cookie-r", null, null, "marginBottom", -50);
        }, 100);
        setTimeout(function(){
            t.com.baloonAnimation("#page2 .title h2");
        }, 300);
        $("#page2").show();        
        t.currentPage = "page2";
    }
});
var Animation = Class.get({
    movie_animation:null
    ,initialize:function()
    {
    }    
    ,setup:function(canvasElement, file, frames, animations, name, scale, framerate) 
    {
        var t = this;        
        var movie_stage = new createjs.Stage(canvasElement);
        function createAnimation(file, frames, animations) {
            var data = {};
            data.images = [file];
            data.frames = frames;
            data.animations = animations;
            var mySpriteSheet = new createjs.SpriteSheet(data);
            var mySprite = new createjs.Sprite(mySpriteSheet);
            return mySprite;
        }
        t.movie_animation = createAnimation(file, frames, animations);
        if(framerate!=null) t.movie_animation.framerate = framerate;
        t.movie_animation.scaleX = t.movie_animation.scaleY = scale;

        movie_stage.addChild(t.movie_animation);
        return movie_stage;
    }
    ,start:function(canvasElement, file, frames, animations, name, scale, framerate){
        var t = this;
        movie_stage = t.setup(canvasElement, file, frames, animations, name, scale, framerate);
        t.movie_animation.gotoAndPlay(name);
        t.movie_animation.addEventListener("animationend", function(){
//            console.log("animationend");
            t.trigger("animation_end");
        });
        function animate(eventObject)
        {
            movie_stage.update(eventObject);
        }
        createjs.Ticker.addEventListener("tick", animate);
        return movie_stage;
    }
    ,stop:function()
    {
        var t = this;
        t.movie_animation.stop();
    }
});








