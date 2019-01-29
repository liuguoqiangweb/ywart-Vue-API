//创建数据池
const mysql=require("mysql");

//使用严格模式
"use strict";
var pool=mysql.createPool({
    host:"127.0.0.1",   //地址
    port:3306,          //端口
    user:"root",        //用户名
    password:"",        //密码
    database:"ywvue",      //数据库名
    connectionLimit:15  //最大连接数
});

//冻结数据库信息，禁止修改
Object.freeze(pool);

//导出数据池
module.exports=pool;