define(function(){
    function Render(ret){
        this.ret = ret || '';
        this.latestCt = document.querySelector('.latestCt');
        this.tujianMusic = document.querySelector('.tujianMusic');
        this.loading = document.querySelector('.songlist.loading');
        this.tuijianLoading = document.querySelector('.tuijian.loading');
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
        },
        tuijianList: function(){
            var self = this;
            this.ret.forEach(function(value){
                var tuijianListLi = document.createElement('li');
                tuijianListLi.classList.add('coverList');
                tuijianListLi.innerHTML = `<a href="#">`+
                    `<img src="${value.cover}" alt="" class="cover">`+
                    `<p class="describe">${value.describe}</p></a>`;
                self.tujianMusic.appendChild(tuijianListLi);
            })
            this.tuijianLoading.classList.add('action')
        },
        getHotMusic: function(){
            var self = this;
            document.querySelector('.update').innerHTML = '更新日期：' + this.getUpdateTime();
            setTimeout(function(){
                var ranking = document.querySelector('.ranking')
                var str = '';
                self.ret.forEach(function(value,index){
                    index = (index+1)<10?'0'+(index+1):index+1;
                    str += `<li class="rankNumber"><div class="Number">${index}</div><a href="./song.html?id=${value.id}">`+
                    `<h4 class="songName">${value.title}</h4>`+
                    `<p class="describe"><span class="SQ"></span>${value.author} - ${value.title}</p>`+
                    `<a href="./song.html?id=${value.id}" class="play"></a></a></li>`;
                });
                ranking.innerHTML = str;
                for (let i = 0; i < 3; i++) {
                    document.querySelectorAll('.rankNumber>.Number')[i].classList.add('firstThree');         
                }
                document.querySelector('.hotMusicCt').setAttribute('data-status','downloaded');
            },1500)
        },
        getUpdateTime: function(){
            var month = (new Date().getMonth()+1 <10)? '0' + (new Date().getMonth()+1) : (new Date().getMonth()+1);
            var day = (new Date().getDay()+1 <10)? '0' + (new Date().getDay()+1 ): (new Date().getDay()+1);
            return month + '月' + day + '日';
        }
    }
    return Render;
})