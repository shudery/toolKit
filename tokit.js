//tools for developing quickly


/**
 * 遍历目录
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function getFilesPath(path) {
    var fileList = [];
    (function searchPath(path) {
        fs.readdirSync(path).forEach((item) => {
            if (fs.statSync(path + item).isDirectory()) {
                searchPath(path + item + '/');
            } else {
                fileList.push(path + item);
            }
        });
    })(path)
    return fileList;
}