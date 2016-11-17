const superagent = require('superagent');
const cheerio = require('cheerio');
const colors = require('colors');
const mongoose = require('mongoose');
const _ = require('daguo');
const schema = require('./schema/doubanMovies');

const url = 'https://movie.douban.com/top250?start={}&filter=';
const dbServer = 'mongodb://127.0.0.1:27017/movies';
const intervalTime = 3000;

//坑：Model.find,create,close都是异步的
//
const db = mongoose.connect(dbServer) //创建一个数据库连接
const doubanMovies = new mongoose.Schema(schema);

const Model = db.model('daguos', doubanMovies);
db.connection.on("error", (error) => {
    console.log("database connect fail:" + error);
});
db.connection.on("open", () => {
    console.log("database connect success.");
    Model.remove({}, (err, val) => {
        console.log("delete all document.")
    })
    start();
});


function start() {
    let count = 0;
    let clock = setInterval(() => {
        if (count >= 250 / 25) {
            console.log('database colse.'.yellow)
            db.connection.close();
            clearInterval(clock);
        } else {
            get(url.replace(/{}/, 25 * count));
            count++;
        }
    }, intervalTime);
}

function get(url) {
    console.log(`start get : ${url}`);
    return new Promise((resolve, reject) => {
        superagent.get(url)
            .end((err, res) => {
                const $ = cheerio.load(res.text);
                const lists = $('.grid_view li');
                let movies = [];
                lists.each(function() {
                    let movie = {};
                    movie.rank = $(this).find('.pic em').text();
                    movie.title = $(this).find('.hd a').text().trim().split('\n')[0];
                    movie.mark = $(this).find('.rating_num').text();
                    movie.link = $(this).find('.hd a').attr('href');
                    movie.pic = $(this).find('.pic img').attr('src');
                    let desc = $(this).find('.bd p').text().trim().split('\n');
                    movie.act = desc[0];
                    desc[1] && (movie.style = desc[1].trim());
                    desc[3] && (movie.desc = desc[3].trim());
                    // console.log(movie)
                    // movies.push(movie)
                    Model.create(movie)
                })
                resolve();
            })
    })
}
