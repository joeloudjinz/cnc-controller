(function(e){function n(n){for(var r,o,u=n[0],a=n[1],s=n[2],l=0,f=[];l<u.length;l++)o=u[l],c[o]&&f.push(c[o][0]),c[o]=0;for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r]);d&&d(n);while(f.length)f.shift()();return i.push.apply(i,s||[]),t()}function t(){for(var e,n=0;n<i.length;n++){for(var t=i[n],r=!0,o=1;o<t.length;o++){var u=t[o];0!==c[u]&&(r=!1)}r&&(i.splice(n--,1),e=a(a.s=t[0]))}return e}var r={},o={app:0},c={app:0},i=[];function u(e){return a.p+"js/"+({login:"login",files:"files",home:"home",images:"images",users:"users"}[e]||e)+"."+{"chunk-6430c0b6":"dca11f4b","chunk-5dc2c362":"9a744204",login:"bfd1c3be","chunk-7bc31ccf":"d16c741d",files:"bc3a0aa1",home:"8456e450",images:"1f59d1b3",users:"17dd5994","chunk-878dbbe2":"46dee261","chunk-c12baf44":"66279b5f","chunk-2d0c4258":"8fa90ab9","chunk-2d22d014":"77f90a6c","chunk-2d0b2e6f":"cc982317","chunk-7da55a45":"2365068f","chunk-2d0ae9a9":"187dbdf1","chunk-2d225433":"3c261510","chunk-2d21a3aa":"cda0c47f","chunk-2d230479":"45184630","chunk-1b0ccba4":"4ff12679","chunk-2d0e19f1":"91a9b72f","chunk-2d229636":"01ed0269","chunk-2d0b8e07":"c26106ab","chunk-4d5e7734":"2d442314"}[e]+".js"}function a(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.e=function(e){var n=[],t={files:1,home:1,images:1,"chunk-7da55a45":1};o[e]?n.push(o[e]):0!==o[e]&&t[e]&&n.push(o[e]=new Promise(function(n,t){for(var r="css/"+({login:"login",files:"files",home:"home",images:"images",users:"users"}[e]||e)+"."+{"chunk-6430c0b6":"31d6cfe0","chunk-5dc2c362":"31d6cfe0",login:"31d6cfe0","chunk-7bc31ccf":"31d6cfe0",files:"9b2e1815",home:"4b5ad583",images:"a804985e",users:"31d6cfe0","chunk-878dbbe2":"31d6cfe0","chunk-c12baf44":"31d6cfe0","chunk-2d0c4258":"31d6cfe0","chunk-2d22d014":"31d6cfe0","chunk-2d0b2e6f":"31d6cfe0","chunk-7da55a45":"ebd6ed11","chunk-2d0ae9a9":"31d6cfe0","chunk-2d225433":"31d6cfe0","chunk-2d21a3aa":"31d6cfe0","chunk-2d230479":"31d6cfe0","chunk-1b0ccba4":"31d6cfe0","chunk-2d0e19f1":"31d6cfe0","chunk-2d229636":"31d6cfe0","chunk-2d0b8e07":"31d6cfe0","chunk-4d5e7734":"31d6cfe0"}[e]+".css",c=a.p+r,i=document.getElementsByTagName("link"),u=0;u<i.length;u++){var s=i[u],l=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(l===r||l===c))return n()}var f=document.getElementsByTagName("style");for(u=0;u<f.length;u++){s=f[u],l=s.getAttribute("data-href");if(l===r||l===c)return n()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=n,d.onerror=function(n){var r=n&&n.target&&n.target.src||c,i=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=r,delete o[e],d.parentNode.removeChild(d),t(i)},d.href=c;var h=document.getElementsByTagName("head")[0];h.appendChild(d)}).then(function(){o[e]=0}));var r=c[e];if(0!==r)if(r)n.push(r[2]);else{var i=new Promise(function(n,t){r=c[e]=[n,t]});n.push(r[2]=i);var s,l=document.createElement("script");l.charset="utf-8",l.timeout=120,a.nc&&l.setAttribute("nonce",a.nc),l.src=u(e),s=function(n){l.onerror=l.onload=null,clearTimeout(f);var t=c[e];if(0!==t){if(t){var r=n&&("load"===n.type?"missing":n.type),o=n&&n.target&&n.target.src,i=new Error("Loading chunk "+e+" failed.\n("+r+": "+o+")");i.type=r,i.request=o,t[1](i)}c[e]=void 0}};var f=setTimeout(function(){s({type:"timeout",target:l})},12e4);l.onerror=l.onload=s,document.head.appendChild(l)}return Promise.all(n)},a.m=e,a.c=r,a.d=function(e,n,t){a.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,n){if(1&n&&(e=a(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)a.d(t,r,function(n){return e[n]}.bind(null,r));return t},a.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(n,"a",n),n},a.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},a.p="/",a.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=n,s=s.slice();for(var f=0;f<s.length;f++)n(s[f]);var d=l;i.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"034f":function(e,n,t){"use strict";var r=t("64a9"),o=t.n(r);o.a},1:function(e,n){},"41cb":function(e,n,t){"use strict";t("7f7f");var r=t("2b0e"),o=t("8c4f"),c=t("c0d6");r["default"].use(o["a"]);var i=new o["a"]({routes:[{path:"/",name:"home",component:function(){return Promise.all([t.e("chunk-6430c0b6"),t.e("chunk-7bc31ccf"),t.e("home")]).then(t.bind(null,"bb51"))},meta:{requireAuth:!0},children:[{path:"users",name:"users",component:function(){return t.e("users").then(t.bind(null,"0996"))},meta:{requireAuth:!0}},{path:"converter",name:"converter",component:function(){return Promise.all([t.e("chunk-6430c0b6"),t.e("chunk-7bc31ccf"),t.e("images")]).then(t.bind(null,"fd14"))},meta:{requireAuth:!0}},{path:"files",name:"files",component:function(){return Promise.all([t.e("chunk-6430c0b6"),t.e("chunk-7bc31ccf"),t.e("files")]).then(t.bind(null,"054f"))},meta:{requireAuth:!0}}]},{path:"/login",name:"login",component:function(){return Promise.all([t.e("chunk-6430c0b6"),t.e("chunk-5dc2c362"),t.e("login")]).then(t.bind(null,"a55b"))}}]});i.beforeEach(function(e,n,t){if("home"===e.name?c["a"].commit("SET_IS_HOME_PAGE",!0):c["a"].commit("SET_IS_HOME_PAGE",!1),e.matched.some(function(e){return e.meta.requireAuth}))return void 0!=localStorage.id||""!=localStorage.id?""===localStorage.token||""===localStorage.refresh_token?(c["a"].commit("SHOW_LOGIN_ALERT_VALUE","Session has expired, login again please"),void t("/login")):"login"===e.name?void t("/"):void t():void t("/login");t()}),n["a"]=i},"56d7":function(e,n,t){"use strict";t.r(n);t("a481"),t("cadf"),t("551c"),t("f751"),t("097d");var r=t("2b0e"),o=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},c=[],i={name:"app"},u=i,a=(t("034f"),t("2877")),s=Object(a["a"])(u,o,c,!1,null,null,null),l=s.exports,f=t("41cb"),d=t("c0d6"),h=t("ce5b"),m=t.n(h),g=t("f87c"),p=t("8055"),b=t.n(p),v=t("bc3a"),S=t.n(v);t("bf40");r["default"].use(m.a),r["default"].use(g["a"],b()("http://localhost:3000")),r["default"].config.productionTip=!1;var _=function(e){//! here you must use this expression so the call of the api treat the response as an error in the catch block
return 401!==e.response.status&&400!==e.response.status||(window.localStorage.removeItem("id"),window.localStorage.removeItem("first_name"),window.localStorage.removeItem("last_name"),window.localStorage.removeItem("email"),window.localStorage.removeItem("token"),window.localStorage.removeItem("refresh_token"),d["a"].commit("SHOW_LOGIN_ALERT_VALUE","Session has expired, login again please"),f["a"].replace("/login")),Promise.reject(e)},k=function(e){return e.headers.Authorization="Bearer "+localStorage.token,e};S.a.interceptors.request.use(function(e){return k(e)},function(e){return Promise.reject(e)}),S.a.interceptors.response.use(function(e){return e},function(e){return _(e)}),new r["default"]({router:f["a"],store:d["a"],render:function(e){return e(l)}}).$mount("#app")},"64a9":function(e,n,t){},c0d6:function(e,n,t){"use strict";t("6762"),t("2fdb");var r=t("2b0e"),o=t("2f62");r["default"].use(o["a"]);var c=function(){var e=window.localStorage.getItem("surfaceHeight"),n=window.localStorage.getItem("surfaceWidth"),t=null==e||null==n||0==e||0==n;return t};n["a"]=new o["a"].Store({state:{doShowSurfaceDimensionsAlert:c(),isTransmissionProcessActive:!1,currentActivePort:void 0,currentFileName:void 0,isHomePage:!1,isAdmin:void 0,adminsCount:0,workersCount:0,conversionsCount:0,activePortsCount:0,loginAlertContent:"",loginAlertValue:!1,isConversionActive:!1},getters:{isGcodeFile:function(e){return void 0!=e.currentFileName&&e.currentFileName.includes("gcode")},isLogFile:function(e){return void 0!=e.currentFileName&&e.currentFileName.includes("log")},getToken:function(e){return e.token},getRefreshToken:function(e){return e.refresh_token}},mutations:{TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE:function(e){e.doShowSurfaceDimensionsAlert=!e.doShowSurfaceDimensionsAlert},TOGGLE_TRANSMISSION_PROCESS_STATE:function(e){e.isTransmissionProcessActive=!e.isTransmissionProcessActive},SET_TRANSMISSION_PROCESS_STATE:function(e,n){e.isTransmissionProcessActive=n},SET_CURRENT_ACTIVE_PORT:function(e,n){e.currentActivePort=n},SET_CURRENT_FILE_NAME:function(e,n){e.currentFileName=n},SET_IS_HOME_PAGE:function(e,n){e.isHomePage=n},SET_ADMINS_COUNT:function(e,n){e.adminsCount=n},SET_WORKERS_COUNT:function(e,n){e.workersCount=n},SET_CONVERSIONS_COUNT:function(e,n){e.conversionsCount=n},SET_ACTIVE_PORTS_COUNT:function(e,n){e.activePortsCount=n},SHOW_LOGIN_ALERT_VALUE:function(e,n){e.loginAlertContent=n,e.loginAlertValue=!0},HIDE_LOGIN_ALERT_VALUE:function(e){e.loginAlertValue=!1,e.loginAlertContent=""},SET_IS_CONVERSION_ACTIVE:function(e,n){e.isConversionActive=n},SET_IS_ADMIN_VALUE:function(e,n){e.isAdmin=n}},actions:{}})}});
//# sourceMappingURL=app.ce8e5bf2.js.map