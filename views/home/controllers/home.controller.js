(function () {

    angular
        .module('StudentForum')
        .controller('homeController', homeController);

    function homeController(apiService, $timeout) {
        var vm = this;

        vm.message = "Hello, there!";
        vm.config = ES_CONFIG;
        vm.documentCount = null;
        vm.currentIndex = null;
        vm.currentDocId = null;
        vm.success = false;
        vm.fetching = false;
        vm.docDetails = null;
        vm.keys = ES_CONFIG.keys.map(function(x) { return x.name});
        vm.errorMessage = "";

        vm.isKeyEditable = isKeyEditable;
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
        vm.resetKey = resetKey;
        vm.hasKeyChanged = hasKeyChanged;
        vm.classForKey = classForKey;
        vm.highlightNext = highlightNext;
        vm.highlightPrev = highlightPrev;

        var docList = [];
        var fieldKeys = ES_CONFIG.keys;
        var readonlyCopy = {};

        init();

        function init() {
            vm.fetching = true;
            apiService
                .fetchAll(function (allIds) {
                    vm.fetching = false;
                    if (allIds) {

                        if (allIds.length > 0) {
                            vm.success = true;
                            vm.currentIndex = 0;
                            vm.documentCount = allIds.length;

                            docList = sanitizeDocumentList(allIds);
                            indexUpdated();
                        }
                        else {
                            vm.errorMessage = "Error: failed to fetch documents. Check `query`...";
                        }
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
                        highlightElement();
                    }
                    else {
                        console.log('Fetch Document Failed');
                        vm.success = false;
                    }
                },
                function (error) {
                    vm.errorMessage = "Error: " + error.message;
                });
        }

        function hasKeyChanged(key) {
            return vm.docDetails[key] !== readonlyCopy[key];
        }

        function resetKey(key) {
            vm.docDetails[key] = readonlyCopy[key];
        }

        function hasSomethingChanged () {
            for (var index in vm.keys) {
                var currentKey = vm.keys[index];
                if (hasKeyChanged(currentKey)) {
                    return true;
                }
            }
            return false;
        }

        function isKeyEditable(key) {
            for (var index in fieldKeys) {
                var currentField = fieldKeys[index];
                if (currentField.name === key) {
                    if (currentField.is_readonly == undefined || currentField.is_readonly !== true) {
                        return true;
                    }
                }
            }
            return false;
        }

        function previousDisabled() {
            return !updateDisabled() || (vm.currentIndex == 0);
        }

        function updateDisabled() {
            return !hasSomethingChanged()
        }

        function nextDisabled() {
            return !updateDisabled() || (vm.currentIndex >= docList.length);
        }

        function previous() {
            if (previousDisabled())
                return;

            vm.currentIndex -= 1;
            indexUpdated();
        }

        function update(move) {
            if (updateDisabled())
                return;

            var updatedObject = {};

            for (var index in vm.keys) {
                var currentKey = vm.keys[index];
                if (hasKeyChanged(currentKey)) {
                    updatedObject[currentKey] = vm.docDetails[currentKey];
                }
            }

            console.log('Updating Object...');
            console.log(updatedObject);

            vm.fetching = true;

            apiService
                .updateByDocId(vm.currentDocId, updatedObject)
                .then(function (result) {

                    vm.fetching = false;

                    if ((move == true) && result && (result.result == "updated")) {
                        vm.currentIndex += 1;
                        indexUpdated();
                    }
                    else {
                        indexUpdated();
                    }
                });
        }

        function next() {
            if (nextDisabled())
                return;

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

        function classForKey(key) {
            if (hasKeyChanged(key)) {
                return "wbd-changed-input";
            }
            return "";
        }

        function highlightElement() {

            if (!ES_CONFIG.keywords || ES_CONFIG.keywords.length == 0)
                return;

            $timeout(function () {
                $("textarea").highlightTextarea({
                    words: ES_CONFIG.keywords
                });

                $("textarea").findHighlights(ES_CONFIG.keywords);

            }, 200);
        }

        function highlightPrev(textareaId) {
            var e = jQuery.Event("keyup");

            e.which = 37; // left arrow
            $("#" + textareaId).trigger(e);
        }

        function highlightNext(textareaId) {
            var e = jQuery.Event("keyup");

            e.which = 39; // right arrow
            $("#" + textareaId).trigger(e);
        }

        function sanitizeDocumentList(array) {
            if (ES_CONFIG.randomize && ES_CONFIG.randomize == true) {
                return shuffle(array)
            }
            else {
                return array;
            }
        }

        function shuffle(a) {
            var j, temp, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
            return a;
        }
    }
})();
