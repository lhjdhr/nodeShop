/**
 * Created by 李会娟 on 2018/2/5.
 */
/**
 * Created by 李会娟 on 2018/2/5.
 */
var express=require('express');
var router=express.Router();

//该路由使用的中间插件
// router.use(function(){})
router.get('/',function(req,res){
    res.send("index")
});
router.get('/login',function(req,res){
    res.send("login")
})

module.exports=router;