define(['jquery','song','lib/ajax','playSong'],function($,arr,Ajax,PlaySong){
    var p1 = null;
    var discCt = document.querySelector('.discContainer')
    var start = document.querySelector('.disc.start')
    var disc = document.querySelectorAll('.disc')
    var pointer = document.querySelector('.pointer')

    // 发布订阅
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
    // songPS.on('getcover',[function(){
    //     Ajax.on({
    //         url: 'http://api.jirengu.com/fm/getChannels.php',
    //         success: function(ret){
    //         }
    //     })
    // }]);
    songPS.on('getSong',[function(){
        Ajax.on({
            url: '../../lyrric.json',
            success: function(ret){
                p1 = new PlaySong(ret)
            }
        })
    }]);
    songPS.on('play',[
        function(){
        disc.forEach(function(value){
            value.style.animationPlayState="running"
        })
        },
        function(){
            start.classList.remove('pause');
        },
        function(){
            p1.audioPlay()
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
                value.style.animationPlayState="paused"
            })
        },
        function(){
            p1.audioPause();
        },
        function(){
            pointer.classList.add('pause')
        }
    ])
    songPS.fire('getcover','getSong');  
    discCt.addEventListener('click',function(){
        songPS.fire('pause');  
    })
    start.addEventListener('click',function(e){
        e.stopPropagation()
        songPS.fire('play');  
        p1.audioNode.addEventListener('ended',function(){
            songPS.fire('pause'); 
        })
    })
})