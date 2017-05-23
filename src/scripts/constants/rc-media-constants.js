(function(angular) {
    'use strict';


    var module = angular.module('rcMedia');

    module.constant("RCMEDIA_UPLOAD_STATES", {
        SELECT_FILES  : "selectFiles",
        CROP_IMAGE   : "cropImage",
        PROGRESS_FILES: "progressFiles"
    });

})(angular);
