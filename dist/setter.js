/**
 * 数据绑定，类似vue
 * 用setter将数据操作和视图渲染绑定在一起，同时将指定位置的值通过事件绑定，同步到模板对应的位置。
 *
 * 待解决：每次render之后绑定的onchange事件就没了，全局刷新渲染，不是对应节点
 */
class Due {
    constructor(options) {
            this.node = document.querySelector(options.node);
            this.template = this.node.outerHTML;
            this.datas = options.datas;
            this.wrapDatas = {};
        }
        /**
         * 将this.datas的数据添加访问器属性，用setter使数据修改和视图渲染同步
         * @return this.wrapdatas 同步后的datas
         */
    bindSetter() {
        let wrapDatas = {};
        for (let n in this.datas) {
            let buf = '_' + n;
            let that = this;
            wrapDatas[buf] = this.datas[n];
            Object.defineProperty(wrapDatas, n, {
                set(val) {
                    console.log(`<setter:>${buf}:${wrapDatas[buf]}->${val},view rerendering...`)
                        //数据更改时同步更新view
                    wrapDatas[buf] = val;
                    that.render(that.node, that.template, that.datas, that.wrapDatas);
                },
                get() {
                    return wrapDatas[buf];
                },
            })
        }
        //this.render(this.node, this.template, this.datas, this.wrapDatas)
        this.wrapDatas = wrapDatas;
    }

    /**
     * 绑定事件处理数据
     * @return {[type]} [description]
     */
    bindtoNode() {
        //双向绑定
        if (this.node.getAttribute('bindto')) {
            this.node.value = this.wrapDatas[this.node.getAttribute('bindto')]
        }
        (function search(node, wrapDatas) {
            if (node.getAttribute('bindto')) {
                node.value = wrapDatas[node.getAttribute('bindto')]
            }
            if (node.childNodes) {
                node.childNodes.forEach((val) => {
                    if (val.nodeType === 1) {

                        search(val, wrapDatas)
                    }
                })
            }
        })(this.node, this.wrapDatas);

        this.node.onchange = (e) => {
            let bindto = e.target.getAttribute('bindto')
            if (bindto) {
                this.wrapDatas[bindto] = e.target.value;
            }
        }
    }

    /**
     * 渲染view，根据this.node全局渲染
     * @return {[type]} [description]
     */
    render() {
        this.node.innerHTML = this.template.replace(/{(\w+?)}/g, (t, match) => {
            for (let i in this.datas) {
                if (i === match) {
                    return this.wrapDatas[i];
                }
            }
        });
        //需要重新给bindto属性的结点绑定事件
        this.bindtoNode(this.node, this.wrapDatas)
    }
}

const due = new Due({
    node: '#app',
    datas: {
        first: '1',
        second: '2',
    }
});
//绑定数据
due.bindSetter();
//渲染view
due.render();
//绑定事件
due.bindtoNode();
