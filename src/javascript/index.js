define(['lib/ajax','renderIndex','search'],function(ajax,render,Search){
    var wrapper = document.querySelector('.wrapper');
    var tabCt = document.querySelector('.tabCt');
    var tab = document.querySelectorAll('.tab');
    var tuijian = document.querySelector('.tuijian');
    var hotMusic = document.querySelector('.hotMusic');
    var search = document.querySelector('.search');
    var tuijianCt = document.querySelector('.tuijianCt');
    var hotMusicCt = document.querySelector('.hotMusicCt');
    var searchCt = document.querySelector('.searchCt');
    var ranking = document.querySelector('.ranking');
    var searchHeader = document.querySelector('.searchHeader');
    var idSearch = document.querySelector('#search');
    var closeSearch = document.querySelector('.searchHeader>.closeIcon')
    var searchMain = document.querySelector('.searchMain');
    var resultCt = document.querySelector('.resultCt');
    var keyWord = document.querySelector('.keyWord');
    function PubSub(){
        this.events = {};
    }
    PubSub.prototype = {
        on: function(evt,arr){
            this.events[evt] = this.events[evt] || [];
            for (let i = 0; i < arr.length; i++) {
                this.events[evt].push(arr[i]);               
            }
        },
        fire: function(evt){
            var self = this;
            [].forEach.call(arguments,function(value){
                if(self.events[value]){
                    for (let i = 0; i < self.events[value].length; i++) {
                        self.events[value][i]();                
                    }
                }
            })
        },
        off: function(evt,fn){
            if(fn){
                if(this.events[evt]){
                    for (let i = 0; i < this.events[evt].length; i++) {
                        if(this.events[evt][i] ===fn){
                            this.events[evt].splice(i,1);    
                            break;
                        }
                    }
                }
            }else{
                if(this.events[evt]){
                    delete this.events[evt];    
                }
            }
        }
    } 
    ajax.on({
        url: './songList.json',
        success: function(ret){
            r1 = new render(ret);
            r1.songList();
        },
        error: function(){
            alert('网络错误');
            document.querySelector('.tuijianCt').removeAttribute('data-status','downloaded');
        }
    })
    ajax.on({
        url: './tuijian-list.json',
        success: function(ret){
            r2 = new render(ret);
            r2.tuijianList();
        },
        error: function(){
            alert('网络错误');
            document.querySelector('.tuijianCt').removeAttribute('data-status','downloaded');
        }
    })
    var p1 = new PubSub();
    p1.on('clickTab',[function(){
        tab.forEach(function(value){
            value.children[0].classList.remove('action');
           [].forEach.call(wrapper.children,function(value){
                value.style.display = 'none';
            })
        })
    }]);
    p1.on('n1',[function(){
        tuijian.children[0].classList.add('action');
        tuijianCt.style.display = 'block';
    }]);
    p1.on('n2',[function(){
        hotMusic.children[0].classList.add('action');
        hotMusicCt.style.display = 'block';
        if(!hotMusicCt.getAttribute('data-status')){
            r1.getHotMusic();
        }
    }]);
    p1.on('n3',[function(){
        search.children[0].classList.add('action');
        searchCt.style.display = 'block';
        if(!searchCt.getAttribute('data-status')){
            ajax.on({
                url: './hotSearch.json',
                success: function(ret){
                    s1 = new Search(ret);
                    searchCt.setAttribute('data-status','downloaded')
                },
                error: function(){
                    alert('网络错误');
                }
            })
        }
    }]);
    p1.on('closeIconClick',[function(){
        idSearch.value = '';
        closeSearch.classList.remove('action');
        searchMain.style.display = 'block';
        resultCt.style.display = 'none';
    }])
    tabCt.addEventListener('click',function(e){
        p1.fire('clickTab',e.target.getAttribute('data-number'));
    })
    closeSearch.addEventListener('click',function(){
        p1.fire('closeIconClick');
    })
    idSearch.addEventListener('focus',function(e){
        e.preventDefault();
    })
    idSearch.addEventListener('input',function(){
        searchMain.style.display = 'none';
        closeSearch.classList.add('action');
        resultCt.style.display = 'block';
        if(idSearch.value.length){
            keyWord.innerText = `搜索"${idSearch.value}"`
        }else{
            p1.fire('closeIconClick');
        }
    })
})