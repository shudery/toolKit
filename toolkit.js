/**2016/9/9 @daguo
 * toolkit
 * tools for developing quickly
 * 
 * node:
 * getPath
 * queryStr
 * queryPrase
 * 
 * dev:
 * tryBlock,
 * extend,
 * log
 * 
 * constructor:
 * VerArray
 */


//Predicate Function
typeof isString === 'undefined' && (isString = function(target) {
    return typeof target === 'string' ? true : false;
})

typeof isArray === 'undefined' && (isArray = function(target) {
    return Object.prototype.toString.call(target) === '[object Array]';
})

typeof isObject === 'undefined' && (isObject = function(target) {
    return typeof target === 'object' && !isArray(target) && target !== null;
})

typeof stringify === 'undefined' && (stringify = JSON.stringify)
typeof parse === 'undefined' && (stringify = JSON.parse)


/**
 * 更新、扩展对象属性
 * 依赖：clone深复制
 * @param  {[type]}  base     需扩展对象
 * @param  {[type]}  add      素材
 * @param  {Boolean} isUpdate false扩展对象，不更新，true只更新对象，不扩展属性
 * @return {[type]}           
 */
function extend(base, add, isUp) {
    let isUpdate = isUp || false;
    let obj = clone(base);
    for (let i in add) {
        if (i in obj) {
            isUpdate && (obj[i] = add[i]);
        } else {
            !isUpdate && (obj[i] = add[i])
        }
    }
    return obj;
}
// console.log(extend({a:1,b:2},{b:33,c:44},true))

/**
 * 拼接，解析查询字符串
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function queryStr(obj) {
    let arr = [];
    for (let i in obj) {
        arr.push(i + '=' + obj[i]);
    }
    return '?' + arr.join('&');
}

function queryPrase(str) {
    let objArr = str.split('?')[1].split('&');
    return objArr.reduce((pre, cur) => {
        pre[cur.split('=')[0]] = cur.split('=')[1];
        return pre;
    }, {})
}
/**
 * 遍历目录
 * @param  [string] 遍历根节点
 * @return [array] 返回所有文件路径
 */
function getPath(path) {
    if (!isString(path)) {
        return new TypeError('expecting a string!');
    }
    let fileList = [];
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
    /**
     * 用try包裹执行，让程序不中断
     * @param [string] 需要包裹的代码字符串
     * @return [string] catch到的错误，
     */
function tryBlock(str, msg) {
    !isString(str) && console.log('expecting a string!');
    try {
        eval(str);
    } catch (e) {
        console.log(`throw error form tryBlock:${e}\nmsg:${msg?msg:'nothing'}`)
        return e;
    }
}
/**
 * 调试打印，带标识，依赖非严格模式
 */
function log(str, flag) {
    this.count = this.count || 0;
    return (function() {
        this.count++;
        console.log(`<LOGPOINT ${flag?flag:this.count}> ${str}`)
    })();
}
/**
 * 带有记忆性的数组扩展
 * new的VerArray类型具有两个方法
 * revert可以将数组恢复到上一次调用save时的状态
 */
class VerArray extends Array {
    constructor() {
            super();
            this.history = [
                []
            ];
        }
        //存储当前数组的状态
    save() {
            this.history.push(this.slice());
        }
        //回到上一个数组版本
    revert() {
        this.splice(0, this.length, ...this.history[this.history.length - 1]);
    }
}

/**
 * 数据类型深复制，函数只复制引用
 * @param  [object]
 * @return [object]  
 */
function clone(obj) {
    //function类型属于object虽然也是引用类型，但是通常深拷贝也是直接赋值
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    //创建的新对象和原对象种类一致
    let ctr = Array.isArray(obj) ? [] : new obj.constructor;
    //保存对象的构造函数信息
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            ctr[i] = typeof obj !== 'object' ? obj[i] : clone(obj[i]);
        };
    }
    return ctr;
}




const toolkit = {
    extend,
    getPath,
    tryBlock,
    log,
    queryStr,
    queryPrase,
    VerArray,
}

module.export = toolkit;
