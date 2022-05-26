const express = require('express');
const router = express.Router();
const user_handler = require('../router_handler/user');
// `@escook/express-joi` 中间件，来实现自动对表单数据进行验证的功能
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const {reg_login_schema} = require('../schema/user');
router.post('/reguser',expressJoi(reg_login_schema),user_handler.regUser);
router.post('/login',expressJoi(reg_login_schema),user_handler.login);
module.exports = router;