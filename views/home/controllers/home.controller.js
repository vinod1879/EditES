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
        vm.fetching = false;
        vm.docDetails = null;
        vm.includedKeys = {};
        vm.keys = ES_CONFIG.keys;

        vm.toggleKey = toggleKey;
        vm.previousDisabled = previousDisabled;
        vm.updateDisabled = updateDisabled;
        vm.nextDisabled = nextDisabled;
        vm.previous = previous;
        vm.update = update;
        vm.next = next;

        var docList = [];
        var keysToUpdate = [];

        init();

        function init() {
            vm.fetching = true;
            apiService
                .fetchAll(function (allIds) {
                    vm.fetching = false;
                    if (allIds) {

                        vm.success = true;
                        vm.currentIndex = 0;
                        vm.documentCount = allIds.length;

                        docList = allIds;
                        indexUpdated();
                    }
                });
        }

        function indexUpdated() {
            vm.currentDocId = docList[vm.currentIndex];
            getDocument();
        }

        function getDocument() {
            vm.fetching = true;
            apiService
                .fetchByDocId(vm.currentDocId)
                .then(function (result) {

                    vm.fetching = false;

                    if (result && result.found) {

                        vm.success = true;
                        vm.docDetails = result._source;

                        vm.includedKeys = {};
                        keysToUpdate = [];
                        for (var index in vm.keys) {
                            var key = vm.keys[index];
                            vm.includedKeys[key] = false;
                        }
                    }
                    else {
                        vm.success = false;
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
            return !updateDisabled() || (vm.currentIndex == 0);
        }

        function updateDisabled() {
            return keysToUpdate.length == 0;
        }

        function nextDisabled() {
            return !updateDisabled() || (vm.currentIndex >= docList.length);
        }

        function previous() {
            vm.currentIndex -= 1;
            indexUpdated();
        }

        function update(move) {
            var updatedObject = {};

            for (var index in keysToUpdate) {
                var key = keysToUpdate[index];
                updatedObject[key] = vm.docDetails[key];
            }

            vm.fetching = true;

            apiService
                .updateByDocId(vm.currentDocId, updatedObject)
                .then(function (result) {

                    vm.fetching = false;

                    if ((move == true) && result && (result.result == "updated")) {
                        next();
                    }
                    else {
                        indexUpdated();
                    }
                });
        }

        function next() {
            vm.currentIndex += 1;
            indexUpdated();
        }
    }
})();