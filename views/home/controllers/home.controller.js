(function () {

    angular
        .module('StudentForum')
        .controller('homeController', homeController);

    function homeController(apiService) {
        var vm = this;

        vm.message = "Hello, there!";
        vm.config = ES_CONFIG;
        vm.documentCount = null;
        vm.currentIndex = null;
        vm.currentDocId = null;
        vm.success = false;
        vm.docDetails = null;
        vm.keys = ["body", "is_spam", "split", "subject"];

        var docList = [];

        init();

        function init() {
            apiService
                .fetchAll()
                .then(function (result) {

                    if (result.hits && result.hits.hits) {

                        vm.success = true;
                        vm.currentIndex = 0;
                        vm.documentCount = result.hits.hits.length;

                        docList = result.hits.hits;
                        vm.currentDocId = docList[0]._id;

                        getDocument(vm.currentDocId);
                    }
                });
        }

        function getDocument(doc_id) {
            apiService
                .fetchByDocId(doc_id)
                .then(function (result) {
                    console.log(result);
                    if (result && result.found) {

                        vm.docDetails = result._source;
                    }
                });
        }
    }
})();