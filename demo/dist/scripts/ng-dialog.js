!function(e,a){"undefined"!=typeof module&&module.exports?(a("undefined"==typeof angular?require("angular"):angular),module.exports="ngDialog"):"function"==typeof define&&define.amd?define(["angular"],a):a(e.angular)}(this,function(e){"use strict";var a=e.module("ngDialog",[]),o=e.element,n=e.isDefined,t=(document.body||document.documentElement).style,l=n(t.animation)||n(t.WebkitAnimation)||n(t.MozAnimation)||n(t.MsAnimation)||n(t.OAnimation),i="animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend",r={html:!1,body:!1},s={},c=[],d=[],g=!1,u=!1,m=[];return a.provider("ngDialog",function(){var a=this.defaults={className:"ngdialog-theme-default",appendClassName:"",disableAnimation:!1,plain:!1,showClose:!0,closeByDocument:!0,closeByEscape:!0,closeByNavigation:!1,appendTo:!1,preCloseCallback:!1,onOpenCallback:!1,overlay:!0,cache:!0,trapFocus:!0,preserveFocus:!0,ariaAuto:!0,ariaRole:null,ariaLabelledById:null,ariaLabelledBySelector:null,ariaDescribedById:null,ariaDescribedBySelector:null,bodyClassName:"ngdialog-open",width:null,height:null};this.setForceHtmlReload=function(e){r.html=e||!1},this.setForceBodyReload=function(e){r.body=e||!1},this.setDefaults=function(o){e.extend(a,o)},this.setOpenOnePerName=function(e){u=e||!1};var n,t=0,p=0,f={};this.$get=["$document","$templateCache","$compile","$q","$http","$rootScope","$timeout","$window","$controller","$injector",function(v,y,h,b,D,C,$,A,S,E){var w=[],B={onDocumentKeydown:function(e){27===e.keyCode&&O.close("$escape")},activate:function(e){e.data("$ngDialogOptions").trapFocus&&(e.on("keydown",B.onTrapFocusKeydown),w.body.on("keydown",B.onTrapFocusKeydown))},deactivate:function(e){e.off("keydown",B.onTrapFocusKeydown),w.body.off("keydown",B.onTrapFocusKeydown)},deactivateAll:function(a){e.forEach(a,function(a){var o=e.element(a);B.deactivate(o)})},setBodyPadding:function(e){var a=parseInt(w.body.css("padding-right")||0,10);w.body.css("padding-right",a+e+"px"),w.body.data("ng-dialog-original-padding",a),C.$broadcast("ngDialog.setPadding",e)},resetBodyPadding:function(){var e=w.body.data("ng-dialog-original-padding");e?w.body.css("padding-right",e+"px"):w.body.css("padding-right",""),C.$broadcast("ngDialog.setPadding",0)},performCloseDialog:function(e,a){var o=e.data("$ngDialogOptions"),t=e.attr("id"),r=s[t];if(B.deactivate(e),r){if(void 0!==A.Hammer){var d=r.hammerTime;d.off("tap",n),d.destroy&&d.destroy(),delete r.hammerTime}else e.unbind("click");1===p&&w.body.unbind("keydown",B.onDocumentKeydown),e.hasClass("ngdialog-closing")||(p-=1);var u=e.data("$ngDialogPreviousFocus");u&&u.focus&&u.focus(),C.$broadcast("ngDialog.closing",e,a),p=p<0?0:p,l&&!o.disableAnimation?(r.$destroy(),e.unbind(i).bind(i,function(){B.closeDialogElement(e,a)}).addClass("ngdialog-closing")):(r.$destroy(),B.closeDialogElement(e,a)),f[t]&&(f[t].resolve({id:t,value:a,$dialog:e,remainingDialogs:p}),delete f[t]),s[t]&&delete s[t],c.splice(c.indexOf(t),1),c.length||(w.body.unbind("keydown",B.onDocumentKeydown),g=!1),0==p&&(n=void 0)}},closeDialogElement:function(e,a){var o=e.data("$ngDialogOptions");e.remove(),d.splice(d.indexOf(o.bodyClassName),1),-1===d.indexOf(o.bodyClassName)&&(w.html.removeClass(o.bodyClassName),w.body.removeClass(o.bodyClassName)),0===p&&B.resetBodyPadding(),C.$broadcast("ngDialog.closed",e,a)},closeDialog:function(a,o){var n=a.data("$ngDialogPreCloseCallback");if(n&&e.isFunction(n)){var t=n.call(a,o);if(e.isObject(t))t.closePromise?t.closePromise.then(function(){B.performCloseDialog(a,o)},function(){return!1}):t.then(function(){B.performCloseDialog(a,o)},function(){return!1});else{if(!1===t)return!1;B.performCloseDialog(a,o)}}else B.performCloseDialog(a,o)},onTrapFocusKeydown:function(a){var o,n=e.element(a.currentTarget);if(n.hasClass("ngdialog"))o=n;else if(null===(o=B.getActiveDialog()))return;var t=9===a.keyCode,l=!0===a.shiftKey;t&&B.handleTab(o,a,l)},handleTab:function(e,a,o){var n=B.getFocusableElements(e);if(0!==n.length){var t=document.activeElement,l=Array.prototype.indexOf.call(n,t),i=-1===l,r=0===l,s=l===n.length-1,c=!1;o?(i||r)&&(n[n.length-1].focus(),c=!0):(i||s)&&(n[0].focus(),c=!0),c&&(a.preventDefault(),a.stopPropagation())}else document.activeElement&&document.activeElement.blur&&document.activeElement.blur()},autoFocus:function(e){var a=e[0],n=a.querySelector("*[autofocus]");if(null===n||(n.focus(),document.activeElement!==n)){var t=B.getFocusableElements(e);if(t.length>0)t[0].focus();else{var l=B.filterVisibleElements(a.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span"));if(l.length>0){var i=l[0];o(i).attr("tabindex","-1").css("outline","0"),i.focus()}}}},getFocusableElements:function(e){var a=e[0].querySelectorAll("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"),o=B.filterTabbableElements(a);return B.filterVisibleElements(o)},filterTabbableElements:function(e){for(var a=[],n=0;n<e.length;n++){var t=e[n];"-1"!==o(t).attr("tabindex")&&a.push(t)}return a},filterVisibleElements:function(e){for(var a=[],o=0;o<e.length;o++){var n=e[o];(n.offsetWidth>0||n.offsetHeight>0)&&a.push(n)}return a},getActiveDialog:function(){var e=document.querySelectorAll(".ngdialog");return 0===e.length?null:o(e[e.length-1])},applyAriaAttributes:function(e,a){if(a.ariaAuto){if(!a.ariaRole){var o=B.getFocusableElements(e).length>0?"dialog":"alertdialog";a.ariaRole=o}a.ariaLabelledBySelector||(a.ariaLabelledBySelector="h1,h2,h3,h4,h5,h6"),a.ariaDescribedBySelector||(a.ariaDescribedBySelector="article,section,p")}a.ariaRole&&e.attr("role",a.ariaRole),B.applyAriaAttribute(e,"aria-labelledby",a.ariaLabelledById,a.ariaLabelledBySelector),B.applyAriaAttribute(e,"aria-describedby",a.ariaDescribedById,a.ariaDescribedBySelector)},applyAriaAttribute:function(e,a,n,t){if(n)e.attr(a,n);else if(t){var l=e.attr("id"),i=e[0].querySelector(t);if(!i)return;var r=l+"-"+a;return o(i).attr("id",r),e.attr(a,r),r}},detectUIRouter:function(){return E.has("$transitions")?"1.0.0+":!!E.has("$state")&&"legacy"},getRouterLocationEventName:function(){return B.detectUIRouter()?"$stateChangeStart":"$locationChangeStart"}},O={__PRIVATE__:B,open:function(l){function i(a,o){return(o=o||{}).headers=o.headers||{},e.extend(o.headers,{Accept:"text/html"}),C.$broadcast("ngDialog.templateLoading",a),D.get(a,o).then(function(e){return C.$broadcast("ngDialog.templateLoaded",a),e.data||""})}var r=null;if(l=l||{},!(u&&l.name&&(r=l.name.toLowerCase().replace(/\s/g,"-")+"-dialog",this.isOpen(r)))){var v=e.copy(a),k=++t;r=r||"ngdialog"+k,c.push(r),void 0!==v.data&&(void 0===l.data&&(l.data={}),l.data=e.merge(e.copy(v.data),l.data)),e.extend(v,l);var F;f[r]=F=b.defer();var N;s[r]=N=e.isObject(v.scope)?v.scope.$new():C.$new();var T,x,P,I=e.extend({},v.resolve);return e.forEach(I,function(a,o){I[o]=e.isString(a)?E.get(a):E.invoke(a,null,null,o)}),b.all({template:function(a){return a?e.isString(a)&&v.plain?a:"boolean"!=typeof v.cache||v.cache?i(a,{cache:y}):i(a,{cache:!1}):"Empty template"}(v.template||v.templateUrl),locals:b.all(I)}).then(function(a){var t=a.template,l=a.locals;v.showClose&&(t+='<button aria-label="Dismiss" class="ngdialog-close"></button>');var i=v.overlay?"":" ngdialog-no-overlay";if((T=o('<div id="'+r+'" class="ngdialog'+i+'"></div>')).html(v.overlay?'<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">'+t+"</div>":'<div class="ngdialog-content" role="document">'+t+"</div>"),T.data("$ngDialogOptions",v),N.ngDialogId=r,v.data&&e.isString(v.data)){var s=v.data.replace(/^\s*/,"")[0];N.ngDialogData="{"===s||"["===s?e.fromJson(v.data):new String(v.data),N.ngDialogData.ngDialogId=r}else v.data&&e.isObject(v.data)&&(N.ngDialogData=v.data,N.ngDialogData.ngDialogId=r);if(v.className&&T.addClass(v.className),v.appendClassName&&T.addClass(v.appendClassName),v.width&&(P=T[0].querySelector(".ngdialog-content"),e.isString(v.width)?P.style.width=v.width:P.style.width=v.width+"px"),v.height&&(P=T[0].querySelector(".ngdialog-content"),e.isString(v.height)?P.style.height=v.height:P.style.height=v.height+"px"),v.disableAnimation&&T.addClass("ngdialog-disabled-animation"),x=v.appendTo&&e.isString(v.appendTo)?e.element(document.querySelector(v.appendTo)):w.body,B.applyAriaAttributes(T,v),[{name:"$ngDialogPreCloseCallback",value:v.preCloseCallback},{name:"$ngDialogOnOpenCallback",value:v.onOpenCallback}].forEach(function(a){if(a.value){var o;e.isFunction(a.value)?o=a.value:e.isString(a.value)&&N&&(e.isFunction(N[a.value])?o=N[a.value]:N.$parent&&e.isFunction(N.$parent[a.value])?o=N.$parent[a.value]:C&&e.isFunction(C[a.value])&&(o=C[a.value])),o&&T.data(a.name,o)}}),N.closeThisDialog=function(e){B.closeDialog(T,e)},v.controller&&(e.isString(v.controller)||e.isArray(v.controller)||e.isFunction(v.controller))){var c;v.controllerAs&&e.isString(v.controllerAs)&&(c=v.controllerAs);var u=S(v.controller,e.extend(l,{$scope:N,$element:T}),!0,c);v.bindToController&&e.extend(u.instance,{ngDialogId:N.ngDialogId,ngDialogData:N.ngDialogData,closeThisDialog:N.closeThisDialog,confirm:N.confirm}),"function"==typeof u?T.data("$ngDialogControllerController",u()):T.data("$ngDialogControllerController",u)}return $(function(){var a=document.querySelectorAll(".ngdialog");B.deactivateAll(a),h(T)(N);var o=A.innerWidth-w.body.prop("clientWidth");w.html.addClass(v.bodyClassName),w.body.addClass(v.bodyClassName),d.push(v.bodyClassName);var n=o-(A.innerWidth-w.body.prop("clientWidth"));n>0&&B.setBodyPadding(n),x.append(T),B.activate(T),v.trapFocus&&B.autoFocus(T),v.name?C.$broadcast("ngDialog.opened",{dialog:T,name:v.name}):C.$broadcast("ngDialog.opened",T);var t=T.data("$ngDialogOnOpenCallback");t&&e.isFunction(t)&&t.call(T)}),g||(w.body.bind("keydown",B.onDocumentKeydown),g=!0),v.closeByNavigation&&m.push(T),v.preserveFocus&&T.data("$ngDialogPreviousFocus",document.activeElement),n=function(e){var a=!!v.closeByDocument&&o(e.target).hasClass("ngdialog-overlay"),n=o(e.target).hasClass("ngdialog-close");(a||n)&&O.close(T.attr("id"),n?"$closeButton":"$document")},void 0!==A.Hammer?(N.hammerTime=A.Hammer(T[0])).on("tap",n):T.bind("click",n),p+=1,O}),{id:r,closePromise:F.promise,close:function(e){B.closeDialog(T,e)}}}},openConfirm:function(n){var t=b.defer(),l=e.copy(a);n=n||{},void 0!==l.data&&(void 0===n.data&&(n.data={}),n.data=e.merge(e.copy(l.data),n.data)),e.extend(l,n),l.scope=e.isObject(l.scope)?l.scope.$new():C.$new(),l.scope.confirm=function(e){t.resolve(e);var a=o(document.getElementById(i.id));B.performCloseDialog(a,e)};var i=O.open(l);if(i)return i.closePromise.then(function(e){return e?t.reject(e.value):t.reject()}),t.promise},isOpen:function(e){return o(document.getElementById(e)).length>0},close:function(e,a){var n=o(document.getElementById(e));if(n.length)B.closeDialog(n,a);else if("$escape"===e){var t=c[c.length-1];(n=o(document.getElementById(t))).data("$ngDialogOptions").closeByEscape&&B.closeDialog(n,"$escape")}else O.closeAll(a);return O},closeAll:function(e){for(var a=document.querySelectorAll(".ngdialog"),n=a.length-1;n>=0;n--){var t=a[n];B.closeDialog(o(t),e)}},getOpenDialogs:function(){return c},getDefaults:function(){return a}};e.forEach(["html","body"],function(e){if(w[e]=v.find(e),r[e]){var a=B.getRouterLocationEventName();C.$on(a,function(){w[e]=v.find(e)})}});var k=B.detectUIRouter();if("1.0.0+"===k)E.get("$transitions").onStart({},function(e){for(;m.length>0;){var a=m.pop();if(!1===B.closeDialog(a))return!1}});else{var F="legacy"===k?"$stateChangeStart":"$locationChangeStart";C.$on(F,function(e){for(;m.length>0;){var a=m.pop();!1===B.closeDialog(a)&&e.preventDefault()}})}return O}]}),a.directive("ngDialog",["ngDialog",function(a){return{restrict:"A",scope:{ngDialogScope:"="},link:function(o,n,t){n.on("click",function(n){n.preventDefault();var l=e.isDefined(o.ngDialogScope)?o.ngDialogScope:"noScope";e.isDefined(t.ngDialogClosePrevious)&&a.close(t.ngDialogClosePrevious);var i=a.getDefaults();a.open({template:t.ngDialog,className:t.ngDialogClass||i.className,appendClassName:t.ngDialogAppendClass,controller:t.ngDialogController,controllerAs:t.ngDialogControllerAs,bindToController:t.ngDialogBindToController,disableAnimation:t.ngDialogDisableAnimation,scope:l,data:t.ngDialogData,showClose:"false"!==t.ngDialogShowClose&&("true"===t.ngDialogShowClose||i.showClose),closeByDocument:"false"!==t.ngDialogCloseByDocument&&("true"===t.ngDialogCloseByDocument||i.closeByDocument),closeByEscape:"false"!==t.ngDialogCloseByEscape&&("true"===t.ngDialogCloseByEscape||i.closeByEscape),overlay:"false"!==t.ngDialogOverlay&&("true"===t.ngDialogOverlay||i.overlay),preCloseCallback:t.ngDialogPreCloseCallback||i.preCloseCallback,onOpenCallback:t.ngDialogOnOpenCallback||i.onOpenCallback,bodyClassName:t.ngDialogBodyClass||i.bodyClassName})})}}}]),a});
//# sourceMappingURL=ng-dialog.js.map
