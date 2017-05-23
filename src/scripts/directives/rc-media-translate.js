(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');

    module.directive("rcmTranslate", [ '$log', 'rcMedia', function ($log, rcMedia) {
        return {
            restrict  : 'EA',
            require: "^rcMedia",
            link: function (scope, elem, attrs, rcMediaApi) {

                var ref = elem.html();

                if (ref.length > 0) {
                    var text = rcMedia.getLocalizedText(ref);
                    elem.html(elem.html().replace(ref, text));
                }
            }
        };
    }]);

})(angular);
