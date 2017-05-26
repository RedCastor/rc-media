(function(angular){
    'use strict';

    // Load module rc-media
    var module = angular.module('rcMedia');

    //Enable cancellable resource
    module.config(function($resourceProvider) {
        $resourceProvider.defaults.cancellable = true;
    });

    module.provider('rcMedia', [ function rcMediaProvider() {

        this.rest = {
            url: '',
            path: '/wp-json/wp/v2/media'
        };

        this.locale = null;

        // default localized text. cannot be modified.
        this.defaultText = {
            'en-us': {
                TITLE_GALLERY       : 'Gallery',
                TITLE_UPLOAD        : 'Upload files',
                TITLE_DRAG_FILE     : 'Drag files to upload',
                SUB_TITLE_DRAG_FILE : 'or',
                BTN_CANCEL          : 'Cancel',
                BTN_SAVE            : 'Save',
                BTN_DELETE_FILE     : 'Delete file',
                BTN_DELETE_FILES    : 'Delete files',
                BTN_DESELECT_ALL    : 'Deselect all',
                BTN_SELECT_FILE     : 'Select file',
                BTN_SELECT_FILES    : 'Select files',
                BTN_SHOW_MORE       : 'Show More',
                BTN_BACK_GALLERY    : 'Back to gallery',
                BTN_UPLOAD_FILE     : 'Upload file',
                BTN_UPLOAD_FILES    : 'Upload files',
                BTN_BROWSE_FILE     : 'Browse a file',
                UPLOAD_INVALID_FILE : 'Your file is not valid.',
                UPLOAD_INVALID_minWidth : 'Minimum width',
                UPLOAD_INVALID_minHeight: 'Minimum height',
                UPLOAD_INVALID_pattern  : 'File type error'
            },
            'fr-FR': {
                TITLE_GALLERY       : 'Gallerie',
                TITLE_UPLOAD        : 'Télécharger un fichier',
                TITLE_DRAG_FILE     : 'Glisser le fichier ici',
                SUB_TITLE_DRAG_FILE : 'ou',
                BTN_CANCEL          : 'Annuler',
                BTN_SAVE            : 'Sauver',
                BTN_DELETE_FILE     : 'Supprimer le fichier',
                BTN_DELETE_FILES    : 'Supprimer les fichiers',
                BTN_DESELECT_ALL    : 'Déselectioner tous',
                BTN_SELECT_FILE     : 'Selectioner le fichier',
                BTN_SELECT_FILES    : 'Selectioner les fichiers',
                BTN_SHOW_MORE       : 'Voir plus',
                BTN_BACK_GALLERY    : 'Revenir à la gallerie',
                BTN_UPLOAD_FILE     : 'Télécharger le fichier',
                BTN_UPLOAD_FILES    : 'Télécharger les fichiers',
                BTN_BROWSE_FILE     : 'Choisir un fichier',
                UPLOAD_INVALID_FILE : 'Votre fichier n\'est pas valide.',
                UPLOAD_INVALID_minWidth : 'Largeur minimum',
                UPLOAD_INVALID_minHeight: 'Hauteur minimum',
                UPLOAD_INVALID_pattern  : 'Type de fichier erroné'
            }
        };

        // localized text which actually being used.
        this.interfaceText = angular.copy(this.defaultText);



        this.$get = [ '$http', '$locale', function( $http, $locale ) {
            var rest = this.rest;
            var localizedText;

            //Enable Cors
            $http.defaults.useXDomain = true;
            $http.defaults.headers.common['Access-Control-Allow-Origin']  = '*';

            // Disable IE ajax request caching
            $http.defaults.headers.common['If-Modified-Since']  = '0';
            //Disable caching
            $http.defaults.headers.common['cache-control']      = 'private, max-age=0, no-cache';

            //Translation
            if(this.locale) {
                localizedText = this.interfaceText[this.locale];
            } else {
                localizedText = this.interfaceText[$locale.id];
            }

            if(!localizedText) {
                localizedText = this.defaultText['en-us'];
            }

            return {
                getRest: function() {
                    return rest;
                },
                getLocalizedText: function ( item ) {

                    if (item) {
                        var text = localizedText[item];

                        return (text) ? text : '';
                    }

                    return localizedText;
                }
            };
        }];

        /**
         * Merge with default localized text.
         * @param localeId a string formatted as languageId-countryId
         * @param obj localized text object.
         */
        this.setLocalizedText = function(localeId, obj) {
            if(!localeId) {
                throw new Error('localeId must be a string formatted as languageId-countryId');
            }
            if(!this.interfaceText[localeId]) {
                this.interfaceText[localeId] = {};
            }
            this.interfaceText[localeId] = angular.extend(this.interfaceText[localeId], obj);
        };

        /**
         * Force to use a special locale id. if localeId is null. reset to user-agent locale.
         * @param localeId a string formatted as languageId-countryId
         */
        this.useLocale = function(localeId) {
            var local = localeId.split('-');

            if (local.length === 1) {
                switch (localeId) {
                    case 'en':
                        localeId += '-US';
                        break;
                    default:
                        localeId += '-' + localeId.toUpperCase();
                }
            }

            console.log(localeId);
            this.locale = localeId;
        };

        this.setRest = function(rest) {
            this.rest = rest;
        };

    }]);


    //Media Resource
    module.factory( 'rcMediaResource', [ '$resource', 'rcMedia', function ( $resource, rcMedia ) {

        var rest_url = rcMedia.getRest().url + rcMedia.getRest().path;

        var resource = {
            Media: $resource(rest_url + '/:mediaId',
                {mediaId: '@media_id'},
                {get: {
                    method: 'GET',
                    isArray: false,
                    cache: false
                }},
                {query: {
                    method: 'GET',
                    params:{},
                    isArray: true,
                    cache: false,
                    cancellable: true
                }}
            )
        };

        return resource;

    }]);

    //Media Service Abstraction
    module.factory('rcMediaService', ['$log', '$q', 'rcMedia', 'rcMediaResource', function ( $log, $q, rcMedia, rcMediaResource ) {

        var service = {

            getRestUrl: function () {
                return rcMedia.getRest().url + rcMedia.getRest().path;
            },

            get: function( sources_query, cancel ){

                //Cancel last request if param true
                if (cancel === true && this.request !== undefined && angular.isFunction(this.request.$cancelRequest)) {

                    this.request.$cancelRequest();
                }

                if ( angular.isNumber(sources_query) ) {
                    sources_query = {mediaId: sources_query};

                    this.request = rcMediaResource.Media.get( sources_query );
                }
                else {
                    if ( !angular.isObject(sources_query) ) {
                        sources_query = {};
                    }

                    this.request = rcMediaResource.Media.query( sources_query );
                }

                return this.request.$promise;
            },

            delete: function ( source_id, delete_query ) {

                if (angular.isUndefined(delete_query)) {
                    delete_query = {};
                }

                angular.extend(delete_query, { mediaId: source_id } );

                return rcMediaResource.Media.delete( delete_query ).$promise;
            }

        };

        return service;
    }]);

})(angular);
