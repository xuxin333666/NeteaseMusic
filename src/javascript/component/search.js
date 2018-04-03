define(function(){
    function Search(ret){
        this.ret = ret ||'';
        setTimeout(arguments => {
            ret.forEach(value => {
                this.render(value);
            });
        },1000)
    }
    Search.prototype = {
        render: function(value){
            var hotSearch = document.querySelector('.hotSearch');
            var hotSearchChild = document.createElement('li');
            var loading = document.querySelector('.hotSearch.loading');
            hotSearchChild.classList.add('child');
            hotSearchChild.innerHTML = `<a class="button" href="${value.url}">${value.key}</a>`;
            hotSearch.appendChild(hotSearchChild);
            loading.classList.add('action');
        }
    }
    return Search;
})