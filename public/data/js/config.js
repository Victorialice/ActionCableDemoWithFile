Config = {
    basepath:"/data/"
//    ,datapath:"http://oc1jg6se3.bkt.clouddn.com/data/movie1024/"
    ,datapath:"/data/movie1125/"
    ,uploadpath:"/uploads/"
    ,chknetworkbasePath:"http://oc1jg6se3.bkt.clouddn.com/data/movie/high/0201/"
    ,loadImages:["common/back_txt.png","common/brown_line.png","common/cookie_l.png","common/cookie_r.png","common/cross_arrow.png","common/face_frame.png","common/heart1.png","common/loading.png","common/ok_txt.png","common/ok_txt_disabled.png","common/okma.png","common/photoedit_title.png","common/pinch.png","common/pink_back.png","common/pink_dot.png","common/pink_dot_float_back.png","common/tap_number_1.png","common/title_line.png","common/upload_btn_txt.png","common/upload_cut.png","common/upload_title.png","common/wave.png","common/sprites.png","common/number_sprites.png"]
    ,imagePath:"d0000.jpg"
    ,imageSizeLeader:"1320"//KB
    ,imageSizeMember:"690"//KB
    ,length:60000
    ,interval:1000
    ,openingFrame:132
    ,videoFrames:[458,458,458,458,458,458,458,458]
    ,messageFrames:[130,130,130,130,130,130,130,130]
    ,imageOriginalWidth:750
    ,shareUrl:"/share.html"
    ,errorUrl:"/error.html"
    ,topUrl:"/"
    ,pcUrl:"/pc/"
    ,leaderUrl:"/leader.html"
    ,timeout:60000
//    ,timeout:600000
    ,snsTitle:"特别活动"
    ,snsDesc:"活动内容"
    ,snsImgUrl:"http://glico-qiao2016.com/data/images/sns.png"
    ,snsUserTitle:"特别活动U"
    ,snsUserDesc:"活动内容U"
    ,snsUserImgUrl:"http://glico-qiao2016.com/data/images/sns-user.png"
    ,lock:false
    ,password:"P4kx6HJS"
}
if(Config.lock)
{
    Config.topUrl = Config.topUrl + "?pass="+Config.password;
    Config.pcUrl = Config.pcUrl + "?pass="+Config.password;
    Config.leaderUrl = Config.leaderUrl + "?pass="+Config.password;    
}
