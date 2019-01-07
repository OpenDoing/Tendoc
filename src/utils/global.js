const config = {
  base_url: 'http://localhost:8000',
  // base_url: 'http://192.168.1.141:8000',
  image_url: 'http://localhost:8000/image/'
}

/* 获取指定cookie */
function getCookie(name) {
  var strCookie = document.cookie;
  var arrCookie = strCookie.split(";");
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split("=");
    if (arr[0].trim() === name)
      return arr[1];
  }
  return "";
}

//读取token
function checktoken() {
  if(!getCookie('token')){
    window.location.href = "/login";
    return;
  }
  return getCookie('token');
}

export {
  config,
  getCookie,
  checktoken
}

