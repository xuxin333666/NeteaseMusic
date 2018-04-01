define(['lib/ajax','renderIndex'],function(ajax,render){
    ajax.on({
        url: './songList.json',
        success: function(ret){
            r1 = new render(ret);
            r1.songList();
        },
        error: function(){
            alert('网络错误')
        }
    })
    ajax.on({
        url: './tuijian-list.json',
        success: function(ret){
            r2 = new render(ret);
            r2.tuijianList();
        },
        error: function(){
            alert('网络错误')
        }
    })
})