/**
 * Created by Tossapon Nuanchuay on 15/4/2559.
 */

function a(s){
    var ss = s.split("."), t, r="";
    for(var i = 0; i < ss.length; i++)
        r += (t = parseInt(ss[i]).toString(16)) <  10 ? '0'+t : t;
    return r;
}

function b(s){
    var r = "", t;
    for(var i = 0; i < s.length; i++)
        r+=(t = parseInt(s.charCodeAt(i)).toString(16)) < 10 ? '0'+t : t;
    return r;
}

function c(s){
    var r = s.toString(16)
    return r < 10 ? '0'+r : r;
}


module.exports =  {
    IpToHex : a,
    StringToHex : b,
    LengthToHex : c,
}

