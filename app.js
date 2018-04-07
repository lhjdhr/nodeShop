/**
 * Created by 李会娟 on 2018/2/4.
 *session保存用户信息
 * render和redirect的区别
 *       render不会去执行controller中的action方法，直接渲染相应的页面文件
 *  req.url() //用于获取路由信息
 *  app.locals['userinfo']='123' //ejs中 设置全局数据，所有的界面都可使用
 *
 *
 *
 *
 */
var express=require('express');
var bodyParser=require('body-parser');//数据解析获取表单提交的数据
var MongoClient=require('mongodb').MongoClient;
var session = require("express-session");//用于保存用户信息
var md5=require('md5-node'); //MD5加密模块
var app=express();//实例化


var DbUrl='mongodb://localhost:27017/productmanage';  /*连接数据库,输入mongo可获取*/
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
    console.log(req.body);//1获取body-parser提交的数据
    var username=req.body.username;
    var password=md5(req.body.password); //表示对用户的密码加密，不可逆
    MongoClient.connect(DbUrl,function(err,db){  //2.链接数据库查看数据是否有这个数据
         if(err){
             console.log(err);
             return;
         } //否则查询数据
        var result=db.collection('user').find({
             username:username,
             password:password
        });
         result.toArray(function(err,data){  //遍历数据
             console.log(data);
             if (data.length>0){
                 console.log("登录成功");
                 req.session.userinfo=data[0];
                 res.redirect('/product');
             }
             else{
                 console.log("登录失败");
                 res.send("<script>alert('fail');location.href('/login')</script>")
             }
             db.close();
         })
    })

});

app.get('/product',function(req,res){
    MongoClient.connect(DbUrl,function(err,db){
        if(err){
            console.log(err);
            console.log('数据库连接失败');
            return;
        }
        var result=db.collection('product').find();
        result.toArray(function(error,data){
            if(error){
                console.log(error);
                return;
            }
            db.close();
            res.render('product',{
                list:data
            });
        })
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
        console.log(err);
    });
    res.send("退出登录")
});

MongoClient.connect(DbUrl,function(err,db){
    if(err){
        console.log(err);
        return
    }
   var result= db.collection('product').find();
    result.toArray(function(err,data){
        if(err){
            console.log(err);
        }
        db.close();
        console.log(data);
    })
})
app.listen(8008);
console.log("http://127.0.0.1:8008/login");



//
// var result=db.collection('user').find();
// var list=[];
// result.each(function(err,doc){
//     if(err){
//         console.log(err);
//     }else{
//         if(doc!=null){
//             list.push(list)
//         }else{
//             // list=[];
//             // list.push(list);
//             console.log(list);
//             db.close()
//         }
//     }
// })