const express = require('express');
const app = express();
const superagent = require('superagent');
const async = require('async'); 
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const fs = require('fs');
const mysql = require('mysql');
const { options } = require('./option');

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

// let urlArray = [];
// let url = '';
// let jsonData = [];
// for(let i = 1; i <= 30; i++) {
//     if(i === 1) {
//         url = 'https://www.lagou.com/zhaopin/?filterOption=3';   //https://www.lagou.com/jobs/list_?px=new&city=%E5%85%A8%E5%9B%BD#filterBox
//     }else {
//         url = 'https://www.lagou.com/zhaopin/'+i+'/?filterOption=3';
//     }
//     urlArray.push(url);
// }

// setInterval(getDataToDataBase,200000);   //5分钟拉取一次数据
// function getDataToDataBase(){
//     async.mapLimit(urlArray, 5, (baseUrl, callback) => {
//         superagent.get(baseUrl).end((err, result) => {
//             if(err) console.error(err);
//             let $ = cheerio.load(result.text);

//             $('.item_con_list .con_list_item').each((index, element) => {
//                 let $element = $(element);
//                 let $position = $element.find('.position');
//                 let $company = $element.find('.company');

//                 let position = $position.find('.position_link').children('h3').text().trim();
//                 let address = $position.find('.position_link').children('.add').children('em').text().trim();
//                 let salary = $position.find('.p_bot').find('.money').text().trim();
//                 let requirement = $position.find('.p_bot').find('.li_b_l').text().trim();
//                 let company_name = $company.find('.company_name').children('a').text().trim();
//                 let industry = $company.find('.industry').text().trim();
//                 let detail = $company.find('.company_name').children('a').attr('href');
//                 let logo = $element.find('.com_logo').children('a').children().attr('src');

//                 let selectSQL = `INSERT INTO lagou (position, address, salary, requirement, company_name, industry, detail, logo) VALUE('${position}', '${address}','${salary}','${requirement}','${company_name}','${industry}','${detail}','${logo}')`;
//                 conn.query(selectSQL, function(err, rows) {
//                     if (err) throw err;
//                     // else console.log('成功')
//                 });
//             });
//             // callback(null,JSON.stringify(jsonData));
//         });
//     },(err, result) => {
//         // res.send(result);
//         // fs.writeFile('laGou.json', result, (err) => {
//         //     if (err) console.error(err);
//         //     console.log("数据写入成功！");
//         // });
//     })
// // })

// }


