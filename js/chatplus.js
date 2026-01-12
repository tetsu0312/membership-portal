(function(){
var w=window,d=document;
var s="https://app.chatplus.jp/cp.js";
d["__cp_d"]="https://app.chatplus.jp";
d["__cp_c"]="c0632e38_92";
  // ✅ sessionStorage から直接読む
  d["__cp_p"] = {
    "chatName": sessionStorage.getItem("chatName") || "",
    "chatEmail": sessionStorage.getItem("chatEmail") || "",
  };
  d["__cp_f"] = {
    "会員番号": sessionStorage.getItem("memberNo") || "",
    "誕生日": sessionStorage.getItem("birthday") || "",
  };
var a=d.createElement("script"), m=d.getElementsByTagName("script")[0];
a.async=true,a.src=s,m.parentNode.insertBefore(a,m);})();