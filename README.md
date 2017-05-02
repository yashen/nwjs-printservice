Use nw.js render html content and silent print,

Is used the feature 
<https://github.com/nwjs/nw.js/issues/1263>

To silent print,you should use *nw –kiosk-printing* start it

# 提交打印请求 

config.js中配置了打印服务的端口
```
var config = {
	"port":8081,
	"websocket-port":8082
}

```
其中websocket-port是内部通信用的，保证这个端口不被其他使用即可

启动服务后，在配置的端口上接收http打印请求,请求的格式如下

POST http://ip:port/print/:pluginName，内容是任意的json格式

# 处理打印请求

根据打印请求的名称,载入相应plugins/pluginName下的插件来打印,

默认提供了json插件，把传入的数据格式化为json打印 

plugins/json.js

```
var printToHtml = function(data){
    return JSON.stringify(data);
}

exports.default = printToHtml;

```

使用者可以根据自己的需求来定制自己的打印插件，常见的方式是使用Javascript模板引擎库






