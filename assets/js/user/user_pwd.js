$(function (){
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        samePwd:function (value){
            let pwd = $('[name=oldPwd]').val();
            if(value === pwd){
                return '新旧密码不能相同！';
            }
        },
        rePwd:function (value){
            let pwd = $('[name=newPwd]').val();
            if(pwd !== value){
                return '两次密码不一致！';
            }
        }
    })
    $('.layui-form').on('submit',function (e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
            }
        })
        // 重置表单：jQuery转为原生DOM元素，拿到form表单方法
        $('.layui-form')[0].reset();
    })
})