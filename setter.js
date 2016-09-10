/**
 * 数据绑定，类似vue
 * 用setter将数据操作和视图渲染绑定在一起，同时将指定位置的值通过事件绑定，同步到模板对应的位置。
 */


const due = new Due({
    name: 'app',
    datas: {
        first: '1',
        second: '2',
    }
});
//绑定数据
wrapDatas = bindSetter(due.node, due.template, due.datas);
//绑定事件
bindtoNode(due.node, wrapDatas)

function Due(options) {
    this.node = document.getElementById(options.name);
    this.template = this.node.outerHTML;
    this.datas = options.datas;
}


/**
 *   查找节点中的bindto属性，通过事件绑定到相应的模板位置，
 *   待解决：每次render之后绑定的onchange事件就没了
 * @param  {[type]} node [查询结点]
 * @return {[type]}      [description]
 */
function bindtoNode(node, wrapDatas) {
    let target = node;
    if (target.hasChildNodes) {
        target.childNodes.forEach((val) => {
            //元素结点
            if (val.nodeType === 1) {
                let bindto = val.getAttribute('bindto')
                if (bindto) {
                    //绑定事件，获取value,赋值同时重新渲染view
                    val.onchange = function(e) {
                        wrapDatas[bindto] = val.value;
                    }
                }

                bindtoNode(val, wrapDatas)
            }
        })
    }
}
/**
 *  将数据修改的操作与渲染视图操作通过setter绑定
 * @param  {[type]} domNode  [dom结点]
 * @param  {[type]} template [原始模板]
 * @param  {[type]} datas    [原始datas]
 * @return {[type]} wrapDatas[setter处理的datas]
 */
function bindSetter(domNode, template, datas) {
    let wrapDatas = {};
    for (let n in datas) {
        let buf = '_' + n;
        wrapDatas[buf] = datas[n];
        Object.defineProperty(wrapDatas, n, {
            set: function(val) {
                console.log('<setter:>' + buf + ':' + wrapDatas[buf] + '->' + val + ',view rerendering...')

                //数据更改时同步更新view
                wrapDatas[buf] = val;
                render(domNode, template, datas, wrapDatas);
            },
            get: function() {

                return wrapDatas[buf];
            },
        })
    }
    render(domNode, template, datas, wrapDatas)
    return wrapDatas;
}
/**
 * 渲染函数
 * @param  {[type]} dom       [渲染的dom结点]
 * @param  {[type]} template  [模板字符串]
 * @param  {[type]} datas     [输入数据]
 * @param  {[type]} wrapDatas [经过setter绑定渲染处理的数据]
 * @return {[type]}           [description]
 */
function render(dom, template, datas, wrapDatas) {
    dom.innerHTML = template.replace(/{(\w+?)}/g, (t, match) => {
        for (let i in datas) {
            if (i === match) {
                return wrapDatas[i];
            }
        }
    });
    //重新给bindto属性的结点绑定事件
    bindtoNode(dom)
}
