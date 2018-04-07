/**
 * Created by 李会娟 on 2018/2/5.
 */
/**

 */
var express=require('express');
var bodyParser=require('body-parser');//数据解析获取表单提交的数据
var session = require("express-session");//用于保存用户信息
var md5=require('md5-node'); //MD5加密模块
var app=express();//实例化
var DB=require('./modules/db.js')


app.set('view engine','ejs');/*使用ejs模板引擎，默认找views目录用于render渲染界面*/
app.use(express.static('public')); /*用于引进样式，css,js,等放在public静态目录下*/
app.use(bodyParser.urlencoded({ extended: false }));// 设置body-parser中间件，获取post，解析获取的
app.use(bodyParser.json());
app.use(session({       //配置session的中间件
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge:1000*60*30
    },
    rolling:true
}))
app.use(function(req,res,next){//自定义中间件,登录状态的判断
    console.log(req.url);
    if(req.url=='/login' || req.url=='/doLogin'){
        next()
    }else{
        if(req.session.userinfo && req.session.userinfo.username!=''){
            app.locals['userinfo']=req.session.userinfo  //设置全局数据，在任何模板都可使用
            next()
        }else{
            res.redirect('/login')
        }
    }

})
app.locals['userinfo']='req.session.userinfo' //ejs中 设置全局数据，所有的界面都可使用


app.get('/',function(req,res){
    res.send('index')
});
app.get('/login',function(req,res){//登录
    res.render('login')
});

app.post('/doLogin',function(req,res){//获取登录提交的数据
    var username=req.body.username;
    var password=md5(req.body.password);  /*要对用户输入的密码加密*/
    DB.find('user',{                        //1.获取数据
        username:username,                 //2.连接数据库查询数据
        password:password
    },function(err,data){
        if(data.length>0){
            console.log('登录成功');
            req.session.userinfo=data[0];//保存用户信息
            res.redirect('/product');  /*登录成功跳转到商品列表*/
        }else{
            res.send("<script>alert('登录失败');location.href='/login'</script>");
        }
    })
});

//商品列表
app.get('/product',function(req,res){
    DB.find("product",{},function(err,data){
        res.render('product',{
            list:data
        });
    })
});
app.get('/productadd',function(req,res){
    res.render('productadd')
});
app.get('/productedit',function(req,res){
    res.render('productedit')
});
app.get('/loginOut',function(req,res){
    req.session.destroy(function(err){
         if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
    })
})
app.get('/delete',function(req,res){
    DB.deleteOne('product',{"title":"iphones5"},function(error,data){
        if(!error){
            res.send('删除数据成功');
        }
    })
})

app.listen(8008);
console.log("http://127.0.0.1:8008/login");



