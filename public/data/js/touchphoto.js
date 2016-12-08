
var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
ResizeImage = {
    resizeImage:function(file, no, element) {
        var d = new $.Deferred();
        var mpImg = new MegaPixImage(file);
        EXIF.getData(file, function() {
            var orientation = file.exifdata.Orientation;
            var mpImg = new MegaPixImage(file);        
            mpImg.render(element, { maxWidth: 480, orientation: orientation }, function() {
                var resized_img = $(element).attr('src');
                var img = new Image();
                img.onload = function()
                {
                    d.resolve(resized_img, no, element.naturalWidth);
                }
                img.src = resized_img;
            });
        });
        return d.promise();
    }
    ,adaptImage:function (image, width, height, x, y) {
        var workspace,bitmap;
        var rect = new createjs.Rectangle(x, y, width, height);
        var canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;        
        workspace = new createjs.Stage(canvas);
        bitmap = new createjs.Bitmap(image);
        bitmap.sourceRect = rect;

        // 作業場所Canvasに実際にレンダリングする
        workspace.addChild(bitmap);
        workspace.update();

        return canvas.toDataURL("image/jpeg");
    }
};
TouchPhoto = {
    el:null
    ,ticking:false
    ,transform:null
    ,mc:null
    ,START_X:0
    ,START_Y:0
    ,timer:null
    ,initScale:1
    ,init:function(element)
    {
        this.el = element
        this.mc = new Hammer.Manager(this.el);
        this.mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
        this.mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([this.mc.get('pan')]);
        this.mc.on("panstart", this.onPanStart);
        this.mc.on("pinchstart", this.onPinchStart);
        this.mc.on("panmove", this.onPan);
        this.mc.on("pinchmove", this.onPinch);
        this.resetElement();    
    }
    ,updateElementTransform:function() 
    {
        var t = TouchPhoto.transform;
        var el = TouchPhoto.el;
        var value = [
                    'translate3d(' + t.translate.x + 'px, ' + t.translate.y + 'px, 0)',
                    'scale(' + t.scale + ', ' + t.scale + ')',
                    'rotate3d('+ t.rx +','+ t.ry +','+ t.rz +','+  t.angle + 'deg)'
        ];

        value = value.join(" ");
        el.style.webkitTransform = value;
        el.style.mozTransform = value;
        el.style.transform = value;
        TouchPhoto.ticking = false;
    }
    ,requestElementUpdate:function() 
    {
        if(!TouchPhoto.ticking) {
            reqAnimationFrame(TouchPhoto.updateElementTransform);
            TouchPhoto.ticking = true;
        }
    }
    ,resetElement:function() {
        TouchPhoto.el.className = 'animate';
        TouchPhoto.transform = {
            translate: { x: TouchPhoto.START_X, y: TouchPhoto.START_Y },
            scale: 1,
            angle: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };

        TouchPhoto.requestElementUpdate();
    }
    ,onPan:function (ev) 
    {
        TouchPhoto.el.className = '';
        TouchPhoto.transform.translate = {
            x: TouchPhoto.START_X + ev.deltaX,
            y: TouchPhoto.START_Y + ev.deltaY
        };

        TouchPhoto.requestElementUpdate();
    }
    ,onPanStart:function (ev) 
    {
        TouchPhoto.START_X = TouchPhoto.transform.translate.x;
        TouchPhoto.START_Y = TouchPhoto.transform.translate.y;
    }
    ,onPinchStart:function (ev) 
    {
        TouchPhoto.initScale = TouchPhoto.transform.scale
    }
    ,onPinch:function (ev) 
    {
        TouchPhoto.el.className = '';
        TouchPhoto.transform.scale = TouchPhoto.initScale * ev.scale;

        TouchPhoto.requestElementUpdate();
    }
    ,calculatePosition:function (width, height, defX, defY)
    {
        var ret = {x:0,y:0};
        var t = TouchPhoto.transform;
        ret.x = (t.translate.x-defX-((width*t.scale-width)/2))*1/t.scale;
        ret.y = (t.translate.y-defY-((height*t.scale-height)/2))*1/t.scale;
        return ret;
    }
};