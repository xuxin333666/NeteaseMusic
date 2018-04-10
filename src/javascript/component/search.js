define(['lib/ajax'],function(ajax){
    function Search(ret){
        this.ret = ret ||'';
        this.results = document.querySelector('.resultCt>.results');
        this.history = document.querySelector('.history');
        this.historyArr = JSON.parse(window.localStorage.getItem('myHistory')) || [];
        setTimeout(arguments => {
            this.historyArr.forEach(value => {
                this.renderHistory(value)
            })
            ret.forEach(value => {
                this.renderhotSearch(value);
            });
        },1000)
    }
    Search.prototype = {
        // 渲染热搜
        renderhotSearch: function(value){
            var hotSearch = document.querySelector('.hotSearch');
            var hotSearchChild = document.createElement('li');
            var loading = document.querySelector('.hotSearch.loading');
            hotSearchChild.classList.add('child');
            hotSearchChild.innerHTML = `<a class="button" href="${value.url}">${value.key}</a>`;
            hotSearch.appendChild(hotSearchChild);
            loading.classList.add('action');
        },
        // 获取函数节流后的搜索关键字
        getSearchResult: function(val){
            var self = this;
            var getSuccess = false;
            this.results.innerHTML = null;
            self.renderHistory(val);
            ajax.on({
                url: './songList.json',
                success: function(ret){
                    ret.forEach(value => {
                        if((value.title.indexOf(val) !== -1) || (value.author.indexOf(val) !== -1)){
                            self.renderResult(value);
                            getSuccess = true;
                        }
                    })
                    if(!getSuccess){
                        self.renderResult('没有查询到结果');
                    }
                },
                error: function(){
                    alert('网络错误');
                }
            })
        },
        // 渲染出搜索后的页面
        renderResult: function(a){
            var li = document.createElement('li');
            li.classList.add('result');
            if(typeof a === 'string'){
                li.innerHTML = 
                `<a href="#" class="iconfont icon-shibaibiaoqing">`+
                    `<p class="result">${a}</p>`+
                `</a>`;
            }else{                
                li.innerHTML = 
                `<a href="./song.html?id=${a.id}" class="iconfont icon-search">`+
                    `<p class="result">${a.title}-${a.author}</p>`+
                `</a>`;
            }
            this.results.appendChild(li);
        },
        // 渲染搜索历史
        renderHistory: function(val){
            if(val.length === 0){
                return;
            }
            var li = document.createElement('li');
            li.classList.add('child');
            li.innerHTML = `<a href="#" class="iconfont icon-history" data-value="${val}">`+
            `<p class="key" data-value="${val}">${val}</p><span class="close" data-style="close" ></span></a>`;
            if(document.querySelectorAll('.history>.child').length !== 0){
                this.history.insertBefore(li,document.querySelectorAll('.history>.child')[0]);
            }else{
                this.history.appendChild(li);
            }
        }
    }
    return Search;
})