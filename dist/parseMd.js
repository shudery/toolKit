/**
 * showAsmd 简单的markdown语法转换成html标签工具，标签类型为[相应的标签名-md]
 */

//目前支持的转换
String.prototype.hash = {

    img: /\[\!(.*?)\]\((.*?)\)/g, //[!alt](src)
    a: /\[(?!\!)(.*?)\]\((.*?)\)/g, //[text](href)
    code: /```([\s\S]*?)```/g, //```code```
    strong: [/``?([\s\S]*?)``?/g, /(?!\n)\*([\s\S]*?)\*/g], //``strong``,*strong*
    li: /\n[\*+\-]\s(.*)/g, //行首+*- 
    ul: /(<li>.*<\/li>)(?!<li>)/g,
    h1: /\n#\s(.*)/g,
    h2: /\n##\s(.*)/g,
    h3: /\n###\s(.*)/g,
    h4: /\n####\s(.*)/g,
    h5: /\n#####\s(.*)/g,
    h6: /\n######\s(.*)/g,

}
if (String.prototype.showAsmd) {
    console.log('showAsmd fn already exist!')
}
String.prototype.showAsmd = function() {

    var str = this.toString();
    if (typeof str !== 'string') {
        return new TypeError('expecting a string param!');
    }
    var hash = this.hash;
    for (var key in hash) {
        var repText = '';
        var keyRexExp = hash[key];

        if (Object.prototype.toString.call(keyRexExp) === '[object RegExp]') {
            switch (key) {
                case 'a':
                    repText = '<a class="a-md" href="$2">$1</a>';
                    break;
                case 'img':
                    repText = '<img class="img-md" src="$2" alt="$1" />';
                    break;
                default:
                    repText = '<' + key + ' class="' + key + '-md">$1</' + key + '>';

            }
            str = str.replace(keyRexExp, repText)
        } else {
            //有多个匹配规则
            keyRexExp.forEach((val, index) => {
                str = str.replace(val, '<' + key + ' class="' + key + '-md">$1</' + key + '>')
            })
        }
    }
    return str;
}
