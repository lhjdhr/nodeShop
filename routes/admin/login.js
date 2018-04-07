/**
 * Created by 李会娟 on 2018/2/5.
 */
var express=require('express');
var router=express.Router();//可以使用express.Router()类创建模块化
var bodyParser=require('body-parser');//数据解析获取表单提交的数据
var md5=require('md5-node'); //MD5加密模块
var DB=require('../../modules/db.js');




router.use(bodyParser.urlencoded({ extended: false }));// 设置body-parser中间件，获取post，解析获取的
router.use(bodyParser.json());

router.get('/',function(req,res){
    res.render('admin/login')
});
//处理登录的业务逻辑
router.post('/doLogin',function(req,res){//获取登录提交的数据
    var username=req.body.username;
    var password=md5(req.body.password);  /*要对用户输入的密码加密*/
    DB.find('user',{                        //1.获取数据
        username:username,                 //2.连接数据库查询数据
        password:password
    },function(err,data){
        if(data.length>0){
            console.log('登录成功');
            req.session.userinfo=data[0];//保存用户信息
            res.redirect('/admin/product');  /*登录成功跳转到商品列表*/
        }else{
            res.send("<script>alert('登录失败');location.href='/admin/login'</script>");
        }
    })
});
router.get('/loginOut',function(req,res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/admin/login');
        }
    })
})

module.exports=router;