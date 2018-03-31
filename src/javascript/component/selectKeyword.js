define(function(){
    function Select(str,reg){
        this.str = str || '';
        this.reg = reg || /.*/;
    }
    Select.prototype = {
        filter: function(){
            return this.str.match(this.reg)[1];
        }
    }
    return Select;
})