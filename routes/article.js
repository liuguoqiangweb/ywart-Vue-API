//引入数据池
const pool=require("../pool")

//引入express创建路由器
const express=require("express");
var router=express.Router();

//头条新闻
router.get("/top",(req,res)=>{
    var sql="SELECT * FROM article WHERE istop=1";
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
});

//文章栏目
router.get('/newsClass', (req, res) => { 
    var className = req.query.className;
	var pno = req.query.pno
	var pageSize = req.query.pageSize
	//如果没有当前页，页大小，设置默认值
	if(!pno){pno=1}
	if(!pageSize){pageSize=5}

	//创建正则表达式验证用户输入验证
    var reg = /^[0-9]{1,3}$/;
    //如果出错停止函数运行
    if (!reg.test(pno)) {
        res.send({ code: -1, msg: "页编格式不正确" });
        return;
    }
    if (!reg.test(pageSize)) {
        res.send({ code: -2, msg: "页大小格式不正确" });
        return;
    }
	
	var progress = 0;
    var obj = { code: 1 };
    //5:创建sql1 查询总记录数   严格区分大小写
    var sql = "SELECT count(nid) AS c FROM article";
    pool.query(sql, (err, result) => {
        if (err) throw err;
        var pageCount = Math.ceil(result[0].c / pageSize);
        progress += 50;
        obj.pageCount = pageCount;
        if (progress == 100) {
            res.send(obj);
        }
    });
    //6:创建sql2 查询当前页内容 严格区分大小写
    var sql = " SELECT *";
    sql += " FROM article";
    sql += " LIMIT ?,?";
    var offset = parseInt((pno - 1) * pageSize);
    pageSize = parseInt(pageSize);
    pool.query(sql, [offset, pageSize], (err, result) => {
            if (err) throw err;
            progress += 50;
            obj.data = result;
            if (progress == 100) {
                res.send(obj);
            }
        })

	//如果没有文章分类名，则查询所有
    /*if (!className) {
        var sql = 'SELECT * FROM article'
        pool.query(sql, (err, result) => {
            if (err) throw err;
            res.send(result)
        })
    } else { 
        var sql = 'SELECT * FROM article WHERE columns = ?'
        pool.query(sql, [className], (err,result)=> {
            if(err) throw err;
            res.send(result)
        })
    }*/
})

//文章详情
router.get("/newsInfo",(req,res)=>{
    var $nid=req.query.nid;
    var sql="SELECT * FROM article WHERE nid=?";
    pool.query(sql,[$nid],(err,result)=>{
        if(err) throw err;
        res.send(result[0])
    })
});

//导出路由器
module.exports=router