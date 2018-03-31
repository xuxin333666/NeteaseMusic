define(['lib/ajax','renderIndex'],function(ajax,render){
    ajax.on({
        url: './songList.json',
        success: function(ret){
            new render(ret)
        },
        error: function(){
            alert('网络错误')
        }
    })
})