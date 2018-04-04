define(['jquery','lib/ajax'],function($,Ajax){
    function PlaySong(ret,id){
        this.id = id || 1;
        this.title = ret[this.id].title || '无题';
        this.author = ret[this.id].author || '网络歌手';
        this.audioUrl = ret[this.id].audioUrl || '';
        this.cover = ret[this.id].cover || '';
        this.bgimg = ret[this.id].bgimg || ''; 
        this.lyric = ret[this.id].lyric || ''; 
        this.audioNode = document.createElement('audio');
        this.otherLink = document.querySelector('.otherLink');
        this.otherMusicCt = document.querySelector('.otherMusicCt');
        this.linkLoading = document.querySelector('.otherLink>.loading');
        this.musicLoading = document.querySelector('.otherMusicCt>.loading');
        this.audioNode.setAttribute('src',this.audioUrl);
        this.renderOtherMusic(ret);
        this.parseLrc(this.lyric);
    }
    PlaySong.prototype = {
        // 解析歌词为一个含有时间、歌词属性对象的数组
        parseLrc: function(ret){
            this.lrcArr = ret.split('↵')
            this.reg = /^\[(.+)\](.*)$/;
            this.arr = [];
            for (let i = 0; i <  this.lrcArr.length; i++) {
                var lrcObj = {};
                if( this.reg.exec(this.lrcArr[i])!== null){
                    lrcObj= {
                        time: this.reg.exec(this.lrcArr[i])[1],
                        words: this.reg.exec(this.lrcArr[i])[2]
                    };
                    this.arr.push(lrcObj);
                }               
            }
            this.render(this.arr);
        },
        // 将解析的歌词渲染成P标签
        render: function(arr){
            var self = this;
            var lyricsCt = document.querySelector('.lyricsCt');
            var title = document.querySelector('.songName');
            document.querySelector('div.bgimg').style.background = `url("${self.bgimg}") top center / cover fixed`;
            document.querySelector('footer').style.background = `url("${self.bgimg}") bottom center / cover fixed`;
            document.querySelector('.cover').setAttribute('src',this.cover);
            title.innerHTML = this.title + `- <span class="author">${this.author}</span>`;
            for (let i = 0; i < arr.length; i++) {
                var lrcP = document.createElement('p');
                lrcP.classList.add('lyrics');
                lrcP.setAttribute('data-time',arr[i].time)
                lrcP.innerText = arr[i].words;
                lyricsCt.appendChild(lrcP);
            }
        },
        // 渲染“喜欢这首歌的人也听”歌曲列表
        renderOtherMusic: function(ret){
            var self = this;
            ret.forEach(function(value){
                if(value.id !== parseInt(self.id) && Math.floor(Math.random()*2)){
                    var otherMusic = document.createElement('li');
                    otherMusic.classList.add('clearfix');
                    otherMusic.innerHTML = 
                    `<a href="./song.html?id=${value.id}">`+
                        `<img src="${value.cover}" alt="">`+
                        `<div class="playOther"></div>`+
                        `<h4 class="overflow">${value.title}</h4>`+
                        `<p class="overflow">${value.author}-${value.title}</p>`+
                    `</a>`
                    self.otherMusicCt.appendChild(otherMusic);
                }
            })
            this.musicLoading.classList.add('action');   
        },
        // 渲染“含有这首歌的歌单”列表
        renderOther: function(ret){
            var self = this;
            var arr = [1,2,3,4,5,6];
            for (let i = 0; i < 3; i++) {
                var index = Math.floor(Math.random()*arr.length)
                arr = arr.filter(function(value,arrIndex){
                    if(arrIndex !== index){
                        return value
                    }
                });
            } 
            ret.forEach(function(value,index){
                if(arr.indexOf(index+1)!==-1){
                    var other = document.createElement('li');
                    other.innerHTML = `<a href="./album?id=${index}"><img src="${value.cover}" alt=""><h5 class="overflow">${value.describe}</h5><p class="overflow">${value.additional}</p></a>`;
                    self.otherLink.appendChild(other);                   
                }
            })
            this.linkLoading.classList.add('action');   
        },
        // 将播放时间转换成00:00.00形式
        playlyrics: function(){
            var self = this;
            this.lyricsCt = document.querySelector('.lyricsCt');
            this.lyrics = document.querySelectorAll('.lyrics');
            this.setTimeOut = setInterval(function(){
               var playTime = self.audioNode.currentTime;
               var minutes = Math.floor(playTime/60);
               var seconds = Math.floor(playTime%60);
               var selfTime = Math.floor((playTime - minutes*60 - seconds)*60)
               minutes = minutes >= 10 ? minutes : '0' + minutes;
               seconds = seconds >= 10 ? seconds : '0' + seconds;
               selfTime   = selfTime   >= 10 ? selfTime  : '0' + selfTime ;
               var timeStr = minutes + ':' + seconds + '.' +  selfTime;
               self.lyricsSelect(timeStr);              
            },300)
        },
        // 根据播放时间选择出相应的歌词P标签
        lyricsSelect: function(time){
            var self = this;
            for (let i = 0; i < self.lyrics.length; i++) {
                if(self.lyrics[i+1] && self.lyrics[i].getAttribute('data-time') <= time && self.lyrics[i+1].getAttribute('data-time') > time){
                    var lyricsNow = self.lyrics[i]
                    break;  
                }else if(!self.lyrics[i+1] && self.lyrics[i].getAttribute('data-time') <= time){
                    var lyricsNow = self.lyrics[i]
                    break;  
                }
            }
            if(lyricsNow ){
                for (let i = 0; i < self.lyrics.length; i++) {
                    self.lyrics[i].classList.remove('action');                   
                }
                lyricsNow.classList.add('action');
                self.lyricsScroll(lyricsNow);
            }
            
        },
        // 将选择出的P标签滚动起来
        lyricsScroll: function(now){
            var distance = now.offsetTop - this.lyrics[1].offsetTop;
            if(distance > 0){
                $(this.lyricsCt).css('-webkit-transform',`translateY(-${distance}px)`);
                // this.lyricsCt.style.transform = `translateY(-${distance}px)`
            }else{
                $(this.lyricsCt).css('-webkit-transform',`translateY(-.1px)`);
                // this.lyricsCt.style.transform = `translateY(-.1px)`;
            }
        },
        // 暂停歌词滚动计时器
        pauselyrics: function(){
            var self = this;
            clearInterval(self.setTimeOut);
        },
        // 音频暂停
        audioPause: function(){
            this.audioNode.pause();
        },
        // 音频播放
        audioPlay: function(){
            this.audioNode.play();
        }
    }
    return PlaySong;
})