setInterval(getDataToDataBase,200000);   //5分钟拉取一次数据
function getDataToDataBase(){
    let ok = 0;
    let page = 1;
    let urls = [];
    // 利用async控制并发数量
    async.series(
        // series会依次执行队列中的函数
        [
            // 第一次发送请求先拿到总的页码数
            // (cb) => {
            //     superagent
            //         .post(`https://www.lagou.com/jobs/positionAjax.json?px=new&needAddtionalResult=false&pn=1`)
            //         .send({
            //             'pn': page,
            //             'kd': '',
            //             'first': true
            //         })
            //         .set(options)
            //         .end((err, res) => {
            //             if (err) throw err;
            //             let dataObj = JSON.parse(res.text);
            //             if (dataObj.success === true) {
            //                 page = dataObj.content.positionResult.totalCount;
            //                 cb(null, page);
            //             } else {
            //                 console.log('获取数据失败,' + res.text);
            //             }

            //         });
            // },
            // 根据第一次得到的page创建urls数组
            (cb) => {
                for (let i = 1; i <= 30; i++) {
                    urls.push(`https://www.lagou.com/jobs/positionAjax.json?px=new&needAddtionalResult=false&pn=${i}`)
                }
                // console.log(`${city}的${position}职位共${page}条数据，${urls.length}页`);
                cb(null, urls);
            },
            // 利用async.mapLimit控制请求，每次最多发送3条请求
            (cb) => {
                async.mapLimit(urls, 5, (baseUrl, callback) => {
                    superagent
                    .post(baseUrl)
                    .send({
                        'pn': page,
                        'kd': '',
                    })
                    .set(options)
                    .end((err, result) => {
                        if(err) console.error(err);
                        let data = JSON.parse(result.text);
                        data.content && data.content.positionResult.result.forEach((element, i) => {
                            let selectSQL = `INSERT INTO lagou1 (positionName, education, city, financeStage, companyLogo, companySize, workYear, jobNature,companyFullName,salary,firstType,secondType,positionAdvantage,industryField,district) 
                                            VALUE('${element.positionName}', '${element.education}','${element.city}','${element.financeStage}','${element.companyLogo}','${element.companySize}','${element.workYear}','${element.jobNature}','${element.companyFullName}','${element.salary}','${element.firstType}','${element.secondType}','${element.positionAdvantage}','${element.industryField}','${element.district}')`;
                            conn.query(selectSQL, function(err, rows) {
                                if (err) throw err;
                                // else console.log('成功')
                            });
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
            },
            () => {
                if (ok) {
                    setTimeout(function () {
                        console.log(`${city}的${position}数据请求完成`);
                        indexCallback(null);
                    }, 5000);
                } else {
                    console.log(`${city}的${position}数据请求完成`);
                }
            }
        ], (err, result) => {
            if (err) throw err;
        });

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
//查询
app.post('/findData', (req, res) => {
    if (req.body) {  
        //能正确解析 json 格式的post参数  
        // res.send({"status": "success", "name": req.body.data.name, "age": req.body.data.age});  
    } else {  
        //不能正确解析json 格式的post参数  
        var body = '', jsonStr;  
        req.on('data', function (chunk) {  
            body += chunk; //读取参数流转化为字符串  
        });  
        req.on('end', function () {  
            //读取参数流结束后将转化的body字符串解析成 JSON 格式  
            try {  
                jsonStr = JSON.parse(body);
                let page = jsonStr.page - 1;
                let pageSize = jsonStr.pageSize; 
                let startRows = page * pageSize;
                let company_name = jsonStr.company_name ? jsonStr.company_name : '';
                let position = jsonStr.position ? jsonStr.position : '';
                let address = jsonStr.address ? jsonStr.address : '';
                let salary = jsonStr.salary ? jsonStr.salary : '';
                let counts = 0;
                let data = {};
                let findData = `Select * from lagou where 1=1`;
                let dataCount = `Select count(1) as total from lagou where 1=1`;
                if(company_name != '') {
                    findData += ` and company_name like '%${company_name}%'`;
                    dataCount += ` and company_name like '%${company_name}%'`;
                }
                if(position != '') {
                    findData += ` and position like '%${position}%'`;
                    dataCount += ` and position like '%${position}%'`;
                }
                if(address != '') {
                    findData += ` and address like '%${address}%'`;
                    dataCount += ` and address like '%${address}%'`;
                }
                if(salary != '') {

                    findData += ` and where salary like '%${salary}%'`;
                    dataCount += ` and where salary like '%${salary}%'`;
                }
                findData += ` limit ${startRows}, ${pageSize}`
                conn.query(dataCount, function(err, rows) {
                    if (err) throw err;
                    counts = rows[0]['total'];
                    data.total = counts;
                }); 
                conn.query(findData, function(err, rows) {
                    if (err) throw err;
                    data.dataList = rows;
                    res.send({"code":0,"status":"success", "data":data}); 
                }); 
            } catch (err) {  
                jsonStr = null;  
            }  
            
        });  
    }  
});
//获取各个城市职位总数据
app.post('/findCityPosition', (req, res) => {
    if (req.body) {  
        //能正确解析 json 格式的post参数  
        // res.send({"status": "success", "name": req.body.data.name, "age": req.body.data.age});  
    } else {  
        //不能正确解析json 格式的post参数  
        var body = '', jsonStr;  
        req.on('data', function (chunk) {  
            body += chunk; //读取参数流转化为字符串  
        });  
        req.on('end', function () {  
            //读取参数流结束后将转化的body字符串解析成 JSON 格式  
            try {  
                jsonStr = JSON.parse(body);
                let data = {};
                let counts_xian_sql = `Select count(1) as total_xian from lagou where 1=1  and address like '%西安%' `;
                let counts_beijing_sql = `Select count(1) as total_beijing from lagou where 1=1  and address like '%北京%' `;
                let counts_shanghai_sql = `Select count(1) as total_shanghai from lagou where 1=1  and address like '%上海%' `;
                let counts_shenzhen_sql = `Select count(1) as total_shenzhen from lagou where 1=1  and address like '%深圳%' `;
                let counts_guangzhou_sql = `Select count(1) as total_guangzhou from lagou where 1=1  and address like '%广州%' `;
                let counts_chengdu_sql = `Select count(1) as total_chengdu from lagou where 1=1  and address like '%成都%' `;
                let counts_hefei_sql = `Select count(1) as total_hefei from lagou where 1=1  and address like '%合肥%' `;
                let counts_zhengzhou_sql = `Select count(1) as total_zhengzhou from lagou where 1=1  and address like '%郑州%' `;
                let counts_hangzhou_sql = `Select count(1) as total_hangzhou from lagou where 1=1  and address like '%杭州%' `;
                let counts_nanjing_sql = `Select count(1) as total_nanjing from lagou where 1=1  and address like '%南京%' `;
                let counts_fuzhou_sql = `Select count(1) as total_fuzhou from lagou where 1=1  and address like '%福州%' `;
                let counts_xiamen_sql = `Select count(1) as total_xiamen from lagou where 1=1  and address like '%厦门%' `;
                let counts_chongqing_sql = `Select count(1) as total_chongqing from lagou where 1=1  and address like '%重庆%' `;
                let counts_changsha_sql = `Select count(1) as total_changsha from lagou where 1=1  and address like '%长沙%' `;
                let counts_wuhan_sql = `Select count(1) as total_wuhan from lagou where 1=1  and address like '%武汉%' `;
                conn.query(`${counts_xian_sql};${counts_beijing_sql};${counts_shanghai_sql};${counts_shenzhen_sql};${counts_guangzhou_sql};
                    ${counts_chengdu_sql};${counts_hefei_sql};${counts_zhengzhou_sql};${counts_hangzhou_sql};${counts_nanjing_sql};
                    ${counts_fuzhou_sql};${counts_xiamen_sql};${counts_chongqing_sql};${counts_changsha_sql};${counts_wuhan_sql}`, function(err, rows) {
                    if (err) throw err;
                    console.log(JSON.stringify(rows))

                    data.counts_xian = rows[0][0]['total_xian'];
                    data.counts_beijing = rows[1][0]['total_beijing'];
                    data.counts_shanghai = rows[2][0]['total_shanghai'];
                    data.counts_shenzhen = rows[3][0]['total_shenzhen'];
                    data.counts_guangzhou = rows[4][0]['total_guangzhou'];
                    data.counts_chengdu = rows[5][0]['total_chengdu'];
                    data.counts_hefei = rows[6][0]['total_hefei'];
                    data.counts_zhengzhou = rows[7][0]['total_zhengzhou'];
                    data.counts_hangzhou = rows[8][0]['total_hangzhou'];
                    data.counts_nanjing = rows[9][0]['total_nanjing'];
                    data.counts_fuzhou = rows[10][0]['total_fuzhou'];
                    data.counts_xiamen = rows[11][0]['total_xiamen'];
                    data.counts_chongqing = rows[12][0]['total_chongqing'];
                    data.counts_changsha = rows[13][0]['total_changsha'];
                    data.counts_wuhan = rows[14][0]['total_wuhan'];
                    res.send({"code":0,"status":"success", "data":data}); 
                }); 
            } catch (err) {  
                jsonStr = null;  
            }  
            
        });  
    }  
})

app.listen(8888,function(){
    console.log('listening on *:8888');
});



// app.use(express.static("src")).listen(8888, (req, res) => {
//     console.log('port at 8888')
// });

