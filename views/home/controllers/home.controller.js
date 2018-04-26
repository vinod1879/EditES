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
        vm.includedKeys = {};
        vm.keys = ["body", "is_spam", "split", "subject"];

        vm.toggleKey = toggleKey;
        vm.previousDisabled = previousDisabled;
        vm.updateDisabled = updateDisabled;
        vm.nextDisabled = nextDisabled;

        var docList = [];
        var keysToUpdate = [];

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

                        vm.includedKeys = {};
                        for (var index in vm.keys) {
                            var key = vm.keys[index];
                            vm.includedKeys[key] = false;
                        }
                    }
                });
        }

        function toggleKey(key) {
            if (vm.includedKeys[key]) {
                keysToUpdate.push(key);
            }
            else {
                var index = keysToUpdate.indexOf(key);
                keysToUpdate.splice(index, 1);
            }
        }

        function previousDisabled() {
            return vm.currentIndex == 0;
        }

        function updateDisabled() {
            return keysToUpdate.length == 0;
        }

        function nextDisabled() {
            return vm.currentIndex >= docList.length;
        }
    }
})();