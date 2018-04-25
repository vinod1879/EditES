angular
    .module('StudentForum')
    .directive('textarea', [
        function () {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    function resize () {
                        element.css('height', 'auto');

                        var height = element[0].scrollHeight;
                        if (height > 0) element.css('height', height + 'px');
                    }

                    scope.$watch(attrs.ngModel, resize);
                    attrs.$set('ngTrim', 'false');
                }
            }
        }
    ]);
