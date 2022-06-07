// const {template} = require("../../lib/template-web");
$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initArtCateList();

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    let indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        })
    })
    // 通过代理为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                layer.close(indexAdd);
            }
        })
    })
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })
        let id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res.data);
                form.val('form-edit', res.data);
            }
        })
    })
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                layer.close(indexEdit);
            }
        })
    })
    $('body').on('click','.btn-delete',function (){
        let id = $(this).attr('data-id');
        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function (res){
                    if(res.status!==0){
                        return layer.msg(res.message);
                    }
                    layer.msg(layer.message);
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })
})