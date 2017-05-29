!function(o){"use strict";var n={CHROME:"chrome",FIREFOX:"firefox",SAFARI:"safari",OPERA:"opera",IE:"ie",MS_EDGE:"ms-edge",FB_MESSENGER:"fb-messenger",CORDOVA:"cordova",UNKNOWN:"unknown"},e={ANDROID:"android",I_PAD:"ipad",IPHONE:"iphone",I_POD:"ipod",BLACKBERRY:"blackberry",FIREFOX_OS:"firefox-os",CHROME_BOOK:"chrome-book",WINDOWS_PHONE:"windows-phone",PS4:"ps4",VITA:"vita",CHROMECAST:"chromecast",APPLE_TV:"apple-tv",GOOGLE_TV:"google-tv",UNKNOWN:"unknown"},O={WINDOWS:"windows",MAC:"mac",IOS:"ios",ANDROID:"android",LINUX:"linux",UNIX:"unix",FIREFOX_OS:"firefox-os",CHROME_OS:"chrome-os",WINDOWS_PHONE:"windows-phone",UNKNOWN:"unknown"},r={WINDOWS_3_11:"windows-3-11",WINDOWS_95:"windows-95",WINDOWS_ME:"windows-me",WINDOWS_98:"windows-98",WINDOWS_CE:"windows-ce",WINDOWS_2000:"windows-2000",WINDOWS_XP:"windows-xp",WINDOWS_SERVER_2003:"windows-server-2003",WINDOWS_VISTA:"windows-vista",WINDOWS_7:"windows-7",WINDOWS_8_1:"windows-8-1",WINDOWS_8:"windows-8",WINDOWS_10:"windows-10",WINDOWS_PHONE_7_5:"windows-phone-7-5",WINDOWS_PHONE_8_1:"windows-phone-8-1",WINDOWS_PHONE_10:"windows-phone-10",WINDOWS_NT_4_0:"windows-nt-4-0",MACOSX_15:"mac-os-x-15",MACOSX_14:"mac-os-x-14",MACOSX_13:"mac-os-x-13",MACOSX_12:"mac-os-x-12",MACOSX_11:"mac-os-x-11",MACOSX_10:"mac-os-x-10",MACOSX_9:"mac-os-x-9",MACOSX_8:"mac-os-x-8",MACOSX_7:"mac-os-x-7",MACOSX_6:"mac-os-x-6",MACOSX_5:"mac-os-x-5",MACOSX_4:"mac-os-x-4",MACOSX_3:"mac-os-x-3",MACOSX_2:"mac-os-x-2",MACOSX:"mac-os-x",UNKNOWN:"unknown"},i={WINDOWS:{and:[{or:[/\bWindows|(Win\d\d)\b/,/\bWin 9x\b/]},{not:/\bWindows Phone\b/}]},MAC:{and:[/\bMac OS\b/,{not:/Windows Phone/}]},IOS:{and:[{or:[/\biPad\b/,/\biPhone\b/,/\biPod\b/]},{not:/Windows Phone/}]},ANDROID:{and:[/\bAndroid\b/,{not:/Windows Phone/}]},LINUX:/\bLinux\b/,UNIX:/\bUNIX\b/,FIREFOX_OS:{and:[/\bFirefox\b/,/Mobile\b/]},CHROME_OS:/\bCrOS\b/,WINDOWS_PHONE:{or:[/\bIEMobile\b/,/\bWindows Phone\b/]},PS4:/\bMozilla\/5.0 \(PlayStation 4\b/,VITA:/\bMozilla\/5.0 \(Play(S|s)tation Vita\b/},S={CHROME:{and:[{or:[/\bChrome\b/,/\bCriOS\b/]},{not:{or:[/\bOPR\b/,/\bEdge\b/,/\bCordova\b/]}}]},FIREFOX:{and:[{or:[/\bFirefox\b/,/\bFxiOS\b/]},{not:/\bCordova\b/}]},SAFARI:{and:[/^((?!CriOS).)*\Safari\b.*$/,{not:{or:[/\bOPR\b/,/\bEdge\b/,/Windows Phone/,/\bCordova\b/,/\bChrome\b/]}}]},OPERA:{or:[/Opera\b/,/\bOPR\b/]},IE:{or:[/\bMSIE\b/,/\bTrident\b/,/^Mozilla\/5\.0 \(Windows NT 10\.0; Win64; x64\)$/]},MS_EDGE:{or:[/\bEdge\b/]},PS4:/\bMozilla\/5.0 \(PlayStation 4\b/,VITA:/\bMozilla\/5.0 \(Play(S|s)tation Vita\b/,CORDOVA:/\bCordova\b/,FB_MESSENGER:/\bFBAN\/MessengerForiOS\b/},t={ANDROID:{and:[/\bAndroid\b/,{not:/Windows Phone/}]},I_PAD:/\biPad\b/,IPHONE:{and:[/\biPhone\b/,{not:/Windows Phone/}]},I_POD:/\biPod\b/,BLACKBERRY:/\bblackberry\b/,FIREFOX_OS:{and:[/\bFirefox\b/,/\bMobile\b/]},CHROME_BOOK:/\bCrOS\b/,WINDOWS_PHONE:{or:[/\bIEMobile\b/,/\bWindows Phone\b/]},PS4:/\bMozilla\/5.0 \(PlayStation 4\b/,CHROMECAST:/\bCrKey\b/,APPLE_TV:/^iTunes-AppleTV\/4.1$/,GOOGLE_TV:/\bGoogleTV\b/,VITA:/\bMozilla\/5.0 \(Play(S|s)tation Vita\b/},s={WINDOWS_3_11:/Win16/,WINDOWS_95:/(Windows 95|Win95|Windows_95)/,WINDOWS_ME:/(Win 9x 4.90|Windows ME)/,WINDOWS_98:/(Windows 98|Win98)/,WINDOWS_CE:/Windows CE/,WINDOWS_2000:/(Windows NT 5.0|Windows 2000)/,WINDOWS_XP:/(Windows NT 5.1|Windows XP)/,WINDOWS_SERVER_2003:/Windows NT 5.2/,WINDOWS_VISTA:/Windows NT 6.0/,WINDOWS_7:/(Windows 7|Windows NT 6.1)/,WINDOWS_8_1:/(Windows 8.1|Windows NT 6.3)/,WINDOWS_8:/(Windows 8|Windows NT 6.2)/,WINDOWS_10:/(Windows NT 10.0)/,WINDOWS_PHONE_7_5:/(Windows Phone OS 7.5)/,WINDOWS_PHONE_8_1:/(Windows Phone 8.1)/,WINDOWS_PHONE_10:/(Windows Phone 10)/,WINDOWS_NT_4_0:{and:[/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,{not:/Windows NT 10.0/}]},MACOSX:/(MAC OS X\s*[^ 0-9])/,MACOSX_3:/(Darwin 10.3|Mac OS X 10.3)/,MACOSX_4:/(Darwin 10.4|Mac OS X 10.4)/,MACOSX_5:/(Mac OS X 10.5)/,MACOSX_6:/(Mac OS X 10.6)/,MACOSX_7:/(Mac OS X 10.7)/,MACOSX_8:/(Mac OS X 10.8)/,MACOSX_9:/(Mac OS X 10.9)/,MACOSX_10:/(Mac OS X 10.10)/,MACOSX_11:/(Mac OS X 10.11)/,MACOSX_12:/(Mac OS X 10.12)/,MACOSX_13:/(Mac OS X 10.13)/,MACOSX_14:/(Mac OS X 10.14)/,MACOSX_15:/(Mac OS X 10.15)/},_={CHROME:[/\bChrome\/([\d\.]+)\b/,/\bCriOS\/([\d\.]+)\b/],FIREFOX:[/\bFirefox\/([\d\.]+)\b/,/\bFxiOS\/([\d\.]+)\b/],SAFARI:/\bVersion\/([\d\.]+)\b/,OPERA:[/\bVersion\/([\d\.]+)\b/,/\bOPR\/([\d\.]+)\b/],IE:[/\bMSIE ([\d\.]+\w?)\b/,/\brv:([\d\.]+\w?)\b/],CORDOVA:/\bCordova\/([\d\.]+)\b/,MS_EDGE:/\bEdge\/([\d\.]+)\b/},W=Object.keys(_).reduce(function(o,e){return o[n[e]]=_[e],o},{});o.module("ng.deviceDetector",["reTree"]).constant("OS_RE",i).constant("BROWSERS_RE",S).constant("DEVICES_RE",t).constant("OS_VERSIONS_RE",s).constant("BROWSER_VERSIONS_RE_MAP",_).constant("BROWSER_VERSIONS_RE",W).constant("BROWSERS",n).constant("DEVICES",e).constant("OS",O).constant("OS_VERSIONS",r).service("detectUtils",["deviceDetector","DEVICES","BROWSERS","OS",function(o,n,e,O){var r=o;this.isMobile=function(){return"unknown"!==r.device},this.isAndroid=function(){return r.device===n.ANDROID||r.OS===O.ANDROID},this.isIOS=function(){return r.os===O.IOS||r.device===n.I_POD||r.device===n.IPHONE}}]).provider("deviceDetector",function(){var o=[];this.addCustom=function(n,e){o.push({name:n,re:e})},this.$get=["$window","DEVICES","BROWSERS","OS","OS_VERSIONS","reTree","OS_RE","BROWSERS_RE","DEVICES_RE","OS_VERSIONS_RE","BROWSER_VERSIONS_RE_MAP","BROWSER_VERSIONS_RE",function(n,e,O,r,i,S,t,s,_,W,N,b){Object.keys||(Object.keys=function(){var o=Object.prototype.hasOwnProperty,n=!{toString:null}.propertyIsEnumerable("toString"),e=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],O=e.length;return function(r){if("object"!=typeof r&&("function"!=typeof r||null===r))throw new TypeError("Object.keys called on non-object");var i,S,t=[];for(i in r)o.call(r,i)&&t.push(i);if(n)for(S=0;S<O;S++)o.call(r,e[S])&&t.push(e[S]);return t}}()),Array.prototype.reduce||(Array.prototype.reduce=function(o){if(null==this)throw new TypeError("Array.prototype.reduce called on null or undefined");if("function"!=typeof o)throw new TypeError(o+" is not a function");var n,e=Object(this),O=e.length>>>0,r=0;if(2==arguments.length)n=arguments[1];else{for(;r<O&&!(r in e);)r++;if(r>=O)throw new TypeError("Reduce of empty array with no initial value");n=e[r++]}for(;r<O;r++)r in e&&(n=o(n,e[r],r,e));return n});var a=n.navigator.userAgent,d={raw:{userAgent:a,os:{},browser:{},device:{}}};if(d.raw.os=Object.keys(r).reduce(function(o,n){return o[r[n]]=S.test(a,t[n]),o},{}),d.raw.browser=Object.keys(O).reduce(function(o,n){return o[O[n]]=S.test(a,s[n]),o},{}),d.raw.device=Object.keys(e).reduce(function(o,n){return o[e[n]]=S.test(a,_[n]),o},{}),d.raw.os_version=Object.keys(i).reduce(function(o,n){return o[i[n]]=S.test(a,W[n]),o},{}),d.os=[r.WINDOWS,r.IOS,r.MAC,r.ANDROID,r.LINUX,r.UNIX,r.FIREFOX_OS,r.CHROME_OS,r.WINDOWS_PHONE].reduce(function(o,n){return o===r.UNKNOWN&&d.raw.os[n]?n:o},r.UNKNOWN),d.browser=[O.CHROME,O.FIREFOX,O.SAFARI,O.OPERA,O.IE,O.MS_EDGE,O.CORDOVA,O.FB_MESSENGER].reduce(function(o,n){return o===O.UNKNOWN&&d.raw.browser[n]?n:o},O.UNKNOWN),d.device=[e.ANDROID,e.I_PAD,e.IPHONE,e.I_POD,e.BLACKBERRY,e.FIREFOX_OS,e.CHROME_BOOK,e.WINDOWS_PHONE,e.PS4,e.CHROMECAST,e.APPLE_TV,e.GOOGLE_TV,e.VITA].reduce(function(o,n){return o===e.UNKNOWN&&d.raw.device[n]?n:o},e.UNKNOWN),d.os_version=[i.WINDOWS_3_11,i.WINDOWS_95,i.WINDOWS_ME,i.WINDOWS_98,i.WINDOWS_CE,i.WINDOWS_2000,i.WINDOWS_XP,i.WINDOWS_SERVER_2003,i.WINDOWS_VISTA,i.WINDOWS_7,i.WINDOWS_8_1,i.WINDOWS_8,i.WINDOWS_10,i.WINDOWS_PHONE_7_5,i.WINDOWS_PHONE_8_1,i.WINDOWS_PHONE_10,i.WINDOWS_NT_4_0,i.MACOSX,i.MACOSX_3,i.MACOSX_4,i.MACOSX_5,i.MACOSX_6,i.MACOSX_7,i.MACOSX_8,i.MACOSX_9,i.MACOSX_10,i.MACOSX_11,i.MACOSX_12,i.MACOSX_13,i.MACOSX_14,i.MACOSX_15].reduce(function(o,n){return o===i.UNKNOWN&&d.raw.os_version[n]?n:o},i.UNKNOWN),d.browser_version="0",d.browser!==O.UNKNOWN){var c=b[d.browser],E=S.exec(a,c);E&&(d.browser_version=E[1])}return d.isMobile=function(){return[e.ANDROID,e.I_PAD,e.IPHONE,e.I_POD,e.BLACKBERRY,e.FIREFOX_OS,e.WINDOWS_PHONE,e.VITA].some(function(o){return d.device==o})},d.isTablet=function(){return[e.I_PAD,e.FIREFOX_OS].some(function(o){return d.device==o})},d.isDesktop=function(){return[e.PS4,e.CHROME_BOOK,e.UNKNOWN].some(function(o){return d.device==o})},d.custom=o.reduce(function(o,n){return o[n.name]=S.test(a,n.re),o},{}),d}]}).directive("deviceDetector",["deviceDetector",function(o){function n(o){return"is-"+o.toLowerCase().replace(/[^0-9a-z]+/g,"-")}return{restrict:"A",link:function(e,O){O.addClass("os-"+o.os),O.addClass("browser-"+o.browser),O.addClass("device-"+o.device),O.toggleClass("is-mobile",o.isMobile()),O.toggleClass("is-tablet",o.isTablet()),O.toggleClass("is-desktop",o.isDesktop()),Object.keys(o.custom).forEach(function(e){O.toggleClass(n(e),o.custom[e])})}}}])}(angular);
//# sourceMappingURL=ng-device-detector.js.map