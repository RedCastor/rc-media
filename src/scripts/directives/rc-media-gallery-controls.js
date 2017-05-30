(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');


    module.directive("rcmGalleryControls", [ '$log', '$parse', '$compile', function ($log, $parse, $compile) {
        return {
            restrict  : 'EA',
            require: "^rcMedia",
            scope     : {
                deleteClick: '@?rcmDeleteClick',
                saveClick: '@?rcmSaveClick'
            },
            templateUrl: function (elem, attrs) {
                return attrs.rcmTemplateUrl || 'rc-media-gallery-controls.tpl.html';
            },
            link: function (scope, elem, attrs, rcMediaApi) {

                scope.loading = false;

                scope.deleteSources = function () {
                    scope.loading = true;

                    rcMediaApi.deleteSources().then(
                        function (response_success) {
                            scope.loading = false;
                        },
                        function (response_error) {
                            scope.loading = false;
                        }
                    );

                    scope.$parent.$parent.$applyAsync($parse(scope.deleteClick));
                };

                scope.deselectSources = function () {
                    rcMediaApi.deselectSources();
                };

                scope.saveSources = function () {
                    rcMediaApi.saveSources();

                    scope.$parent.$parent.$applyAsync($parse(scope.saveClick));
                };


                // INIT
                rcMediaApi.galleryControlsElement = angular.element(elem);
                scope.rcMediaApi = rcMediaApi;
            }
        };
    }]);

})(angular);
