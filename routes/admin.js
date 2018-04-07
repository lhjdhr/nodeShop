/**
 * Created by 李会娟 on 2018/2/5.
 */
var express=require('express');
var router=express.Router();

//后台的处理，所有的后台处理都要经过这里
var login=require('./admin/login.js');
var product=require('./admin/product.js');
var user=require('./admin/user.js');

router.use(function(req,res,next){
    console.log(req.url);
    if(req.url=='/login' || req.url=='/login/doLogin'){
        next();
    }else{
        if(req.session.userinfo&&req.session.userinfo.username!=''){
            req.app.locals['userinfo']=req.session.userinfo;   //请求全局
            next();
        }else{
            res.redirect('/admin/login')
        }
    }
})

//配置路由
router.use('/login',login)
router.use('/product',product)
router.use('/user',user);
module.exports=router;