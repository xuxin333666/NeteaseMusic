define(function(){
    function Render(ret){
        this.ret = ret || '';
    }
    Render.prototype= {
        // 渲染歌单歌曲列表
        songList: function(callback){
            var self = this;
            setTimeout(function(){
                var songList = document.querySelector('.songList')
                self.ret.forEach(function(value,index){
                    index = (index+1)<10?'0'+(index+1):index+1;
                    var li = document.createElement('li');
                    li.classList.add('song');
                    li.innerHTML = `<div class="Number">${index}</div><a href="./song.html?id=${value.id}">`+
                    `<h4 class="songName">${value.title}</h4>`+
                    `<p class="describe"><span class="SQ"></span>${value.author} - ${value.title}</p>`+
                    `<span class="play"></span></a>`;
                    songList.appendChild(li);
                });
                callback();
            },1000)
        },
        // 渲染歌单封面、背景等
        albumHeader: function(n){
            var ret = this.ret[n];
            document.querySelector('header').style.background = `url(${ret.bgimg}) no-repeat`;
            document.querySelector('header').style.backgroundSize = 'cover';
            document.querySelector('.coverCt>.cover').setAttribute('src',ret.cover);
            document.querySelector('.content>.title').innerHTML = ret.describe;
            document.querySelector('.abstract').innerHTML = ret.additional;
        }
    }
    return Render;
})