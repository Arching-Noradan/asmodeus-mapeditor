function EditorAPI(conf) {
    this.api_url = conf.url;
    this.user_token = conf.token;

    this.getRequest = function(method, params) {
        params = params || {};
        params['token'] = params['token'] || this.user_token;
        return new Promise(function(resolve, reject) {
            let url = this.api_url + '/' + method;
            $.ajax({
                url: url,
                type: 'get',
                data: params,
                success: function (data) {
                    resolve(data);
                },
                error: function() {
                    reject('fuck');
                }
            });
        });
    }
}