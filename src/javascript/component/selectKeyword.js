define(function(){
    function Select(str,reg){
        this.str = str || '';
        this.reg = reg || /.*/;
    }
    // 根据提供的正则和字符串返回匹配到的内容
    Select.prototype = {
        filter: function(){
            return this.str.match(this.reg)[1];
        }
    }
    return Select;
})