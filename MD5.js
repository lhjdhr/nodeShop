/**
 * Created by 李会娟 on 2018/2/5.
 */
/*数据库的修改：db.user.update({"username":"li"},{$set:{"password":"202cb962ac59075b964b07152d234b70"}})
  123:202cb962ac59075b964b07152d234b70
   111:698d51a19d8a121ce581499d7b701668
* 1,安装 npm i md5-node --save
* 2.引入 var md5=require("md5-node");
* 3.使用  md5('123')
*
*
*
*var md5=require('md5-node');

 //console.log(md5('123'));//202cb962ac59075b964b07152d234b70
 //console.log(md5('456'));//250cf8b51c773f3f8dc8b4be867a9a02
 var crypto = require("crypto");
 module.exports = function(mingma){
 var md5 = crypto.createHash('md5');
 var password = md5.update(mingma).digest('base64');
 return password;
 }

 *
* */
