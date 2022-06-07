const db = require('../db/index')
module.exports.addArticle = function (req, res) {
    // console.log(req.body); // 文本类型的数据
    // console.log(req.file); // 文件类型的数据
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面是必选参数！');
    }
    const path = require('path');
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id
    }
    const sql = `INSERT INTO ev_articles SET ?`;
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) {
            return res.cc('发布文章失败！');
        }
        res.cc('发布文章成功', 0);
    })
}
module.exports.getArticle = function (req,res){
    let sql = null;
    let data = null;
    let data2 = null;
    let cal_offset = (Number(req.query.pagenum)-1)*Number(req.query.pagesize);
    // let sql2 = 'SELECT COUNT(*) FROM my_db_01.ev_articles';
    let sql2 = null;
    if(req.query.cate_id==='所有分类' && req.query.state==='所有状态'){
        sql = `SELECT ea.id,ea.title,ea.pub_date,ea.state,eac.name as cate_name FROM my_db_01.ev_article_cate eac,my_db_01.ev_articles ea WHERE ea.cate_id = eac.id AND ea.is_delete = 0 ORDER BY ea.id ASC LIMIT ? OFFSET ?`;
        sql2 = `SELECT ea.id,ea.title,ea.pub_date,ea.state,eac.name as cate_name FROM my_db_01.ev_article_cate eac,my_db_01.ev_articles ea WHERE ea.cate_id = eac.id AND ea.is_delete = 0 ORDER BY ea.id ASC`;
        data = [Number(req.query.pagesize),cal_offset];
    }else if(req.query.state==='所有状态'){
        sql = `SELECT ea.id,ea.title,ea.pub_date,ea.state,eac.name as cate_name FROM my_db_01.ev_article_cate eac,my_db_01.ev_articles ea WHERE ea.cate_id = eac.id AND ea.is_delete = 0 AND ea.cate_id = ? ORDER BY ea.id ASC LIMIT ? OFFSET ?`;
        sql2 = `SELECT ea.id,ea.title,ea.pub_date,ea.state,eac.name as cate_name FROM my_db_01.ev_article_cate eac,my_db_01.ev_articles ea WHERE ea.cate_id = eac.id AND ea.is_delete = 0 AND ea.cate_id = ? ORDER BY ea.id ASC`;
        data = [req.query.cate_id,Number(req.query.pagesize),cal_offset];
        data2 = [req.query.cate_id];
    }else if(req.query.cate_id==='所有分类'){
        sql = `SELECT ea.id,ea.title,ea.pub_date,ea.state,eac.name as cate_name FROM my_db_01.ev_article_cate eac,my_db_01.ev_articles ea WHERE ea.cate_id = eac.id AND ea.is_delete = 0 AND ea.state = ? ORDER BY ea.id ASC LIMIT ? OFFSET ?`;
        sql2 = `SELECT ea.id,ea.title,ea.pub_date,ea.state,eac.name as cate_name FROM my_db_01.ev_article_cate eac,my_db_01.ev_articles ea WHERE ea.cate_id = eac.id AND ea.is_delete = 0 AND ea.state = ? ORDER BY ea.id ASC`;
        data = [req.query.state,Number(req.query.pagesize),cal_offset];
        data2 = [req.query.state];
    }else{
        sql = `SELECT ea.id,ea.title,ea.pub_date,ea.state,eac.name as cate_name FROM my_db_01.ev_article_cate eac,my_db_01.ev_articles ea WHERE ea.cate_id = eac.id AND ea.is_delete = 0 AND ea.cate_id = ? AND ea.state = ? ORDER BY ea.id ASC LIMIT ? OFFSET ?`;
        sql2 = `SELECT ea.id,ea.title,ea.pub_date,ea.state,eac.name as cate_name FROM my_db_01.ev_article_cate eac,my_db_01.ev_articles ea WHERE ea.cate_id = eac.id AND ea.is_delete = 0 AND ea.cate_id = ? AND ea.state = ? ORDER BY ea.id ASC`;
        data = [req.query.cate_id,req.query.state,Number(req.query.pagesize),cal_offset];
        data2 = [req.query.cate_id,req.query.state];
    }
    db.query(sql2,data2,(err,results2)=>{
        db.query(sql,data,(err,results)=>{
            if(err){
                return res.cc(err);
            }
            res.send({
                status:0,
                message:'获取文章列表成功！',
                data:results,
                total:results2.length
            })
        })
    })

}
module.exports.deleteArtById = function (req,res){
    const sql = 'UPDATE ev_articles SET is_delete = 1 WHERE id=?';
    db.query(sql,req.params.id,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.affectedRows!==1){
            return res.cc('删除文章失败！');
        }
        res.cc('删除文章成功!',0);
    })
}
module.exports.getArticleById = function (req,res){
    const sql = `SELECT * FROM ev_articles WHERE id = ?`;
    db.query(sql,req.params.id,(err,results)=>{
        if(err) {
            return res.cc(err);
        }
        if(results.length!==1){
            return res.cc('获取文章数据失败！');
        }
        res.send({
            status:0,
            message:'获取文章数据成功！',
            data:results[0]
        })
    })
}
module.exports.updateArticleById = function (req,res){
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面是必选参数！');
    }
    const path = require('path');
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // // 文章发布时间
        // pub_date: new Date(),
        // // 文章作者的Id
        // author_id: req.user.id
    }
    const sql = `UPDATE ev_articles SET ? WHERE id = ? `;
    db.query(sql,[articleInfo,req.body.id],(err,results)=>{
        if(err) {
            return res.cc(err);
        }
        if(results.affectedRows !== 1){
            return res.cc('更新文章失败！');
        }
        res.cc('更新文章成功!',0);
    })
}