const express = require('express');
const app = express();

var _data = [{
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
}];

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

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