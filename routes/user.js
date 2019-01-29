//引入数据池
const pool=require("../pool");

//引入express
const express=require("express");
const router=express.Router();

//用户注册
router.post("/register",(req,res)=>{
    var $uname=req.body.uname;    //获取uname
    var $upwd=req.body.upwd;      //获取upwd

    //执行sql语句-插入
    var sql="INSERT INTO user VALUES(NULL,?,?)";   
    pool.query(sql,[$uname,$upwd],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({ok:1})
        }else{
            res.send({ok:0})
        }
    })
})

//检测用户名是否被注册
router.post("/checkUname",(req,res)=>{
    var $uname=req.body.uname;    //获取uname

    //执行sql语句-查询
    var sql="SELECT uid FROM user WHERE uname=?";
    pool.query(sql,[$uname],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            res.send({ok:0})
        }else{
            res.send({ok:1})
        }
    })
})

//用户登录
router.post("/login",(req,res)=>{
    var $uname=req.body.uname;      //获取uname
    var $upwd=req.body.upwd         //获取upwd

    //执行sql语句-查询
    var sql="SELECT uid,uname FROM user WHERE uname=? AND upwd=?";
    pool.query(sql,[$uname,$upwd],(err,result)=>{
        if(err) throw err;
        if(result.length==1){
            req.session.uid=result[0].uid;
            req.session.uname = result[0].uname;
            res.send({
                ok: 1,
                uid: req.session.uid,
                uname: result[0].uname
            })
        }else{
            res.send({ok:0})
        }
    })
})

//退出登录
router.get("/loginOut",(req,res)=>{
    req.session.uid = null;
    req.session.uname = null;
    console.log(222)
    res.send({ok:1,msg:"已退出登录"})
})

//查账号
router.get("/selUname",(req,res)=>{
    var uid = req.query.uid;

    var sql = "SELECT uname FROM user WHERE uid = ?";
    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err;
        if(result.length > 0){
            res.send(result[0])
        }else{
            res.send({code:0,msg:"用户名不存在，请注册！"})
        }
    })
})

//导出路由
module.exports=router