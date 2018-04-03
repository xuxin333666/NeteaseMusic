define(['lib/ajax','renderIndex','search'],function(ajax,render,Search){
    // 定义获取DOM节点函数及获取各DOM
    function _(e){
        return document.querySelector(e);
    }
    function _A(e){
        return document.querySelectorAll(e);
    }
    var wrapper = _('.wrapper');
    var tabCt = _('.tabCt');
    var tab = _A('.tab');
    var tuijian = _('.tuijian');
    var hotMusic = _('.hotMusic');
    var search = _('.search');
    var tuijianCt = _('.tuijianCt');
    var hotMusicCt = _('.hotMusicCt');
    var searchCt = _('.searchCt');
    var ranking = _('.ranking');
    var searchHeader = _('.searchHeader');
    var idSearch = _('#search');
    var closeSearch = _('.searchHeader>.closeIcon')
    var searchMain = _('.searchMain');
    var resultCt = _('.resultCt');
    var keyWord = _('.keyWord');
    var history = _('.history');
    // 定义搜索节流函数定时器
    var time1 = null;
    // 定义发布订阅构造函数及生成p1发布订阅对象
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
    var p1 = new PubSub();
    // 发送ajax请求获取推荐专辑及最新歌曲列表信息
    ajax.on({
        url: './songList.json',
        success: function(ret){
            if(!tuijianCt.getAttribute('data-songList')){
                r1 = new render(ret);
                r1.songList();
                tuijianCt.setAttribute('data-songList','downloaded');
            }
        },
        error: function(){
            alert('网络错误');
        }
    })
    ajax.on({
        url: './tuijian-list.json',
        success: function(ret){
            if(!tuijianCt.getAttribute('data-tuijian')){
                r2 = new render(ret);
                r2.tuijianList();
                tuijianCt.setAttribute('data-tuijian','downloaded');
            }
        },
        error: function(){
            alert('网络错误');
        }
    })
    // 在p1上绑定tab切换事件及监听触发
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
    tabCt.addEventListener('click',function(e){
        p1.fire('clickTab',e.target.getAttribute('data-number'));
    })
    // 在p1上绑定搜索框交互功能及监听触发
    p1.on('closeSearchContent',[function(){
        idSearch.value = '';
        closeSearch.classList.remove('action');
        searchMain.style.display = 'block';
        resultCt.style.display = 'none';
    }])
    p1.on('openSearchContent',[function(){
        searchMain.style.display = 'none';
        closeSearch.classList.add('action');
        resultCt.style.display = 'block';
        keyWord.innerText = `搜索"${idSearch.value}"`
    }])
    closeSearch.addEventListener('click',function(){
        p1.fire('closeSearchContent');
    })
    idSearch.addEventListener('input',function(){     
        if(idSearch.value.length){
            p1.fire('openSearchContent');
        }else{
            p1.fire('closeSearchContent');
        }
        if(time1){
            clearTimeout(time1);
        }
        time1 = setTimeout(argumengts => {
            p1.fire('search')
        },1000)
    })
    // 在p1上绑定搜索框结果显示事件
    p1.on('search',[function(){
        s1.getSearchResult(idSearch.value);
    }])
    // 绑定查找历史交互功能及监听触发
    history.addEventListener('click',function(e){
        if(e.target.getAttribute('data-style')){
            e.target.parentNode.parentNode.remove()
            return;
        }
        idSearch.value = e.target.getAttribute('data-value');
        p1.fire('openSearchContent');
        p1.fire('search');
        e.target.parentNode.remove();
    })
})
