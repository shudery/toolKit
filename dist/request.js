const https = require('https');
const superagent = require('superagent');
const url = 'https://www.instagram.com/explore/tags/got7/?hl=zh-cn';
https.get(url, (res) => {
    let html = ''

    res.on('data', function(chunk) {
        html += chunk;
    });
    res.on('end', function() {
	var content = html;
	var pics = content.match(/"https:.*?\.jpg\?.*?"/g)
	console.log(pics)
    });
})

// superagent.get(url).end((err,res)=>{
// 	err && console.log(err);
// 	var content = res.text;
// 	var pics = content.match(/"https:.*?\.jpg\?.*?"/g)
// 	console.log(pics)
// })

/**
 * Created by IBM on 2016/3/17.
 */

//  var http = require('http');

//     var querystring = require('querystring')
//     var postData = querystring.stringify({
//     'content':"haha",
//     'cid':8837
// })

//     var option = {
//     hostname:'www.imooc.com',
//         port:80,
//         path:'/course/docomment',
//         method:'POST',
//         headers:{
//              'Accept':'application/json, text/javascript, */*; q=0.01',
//              'Accept-Encoding':'gzip, deflate',
//              'Accept-Language':'zh-CN,zh;q=0.8',
//              'Connection':'keep-alive',
//              'Content-Length':postData.length,
//              'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
//              'Cookie':'',
//              'Host':'www.imooc.com',
//              'Origin':'http://www.imooc.com',
//              'Referer':'http://www.imooc.com/video/8837',
//              'User-Agent':'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.154 Safari/537.36 LBBROWSER',
//              'X-Requested-With':'XMLHttpRequest'
//         }
// }
// var req =http.request(option,function(res){
//     console.log('Status'+res.statusCode)
//     console.log('headers'+JSON.stringify(res.headers))
//     res.on('data',function(chunk){
//         console.log(typeof chunk)
//     });
//     res.on('end',function(){
//         console.log('OK')
//     });

// });
// req.on('error',function(e){
//     console.log('error:'+ e.message)
// })
// req.write(postData);
// req.end();
