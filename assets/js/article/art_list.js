$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    // 定义美化时间过滤器
    template.defaults.imports.dateFormat = function (date) {
        // console.log(date)
        const dt = new Date(date);
        // console.log(dt);
        let y = padZero(dt.getFullYear());
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象，将来请求数据时需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值
        pagesize: 3, // 页面显示几条数据
        cate_id: '所有分类', // 文章分类id
        state: '所有状态' // 文章发布状态
    }
    initTable();
    initCate();

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 使用模板引擎渲染页面数据
                // console.log(res.data.length)
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 渲染分页结构
        laypage.render({
            elem: 'pageBox', // 分页容器id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时触发jump函数
            // 触发jump回调的方式：1点击页码(first=undefine) 2调用laypage.render()(first=true)
            jump: function (obj, first) {
                // console.log(first)
                // console.log(obj.curr)
                // 把最新的页码值赋值给q这个查询参数对象中
                q.pagenum = obj.curr;
                // 切换条目也会触发jump函数，把最新的条目数赋值到q的这个查询参数对象中
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    }

    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        let len = $('.btn-delete').length;
        let id = $(this).attr('data-id');
        layer.confirm('确认删除?', {icon: 3, title: '提示'}, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 当删除后，需判断当前这一页是否还有剩余的数据
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum -= 1;
                        initTable();
                    } else {
                        initTable();
                    }
                }
            })
            layer.close(index);
        });
    })
    // $('tbody').on('click', '.btn-update', function () {
    //     let id = $(this).attr('data-id');
    //     location.href = 'http://localhost:63342/%E5%A4%A7%E4%BA%8B%E4%BB%B6/article/art_pub.html?id='+id;
    //     $.ajax({
    //         method: 'GET',
    //         url: '/my/article/' + id,
    //         success: function (res) {
    //             form.val('form-pub', res.data);
    //
    //         }
    //     })
    // })
    // $('#form-pub').on('submit',function (e) {
    //     e.preventDefault();
    //     $.ajax({
    //         method: 'POST',
    //         url: '/my/article/edit' + id,
    //         data: fd,
    //         contentType: false,
    //         processData: false,
    //         success: function (res) {
    //             if (res.state !== 0) {
    //                 return layer.msg(res.message);
    //             }
    //             layer.msg(res.message);
    //             location.href = 'http://localhost:63342/%E5%A4%A7%E4%BA%8B%E4%BB%B6/article/art_list.html';
    //         }
    //     })
    // })
})