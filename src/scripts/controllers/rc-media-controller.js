(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');

    module.controller("rcMediaCtrl", [
        '$scope',
        '$q',
        '$window',
        '$injector',
        '$filter',
        '$log',
        '$timeout',
        'RCMEDIA_UPLOAD_STATES',
        'rcMediaService',
        function ($scope, $q, $window, $injector, $filter, $log, $timeout, RCMEDIA_UPLOAD_STATES, rcMediaService) {

        var rcMediaApi = this;
        var debounce_bind_resize;

        this.rcMediaElement = null;

        /**
         * Init Controller
         */
        this.init = function () {
            $log.debug('rcMedia Init');

            //Set default upload
            this.upload = {
                multiple: false,
                accept: '*/*',
                pattern: '*/*',
                fileName: '',
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
                currentState: '',
                deferred: null,
                uploadFile: null
            };

            this.search = '';

            this.sourceUrl      = angular.isDefined($scope.sourceUrl) ? $scope.sourceUrl : '';
            this.sourceId       = angular.isDefined($scope.sourceId) ? $scope.sourceId : 'id';
            this.sourceUrlKey   = angular.isDefined($scope.sourceUrlKey) ? $scope.sourceUrlKey : 'source_url';
            this.sourceTitle    = angular.isDefined($scope.sourceTitle) ? $scope.sourceTitle : 'title.rendered';

            this.returnModelType  = angular.isDefined($scope.returnModelType) ? $scope.returnModelType : 'string';
            this.returnModelKey   = angular.isDefined($scope.returnModelKey) ? $scope.returnModelKey : null;
            this.returnModelPush   = angular.isDefined($scope.returnModelPush) ? $scope.returnModelPush : false;

            this.altKey = angular.isDefined($scope.altKey) ? $scope.altKey : 'alt_text';

            this.accept         = angular.isDefined($scope.accept) ? $scope.accept : 'image/*';

            this.sourcesLimitKey = angular.isDefined($scope.sourcesLimitKey) ? $scope.sourcesLimitKey : 'limit';
            this.sourcesOffsetKey = angular.isDefined($scope.sourcesOffsetKey) ? $scope.sourcesOffsetKey : 'offset';
            this.sourcesSearchKey = angular.isDefined($scope.sourcesSearchKey) ? $scope.sourcesSearchKey : 'search';
            this.sourcesQuery = angular.isDefined($scope.sourcesQuery) ? $scope.$eval($scope.sourcesQuery) : {};
            this.deleteQuery = angular.isDefined($scope.deleteQuery) ? $scope.$eval($scope.deleteQuery) : {};

            this.sources        = angular.isDefined(this.sources) ? this.sources : [];
            this.sourcesSelected = [];


            if (angular.isUndefined(this.sourcesQuery[this.sourcesLimitKey])) {
                this.sourcesQuery[this.sourcesLimitKey] = 10;
            }

            if (angular.isUndefined(this.sourcesQuery[this.sourcesOffsetKey])) {
                this.sourcesQuery[this.sourcesOffsetKey] = 0;
            }

            if (angular.isUndefined(this.sourcesQuery[this.sourcesSearchKey])) {
                this.sourcesQuery[this.sourcesSearchKey] = '';
            }


            this.addBindings();

            $scope.onMediaReady({$rcMediaApi: this});
        };

        /**
         * Function to execute when init Media Gallery.
         */
        this.initMediaGallery = function ( gallery, search ) {
            $log.debug('initMediaGallery');

            //Set default gallery
            this.gallery = {
                result: null,
                loading: false,
                loadMore: false,
                multiple: false,
                order: 'date'
            };

            if (angular.isObject(gallery)) {
                angular.extend(this.gallery, gallery);
            }

            if (angular.isString(search) && search.length > 0) {
                this.search = search;
                this.searchSources();
            }
            else {
                this.getSources(this.sourcesQuery);
            }
        };

        /**
        * Function to execute when init Media Search.
        */
        this.initMediaSearch = function ( value ) {
            $log.debug('initMediaSearch');

            if (angular.isString(value) && value.length > 0) {
                this.search = value;
                this.searchSources();
            }
        };


        /**
         * Function to execute when init Media Upload.
         *
         * @param upload
         */
        this.initMediaUpload = function ( upload ) {
            $log.debug('initMediaUpload');

            if (angular.isObject(upload)) {
                angular.extend(this.upload, upload);
            }


            this.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);
        };


        /**
         * Function return the source title by expression
         *
         * @param source
         * @param expression
         * @returns {*}
         */
        this.getSourceTitle = function( source ) {

            var source_title_list = this.sourceTitle.split('.');
            var find_source = source;

            for(var i = 0; i < source_title_list.length - 1; i++) {
                var elem = source_title_list[i];
                if( !find_source[elem] ) {
                    find_source[elem] = {};
                }

                find_source = find_source[elem];
            }

            var title = find_source[source_title_list[source_title_list.length - 1]];

            if (title) {
                return title.split('_').join(' ');
            }

            return '';
        };


        /**
         * Set upload new state
         *
         * @param newState
         * @returns {string|*}
         */
        this.setUploadState = function (newState) {
            if (newState && newState !== this.upload.currentState) {
                $scope.onUploadUpdateState({$state: newState});

                this.upload.currentState = newState;
            }

            return this.upload.currentState;
        };

        /**
         * Upload Select File.
         *
         * @param $files
         */
        this.uploadSelectFiles = function ($files) {

            //Attention multiple file crop not supported.

            if ( $files.length > 0 ) {
                $log.debug('Upload selectFiles');
                $log.debug($files);

                try {
                    var Upload = $injector.get('Upload');

                    /* Get image file dimensions*/
                    Upload.imageDimensions($files[0]).then(
                        function(dimensions){
                            if ( rcMediaApi.upload.multiple === false && rcMediaApi.upload.crop === true ) {

                                if ( angular.isDefined(rcMediaApi.uploadElement) &&
                                    angular.isDefined(rcMediaApi.upload.cropArea.auto) &&
                                    rcMediaApi.upload.cropArea.auto === true
                                ) {

                                    var viewWidth = rcMediaApi.uploadElement[0].clientWidth;
                                    var viewHeight = rcMediaApi.uploadElement[0].clientHeight;
                                    var ratioH = dimensions.height / viewHeight;
                                    var ratioW = dimensions.width / viewWidth;
                                    var ratio;

                                    if (ratioH >= ratioW) {
                                        ratio = ratioH;
                                    }
                                    else {
                                        ratio = ratioW;
                                    }

                                    if (!rcMediaApi.upload.cropArea.cropHeight) {
                                        if (rcMediaApi.upload.cropArea.keepAspect === true) {
                                            rcMediaApi.upload.cropArea.cropHeight = rcMediaApi.upload.minHeight;
                                        }
                                        else {
                                            rcMediaApi.upload.cropArea.cropHeight = dimensions.height;
                                        }
                                    }

                                    if (!rcMediaApi.upload.cropArea.cropWidth) {
                                        if (rcMediaApi.upload.cropArea.keepAspect === true) {
                                            rcMediaApi.upload.cropArea.cropWidth = rcMediaApi.upload.minWidth;
                                        }
                                        else {
                                            rcMediaApi.upload.cropArea.cropWidth = dimensions.width;
                                        }
                                    }

                                    rcMediaApi.upload.cropArea.width = viewWidth;
                                    rcMediaApi.upload.cropArea.height = viewHeight;




                                    rcMediaApi.upload.cropArea.minWidth = rcMediaApi.upload.minWidth / ratio;
                                    rcMediaApi.upload.cropArea.minHeight = rcMediaApi.upload.minHeight / ratio;
                                }

                                $log.debug('change state to Crop');
                                rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.CROP_IMAGE);
                            }
                            else {
                                //Crop not enable
                                rcMediaApi.uploadFile();
                            }
                        },
                        function (error) {
                            //Is not image file
                            rcMediaApi.uploadFile();
                        }
                    );
                }
                catch(err) {
                    $log.error(err);
                }
            }
        };

        /**
         * Function to upload files.
         *
         * @param file
         */
        this.uploadFile = function () {
            $log.debug('upload');

            this.upload.deferred = $q.defer();

            this.upload.loading = true;
            this.upload.progress = 0;
            this.setUploadState(RCMEDIA_UPLOAD_STATES.PROGRESS_FILES);

            try {
                var Upload = $injector.get('Upload');

                if (angular.isUndefined(this.upload.file.destDataUrl) || !this.upload.file.destDataUrl) {
                    this.upload.file.destDataUrl = this.upload.file.source.$ngfBlobUrl;
                }
                else {

                    this.upload.file.source = Upload.dataUrltoBlob(this.upload.file.destDataUrl, this.upload.file.source.name);
                }

                //Rename File
                if (this.upload.fileName.length > 0) {
                    var ext = this.upload.file.source.$ngfName.slice((this.upload.file.source.$ngfName.lastIndexOf(".") - 1 >>> 0) + 2);
                    this.upload.file.source.$ngfName = this.upload.fileName + '.' + ext;
                }

                this.upload.uploadFile = Upload.upload({
                    url  : rcMediaService.getRestUrl(),
                    file: this.upload.file.source,
                    fields: this.upload.fields
                });

                this.upload.uploadFile.then(
                    function (response_success) {
                        rcMediaApi.resetUploadFile();

                        //Add source to sources;
                        var added_source = rcMediaApi.addSource(response_success.data);

                        //@ addes source
                        rcMediaApi.selectSource(added_source);


                        $scope.onUploadFile({$file: rcMediaApi.upload.file});

                        rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);

                        rcMediaApi.upload.result = null;
                        rcMediaApi.upload.loading = false;

                        rcMediaApi.upload.deferred.resolve(response_success);
                    },
                    function (response_error) {
                        $log.debug('error status: ' + response_error);
                        rcMediaApi.resetUploadFile();
                        rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);

                        rcMediaApi.upload.result = response_error.data;
                        rcMediaApi.upload.loading = false;

                        rcMediaApi.upload.deferred.reject(response_error);
                    },
                    function (evt) {
                        $log.debug('Progress status: ' + evt);

                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        rcMediaApi.upload.progress = progressPercentage;

                        rcMediaApi.upload.deferred.notify(progressPercentage);
                    }
                );
            }
            catch(err) {
                $log.error(err);

                rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);

                rcMediaApi.upload.deferred.reject();
            }


            return this.upload.deferred.promise;
        };

        /**
         * Cancell upload file
         */
        this.cancelUploadFile = function () {
            this.upload.uploadFile.abort();
        };

        /**
         * Function to reset upload file object.
         *
         * @returns {{srcFile: null, destDataUrl: string}}
         */
        this.resetUploadFile = function () {
            rcMediaApi.upload.file = {
                source: null,
                destDataUrl: ''
            };

            rcMediaApi.setUploadState(RCMEDIA_UPLOAD_STATES.SELECT_FILES);

            $scope.onResetUploadFile({$file: rcMediaApi.upload.file});

            return rcMediaApi.upload.file;
        };

        /**
         * Function to instantiate and check the sources selected.
         *
         * @param source
         */
        this.selectSource = function (source) {
            $log.debug('selectSource');

            if ( rcMediaApi.sourcesSelected.indexOf(source) === -1 ) {
                if (rcMediaApi.gallery.multiple) {
                    source.activeClass = true;
                    rcMediaApi.sourcesSelected.push(source);
                } else {
                    angular.forEach(rcMediaApi.sources, function (value, key) {
                        rcMediaApi.sources[key].activeClass = false;
                    });
                    source.activeClass = true;
                    rcMediaApi.sourcesSelected = [];
                    rcMediaApi.sourcesSelected.push(source);
                }
                $scope.onSelectSource({$source: source});
            } else {
                var index_source = rcMediaApi.sources.indexOf(source);

                angular.forEach(rcMediaApi.sourcesSelected, function (value, key) {
                    if (value === source) {
                        if (index_source !== -1) {
                            rcMediaApi.sources[index_source].activeClass = false;
                        }
                        rcMediaApi.sourcesSelected.splice(key, 1);
                    }
                });
            }

            $log.error(rcMediaApi.sourcesSelected);
        };


        /**
         * Function to Deselect all selected source.
         *
         * @returns {{srcFile: null, destDataUrl: string}}
         */
        this.deselectSources = function () {
            angular.forEach(rcMediaApi.sources, function (value, key) {
                rcMediaApi.sources[key].activeClass = false;
            });

            rcMediaApi.sourcesSelected = [];
        };


        this.getSources = function ( sources_query ) {
            $log.debug('getGallerySources');

            this.gallery.loading = true;

            var sources_deferred = rcMediaService.get(sources_query, true);

            sources_deferred.then(
                function (response_success) {
                    if (response_success.length > 0) {
                        angular.forEach(response_success, function (value, key) {
                            rcMediaApi.addSource(value);
                        });
                    }

                    rcMediaApi.gallery.loadMore = rcMediaApi.sources.length > 0 ? true : false;
                    rcMediaApi.gallery.loading = false;
                    rcMediaApi.gallery.result = null;
                },
                function (response_error) {
                    rcMediaApi.sources = [];
                    rcMediaApi.gallery.loadMore = rcMediaApi.sources.length > 0 ? true : false;
                    rcMediaApi.gallery.loading = false;
                    rcMediaApi.gallery.result = response_error.data;
                }
            );

            return sources_deferred;
        };

        /**
         * Function to instantiate delete the selected values.
         */
        this.deleteSources = function ()  {
            $log.debug('deleteSources');

            var all = [];

            angular.forEach(this.sourcesSelected, function (source, key) {

                all.push(rcMediaService.delete(source[rcMediaApi.sourceId], rcMediaApi.deleteQuery).then(
                    function (response_success) {
                        rcMediaApi.removeSource(source);
                        $scope.onDeleteSources({$source: source} );
                    },
                    function (response_error) {

                        //Delete not found remove in sources
                        if (response_error.status === 404) {
                            rcMediaApi.removeSource(source);
                            $scope.onDeleteSources({$source: source} );
                        }
                    }
                ));
            });

            this.gallery.loading = true;

            var defer_all = $q.all(all);

            defer_all.then(
                function (response_success) {
                    rcMediaApi.gallery.loading = false;
                },
                function (response_error) {
                    rcMediaApi.gallery.loading = false;
                }
            );

            return defer_all;
        };


        /**
         * Remove item in sources and in selected sources
         *
         * @param source
         */
        this.removeSource = function ( source ) {

            //Remove in source
            var deleted_index = rcMediaApi.sources.map(function(o) { return o[rcMediaApi.sourceId]; }).indexOf(source[rcMediaApi.sourceId]);
            if (deleted_index !== -1) {
                rcMediaApi.sources.splice(deleted_index, 1);
            }

            //Remove in sourcesSelected
            deleted_index = rcMediaApi.sourcesSelected.map(function(o) { return o[rcMediaApi.sourceId]; }).indexOf(source[rcMediaApi.sourceId]);
            if (deleted_index !== -1) {
                rcMediaApi.sourcesSelected.splice(deleted_index, 1);
            }

            rcMediaApi.bindResize();
        };


        /**
         * Add item in sources
         *
         * @param source
         */
        this.addSource = function ( source ) {
            source.tooltipTitle = rcMediaApi.getSourceTitle(source);

            var new_source = angular.copy(source);

            rcMediaApi.sources.push(new_source);

            rcMediaApi.bindResize();

            return new_source;
        };


        /**
         * Function to instantiate model with the selected values.
         */
        this.saveSources = function () {
            $log.debug('saveSources');

            if (this.sourcesSelected.length > 0) {
                var model = [];

                if (this.returnModelPush === false) {
                    $scope.modelPreview = [];
                }

                angular.forEach(rcMediaApi.sourcesSelected, function (value) {
                    if (rcMediaApi.returnModelKey) {
                        model.push(value[rcMediaApi.returnModelKey]);
                    }
                    else {
                        model.push(value);
                    }

                    $scope.modelPreview.push(value);
                });


                switch (this.returnModelType) {
                    case 'string':
                        if (this.returnModelPush === true) {
                            var new_model = $scope.model;
                            if (new_model.length > 0) {
                                new_model += ',';
                            }
                            model = new_model + model.toString();
                        }
                        $scope.model = model.toString();
                        break;
                    case 'array':
                        if (this.returnModelPush === true) {
                            model = $scope.model.concat(model);
                        }
                        $scope.model = model;
                        break;
                }

                $scope.onSaveSources({$model: $scope.model});
            }
        };

        /**
         * Function to load more sources from DB.
         */
        this.loadMoreSources = function () {
            $log.debug('loadMore');

            this.sourcesQuery[this.sourcesOffsetKey] = this.sources.length;

            this.gallery.loading = true;

            var sources_deferred = rcMediaService.get(this.sourcesQuery);

            sources_deferred.then(
                function (response_success) {
                    if (response_success.length > 0) {
                        angular.forEach(response_success, function (value, key) {
                            rcMediaApi.addSource(value);
                        });
                    }
                    else {
                        rcMediaApi.gallery.loadMore = false;
                    }
                    rcMediaApi.gallery.result = null;
                    rcMediaApi.gallery.loading = false;

                    $scope.onLoadMoreSources();
                },
                function (response_error) {
                    rcMediaApi.gallery.result = response_error.data;
                    rcMediaApi.gallery.loading = false;
                }
            );

            return sources_deferred;
        };

        this.searchSources = function () {
            $log.debug('searchSources');

            this.sourcesQuery[this.sourcesSearchKey] = this.search;
            this.sourcesQuery[this.sourcesOffsetKey] = 0;

            this.gallery.loading = true;

            var sources_deferred = rcMediaService.get(this.sourcesQuery, true);

            sources_deferred.then(
                function (response_success) {
                    if (response_success.length > 0) {
                        rcMediaApi.sources = [];
                        angular.forEach(response_success, function (value, key) {
                            rcMediaApi.addSource(value);
                        });
                    }
                    else {
                        rcMediaApi.sources = [];
                    }

                    rcMediaApi.gallery.loadMore = rcMediaApi.sources.length > 0 ? true : false;
                    rcMediaApi.gallery.result = null;
                    rcMediaApi.gallery.loading = false;

                    $scope.onSearchSources({$search: rcMediaApi.search});
                },
                function (response_error) {
                    rcMediaApi.sources = [];
                    rcMediaApi.gallery.loadMore = false;
                    rcMediaApi.gallery.result = response_error.data;
                    rcMediaApi.gallery.loading = false;
                }
            );

            return sources_deferred;
        };

        /**
         *  Force resize event for angular tiny scrollbar after loading hide
         */
        this.bindResize = function() {

            if (debounce_bind_resize) {
                $timeout.cancel(debounce_bind_resize);
            }

            debounce_bind_resize = $timeout(function() {
                $log.debug('Bind Resize for scroll');
                $window.dispatchEvent(new Event("resize"));
            }, 300);
        };

        this.addBindings = function () {
            $log.debug('addBindings');
        };


        //Init
        this.init();
    }]);

})(angular);
