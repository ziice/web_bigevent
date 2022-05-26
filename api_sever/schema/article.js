// 安装 `@hapi/joi` 包，为表单中携带的每个数据项，定义验证规则：
const joi = require('joi');
// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required();
const cate_id = joi.number().integer().min(1).required();
const content = joi.string().required().allow('');
const state = joi.string().valid('已发布','草稿').required();
module.exports.add_article_schema = {
    body:{
        title,
        cate_id,
        content,
        state
    }
}
const id = joi.number().integer().min(1).required();
module.exports.delete_article_schema={
    params:{
        id:id
    }
}
module.exports.get_article_schema={
    params:{
        id:id
    }
}
module.exports.update_article_schema={
    body:{
        id:id,
        title:title,
        cate_id:cate_id,
        content:content,
        state:state
    }
}