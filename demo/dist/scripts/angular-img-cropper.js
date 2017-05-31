!function(t,i){"use strict";var e=t.module("angular-img-cropper",[]);e.factory("__extends",function(){var t=t||function(t,i){function e(){this.constructor=t}for(var o in i)i.hasOwnProperty(o)&&(t[o]=i[o]);e.prototype=i.prototype,t.prototype=new e};return t}),e.directive("imgCropper",["$document","$window","ImageCropper",function(t,e,o){return{scope:{imgSrc:"=",imgDst:"=",cropWidth:"=",cropHeight:"=",keepAspect:"=",keepAspectRatio:"=",touchRadius:"=",cropAreaBounds:"=",minWidth:"=",minHeight:"=",enforceCropAspect:"=",enforceFileType:"@",color:"@",colorDrag:"@",colorBg:"@",colorCropBg:"@"},restrict:"A",link:function(t,e,s){function n(e,n){if(!a||e!==n){var h=t.cropWidth,g=t.cropHeight,p=t.keepAspect,u=t.keepAspectRatio,l=t.touchRadius,d=a&&a.srcImage;a=new o(c,c.width/2-h/2,c.height/2-g/2,h,g,p,u,l,t,s),i(c).data("crop.angular-img-cropper",a),d?a.setImage(d,t.imgSrc.fileType):r(t.imgSrc)}}function r(i){if(i){var e=new Image;void 0!==s.cors&&"no"!==s.cors&&(e.crossOrigin="Anonymous"),e.addEventListener("load",function(){a.setImage(e,i.fileType),t.$apply()},!1),e.src=i.imageData}}var a,h=!1,c=e[0];t.color=t.color||"rgba(90,90,90,0.75)",t.colorDrag=t.colorDrag||"rgba(0, 0, 0, 0.7)",t.colorBg=t.colorBg||"rgba(192,192,192,1)",t.colorCropBg=t.colorCropBg||"rgba(0, 0, 0, 0.7)",t.$on("$destroy",function(){h=!0}),t.$watch("cropWidth",n),t.$watch("cropHeight",n),t.$watch("keepAspect",n),t.$watch("touchRadius",n),t.$watch("imgSrc",r)}}}])}(angular,angular.element),function(t,i,e){"use strict";e.directive("imgCropperFilereadCall",function(){return{scope:{control:"="},link:function(i){i.internalControl=i.control||{},i.internalControl.load=function(i){var e=t.element(document.querySelector(i)),o=document.createEvent("MouseEvent");o.initEvent("click",!0,!1),e[0].dispatchEvent(o)}}}})}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.directive("imgCropperFileread",["$timeout",function(t){return{scope:{image:"="},link:function(i,e){e.bind("change",function(e){var o=new FileReader,s=this;o.onload=function(e){t(function(){var t=s;i.image={imageData:e.target.result,fileType:t.fileType}},0)},e.target.files[0]&&(s.fileType=e.target.files[0].type,o.readAsDataURL(e.target.files[0]))})}}}])}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("Bounds",["PointPool",function(t){function i(t,i,e,o){void 0===t&&(t=0),void 0===i&&(i=0),void 0===e&&(e=0),void 0===o&&(o=0),this.left=t,this.right=t+e,this.top=i,this.bottom=i+o}return i.prototype.getWidth=function(){return this.right-this.left},i.prototype.getHeight=function(){return this.bottom-this.top},i.prototype.getCentre=function(){var i=this.getWidth(),e=this.getHeight();return t.instance.borrow(this.left+i/2,this.top+e/2)},i}])}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("CornerMarker",["Handle","__extends",function(t,i){return function(t){function e(i,e,o,s,n){t.call(this,i,e,o),this.color="rgba(90,90,90,0.75)"|s,this.colorCropBg="rgba(0,0,0,1)"|n}return i(e,t),e.prototype.drawCornerBorder=function(t){var i=10;(this.over||this.drag)&&(i=12);var e=1,o=1;this.horizontalNeighbour.position.x<this.position.x&&(e=-1),this.verticalNeighbour.position.y<this.position.y&&(o=-1),t.beginPath(),t.lineJoin="miter",t.moveTo(this.position.x,this.position.y),t.lineTo(this.position.x+i*e,this.position.y),t.lineTo(this.position.x+i*e,this.position.y+i*o),t.lineTo(this.position.x,this.position.y+i*o),t.lineTo(this.position.x,this.position.y),t.closePath(),t.lineWidth=2,t.strokeStyle=this.color,t.stroke()},e.prototype.drawCornerFill=function(t){var i=10;(this.over||this.drag)&&(i=12);var e=1,o=1;this.horizontalNeighbour.position.x<this.position.x&&(e=-1),this.verticalNeighbour.position.y<this.position.y&&(o=-1),t.beginPath(),t.moveTo(this.position.x,this.position.y),t.lineTo(this.position.x+i*e,this.position.y),t.lineTo(this.position.x+i*e,this.position.y+i*o),t.lineTo(this.position.x,this.position.y+i*o),t.lineTo(this.position.x,this.position.y),t.closePath(),t.fillStyle=this.colorCropBg,t.fill()},e.prototype.moveX=function(t){this.setPosition(t,this.position.y)},e.prototype.moveY=function(t){this.setPosition(this.position.x,t)},e.prototype.move=function(t,i){this.setPosition(t,i),this.verticalNeighbour.moveX(t),this.horizontalNeighbour.moveY(i)},e.prototype.addHorizontalNeighbour=function(t){this.horizontalNeighbour=t},e.prototype.addVerticalNeighbour=function(t){this.verticalNeighbour=t},e.prototype.getHorizontalNeighbour=function(){return this.horizontalNeighbour},e.prototype.getVerticalNeighbour=function(){return this.verticalNeighbour},e.prototype.draw=function(t){this.drawCornerFill(t),this.drawCornerBorder(t)},e}(t)}])}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("CropService",function(){function t(){}return t.init=function(t){this.canvas=t,this.ctx=this.canvas.getContext("2d")},t.DEG2RAD=.0174532925,t})}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("CropTouch",function(){function t(t,i,e){void 0===t&&(t=0),void 0===i&&(i=0),void 0===e&&(e=0),this.id=0,this.x=t,this.y=i,this.id=e}return t})}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("DragMarker",["Handle","__extends","PointPool",function(t,i,e){return function(t){function o(i,e,o,s){t.call(this,i,e,o),this.iconPoints=new Array,this.scaledIconPoints=new Array,this.getDragIconPoints(this.iconPoints,1),this.getDragIconPoints(this.scaledIconPoints,1.2),this.color=s||"rgba(90, 90, 90, 0.75)"}return i(o,t),o.prototype.draw=function(t){this.over||this.drag?this.drawIcon(t,this.scaledIconPoints):this.drawIcon(t,this.iconPoints)},o.prototype.getDragIconPoints=function(t,i){var o=17*i,s=14*i,n=8*i,r=4*i;t.push(e.instance.borrow(-r/2,o-n)),t.push(e.instance.borrow(-s/2,o-n)),t.push(e.instance.borrow(0,o)),t.push(e.instance.borrow(s/2,o-n)),t.push(e.instance.borrow(r/2,o-n)),t.push(e.instance.borrow(r/2,r/2)),t.push(e.instance.borrow(o-n,r/2)),t.push(e.instance.borrow(o-n,s/2)),t.push(e.instance.borrow(o,0)),t.push(e.instance.borrow(o-n,-s/2)),t.push(e.instance.borrow(o-n,-r/2)),t.push(e.instance.borrow(r/2,-r/2)),t.push(e.instance.borrow(r/2,-o+n)),t.push(e.instance.borrow(s/2,-o+n)),t.push(e.instance.borrow(0,-o)),t.push(e.instance.borrow(-s/2,-o+n)),t.push(e.instance.borrow(-r/2,-o+n)),t.push(e.instance.borrow(-r/2,-r/2)),t.push(e.instance.borrow(-o+n,-r/2)),t.push(e.instance.borrow(-o+n,-s/2)),t.push(e.instance.borrow(-o,0)),t.push(e.instance.borrow(-o+n,s/2)),t.push(e.instance.borrow(-o+n,r/2)),t.push(e.instance.borrow(-r/2,r/2))},o.prototype.drawIcon=function(t,i){t.beginPath(),t.moveTo(i[0].x+this.position.x,i[0].y+this.position.y);for(var e=0;e<i.length;e++){var o=i[e];t.lineTo(o.x+this.position.x,o.y+this.position.y)}t.closePath(),t.fillStyle=this.color,t.fill()},o.prototype.recalculatePosition=function(t){var i=t.getCentre();this.setPosition(i.x,i.y),e.instance.returnPoint(i)},o}(t)}])}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("Handle",["Point",function(t){function i(i,e,o){this.over=!1,this.drag=!1,this.position=new t(i,e),this.offset=new t(0,0),this.radius=o}return i.prototype.setDrag=function(t){this.drag=t,this.setOver(t)},i.prototype.draw=function(t){},i.prototype.setOver=function(t){this.over=t},i.prototype.touchInBounds=function(t,i){return t>this.position.x-this.radius&&t<this.position.x+this.radius&&i>this.position.y-this.radius&&i<this.position.y+this.radius},i.prototype.getPosition=function(){return this.position},i.prototype.setPosition=function(t,i){this.position.x=t,this.position.y=i},i}])}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("imageCropperDataShare",function(){var i,e,o={};return o.setPressed=function(t){i=t},o.setReleased=function(t){t===i&&(i=void 0)},o.setOver=function(t){e=t},o.setStyle=function(o,s){void 0!==i?i===o&&t.element(document.documentElement).css("cursor",s):o===e&&t.element(document.documentElement).css("cursor",s)},o})}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("ImageCropper",["__extends","Handle","Point","PointPool","CropService","DragMarker","CornerMarker","Bounds","CropTouch","imageCropperDataShare",function(i,e,o,s,n,r,a,h,c,g){function p(i,e,o,h,c,g,p,u,l,d){void 0===e&&(e=0),void 0===o&&(o=0),void 0===h&&(h=100),void 0===c&&(c=50),void 0===g&&(g=!0),void 0===u&&(u=20),this.scope=l,this.attrs=d,this.keepAspect=!1,this.aspectRatio=0,this.currentDragTouches=new Array,this.isMouseDown=!1,this.ratioW=1,this.ratioH=1,this.fileType="image/png",this.imageSet=!1,this.pointPool=new s(200),n.init(i),this.buffer=document.createElement("canvas"),this.cropCanvas=document.createElement("canvas"),this.buffer.width=i.width,this.buffer.height=i.height,this.tl=new a(e,o,u,this.scope.colorDrag,this.scope.colorCropBg),this.tr=new a(e+h,o,u,this.scope.colorDrag,this.scope.colorCropBg),this.bl=new a(e,o+c,u,this.scope.colorDrag,this.scope.colorCropBg),this.br=new a(e+h,o+c,u,this.scope.colorDrag,this.scope.colorCropBg),this.tl.addHorizontalNeighbour(this.tr),this.tl.addVerticalNeighbour(this.bl),this.tr.addHorizontalNeighbour(this.tl),this.tr.addVerticalNeighbour(this.br),this.bl.addHorizontalNeighbour(this.br),this.bl.addVerticalNeighbour(this.tl),this.br.addHorizontalNeighbour(this.bl),this.br.addVerticalNeighbour(this.tr),this.markers=[this.tl,this.tr,this.bl,this.br],this.center=new r(e+h/2,o+c/2,u,this.scope.colorDrag),this.canvas=i,this.ctx=this.canvas.getContext("2d"),this.keepAspect=g,this.keepAspectRatio=p||!1,this.aspectRatio=c/h,this.draw(this.ctx),this.croppedImage=new Image,this.currentlyInteracting=!1,this.enforceCropAspect=this.scope.enforceCropAspect||!1,this.enforceFileType=this.scope.enforceFileType?"image/"+this.scope.enforceFileType:void 0,window.jQuery?(t.element(window).off("mousemove.angular-img-cropper mouseup.angular-img-cropper").on("mousemove.angular-img-cropper",this.onMouseMove.bind(this)).on("mouseup.angular-img-cropper",this.onMouseUp.bind(this)),t.element(i).off("mousedown.angular-img-cropper touchstart.angular-img-cropper  touchmove.angular-img-cropper touchend.angular-img-cropper").on("mousedown.angular-img-cropper",this.onMouseDown.bind(this)).on("touchstart.angular-img-cropper",this.onTouchStart.bind(this)).on("touchmove.angular-img-cropper",this.onTouchMove.bind(this)).on("touchend.angular-img-cropper",this.onTouchEnd.bind(this))):(window.addEventListener("mousemove",this.onMouseMove.bind(this)),window.addEventListener("mouseup",this.onMouseUp.bind(this)),i.addEventListener("mousedown",this.onMouseDown.bind(this)),i.addEventListener("touchmove",this.onTouchMove.bind(this),!1),i.addEventListener("touchstart",this.onTouchStart.bind(this),!1),i.addEventListener("touchend",this.onTouchEnd.bind(this),!1))}return p.prototype.resizeCanvas=function(t,i){this.canvas.width=t,this.canvas.height=i,this.buffer.width=t,this.buffer.height=i,this.draw(this.ctx)},p.prototype.draw=function(t){var i=this.getBounds();if(this.srcImage){t.clearRect(0,0,this.canvasWidth,this.canvasHeight),t.fillStyle=this.scope.colorBg,t.fillRect(0,0,this.canvas.width,this.canvas.height);var e=this.srcImage.height/this.srcImage.width,o=this.canvasHeight/this.canvasWidth,s=this.canvasWidth,n=this.canvasHeight,r=0,a=0;o>e?(s=this.canvasWidth,n=this.canvasWidth*e):(n=this.canvasHeight,s=this.canvasHeight/e),this.ratioW=s/this.srcImage.width,this.ratioH=n/this.srcImage.height,o<e?r=this.buffer.width/2-s/2:a=this.buffer.height/2-n/2,this.drawImageIOSFix(t,this.srcImage,0,0,this.srcImage.width,this.srcImage.height,r,a,s,n),this.buffer.getContext("2d").drawImage(this.canvas,0,0,this.canvasWidth,this.canvasHeight),t.fillStyle=this.scope.colorCropBg,t.fillRect(r,a,s,n),t.drawImage(this.buffer,i.left,i.top,Math.max(i.getWidth(),1),Math.max(i.getHeight(),1),i.left,i.top,i.getWidth(),i.getHeight());for(var h,c=0;c<this.markers.length;c++)h=this.markers[c],h.draw(t);this.center.draw(t),t.lineWidth=2,t.strokeStyle=this.scope.color,t.strokeRect(i.left,i.top,i.getWidth(),i.getHeight())}else t.fillStyle=this.scope.colorBg,t.fillRect(0,0,this.canvas.width,this.canvas.height)},p.prototype.dragCrop=function(t,i,e){var o=this.getBounds(),s=t-o.getWidth()/2,n=t+o.getWidth()/2,r=i-o.getHeight()/2,a=i+o.getHeight()/2;n>=this.maxXClamp&&(t=this.maxXClamp-o.getWidth()/2),s<=this.minXClamp&&(t=o.getWidth()/2+this.minXClamp),r<this.minYClamp&&(i=o.getHeight()/2+this.minYClamp),a>=this.maxYClamp&&(i=this.maxYClamp-o.getHeight()/2),this.tl.moveX(t-o.getWidth()/2),this.tl.moveY(i-o.getHeight()/2),this.tr.moveX(t+o.getWidth()/2),this.tr.moveY(i-o.getHeight()/2),this.bl.moveX(t-o.getWidth()/2),this.bl.moveY(i+o.getHeight()/2),this.br.moveX(t+o.getWidth()/2),this.br.moveY(i+o.getHeight()/2),e.setPosition(t,i),this.scope.cropAreaBounds&&this.imageSet&&(this.scope.cropAreaBounds=this.getCropBounds(),this.scope.$apply())},p.prototype.enforceMinSize=function(t,i,e){var o=t-e.getHorizontalNeighbour().getPosition().x,n=i-e.getVerticalNeighbour().getPosition().y,r=this.scope.minWidth-Math.abs(o),a=this.scope.minHeight-Math.abs(n);return 0==o||0==n?(t=e.getPosition().x,i=e.getPosition().y,s.instance.borrow(t,i)):(this.scope.keepAspect?r>0&&a/this.aspectRatio>0?r>a/this.aspectRatio?o<0?(t-=r,n<0?i-=r*this.aspectRatio:i+=r*this.aspectRatio):(t+=r,n<0?i-=r*this.aspectRatio:i+=r*this.aspectRatio):n<0?(i-=a,o<0?t-=a/this.aspectRatio:t+=a/this.aspectRatio):(i+=a,o<0?t-=a/this.aspectRatio:t+=a/this.aspectRatio):r>0?o<0?(t-=r,n<0?i-=r*this.aspectRatio:i+=r*this.aspectRatio):(t+=r,n<0?i-=r*this.aspectRatio:i+=r*this.aspectRatio):a>0&&(n<0?(i-=a,o<0?t-=a/this.aspectRatio:t+=a/this.aspectRatio):(i+=a,o<0?t-=a/this.aspectRatio:t+=a/this.aspectRatio)):(r>0&&(o<0?t-=r:t+=r),a>0&&(n<0?i-=a:i+=a)),(t<this.minXClamp||t>this.maxXClamp||i<this.minYClamp||i>this.maxYClamp)&&(t=e.getPosition().x,i=e.getPosition().y),s.instance.borrow(t,i))},p.prototype.dragCorner=function(t,i,e){var o,n=0,r=0,a=0,h=0,c=0,g=0,p=0,u=0,l=0;if(this.scope.keepAspect){if(o=e.getHorizontalNeighbour().getVerticalNeighbour(),a=o.getPosition().x,h=o.getPosition().y,t<=o.getPosition().x){if(i<=o.getPosition().y){if(n=a-100/this.aspectRatio,r=h-100/this.aspectRatio*this.aspectRatio,(l=this.getSide(s.instance.borrow(n,r),o.getPosition(),s.instance.borrow(t,i)))>0){c=Math.abs(o.getPosition().y-i),g=c/this.aspectRatio,p=o.getPosition().y-c,u=o.getPosition().x-g;var d=this.enforceMinSize(u,p,e);e.move(d.x,d.y),s.instance.returnPoint(d)}else if(l<0){g=Math.abs(o.getPosition().x-t),c=g*this.aspectRatio,p=o.getPosition().y-c,u=o.getPosition().x-g;var d=this.enforceMinSize(u,p,e);e.move(d.x,d.y),s.instance.returnPoint(d)}}else if(n=a-100/this.aspectRatio,r=h+100/this.aspectRatio*this.aspectRatio,(l=this.getSide(s.instance.borrow(n,r),o.getPosition(),s.instance.borrow(t,i)))>0){g=Math.abs(o.getPosition().x-t),c=g*this.aspectRatio,p=o.getPosition().y+c,u=o.getPosition().x-g;var d=this.enforceMinSize(u,p,e);e.move(d.x,d.y),s.instance.returnPoint(d)}else if(l<0){c=Math.abs(o.getPosition().y-i),g=c/this.aspectRatio,p=o.getPosition().y+c,u=o.getPosition().x-g;var d=this.enforceMinSize(u,p,e);e.move(d.x,d.y),s.instance.returnPoint(d)}}else if(i<=o.getPosition().y){if(n=a+100/this.aspectRatio,r=h-100/this.aspectRatio*this.aspectRatio,(l=this.getSide(s.instance.borrow(n,r),o.getPosition(),s.instance.borrow(t,i)))<0){c=Math.abs(o.getPosition().y-i),g=c/this.aspectRatio,p=o.getPosition().y-c,u=o.getPosition().x+g;var d=this.enforceMinSize(u,p,e);e.move(d.x,d.y),s.instance.returnPoint(d)}else if(l>0){g=Math.abs(o.getPosition().x-t),c=g*this.aspectRatio,p=o.getPosition().y-c,u=o.getPosition().x+g;var d=this.enforceMinSize(u,p,e);e.move(d.x,d.y),s.instance.returnPoint(d)}}else if(n=a+100/this.aspectRatio,r=h+100/this.aspectRatio*this.aspectRatio,(l=this.getSide(s.instance.borrow(n,r),o.getPosition(),s.instance.borrow(t,i)))<0){g=Math.abs(o.getPosition().x-t),c=g*this.aspectRatio,p=o.getPosition().y+c,u=o.getPosition().x+g;var d=this.enforceMinSize(u,p,e);e.move(d.x,d.y),s.instance.returnPoint(d)}else if(l>0){c=Math.abs(o.getPosition().y-i),g=c/this.aspectRatio,p=o.getPosition().y+c,u=o.getPosition().x+g;var d=this.enforceMinSize(u,p,e);e.move(d.x,d.y),s.instance.returnPoint(d)}}else{var d=this.enforceMinSize(t,i,e);e.move(d.x,d.y),s.instance.returnPoint(d)}this.center.recalculatePosition(this.getBounds()),this.scope.cropAreaBounds&&this.imageSet&&(this.scope.cropAreaBounds=this.getCropBounds(),this.scope.$apply())},p.prototype.getSide=function(t,i,e){var o=this.sign((i.x-t.x)*(e.y-t.y)-(i.y-t.y)*(e.x-t.x));return s.instance.returnPoint(t),s.instance.returnPoint(e),o},p.prototype.sign=function(t){return+t===t?0===t?t:t>0?1:-1:NaN},p.prototype.handleRelease=function(t){if(null!=t){for(var i=0,e=0;e<this.currentDragTouches.length;e++)t.id==this.currentDragTouches[e].id&&(this.currentDragTouches[e].dragHandle.setDrag(!1),t.dragHandle=null,i=e);this.currentDragTouches.splice(i,1),this.draw(this.ctx)}},p.prototype.handleMove=function(t){for(var i=!1,e=0;e<this.currentDragTouches.length;e++)if(t.id==this.currentDragTouches[e].id&&null!=this.currentDragTouches[e].dragHandle){var o=this.currentDragTouches[e],n=this.clampPosition(t.x-o.dragHandle.offset.x,t.y-o.dragHandle.offset.y);t.x=n.x,t.y=n.y,s.instance.returnPoint(n),o.dragHandle instanceof a?this.dragCorner(t.x,t.y,o.dragHandle):this.dragCrop(t.x,t.y,o.dragHandle),this.currentlyInteracting=!0,i=!0,g.setPressed(this.canvas);break}if(!i){for(var r=0;r<this.markers.length;r++){var h=this.markers[r];if(h.touchInBounds(t.x,t.y)){t.dragHandle=h,this.currentDragTouches.push(t),h.setDrag(!0),t.dragHandle.offset.x=t.x-t.dragHandle.getPosition().x,t.dragHandle.offset.y=t.y-t.dragHandle.getPosition().y,this.dragCorner(t.x-t.dragHandle.offset.x,t.y-t.dragHandle.offset.y,t.dragHandle);break}}null==t.dragHandle&&this.center.touchInBounds(t.x,t.y)&&(t.dragHandle=this.center,this.currentDragTouches.push(t),t.dragHandle.setDrag(!0),t.dragHandle.offset.x=t.x-t.dragHandle.getPosition().x,t.dragHandle.offset.y=t.y-t.dragHandle.getPosition().y,this.dragCrop(t.x-t.dragHandle.offset.x,t.y-t.dragHandle.offset.y,t.dragHandle))}},p.prototype.updateClampBounds=function(){var t=this.srcImage.height/this.srcImage.width,i=this.canvas.height/this.canvas.width,e=this.canvas.width,o=this.canvas.height;i>t?(e=this.canvas.width,o=this.canvas.width*t):(o=this.canvas.height,e=this.canvas.height/t),this.minXClamp=this.canvas.width/2-e/2,this.minYClamp=this.canvas.height/2-o/2,this.maxXClamp=this.canvas.width/2+e/2,this.maxYClamp=this.canvas.height/2+o/2},p.prototype.getCropBounds=function(){var t=this.canvas.height-2*this.minYClamp,i=this.getBounds();return i.top=Math.round((t-i.top+this.minYClamp)/this.ratioH),i.bottom=Math.round((t-i.bottom+this.minYClamp)/this.ratioH),i.left=Math.round((i.left-this.minXClamp)/this.ratioW),i.right=Math.round((i.right-this.minXClamp)/this.ratioW),i},p.prototype.clampPosition=function(t,i){return t<this.minXClamp&&(t=this.minXClamp),t>this.maxXClamp&&(t=this.maxXClamp),i<this.minYClamp&&(i=this.minYClamp),i>this.maxYClamp&&(i=this.maxYClamp),s.instance.borrow(t,i)},p.prototype.isImageSet=function(){return this.imageSet},p.prototype.setImage=function(t,i){if(!t)throw"Image is null";this.imageSet=!0,this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.buffer.getContext("2d").clearRect(0,0,this.buffer.width,this.buffer.height),this.enforceFileType?this.fileType=this.enforceFileType:"image/png"!=i&&"image/jpeg"!=i||(this.fileType=i),this.srcImage=t,this.updateClampBounds();var e=this.srcImage.height/this.srcImage.width,o=this.getBounds(),n=o.getHeight()/o.getWidth(),r=this.canvas.width,a=this.canvas.height;this.canvasWidth=r,this.canvasHeight=a;var c=this.canvas.width/2,g=this.canvas.height/2,p=s.instance.borrow(c-o.getWidth()/2,g+o.getHeight()/2),u=s.instance.borrow(c+o.getWidth()/2,g+o.getHeight()/2),l=s.instance.borrow(c-o.getWidth()/2,g-o.getHeight()/2),d=s.instance.borrow(c+o.getWidth()/2,g-o.getHeight()/2);if(this.tl.setPosition(p.x,p.y),this.tr.setPosition(u.x,u.y),this.bl.setPosition(l.x,l.y),this.br.setPosition(d.x,d.y),s.instance.returnPoint(p),s.instance.returnPoint(u),s.instance.returnPoint(l),s.instance.returnPoint(d),this.center.setPosition(c,g),n>e){var m=Math.min(r*e,a),f=m/n;p=s.instance.borrow(c-f/2,g+m/2),u=s.instance.borrow(c+f/2,g+m/2),l=s.instance.borrow(c-f/2,g-m/2),d=s.instance.borrow(c+f/2,g-m/2)}else if(n<e){var v=Math.min(a/e,r),y=v*n;p=s.instance.borrow(c-v/2,g+y/2),u=s.instance.borrow(c+v/2,g+y/2),l=s.instance.borrow(c-v/2,g-y/2),d=s.instance.borrow(c+v/2,g-y/2)}else{var v=Math.min(a,r),y=v*n;p=s.instance.borrow(c-v/2,g+y/2),u=s.instance.borrow(c+v/2,g+y/2),l=s.instance.borrow(c-v/2,g-y/2),d=s.instance.borrow(c+v/2,g-y/2)}if(this.tl.setPosition(p.x,p.y),this.tr.setPosition(u.x,u.y),this.bl.setPosition(l.x,l.y),this.br.setPosition(d.x,d.y),s.instance.returnPoint(p),s.instance.returnPoint(u),s.instance.returnPoint(l),s.instance.returnPoint(d),this.scope.cropAreaBounds&&void 0!==this.scope.cropAreaBounds.left&&void 0!==this.scope.cropAreaBounds.top&&void 0!==this.scope.cropAreaBounds.right&&void 0!==this.scope.cropAreaBounds.bottom){this.canvasHeight/this.canvasWidth>e?(r=this.canvasWidth,a=this.canvasWidth*e):(a=this.canvasHeight,r=this.canvasHeight/e),this.ratioW=r/this.srcImage.width,this.ratioH=a/this.srcImage.height;var w=new h;w.top=Math.round(a+this.minYClamp-this.ratioH*this.scope.cropAreaBounds.top),w.bottom=Math.round(a+this.minYClamp-this.ratioH*this.scope.cropAreaBounds.bottom),w.left=Math.round(this.ratioW*this.scope.cropAreaBounds.left+this.minXClamp),w.right=Math.round(this.ratioW*this.scope.cropAreaBounds.right+this.minXClamp),this.tl.setPosition(w.left,w.top),this.tr.setPosition(w.right,w.top),this.bl.setPosition(w.left,w.bottom),this.br.setPosition(w.right,w.bottom),this.center.setPosition(w.left+w.getWidth()/2,w.top+w.getHeight()/2)}this.vertSquashRatio=this.detectVerticalSquash(this.srcImage),this.draw(this.ctx);var b=this.getCroppedImage(this.scope.cropWidth,this.scope.cropHeight);void 0!==this.attrs.imgDst&&(this.scope.imgDst=b.src),this.scope.cropAreaBounds&&this.imageSet&&(this.scope.cropAreaBounds=this.getCropBounds())},p.prototype.getCroppedImage=function(t,i){var e=this.getBounds();if(!this.srcImage)throw"Source image not set.";var o=this.srcImage.height/this.srcImage.width,s=this.canvas.height/this.canvas.width,n=this.canvas.width,r=this.canvas.height;if(s>o?(n=this.canvas.width,r=this.canvas.width*o):s<o?(r=this.canvas.height,n=this.canvas.height/o):(r=this.canvas.height,n=this.canvas.width),this.ratioW=n/this.srcImage.width,this.ratioH=r/this.srcImage.height,this.enforceCropAspect?t=!1:this.keepAspectRatio&&(t=Math.round(Math.max(e.getWidth(),1)/this.ratioW),i=Math.round(Math.max(e.getHeight(),1)/this.ratioH)),t&&i){this.cropCanvas.width=t,this.cropCanvas.height=i;var a=(this.buffer.height-r)/2/this.ratioH,h=(this.buffer.width-n)/2/this.ratioW;this.drawImageIOSFix(this.cropCanvas.getContext("2d"),this.srcImage,Math.max(Math.round(e.left/this.ratioW-h),0),Math.max(Math.round(e.top/this.ratioH-a),0),Math.max(Math.round(e.getWidth()/this.ratioW),1),Math.max(Math.round(e.getHeight()/this.ratioH),1),0,0,t,i),this.croppedImage.width=t,this.croppedImage.height=i}else this.cropCanvas.width=Math.max(e.getWidth(),1),this.cropCanvas.height=Math.max(e.getHeight(),1),this.cropCanvas.getContext("2d").drawImage(this.buffer,e.left,e.top,Math.max(e.getWidth(),1),Math.max(e.getHeight(),1),0,0,e.getWidth(),e.getHeight()),this.croppedImage.width=this.cropCanvas.width,this.croppedImage.height=this.cropCanvas.height;return this.croppedImage.src=this.cropCanvas.toDataURL(this.fileType),this.croppedImage},p.prototype.getBounds=function(){for(var t=Number.MAX_VALUE,i=Number.MAX_VALUE,e=-Number.MAX_VALUE,o=-Number.MAX_VALUE,s=0;s<this.markers.length;s++){var n=this.markers[s];n.getPosition().x<t&&(t=n.getPosition().x),n.getPosition().x>e&&(e=n.getPosition().x),n.getPosition().y<i&&(i=n.getPosition().y),n.getPosition().y>o&&(o=n.getPosition().y)}var r=new h;return r.left=t,r.right=e,r.top=i,r.bottom=o,r},p.prototype.setBounds=function(t){for(var i,e,o,s,n=this.getBounds(),r=0;r<this.markers.length;r++){var a=this.markers[r];a.getPosition().x==n.left?a.getPosition().y==n.top?i=a:o=a:a.getPosition().y==n.top?e=a:s=a}i.setPosition(t.left,t.top),e.setPosition(t.right,t.top),o.setPosition(t.left,t.bottom),s.setPosition(t.right,t.bottom),this.center.recalculatePosition(t),this.center.draw(this.ctx)},p.prototype.getMousePos=function(t,i){var e=t.getBoundingClientRect(),o=s.instance.borrow(i.clientX-e.left,i.clientY-e.top);if(o){var n=t.height/t.offsetHeight,r=t.width/t.offsetWidth;o.scale(r,n)}return o},p.prototype.getTouchPos=function(t,i){var e=t.getBoundingClientRect();return s.instance.borrow(i.clientX-e.left,i.clientY-e.top)},p.prototype.onTouchMove=function(i){if(!destroyed&&this.isImageSet()){i.preventDefault();var e=t.isDefined(i.touches)?i.touches:i.originalEvent.touches;if(e.length>=1)for(var o=0;o<e.length;o++){var n=e[o],r=this.getTouchPos(this.canvas,n),a=new c(r.x,r.y,n.identifier);s.instance.returnPoint(r),this.move(a,i)}this.draw(this.ctx)}},p.prototype.onMouseMove=function(t){if(this.isImageSet()){var i=this.getMousePos(this.canvas,t);this.move(new c(i.x,i.y,0),t);var e=this.getDragTouchForID(0);e?(e.x=i.x,e.y=i.y):e=new c(i.x,i.y,0),s.instance.returnPoint(i),this.drawCursors(e,t),this.draw(this.ctx)}},p.prototype.move=function(t,i){this.isMouseDown&&this.handleMove(t)},p.prototype.getDragTouchForID=function(t){for(var i=0;i<this.currentDragTouches.length;i++)if(t==this.currentDragTouches[i].id)return this.currentDragTouches[i]},p.prototype.drawCursors=function(t,i){var e=!1;null!=t&&(t.dragHandle==this.center&&(g.setStyle(this.canvas,"move"),e=!0),null!=t.dragHandle&&t.dragHandle instanceof a&&(this.drawCornerCursor(t.dragHandle,t.dragHandle.getPosition().x,t.dragHandle.getPosition().y,i),e=!0));var o=!1;if(!e){for(var s=0;s<this.markers.length;s++)o=o||this.drawCornerCursor(this.markers[s],t.x,t.y,i);o||g.setStyle(this.canvas,"auto")}o||e||!this.center.touchInBounds(t.x,t.y)?this.center.setOver(!1):(this.center.setOver(!0),g.setOver(this.canvas),g.setStyle(this.canvas,"move"))},p.prototype.drawCornerCursor=function(t,i,e,o){return t.touchInBounds(i,e)?(t.setOver(!0),t.getHorizontalNeighbour().getPosition().x>t.getPosition().x?t.getVerticalNeighbour().getPosition().y>t.getPosition().y?(g.setOver(this.canvas),g.setStyle(this.canvas,"nwse-resize")):(g.setOver(this.canvas),g.setStyle(this.canvas,"nesw-resize")):t.getVerticalNeighbour().getPosition().y>t.getPosition().y?(g.setOver(this.canvas),g.setStyle(this.canvas,"nesw-resize")):(g.setOver(this.canvas),g.setStyle(this.canvas,"nwse-resize")),!0):(t.setOver(!1),!1)},p.prototype.onTouchStart=function(t){this.isImageSet()&&(this.isMouseDown=!0)},p.prototype.onTouchEnd=function(i){if(this.isImageSet()){for(var e=t.isDefined(i.changedTouches)?i.changedTouches:i.originalEvent.changedTouches,o=0;o<e.length;o++){var s=e[o],n=this.getDragTouchForID(s.identifier);null!=n&&((n.dragHandle instanceof a||n.dragHandle instanceof r)&&n.dragHandle.setOver(!1),this.handleRelease(n))}if(this.isImageSet()&&this.currentlyInteracting){var h=this.getCroppedImage(this.scope.cropWidth,this.scope.cropHeight);void 0!==this.attrs.imgDst&&(this.scope.imgDst=h.src),this.scope.$apply()}0==this.currentDragTouches.length&&(this.isMouseDown=!1,this.currentlyInteracting=!1)}},p.prototype.drawImageIOSFix=function(t,i,e,o,s,n,r,a,h,c){t.drawImage(i,e*this.vertSquashRatio,o*this.vertSquashRatio,s*this.vertSquashRatio,n*this.vertSquashRatio,r,a,h,c)},p.prototype.detectVerticalSquash=function(t){var i=(t.naturalWidth,t.naturalHeight),e=document.createElement("canvas");e.width=1,e.height=i;var o=e.getContext("2d");o.drawImage(t,0,0);for(var s=o.getImageData(0,0,1,i).data,n=0,r=i,a=i;a>n;){0===s[4*(a-1)+3]?r=a:n=a,a=r+n>>1}var h=a/i;return 0===h?1:h},p.prototype.onMouseDown=function(t){this.isImageSet()&&(this.isMouseDown=!0)},p.prototype.onMouseUp=function(t){if(this.isImageSet()){if(g.setReleased(this.canvas),this.isMouseDown=!1,this.handleRelease(new c(0,0,0)),1==this.currentlyInteracting){var i=this.getCroppedImage(this.scope.cropWidth,this.scope.cropHeight);void 0!==this.attrs.imgDst&&(this.scope.imgDst=i.src),this.scope.$apply()}this.currentlyInteracting=!1}},p}])}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("PointPool",["Point",function(t){function i(e){this.borrowed=0,i.instance=this;for(var o=null,s=0;s<e;s++)if(0===s)this.firstAvailable=new t,o=this.firstAvailable;else{var n=new t;o.setNext(n),o=n}}return i.prototype.borrow=function(t,i){if(null==this.firstAvailable)throw"Pool exhausted";this.borrowed++;var e=this.firstAvailable;return this.firstAvailable=e.getNext(),e.x=t,e.y=i,e},i.prototype.returnPoint=function(t){this.borrowed--,t.x=0,t.y=0,t.setNext(this.firstAvailable),this.firstAvailable=t},i}])}(angular,angular.element,angular.module("angular-img-cropper")),function(t,i,e){"use strict";e.factory("Point",function(){function t(t,i){void 0===t&&(t=0),void 0===i&&(i=0),this.x=t,this.y=i}return t.prototype.setNext=function(t){this.next=t},t.prototype.getNext=function(){return this.next},t.prototype.scale=function(t,i){this.x*=t,this.y*=i},t})}(angular,angular.element,angular.module("angular-img-cropper"));
//# sourceMappingURL=angular-img-cropper.js.map
