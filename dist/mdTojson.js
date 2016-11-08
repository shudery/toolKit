var fs = require('fs');

//生成对象json文件路径
var targetPath = './datas.json'
//md文件地址
var rootPath = '/Users/shudery/web/hexo/source/_posts/'
//匹配正则
var filesRex = /.*(\.md)/
//拿到根目录所有文件，匹配出md文件路径
var allFilesPath = getFilesPath(rootPath);
var postFilesPath = allFilesPath.reduce((pre, path) => {
    filesRex.test(path) && pre.push(path);
    return pre;
}, []);
var postFilesLen = postFilesPath.length;


//任务开始前,如果当前根路径文件列表中有目标文件，则清空文件
if (allFilesPath.indexOf(targetPath) !== -1) {
    clearPostsObj(targetPath);
}

//开始读写转换任务
eval(evalStr(postFilesPath, postsToJson));


/**
 * 拼接异步执行字符串
 * @param  {Number}   num [文章数目]
 * @param  {Function} fn  [将mark类型的文章提取成一个post对象]
 * @return {String}       [异步执行的字符串]
 */
function evalStr(postFilesPath, fn) {
    var str = 'postsToJson("' + postFilesPath[0] + '")'
    for (var i = 1; i < postFilesLen; i++) {
        str += '.then(() => postsToJson("' + postFilesPath[i] + '"))'
    }
    return str;
}
/**
 * 将mark类型的文章提取成一个post对象
 * @param  {Number} num [description]
 * @return {Promise}     [description]
 */
function postsToJson(path) {
    return new Promise(function(resolve, reject) {
        var datas = fs.readFileSync(path, { encoding: 'utf8' })
        var olddatas;
        var noFileError;
        //读旧文件，解析成数组，添加一个新的post对象，然后再转为字符串
        try {
            olddatas = fs.readFileSync(targetPath, { encoding: 'utf8' })
        } catch (e) {
            console.log('there are no file:' + targetPath);
            noFileError = e;
        }
        var arr = olddatas ? JSON.parse(olddatas) : [];
        arr.push(parsePost(datas));

        //写入文件
        fs.writeFileSync(targetPath, JSON.stringify(arr));
        noFileError && console.log('create file:' + targetPath);
        console.info(path + ' write to targetPath(' + targetPath + ') success!');
        resolve();
    })
}
/**
 * 开始任务清空filename地址的文件内容
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
function clearPostsObj(filename) {
    fs.writeFileSync(filename, '')
}
/**
 * 匹配提取md文件的相应字段到对象属性中
 * @param  {[type]} postStr [description]
 * @return {[type]}         [description]
 */
function parsePost(postStr) {
    //hexo下post文章的md格式
    var matchRe = /title:(.*?)\ndate:(.*?)\ntags:(.*?)\ndescription:(.*?)\n---\n([\s\S]*)/
    var matchArr = postStr.match(matchRe);
    return {
        'header': matchArr[1],
        'time': matchArr[2],
        'tags': matchArr[3],
        'description': matchArr[4],
        'section': matchArr[5],
    }
}
/**
 * 遍历目录
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function getFilesPath(path) {
    var fileList = [];
    (function searchPath(path) {            
        //读目录所有文件
        fs.readdirSync(path).forEach((item) => {
            //获得文件信息，判断是否为文件夹
            if (fs.statSync(path + item).isDirectory()) {
                searchPath(path + item + '/');
            } else {
                fileList.push(path + item);
            }
        });
    })(path)
    return fileList;
}
