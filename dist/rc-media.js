(function(angular) {
    "use strict";
    var module = angular.module("rcMedia", [ "ngResource" ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.constant("RCMEDIA_UPLOAD_STATES", {
        SELECT_FILES: "selectFiles",
        CROP_IMAGE: "cropImage",
        PROGRESS_FILES: "progressFiles"
    });
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.directive("rcmGalleryControls", [ "$log", "$parse", "$compile", function($log, $parse, $compile) {
        return {
            restrict: "EA",
            require: "^rcMedia",
            scope: {
                deleteClick: "@?rcmDeleteClick",
                saveClick: "@?rcmSaveClick"
            },
            templateUrl: function(elem, attrs) {
                return attrs.rcmTemplateUrl || "rc-media-gallery-controls.tpl.html";
            },
            link: function(scope, elem, attrs, rcMediaApi) {
                scope.loading = false;
                scope.deleteSources = function() {
                    scope.loading = true;
                    rcMediaApi.deleteSources().then(function(response_success) {
                        scope.loading = false;
                    }, function(response_error) {
                        scope.loading = false;
                    });
                    scope.$parent.$parent.$applyAsync($parse(scope.deleteClick));
                };
                scope.deselectSources = function() {
                    rcMediaApi.deselectSources();
                };
                scope.saveSources = function() {
                    rcMediaApi.saveSources();
                    scope.$parent.$parent.$applyAsync($parse(scope.saveClick));
                };
                rcMediaApi.galleryControlsElement = angular.element(elem);
                scope.rcMediaApi = rcMediaApi;
            }
        };
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.directive("rcmGallery", [ "$parse", "$compile", "$window", "$timeout", "$log", function($parse, $compile, $window, $timeout, $log) {
        return {
            restrict: "EA",
            require: "^rcMedia",
            scope: {
                sources: "=?ngModel",
                seletedSources: "=?rcmSelectedSources",
                order: "@?rcmOrder",
                multiple: "=?rcmMultiple",
                search: "@?rcmSearchValue",
                loadIcon: "@?rcmLoadIcon",
                uploadClick: "@?rcmUploadClick"
            },
            templateUrl: function(elem, attrs) {
                return attrs.rcmTemplateUrl || "rc-media-gallery.tpl.html";
            },
            link: function(scope, elem, attrs, rcMediaApi) {
                scope.alerts = [];
                scope.loading = false;
                scope.loadMore = false;
                scope.sources = angular.isDefined(scope.sources) ? scope.sources : [];
                scope.seletedSources = angular.isDefined(scope.seletedSources) ? scope.seletedSources : [];
                scope.order = angular.isDefined(scope.order) ? scope.order : "date";
                scope.multiple = angular.isDefined(scope.multiple) ? scope.multiple : false;
                scope.search = angular.isDefined(scope.search) ? scope.search : "";
                scope.onChangeGalleryLoading = function(newValue, oldValue) {
                    if (newValue === false) {
                        scope.loadMore = rcMediaApi.gallery.loadMore;
                        if (angular.isObject(rcMediaApi.gallery.result) && angular.isDefined(rcMediaApi.gallery.result.message)) {
                            scope.alerts.push({
                                type: "alert",
                                msg: rcMediaApi.gallery.result.message
                            });
                        }
                    } else {
                        scope.alerts = [];
                    }
                    scope.loading = newValue;
                };
                scope.onChangeSources = function(newValue, oldValue) {
                    $log.debug("onChangeSources");
                    if (newValue !== oldValue) {
                        $log.debug("onChangeSources");
                        scope.sources = newValue;
                    }
                };
                scope.onChangeSourcesSelected = function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug("onChangeSourcesSelected");
                        scope.seletedSources = newValue;
                    }
                };
                scope.selectSource = function(source, index) {
                    rcMediaApi.selectSource(source, index);
                    scope.seletedSources = rcMediaApi.sourcesSelected;
                };
                scope.loadMoreSources = function() {
                    rcMediaApi.loadMoreSources().then(function(response_success) {
                        scope.loadMore = response_success.length > 0 ? true : false;
                    }, function(response_error) {});
                };
                scope.closeAlert = function(index) {
                    scope.alerts.splice(index, 1);
                };
                rcMediaApi.galleryElement = angular.element(elem);
                rcMediaApi.initMediaGallery({
                    loading: scope.loading,
                    order: scope.order,
                    multiple: scope.multiple,
                    loadMore: scope.loadMore
                }, scope.search);
                scope.rcMediaApi = rcMediaApi;
                scope.$watchCollection("rcMediaApi.sources", scope.onChangeSources);
                scope.$watchCollection("rcMediaApi.sourcesSelected", scope.onChangeSourcesSelected);
                scope.$watch("rcMediaApi.gallery.loading", scope.onChangeGalleryLoading);
            }
        };
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.directive("rcmSearch", [ "$log", function($log) {
        return {
            restrict: "EA",
            require: "^rcMedia",
            scope: {
                search: "=?ngModel",
                value: "@?rcmValue"
            },
            templateUrl: function(elem, attrs) {
                return attrs.rcmTemplateUrl || "rc-media-search.tpl.html";
            },
            link: function(scope, elem, attrs, rcMediaApi) {
                scope.search = angular.isDefined(scope.value) ? scope.value : scope.search;
                scope.value = angular.isDefined(scope.value) ? scope.value : "";
                scope.onSearch = function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $log.debug("onSearch");
                        rcMediaApi.search = newVal;
                        rcMediaApi.searchSources();
                    }
                };
                rcMediaApi.searchElement = angular.element(elem);
                rcMediaApi.initMediaSearch(scope.search);
                scope.rcMediaApi = rcMediaApi;
                scope.$watch("search", scope.onSearch);
            }
        };
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.directive("rcmSelect", [ "$log", function($log) {
        return {
            restrict: "EA",
            transclude: true,
            scope: {
                theme: "@?rcmTheme",
                name: "@?rcmName",
                type: "@?rcmType",
                id: "@?rcmId",
                class: "@?rcmClass",
                onetime: "=?rcmOnetime",
                single: "=?rcmSingle",
                media: "=?rcmMedia",
                config: "&?rcmConfig",
                initSources: "&?rcmInitSources"
            },
            templateUrl: function(elem, attrs) {
                return attrs.rcmTemplateUrl || "rc-media-select.tpl.html";
            },
            controller: "rcMediaSelectCtrl",
            link: function(scope, elem, attrs) {
                scope.theme = angular.isDefined(attrs.rcmSelect) ? attrs.rcmSelect : scope.theme;
            }
        };
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.directive("rcmTranslate", [ "$log", "rcMedia", function($log, rcMedia) {
        return {
            restrict: "EA",
            require: "^rcMedia",
            link: function(scope, elem, attrs, rcMediaApi) {
                var ref = elem.html();
                if (ref.length > 0) {
                    var text = rcMedia.getLocalizedText(ref);
                    elem.html(elem.html().replace(ref, text));
                }
            }
        };
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.directive("rcmUploadControls", [ "$log", "$parse", "$compile", function($log, $parse, $compile) {
        return {
            restrict: "EA",
            require: "^rcMedia",
            scope: {
                file: "=?ngModel",
                saveClick: "@?rcmSaveClick",
                cancelClick: "@?rcmCancelClick"
            },
            templateUrl: function(elem, attrs) {
                return attrs.rcmTemplateUrl || "rc-media-upload-controls.tpl.html";
            },
            link: function(scope, elem, attrs, rcMediaApi) {
                scope.file = angular.isDefined(scope.file) ? scope.file : null;
                scope.uploadFile = function() {
                    scope.file = rcMediaApi.upload.file;
                    return rcMediaApi.uploadFile().then(function(response_success) {
                        $log.debug("Upload success");
                        $log.debug(response_success);
                        scope.$parent.$parent.$applyAsync($parse(scope.saveClick));
                    }, function(response_error) {
                        $log.debug("Upload error");
                        $log.debug(response_error);
                    }, function(evt) {
                        $log.debug(evt);
                    });
                };
                scope.cancelUploadFile = function() {
                    rcMediaApi.cancelUploadFile();
                };
                scope.resetUploadFile = function(back) {
                    scope.file = null;
                    rcMediaApi.resetUploadFile();
                    if (back === true) {
                        scope.$parent.$parent.$applyAsync($parse(scope.cancelClick));
                    }
                };
                rcMediaApi.uploadControlsElement = angular.element(elem);
                scope.rcMediaApi = rcMediaApi;
            }
        };
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.directive("rcmUpload", [ "rcMedia", "$log", "$parse", function(rcMedia, $log, $parse) {
        return {
            restrict: "EA",
            require: "^rcMedia",
            scope: {
                file: "=?ngModel",
                multiple: "=?rcmMultiple",
                accept: "@?rcmAccept",
                pattern: "@?rcmPattern",
                fileName: "@?rcmFileName",
                fields: "@rcmFields",
                minWidth: "=?rcmMinWidth",
                minHeight: "=?rcmMinHeight",
                fixOrientation: "=?rcmFixOrientation",
                crop: "=?rcmCrop",
                cropArea: "=?rcmCropArea",
                loadIcon: "@?rcmLoadIcon",
                change: "@?rcmChange"
            },
            templateUrl: function(elem, attrs) {
                return attrs.rcmTemplateUrl || "rc-media-upload.tpl.html";
            },
            link: function(scope, elem, attrs, rcMediaApi) {
                scope.alerts = [];
                scope.loading = false;
                scope.progress = 0;
                scope.currentState = "";
                scope.file = angular.isDefined(scope.file) ? scope.file : rcMediaApi.resetUploadFile();
                scope.multiple = angular.isDefined(scope.multiple) ? scope.multiple : false;
                scope.accept = angular.isDefined(scope.accept) ? scope.accept : "*/*";
                scope.pattern = angular.isDefined(scope.pattern) ? scope.pattern : "*/*";
                scope.fileName = angular.isDefined(scope.fileName) ? scope.fileName : "";
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
                    color: "rgba(118, 118, 118, 0.8)",
                    colorDrag: "rgba(118, 118, 118, 0.8)",
                    colorBg: "rgba(200, 200, 200, 0.8)",
                    colorCropBg: "rgba(118, 118, 118, 0.8)"
                };
                function add_alert(type, msg) {
                    scope.alerts.push({
                        type: type,
                        msg: msg
                    });
                }
                scope.cropArea = angular.isObject(scope.cropArea) ? angular.extend(crop_area_default, scope.cropArea) : crop_area_default;
                scope.onChangeUploadLoading = function(newValue, oldValue) {
                    scope.loading = newValue;
                };
                scope.onChangeUploadResult = function(newValue, oldValue) {
                    $log.debug("onChangeUploadResult");
                    $log.debug(newValue);
                    $log.debug(oldValue);
                    if (newValue !== oldValue) {
                        if (angular.isObject(rcMediaApi.upload.result) && angular.isDefined(rcMediaApi.upload.result.message)) {
                            add_alert("alert", rcMediaApi.upload.result.message);
                        } else {
                            scope.alerts = [];
                        }
                    }
                };
                scope.onChangeUploadFile = function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug("onChangeUploadFile");
                        scope.file = newValue;
                    }
                };
                scope.onChangeUploadMultiple = function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug("onChangeUploadMultiple");
                        scope.multiple = newValue;
                    }
                };
                scope.onChangeUploadCrop = function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug("onChangeUploadCrop");
                        scope.crop = newValue;
                    }
                };
                scope.onChangeUploadProgress = function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug("onChangeUploadProgress");
                        scope.progress = newValue;
                    }
                };
                scope.onChangeUploadCurrentState = function(newValue, oldValue) {
                    $log.debug("onChangeUploadCurrentState");
                    angular.extend(scope.cropArea, rcMediaApi.upload.cropArea);
                    scope.currentState = newValue;
                };
                scope.uploadSelectFiles = function($files) {
                    scope.alerts = [];
                    var upload = rcMediaApi.uploadSelectFiles($files);
                    if (angular.isObject(upload) && angular.isFunction(upload.then)) {
                        upload.then(function(response_success) {
                            scope.$parent.$parent.$applyAsync($parse(scope.change));
                        }, function(response_error) {
                            $log.debug("Upload error");
                            $log.debug(response_error);
                        }, function(evt) {
                            $log.debug(evt);
                        });
                    }
                };
                scope.changeFiles = function($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                    if ($invalidFiles.length > 0) {
                        var err_text = rcMedia.getLocalizedText("UPLOAD_INVALID_FILE");
                        angular.forEach($invalidFiles, function(file, file_key) {
                            if (file_key > 0) {
                                err_text += "\r\n";
                            }
                            var i = 0;
                            angular.forEach(file.$errorMessages, function(value, key) {
                                if (i > 0) {
                                    err_text += ", ";
                                } else {
                                    err_text += " ";
                                }
                                if (value === true) {
                                    err_text += rcMedia.getLocalizedText("UPLOAD_INVALID_" + key);
                                    switch (key) {
                                      case "minHeight":
                                        err_text += " " + rcMediaApi.upload.minHeight + "px";
                                        break;

                                      case "minWidth":
                                        err_text += " " + rcMediaApi.upload.minWidth + "px";
                                        break;

                                      case "pattern":
                                        break;
                                    }
                                }
                                i++;
                            });
                        });
                        add_alert("alert", err_text);
                    } else if ($files.length > 0) {
                        scope.uploadSelectFiles($files);
                    }
                };
                scope.closeAlert = function(index) {
                    scope.alerts.splice(index, 1);
                };
                rcMediaApi.uploadElement = angular.element(elem);
                rcMediaApi.initMediaUpload({
                    multiple: scope.multiple,
                    accept: scope.accept,
                    pattern: scope.pattern,
                    fileName: scope.fileName,
                    fields: scope.fields,
                    minWidth: scope.minWidth,
                    minHeight: scope.minHeight,
                    crop: scope.crop,
                    cropArea: scope.cropArea,
                    file: scope.file
                });
                scope.rcMediaApi = rcMediaApi;
                scope.$watch("rcMediaApi.upload.file", scope.onChangeUploadFile);
                scope.$watch("rcMediaApi.upload.multiple", scope.onChangeUploadMultiple);
                scope.$watch("rcMediaApi.upload.crop", scope.onChangeUploadCrop);
                scope.$watch("rcMediaApi.upload.progress", scope.onChangeUploadProgress);
                scope.$watch("rcMediaApi.upload.loading", scope.onChangeUploadLoading);
                scope.$watch("rcMediaApi.upload.result", scope.onChangeUploadResult);
                scope.$watch("rcMediaApi.upload.currentState", scope.onChangeUploadCurrentState);
            }
        };
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.directive("rcMedia", [ function() {
        return {
            restrict: "EA",
            require: [ "?ngModel" ],
            scope: {
                model: "=ngModel",
                modelSources: "=ngModelSources",
                sourceUrl: "@rcmSourceUrl",
                returnModelType: "@rcmReturnModelType",
                returnModelKey: "@rcmReturnModelKey",
                returnModelPush: "=?rcmReturnModelPush",
                sourceId: "@rcmSourceId",
                sourceUrlKey: "@rcmSourceUrlKey",
                sourceTitle: "@rcmSourceTitle",
                sourcesOffsetKey: "@rcmSourcesOffsetKey",
                sourcesLimitKey: "@rcmSourcesLimitKey",
                sourcesSearchKey: "@rcmSourcesSearchKey",
                deleteQuery: "@rcmDeleteQuery",
                sourcesQuery: "@rcmSourcesQuery",
                onMediaReady: "&rcmOnMediaReady",
                onUploadUpdateState: "&rcmOnUploadUpdateState",
                onUploadFile: "&rcmOnUploadFile",
                onResetUploadFile: "&rcmOnResetUploadFile",
                onSaveSources: "&rcmOnSaveSources",
                onDeleteSources: "&rcmOnDeleteSources",
                onSelectSource: "&rcmOnSelectSource",
                onSearchSources: "&rcmOnSearchSources",
                onLoadMoreSources: "&rcmOnLoadMoreSources"
            },
            controller: "rcMediaCtrl",
            controllerAs: "rcMediaApi",
            link: {
                post: function(scope, elem, attr, controller) {
                    scope.rcMediaApi.rcMediaElement = angular.element(elem);
                }
            }
        };
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.controller("rcMediaCtrl", [ "$scope", "$q", "$window", "$injector", "$filter", "$log", "$timeout", "RCMEDIA_UPLOAD_STATES", "rcMedia", "rcMediaService", function($scope, $q, $window, $injector, $filter, $log, $timeout, RCMEDIA_UPLOAD_STATES, rcMedia, rcMediaService) {
        var rcMediaApi = this;
        var debounce_bind_resize;
        this.rcMediaElement = null;
        this.init = function() {
            $log.debug("rcMedia Init");
            this.upload = {
                multiple: false,
                accept: "*/*",
                pattern: "*/*",
                fileName: "",
                fields: {},
                minWidth: 0,
                minHeight: 0,
                fixOrientation: false,
                crop: true,
                cropArea: {
                    auto: true
                },
                file: {},
                loading: false,
                result: null,
                progress: 0,
                currentState: "",
                deferred: null,
                uploadFile: null
            };
            this.search = "";
            this.sourceUrl = angular.isDefined($scope.sourceUrl) ? $scope.sourceUrl : "";
            this.sourceId = angular.isDefined($scope.sourceId) ? $scope.sourceId : "id";
            this.sourceUrlKey = angular.isDefined($scope.sourceUrlKey) ? $scope.sourceUrlKey : "source_url";
            this.sourceTitle = angular.isDefined($scope.sourceTitle) ? $scope.sourceTitle : "title.rendered";
            this.returnModelType = angular.isDefined($scope.returnModelType) ? $scope.returnModelType : "string";
            this.returnModelKey = angular.isDefined($scope.returnModelKey) ? $scope.returnModelKey : this.sourceId;
            this.returnModelPush = angular.isDefined($scope.returnModelPush) ? $scope.returnModelPush : false;
            this.altKey = angular.isDefined($scope.altKey) ? $scope.altKey : "alt_text";
            this.accept = angular.isDefined($scope.accept) ? $scope.accept : "image/*";
            this.sourcesLimitKey = angular.isDefined($scope.sourcesLimitKey) ? $scope.sourcesLimitKey : "limit";
            this.sourcesOffsetKey = angular.isDefined($scope.sourcesOffsetKey) ? $scope.sourcesOffsetKey : "offset";
            this.sourcesSearchKey = angular.isDefined($scope.sourcesSearchKey) ? $scope.sourcesSearchKey : "search";
            this.sourcesQuery = angular.isDefined($scope.sourcesQuery) ? $scope.$eval($scope.sourcesQuery) : {};
            this.deleteQuery = angular.isDefined($scope.deleteQuery) ? $scope.$eval($scope.deleteQuery) : {};
            this.sources = angular.isDefined(this.sources) ? this.sources : [];
            this.sourcesSelected = [];
            if (angular.isUndefined(this.sourcesQuery[this.sourcesLimitKey])) {
                this.sourcesQuery[this.sourcesLimitKey] = 10;
            }
            if (angular.isUndefined(this.sourcesQuery[this.sourcesOffsetKey])) {
                this.sourcesQuery[this.sourcesOffsetKey] = 0;
            }
            if (angular.isUndefined(this.sourcesQuery[this.sourcesSearchKey])) {
                this.sourcesQuery[this.sourcesSearchKey] = "";
            }
            this.addBindings();
            $scope.onMediaReady({
                $rcMediaApi: this
            });
        };
        this.timeStamp = function() {
            return parseInt(new Date().getTime() / 1e3);
        };
        this.initMediaGallery = function(gallery, search) {
            $log.debug("initMediaGallery");
            this.gallery = {
                result: null,
                loading: false,
                loadMore: false,
                multiple: false,
                order: "date"
            };
            if (angular.isObject(gallery)) {
                angular.extend(this.gallery, gallery);
            }
            if (angular.isString(search) && search.length > 0) {
                this.search = search;
                this.searchSources();
            } else {
                this.getSources(this.sourcesQuery);
            }
        };
        this.initMediaSearch = function(value) {
            $log.debug("initMediaSearch");
            if (angular.isString(value) && value.length > 0) {
                this.search = value;
                this.searchSources();
            }
        };
        this.initMediaUpload = function(upload) {
            $log.debug("initMediaUpload");
            if (angular.isObject(upload)) {
                angular.extend(this.upload, upload);
            }
            this.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);
        };
        this.getSourceTitle = function(source) {
            var source_title_list = this.sourceTitle.split(".");
            var find_source = source;
            for (var i = 0; i < source_title_list.length - 1; i++) {
                var elem = source_title_list[i];
                if (!find_source[elem]) {
                    find_source[elem] = {};
                }
                find_source = find_source[elem];
            }
            var title = find_source[source_title_list[source_title_list.length - 1]];
            if (title) {
                return title.split("_").join(" ");
            }
            return "";
        };
        this.setUploadState = function(newState) {
            if (newState && newState !== this.upload.currentState) {
                $scope.onUploadUpdateState({
                    $state: newState
                });
                this.upload.currentState = newState;
            }
            return this.upload.currentState;
        };
        this.uploadSelectFiles = function($files) {
            if ($files.length > 0) {
                $log.debug("Upload selectFiles");
                $log.debug($files);
                if (rcMediaApi.upload.multiple === false && rcMediaApi.upload.crop === true) {
                    $log.debug("Upload Crop");
                    try {
                        var Upload = $injector.get("Upload");
                        Upload.imageDimensions($files[0]).then(function(dimensions) {
                            if (angular.isDefined(rcMediaApi.uploadElement) && angular.isDefined(rcMediaApi.upload.cropArea.auto) && rcMediaApi.upload.cropArea.auto === true) {
                                var viewWidth = rcMediaApi.uploadElement[0].clientWidth;
                                var viewHeight = rcMediaApi.uploadElement[0].clientHeight;
                                var ratioH = dimensions.height / viewHeight;
                                var ratioW = dimensions.width / viewWidth;
                                var ratio;
                                if (ratioH >= ratioW) {
                                    ratio = ratioH;
                                } else {
                                    ratio = ratioW;
                                }
                                if (!rcMediaApi.upload.cropArea.cropHeight) {
                                    if (rcMediaApi.upload.cropArea.keepAspect === true) {
                                        rcMediaApi.upload.cropArea.cropHeight = rcMediaApi.upload.minHeight;
                                    } else {
                                        rcMediaApi.upload.cropArea.cropHeight = dimensions.height;
                                    }
                                }
                                if (!rcMediaApi.upload.cropArea.cropWidth) {
                                    if (rcMediaApi.upload.cropArea.keepAspect === true) {
                                        rcMediaApi.upload.cropArea.cropWidth = rcMediaApi.upload.minWidth;
                                    } else {
                                        rcMediaApi.upload.cropArea.cropWidth = dimensions.width;
                                    }
                                }
                                rcMediaApi.upload.cropArea.width = viewWidth;
                                rcMediaApi.upload.cropArea.height = viewHeight;
                                rcMediaApi.upload.cropArea.minWidth = rcMediaApi.upload.minWidth / ratio;
                                rcMediaApi.upload.cropArea.minHeight = rcMediaApi.upload.minHeight / ratio;
                            }
                            $log.debug("change state to Crop");
                            rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.CROP_IMAGE);
                        }, function(error) {
                            $log.debug("Upload Dimension Error");
                            $log.debug(error);
                        });
                    } catch (err) {
                        $log.error(err);
                    }
                } else {
                    $log.debug("Upload no crop");
                    return rcMediaApi.uploadFile();
                }
            }
            return false;
        };
        this.uploadFile = function() {
            $log.debug("upload");
            this.upload.deferred = $q.defer();
            this.upload.loading = true;
            this.upload.progress = 0;
            this.setUploadState(RCMEDIA_UPLOAD_STATES.PROGRESS_FILES);
            try {
                var Upload = $injector.get("Upload");
                if (angular.isUndefined(this.upload.file.destDataUrl) || !this.upload.file.destDataUrl) {
                    this.upload.file.destDataUrl = this.upload.file.source.$ngfBlobUrl;
                    Upload.rename(this.upload.file.source, this.upload.file.source.name);
                } else {
                    this.upload.file.source = Upload.dataUrltoBlob(this.upload.file.destDataUrl, this.upload.file.source.name);
                }
                $log.debug(this.upload.file.source);
                if (this.upload.fileName.length > 0) {
                    var ext = "";
                    if (angular.isDefined(this.upload.file.source.$ngfName)) {
                        ext = this.upload.file.source.$ngfName.slice((this.upload.file.source.$ngfName.lastIndexOf(".") - 1 >>> 0) + 2);
                        this.upload.file.source.$ngfName = this.upload.fileName + "." + ext;
                    }
                    if (angular.isDefined(this.upload.file.source.ngfName)) {
                        ext = this.upload.file.source.ngfName.slice((this.upload.file.source.ngfName.lastIndexOf(".") - 1 >>> 0) + 2);
                        this.upload.file.source.ngfName = this.upload.fileName + "." + ext;
                    }
                }
                $log.debug(this.upload.file.source);
                this.upload.uploadFile = Upload.upload({
                    url: rcMediaService.getRestUrl(),
                    file: this.upload.file.source,
                    fields: this.upload.fields
                });
                this.upload.uploadFile.then(function(response_success) {
                    $log.debug("Upload Success");
                    rcMediaApi.resetUploadFile();
                    var result;
                    if (angular.isString(response_success.data)) {
                        rcMediaApi.upload.result = {
                            message: rcMedia.getLocalizedText("UPLOAD_INVALID_FILE")
                        };
                        result = rcMediaApi.upload.deferred.reject(response_success);
                    } else {
                        var added_source = rcMediaApi.addSource(response_success.data);
                        rcMediaApi.selectSource(added_source);
                        $scope.onUploadFile({
                            $file: rcMediaApi.upload.file
                        });
                        rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);
                        rcMediaApi.upload.result = null;
                        result = rcMediaApi.upload.deferred.resolve(response_success);
                    }
                    rcMediaApi.upload.loading = false;
                    return result;
                }, function(response_error) {
                    $log.debug("error status: " + response_error);
                    rcMediaApi.resetUploadFile();
                    rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);
                    rcMediaApi.upload.result = response_error.data;
                    rcMediaApi.upload.loading = false;
                    rcMediaApi.upload.deferred.reject(response_error);
                }, function(evt) {
                    $log.debug("Progress status");
                    $log.debug(evt);
                    var progressPercentage = parseInt(100 * evt.loaded / evt.total);
                    rcMediaApi.upload.progress = progressPercentage;
                    rcMediaApi.upload.deferred.notify(progressPercentage);
                });
            } catch (err) {
                $log.error(err);
                rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);
                rcMediaApi.upload.deferred.reject();
            }
            return this.upload.deferred.promise;
        };
        this.cancelUploadFile = function() {
            this.upload.uploadFile.abort();
        };
        this.resetUploadFile = function() {
            rcMediaApi.upload.file = {
                source: null,
                destDataUrl: ""
            };
            rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);
            $scope.onResetUploadFile({
                $file: rcMediaApi.upload.file
            });
            return rcMediaApi.upload.file;
        };
        this.selectSource = function(source) {
            $log.debug("selectSource");
            if (rcMediaApi.sourcesSelected.indexOf(source) === -1) {
                if (rcMediaApi.gallery.multiple) {
                    source.activeClass = true;
                    rcMediaApi.sourcesSelected.push(source);
                } else {
                    angular.forEach(rcMediaApi.sources, function(value, key) {
                        rcMediaApi.sources[key].activeClass = false;
                    });
                    source.activeClass = true;
                    rcMediaApi.sourcesSelected = [];
                    rcMediaApi.sourcesSelected.push(source);
                }
                $scope.onSelectSource({
                    $source: source
                });
            } else {
                var index_source = rcMediaApi.sources.indexOf(source);
                angular.forEach(rcMediaApi.sourcesSelected, function(value, key) {
                    if (value === source) {
                        if (index_source !== -1) {
                            rcMediaApi.sources[index_source].activeClass = false;
                        }
                        rcMediaApi.sourcesSelected.splice(key, 1);
                    }
                });
            }
        };
        this.deselectSources = function() {
            angular.forEach(rcMediaApi.sources, function(value, key) {
                rcMediaApi.sources[key].activeClass = false;
            });
            rcMediaApi.sourcesSelected = [];
        };
        this.getSources = function(sources_query) {
            $log.debug("getGallerySources");
            this.gallery.loading = true;
            var sources_deferred = rcMediaService.get(sources_query, true);
            sources_deferred.then(function(response_success) {
                if (response_success.length > 0) {
                    angular.forEach(response_success, function(value, key) {
                        rcMediaApi.addSource(value);
                    });
                }
                rcMediaApi.gallery.loadMore = rcMediaApi.sources.length > 0 ? true : false;
                rcMediaApi.gallery.loading = false;
                rcMediaApi.gallery.result = null;
            }, function(response_error) {
                rcMediaApi.sources = [];
                rcMediaApi.gallery.loadMore = rcMediaApi.sources.length > 0 ? true : false;
                rcMediaApi.gallery.loading = false;
                rcMediaApi.gallery.result = response_error.data;
            });
            return sources_deferred;
        };
        this.deleteSources = function() {
            $log.debug("deleteSources");
            var all = [];
            angular.forEach(this.sourcesSelected, function(source, key) {
                all.push(rcMediaService.delete(source[rcMediaApi.sourceId], rcMediaApi.deleteQuery).then(function(response_success) {
                    rcMediaApi.removeSource(source);
                    $scope.onDeleteSources({
                        $source: source
                    });
                }, function(response_error) {
                    if (response_error.status === 404) {
                        rcMediaApi.removeSource(source);
                        $scope.onDeleteSources({
                            $source: source
                        });
                    }
                }));
            });
            this.gallery.loading = true;
            var defer_all = $q.all(all);
            defer_all.then(function(response_success) {
                rcMediaApi.gallery.loading = false;
            }, function(response_error) {
                rcMediaApi.gallery.loading = false;
            });
            return defer_all;
        };
        this.removeSource = function(source) {
            var key = rcMediaApi.sourceId;
            var value = source[rcMediaApi.sourceId];
            var deleted_index = rcMediaService.indexOf(rcMediaApi.sources, value, key);
            if (deleted_index !== -1) {
                rcMediaApi.sources.splice(deleted_index, 1);
            }
            deleted_index = rcMediaService.indexOf(rcMediaApi.sourcesSelected, value, key);
            if (deleted_index !== -1) {
                rcMediaApi.sourcesSelected.splice(deleted_index, 1);
            }
            deleted_index = rcMediaService.indexOf($scope.modelSources, value, key);
            if (deleted_index !== -1) {
                $scope.modelSources.splice(deleted_index, 1);
            }
            if (angular.isArray($scope.model)) {
                deleted_index = $scope.model.indexOf(value);
                if (deleted_index !== -1) {
                    $scope.model.splice(deleted_index, 1);
                }
            } else if (angular.isString($scope.model)) {
                var values = $scope.model.split(",");
                deleted_index = values.indexOf(value.toString());
                if (deleted_index !== -1) {
                    values.splice(deleted_index, 1);
                }
                $scope.model = values.join(",");
            }
            rcMediaApi.bindResize();
        };
        this.addSource = function(source) {
            source.tooltipTitle = rcMediaApi.getSourceTitle(source);
            var new_source = angular.copy(source);
            new_source[rcMediaApi.sourceUrlKey] += "?" + this.timeStamp();
            rcMediaApi.sources.push(new_source);
            rcMediaApi.bindResize();
            return new_source;
        };
        this.saveSources = function() {
            $log.debug("saveSources");
            if (this.sourcesSelected.length > 0) {
                var model = [];
                if (this.returnModelPush === false) {
                    $scope.modelSources = [];
                }
                angular.forEach(rcMediaApi.sourcesSelected, function(value) {
                    if (rcMediaService.indexOf($scope.modelSources, value[rcMediaApi.sourceId], rcMediaApi.sourceId) === -1) {
                        $scope.modelSources.push(value);
                    }
                });
                model = $scope.modelSources.map(function(a) {
                    return a[rcMediaApi.returnModelKey];
                });
                switch (this.returnModelType) {
                  case "string":
                    $scope.model = model.join(",");
                    break;

                  case "array":
                    $scope.model = model;
                    break;
                }
                $scope.onSaveSources({
                    $model: $scope.model
                });
            }
        };
        this.loadMoreSources = function() {
            $log.debug("loadMore");
            this.sourcesQuery[this.sourcesOffsetKey] = this.sources.length;
            this.gallery.loading = true;
            var sources_deferred = rcMediaService.get(this.sourcesQuery);
            sources_deferred.then(function(response_success) {
                if (response_success.length > 0) {
                    angular.forEach(response_success, function(value, key) {
                        rcMediaApi.addSource(value);
                    });
                } else {
                    rcMediaApi.gallery.loadMore = false;
                }
                rcMediaApi.gallery.result = null;
                rcMediaApi.gallery.loading = false;
                $scope.onLoadMoreSources();
            }, function(response_error) {
                rcMediaApi.gallery.result = response_error.data;
                rcMediaApi.gallery.loading = false;
            });
            return sources_deferred;
        };
        this.searchSources = function() {
            $log.debug("searchSources");
            this.sourcesQuery[this.sourcesSearchKey] = this.search;
            this.sourcesQuery[this.sourcesOffsetKey] = 0;
            this.gallery.loading = true;
            var sources_deferred = rcMediaService.get(this.sourcesQuery, true);
            sources_deferred.then(function(response_success) {
                if (response_success.length > 0) {
                    rcMediaApi.sources = [];
                    angular.forEach(response_success, function(value, key) {
                        rcMediaApi.addSource(value);
                    });
                } else {
                    rcMediaApi.sources = [];
                }
                rcMediaApi.gallery.loadMore = rcMediaApi.sources.length > 0 ? true : false;
                rcMediaApi.gallery.result = null;
                rcMediaApi.gallery.loading = false;
                $scope.onSearchSources({
                    $search: rcMediaApi.search
                });
            }, function(response_error) {
                rcMediaApi.sources = [];
                rcMediaApi.gallery.loadMore = false;
                rcMediaApi.gallery.result = response_error.data;
                rcMediaApi.gallery.loading = false;
            });
            return sources_deferred;
        };
        this.bindResize = function() {
            if (debounce_bind_resize) {
                $timeout.cancel(debounce_bind_resize);
            }
            debounce_bind_resize = $timeout(function() {
                $log.debug("Bind Resize for scroll");
                angular.element($window).triggerHandler("resize");
            }, 300);
        };
        this.addBindings = function() {
            $log.debug("addBindings");
        };
        this.init();
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.controller("rcMediaSelectCtrl", [ "$scope", "$log", "rcMediaService", function($scope, $log, rcMediaService) {
        this.init = function() {
            $log.debug("Media Select Init");
            $scope.sourcePreviewHover = false;
            $scope.loading = false;
            $scope.media = angular.isDefined($scope.media) ? $scope.media : {};
            $scope.theme = angular.isDefined($scope.theme) ? $scope.theme : "";
            $scope.name = angular.isDefined($scope.name) ? $scope.name : "media_sources";
            $scope.id = angular.isDefined($scope.id) ? $scope.id : $scope.name + "_select";
            $scope.type = angular.isDefined($scope.type) ? $scope.type : "text";
            $scope.class = angular.isDefined($scope.class) ? $scope.class : "";
            $scope.onetime = angular.isDefined($scope.onetime) ? $scope.onetime : false;
            $scope.single = angular.isDefined($scope.single) ? $scope.single : false;
            $scope.initSources = angular.isDefined($scope.initSources) ? $scope.initSources() : [];
            $scope.config = angular.isDefined($scope.config) ? $scope.config() : {};
            var default_media = {
                sourceId: "id",
                sourceUrl: "",
                sourceUrlKey: "source_url",
                sourceTitle: "title.rendered",
                returnModelType: "string",
                returnModelKey: "id",
                returnModelPush: false,
                sourcesOffsetKey: "offset",
                sourcesLimitKey: "per_page",
                sourcesSearchKey: "search",
                sourcesQuery: {
                    per_page: 20
                },
                deleteQuery: {
                    force: true
                },
                upload: {
                    crop: true,
                    multiple: false,
                    pattern: "image/*",
                    minWidth: 300,
                    minHeight: 300,
                    cropArea: {
                        color: "rgba(118, 118, 118, 0.8)",
                        colorDrag: "rgba(118, 118, 118, 0.8)",
                        colorBg: "rgba(200, 200, 200, 0.8)",
                        colorCropBg: "rgba(0, 0, 0, 0.6)"
                    },
                    loadIcon: "spinner:clock"
                },
                gallery: {
                    order: "date",
                    searchValue: "",
                    multiple: !$scope.single,
                    selectedSources: [],
                    loadIcon: "spinner:ripple"
                },
                model: [],
                sources: []
            };
            $log.debug($scope.media);
            $scope.media = rcMediaService.merge({}, default_media, $scope.media, $scope.config);
            $log.debug($scope.media);
            if (angular.isDefined($scope.initSources)) {
                $scope.media.model = $scope.initSources;
                if (angular.isArray($scope.initSources)) {
                    $scope.media.sources = $scope.initSources;
                }
            }
            if (angular.isDefined($scope.single)) {
                $scope.media.gallery.multiple = !$scope.single;
            }
            $log.debug($scope.media);
            $scope.getSourcesFromModel($scope.media.model);
        };
        $scope.removeSource = function($index) {
            $scope.media.sources.splice($index, 1);
            if (angular.isArray($scope.media.model)) {
                $scope.media.model.splice($index, 1);
            } else if (angular.isString($scope.media.model)) {
                $scope.media.model = $scope.media.model.split(",");
                $scope.media.model.splice($index, 1);
                $scope.media.model = $scope.media.model.join(",");
            }
        };
        $scope.getModel = function() {
            var sources = $scope.media.sources.map(function(a) {
                return a[$scope.media.returnModelKey];
            });
            switch ($scope.media.returnModelType) {
              case "string":
                $scope.media.model = sources.join(",");
                break;

              case "array":
                $scope.media.model = sources;
                break;
            }
        };
        $scope.onSortSources = function($item, $partFrom, $partTo, $indexFrom, $indexTo) {
            $log.debug($scope.media.sources);
            $scope.getModel();
        };
        $scope.getSourcesFromModel = function(model) {
            var include = "";
            var sources = [];
            if (angular.isArray(model)) {
                include = model.join(",");
                sources = model;
            } else if (angular.isString(model)) {
                include = model;
                sources = model.split(",");
            }
            if (!include.length) {
                return false;
            }
            var sources_query = angular.copy($scope.media.sourcesQuery);
            sources_query = angular.extend(sources_query, {
                include: include
            });
            $scope.loading = true;
            rcMediaService.get(sources_query).then(function(response_success) {
                var new_source = [];
                angular.forEach(sources, function(value, key) {
                    var index = rcMediaService.indexOf(response_success, value, $scope.media.returnModelKey);
                    if (index !== -1) {
                        new_source.push(response_success[index]);
                    }
                });
                $scope.media.sources = new_source;
                $scope.getModel();
                $scope.loading = false;
            }, function(response_error) {
                $scope.loading = false;
            });
        };
        this.init();
    } ]);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcMedia");
    module.config([ "$resourceProvider", function($resourceProvider) {
        $resourceProvider.defaults.cancellable = true;
    } ]);
    module.provider("rcMedia", [ function rcMediaProvider() {
        this.rest = {
            url: "",
            path: "/wp-json/wp/v2/media"
        };
        this.locale = null;
        this.defaultText = {
            "en-us": {
                TITLE_GALLERY: "Gallery",
                TITLE_EMPTY_GALLERY: "Your gallery is empty",
                TITLE_UPLOAD: "Upload file",
                TITLE_DRAG_FILE: "Drag files to upload",
                SUB_TITLE_EMPTY_GALLERY: "Upload your first file.",
                SUB_TITLE_DRAG_FILE: "or",
                BTN_CANCEL: "Cancel",
                BTN_SAVE: "Save",
                BTN_DELETE_FILE: "Delete file",
                BTN_DELETE_FILES: "Delete files",
                BTN_DESELECT_ALL: "Deselect all",
                BTN_SELECT_FILE: "Select file",
                BTN_SELECT_FILES: "Select files",
                BTN_SHOW_MORE: "Show More",
                BTN_BACK_GALLERY: "Back to gallery",
                BTN_UPLOAD_FILE: "Upload file",
                BTN_UPLOAD_FILES: "Upload files",
                BTN_BROWSE_FILE: "Browse a file",
                UPLOAD_INVALID_FILE: "Your file is not valid.",
                UPLOAD_INVALID_minWidth: "Minimum width",
                UPLOAD_INVALID_minHeight: "Minimum height",
                UPLOAD_INVALID_pattern: "File type error",
                UPLOAD_ERROR_SERVER: "This file is not supported by server"
            },
            "fr-FR": {
                TITLE_GALLERY: "Galerie",
                TITLE_EMPTY_GALLERY: "La galerie est vide",
                TITLE_UPLOAD: "Télécharger un fichier",
                TITLE_DRAG_FILE: "Glisser le fichier ici",
                SUB_TITLE_EMPTY_GALLERY: "Veuillez charger votre premier fichier.",
                SUB_TITLE_DRAG_FILE: "ou",
                BTN_CANCEL: "Annuler",
                BTN_SAVE: "Sauver",
                BTN_DELETE_FILE: "Supprimer le fichier",
                BTN_DELETE_FILES: "Supprimer les fichiers",
                BTN_DESELECT_ALL: "Désélectionner tous",
                BTN_SELECT_FILE: "Sélectionner le fichier",
                BTN_SELECT_FILES: "Sélectionner les fichiers",
                BTN_SHOW_MORE: "Voir plus",
                BTN_BACK_GALLERY: "Revenir à la galerie",
                BTN_UPLOAD_FILE: "Télécharger le fichier",
                BTN_UPLOAD_FILES: "Télécharger les fichiers",
                BTN_BROWSE_FILE: "Choisir un fichier",
                UPLOAD_INVALID_FILE: "Votre fichier n'est pas valide.",
                UPLOAD_INVALID_minWidth: "Largeur minimum",
                UPLOAD_INVALID_minHeight: "Hauteur minimum",
                UPLOAD_INVALID_pattern: "Type de fichier erroné",
                UPLOAD_ERROR_SERVER: "Ce fichier n'est pas pris en charge par le serveur"
            },
            "nl-NL": {
                TITLE_GALLERY: "Fotogalerij",
                TITLE_EMPTY_GALLERY: "Uw galerij is leeg",
                TITLE_UPLOAD: "File uploaden",
                TITLE_DRAG_FILE: "Zet de file hier neer",
                SUB_TITLE_EMPTY_GALLERY: "Upload hier uw eerste file.",
                SUB_TITLE_DRAG_FILE: "of",
                BTN_CANCEL: "Annuleren",
                BTN_SAVE: "Opslaan",
                BTN_DELETE_FILE: "File deleten",
                BTN_DELETE_FILES: "Files deleten",
                BTN_DESELECT_ALL: "Alles deselecteren",
                BTN_SELECT_FILE: "File selecteren",
                BTN_SELECT_FILES: "Files selecteren",
                BTN_SHOW_MORE: "Meer zien",
                BTN_BACK_GALLERY: "Terug naar de fotogalerij",
                BTN_UPLOAD_FILE: "File uploaden",
                BTN_UPLOAD_FILES: "Files uploaden",
                BTN_BROWSE_FILE: "File kiezen",
                UPLOAD_INVALID_FILE: "Uw file is niet geldig.",
                UPLOAD_INVALID_minWidth: "Minimum breedte",
                UPLOAD_INVALID_minHeight: "Minimum hoogte",
                UPLOAD_INVALID_pattern: "Verkeerde file type",
                UPLOAD_ERROR_SERVER: "Dit file wordt niet ondersteund door de server"
            }
        };
        this.interfaceText = angular.copy(this.defaultText);
        this.$get = [ "$http", "$locale", function($http, $locale) {
            var rest = this.rest;
            var localizedText;
            if (this.locale) {
                localizedText = this.interfaceText[this.locale];
            } else {
                localizedText = this.interfaceText[$locale.id];
            }
            if (!localizedText) {
                localizedText = this.defaultText["en-us"];
            }
            return {
                getRest: function() {
                    return rest;
                },
                getLocalizedText: function(item) {
                    if (item) {
                        var text = localizedText[item];
                        return text ? text : "";
                    }
                    return localizedText;
                }
            };
        } ];
        this.setLocalizedText = function(localeId, obj) {
            if (!localeId) {
                throw new Error("localeId must be a string formatted as languageId-countryId");
            }
            if (!this.interfaceText[localeId]) {
                this.interfaceText[localeId] = {};
            }
            this.interfaceText[localeId] = angular.extend(this.interfaceText[localeId], obj);
        };
        this.useLocale = function(localeId) {
            var local = localeId.split("-");
            if (local.length === 1) {
                switch (localeId) {
                  case "en":
                    localeId += "-US";
                    break;

                  default:
                    localeId += "-" + localeId.toUpperCase();
                }
            }
            this.locale = localeId;
        };
        this.setRest = function(rest) {
            this.rest = rest;
        };
    } ]);
    module.factory("rcMediaResource", [ "$resource", "rcMedia", function($resource, rcMedia) {
        var rest_url = rcMedia.getRest().url + rcMedia.getRest().path;
        var resource = {
            Media: $resource(rest_url + "/:mediaId", {
                mediaId: "@media_id"
            }, {
                get: {
                    method: "GET",
                    isArray: false,
                    cache: false
                }
            }, {
                query: {
                    method: "GET",
                    params: {},
                    isArray: true,
                    cache: false,
                    cancellable: true
                }
            })
        };
        return resource;
    } ]);
    module.factory("rcMediaService", [ "$log", "$q", "rcMedia", "rcMediaResource", function($log, $q, rcMedia, rcMediaResource) {
        var service = {
            getRestUrl: function() {
                return rcMedia.getRest().url + rcMedia.getRest().path;
            },
            get: function(sources_query, cancel) {
                if (cancel === true && this.request !== undefined && angular.isFunction(this.request.$cancelRequest)) {
                    this.request.$cancelRequest();
                }
                if (angular.isNumber(sources_query)) {
                    sources_query = {
                        mediaId: sources_query
                    };
                    this.request = rcMediaResource.Media.get(sources_query);
                } else {
                    if (!angular.isObject(sources_query)) {
                        sources_query = {};
                    }
                    this.request = rcMediaResource.Media.query(sources_query);
                }
                return this.request.$promise;
            },
            delete: function(source_id, delete_query) {
                if (angular.isUndefined(delete_query)) {
                    delete_query = {};
                }
                angular.extend(delete_query, {
                    mediaId: source_id
                });
                return rcMediaResource.Media.delete(delete_query).$promise;
            },
            indexOf: function(sources, value, key) {
                if (angular.isUndefined(value) || angular.isUndefined(key) || !angular.isArray(sources)) {
                    return -1;
                }
                return sources.map(function(o) {
                    return value.constructor(o[key]);
                }).indexOf(value);
            },
            merge: function(dst) {
                var slice = [].slice;
                var isArray = Array.isArray;
                function baseExtend(dst, objs, deep) {
                    for (var i = 0, ii = objs.length; i < ii; ++i) {
                        var obj = objs[i];
                        if (!angular.isObject(obj) && !angular.isFunction(obj)) {
                            continue;
                        }
                        var keys = Object.keys(obj);
                        for (var j = 0, jj = keys.length; j < jj; j++) {
                            var key = keys[j];
                            var src = obj[key];
                            if (deep && angular.isObject(src)) {
                                if (!angular.isObject(dst[key])) {
                                    dst[key] = isArray(src) ? [] : {};
                                }
                                baseExtend(dst[key], [ src ], true);
                            } else {
                                dst[key] = src;
                            }
                        }
                    }
                    return dst;
                }
                return baseExtend(dst, slice.call(arguments, 1), true);
            }
        };
        return service;
    } ]);
})(angular);

angular.module("rcMedia").run([ "$templateCache", function($templateCache) {
    $templateCache.put("rc-media-dialog-zf.tpl.html", '<rc-media class="rc-media"\n     rcm-source-url="{{rcDialogApi.data.sourceUrl}}"\n     rcm-source-url-key="{{rcDialogApi.data.sourceUrlKey}}"\n     rcm-source-id="{{rcDialogApi.data.sourceId}}"\n     rcm-source-title="{{rcDialogApi.data.sourceTitle}}"\n     data-ng-model="rcDialogApi.data.model"\n     data-ng-model-sources="rcDialogApi.data.sources"\n     rcm-return-model-type="{{rcDialogApi.data.returnModelType}}"\n     rcm-return-model-key="{{rcDialogApi.data.returnModelKey}}"\n     rcm-return-model-push="rcDialogApi.data.returnModelPush"\n     rcm-delete-query="{{rcDialogApi.data.deleteQuery}}"\n     rcm-sources-query="{{rcDialogApi.data.sourcesQuery}}"\n     rcm-sources-offset-key="{{rcDialogApi.data.sourcesOffsetKey}}"\n     rcm-sources-limit-key="{{rcDialogApi.data.sourcesLimitKey}}"\n     rcm-sources-search-key="{{rcDialogApi.data.sourcesSearchKey}}"\n>\n<div class="dialog-header">\n    <div class="gallery-view" data-ng-show="!selectedView" >\n        <h3 class="float-left dialog-title"><rcm-translate>TITLE_GALLERY</rcm-translate></h3>\n        <button class="button secondary hollow float-right dialog-close" type="button" data-ng-click="rcDialogApi.closeDialog()" aria-label="Close reveal" >\n            <span aria-hidden="true">&times;</span>\n        </button>\n        <button class="button primary hollow float-right upload" type="button" data-ng-show="!selectedView" data-ng-click="selectedView=\'fileUpload\'" >\n            <svg width="25" height="25" version="1.1" id="rcm_upload_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n                   x="0px" y="0px" viewBox="0 0 23 20.5" style="enable-background:new 0 0 23 20.5;" xml:space="preserve"\n              >\n                <g id="rcm_upload_svg_arrow">\n                  <line id="rcm_upload_svg_line" class="st0" x1="11.5" y1="20.5" x2="11.5" y2="7.5"/>\n                  <polyline id="rcm_upload_svg_point" class="st1" points="8.5,10.5 11.5,7.5 14.5,10.5 \t"/>\n                </g>\n                <path\n                  id="rcm_upload_svg_cloud"\n                  class="st1"\n                  d="M15.5,15.5h3c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4c-0.3-3.9-3.5-7-7.5-7c-4,0-7.3,3.2-7.5,7.1c-1.7,0.4-3,2-3,3.9c0,2.2,1.8,4,4,4h3"\n                />\n            </svg>\n            <rcm-translate>BTN_UPLOAD_FILE</rcm-translate>\n        </button>\n    </div>\n\n    <div class="upload-view" data-ng-show="selectedView==\'fileUpload\'">\n        <h3 class="float-left dialog-title" ><rcm-translate>TITLE_UPLOAD</rcm-translate></h3>\n        <button class="button secondary hollow float-right dialog-close" type="button" data-ng-click="rcDialogApi.closeDialog()" aria-label="Close reveal" >\n            <span aria-hidden="true">&times;</span>\n        </button>\n    </div>\n</div>\n<div class="dialog-body">\n\n    \x3c!-- Directive rc-media-upload --\x3e\n    <rcm-upload class="upload-view" data-ng-if="selectedView==\'fileUpload\'"\n         rcm-template-url="rc-media-upload-zf.tpl.html"\n         rcm-multiple="rcDialogApi.data.upload.multiple"\n         rcm-accept="\'{{rcDialogApi.data.upload.accept}}\'"\n         rcm-pattern="\'{{rcDialogApi.data.upload.pattern}}\'"\n         rcm-file-name="{{rcDialogApi.data.upload.fileName}}"\n         rcm-fields="{{rcDialogApi.data.upload.fields}}"\n         rcm-min-width="rcDialogApi.data.upload.minWidth"\n         rcm-min-height="rcDialogApi.data.upload.minHeight"\n         rcm-fix-orientation="rcDialogApi.data.upload.fixOrientation"\n         rcm-crop="rcDialogApi.data.upload.crop"\n         rcm-crop-area="rcDialogApi.data.upload.cropArea"\n         rcm-load-icon="{{rcDialogApi.data.upload.loadIcon}}"\n         rcm-change="selectedView=false"\n    ></rcm-upload>\n\n    <div class="gallery-view" data-ng-show="!selectedView">\n        \x3c!-- Directive rc-media-gallery --\x3e\n        <rcm-gallery\n             rcm-template-url="rc-media-gallery-zf.tpl.html"\n             rcm-order="{{rcDialogApi.data.gallery.order}}"\n             rcm-multiple="rcDialogApi.data.gallery.multiple"\n             rcm-selected-sources="rcDialogApi.data.gallery.selectedSources"\n             rcm-search-value="{{rcDialogApi.data.gallery.searchValue}}"\n             rcm-load-icon="{{rcDialogApi.data.gallery.loadIcon}}"\n        ></rcm-gallery>\n    </div>\n</div>\n<div class="dialog-footer" data-ng-show="selectedView || rcDialogApi.data.gallery.selectedSources.length">\n    <rcm-upload-controls class="upload-view" data-ng-if="selectedView==\'fileUpload\'"\n         rcm-template-url="rc-media-upload-controls-zf.tpl.html"\n         data-ng-model="rcDialogApi.data.uploadFile"\n         rcm-save-click="selectedView=false"\n         rcm-cancel-click="selectedView=false"\n    ></rcm-upload-controls>\n\n    <rcm-gallery-controls class="gallery-view" data-ng-if="!selectedView"\n         rcm-template-url="rc-media-gallery-controls-zf.tpl.html"\n         rcm-save-click="rcDialogApi.confirmDialog()"\n    ></rcm-gallery-controls>\n</div>\n</rc-media>');
    $templateCache.put("rc-media-gallery-controls-zf.tpl.html", '<button class="button alert hollow float-left delete-file" data-ng-click="deleteSources()" data-ng-disabled="loading"><rcm-translate>BTN_DELETE_FILE</rcm-translate></button>\n<button class="button secondary hollow float-left deselect-all" data-ng-click="deselectSources()" data-ng-disabled="loading"><rcm-translate>BTN_DESELECT_ALL</rcm-translate></button>\n<button class="button primary float-right select-file" data-ng-click="saveSources()" data-ng-disabled="loading"><rcm-translate>BTN_SELECT_FILE</rcm-translate></button>');
    $templateCache.put("rc-media-gallery-zf.tpl.html", '<div class="rcm-gallery" >\n\n    <alert class="message" data-ng-repeat="alert in alerts" type="alert.type" close="closeAlert($index)">{{alert.msg}}</alert>\n\n    <div data-ng-show="loading" class="loading-overlay">\n        <div device-detector class="is-not-ie">\n            <webicon class="loading-icon" icon="{{loadIcon}}"></webicon>\n        </div>\n        <div device-detector class="is-ie">\n            <div class=\'loading-icon ripple-css\'><div></div><div></div></div>\n        </div>\n    </div>\n\n    <div class="gallery-overlay" scrollbar="{autoUpdate: true}">\n\n        <div class="gallery-sources" data-ng-show="sources.length > 0">\n            <a data-ng-repeat="source in sources | orderBy:order:true"\n               href=""\n               class="thumbnail-block"\n               data-ng-class="{\'selected\': source.activeClass}"\n               data-ng-click="selectSource(source)">\n                <div class="thumbnail"\n                     data-ng-style="{\'background-image\':\'url(\\\'{{rcMediaApi.sourceUrl + source[rcMediaApi.sourceUrlKey]}}\\\')\', \'background-repeat\': \'no-repeat\', \'background-position\': \'center center\', \'background-size\': \'contain\'}"\n                     tooltip-placement="bottom"\n                     tooltip-html-unsafe="{{source.tooltipTitle}}"\n                ></div>\n            </a>\n\n            <button type="button" class="button secondary float-center load-more" data-ng-show="loadMore" data-ng-click="loadMoreSources()" data-ng-disabled="loading">\n                <i class="fa fa-plus"></i>\n                <rcm-translate>BTN_SHOW_MORE</rcm-translate>\n            </button>\n        </div>\n\n        <div class="gallery-empty" data-ng-hide="sources.length || loading">\n            <div class="center-content">\n                <h4><rcm-translate>TITLE_EMPTY_GALLERY</rcm-translate></h4>\n                <p><rcm-translate>SUB_TITLE_EMPTY_GALLERY</rcm-translate></p>\n            </div>\n        </div>\n    </div>\n</div>');
    $templateCache.put("rc-media-upload-controls-zf.tpl.html", '<div data-ng-show="rcMediaApi.upload.currentState==\'selectFiles\'">\n    <button class="button secondary hollow float-left" data-ng-click="resetUploadFile(true)"><rcm-translate>BTN_BACK_GALLERY</rcm-translate></button>\n</div>\n\n<div data-ng-show="rcMediaApi.upload.currentState==\'cropImage\'">\n    <button class="button primary float-right" data-ng-click="uploadFile()"><rcm-translate>BTN_SAVE</rcm-translate></button>\n    <button class="button hollow secondary float-right" data-ng-click="resetUploadFile()"><rcm-translate>BTN_CANCEL</rcm-translate></button>\n</div>\n\n<div data-ng-show="rcMediaApi.upload.currentState==\'progressFiles\'">\n    <button class="button secondary float-right" data-ng-click="cancelUploadFile()"><rcm-translate>BTN_CANCEL</rcm-translate></button>\n</div>\n');
    $templateCache.put("rc-media-upload-zf.tpl.html", '<div class="rcm-upload">\n\n  <alert class="message" data-ng-repeat="alert in alerts" type="alert.type" close="closeAlert($index)">{{alert.msg}}</alert>\n\n  <div data-ng-show="currentState==\'selectFiles\'" class="rcm-dropzone"\n       ngf-drop\n       data-ng-model="file.source"\n       ngf-change="changeFiles($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event)"\n       ngf-drag-over-class="dragover"\n       ngf-multiple="multiple"\n       ngf-accept="{{accept}}"\n       ngf-pattern="{{pattern}}"\n       ngf-min-width="minWidth"\n       ngf-min-height="minHeight"\n       ngf-fix-orientation="fixOrientation"\n  >\n\n    <div class="select-file" >\n      <svg width="150" height="150" version="1.1" id="rcm_upload_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n           x="0px" y="0px" viewBox="0 0 23 20.5" style="enable-background:new 0 0 23 20.5;" xml:space="preserve"\n      >\n        <g id="rcm_upload_svg_arrow">\n\t      <line id="rcm_upload_svg_line" class="st0" x1="11.5" y1="20.5" x2="11.5" y2="7.5"/>\n\t      <polyline id="rcm_upload_svg_point" class="st1" points="8.5,10.5 11.5,7.5 14.5,10.5 \t"/>\n        </g>\n        <path\n          id="rcm_upload_svg_cloud"\n          class="st1"\n          d="M15.5,15.5h3c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4c-0.3-3.9-3.5-7-7.5-7c-4,0-7.3,3.2-7.5,7.1c-1.7,0.4-3,2-3,3.9c0,2.2,1.8,4,4,4h3"\n        />\n      </svg>\n\n      <h3><rcm-translate>TITLE_DRAG_FILE</rcm-translate></h3>\n      <p class="lead"><rcm-translate>SUB_TITLE_DRAG_FILE</rcm-translate></p>\n\n      <button ngf-select\n              data-ng-model="file.source"\n              ngf-change="changeFiles($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event)"\n              ngf-multiple="multiple"\n              ngf-accept="{{accept}}"\n              ngf-pattern="{{pattern}}"\n              ngf-min-width="minWidth"\n              ngf-min-height="minHeight"\n              type="button"\n              class="button primary large"\n      >\n        <rcm-translate>BTN_BROWSE_FILE</rcm-translate>\n      </button>\n    </div>\n  </div>\n\n  <div class="crop-area" data-ng-if="currentState==\'cropImage\'">\n    <div>\n      <canvas\n              height="{{cropArea.height}}px"\n              width="{{cropArea.width}}px"\n              min-width="cropArea.minWidth"\n              min-height="cropArea.minHeight"\n              id="canvas"\n              img-cropper\n              img-src="{imageData: (file.source | ngfDataUrl), fileType: file.source.type}"\n              img-dst="file.destDataUrl"\n              crop-width="cropArea.cropWidth"\n              crop-height="cropArea.cropHeight"\n              keep-aspect="cropArea.keepAspect"\n              keep-aspect-ratio="cropArea.keepAspectRatio"\n              enforce-crop-aspect="cropArea.enforceCropAspect"\n              touch-radius="cropArea.touchRadius"\n              color="{{cropArea.color}}"\n              color-drag="{{cropArea.colorDrag}}"\n              color-bg="{{cropArea.colorBg}}"\n              color-crop-bg="{{cropArea.colorCropBg}}"\n      >\n      </canvas>\n    </div>\n  </div>\n\n  <div data-ng-show="currentState==\'progressFiles\'" class="preview-file" >\n\n    <div data-ng-show="loading" class="loading-overlay">\n      <div device-detector class="is-not-ie">\n        <webicon class="loading-icon" icon="{{loadIcon}}"></webicon>\n      </div>\n      <div device-detector class="is-ie">\n        <div class=\'loading-icon ripple-css\'><div></div><div></div></div>\n      </div>\n    </div>\n\n    <img class="float-center" width="300" height="300" data-ng-src="{{file.destDataUrl}}" alt="">\n  </div>\n</div>');
    $templateCache.put("rc-media-search-zf.tpl.html", '<div class="rcm-search input-group">\n  <span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>\n  <input type="text" class="form-control" data-ng-model="search" placeholder="Search ...">\n</div>');
    $templateCache.put("rc-media-select-draggable.tpl.html", '<div class="rcm-select">\n    <div class="preview-gallery-overlay">\n        <ul class="rcm-preview-gallery" sv-root sv-part="media.sources" sv-on-sort="onSortSources($item, $partFrom, $partTo, $indexFrom, $indexTo)" data-ng-show="media.sources.length">\n            <li sv-placeholder class="placeholder-left image"><div><i class="rcm-placeholder"></i></div></li>\n            <li data-ng-repeat="source in media.sources" class="image" sv-element>\n                <a href="" sv-handle data-ng-mouseenter="sourceHover=true" ng-mouseleave="sourceHover=false" data-ng-click="removeSource($index)" >\n                    <div data-ng-style="{\'background-image\':\'url(\\\'{{media.sourceUrl + source[media.sourceUrlKey]}}\\\')\', \'background-repeat\': \'no-repeat\', \'background-position\': \'center center\', \'background-size\': \'contain\'}">\n                        <i class="rcm-remove" data-ng-show="sourceHover"></i>\n                    </div>\n                </a>\n            </li>\n        </ul>\n        <input name="{{name}}" id="{{id}}" type="{{type}}" data-ng-model="media.model" data-ng-update-hidden />\n        <button type="button" class="{{class}}" data-ng-hide="(media.sources.length && onetime) || loading" rcd-open="{{theme}}" rcd-data="media" rcd-template-url="rc-media-dialog-zf.tpl.html" rcd-backdrop="true" rcd-click-close="false" rcd-class="dialog-media" data-ng-transclude></button>\n    </div>\n</div>');
    $templateCache.put("rc-media-select.tpl.html", '<div class="rcm-select">\n    <div class="preview-gallery-overlay">\n        <ul class="rcm-preview-gallery" data-ng-show="media.sources.length">\n            <li data-ng-repeat="source in media.sources" class="image">\n                <a href="" data-ng-mouseenter="sourceHover=true" ng-mouseleave="sourceHover=false" data-ng-click="removeSource($index)" >\n                    <div data-ng-style="{\'background-image\':\'url(\\\'{{media.sourceUrl + source[media.sourceUrlKey]}}\\\')\', \'background-repeat\': \'no-repeat\', \'background-position\': \'center center\', \'background-size\': \'contain\'}">\n                        <i class="rcm-remove" data-ng-show="sourceHover"></i>\n                    </div>\n                </a>\n            </li>\n        </ul>\n        <input name="{{name}}" id="{{id}}" type="{{type}}" data-ng-model="media.model" data-ng-update-hidden />\n        <button type="button" class="{{class}}" data-ng-hide="(media.sources.length && onetime) || loading" rcd-open="{{theme}}" rcd-data="media" rcd-template-url="rc-media-dialog-zf.tpl.html" rcd-backdrop="true" rcd-click-close="false" rcd-class="dialog-media" data-ng-transclude></button>\n    </div>\n</div>');
} ]);
//# sourceMappingURL=rc-media.js.map
