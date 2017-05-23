(function(angular) {
    "use strict";
    var module = angular.module("rcMedia", [ "ngResource", "ngFileUpload", "angular-img-cropper" ]);
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
                scope.deleteSources = function() {
                    rcMediaApi.deleteSources();
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
    module.directive("rcmGallery", [ "$window", "$timeout", "$log", function($window, $timeout, $log) {
        return {
            restrict: "EA",
            require: "^rcMedia",
            scope: {
                sources: "=?ngModel",
                seletedSources: "=?rcmSelectedSources",
                order: "@?rcmOrder",
                multiple: "=?rcmMultiple",
                search: "@?rcmSearchValue",
                loadIcon: "@?rcmLoadIcon"
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
                    if (newValue !== oldValue) {
                        $log.debug("onSearch");
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
                        $timeout(function() {
                            $window.dispatchEvent(new Event("resize"));
                        }, 50);
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
                scope.$watch("rcMediaApi.sources", scope.onChangeSources);
                scope.$watch("rcMediaApi.sourcesSelected", scope.onChangeSourcesSelected);
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
                        scope.$parent.$parent.$applyAsync($parse(scope.saveClick));
                    }, function(response_error) {
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
    module.directive("rcmUpload", [ "$log", function($log) {
        return {
            restrict: "EA",
            require: "^rcMedia",
            scope: {
                file: "=?ngModel",
                multiple: "=?rcmMultiple",
                accept: "@?rcmAccept",
                pattern: "@?rcmPattern",
                minWidth: "=?rcmMinWidth",
                minHeight: "=?rcmMinHeight",
                crop: "=?rcmCrop",
                cropArea: "=?rcmCropArea",
                loadIcon: "@?rcmLoadIcon"
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
                scope.accept = angular.isDefined(scope.accept) ? scope.accept : "image/*";
                scope.pattern = angular.isDefined(scope.pattern) ? scope.pattern : "image/*";
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
                    color: "rgba(118, 118, 118, 0.8)",
                    colorDrag: "rgba(118, 118, 118, 0.8)",
                    colorBg: "rgba(200, 200, 200, 0.8)",
                    colorCropBg: "rgba(118, 118, 118, 0.8)"
                };
                scope.cropArea = angular.isObject(scope.cropArea) ? angular.extend(crop_area_default, scope.cropArea) : crop_area_default;
                scope.onChangeUploadLoading = function(newValue, oldValue) {
                    if (newValue === false) {
                        scope.loadMore = rcMediaApi.gallery.loadMore;
                    }
                    scope.loading = newValue;
                };
                scope.onChangeUploadResult = function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (angular.isObject(rcMediaApi.upload.result) && angular.isDefined(rcMediaApi.upload.result.message)) {
                            scope.alerts.push({
                                type: "alert",
                                msg: rcMediaApi.upload.result.message
                            });
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
                scope.onChangeUploadCrop = function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug("onChangeUploadCrop");
                        scope.cropArea = newValue;
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
                    scope.currentState = newValue;
                };
                scope.uploadSelectFiles = function($files) {
                    scope.alerts = [];
                    rcMediaApi.uploadSelectFiles($files);
                };
                scope.closeAlert = function(index) {
                    scope.alerts.splice(index, 1);
                };
                rcMediaApi.uploadElement = angular.element(elem);
                rcMediaApi.initMediaUpload({
                    multiple: scope.multiple,
                    accept: scope.accept,
                    pattern: scope.pattern,
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
                scope.$watch("rcMediaApi.upload.cropArea", scope.onChangeUploadCropArea);
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
                modelPreview: "=ngModelPreview",
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
    module.controller("rcMediaCtrl", [ "$scope", "$q", "$injector", "$filter", "$log", "$timeout", "RCMEDIA_UPLOAD_STATES", "rcMediaService", function($scope, $q, $injector, $filter, $log, $timeout, RCMEDIA_UPLOAD_STATES, rcMediaService) {
        var rcMediaApi = this;
        this.rcMediaElement = null;
        this.init = function() {
            $log.debug("rcMedia Init");
            this.upload = {
                multiple: false,
                accept: "image/*",
                pattern: "image/*",
                minWidth: "300",
                minHeight: "300",
                crop: true,
                cropArea: {
                    auto: true,
                    color: "rgba(118, 118, 118, 0.8)",
                    width: 500,
                    height: 500,
                    minWidth: 100,
                    minHeight: 100
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
            this.returnModelKey = angular.isDefined($scope.returnModelKey) ? $scope.returnModelKey : null;
            this.returnModelPush = angular.isDefined($scope.returnModelPush) ? $scope.returnModelPush : false;
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
            return title.replace("_", " ");
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
                if (this.upload.multiple === false && this.upload.crop === true) {
                    if (angular.isDefined(this.uploadElement) && angular.isDefined(this.upload.cropArea.auto) && this.upload.cropArea.auto === true) {
                        this.upload.cropArea.width = this.uploadElement[0].clientWidth;
                        this.upload.cropArea.height = this.uploadElement[0].clientHeight;
                        this.upload.cropArea.minWidth = this.upload.cropArea.width / 10;
                        this.upload.cropArea.minHeight = this.upload.cropArea.height / 10;
                    }
                    this.setUploadState(RCMEDIA_UPLOAD_STATES.CROP_IMAGE);
                } else {
                    this.uploadFile();
                }
            }
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
                } else {
                    this.upload.file.source.$ngfBlobUrl = Upload.dataUrltoBlob(this.upload.file.destDataUrl, this.upload.file.source.name);
                }
                this.upload.uploadFile = Upload.upload({
                    url: rcMediaService.getRestUrl(),
                    data: this.upload.file.source
                });
                this.upload.uploadFile.then(function(response_success) {
                    rcMediaApi.resetUploadFile();
                    rcMediaApi.sources.push(angular.copy(response_success.data));
                    $scope.onUploadFile({
                        $file: rcMediaApi.upload.file
                    });
                    rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);
                    rcMediaApi.upload.deferred.resolve(response_success);
                    rcMediaApi.upload.result = null;
                    rcMediaApi.upload.loading = false;
                }, function(response_error) {
                    $log.debug("error status: " + response_error);
                    rcMediaApi.resetUploadFile();
                    rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);
                    rcMediaApi.upload.deferred.reject(response_error);
                    rcMediaApi.upload.result = response_error.data;
                    rcMediaApi.upload.loading = false;
                }, function(evt) {
                    $log.debug("Progress status: " + evt);
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
            this.upload.file = {
                source: null,
                destDataUrl: ""
            };
            this.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);
            this.upload.result = null;
            $scope.onResetUploadFile({
                $file: this.upload.file
            });
            return this.upload.file;
        };
        this.selectSource = function(source) {
            $log.debug("selectSource");
            if (rcMediaApi.sourcesSelected.indexOf(source) === -1) {
                if (this.gallery.multiple) {
                    source.activeClass = true;
                    this.sourcesSelected.push(source);
                } else {
                    angular.forEach(rcMediaApi.sources, function(value, key) {
                        rcMediaApi.sources[key].activeClass = false;
                    });
                    source.activeClass = true;
                    this.sourcesSelected = [];
                    this.sourcesSelected.push(source);
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
                rcMediaApi.sources = angular.copy(response_success);
                rcMediaApi.gallery.loadMore = rcMediaApi.sources.length > 0 ? true : false;
                rcMediaApi.gallery.loading = false;
                rcMediaApi.gallery.result = null;
            }, function(response_error) {
                rcMediaApi.gallery.loadMore = rcMediaApi.sources.length > 0 ? true : false;
                rcMediaApi.gallery.loading = false;
                rcMediaApi.gallery.result = response_error.data;
            });
            return sources_deferred;
        };
        this.deleteSources = function() {
            $log.debug("deleteSources");
            angular.forEach(this.sourcesSelected, function(source, key) {
                rcMediaService.delete(source[rcMediaApi.sourceId], rcMediaApi.deleteQuery).then(function(response_success) {
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
                });
            });
        };
        this.removeSource = function(source) {
            var deleted_index = rcMediaApi.sources.map(function(o) {
                return o[rcMediaApi.sourceId];
            }).indexOf(source[rcMediaApi.sourceId]);
            if (deleted_index !== -1) {
                rcMediaApi.sources.splice(deleted_index, 1);
            }
            deleted_index = rcMediaApi.sourcesSelected.map(function(o) {
                return o[rcMediaApi.sourceId];
            }).indexOf(source[rcMediaApi.sourceId]);
            if (deleted_index !== -1) {
                rcMediaApi.sourcesSelected.splice(deleted_index, 1);
            }
        };
        this.saveSources = function() {
            $log.debug("saveSources");
            if (this.sourcesSelected.length > 0) {
                var model = [];
                if (this.returnModelPush === false) {
                    $scope.modelPreview = [];
                }
                angular.forEach(rcMediaApi.sourcesSelected, function(value) {
                    if (rcMediaApi.returnModelKey) {
                        model.push(value[rcMediaApi.returnModelKey]);
                    } else {
                        model.push(value);
                    }
                    $scope.modelPreview.push(value);
                });
                switch (this.returnModelType) {
                  case "string":
                    if (this.returnModelPush === true) {
                        var new_model = $scope.model;
                        if (new_model.length > 0) {
                            new_model += ",";
                        }
                        model = new_model + model.toString();
                    }
                    $scope.model = model.toString();
                    break;

                  case "array":
                    if (this.returnModelPush === true) {
                        model = $scope.model.concat(model);
                    }
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
                    angular.forEach(response_success, function(value) {
                        rcMediaApi.sources.push(angular.copy(value));
                    }, rcMediaApi);
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
                    rcMediaApi.sources = angular.copy(response_success);
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
        this.addBindings = function() {
            $log.debug("addBindings");
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
                TITLE_UPLOAD: "Upload files",
                TITLE_DRAG_FILE: "Drag files to upload",
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
                BTN_BROWSE_FILE: "Browse a file"
            },
            "fr-FR": {
                TITLE_GALLERY: "Gallerie",
                TITLE_UPLOAD: "Télécharger un fichier",
                TITLE_DRAG_FILE: "Glisser le fichier ici",
                SUB_TITLE_DRAG_FILE: "ou",
                BTN_CANCEL: "Annuler",
                BTN_SAVE: "Sauver",
                BTN_DELETE_FILE: "Supprimer le fichier",
                BTN_DELETE_FILES: "Supprimer les fichiers",
                BTN_DESELECT_ALL: "Déselectioner tous",
                BTN_SELECT_FILE: "Selectioner le fichier",
                BTN_SELECT_FILES: "Selectioner les fichiers",
                BTN_SHOW_MORE: "Voir plus",
                BTN_BACK_GALLERY: "Revenir à la gallerie",
                BTN_UPLOAD_FILE: "Télécharger le fichier",
                BTN_UPLOAD_FILES: "Télécharger les fichiers",
                BTN_BROWSE_FILE: "Choisir un fichier"
            }
        };
        this.interfaceText = angular.copy(this.defaultText);
        this.$get = [ "$http", "$locale", function($http, $locale) {
            var rest = this.rest;
            var localizedText;
            $http.defaults.useXDomain = true;
            $http.defaults.headers.common["If-Modified-Since"] = "0";
            $http.defaults.headers.common["cache-control"] = "private, max-age=0, no-cache";
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
            }
        };
        return service;
    } ]);
})(angular);

angular.module("rcMedia").run([ "$templateCache", function($templateCache) {
    $templateCache.put("rc-media-dialog-zf.tpl.html", '<div class="rc-media" rc-media\n     rcm-source-url=""\n     rcm-source-url-key="{{rcDialogApi.data.sourceUrlKey}}"\n     rcm-source-id="{{rcDialogApi.data.sourceId}}"\n     rcm-source-title="{{rcDialogApi.data.sourceTitle}}"\n     data-ng-model="rcDialogApi.data.sources"\n     data-ng-model-preview="rcDialogApi.data.sourcesPreview"\n     rcm-return-model-type="{{rcDialogApi.data.returnModelType}}"\n     rcm-return-model-key="{{rcDialogApi.data.returnModelKey}}"\n     rcm-return-model-push="rcDialogApi.data.returnModelPush"\n     rcm-delete-query="{{rcDialogApi.data.deleteQuery}}"\n     rcm-sources-query="{{rcDialogApi.data.sourcesQuery}}"\n     rcm-sources-offset-key="{{rcDialogApi.data.sourcesOffsetKey}}"\n     rcm-sources-limit-key="{{rcDialogApi.data.sourcesLimitKey}}"\n     rcm-sources-search-key="{{rcDialogApi.data.sourcesSearchKey}}"\n>\n<div class="dialog-header">\n    <div data-ng-show="!selectedView">\n        <h3 class="float-left dialog-title"><rcm-translate>TITLE_GALLERY</rcm-translate></h3>\n        <button class="button secondary hollow float-right close" type="button" data-ng-click="rcDialogApi.closeDialog()" aria-label="Close reveal" >\n            <span aria-hidden="true">&times;</span>\n        </button>\n        <button class="button primary hollow float-right upload" type="button" data-ng-show="!selectedView" data-ng-click="selectedView=\'fileUpload\'" >\n            <svg width="25" height="25" version="1.1" id="rcm_upload_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n                   x="0px" y="0px" viewBox="0 0 23 20.5" style="enable-background:new 0 0 23 20.5;" xml:space="preserve"\n              >\n                <g id="rcm_upload_svg_arrow">\n                  <line id="rcm_upload_svg_line" class="st0" x1="11.5" y1="20.5" x2="11.5" y2="7.5"/>\n                  <polyline id="rcm_upload_svg_point" class="st1" points="8.5,10.5 11.5,7.5 14.5,10.5 \t"/>\n                </g>\n                <path\n                  id="rcm_upload_svg_cloud"\n                  class="st1"\n                  d="M15.5,15.5h3c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4c-0.3-3.9-3.5-7-7.5-7c-4,0-7.3,3.2-7.5,7.1c-1.7,0.4-3,2-3,3.9c0,2.2,1.8,4,4,4h3"\n                />\n            </svg>\n            <rcm-translate>BTN_UPLOAD_FILE</rcm-translate>\n        </button>\n    </div>\n\n    <div data-ng-show="selectedView==\'fileUpload\'">\n        <h3 class="float-left dialog-title" ><rcm-translate>TITLE_UPLOAD</rcm-translate></h3>\n        <button class="button secondary hollow float-right close" type="button" data-ng-click="rcDialogApi.closeDialog()" aria-label="Close reveal" >\n            <span aria-hidden="true">&times;</span>\n        </button>\n    </div>\n</div>\n<div class="dialog-body">\n\n    \x3c!-- Directive rc-media-upload --\x3e\n    <div data-ng-if="selectedView==\'fileUpload\'"\n         rcm-upload\n         rcm-template-url="rc-media-upload-zf.tpl.html"\n         rcm-multiple="rcDialogApi.data.upload.multiple"\n         rcm-accept="{{rcDialogApi.data.upload.accept}}"\n         rcm-crop="rcDialogApi.data.upload.crop"\n         rcm-crop-area="rcDialogApi.data.upload.cropArea"\n         rcm-load-icon="{{rcDialogApi.data.upload.loadIcon}}"\n    ></div>\n\n    <div data-ng-show="!selectedView">\n        \x3c!-- Directive rc-media-gallery --\x3e\n        <div rcm-gallery\n             rcm-template-url="rc-media-gallery-zf.tpl.html"\n             rcm-order="{{rcDialogApi.data.gallery.order}}"\n             rcm-multiple="rcDialogApi.data.gallery.multiple"\n             rcm-selected-sources="rcDialogApi.data.gallery.selectedSources"\n             rcm-search-value="{{rcDialogApi.data.gallery.searchValue}}"\n             rcm-load-icon="{{rcDialogApi.data.gallery.loadIcon}}"\n        ></div>\n    </div>\n</div>\n<div class="dialog-footer" data-ng-show="selectedView || rcDialogApi.data.gallery.selectedSources.length">\n    <div data-ng-if="selectedView==\'fileUpload\'" rcm-upload-controls\n         rcm-template-url="rc-media-upload-controls-zf.tpl.html"\n         data-ng-model="rcDialogApi.data.uploadFile"\n         rcm-save-click="selectedView=false"\n         rcm-cancel-click="selectedView=false"\n    ></div>\n\n    <div data-ng-if="!selectedView" rcm-gallery-controls\n         rcm-template-url="rc-media-gallery-controls-zf.tpl.html"\n         rcm-save-click="rcDialogApi.confirmDialog()"\n    ></div>\n</div>\n</div>');
    $templateCache.put("rc-media-gallery-controls-zf.tpl.html", '<button class="button alert hollow float-left delete-file" data-ng-click="deleteSources()"><rcm-translate>BTN_DELETE_FILE</rcm-translate></button>\n<button class="button secondary hollow float-left deselect-all" data-ng-click="deselectSources()"><rcm-translate>BTN_DESELECT_ALL</rcm-translate></button>\n<button class="button primary float-right select-file" data-ng-click="saveSources()"><rcm-translate>BTN_SELECT_FILE</rcm-translate></button>');
    $templateCache.put("rc-media-gallery-zf.tpl.html", '<div class="rcm-gallery" >\n\n    <alert class="message" data-ng-repeat="alert in alerts" type="alert.type" close="closeAlert($index)">{{alert.msg}}</alert>\n\n    <div data-ng-show="loading" class="loading-overlay">\n        <webicon  class="loading-icon" icon="{{loadIcon}}"></webicon>\n    </div>\n\n    <div class="gallery-overlay" scrollbar="{autoUpdate: true}">\n\n        <div data-ng-repeat="source in sources | orderBy:order:true"\n             class="thumbnail-block"\n             data-ng-class="{\'selected\': source.activeClass}"\n             data-ng-click="selectSource(source)">\n            <div class="thumbnail"\n                 data-ng-style="{\'background-image\':\'url({{rcMediaApi.sourceUrl + source[rcMediaApi.sourceUrlKey]}})\', \'background-repeat\': \'no-repeat\', \'background-position\': \'center center\', \'background-size\': \'contain\'}"\n                 tooltip-placement="bottom"\n                 tooltip-html-unsafe="{{rcMediaApi.getSourceTitle(source)}}"\n            ></div>\n        </div>\n\n        <button type="button" class="button secondary float-center load-more" data-ng-show="loadMore" data-ng-click="loadMoreSources()" data-ng-disabled="loading">\n            <i class="fa fa-plus"></i>\n            <rcm-translate>BTN_SHOW_MORE</rcm-translate>\n        </button>\n\n    </div>\n</div>');
    $templateCache.put("rc-media-upload-controls-zf.tpl.html", '<button class="button secondary hollow float-left" data-ng-show="rcMediaApi.upload.currentState==\'selectFiles\'" data-ng-click="resetUploadFile(true)"><rcm-translate>BTN_BACK_GALLERY</rcm-translate></button>\n\n<div data-ng-show="rcMediaApi.upload.currentState==\'cropImage\'">\n    <button class="button primary float-right" data-ng-click="uploadFile()"><rcm-translate>BTN_SAVE</rcm-translate></button>\n    <button class="button hollow secondary float-right" data-ng-click="resetUploadFile()"><rcm-translate>BTN_CANCEL</rcm-translate></button>\n</div>\n\n<div data-ng-show="rcMediaApi.upload.currentState==\'progressFiles\'">\n    <button class="button secondary float-right" data-ng-click="cancelUploadFile()"><rcm-translate>BTN_CANCEL</rcm-translate></button>\n</div>\n');
    $templateCache.put("rc-media-upload-zf.tpl.html", '<div class="rcm-upload">\n\n  <alert class="message" data-ng-repeat="alert in alerts" type="alert.type" close="closeAlert($index)">{{alert.msg}}</alert>\n\n  <div data-ng-show="currentState==\'selectFiles\'" class="rcm-dropzone"\n       ngf-drop="uploadSelectFiles($files)"\n       data-ng-model="file.source"\n       ngf-drag-over-class="dragover"\n       ngf-multiple="multiple"\n       ngf-pattern="{{pattern}}"\n       ngf-accept="{{accept}}"\n       ngf-min-width="minWidth"\n       ngf-min-height="minHeight"\n  >\n\n    <div class="select-file" >\n      <svg width="150" height="150" version="1.1" id="rcm_upload_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n           x="0px" y="0px" viewBox="0 0 23 20.5" style="enable-background:new 0 0 23 20.5;" xml:space="preserve"\n      >\n        <g id="rcm_upload_svg_arrow">\n\t      <line id="rcm_upload_svg_line" class="st0" x1="11.5" y1="20.5" x2="11.5" y2="7.5"/>\n\t      <polyline id="rcm_upload_svg_point" class="st1" points="8.5,10.5 11.5,7.5 14.5,10.5 \t"/>\n        </g>\n        <path\n          id="rcm_upload_svg_cloud"\n          class="st1"\n          d="M15.5,15.5h3c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4c-0.3-3.9-3.5-7-7.5-7c-4,0-7.3,3.2-7.5,7.1c-1.7,0.4-3,2-3,3.9c0,2.2,1.8,4,4,4h3"\n        />\n      </svg>\n\n      <h3><rcm-translate>TITLE_DRAG_FILE</rcm-translate></h3>\n      <p class="lead"><rcm-translate>SUB_TITLE_DRAG_FILE</rcm-translate></p>\n\n      <button ngf-select="uploadSelectFiles($files)"\n              data-ng-model="file.source"\n              ngf-multiple="multiple"\n              ngf-accept="{{accept}}"\n              ngf-pattern="{{pattern}}"\n              ngf-min-width="minWidth"\n              ngf-min-height="minHeight"\n              type="button"\n              class="button primary large"\n      >\n        <rcm-translate>BTN_BROWSE_FILE</rcm-translate>\n      </button>\n    </div>\n  </div>\n\n  <div class="crop-area" data-ng-if="currentState==\'cropImage\'">\n    <div>\n      <canvas\n              height="{{cropArea.height}}px"\n              width="{{cropArea.width}}px"\n              min-width="cropArea.minWidth"\n              min-height="cropArea.minHeight"\n              id="canvas"\n              img-cropper\n              img-src="{imageData: (file.source | ngfDataUrl), fileType: file.source.type}"\n              img-dst="file.destDataUrl"\n              crop-width="cropArea.cropWidth"\n              crop-height="cropArea.cropHeight"\n              keep-aspect="cropArea.keepAspect"\n              touch-radius="cropArea.touchRadius"\n              color="{{cropArea.color}}"\n              color-drag="{{cropArea.colorDrag}}"\n              color-bg="{{cropArea.colorBg}}"\n              color-crop-bg="{{cropArea.colorCropBg}}"\n      >\n      </canvas>\n    </div>\n  </div>\n\n  <div data-ng-show="currentState==\'progressFiles\'" class="preview-file" >\n\n    <div class="loading-overlay">\n      <webicon  class="loading-icon" icon="{{loadIcon}}"></webicon>\n    </div>\n\n    <img class="float-center" width="200" height="200" data-ng-src="{{file.destDataUrl}}" alt="">\n  </div>\n</div>');
    $templateCache.put("rc-media-search-zf.tpl.html", '<div class="rcm-search input-group">\n  <span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>\n  <input type="text" class="form-control" data-ng-model="search" placeholder="Search ...">\n</div>');
} ]);
//# sourceMappingURL=rc-media.js.map
