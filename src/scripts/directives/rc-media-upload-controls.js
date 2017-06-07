(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');


    module.directive("rcmUploadControls", [ '$log', '$parse', '$compile', function ($log, $parse, $compile) {
        return {
            restrict  : 'EA',
            require: "^rcMedia",
            scope     : {
                file  : '=?ngModel',
                saveClick: '@?rcmSaveClick',
                cancelClick: '@?rcmCancelClick'
            },
            templateUrl: function (elem, attrs) {
                return attrs.rcmTemplateUrl || 'rc-media-upload-controls.tpl.html';
            },
            link: function (scope, elem, attrs, rcMediaApi) {

                scope.file = angular.isDefined(scope.file) ? scope.file : null;

                scope.uploadFile = function () {
                    scope.file = rcMediaApi.upload.file;

                    return rcMediaApi.uploadFile().then(
                        function (response_success) {
                            $log.debug('Upload success');
                            $log.debug(response_success);
                            scope.$parent.$parent.$applyAsync($parse(scope.saveClick));
                        },
                        function (response_error) {
                            $log.debug('Upload error');
                            $log.debug(response_error);
                        },
                        function (evt) {
                            $log.debug(evt);
                        }
                    );
                };

                scope.cancelUploadFile = function () {
                    rcMediaApi.cancelUploadFile();
                };

                scope.resetUploadFile = function (back) {
                    scope.file = null;
                    rcMediaApi.resetUploadFile();

                    if (back === true) {
                        scope.$parent.$parent.$applyAsync($parse(scope.cancelClick));
                    }
                };

                // INIT
                rcMediaApi.uploadControlsElement = angular.element(elem);
                scope.rcMediaApi = rcMediaApi;
            }
        };
    }]);

})(angular);
