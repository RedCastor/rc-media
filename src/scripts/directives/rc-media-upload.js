(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');

    module.directive("rcmUpload", [ 'rcMedia', '$log', '$parse', function (rcMedia, $log, $parse) {
        return {
            restrict  : 'EA',
            require: "^rcMedia",
            scope     : {
                file      : '=?ngModel',
                multiple  : '=?rcmMultiple',
                accept    : '@?rcmAccept',
                pattern   : '@?rcmPattern',
                fileName  : '@?rcmFileName',
                fields    : '@rcmFields',
                minWidth  : '=?rcmMinWidth',
                minHeight : '=?rcmMinHeight',
                fixOrientation: '=?rcmFixOrientation',
                crop      : '=?rcmCrop',
                cropArea  : '=?rcmCropArea',
                loadIcon  : '@?rcmLoadIcon',
                change    : '@?rcmChange'
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
                scope.accept = angular.isDefined(scope.accept) ? scope.accept : '*/*';
                scope.pattern = angular.isDefined(scope.pattern) ? scope.pattern : '*/*';
                scope.fileName = angular.isDefined(scope.fileName) ? scope.fileName : '';
                scope.fields = angular.isDefined(scope.fields) ? scope.$eval(scope.fields) : {};
                scope.minWidth = angular.isDefined(scope.minWidth) ? scope.minWidth : 0;
                scope.minHeight = angular.isDefined(scope.minHeight) ? scope.minHeight : 0;
                scope.fixOrientation = angular.isDefined(scope.fixOrientation) ? scope.fixOrientation : false;

                scope.crop = angular.isDefined(scope.crop) ? scope.crop : true;

                var crop_area_default = {
                    auto: true,
                    width: scope.minWidth,
                    height: scope.minHeight,
                    minWidth: scope.minWidth,
                    minHeight: scope.minHeight,
                    cropWidth: 0,
                    cropHeight: 0,
                    keepAspect: true,
                    keepAspectRatio: false,
                    enforceCropAspect: false,
                    touchRadius: 10,
                    color: 'rgba(118, 118, 118, 0.8)',
                    colorDrag: 'rgba(118, 118, 118, 0.8)',
                    colorBg: 'rgba(200, 200, 200, 0.8)',
                    colorCropBg: 'rgba(118, 118, 118, 0.8)'
                };


                function add_alert (type, msg) {
                    scope.alerts.push({type: type, msg: msg});
                }

                scope.cropArea = angular.isObject(scope.cropArea) ? angular.extend(crop_area_default, scope.cropArea)  : crop_area_default;

                // FUNCTIONS
                scope.onChangeUploadLoading = function (newValue, oldValue) {
                    scope.loading = newValue;
                };

                scope.onChangeUploadResult = function (newValue, oldValue) {

                    $log.debug('onChangeUploadResult');

                    if (newValue !== oldValue) {
                        if (angular.isObject(rcMediaApi.upload.result) && angular.isDefined(rcMediaApi.upload.result.message)) {
                            add_alert('alert', rcMediaApi.upload.result.message);
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

                scope.onChangeUploadProgress = function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug('onChangeUploadProgress');
                        scope.progress = newValue;
                    }
                };

                scope.onChangeUploadCurrentState = function (newValue, oldValue) {
                    $log.debug('onChangeUploadCurrentState');

                    angular.extend(scope.cropArea, rcMediaApi.upload.cropArea);
                    scope.currentState = newValue;
                };

                scope.uploadSelectFiles = function ($files) {
                    scope.alerts = [];

                    var upload = rcMediaApi.uploadSelectFiles($files);

                    if (angular.isObject(upload) && angular.isFunction(upload.then)) {
                        upload.then(
                            function (response_success) {
                                scope.$parent.$parent.$applyAsync($parse(scope.change));
                            },
                            function (response_error) {
                                $log.debug('Upload error');
                                $log.debug(response_error);
                            },
                            function (evt) {
                                $log.debug(evt);
                            }
                        );
                    }
                };

                scope.changeFiles = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {

                    if ($invalidFiles.length > 0) {
                        var err_text = rcMedia.getLocalizedText('UPLOAD_INVALID_FILE');

                        angular.forEach($invalidFiles, function (file, file_key) {
                            if (file_key > 0) {
                                err_text += '\r\n';
                            }
                            var i = 0;
                            angular.forEach(file.$errorMessages, function (value, key) {

                                if (i > 0 ) {
                                    err_text += ', ';
                                }
                                else {
                                    err_text += ' ';
                                }
                                if (value === true) {
                                    err_text += rcMedia.getLocalizedText('UPLOAD_INVALID_' + key);

                                    switch (key) {
                                        case 'minHeight':
                                            err_text += ' ' + rcMediaApi.upload.minHeight + 'px';
                                            break;
                                        case 'minWidth':
                                            err_text += ' ' + rcMediaApi.upload.minWidth + 'px';
                                            break;
                                        case 'pattern':
                                            break;
                                    }
                                }
                                i++;
                            });
                        });


                        add_alert('alert', err_text);
                    }
                    else if ($files.length > 0) {
                        scope.uploadSelectFiles($files);
                    }
                };

                scope.closeAlert = function(index) {
                    scope.alerts.splice(index, 1);
                };

                // INIT
                rcMediaApi.uploadElement = angular.element(elem);
                rcMediaApi.initMediaUpload( {
                    multiple : scope.multiple,
                    accept   : scope.accept,
                    pattern  : scope.pattern,
                    fileName : scope.fileName,
                    fields   : scope.fields,
                    minWidth : scope.minWidth,
                    minHeight: scope.minHeight,
                    crop     : scope.crop,
                    cropArea : scope.cropArea,
                    file     : scope.file
                } );

                scope.rcMediaApi = rcMediaApi;

                scope.$watch('rcMediaApi.upload.file',      scope.onChangeUploadFile);
                scope.$watch('rcMediaApi.upload.multiple',  scope.onChangeUploadMultiple);
                scope.$watch('rcMediaApi.upload.crop',      scope.onChangeUploadCrop);
                scope.$watch('rcMediaApi.upload.progress',  scope.onChangeUploadProgress);
                scope.$watch('rcMediaApi.upload.loading',   scope.onChangeUploadLoading);
                scope.$watch('rcMediaApi.upload.result',    scope.onChangeUploadResult);
                scope.$watch('rcMediaApi.upload.currentState', scope.onChangeUploadCurrentState);
            }
        };
    }]);

})(angular);
