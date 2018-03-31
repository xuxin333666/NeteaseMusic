define(function(){
    function Render(ret ){
        this.ret = ret || '';
        this.latestCt = document.querySelector('.latestCt');
        this.loading = document.querySelector('.loading');
        this.songList()
    }
    Render.prototype = {
        songList: function(){
            var self = this;
            this.ret.forEach(function(value){
                var songListLi = document.createElement('li');
                songListLi.classList.add('latest');
                songListLi.innerHTML = `<a href="./song.html?id=${value.id}">`+
                `<h4 class="songName">${value.title}</h4>`+
                `<p class="describe"><span class="SQ"></span>${value.author} - ${value.title}</p>`+
                `<a href="./song.html?id=${value.id}" class="play"></a></a>`;
                self.latestCt.appendChild(songListLi);
            })
            this.loading.classList.add('action')
        }
    }
    return Render;
})