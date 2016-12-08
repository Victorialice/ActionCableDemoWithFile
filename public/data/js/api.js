var API = Class.get({
    basePath:"/api/"
    ,socket:null
    ,gid:null
    ,uid:null
    ,qrHtml:'<table><tbody><tr><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td></tr><tr><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td></tr><tr><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td></tr><tr><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td></tr><tr><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td></tr><tr><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td></tr><tr><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td></tr><tr><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td></tr><tr><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td></tr><tr><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td></tr><tr><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td></tr><tr><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td></tr><tr><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td></tr><tr><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td></tr><tr><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td></tr><tr><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td></tr><tr><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td></tr><tr><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td></tr><tr><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td></tr><tr><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td></tr><tr><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td></tr><tr><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td></tr><tr><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td></tr><tr><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="black"></td><td class="black"></td><td class="white"></td><td class="white"></td><td class="black"></td><td class="white"></td></tr></tbody></table>'
    ,connected:false
    ,initialize:function(obj)
    {
    }
    ,init:function(obj)
    {
        var t = this;
//console.log("obj.leader="+obj.leader+ " gid="+obj.gid);
        if(!(obj && obj.leader))
        {
            t.gid = obj.gid
        }
        t.trigger("init_complete",{});            
    }
    ,_get:function(method, data)
    {
        var defer = $.Deferred();
        $.ajax({
            url: this.basePath+method+".json",
            type: 'GET',
            data: data,
            dataType: 'json',
            success: defer.resolve,
            error: defer.reject,
            timeout: Config.timeout
        });
        return defer.promise();
    }
    ,_post:function(method, data, posImage)
    {
        var defer = $.Deferred();
        var opt = {}
        opt = {
                url: this.basePath+method+".json",
                type: 'POST',
                data: data,
                dataType: 'json',
                success: defer.resolve,
                error: defer.reject,
                timeout: Config.timeout
        };
        if(posImage)
        {
            opt.processData = false
            opt.contentType = false
        }
        $.ajax(opt);
        return defer.promise();
    }
    ,connection:function()
    {
console.log("connection");
        var t = this;
        App.drift = App.cable.subscriptions.create({
            channel: "DriftChannel",
            user_id:  t.uid
        }, 
        {
            connected: function() 
            {
console.log("connected!");
//alert("connected!")
                t.connected = true;
                t.trigger ("connection_success");
            },
            disconnected: function() 
            {
console.log("disconnected!");
//alert("disconnected!")
            },
            received: function(data) 
            {
//alert("received")
var log = "";
for(key in data.data)
{
    log += (" ["+key + "]=" + data.data[key]);            
}
console.log("[ws]status="+data.data.status+" data:"+log);
                t.trigger(data.data.status, data.data);
            },
            move: function(socket_name, args) 
            {
console.log("[ws]socket_name="+socket_name+" args="+args);
                return this.perform('move', {
                        socket_name: socket_name,
                        args: args
                });
            }
        });
    }
    ,disconnect:function()
    {
        App.cable.disconnect();
    }
    //同時接続チェック  
    ,checkConnections:function()
    {
//console.log("getGid");
        var t = this;
//        this._get("check_connections").then(function(data){
        this._get("check_connection").then(function(data){
            if(data.error_code && data.error_code != "")
            {
                t.trigger("check_connections_failed", data.error_code);
                window.location.href = Config.errorUrl+"?code=F00001";
                return;
            }
            t.trigger("check_connections_success", data);
        },function(){
//console.log("get_gid failed");
            console.log("check_connections failed");
            window.location.href = Config.errorUrl+"?code=F00002";
        });
    }
    //画像アップロード
    ,uploads:function(file, user)
    {
        if(user == "2" && this.gid == null) 
        {
            throw new Error("no gid");
            return;            
        }
//console.log("uploads file.length="+file.length+" user="+user+" gid="+this.gid);
        var t = this;
        var fd = new FormData();
        fd.append('file', file);
        fd.append('user', user);
        if(user!="1") fd.append("gid", this.gid);
        this._post("uploads", fd, true).then(function(data){
            if(data.error_code && data.error_code != "")
            {
                t.trigger("uploads_failed", data.error_code);
                return;
            }
            if(user == "3")
            {
                t.trigger("uploads_share_success", data);
                return;
            }
//console.log("uploads gid="+data.gid+" uid="+data.uid+" qrHtml.length"+data.qrHtml.length);
            t.uid = data.uid;
            t.gid = data.gid;
            t.qrHtml = data.qrHtml;
            t.trigger("uploads_success", data);
        },function(){
            console.log("uploads failed");
            window.location.href = Config.errorUrl+"?code=F00003";
        });
    }
    //メッセージ
    ,setMessage:function(message)
    {
        var t = this;
        if(this.gid == null) 
        {
            throw new Error("no gid");
            return;            
        }
//console.log("message message="+message);
        this._post("message", {message_id:message, gid:t.gid}).then(function(data){
            t.trigger("message_success", data);
        },function(){
//console.log("message failed");
        });
    }
    //通信速度
    ,userNetwork:function(network)
    {
        if(this.gid == null) 
        {
            throw new Error("no gid");
            return;            
        }
        if(this.uid == null) 
        {
            throw new Error("no uid");
            return;            
        }
//console.log("userNetwork network="+network);
        var t = this;
        var params = [t.gid, t.uid, network];
        App.drift.move("user_network", params);
    }
    //アップロード締め切り
    ,userUploadClose:function()
    {
        if(this.gid == null) 
        {
            throw new Error("no gid");
            return;            
        }
//console.log("userUploadClose");
        var params = [this.gid];
        App.drift.move("user_upload_close", params);
    }
    //N順通知
    ,userTurn:function()
    {
        if(this.gid == null) 
        {
            throw new Error("no gid");
            return;            
        }
        if(this.uid == null) 
        {
            throw new Error("no uid");
            return;            
        }
//console.log("userTurn uid="+this.uid);
        var params = [this.gid,this.uid];
        App.drift.move("user_turn", params);
    }
    //順番リセット
    ,userTurnReset:function()  
    {
        if(this.gid == null) 
        {
            throw new Error("no gid");
            return;            
        }
//console.log("userTurnReset");
        var params = [this.gid];
        App.drift.move("user_turn_reset", params);
    }
    //ローディングスタート    
    ,loadingStart:function(total_ms, update_ms, replay)
    {
        if(this.gid == null) 
        {
            throw new Error("no gid");
            return;            
        }
//console.log("loadingStart total_ms="+total_ms+" update_ms="+update_ms+" replay="+replay );
        var params = [this.gid, total_ms, update_ms, replay];
        App.drift.move("loading_start", params);
    }
    //ダウンロード完了  
    ,loadingComplete:function()
    {
        if(this.gid == null) 
        {
            throw new Error("no gid");
            return;            
        }
        if(this.uid == null) 
        {
            throw new Error("no uid");
            return;            
        }
//console.log("loadingComplete");
        var params = [this.gid,this.uid];
        App.drift.move("user_download_success", params);
    }
    //シェアボタン押下
    ,shareOk:function(type)
    {
        if(this.gid == null) 
        {
            throw new Error("no gid");
            return;            
        }
        if(this.uid == null) 
        {
            throw new Error("no uid");
            return;            
        }
//console.log("share_ok");
        var params = [this.gid,this.uid,type];
        App.drift.move("share_ok", params);
    }
});










