(function(e){function n(n){for(var c,r,i=n[0],a=n[1],s=n[2],f=0,d=[];f<i.length;f++)r=i[f],o[r]&&d.push(o[r][0]),o[r]=0;for(c in a)Object.prototype.hasOwnProperty.call(a,c)&&(e[c]=a[c]);l&&l(n);while(d.length)d.shift()();return u.push.apply(u,s||[]),t()}function t(){for(var e,n=0;n<u.length;n++){for(var t=u[n],c=!0,r=1;r<t.length;r++){var i=t[r];0!==o[i]&&(c=!1)}c&&(u.splice(n--,1),e=a(a.s=t[0]))}return e}var c={},r={app:0},o={app:0},u=[];function i(e){return a.p+"js/"+({login:"login",files:"files",home:"home",images:"images",users:"users"}[e]||e)+"."+{"chunk-c716705c":"4fbe1b6e","chunk-5dc2c362":"dc7999da",login:"5e1ac6ee","chunk-7bc31ccf":"374928f6",files:"618e2abd",home:"3e31bb9b",images:"d4700ab9",users:"018eae27","chunk-878dbbe2":"a3b3feeb","chunk-c12baf44":"fd628fa9","chunk-2d0c4258":"1cc4a76a","chunk-2d22d014":"e3c5c51b","chunk-2d0b2e6f":"60f0d861","chunk-7da55a45":"dd9c8b3c","chunk-2d225433":"1b5f11a8","chunk-2d21a3aa":"bed047ec","chunk-2d230479":"3a20bd89","chunk-1b0ccba4":"abef288c","chunk-2d0ae9a9":"d45e9ad6","chunk-2d0e19f1":"09f86610","chunk-2d229636":"e296996d","chunk-2d0b8e07":"bc091346","chunk-4d5e7734":"8ed6a9c2"}[e]+".js"}function a(n){if(c[n])return c[n].exports;var t=c[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.e=function(e){var n=[],t={files:1,home:1,images:1,"chunk-7da55a45":1};r[e]?n.push(r[e]):0!==r[e]&&t[e]&&n.push(r[e]=new Promise(function(n,t){for(var c="css/"+({login:"login",files:"files",home:"home",images:"images",users:"users"}[e]||e)+"."+{"chunk-c716705c":"31d6cfe0","chunk-5dc2c362":"31d6cfe0",login:"31d6cfe0","chunk-7bc31ccf":"31d6cfe0",files:"9b2e1815",home:"4b5ad583",images:"a804985e",users:"31d6cfe0","chunk-878dbbe2":"31d6cfe0","chunk-c12baf44":"31d6cfe0","chunk-2d0c4258":"31d6cfe0","chunk-2d22d014":"31d6cfe0","chunk-2d0b2e6f":"31d6cfe0","chunk-7da55a45":"ebd6ed11","chunk-2d225433":"31d6cfe0","chunk-2d21a3aa":"31d6cfe0","chunk-2d230479":"31d6cfe0","chunk-1b0ccba4":"31d6cfe0","chunk-2d0ae9a9":"31d6cfe0","chunk-2d0e19f1":"31d6cfe0","chunk-2d229636":"31d6cfe0","chunk-2d0b8e07":"31d6cfe0","chunk-4d5e7734":"31d6cfe0"}[e]+".css",o=a.p+c,u=document.getElementsByTagName("link"),i=0;i<u.length;i++){var s=u[i],f=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(f===c||f===o))return n()}var d=document.getElementsByTagName("style");for(i=0;i<d.length;i++){s=d[i],f=s.getAttribute("data-href");if(f===c||f===o)return n()}var l=document.createElement("link");l.rel="stylesheet",l.type="text/css",l.onload=n,l.onerror=function(n){var c=n&&n.target&&n.target.src||o,u=new Error("Loading CSS chunk "+e+" failed.\n("+c+")");u.code="CSS_CHUNK_LOAD_FAILED",u.request=c,delete r[e],l.parentNode.removeChild(l),t(u)},l.href=o;var h=document.getElementsByTagName("head")[0];h.appendChild(l)}).then(function(){r[e]=0}));var c=o[e];if(0!==c)if(c)n.push(c[2]);else{var u=new Promise(function(n,t){c=o[e]=[n,t]});n.push(c[2]=u);var s,f=document.createElement("script");f.charset="utf-8",f.timeout=120,a.nc&&f.setAttribute("nonce",a.nc),f.src=i(e),s=function(n){f.onerror=f.onload=null,clearTimeout(d);var t=o[e];if(0!==t){if(t){var c=n&&("load"===n.type?"missing":n.type),r=n&&n.target&&n.target.src,u=new Error("Loading chunk "+e+" failed.\n("+c+": "+r+")");u.type=c,u.request=r,t[1](u)}o[e]=void 0}};var d=setTimeout(function(){s({type:"timeout",target:f})},12e4);f.onerror=f.onload=s,document.head.appendChild(f)}return Promise.all(n)},a.m=e,a.c=c,a.d=function(e,n,t){a.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,n){if(1&n&&(e=a(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var c in e)a.d(t,c,function(n){return e[n]}.bind(null,c));return t},a.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(n,"a",n),n},a.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},a.p="/",a.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],f=s.push.bind(s);s.push=n,s=s.slice();for(var d=0;d<s.length;d++)n(s[d]);var l=f;u.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"034f":function(e,n,t){"use strict";var c=t("64a9"),r=t.n(c);r.a},1:function(e,n){},"56d7":function(e,n,t){"use strict";t.r(n);t("cadf"),t("551c"),t("f751"),t("097d");var c=t("2b0e"),r=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},o=[],u=(t("034f"),t("2877")),i={},a=Object(u["a"])(i,r,o,!1,null,null,null),s=a.exports,f=(t("7f7f"),t("8c4f")),d=t("c0d6");c["default"].use(f["a"]);var l=new f["a"]({routes:[{path:"/",name:"home",component:function(){return Promise.all([t.e("chunk-c716705c"),t.e("chunk-7bc31ccf"),t.e("home")]).then(t.bind(null,"bb51"))},meta:{requireAuth:!0},children:[{path:"users",name:"users",component:function(){return t.e("users").then(t.bind(null,"0996"))},meta:{requireAuth:!0}},{path:"converter",name:"converter",component:function(){return Promise.all([t.e("chunk-c716705c"),t.e("chunk-7bc31ccf"),t.e("images")]).then(t.bind(null,"ab31"))},meta:{requireAuth:!0}},{path:"files",name:"files",component:function(){return Promise.all([t.e("chunk-c716705c"),t.e("chunk-7bc31ccf"),t.e("files")]).then(t.bind(null,"054f"))},meta:{requireAuth:!0}}]},{path:"/login",name:"login",component:function(){return Promise.all([t.e("chunk-c716705c"),t.e("chunk-5dc2c362"),t.e("login")]).then(t.bind(null,"a55b"))}}]});l.beforeEach(function(e,n,t){if("home"===e.name?d["a"].commit("SET_IS_HOME_PAGE",!0):d["a"].commit("SET_IS_HOME_PAGE",!1),e.matched.some(function(e){return e.meta.requireAuth})){if(void 0!=localStorage.id)return void t();t("/login")}else t()});var h=l,m=t("ce5b"),b=t.n(m),p=t("f87c"),S=t("8055"),_=t.n(S);t("bf40");c["default"].use(b.a),c["default"].use(p["a"],_()("http://localhost:3000")),c["default"].config.productionTip=!1,new c["default"]({router:h,store:d["a"],render:function(e){return e(s)}}).$mount("#app")},"64a9":function(e,n,t){},c0d6:function(e,n,t){"use strict";t("6762"),t("2fdb");var c=t("2b0e"),r=t("2f62");c["default"].use(r["a"]);var o=function(){var e=window.localStorage.getItem("surfaceHeight"),n=window.localStorage.getItem("surfaceWidth"),t=null==e||null==n||0==e||0==n;return t};n["a"]=new r["a"].Store({state:{first_name:"system",last_name:"user",id:0,email:"system.user@email.com",token:"",refresh_token:"",isConnected:!1,doShowSurfaceDimensionsAlert:o(),isTransmissionProcessActive:!1,currentActivePort:void 0,currentFileName:void 0,isHomePage:!1,adminsCount:0,workersCount:0,conversionsCount:0,activePortsCount:0,sbContent:"",sbColor:"",sbVisibility:!1},getters:{isGcodeFile:function(e){return void 0!=e.currentFileName&&e.currentFileName.includes("gcode")},isLogFile:function(e){return void 0!=e.currentFileName&&e.currentFileName.includes("log")},getToken:function(e){return e.token},getRefreshToken:function(e){return e.refresh_token}},mutations:{TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE:function(e){e.doShowSurfaceDimensionsAlert=!e.doShowSurfaceDimensionsAlert},TOGGLE_TRANSMISSION_PROCESS_STATE:function(e){e.isTransmissionProcessActive=!e.isTransmissionProcessActive},SET_TRANSMISSION_PROCESS_STATE:function(e,n){e.isTransmissionProcessActive=n},SET_CURRENT_ACTIVE_PORT:function(e,n){e.currentActivePort=n},SHOW_SNACKBAR:function(e,n){e.sbColor=n.color,e.sbContent=n.content},TOGGLE_SB_VISIBILITY:function(e,n){e.sbVisibility=n},SET_CURRENT_FILE_NAME:function(e,n){e.currentFileName=n},SET_IS_HOME_PAGE:function(e,n){e.isHomePage=n},SET_ADMINS_COUNT:function(e,n){e.adminsCount=n},SET_WORKERS_COUNT:function(e,n){e.workersCount=n},SET_CONVERSIONS_COUNT:function(e,n){e.conversionsCount=n},SET_ACTIVE_PORTS_COUNT:function(e,n){e.activePortsCount=n},SET_FIRST_NAME:function(e,n){e.first_name=n},SET_LAST_NAME:function(e,n){e.last_name=n},SET_EMAIL:function(e,n){e.email=n},SET_ID:function(e,n){e.id=n},SET_TOKEN:function(e,n){e.token=n},SET_REFRESH_TOKEN:function(e,n){e.refresh_token=n},TOGGLE_IS_CONNECTED_STATE:function(e){e.isConnected=!e.isConnected}},actions:{}})}});
//# sourceMappingURL=app.d58daac4.js.map