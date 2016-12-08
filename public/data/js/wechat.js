var isWechatReady = false;
function insertWechatJS(url)
{
	var a, m;
	a=document.createElement("script");
	m=document.getElementsByTagName("script")[0];
	a.async=1;
	a.src=url;
	m.parentNode.insertBefore(a, m);
}
function setConfig() {
	insertWechatJS("/wechat/share.js?current_url="+window.location.href);
	wx.ready(function () {
		isWechatReady = true;
		updateShareData(Config.snsTitle, Config.snsDesc, window.location.href, Config.snsImgUrl);
//        console.log("isWechatReady");
	});
}
var intervalID = setInterval(function(){
	if(typeof(wx)=="undefined") return;
	clearInterval(intervalID);
	setTimeout(function(){ setConfig(); },2000);
},100);
function checkJsApi() {
//	alert("checkJsApi");
 wx.checkJsApi({
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
      ],
      success: function (res) {
        alert(JSON.stringify(res));
      }
    });
}
function updateShareData(title, desc, link, imgUrl) 
{
console.log("title=" + title + " desc=" + desc + " link=" + link + " imgUrl=" + imgUrl);
	if(!isWechatReady) return false;
	var shareData = {
	    title: title,
	    desc: desc,
	    link: link,
	    imgUrl: imgUrl
	  };
	wx.onMenuShareAppMessage(shareData);
	wx.onMenuShareTimeline(shareData);
	return true;
}
