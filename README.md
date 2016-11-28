# daguo的工具库
![toolkit](https://travis-ci.org/shudery/toolKit.svg?branch=master)  ![license](https://camo.githubusercontent.com/3f7996bf7bd441deb7199c498aaa835164dee8da/68747470733a2f2f696d672e736869656c64732e696f2f6475622f6c2f766962652d642e737667)

这个仓库收集存放了一些我平时开发常用的方法函数，慢慢积累，不断提高开发效率！

- injection
- extend
- getPath
- tryBlock
- log
- clone
- queryStr
- queryPrase

#### injection(module, ...or [module,alias])
模块注入器
```
var fs = require('fs');
var http = require('http');
var exp = require('express');
// 简写为
var inject = require('daguo').injection;
inject('fs','http',['express','exp'])
```

#### extend(base, ext, isUpdate, isPoint)
传入的参数分别为基本对象，扩展对象，是否更新，是否传递指针，不更新将只添加扩展对象中基本对象没有的属性，传递指针则修改后的对象将影响原对象。
```
var base = {name:'daguo',age:22};
var ext = {age:21,sex:'boy'};
// 不更新原对象的属性
var obj = extend(base,ext);
//{name:'daguo',age:22,sex:'boy'};
// 更新属性
var obj = extend(base,ext,true);
//{name:'daguo',age:21,sex:'boy'};
```