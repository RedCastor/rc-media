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

            $scope.theme = angular.isDefined($scope.theme) ? $scope.theme : '';
            $scope.name = angular.isDefined($scope.name) ? $scope.name : 'media_sources';
            $scope.id = angular.isDefined($scope.id) ? $scope.id : $scope.name + '_select';
            $scope.type = angular.isDefined($scope.type) ? $scope.type : 'text';
            $scope.class = angular.isDefined($scope.class) ? $scope.class : '';
            $scope.onetime = angular.isDefined($scope.onetime) ? $scope.onetime : false;
            $scope.single = angular.isDefined($scope.single) ? $scope.single : false;

            $scope.initSources = angular.isDefined($scope.initSources) ? $scope.initSources : [];
            $scope.config = angular.isDefined($scope.config) ? $scope.$eval($scope.config) : {};

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
                    loadIcon: 'spinner:ripple'
                },
                gallery: {
                    order: 'date',
                    searchValue: '',
                    multiple: !$scope.single,
                    selectedSources: [],
                    loadIcon: 'spinner:ripple'
                },
                sources: $scope.initSources,
                sourcesPreview: angular.isArray($scope.initSources) ? $scope.initSources : []
            };

            //Deep Copy to new object with merge default, media and last config.
            $scope.media = angular.merge({}, default_media, $scope.media, $scope.config);

            $scope.getSources( $scope.media.sources );
        };


        $scope.removeSource = function ($index) {
            
            $scope.media.sourcesPreview.splice($index, 1);

            if (angular.isArray($scope.media.sources)) {
                $scope.media.sources.splice($index, 1);
            }
            else if(angular.isString($scope.media.sources)) {
                $scope.media.sources = $scope.media.sources.split(',');
                $scope.media.sources.splice($index, 1);
                $scope.media.sources = $scope.media.sources.join(',');
            }
        };


        $scope.getSources = function ( sources ) {

            if(angular.isArray(sources)) {
                sources = sources.join(',');
            }

            if((!angular.isString(sources) && !angular.isNumber(sources_str)) || sources.length === 0 ) {
                return false;
            }

            var sources_query = angular.copy($scope.media.sourcesQuery);
            sources_query = angular.extend(sources_query, { include: sources });

            $scope.loading = true;

            rcMediaService.get(sources_query).then(
                function (response_success) {
                    $scope.media.sourcesPreview = response_success;
                    sources = [];

                    angular.forEach(response_success, function(value, key) {
                        if (angular.isDefined(value[$scope.media.returnModelKey])) {
                            sources.push(value[$scope.media.returnModelKey]);
                        }
                    });

                    switch ($scope.media.returnModelType) {
                        case 'string':
                            $scope.media.sources = sources.toString();
                            break;
                        case 'array':
                            $scope.media.sources = sources;
                            break;
                    }

                    $scope.loading = false;
                },
                function (response_error) {
                    $scope.loading = false;
                }
            );
        };

        //Init
        this.init();
    }]);

})(angular);
