define(['jquery','selectKeyword','lib/ajax','playSong'],function($,Select,Ajax,PlaySong){
    // 定义获取DOM节点函数及获取各DOM
    function _(e){
        return document.querySelector(e);
    }
    function _A(e){
        return document.querySelectorAll(e);
    }
    var p1 = null;
    var discCt = _('.discContainer')
    var start = _('.disc.start')
    var disc = _A('.disc')
    var pointer = _('.pointer')
    // 获取页面get信息
    select = new Select(window.location.search,/id=([^&]+)/);
    var songId = select.filter();
    // 发布订阅及生成songPS实例
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
    var songPS = new PubSub(); 
    // 在songPS绑定获取歌曲内容，播放，暂停事件及直接触发获取歌曲内容
    songPS.on('getSong',[function(){
        Ajax.on({
            url: './songList.json',
            success: function(ret){
                p1 = new PlaySong(ret,songId)
                Ajax.on({
                    url: './tuijian-list.json',
                    success: function(ret){
                        p1.renderOther(ret);
                    }
                })
            }
        })
    }]);
    songPS.on('play',[
        function(){
            disc.forEach(function(value){
                // value.classList.remove('paused');
                value.classList.remove('pause');
            })
        },
        function(){
                start.classList.remove('pause');
        },
        function(){
            p1.audioPlay();
            p1.playlyrics();
        },
        function(){
            pointer.classList.remove('pause')
        }
    ])
    songPS.on('pause',[
        function(){
        start.classList.add('pause');
        },
        function(){
            disc.forEach(function(value){
                /*
                if(/(iPhone)|(Android)|(IPad)/i.test(window.navigator.userAgent)){
                    value.classList.add('paused')
                }else{
                    */
                    value.classList.add('pause');
                // }
            })
        },
        function(){
            p1.audioPause();
            p1.pauselyrics();
        },
        function(){
            pointer.classList.add('pause')
        }
    ])
    songPS.fire('getSong');
    // 当点击播放按钮时触发播放事件
    start.addEventListener('click',function(e){
        e.stopPropagation()
        songPS.fire('play');  
        p1.audioNode.addEventListener('ended',function(){
            songPS.fire('pause'); 
        })
    })
    // 当点击光碟时触发暂停事件  
    discCt.addEventListener('click',function(){
        songPS.fire('pause');  
    })
    return PubSub;
})