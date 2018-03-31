define(['lib/ajax'],function(Ajax){
    function PlaySong(ret){
        this.title = ret[0].title || '无题';
        this.author = ret[0].author || '网络歌手';
        this.audioUrl = ret[0].audioUrl || '';
        this.cover = ret[0].cover || '';
        this.bgimg = ret[0].bgimg || ''; 
        this.audioNode = document.createElement('audio');
        this.audioNode.setAttribute('src',this.audioUrl);
        var self = this;
        Ajax.on({
            url: '../../../lyrric.json',
            success: function(ret){
                self.parseLrc(ret[0])
            }
        })
    }
    PlaySong.prototype = {
        parseLrc: function(ret){
            var self = this;
            this.lrcArr = ret.lyric.split('↵')
            this.reg = /^\[(.+)\](.*)$/;
            this.arr = this.lrcArr.map(function(value){
                var lrcObj = {};
                if( self.reg.exec(value)!==null){
                    lrcObj= {
                        time: self.reg.exec(value)[1],
                        words: self.reg.exec(value)[2]
                    };
                }else{
                    lrcObj = {
                        time: '----------',
                        words:'----------'
                    }
                }
                return lrcObj;
            })
            self.render(this.arr);
        },
        render: function(arr){
            var lyricsCt = document.querySelector('.lyricsCt');
            var title = document.querySelector('.songName')
            title.innerHTML = this.title + `- <span class="author">${this.author}</span>`;
            for (let i = 0; i < arr.length; i++) {
                var lrcP = document.createElement('p');
                lrcP.classList.add('lyrics');
                lrcP.innerText = arr[i].words;
                lyricsCt.appendChild(lrcP);
            }
        },
        audioPause: function(){
            this.audioNode.pause();
        },
        audioPlay: function(){
            this.audioNode.play();
        }
    }
    return PlaySong;
})