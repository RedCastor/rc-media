(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');

    module.directive("rcmGallery", ['$window', '$timeout', '$log', function ($window, $timeout, $log) {
        return {
            restrict  : 'EA',
            require: "^rcMedia",
            scope     : {
                sources  : '=?ngModel',
                seletedSources  : '=?rcmSelectedSources',
                order   : '@?rcmOrder',
                multiple: '=?rcmMultiple',
                search  : '@?rcmSearchValue',
                loadIcon : '@?rcmLoadIcon'
            },
            templateUrl: function (elem, attrs) {
                return attrs.rcmTemplateUrl  || 'rc-media-gallery.tpl.html';
            },
            link: function (scope, elem, attrs, rcMediaApi) {

                scope.alerts = [];
                scope.loading = false;
                scope.loadMore = false;

                scope.sources = angular.isDefined(scope.sources) ? scope.sources : [];
                scope.seletedSources = angular.isDefined(scope.seletedSources) ? scope.seletedSources : [];
                scope.order = angular.isDefined(scope.order) ? scope.order : 'date';
                scope.multiple = angular.isDefined(scope.multiple) ? scope.multiple : false;
                scope.search = angular.isDefined(scope.search) ? scope.search : '';

                // FUNCTIONS
                scope.onChangeGalleryLoading = function (newValue, oldValue) {

                    if (newValue === false) {
                        scope.loadMore = rcMediaApi.gallery.loadMore;

                        if (angular.isObject(rcMediaApi.gallery.result) && angular.isDefined(rcMediaApi.gallery.result.message)) {
                            scope.alerts.push({type: 'alert', msg: rcMediaApi.gallery.result.message});
                        }
                    }
                    else {
                        scope.alerts = [];
                    }

                    scope.loading = newValue;
                };

                scope.onChangeSources = function (newValue, oldValue) {
                    $log.debug('onChangeSources');
                    if (newValue !== oldValue) {
                        $log.debug('onChangeSources');
                        scope.sources = newValue;
                    }
                };
                scope.onChangeSourcesSelected = function (newValue, oldValue) {

                    if (newValue !== oldValue) {
                        $log.debug('onChangeSourcesSelected');
                        scope.seletedSources = newValue;
                    }
                };

                scope.selectSource = function (source, index) {
                    rcMediaApi.selectSource(source, index);
                    scope.seletedSources = rcMediaApi.sourcesSelected;
                };

                scope.loadMoreSources = function () {

                    rcMediaApi.loadMoreSources().then(
                        function (response_success) {
                            scope.loadMore = response_success.length > 0 ? true : false;
                        },
                        function (response_error) {

                        }
                    );
                };

                scope.closeAlert = function(index) {
                    scope.alerts.splice(index, 1);
                };

                // INIT
                rcMediaApi.galleryElement = angular.element(elem);
                rcMediaApi.initMediaGallery( {
                        loading: scope.loading,
                        order: scope.order,
                        multiple: scope.multiple,
                        loadMore: scope.loadMore
                    },
                    scope.search
                );


                scope.rcMediaApi = rcMediaApi;

                scope.$watchCollection('rcMediaApi.sources', scope.onChangeSources);
                scope.$watchCollection('rcMediaApi.sourcesSelected', scope.onChangeSourcesSelected);
                scope.$watch('rcMediaApi.gallery.loading', scope.onChangeGalleryLoading);

            }
        };
    }]);

})(angular);
