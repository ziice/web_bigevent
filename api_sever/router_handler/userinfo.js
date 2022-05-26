const db = require('../db/index');
const bcrypt = require('bcryptjs');
// 获取用户基本信息处理函数
module.exports.getUserInfo = function (req,res){
    const sql = `SELECT id,username,nickname,email,user_pic FROM ev_users WHERE id=?`;
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql,req.user.id,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.length !== 1){
            return res.cc('获取用户信息失败！');
        }
        res.send({
            status:0,
            message:'获取用户基本信息成功！',
            data:results[0]
        })
    })
}
module.exports.updateUserInfo = function (req,res){
    const sql = `UPDATE ev_users SET ? WHERE id = ?`;
    db.query(sql,[req.body,req.body.id],(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.affectedRows !== 1){
            return res.cc('修改用户基本信息失败！');
        }
        return res.cc('修改用户基本信息成功！',0);
    })
}
module.exports.updatePassword = function (req,res){
    const sql = `SELECT * FROM ev_users WHERE id=?`;
    db.query(sql,req.user.id,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.length!==1){
            return res.cc('用户不存在！');
        }
        const compareResult = bcrypt.compareSync(req.body.oldPwd,results[0].password);
        if(!compareResult){
            return res.cc('原密码错误!');
        }
        const sql2 = `UPDATE ev_users SET password=? WHERE id=?`;
        const newPwd = bcrypt.hashSync(req.body.newPwd,10);
        db.query(sql2,[newPwd,req.user.id],(err,results)=>{
            if(err){
                return res.cc(err);
            }
            if(results.affectedRows!==1){
                return res.cc('更新密码失败！');
            }
            return res.cc('更新密码成功！',0);
        })
    })
}
module.exports.updateAvatar = (req,res)=>{
    const sql = `UPDATE ev_users SET user_pic=? WHERE id=?`;
    db.query(sql,[req.body.avator,req.user.id],(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.affectedRows!==1){
            return('更新头像失败！');
        }
        return res.cc('更新头像成功！',0);
    })
}