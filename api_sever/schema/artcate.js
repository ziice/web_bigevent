// 安装 `@hapi/joi` 包，为表单中携带的每个数据项，定义验证规则：
const joi = require('joi');
const name = joi.string().required();
const alias = joi.string().alphanum().required();
module.exports.add_cate_schema = {
    body:{
        name:name,
        alias:alias
    }
}
const id2 = joi.number().integer().min(1).required();
module.exports.delete_cate_schema={
    params:{
        id:id2
    }
}
module.exports.get_cate_schema={
    params:{
        id:id2
    }
}
module.exports.update_cate_schema = {
    body:{
        id:id2,
        name:name,
        alias:alias
    }
}