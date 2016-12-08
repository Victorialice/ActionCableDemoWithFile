var Common = Class.get({
    start:null
    ,initialize:function(obj){
    }
    //通信速度チェック
    
    ,checkNetwork:function(ref)
    {
        console.log("checkNetwork");
        var t = this;
        var start = new Date().getTime();
        var img = $('<img/>');
        img.appendTo("body");
        var onImgLoad = function(img, callback){
            img.each(function(){
                if (/*this.complete || */ $(this).height() > 0) {
//                    console.log("chached ["+this.complete+"]["+$(this).height()+"]");
                    callback.apply(this, [true]);
                }
                else 
                {
                    $(this).on('load', function(){
                        callback.apply(this, [false]);
                    });
                }
            });
        };
        onImgLoad(img, function(chached){
            img.remove();
            if(chached)
            {
                window.location.href = Config.errorUrl+"?code=F00004";
                return;
            }
            console.log("loaded");
            var data = {};
            var end = new Date().getTime();
            time = (end - start)/1000;
            var speed = Config.imageSize/time*8;
            data.time = time;
            data.speed = speed;
            data.network = t.getTypeBySpeed(speed);
            t.trigger("check_network_success", data);
        });
        var dt = new Date().getTime()
        img.attr({'src' : Config.chknetworkbasePath+Config.imagePath+"?dt="+dt.toString()});
    }
    ,getTypeBySpeed:function(speed)
    {//KB
//return "4";
        if(speed<750) return "0";
        if(speed<1500) return "1";
        if(speed<3000) return "2";
        if(speed<10000) return "3";
        return "4";
    }
    ,getQueryString:function()
    {
        if (document.location.search.length > 1)
        {
            var query = document.location.search.substring(1);
            var parameters = query.split('&');
            var result = new Object();
            for(var i = 0; i < parameters.length; i++)
            {
                var element = parameters[i].split('=');
                var paramName = decodeURIComponent(element[0]);
                var paramValue = decodeURIComponent(element[1]);
                result[paramName] = decodeURIComponent(paramValue);
            }
            return result;
        }
        return null;
    }
    ,zeroPad:function(n) 
    {
        if(n<10) return "000"+n.toString();
        if(n<100) return "00"+n.toString();
        if(n<1000) return "0"+n.toString();
        return n.toString();
    }
    ,getFrameRate:function(network)
    {
//        if(network=="0") return 6;
        if(network=="0" || network=="1" || network=="2") return 6;
        return 12;
    }
    ,getMaxConnections:function(network)
    {
        if(network=="0") return 3;
        return 5;        
    }
    ,getOpeningPath:function(path, network)
    {
//        var path = basepath+"movie1024/";
        if(network=="0" || network=="1") path += "low/";
        if(network=="2" || network=="3") path += "mid/";
        if(network=="4") path += "high/";
        return path+"opening/";
    }
    ,getBasePath:function(path, network, total_users, turn_id)
    {
//        var path = basepath+"movie1024/";
        if(network=="0" ||network=="1") path += "low/";
        if(network=="2" || network=="3") path += "mid/";
        if(network=="4") path += "high/";
        path += "0"+total_users.toString();
        path += "0"+turn_id + "/";
        return path;
    }
    ,maekLoading:function(loadManifest, minFrame, maxFrame, openingFrame, message_id, fps, openingpath, basepath, loadTimeout, videoFrame, messageFrame)
    {
        var step = (12/fps), _src, _id;
        var ndx = minFrame;
        var prefix = "a";
        var maxIndex = 0;
        maxIndex = openingFrame-1;
        for (var i = minFrame; i < maxFrame; i=i+step) 
        {
            if(ndx > maxIndex) 
            {
                ndx = 0;
                if( prefix == "a") 
                {                
                    prefix = "d";
                    maxIndex = videoFrame-1;
                }
                else if( prefix == "d")
                {
                    prefix = "m";
                    maxIndex = messageFrame-1;
                }
            }
            _id = prefix + this.zeroPad(ndx);
            if(prefix == "a")
            {
                _src = openingpath + _id + ".jpg";                
            }
            if(prefix == "d")
            {
                _src = basepath + _id + ".jpg";                
            }
            if(prefix == "m")
            {
                if(parseInt(message_id)<10)
                    _src = basepath + "message/0" + message_id + "/" + _id + ".jpg";
                else
                    _src = basepath + "message/" + message_id + "/" + _id + ".jpg";
            }
            loadManifest.push({src: _src, id: _id, loadTimeout:loadTimeout});                
            ndx += step;
        }        
    }
    ,loadAssets:function(imageNames)
    {
        var t = this;
        var assets = [];
        var loadManifest = [];
        var loadTimeout = Config.timeout;
        loader = new createjs.LoadQueue(false);
        loader.installPlugin(createjs.Sound);
        loader.setMaxConnections(5);
        $.each(imageNames, function(i, val){
            if(val=="bgm.mp3")
            {
                //loadManifest.push({src: Config.basepath+"mp3/"+val, id: val, loadTimeout:loadTimeout});                
            }
            else
            {
                loadManifest.push({src: Config.basepath+"images/"+val, id: val, loadTimeout:loadTimeout});                
            }
        });
        loader.loadManifest(loadManifest, false);
        loader.addEventListener("progress", progressHandler);
        loader.addEventListener("fileload", fileloadHandler);
        loader.addEventListener("complete", completeHandler);
        loader.addEventListener("error", errorHandler);
        loader.load();        
        function progressHandler(event) 
        {
            var progress = Math.floor(event.progress * 100);
            t.trigger("load_progress", {progress:progress});
        }
        function fileloadHandler(event) 
        {
            var item = event.item;
            t.trigger("fileload", {item:event.item, result:event.result});
        }
        function completeHandler(event) 
        {
//            console.log("complete");
            loader.removeEventListener("progress", progressHandler);
            loader.removeEventListener("fileload", fileloadHandler);
            loader.removeEventListener("complete", completeHandler);
            loader.removeEventListener("error", errorHandler);
            t.trigger("load_complete");
        }
        function errorHandler(event)
        {
            console.log(event.title);
            t.dump(event.data);
        }
    }
    ,jumpShow:function(target, height, time, cssElement, value)
    {
        var t = this;
        if(cssElement==null) cssElement = "marginTop";
        if(height==null) height = $(document).height();
        if(time==null) time = 500;
        if(value==null) value = 50;
        var to = $(target).css(cssElement);
        if(to.indexOf("%")!=-1)
        {
            to = parseFloat(to);
            to = parseInt(height*to/100);
            var from = parseInt(to)+value;
        }
        else
        {
            to = parseInt(to);
            var from = parseInt(to)+value;
        }
        var opt = {};
        opt[cssElement] = from+"px";
        opt.opacity = 0.0;
        $(target).css(opt);
        opt = {};
        opt[cssElement] = to+"px";
        opt.opacity = 1.0;
        $(target).show().delay(10).animate(
            opt,time,"easeOutBack",function(){
            t.trigger("show_complete")
        });
    }
    ,hideAll:function(targets, heights)
    {
        var t = this;
        var cnt = 0, max = targets.length;
        $.each(targets, function(i, elm){
            t.on("hide_complete", function(e){
//                console.log("hide_complete")
                t.off(e);
                if(cnt >= max-1)
                {
                    t.trigger("hide_all_complete")
                }
                cnt++;
            });
            if(heights != null)
                t.hide(targets[i], heights[i]);
            else
                t.hide(targets[i]);
        });
    }
    ,hide:function(target, height)
    {
        var t = this;
        var from = $(target).css("marginTop");
        if(height==null) height = $(document).height();
        if(from.indexOf("%")!=-1)
        {
            from = parseFloat(from);
            from = parseInt(height*from/100);
            var to = parseInt(from)+50;
        }
        else
        {
            from = parseInt(from);
            var to = parseInt(from)+50;
        }
        $(target).show().delay(10).animate({"marginTop":to+"px", "opacity":0.0},250,null,function(){
            $(this).css("marginTop", from).hide();
            t.trigger("hide_complete")
        });        
    }
    ,changeStep:function(val)
    {
        $("#step ul li").each(function(i, elemnet){
            if($(this).attr("name") == val)
            {
               $(this).removeClass("off").addClass("on");
            }
            else
            {
               $(this).removeClass("on").addClass("off");
            }
        });
    }
    ,scaleAnimation:function(target)
    {
        var t = this;
        var speed = 1000;
        $(target).css({opacity:'1.0'}).animate({opacity:'0.0'},speed, "easeInCubic");

        $({scale:1.0}).animate({scale:4.0}, {
            duration:speed,
            easing:"easeInCubic",
            // 途中経過
            progress:function() {
                $(target).css({
                    transform:'scale(' + this.scale + ')'
                });
            },
            // アニメーション完了
            complete:function() {
                setTimeout(function(){
                    t.trigger("scale_animation_compelte");
                    $(target).css({
                        transform:'scale(1.0)'
                    }).animate({opacity:'1.0'},1000);
                },500)
            }
        });
    }
    ,baloonAnimation:function(target)
    {
        var t = this;
        var speed = 500;
        $(target).show().css({opacity:'0'}).animate({opacity:'1.0'},speed, "linear");
        $(target).css({
            transform:'scale(0.2)'
        });

        $({scale:0.2}).animate({scale:1.0}, {
            duration:speed,
            easing:"easeOutBack",
            // 途中経過
            progress:function() {
                $(target).css({
                    transform:'scale(' + this.scale + ')'
                });
            },
            // アニメーション完了
            complete:function() {
            }
        });
    }
    ,scaleUp:function(target, from, to, speed)
    {
        var t = this;
        $({scale:from}).animate({scale:to}, {
            duration:speed,
            easing:"easeOutBack",
            // 途中経過
            progress:function() {
                $(target).css({
                    transform:'scale(' + this.scale + ')'
                });
            },
            // アニメーション完了
            complete:function() {
                t.trigger("scale_complete");
            }
        });
    }
    ,loadImage:function(url)
    {
        var t = this;
        var img = new Image();
        img.onload = function(){
            t.trigger("load_complete");
        }
        img.src = url;
    }
    ,dump:function(data)
    {
        for(key in data)
        {
            console.log(key + "=" + data[key]);            
        }
    }
});
var Loading = Class.get({
    com:null
    ,initialize:function(com)
    {
        this.com = com;
    }
    ,start:function(imageNames)
    {
        console.log("loading start");
        $("body").css("overflow-y", "hidden");
        var t = this;
        var interval = 500;
        var mskw = Math.floor((42/2) / 3);
        var defw = $("#loading .loading-item").width();
        var cnt = 1;
        var intervalId;
        var flg = false;
        var animflg = false;
        t.com.on("show_complete", function(e){
            t.com.off(e);
            t.com.on("load_complete", function(e, data){
                t.com.off(e);
                flg = true;
                if(animflg && flg) complete();
            });
            intervalId = setInterval(progress, interval)
            t.com.loadAssets(imageNames);
            t.trigger("loading_start");    
        });
        function progress()
        {
            $("#loading .loading-item").width(defw+mskw*cnt);
//            console.log("."+cnt);
            cnt++;
            if(cnt>3) 
            {
                cnt = 0;
                animflg = true;
                if(animflg && flg) complete();
            }
        }
        function complete()
        {
            clearInterval(intervalId);
            t.com.on("hide_complete", function(e){
                t.com.off(e);
                $("#loading .loading-item").width(defw);
//                flg = true;
            $("body").css("overflow-y", "auto");
                t.trigger("loading_complete");    
            });
            t.com.hide("#loading .loading-item");
        }
        setTimeout(function(){
            t.com.jumpShow("#loading .loading-item",null,null,null,200);
        },500);
    }
});

