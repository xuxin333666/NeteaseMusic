define(function(){
    var ajax = (function(){
        function Ajax(obj){
            this.data = obj.data || {};
            this.dataType = obj.dataType || 'json';
            this.url = obj.url || '';
            this.method = obj.method || 'get';
            this.success = obj.success || function(){};
            this.error = obj.error || function(){alert('网络错误')};
            this.urlStr = '';
            for (const key in this.data) {
                if (this.data.hasOwnProperty(key)) {
                    this.urlStr += key + '=' + this.data[key] + '&';                
                }
            }
            this.open();
        }
        Ajax.prototype = {
            open: function(){
                this.xhr = new XMLHttpRequest();
                if(this.method === 'get'){
                    this.xhr.open('get',this.url + '?' + this.urlStr,true)
                    this.xhr.send();
                }else{
                    this.xhr.open('get',this.url,true)
                    this.xhr.send(this.urlStr);    
                }
                this.load();
                this.xhr.onerror = function(){
                    self.error();
                }
            },
            load: function(){
                var self = this;
                this.xhr.addEventListener('load',function(){
                    if((this.status >= 200 && this.status <300) ||this.status === 304){
                        if(self.dataType==='json'){
                            self.success(JSON.parse(this.responseText));
                        }else{
                            self.success(this.responseText);
                        }
                    }else{
                        alert('系统错误')
                    }
                })
            }
        }
        return {
            on: function(obj){
                new Ajax(obj)
            }
        }
    })();
   return ajax;
})
    /*
    ajax.on({
        data: {

        },
        dataType: 'json',
        url: '',
        method: 'get',
        success: function(){

        },
        error: function(){
            alert('网络错误')
        }
    })
    */
