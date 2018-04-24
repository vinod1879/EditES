(function () {

    angular
        .module('StudentForum')
        .controller('homeController', homeController);

    function homeController() {
        var vm = this;

        vm.message = "Hello, there!";
    }
})();