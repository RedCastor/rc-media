(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');

    module.directive("rcmSelect", [ '$log', function ($log) {
        return {
            restrict  : 'EA',
            transclude: true,
            scope     : {
                theme   : '@?rcmTheme',
                id      : '@?rcmId',
                class   : '@?rcmClass',
                onetime : '=?rcmOnetime',
                single  : '=?rcmSingle',
                media   : '=?rcmMedia',
                config  : '@?rcmConfig',
                initSources : '=?rcmInitSources'
            },
            templateUrl: function (elem, attrs) {
                return attrs.rcmTemplateUrl  || 'rc-media-select.tpl.html';
            },
            controller: "rcMediaSelectCtrl",
            link: function (scope, elem, attrs) {

                scope.theme = angular.isDefined(attrs.rcmSelect) ? attrs.rcmSelect : scope.theme;
            }
        };
    }]);

})(angular);
