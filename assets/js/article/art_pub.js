$(function (){
    let layer = layui.layer;
    let form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function (res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    let $image = $('#image');
    let options = {
        aspectRatio:400/280,
        preview:'.img-preview'
    }
    $image.cropper(options);
    $('#btnChooseImage').on('click',function (){
        $('#coverFile').click();
    })

    $('#coverFile').on('change',function (e){
        // 获取到文件的列表数组
        let files = e.target.files;
        // 判断用户是否选择了文件
        if(files.length===0){
            return;
        }
        // 根据文件创建对应的URL地址
        let newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src',newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 定义文章的发布状态
    let art_state='已发布';
    $('#btnSave2').on('click',function (){
        art_state='草稿'
    })
    $('#form-pub').on('submit',function (e){
        e.preventDefault();
        // 基于form表单快速创建一个FormData对象
        let fd = new FormData($(this)[0]);
        fd.append('state',art_state);
        fd.forEach(function (v,k){
            console.log(k,v)
        })
        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas',{
                width:400,
                height:280
            })
            .toBlob(function (blob){
                // 将Canvas画布上的内容,转化为base64格式的字符串
                fd.append('cover_img',blob);
                publishArticle(fd);
            });
        function publishArticle(fd){
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data:fd,
                // 如果向服务器提交的是FormData格式的数据，必须添加以下两个配置项
                contentType:false,
                processData:false,
                success:function (res){
                    if(res.status!==0){
                        return res.msg(res.message);
                    }
                    layer.msg('发布文章成功！');
                    location.href = 'http://localhost:63342/%E5%A4%A7%E4%BA%8B%E4%BB%B6/article/art_list.html';
                }
            })
        }
    })
})