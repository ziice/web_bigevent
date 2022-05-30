const db = require('../db/index');
const bcrypt = require('bcryptjs');
// 导入生成Token包
const jwt = require('jsonwebtoken');
const config = require('../config');
module.exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body;
    // console.log(userinfo);
    // 对表单中的数据进行合法性校验
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({status: 1, message: '用户名或密码不合法！'});
    //     return res.cc('用户名或密码不合法！');
    // }
    // 检测用户名是否被占用
    const sqlStr = 'SELECT * FROM ev_users WHERE username=?';
    const sql = 'INSERT INTO ev_users SET ?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            return res.cc(err);
            // return res.send({status: 1, message: err.message});
        }
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名!');
        }
        // 对密码进行加密处理 `bcrypt.hashSync(明文密码, 随机盐的长度)`
        // 用 `bcryptjs` 对用户密码进行加密，优点：加密之后的密码，无法被逆向破解；同一明文密码多次加密，得到的加密结果各不相同，保证了安全性
        // console.log(userinfo);
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // console.log(userinfo);
        db.query(sql, {username: userinfo.username, password: userinfo.password}, (err, results) => {
            if (err) {
                return res.cc(err);
            }
            if (results.affectedRows !== 1){
                return res.cc('注册用户失败，请稍后再试！');
            }
            return res.cc('注册成功！请登录',0);
        })
    })
    // res.send('register OK');
}
module.exports.login = (req, res) => {
    const userinfo = req.body;
    const sql = 'SELECT * FROM ev_users WHERE username=?';
    db.query(sql,userinfo.username,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.length !== 1){
            return res.cc('登陆失败！');
        }
        // 调用 `bcrypt.compareSync(用户提交的密码, 数据库中的密码)` 方法比较密码是否一致
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password);
        if(!compareResult){
            return res.cc('登陆失败！');
        }
        // 在服务器端生成TOKEN字符串
        const user = {...results[0],password:'',user_pic:''};
        // 对用户的信息加密，生成Token字符串
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn});
        // console.log(tokenStr);
        res.send({
            status:0,
            message:'登陆成功',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token:'Bearer '+tokenStr
        })
    })
    // res.send('login OK');
}