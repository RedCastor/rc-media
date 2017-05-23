(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');

    module.directive("rcmUpload", [ '$log', function ($log) {
        return {
            restrict  : 'EA',
            require: "^rcMedia",
            scope     : {
                file      : '=?ngModel',
                multiple  : '=?rcmMultiple',
                accept    : '@?rcmAccept',
                pattern   : '@?rcmPattern',
                minWidth  : '=?rcmMinWidth',
                minHeight : '=?rcmMinHeight',
                crop      : '=?rcmCrop',
                cropArea  : '=?rcmCropArea',
                loadIcon : '@?rcmLoadIcon'
            },
            templateUrl: function (elem, attrs) {
                return attrs.rcmTemplateUrl || 'rc-media-upload.tpl.html';
            },
            link: function (scope, elem, attrs, rcMediaApi) {

                scope.alerts = [];
                scope.loading = false;
                scope.progress = 0;
                scope.currentState = '';

                scope.file = angular.isDefined(scope.file) ? scope.file : rcMediaApi.resetUploadFile();
                scope.multiple = angular.isDefined(scope.multiple) ? scope.multiple : false;
                scope.accept = angular.isDefined(scope.accept) ? scope.accept : 'image/*';
                scope.pattern = angular.isDefined(scope.pattern) ? scope.pattern : 'image/*';
                scope.minWidth = angular.isDefined(scope.minWidth) ? scope.minWidth : 300;
                scope.minHeight = angular.isDefined(scope.minHeight) ? scope.minHeight : 300;

                scope.crop = angular.isDefined(scope.crop) ? scope.crop : true;

                var crop_area_default = {
                    auto: true,
                    width: 500,
                    height: 500,
                    minWidth: 100,
                    minHeaight: 100,
                    cropWidth: 2048,
                    cropHeight: 2048,
                    keepAspect: true,
                    touchRadius: 30,
                    color: 'rgba(118, 118, 118, 0.8)',
                    colorDrag: 'rgba(118, 118, 118, 0.8)',
                    colorBg: 'rgba(200, 200, 200, 0.8)',
                    colorCropBg: 'rgba(118, 118, 118, 0.8)'
                };

                scope.cropArea = angular.isObject(scope.cropArea) ? angular.extend(crop_area_default, scope.cropArea)  : crop_area_default;

                // FUNCTIONS
                scope.onChangeUploadLoading = function (newValue, oldValue) {

                    if (newValue === false) {
                        scope.loadMore = rcMediaApi.gallery.loadMore;
                    }

                    scope.loading = newValue;
                };
                scope.onChangeUploadResult = function (newValue, oldValue) {

                    if (newValue !== oldValue) {
                        if (angular.isObject(rcMediaApi.upload.result) && angular.isDefined(rcMediaApi.upload.result.message)) {
                            scope.alerts.push({type: 'alert', msg: rcMediaApi.upload.result.message});
                        }
                        else {
                            scope.alerts = [];
                        }
                    }
                };

                scope.onChangeUploadFile = function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug('onChangeUploadFile');
                        scope.file = newValue;
                    }
                };
                scope.onChangeUploadMultiple = function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug('onChangeUploadMultiple');
                        scope.multiple = newValue;
                    }
                };
                scope.onChangeUploadCrop = function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug('onChangeUploadCrop');
                        scope.crop = newValue;
                    }
                };
                scope.onChangeUploadCrop = function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug('onChangeUploadCrop');
                        scope.cropArea = newValue;
                    }
                };
                scope.onChangeUploadProgress = function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug('onChangeUploadProgress');
                        scope.progress = newValue;
                    }
                };
                scope.onChangeUploadCurrentState = function (newValue, oldValue) {
                    $log.debug('onChangeUploadCurrentState');

                    scope.currentState = newValue;
                };

                scope.uploadSelectFiles = function ($files) {
                    scope.alerts = [];
                    rcMediaApi.uploadSelectFiles($files);
                };

                scope.closeAlert = function(index) {
                    scope.alerts.splice(index, 1);
                };

                // INIT
                rcMediaApi.uploadElement = angular.element(elem);
                rcMediaApi.initMediaUpload( {
                    multiple: scope.multiple,
                    accept  : scope.accept,
                    pattern : scope.pattern,
                    minWidth: scope.minWidth,
                    minHeight: scope.minHeight,
                    crop    : scope.crop,
                    cropArea: scope.cropArea,
                    file    : scope.file
                } );

                scope.rcMediaApi = rcMediaApi;

                scope.$watch('rcMediaApi.upload.file',      scope.onChangeUploadFile);
                scope.$watch('rcMediaApi.upload.multiple',  scope.onChangeUploadMultiple);
                scope.$watch('rcMediaApi.upload.crop',      scope.onChangeUploadCrop);
                scope.$watch('rcMediaApi.upload.cropArea',  scope.onChangeUploadCropArea);
                scope.$watch('rcMediaApi.upload.progress',  scope.onChangeUploadProgress);
                scope.$watch('rcMediaApi.upload.loading',   scope.onChangeUploadLoading);
                scope.$watch('rcMediaApi.upload.result',    scope.onChangeUploadResult);
                scope.$watch('rcMediaApi.upload.currentState', scope.onChangeUploadCurrentState);
            }
        };
    }]);

})(angular);
