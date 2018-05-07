(function () {
    angular
        .module('StudentForum')
        .service('apiService', apiService);

    function apiService($http, esFactory) {

        var client = esFactory({host: ES_CONFIG.url});

        this.fetchAll = fetchAll;
        this.fetchByDocId = fetchByDocId;
        this.updateByDocId = updateByDocId;

        function fetchAll(callback) {

            var allIds = [];

            return client.search({
                "index": ES_CONFIG.index_name,
                "scroll": '30s',
                "body": {
                    "size": 10000,
                    "from": 0,
                    "query": ES_CONFIG.query,
                    "stored_fields": []
                }
            }, function getMoreUntilDone(error, response) {
                response.hits.hits.forEach(function (hit) {
                    allIds.push(hit._id);
                });

                if (response.hits.total > allIds.length) {
                    client.scroll({
                        scrollId: response._scroll_id,
                        scroll: '30s'
                    }, getMoreUntilDone);
                } else {
                    callback(allIds);
                }
            });
        }
        
        function fetchByDocId(doc_id) {

            return client.get({
                "index": ES_CONFIG.index_name,
                "type": ES_CONFIG.type,
                "id": doc_id
            });
        }

        function updateByDocId(doc_id, doc_body) {

            return client.update({
                "index": ES_CONFIG.index_name,
                "type": ES_CONFIG.type,
                "id": doc_id,
                "body": {
                    doc: doc_body
                }
            });
        }
    }
})();