var Loading2 = Class.get({
    com:null
    ,flg:false
    ,animflg:false
    ,intervalId:null
    ,initialize:function(com)
    {
        this.com = com;
    }
    ,stop:function()
    {
        this.flg = true;
        if(this.animflg && this.flg) this._complete("by stop");
    }
    ,start:function()
    {
        console.log("loading2 start");
        var t = this;
        var interval = 500;
        var mskw = Math.floor((42/2) / 3);
        var defw = $("#loading .loading-item").width();
        var cnt = 1;
        var flg = false;
        var animflg = false;
        t.com.on("show_complete", function(e){
            t.com.off(e);
            t.intervalId = setInterval(progress, interval)
            function progress()
            {
                $("#loading .loading-item").width(defw+mskw*cnt);
    //            console.log("."+cnt);
                cnt++;
                if(cnt>3) 
                {
                    cnt = 0;
                    t.animflg = true;
                    if(t.animflg && t.flg) t._complete("by cnt");
                }
            }
        });
        t.com.jumpShow("#loading .loading-item");
    }
    ,_complete: function(val)
    {
        console.log("Loading2 _complete "+val);
        var t = this;
        clearInterval(t.intervalId);
        t.com.on("hide_complete", function(e){
            t.com.off(e);
            t.trigger("loading_complete");    
        });
        t.com.hide("#loading .loading-item");
    }
});
var QueueHandler = Class.get({
    queue:[]
    ,doing:false
    ,target:null
    ,method:null
    ,eventName:null
    ,add:function(target, method, eventName)
    {
        var t = this;
        t.target = target;
        t.method = method;
        t.eventName = eventName;
    }
    ,push:function(param)
    {
        var t = this;
        var d = new Date();
        var id = d.getTime().toString();
        t.queue.push({"param":param, "id":id});
        if(!t.doing)
        {
            var obj = t.queue.shift();
            t._apply(obj.param);
            return;
        }
    }
    ,_apply:function(param)
    {
        var t = this;
        t.target.on(t.eventName, function(e){
            t.target.off(e);
            if(t.queue.length>=1)
            {
                var obj = t.queue.shift();
                t._apply(obj.param);
                return;
            }
            t.doing = false;
        });
        t.method.apply(t.target, param);
        t.doing = true;
    }
});













