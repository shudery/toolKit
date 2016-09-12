/**2016/9/9 @daguo
 * toolkit
 * tools for developing quickly
 * 
 * node:
 * getPath
 * queryStr
 * 
 * dev:
 * tryBlock,
 * extend
 * 
 * constructor:
 * VerArray
 */

/**
 * 更新、扩展对象属性
 * 依赖：clone深复制
 * @param  {[type]}  base     需扩展对象
 * @param  {[type]}  add      素材
 * @param  {Boolean} isUpdate false扩展对象，不更新，true只更新对象，不扩展属性
 * @return {[type]}           
 */
function extend(base, add, isUpdate) {
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

function queryStr(obj) {
    let arr = [];
    for (let i in obj) {
        arr.push(i + '=' + obj[i]);
    }
    return '?' + arr.join('&');
}

/**
 * 遍历目录
 * @param  [string] 遍历根节点
 * @return [array] 返回所有文件路径
 */
function getPath(path) {
    if (!isString(path)) {
        console.log('expecting a string!');
        return;
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
function tryBlock(string) {
    if (!isString(string)) {
        console.log('expecting a string!');
        return;
    }
    try {
        eval(string);
    } catch (e) {
        console.log('throw error form tryBlock:' + e)
        return e;
    }
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

//Predicate Function
typeof isString === 'function' && (isString = function(target) {
    return typeof target === 'string' ? true : false;
})

typeof isArray === 'function' && (isArray = function(target) {
    return Object.prototype.toString.call(target) === '[object Array]';
})

typeof isObject === 'function' && (isObject = function(target) {
    return typeof target === 'object' && !isArray(target) && target !== null;
})




const toolkit = {
    extend,
    getPath,
    tryBlock,
    queryStr,
    VerArray,
}

module.export = toolkit;
