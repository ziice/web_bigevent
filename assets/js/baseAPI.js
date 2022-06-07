// 每次调用$.get()、post()、ajax()时，会调用.ajaxPrefilter函数，在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options){
    // console.log(options.url);
    options.url = 'http://127.0.0.1:80' + options.url;
    // 统一为有权限的接口，设置headers请求头
    if(options.url.indexOf('/my')!==-1){
        options.headers = {
            Authorization:localStorage.getItem('token')||'',
        }
    }
    // 全局统一挂载complete回调函数
    // 无论成功或是失败，都会调用该函数
    options.complete = function (res){
        // 拿到服务器响应回来的数据
        // console.log(res);
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 强制清空token
            localStorage.removeItem('token');
            location.href='http://localhost:63342/%E5%A4%A7%E4%BA%8B%E4%BB%B6/login.html';
        }
    }
})
