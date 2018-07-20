const express = require('express');
const app = express();
const superagent = require('superagent');
const async = require('async'); 
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const fs = require('fs');
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: '192.168.1.114',//数据库地址
    user: 'root',//账号
    password: '123456',//密码
    database: 'lagou',//库名
    multipleStatements: true //允许执行多条语句
});

let _data = [{
    "id":"1",
    "name":"zysoft",
    "sex":"男",
    "age":"23"
},{
    "id":"2",
    "name":"oft",
    "sex":"男",
    "age":"33"
},{
    "id":"3",
    "name":"ssss",
    "sex":"女",
    "age":"23"
},{
    "id":"4",
    "name":"s2ssss",
    "sex":"女",
    "age":"23"
},{
    "id":"4",
    "name":"s2ssss",
    "sex":"女",
    "age":"23"
}];

let urlArray = [];
let url = '';
let jsonData = [];
for(let i = 1; i <= 30; i++) {
    if(i === 1) {
        url = 'https://www.lagou.com/zhaopin/?filterOption=3';
    }else {
        url = 'https://www.lagou.com/zhaopin/'+i+'/?filterOption=3';
    }
    urlArray.push(url);
}

setInterval(getDataToDataBase,300000);   //5分钟拉取一次数据
function getDataToDataBase(){
// app.get('/',(req, res) => {
    async.mapLimit(urlArray, 5, (baseUrl, callback) => {
        superagent.get(baseUrl).end((err, result) => {
            if(err) console.errpr(err);
            let $ = cheerio.load(result.text);

            $('.item_con_list .con_list_item').each((index, element) => {
                let $element = $(element);
                let $position = $element.find('.position');
                let $company = $element.find('.company');

                let position = $position.find('.position_link').children('h3').text().trim();
                let address = $position.find('.position_link').children('.add').children('em').text().trim();
                let salary = $position.find('.p_bot').find('.money').text().trim();
                let requirement = $position.find('.p_bot').find('.li_b_l').text().trim();
                let company_name = $company.find('.company_name').children('a').text().trim();
                let industry = $company.find('.industry').text().trim();
                let detail = $company.find('.company_name').children('a').attr('href');
                let logo = $element.find('.com_logo').children('a').children().attr('src');

                let selectSQL = `INSERT INTO lagou (position, address, salary, requirement, company_name, industry, detail, logo) VALUE('${position}', '${address}','${salary}','${requirement}','${company_name}','${industry}','${detail}','${logo}')`;
                conn.query(selectSQL, function(err, rows) {
                    if (err) throw err;
                    else console.log('成功')
                });
                // jsonData.push({
                //     position: $position.find('.position_link').children('h3').text().trim(),
                //     adress: $position.find('.position_link').children('.add').children('em').text().trim(),
                //     salary: $position.find('.p_bot').find('.money').text().trim(),
                //     requirement: $position.find('.p_bot').find('.li_b_l').text().trim(),
                //     company_name: $company.find('.company_name').children('a').text().trim(),
                //     industry: $company.find('.industry').text().trim(),
                //     detail: $company.find('.company_name').children('a').attr('href'),
                //     logo: $element.find('.com_logo').children('a').children().attr('src'),
                // });
            });
            // callback(null,JSON.stringify(jsonData));
        });
    },(err, result) => {
        // res.send(result);
        // fs.writeFile('laGou.json', result, (err) => {
        //     if (err) console.error(err);
        //     console.log("数据写入成功！");
        // });
    })
// })

}


//设置跨域请求
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

app.get('/introduce',function(req,res){
    // res.header("Access-Control-Allow-Origin", "*");   //设置跨域访问 
    res.send(_data);
})

app.listen(8888,function(){
    console.log('listening on *:8888');
});



// app.use(express.static("src")).listen(8888, (req, res) => {
//     console.log('port at 8888')
// });

