define(function(){
    function Render(ret){
        this.ret = ret || '';
        this.latestCt = document.querySelector('.latestCt');
        this.tujianMusic = document.querySelector('.tujianMusic');
        this.loading = document.querySelector('.songlist.loading');
        this.tuijianLoading = document.querySelector('.tuijian.loading');
    }
    Render.prototype = {
        // 渲染最新歌曲列表
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
        },
        // 渲染推荐歌单列表
        tuijianList: function(){
            var self = this;
            this.ret.forEach(function(value){
                var tuijianListLi = document.createElement('li');
                tuijianListLi.classList.add('coverList');
                tuijianListLi.innerHTML = `<a href="./album?id=${value.id}">`+
                    `<img src="${value.cover}" alt="" class="cover">`+
                    `<p class="describe">${value.describe}</p></a>`;
                self.tujianMusic.appendChild(tuijianListLi);
            })
            this.tuijianLoading.classList.add('action')
        },
        // 渲染热歌榜
        getHotMusic: function(){
            var self = this;
            var a = document.querySelector('.showMore');
            document.querySelector('.update').innerHTML = '更新日期：' + this.getUpdateTime();
            setTimeout(function(){
                var ranking = document.querySelector('.ranking')
                document.querySelector('.hotMusic.loading').classList.add('action');
                self.ret.forEach(function(value,index){
                    index = (index+1)<10?'0'+(index+1):index+1;
                    var li = document.createElement('li');
                    li.classList.add('rankNumber');
                    li.innerHTML = 
                    `<div class="Number">${index}</div><a href="./song.html?id=${value.id}">`+
                    `<h4 class="songName">${value.title}</h4>`+
                    `<p class="describe"><span class="SQ"></span>${value.author} - ${value.title}</p>`+
                    `<a href="./song.html?id=${value.id}" class="play"></a></a>`;
                    ranking.appendChild(li);
                });
                for (let i = 0; i < 3; i++) {
                    document.querySelectorAll('.rankNumber>.Number')[i].classList.add('firstThree');         
                }
                document.querySelector('.hotMusicCt').setAttribute('data-status','downloaded');
            },1000)
        },
        // 渲染热歌榜更新时间
        getUpdateTime: function(){
            var month = (new Date().getMonth()+1 <10)? '0' + (new Date().getMonth()+1) : (new Date().getMonth()+1);
            var day = (new Date().getDay()+1 <10)? '0' + (new Date().getDay()+1 ): (new Date().getDay()+1);
            return month + '月' + day + '日';
        }
    }
    return Render;
})