$(function (){
    let $image = $('#image');
    let layer = layui.layer;
    const options = {
        // 纵横比
        aspectRatio:1,
        // 指定预览区域
        preview:'.img-preview'
    }
    // 创建裁剪区域
    $image.cropper(options);
    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click',function (){
        $('#file').click();
    })
    $('#file').on('change',function (e){
        // 拿到用户选择的文件
        let filelist = e.target.files;
        if(filelist.length===0){
            return layer.msg('请选择照片');
        }
        let file = filelist[0];
        // 根据选择的文件,创建一个对应的url地址
        let newImgURL = URL.createObjectURL(file);
        // console.log(newImgURL);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src',newImgURL) // 更新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click',function (){
        let dataURL = $image
            .cropper('getCroppedCanvas',{ // 创建一个Canvas画布
                width:100,
                height:100
            })
            .toDataURL('../../image/png'); // 将Canvas画布上的内容,转化为base64格式的字符串
        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success:function (res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })
})