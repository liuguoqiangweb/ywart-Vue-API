//引入article路由器
const articleRouter=require("./routes/article.js")
//引入用户路由器
const userRouter=require("./routes/user.js")
//引入产品路由
const productRouter=require("./routes/product.js")

//引入express模块构建服务器
const express=require("express");
//引入bodyparse中间件模块
const bodyParser=require("body-parser")
//引入session模块
const session=require("express-session")
//引入cors跨域模块
const cors=require("cors");

var app=express();
app.listen(3008);      //监听端口

//使用bodyparser中间件把post提交的数据转为对象
app.use(bodyParser.urlencoded({
    extended:false     //默认使用querystring来转换
}))

//将静态文件托管到服务器public目录下
app.use(express.static("public"));
app.use(cors({
    credentials: true,
    origin: [
		"http://127.0.0.1:8080",
        "http://localhost:8080"
	]
}))

app.use(session({
    secret:"128位随机字符",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24
    }
  }))

//挂载路由器
app.use("/news",articleRouter);
app.use("/user",userRouter);
app.use("/product",productRouter)

