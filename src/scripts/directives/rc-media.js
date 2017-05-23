(function(angular) {
    'use strict';

    var module = angular.module('rcMedia');


    module.directive("rcMedia", [ function () {
        return {
            restrict: "EA",
            require   : ['?ngModel'],
            scope     : {
                model        : '=ngModel',
                modelPreview : '=ngModelPreview',
                sourceUrl    : '@rcmSourceUrl',
                returnModelType : '@rcmReturnModelType',
                returnModelKey  : '@rcmReturnModelKey',
                returnModelPush : '=?rcmReturnModelPush',
                sourceId     : '@rcmSourceId',
                sourceUrlKey : '@rcmSourceUrlKey',
                sourceTitle  : '@rcmSourceTitle',
                sourcesOffsetKey: '@rcmSourcesOffsetKey',
                sourcesLimitKey : '@rcmSourcesLimitKey',
                sourcesSearchKey: '@rcmSourcesSearchKey',
                deleteQuery     : '@rcmDeleteQuery',
                sourcesQuery    : '@rcmSourcesQuery',
                onMediaReady       : '&rcmOnMediaReady',
                onUploadUpdateState: "&rcmOnUploadUpdateState",
                onUploadFile       : '&rcmOnUploadFile',
                onResetUploadFile  : '&rcmOnResetUploadFile',
                onSaveSources      : '&rcmOnSaveSources',
                onDeleteSources    : '&rcmOnDeleteSources',
                onSelectSource     : '&rcmOnSelectSource',
                onSearchSources    : '&rcmOnSearchSources',
                onLoadMoreSources  : '&rcmOnLoadMoreSources'
            },
            controller: "rcMediaCtrl",
            controllerAs: "rcMediaApi",
            link: {
                post: function (scope, elem, attr, controller) {
                    scope.rcMediaApi.rcMediaElement = angular.element(elem);
                }
            }
        };
    }]);

})(angular);
