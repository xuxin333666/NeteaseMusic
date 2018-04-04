define(['selectKeyword','lib/ajax','renderAlbum'],function(Select,ajax,render){
    function _(e){
        return document.querySelector(e);
    }
    function _A(e){
        return document.querySelectorAll(e);
    }
    var showMore = _('.abstractCt>.showMore');
    var abstract = _('.abstract');
    var loading = _('.loading');
    // 解析网址get信息
    select = new Select(window.location.search,/id=([^&]+)/);
    var songId = select.filter();
    // 发送ajax请求获取该专辑相应数据及歌曲列表
    ajax.on({
        url: './songList.json',
        success: function(ret){
            r1 = new render(ret);
            r1.songList(function(){
                loading.classList.add('action');
            });
        },
        error: function(){
            alert('网络错误');
        }
    })
    ajax.on({
        url: './tuijian-list.json',
        success: function(ret){
            r2 = new render(ret);
            r2.albumHeader(songId);
        },
        error: function(){
            alert('网络错误');
        }
    })
    // 设置“点击简介下拉菜单，获得更多简介”的功能
    showMore.addEventListener('click',function(){
        showMore.classList.toggle('action');
        abstract.classList.toggle('action');
    })
})
