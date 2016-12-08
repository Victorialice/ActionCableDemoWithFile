var PlayerCommon = Class.get({
    anim:null
    ,animationStart:function()
    {
        var t = this;
        t.stopLoadingAnimation();
        t.isLast = false;
        t.currentMaxFrame = 0;
        t.currentFrame = t.minFrame;
        createjs.Ticker.setFPS(this.fps);
        t.update();
    }
    ,update:function(data, isLeader)
    {
        var t = global_player;
        var offset = 0;
        t.currentFrame = t.currentMaxFrame;
        if(data) 
        {
            offset = t.lastOffset;
            t.lastOffset = data.elapsed;
//            offset = data.elapsed;
            t.currentMaxFrame = Math.floor( data.elapsed / 1000 ) * 12;
//console.log("update elapsed="+data.elapsed);
        }

console.log("offset="+offset)
console.log("t.currentFrame="+t.currentFrame+" currentMaxFrame="+t.currentMaxFrame);

        if(isLeader && (t.currentMaxFrame > 0)) createjs.Sound.play("bgm.mp3", {offset:offset});

        if(t.currentMaxFrame >= t.maxFrame)
        {
            t.currentMaxFrame = t.maxFrame;
            t.isLast = true;
        }
        createjs.Ticker.removeEventListener('tick', t.tick);
        createjs.Ticker.addEventListener('tick', t.tick);
    }
    ,startLoading:function(isLeader)
    {
        
        $('html,body').animate({ scrollTop: 0 }, '1');
        $("body").css({"overflow-y":"hidden"});

        $(window).on('touchmove.noScroll', function(e) {
            e.preventDefault();
        });

        var t = this,turn_id;
        if(isLeader)
            turn_id = "1";
        else
            turn_id = t.data.turn_id;

        var loadTimeout = Config.timeout;
//        var datapath = "http://oc1jg6se3.bkt.clouddn.com/data/movie1024/";
        var datapath = Config.datapath;
        var basepath = t.com.getBasePath(datapath, t.data.network, t.data.total_users, turn_id);
//var basepath = t.com.getBasePath(datapath, "2", t.data.total_users, turn_id);
        var openingpath = t.com.getOpeningPath(datapath, t.data.network);
        var loadManifest = [];
        var i, _src, _id, marker, soundPath, uid;
        var canvasObject = document.getElementById('main');
        var maxConnections = t.com.getMaxConnections(t.data.network);

        t.videoFrame = Config.videoFrames[t.data.total_users-1];
        t.messageFrame = Config.messageFrames[t.data.total_users-1];
        t.maxFrame = Config.openingFrame + t.videoFrame + t.messageFrame;
        t.fps = t.com.getFrameRate(t.data.network);
        stage = new createjs.Stage(canvasObject);
        stage.update();

        t.loader = new createjs.LoadQueue(false,"","Anonymous");
        t.loader.installPlugin(createjs.Sound);
        t.loader.setMaxConnections(maxConnections);

        loadManifest.push({src: Config.basepath + "images/test/face.jpg", id: "face", loadTimeout:loadTimeout});
        for(i = 0; i < t.data.total_users; i++)
        {
            uid = t.data.users_id[i];
            _src = "/uploads/" + t.api.gid + "/" + uid + "/" + "original.jpg";
            loadManifest.push({src: _src, id: "face"+uid, loadTimeout:loadTimeout});
        }
        marker = Config.basepath + "json/"+"0" + t.data.total_users.toString() + "0" + turn_id + ".json";
        loadManifest.push({src: marker, id: "marker", loadTimeout:loadTimeout});

        t.messageFrameNum = (t.maxFrame-Config.openingFrame);
        t.com.maekLoading(loadManifest, t.minFrame, t.maxFrame, Config.openingFrame, t.data.message_id, t.fps, openingpath, basepath, loadTimeout, t.videoFrame, t.messageFrame);

console.log("maxFrame="+t.maxFrame+" basepath="+basepath + " fps="+t.fps + " marker="+marker);

        t.loader.loadManifest(loadManifest, false);
        t.loader.addEventListener("progress", t.progressHandler);
        t.loader.addEventListener("fileload", t.fileloadHandler);
        t.loader.addEventListener("complete", t.completeHandler);
        t.loader.addEventListener("error", t.errorHandler);
        t.loader.load();
        t.trigger("start_loading");
        t.startLoadingAnimation();
    }
    ,progressHandler:function (event) 
    {
        var progress = Math.floor(event.progress * 100);
        var str = ("00" + progress).slice(-3);
        $("#progress").text(str + "％");
        
        if(str.length>=3)
        {
            $("#player .loading-box ul .progress0 span").removeClass(function(index, className) {
                 return (className.match(/\bloaindg-num\S+/g) || []).join(' ');
            }).addClass("loaindg-num0"+str.substr(0,1));
            $("#player .loading-box ul .progress1 span").removeClass(function(index, className) {
                 return (className.match(/\bloaindg-num\S+/g) || []).join(' ');
            }).addClass("loaindg-num0"+str.substr(1,1));
            $("#player .loading-box ul .progress2 span").removeClass(function(index, className) {
                 return (className.match(/\bloaindg-num\S+/g) || []).join(' ');
            }).addClass("loaindg-num0"+str.substr(2,1));
        }
    }
    ,fileloadHandler:function (event) 
    {
        var t = global_player;
        var item = event.item;
        if(item.type === createjs.LoadQueue.IMAGE)
        {
            if(item.id.indexOf("face")!=-1)
            {
                console.log(item.id + " loaded");                
            }
            t.assets[item.id] = new createjs.Bitmap(event.result);
        }
        if(item.type === createjs.LoadQueue.JSON)
        {
            t.markers = event.result.marker;
        }
    }
    ,errorHandler:function(event)
    {
        console.log(event.title);
        t.com.dump(event.data);
    }
    ,tick: function() 
    {
        var t = global_player;

        var images = t.makeBitmap(t.currentFrame, t.messageFrameNum, t.videoFrame, t.assets, stage.canvas.width, t.data.total_users, t.data.users_id, t.markers);
        if(images!=null)
        {
            var bitmap = images[0];
            var bitmap1 = images[1];

            stage.addChild(bitmap);
            if(bitmap1) 
            {
                for(i = 0; i < bitmap1.length; i++)
                {
                    stage.addChild(bitmap1[i]);
                }

            }

            stage.update();
            stage.removeChild(bitmap);
            if(bitmap1)
            {
                for(i = 0; i < bitmap1.length; i++)
                {
                    stage.removeChild(bitmap1[i]);
                }
            }            
        }

        t.currentFrame = t.currentFrame+(12/t.fps);

        if( t.currentFrame >= t.currentMaxFrame ) 
        {
            createjs.Ticker.removeEventListener('tick', t.tick);
            if(t.isLast) t.trigger("play_complete")
        }
    }
    ,makeBitmap: function(currentFrame, messageFrameNum, videoFrame, assets, stageCanvasWidth, total_users, users_id, markers) 
    {
        var t = this, id, uid;
        var showFace = false;
        var faceIndex = 0;
        if(currentFrame < Config.openingFrame)
        {
            id = "a"+t.com.zeroPad(currentFrame);
        }
        else if(currentFrame < messageFrameNum)
        {
            id = "d"+t.com.zeroPad(currentFrame-Config.openingFrame);
            showFace = true;
            faceIndex = currentFrame-Config.openingFrame;
        }
        else
        {
            id = "m"+t.com.zeroPad(currentFrame-Config.openingFrame-videoFrame);            
//            showFace = true;
//            faceIndex = currentFrame-Config.openingFrame;
        }
        var bitmap = assets[id], bitmap1;
        if(bitmap==null) return null;
        var sratio = stageCanvasWidth / bitmap.image.width;
        bitmap.scaleX = sratio;
        bitmap.scaleY = sratio;
//console.log("makeBitmap users_id"+users_id);
        if(showFace)
        {
            bitmap1 = [];
            for(i = 0; i < total_users; i++)
            {
                var data = markers["P"+(i+1).toString()][faceIndex];
                uid = users_id[i];
                bitmap1[i] = assets["face" + uid];
                if(bitmap1[i]==null)
                {
                    bitmap1[i] =  assets["face"];
                    console.log("assets['face'" + uid + "] is null");
                }
                var imageRatio = bitmap.image.width / Config.imageOriginalWidth;

                var pos = [data[0], data[1]];
                var size = data[2];
                var angle = data[3];

                pos[0] = pos[0]-100;
                pos[1] = pos[1]-100;        

                var ratio =  size /bitmap1[i].image.width;
                bitmap1[i].scaleX = ratio*sratio*imageRatio;
                bitmap1[i].scaleY = ratio*sratio*imageRatio;

                bitmap1[i].rotation = angle;
                bitmap1[i].x = pos[0]*sratio*imageRatio;
                bitmap1[i].y = pos[1]*sratio*imageRatio;            
            }
        }

        return [bitmap, bitmap1];
    }
    ,stopLoadingAnimation:function()
    {
        var t = this;
        $("#player .loading-box").hide();
        t.anim.stop();
    }
    ,startLoadingAnimation:function()
    {
    //console.log("startAnimation");
        var t = this;
        t.anim = new Animation();
        var canvasElement = document.getElementById("loading-anim");
        var file = Config.basepath + "images/common/sprites.png";
        var frames = [
            // x, y, width, height, imageIndex*, regX*, regY*
[2078,376,209,376,0,-94,-144]
,[2078,0,209,376,0,-94,-144]
,[1641,1482,227,327,0,-68,-193]
,[1642,1094,226,335,0,-85,-185]
,[1850,1809,217,330,0,-78,-190]
,[1623,1860,227,378,0,-73,-142]
,[1414,1482,227,378,0,-73,-142]
,[1867,0,211,321,0,-85,-199]
,[2067,1615,210,328,0,-86,-192]
,[1166,1899,211,239,0,-85,-281]
,[344,376,289,376,0,-40,-144]
,[344,0,290,376,0,-40,-144]
,[1868,1264,210,351,0,-85,-169]
,[2062,2139,212,351,0,-85,-169]
,[1850,2139,212,351,0,-85,-169]
,[2274,1943,205,376,0,-91,-144]
,[2079,752,206,376,0,-90,-144]
,[1867,321,211,338,0,-85,-182]
,[1868,985,211,279,0,-85,-241]
,[1623,2238,210,219,0,-86,-301]
,[1414,1094,228,388,0,-78,-160]
,[1147,2159,242,295,0,-75,-225]
,[1413,0,229,344,0,-77,-176]
,[1413,344,229,332,0,-77,-188]
,[613,1518,286,358,0,-36,-162]
,[899,1466,267,231,0,-55,-289]
,[880,2234,267,231,0,-55,-289]
,[899,1697,267,231,0,-55,-289]
,[899,1928,267,231,0,-55,-289]
,[1163,380,250,337,0,-71,-183]
,[911,380,252,345,0,-51,-175]
,[911,0,254,380,0,-73,-140]
,[1168,717,241,372,0,-68,-148]
,[2078,1264,207,277,0,-86,-243]
,[343,782,291,368,0,-47,-152]
,[315,1564,298,374,0,-44,-146]
,[0,1564,315,382,0,-35,-138]
,[0,0,344,384,0,-13,-136]
,[0,782,343,384,0,-13,-136]
,[634,690,277,314,0,-50,-206]
,[2285,752,202,406,0,-91,-142]
,[2285,1158,202,378,0,-91,-142]
,[1867,659,211,326,0,-85,-194]
,[911,725,211,275,0,-85,-245]
,[901,1235,211,223,0,-85,-297]
,[613,1876,286,358,0,-36,-162]
,[901,1004,267,231,0,-55,-289]
,[634,1235,267,231,0,-55,-289]
,[634,1004,267,231,0,-55,-289]
,[613,2234,267,231,0,-55,-289]
,[1389,1899,234,377,0,-75,-143]
,[1409,717,234,377,0,-75,-143]
,[1643,359,224,390,0,-78,-130]
,[1643,749,224,328,0,-78,-192]
,[1642,0,225,359,0,-78,-161]
,[2277,1541,203,267,0,-90,-253]
,[343,1150,291,368,0,-47,-152]
,[315,1938,298,374,0,-44,-146]
,[0,1946,315,382,0,-35,-138]
,[0,384,344,398,0,-13,-122]
,[0,1166,343,398,0,-13,-122]
,[1165,0,248,362,0,-58,-188]
,[0,2465,1,1,0,2,2]
,[634,0,277,314,0,-50,-206]
,[633,376,277,314,0,-50,-206]
,[1166,1235,248,332,0,-58,-188]
,[1166,1567,248,332,0,-58,-188]
         ];
        var animations = {
            walk: {
                frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
            }
        }
        $("#player .loading-box").show();
        t.anim.start(canvasElement, file, frames, animations, "walk", 1.0, 6);
    }
});





