//引入数据池
const pool=require("../pool");

//引入express模块创建路由器
const express=require("express");
const router = express.Router();

//首页热门原创
router.get("/popular", (req, res) => {
    var sql = "SELECT pid,atrist,pname,price,img FROM product WHERE is_recommend = 1 ORDER BY pid DESC LIMIT 0,4";

    //执行sql语句-查询
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

//首页限时抢购
router.get("/purchase", (req, res) => {
    var sql = "SELECT pid,price,img FROM product ORDER BY price DESC LIMIT 0,4";
    //执行sql语句-查询
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

//所有产品
router.get("/allProduct", (req, res) => {
    var sql = ''
    var className = req.query.className
    var topicName = decodeURIComponent(req.query.topicName)
    var priceValue = req.query.priceValue
    var keyWord = req.query.keyWord
    sql += 'SELECT * FROM product WHERE'
    //关键字模糊查询
    sql += ` atrist LIKE '%${keyWord}%' AND`

    //作品分类模糊查询
	sql += ` class LIKE '%${className}%' AND`

    //题材分类模糊查询
	sql += ` topic LIKE '%${topicName}%'`

    //价格区间模糊查询
    if (priceValue) {
        let regex = /[\u4e00-\u9fa5]/   //验证汉字的正则表达式
        var minPrice, maxPrice
        if (regex.test(priceValue) === false) { //如果没有汉字，说明是区间价格，以中间的-划分最高、最低价格
            minPrice = priceValue.split('-')[0]
            maxPrice = priceValue.split('-')[1]
        } else {//如果有汉字，使用替换成空的方法把汉字去掉
            let priceNum = priceValue.replace(/[\u4e00-\u9fa5]/ig, '')
            if (priceNum == 2000) {//如果去掉汉字以后是2000,说明2000是最低筛选条件，那么最低价格为0，最高价格为2000
                minPrice = 0
                maxPrice = 2000
            } else {//反之
                minPrice = 30000
                maxPrice = 300000
            }
        }
        sql += ` AND price > ${minPrice} AND price < ${maxPrice}`
    } else { 
        sql += ` AND price LIKE '%%'`
    }
    pool.query(sql,(err,result)=>{
        if (err) throw err;
        res.send(result);
        return
    })
})

// 价格排序
router.get('/orderByPrice', (req, res) => { 
    var sql = ''
    var className = req.query.className
    var topicName = decodeURIComponent(req.query.topicName)
    var priceValue = req.query.priceValue
    var keyWord = req.query.keyWord
    var output = { //定义返回对象
        synthetical: [ /*综合排序*/ ],
        hotGoods: [ /*热度排序 */ ],
        priceGoods: [ /*价格排序*/ ]
    }

    sql += 'SELECT * FROM product WHERE'
    //关键字模糊查询
    if (keyWord) {
        sql += ` atrist LIKE '%${keyWord}%' AND`
    } else {
        sql += ` atrist LIKE '%%' AND`
    }
    //作品分类模糊查询
    if (className) {
        sql += ` class LIKE '%${className}%' AND`
    } else {
        sql += ` class LIKE '%%' AND`
    }
    //题材分类模糊查询
    if (topicName) {
        sql += ` topic LIKE '%${topicName}%'`
    } else {
        sql += ` topic LIKE '%%'`
    }
    //价格区间模糊查询
    if (priceValue) {
        let regex = /[\u4e00-\u9fa5]/ //验证汉字的正则表达式
        var minPrice, maxPrice
        if (regex.test(priceValue) === false) { //如果没有汉字，说明是区间价格，以中间的-划分最高、最低价格
            minPrice = priceValue.split('-')[0]
            maxPrice = priceValue.split('-')[1]
        } else { //如果有汉字，使用替换成空的方法把汉字去掉
            let priceNum = priceValue.replace(/[\u4e00-\u9fa5]/ig, '')
            if (priceNum == 2000) { //如果去掉汉字以后是2000,说明2000是最低筛选条件，那么最低价格为0，最高价格为2000
                minPrice = 0
                maxPrice = 2000
            } else { //反之
                minPrice = 30000
                maxPrice = 300000
            }
        }
        sql += ` AND price > ${minPrice} AND price < ${maxPrice}`
    } else {
        sql += ` AND price LIKE '%%'`
    }
    sql += ' ORDER BY price'
    pool.query(sql, (err, result) => { 
        if (err) throw err;
        res.send(result)
    })
})

// 热度排序
router.get('/orderByHot', (req, res) => {
    var sql = ''
    var className = req.query.className
    var topicName = decodeURIComponent(req.query.topicName)
    var priceValue = req.query.priceValue
    var keyWord = req.query.keyWord
    var output = { //定义返回对象
        synthetical: [ /*综合排序*/ ],
        hotGoods: [ /*热度排序 */ ],
        priceGoods: [ /*价格排序*/ ]
    }

    sql += 'SELECT * FROM product WHERE'
    //关键字模糊查询
    if (keyWord) {
        sql += ` atrist LIKE '%${keyWord}%' AND`
    } else {
        sql += ` atrist LIKE '%%' AND`
    }
    //作品分类模糊查询
    if (className) {
        sql += ` class LIKE '%${className}%' AND`
    } else {
        sql += ` class LIKE '%%' AND`
    }
    //题材分类模糊查询
    if (topicName) {
        sql += ` topic LIKE '%${topicName}%'`
    } else {
        sql += ` topic LIKE '%%'`
    }
    //价格区间模糊查询
    if (priceValue) {
        let regex = /[\u4e00-\u9fa5]/ //验证汉字的正则表达式
        var minPrice, maxPrice
        if (regex.test(priceValue) === false) { //如果没有汉字，说明是区间价格，以中间的-划分最高、最低价格
            minPrice = priceValue.split('-')[0]
            maxPrice = priceValue.split('-')[1]
        } else { //如果有汉字，使用替换成空的方法把汉字去掉
            let priceNum = priceValue.replace(/[\u4e00-\u9fa5]/ig, '')
            if (priceNum == 2000) { //如果去掉汉字以后是2000,说明2000是最低筛选条件，那么最低价格为0，最高价格为2000
                minPrice = 0
                maxPrice = 2000
            } else { //反之
                minPrice = 30000
                maxPrice = 300000
            }
        }
        sql += ` AND price > ${minPrice} AND price < ${maxPrice}`
    } else {
        sql += ` AND price LIKE '%%'`
    }
    sql += ' ORDER BY atrist'
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

//产品搜索
router.get("/search",(req,res)=>{
    var kword=decodeURIComponent(req.query.kwords);
    kword=`%${kword}%`;
    var sql = "SELECT pid,atrist,pname,timer,material,size,price,img FROM product WHERE class LIKE ? OR pname LIKE ? OR atrist LIKE ? OR material LIKE ? ORDER BY pid DESC";

    pool.query(sql,[kword,kword,kword,kword],(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//作品详情
router.get("/details",(req,res)=>{
    var pid = req.query.pid;
    var uid = req.session.uid;

    var output={
        pics:{/*{图片},{图片},{图片}*/},
        mount:{/* 装裱 */},
        labels:{/*{标签},{标签},{标签}*/},
        details: {/*详细信息*/ },
        others: {/*其他信息*/ },
        artist: {/*作家信息*/},
        uid:""
    };
    
    output.uid = uid;
    //查询图片
    var sql = "SELECT img,imgs FROM product WHERE pid=?";
    pool.query(sql,[pid],(err,result)=>{
        if(err) throw err;
        output.pics = result[0];
        //查价格
        var sql = "SELECT lable,decoration,transport FROM product WHERE pid=?";
        pool.query(sql,[pid],(err,result)=>{
            if(err) throw err;
            output.mount = result[0];
            //查产品标签列
            var sql = "SELECT price,pname,atrist,material,size,timer,class,style,topic,rec_reason FROM product WHERE pid=?";
            pool.query(sql,[pid],(err,result)=>{
                if(err) throw err;
                output.labels = result[0];
                //查作品详情介绍
                var sql = "SELECT detail FROM product WHERE pid=?";
                pool.query(sql,[pid],(err,result)=>{
                    if(err) throw err;
                    output.details = result[0];
                    // 查询作品其他信息
                    var sql = "SELECT spaceshow,otherdetail,buynotes,ywtips FROM product WHERE pid=?";
                    pool.query(sql,[pid], (err, result) => { 
                        if (err) throw err;
                        output.others = result[0]
                        // 查询作家信息
                        var aname = output.labels.atrist;
                        var sql = 'SELECT * FROM artist WHERE aname=?'
                        pool.query(sql, [aname], (err, result) => { 
                            if (err) throw err;
                            output.artist = result[0]
                            res.send(output)
                        })
                    })
                })
            })
        })
    })
})

//加入购物车
router.post("/insertCart",(req,res)=>{
    var pid = req.body.pid;
    var count = req.body.count;
    var price = req.body.price;
    var uid = req.body.uid;
    if(uid===undefined){
        res.send({code:0,msg:"请先登录！"});
        return;   //停止执行后续代码
    }
    var sql = "SELECT pid,isdel FROM shopcart WHERE pid =? AND uid = ?";     //查询购物车表是否有此商品
    pool.query(sql,[pid,uid],(err,result)=>{
        if(err) throw err;
        if(result.length>0 && result[0].isdel == 1){                               //如果有，且isdel字段值为1，说明以前被删除，此时只需把isdel改为0
            var sql = 'UPDATE shopcart SET isdel = 0  WHERE pid = ? AND uid = ?'
			pool.query(sql,[pid,uid],(err,result)=>{
				if(err) throw err;
				if(result.affectedRows>0){
					res.send({code:1,msg:'加入购物车成功！'})
				}
			})
        }else if(result.length>0 && result[0].isdel == 0){
			res.send({code:-2,msg:'购物车已有此商品！'})
			return;
		}else{
            var sql = "INSERT INTO `shopcart`(`cid`, `pid`, `uid`, `count`, `price`,`ctime`) VALUES (NULL,?,?,?,?,now())";
            pool.query(sql,[pid,uid,count,price,],(err,result)=>{
                if(err) throw err;
                if(result.affectedRows > 0){
                    res.send({code:1,msg:"成功加入购物车"})
                }else{
                    res.send({code:-1,msg:"加入购物车失败"})
                }
            })
        }
    })
})


//用户购物车列表
router.get("/myShopcart",(req,res)=>{
    var uid = req.query.uid;

    var sql ="SELECT a.*,b.pname,b.img,b.atrist,b.size,b.timer FROM shopcart a INNER JOIN product b ON b.pid=a.pid WHERE uid = ? AND a.isdel = 0";
    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err;
        if(result.length>0){ 
            res.send(result)
        }else{
            res.send({code:0,msg:"您还未下单"})
        }
    })   
})

//删除购物车商品
router.get("/deleteGoods",(req,res)=>{
    var $cid=req.query.cid;

    var sql="UPDATE shopcart SET isdel = 1 WHERE cid=?";
    pool.query(sql,[$cid],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0){
        res.send({code:1,msg:"删除成功"});
      }else{
        res.send({code:0,msg:"删除失败"});  
      }
    });
  })

// 发表评论
router.post('/sendComment',(req,res)=>{
	var uid = req.body.uid;
	var pid = req.body.pid;
	var content = req.body.content;

	var sql = 'SELECT * FROM comment WHERE uid = ? AND pid = ?'
	pool.query(sql,[uid,pid],(err,result)=>{
		if(err) throw err;
		console.log(result)
		if(result.length>2){
			res.send({code:-2,msg:'操作频繁，请稍候再评论！'})
			return;
		}else{
			var sql = 'INSERT INTO comment VALUES(NULL,?,?,?,now())'
			pool.query(sql,[pid,uid,content],(err,result)=>{
				if(err) throw err;
				if(result.affectedRows>0){
					res.send({code:1,msg:'发表评论成功'})
				}else{
					res.send({code:0,msg:'发表评论失败'})	
				}
			})	
		}
	})
})

//调用评论
router.get('/selComment',(req,res)=>{
	var pid = req.query.pid
	var sql = 'SELECT a.*,b.uname FROM comment a INNER JOIN user b ON b.uid = a.uid WHERE pid = ? ORDER BY mid DESC LIMIT 0,5'
	pool.query(sql,[pid],(err,result)=>{
		if(err) throw err;
		res.send(result)
	})
})
//导出路由器
module.exports=router