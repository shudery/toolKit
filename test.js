/**
 * inject all module by pass module's name as arguments
 * @return {[type]} [description]
 */
function injection() {
    var str = '';
    Array.from(arguments).forEach(val => {
        str += 'global.' + val + '=require("' + val + '");'
        eval(str);
    })
}

injection('http', 'colors');
console.log(colors);
