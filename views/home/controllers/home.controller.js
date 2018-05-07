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
        vm.keys = ES_CONFIG.keys.map(function(x) { return x.name});

        vm.toggleKey = toggleKey;
        vm.previousDisabled = previousDisabled;
        vm.updateDisabled = updateDisabled;
        vm.nextDisabled = nextDisabled;
        vm.previous = previous;
        vm.update = update;
        vm.next = next;
        vm.isRadio = isRadio;
        vm.isDropdown = isDropdown;
        vm.isDefaultOption = isDefaultOption;
        vm.optionValuesForKey = optionValuesForKey;

        var docList = [];
        var keysToUpdate = [];
        var fieldKeys = ES_CONFIG.keys;
        var readonlyCopy = {};

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
                        readonlyCopy = angular.copy(vm.docDetails);

                        vm.includedKeys = {};
                        keysToUpdate = [];
                        for (var index in vm.keys) {
                            var key = vm.keys[index];
                            vm.includedKeys[key] = false;
                        }
                    }
                    else {
                        console.log('Fetch Document Failed');
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

        function isRadio(key) {
            return isFieldOfType(key, "radio");
        }
        
        function isDropdown(key) {
            return isFieldOfType(key, "dropdown");
        }

        function isDefaultOption(key) {
            return !isFieldOfType(key, "radio") && !isFieldOfType(key, "dropdown");
        }

        function optionValuesForKey(key) {
            for (var index in fieldKeys) {
                var currentField = fieldKeys[index];
                if (currentField.name === key) {
                    return currentField.values;
                }
            }
            return [];
        }

        function isFieldOfType(key, type) {
            for (var index in fieldKeys) {
                var currentField = fieldKeys[index];
                if (currentField.name === key && currentField.option === type) {
                    return true;
                }
            }
            return false;
        }
    }
})();