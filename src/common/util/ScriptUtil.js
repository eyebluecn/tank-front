
//动态往head中添加一个js脚本文件。
export function insertScript(jsUrl) {

  let script = document.createElement('script');
  script.setAttribute("type","text/javascript");
  script.setAttribute("src", jsUrl);
  document.getElementsByTagName("head")[0].appendChild(script);

}
