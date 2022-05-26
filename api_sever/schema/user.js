// 安装 `@hapi/joi` 包，为表单中携带的每个数据项，定义验证规则：
const joi = require('joi');
/*
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
*/
// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required(); // ^$以什么开头，以什么结尾；\S非空字符6-12位之间
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();
// 定义验证注册和登录表单数据的规则对象
module.exports.reg_login_schema={
    body:{
        username,
        password,
    }
}
module.exports.updata_userinfo_schema={
    body:{
        id:id,
        nickname:nickname,
        email:email
    }
}
/* joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
 * joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
 * concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
*/
module.exports.update_password_schema = {
    body:{
        oldPwd:password,
        newPwd:joi.not(joi.ref('oldPwd')).concat(password)
    }
}
// dataUri() 指的是如下格式的字符串数据：data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avator = joi.string().dataUri().required();
module.exports.update_avatar_schema = {
    body:{
        avator: avator
    }
}

