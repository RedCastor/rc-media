(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');

    module.controller("rcMediaSelectCtrl", [
        '$scope',
        '$log',
        'rcMediaService',
        function ($scope, $log, rcMediaService) {

            /**
             * Init Controller
             */
            this.init = function () {
                $log.debug('Media Select Init');

                $scope.sourcePreviewHover = false;
                $scope.loading = false;

                $scope.media = angular.isDefined($scope.media) ? $scope.media : {};
                $scope.theme = angular.isDefined($scope.theme) ? $scope.theme : '';
                $scope.name = angular.isDefined($scope.name) ? $scope.name : 'media_sources';
                $scope.id = angular.isDefined($scope.id) ? $scope.id : $scope.name + '_select';
                $scope.type = angular.isDefined($scope.type) ? $scope.type : 'text';
                $scope.class = angular.isDefined($scope.class) ? $scope.class : '';
                $scope.onetime = angular.isDefined($scope.onetime) ? $scope.onetime : false;
                $scope.single = angular.isDefined($scope.single) ? $scope.single : false;

                $scope.initSources = angular.isDefined($scope.initSources) ? $scope.initSources() : [];
                $scope.config = angular.isDefined($scope.config) ? $scope.config() : {};

                var default_media = {
                    sourceId: 'id',
                    sourceUrl: '',
                    sourceUrlKey: 'source_url',
                    sourceTitle: 'title.rendered',
                    returnModelType: 'string',
                    returnModelKey: 'id',
                    returnModelPush: false,
                    sourcesOffsetKey: 'offset',
                    sourcesLimitKey:  'per_page',
                    sourcesSearchKey: 'search',
                    sourcesQuery: {
                        per_page : 20
                    },
                    deleteQuery: {
                        force: true
                    },
                    upload: {
                        crop: true,
                        multiple: false,
                        pattern: 'image/*',
                        minWidth: 300,
                        minHeight: 300,
                        cropArea: {
                            color: 'rgba(118, 118, 118, 0.8)',
                            colorDrag: 'rgba(118, 118, 118, 0.8)',
                            colorBg: 'rgba(200, 200, 200, 0.8)',
                            colorCropBg: 'rgba(0, 0, 0, 0.6)'
                        },
                        loadIcon: 'spinner:clock'
                    },
                    gallery: {
                        order: 'date',
                        searchValue: '',
                        multiple: !$scope.single,
                        selectedSources: [],
                        loadIcon: 'spinner:ripple'
                    },
                    model: [],
                    sources: []
                };

                $scope.media = rcMediaService.merge({}, default_media, $scope.media, $scope.config);

                if (!$scope.media.model.length && $scope.media.returnModelType === 'string') {
                    $scope.media.model = '';
                }

                if (angular.isDefined($scope.single)) {
                    $scope.media.gallery.multiple = !$scope.single;
                }

                $scope.getSourcesFromModel( $scope.initSources );

                $log.debug($scope.media);
            };


            $scope.removeSource = function ($index) {

                $scope.media.sources.splice($index, 1);

                if (angular.isArray($scope.media.model)) {
                    $scope.media.model.splice($index, 1);
                }
                else if(angular.isString($scope.media.model)) {
                    $scope.media.model = $scope.media.model.split(',');
                    $scope.media.model.splice($index, 1);
                    $scope.media.model = $scope.media.model.join(',');
                }
            };


            $scope.getModel = function () {

                var sources = $scope.media.sources.map(function(a) {return a[$scope.media.returnModelKey];});

                switch ($scope.media.returnModelType) {
                    case 'string':
                        $scope.media.model = sources.join(',');
                        break;
                    case 'array':
                        $scope.media.model = sources;
                        break;
                }
            };


            $scope.onSortSources = function ($item, $partFrom, $partTo, $indexFrom, $indexTo) {

                $log.debug($scope.media.sources);

                $scope.getModel();
            };


            $scope.getSourcesFromModel = function ( model_sources ) {

                var include = angular.isArray(model_sources) ? model_sources.join(',') : model_sources.toString();
                var sources = include.split(',');

                if(!include.length ) {
                    $scope.media.sources = [];

                    $scope.getModel();
                    return false;
                }

                var sources_query = angular.copy($scope.media.sourcesQuery);
                sources_query = angular.extend(sources_query, { include: include });

                $scope.loading = true;

                rcMediaService.get(sources_query).then(
                    function (response_success) {

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
                    },
                    function (response_error) {
                        $scope.loading = false;
                    }
                );
            };

            //Init
            this.init();
        }
    ]);

})(angular);
