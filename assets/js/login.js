$(function (){
    // 点击“去注册账号”链接
    $('#link_reg').on('click',function (){
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击“去登录账号”链接
    $('#link_login').on('click',function (){
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 从layui中获取form对象
    let form = layui.form;
    let layer = layui.layer;
    // 通过form.verify()自定义校验规则
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'], // [\S]非空格字符
        repwd: function (value){
            let pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    })
    // 监听注册表单的提交事件
    let data = {username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()};
    $('#form_reg').on('submit',function (e){
        // 阻止默认提交行为
        e.preventDefault();
        $.post('http://127.0.0.1/api/reguser',data,function (res){
            if(res.status!==0){
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            $('#link_login').click();
        })
    })
    // 监听登录表单的提交事件
    $('#form_login').submit(function (e){
        e.preventDefault();
        $.ajax({
            url:'http://127.0.0.1/api/login',
            method:'post',
            data:$(this).serialize(), // 快速获取表单数据
            success:function (res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                layer.msg('登录成功！');
                // 将登录成功得到的token保存到localStorage中
                localStorage.setItem('token',res.token);
                location.href = '../index.html';
            }
        })
    })
})