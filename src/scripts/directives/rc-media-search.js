(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');

    module.directive("rcmSearch", [ '$log', function ($log) {
        return {
            restrict  : 'EA',
            require   : '^rcMedia',
            scope     : {
                search: '=?ngModel',
                value : '@?rcmValue'
            },
            templateUrl: function (elem, attrs) {
                return attrs.rcmTemplateUrl || 'rc-media-search.tpl.html';
            },
            link: function (scope, elem, attrs, rcMediaApi) {

                scope.search = angular.isDefined(scope.value) ? scope.value : scope.search;
                scope.value = angular.isDefined(scope.value) ? scope.value : '';

                scope.onSearch = function (newVal, oldVal) {

                    if (newVal !== oldVal) {
                        $log.debug('onSearch');
                        rcMediaApi.search = newVal;
                        rcMediaApi.searchSources();
                    }
                };

                // INIT
                rcMediaApi.searchElement = angular.element(elem);
                rcMediaApi.initMediaSearch( scope.search );

                scope.rcMediaApi = rcMediaApi;

                scope.$watch('search', scope.onSearch);
            }
        };
    }]);

})(angular);
