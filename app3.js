/**
 * Created by 李会娟 on 2018/2/5.
 */
/*   如果没有图片上传可以用body-parser，如果有，则用multiparty
* 1，安装npm i multiparty --save  用于图片上传模块
* 2，引用 var multiparty=require('multiparty');
* 3, 上传图片的地方
*     var form=new multiparty.Form(options);
*      form.uploadDir='upload';//上传图片保存的地址
*      form.parse(req,function(err,fields,files){
*           //获取提交的数据以及图片上传成功返回的图片信息
*      })
* 4，html页面要加入enctype="multipart/form-data"
* */

var express=require('express');
var fs=require('fs')
var session = require("express-session");//用于保存用户信息
var md5=require('md5-node'); //MD5加密模块
var app=express();//实例化
var multiparty=require('multiparty');//既可以图片上传，又可以获取表单信息
var DB=require('./modules/db.js')


app.set('view engine','ejs');/*使用ejs模板引擎，默认找views目录用于render渲染界面*/
app.use(express.static('public')); /*用于引进样式，css,js,等放在public静态目录下*/
app.use('/upload',express.static('upload'));
app.use(session({       //配置session的中间件
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge:1000*60*30
    },
    rolling:true
}))
// app.use(function(req,res,next){//自定义中间件,登录状态的判断
//     console.log(req.url);
//     if(req.url=='/login' || req.url=='/doLogin'){
//         next()
//     }else{
//         if(req.session.userinfo && req.session.userinfo.username!=''){
//             app.locals['userinfo']=req.session.userinfo  //设置全局数据，在任何模板都可使用
//             next()
//         }else{
//             res.redirect('/login')
//         }
//     }
//
// })

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
app.post('/doProductAdd',function(req,res){
    var form=new multiparty.Form();
         form.uploadDir='upload'    //上传图片保存的地址
         form.parse(req,function(err,fields,files){
                  //获取提交的数据以及图片上传成功返回的图片信息
             // console.log(fields);//获取表单的数据
             // console.log(files);//图片上传成功返回的信息
             var title=fields.title[0];
             var price=fields.price[0]
             var fee=fields.fee[0];
             var description=fields.description[0];
             var pic=files.pic[0].path;

             DB.insert('product',{
                 title:title,
                 price:price,
                 fee,
                 pic,
                 description

             },function(err,data){
                 if(!err){
                     res.redirect('/product')
                 }
             })
         })
});


app.get('/productedit',function(req,res){
    var id=req.query.id;
    DB.find('product',{"_id":new DB.ObjectID(id)},function(err,data){
        res.render('productedit',{
            list:data[0]
        })
    })
});
app.post('/doProductEdit',function(req,res){
    var form=new multiparty.Form();
          form.uploadDir='upload';//上传图片保存的地址
          form.parse(req,function(err,fields,files){
                 //获取提交的数据以及图片上传成功返回的图片信息
              var _id=fields._id[0];//修改的条件
              var title=fields.title[0];
              var price=fields.price[0]
              var fee=fields.fee[0];
              var description=fields.description[0];
              var originalFilename=files.pic[0].originalFilename;
              var pic=files.pic[0].path;

              if(originalFilename){  /*修改了图片*/
                  var setData={
                      title,
                      price,
                      fee,
                      description,
                      pic
                  };
              }else{ /*没有修改图片*/
                  var setData={
                      title,
                      price,
                      fee,
                      description
                  };
                  //删除生成的临时文件
                  fs.unlink(pic);

              }


              DB.update('product',{"_id":new DB.ObjectID(_id)},setData,function(err,data){
                  if(!err){
                      res.redirect('/product');
                  }
              })

          })
})



app.get('/loginOut',function(req,res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
    })
})
app.get('/productdelete',function(req,res){
    var id=req.query.id;
    DB.deleteOne('product',{"_id":new DB.ObjectID(id)},function(error,data){
        if(!error){
            res.redirect('/product');
        }
    })
})

app.listen(8008);
console.log("http://127.0.0.1:8008/productadd");



