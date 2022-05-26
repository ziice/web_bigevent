const express = require('express');
const router = express.Router();
const expressJoi = require('@escook/express-joi');
const {get_cate_schema,add_cate_schema,delete_cate_schema,update_cate_schema} = require('../schema/artcate');
const artCate_handler = require('../router_handler/artcate');
router.get('/cates',artCate_handler.getArticleCates);
router.post('/addcates',expressJoi(add_cate_schema),artCate_handler.addArticleCates);
router.get('/deletecate/:id',expressJoi(delete_cate_schema),artCate_handler.deleteCateById);
router.get('/cates/:id',expressJoi(get_cate_schema),artCate_handler.getArticleById);
router.post('/updatecate',expressJoi(update_cate_schema),artCate_handler.updateCateById)
module.exports = router;