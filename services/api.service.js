(function () {
    angular
        .module('StudentForum')
        .service('apiService', apiService);

    function apiService($http, esFactory) {

        var client = esFactory({host: ES_CONFIG.url});

        this.fetchAll = fetchAll;
        this.fetchByDocId = fetchByDocId;
        this.updateByDocId = updateByDocId;

        function fetchAll() {

            return client.search({
                "index": ES_CONFIG.index_name,
                "type": ES_CONFIG.type,
                "body": {
                    "size": ES_CONFIG.size,
                    "from": 0,
                    "query": {
                        "match_all": {}
                    },
                    "stored_fields": []
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