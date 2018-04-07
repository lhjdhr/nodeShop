/**
 * Created by 李会娟 on 2018/2/5.
 */
var express=require('express');
var md5=require('md5-node');
var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/
var DB=require('../../modules/db.js');  /*引入DB数据库*/

var bodyParser=require('body-parser');//数据解析获取表单提交的数据
var multiparty = require('multiparty');  /*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
var  fs=require('fs');
router.use(bodyParser.urlencoded({ extended: false }));// 设置body-parser中间件，获取post，解析获取的
router.use(bodyParser.json());

router.get('/',function(req,res){
    DB.find('user',{},function(err,data){
        res.render('admin/user/index',{
            list:data
        });
    })
});
// var md5=require('../../modules/md5.js');


//处理登录的业务逻辑
router.get('/add',function(req,res){
    res.render('admin/user/add');
})
//doAdd
router.post('/doAdd',function(req,res){
    var form = new multiparty.Form();//获取表单的数据
    form.parse(req, function(err, fields) {
        //console.log(fields);  /*获取表单的数据*/
        var username=fields.username[0];
        var password=fields.password[0];
              password = md5(password);
        var description=fields.description[0];
        DB.insert('user',{
            username:username,
            password:password,
            description
        },function(err,data){
            if(!err){
                res.redirect('/admin/user'); /*上传成功跳转到首页*/
            }
        })
    });

})

router.get('/edit',function(req,res){
    var id=req.query.id;
    console.log(id);
    //去数据库查询这个id对应的数据     自增长的id 要用{"_id":new DB.ObjectID(id)
    DB.find('user',{"_id":new DB.ObjectID(id)},function(err,data){
        res.render('admin/user/edit',{
            list:data[0]
        });
    });
})

router.post('/doEdit',function(req,res){//获取登录提交的数据
    // var _id= req.body.id;
    var  _id=req.query.id;
    var username=req.body.username;
    var password= req.body.password;
         password=md5(password);
    var description= req.body.description;
    DB.update('user',{"_id":new DB.ObjectID(_id)},{
            username:username,
            password:password,
            description
        },function(err,data){
            if(!err){
                res.redirect('/admin/user');
            }
        })
});

router.get('/delete',function(req,res){
    var  id=req.query.id;
    DB.deleteOne('user',{"_id":new DB.ObjectID(id)},function(err){
        if(!err){
            res.redirect('/admin/user');
        }
    })
})

module.exports = router;   /*暴露这个 router模块*/


