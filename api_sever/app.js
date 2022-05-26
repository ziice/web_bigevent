const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// 配置解析 `application/x-www-form-urlencoded` 格式的表单数据的中间件
app.use(express.urlencoded({extended:false}));
// 所有路由之前，声明一个全局中间件，为 res 对象挂载一个 `res.cc()` 函数
app.use((req,res,next)=>{
    res.cc = function (err,status = 1){
        res.send({
            status,
            message:err instanceof Error ? err.message:err
        });
    };
    next();
})
// 在路由之前配置解析Token的中间件
const expressJWT = require('express-jwt');
const config = require('./config');
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api\//]}));
// 导入并使用用户路由模块
const userRouter = require('./router/user');
app.use('/api',userRouter);
// 导入并使用用户信息模块
const userinfoRouter = require('./router/userinfo');
app.use('/my',userinfoRouter);
// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate');
app.use('/my/article/',artCateRouter);
const articleRouter = require('./router/article')
app.use('/my/article/',articleRouter);
const joi = require('joi');
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
// 定义错误级别中间件
app.use((err,req,res,next)=>{
    // 验证失败的错误
    if(err instanceof joi.ValidationError){
        return res.cc(err);
    }
    // 身份认证失败错误
    if(err.name === 'UnauthorizedError'){
        return res.cc('身份认证失败！');
    }
    // 未知的错误
    res.cc(err);
})
app.listen(80,()=>{
    console.log('api server running at http://127.0.0.1');
})
