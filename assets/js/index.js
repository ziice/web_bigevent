$(function (){
    let layer = layui.layer;
    getUserInfo(layer);
    $('#btnLogout').on('click',function (){
        // 提示用户是否退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            // 清空本地存储的token
            localStorage.removeItem('token');
            location.href='http://localhost:63342/%E5%A4%A7%E4%BA%8B%E4%BB%B6/login.html';
            layer.close(index);
        });
    })
})
// 获取用户基本信息
function getUserInfo(layer){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function (res){
            if(res.status!==0)
                return layer.msg(res.message);
            renderAvatar(res.data);
        }
    })
}
// 调用renderAvatar渲染用户的头像
function renderAvatar(user){
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name);
    if(user.user_pic!==null){
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    }else{
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}
