(function(e){function n(n){for(var r,o,c=n[0],s=n[1],i=n[2],d=0,l=[];d<c.length;d++)o=c[d],a[o]&&l.push(a[o][0]),a[o]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);f&&f(n);while(l.length)l.shift()();return u.push.apply(u,i||[]),t()}function t(){for(var e,n=0;n<u.length;n++){for(var t=u[n],r=!0,o=1;o<t.length;o++){var c=t[o];0!==a[c]&&(r=!1)}r&&(u.splice(n--,1),e=s(s.s=t[0]))}return e}var r={},o={app:0},a={app:0},u=[];function c(e){return s.p+"js/"+({agents:"agents",about:"about","images~resources":"images~resources",resources:"resources",dashboard:"dashboard",images:"images"}[e]||e)+"."+{agents:"6e40ff10","chunk-31d23718":"61b9f2b9","chunk-5dc2c362":"dc7999da",about:"3ec3134d","images~resources":"2a72aed1",resources:"41b7df54",dashboard:"9654627e",images:"7be4fe6d","chunk-2d0d7c42":"6e26f506","chunk-2d0ceef5":"4e326a32","chunk-2d0e19f1":"1afb3cc7","chunk-2d229636":"a8521b82"}[e]+".js"}function s(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,s),t.l=!0,t.exports}s.e=function(e){var n=[],t={about:1,resources:1,dashboard:1,images:1};o[e]?n.push(o[e]):0!==o[e]&&t[e]&&n.push(o[e]=new Promise(function(n,t){for(var r="css/"+({agents:"agents",about:"about","images~resources":"images~resources",resources:"resources",dashboard:"dashboard",images:"images"}[e]||e)+"."+{agents:"31d6cfe0","chunk-31d23718":"31d6cfe0","chunk-5dc2c362":"31d6cfe0",about:"4b5ad583","images~resources":"31d6cfe0",resources:"9b2e1815",dashboard:"ebd6ed11",images:"a804985e","chunk-2d0d7c42":"31d6cfe0","chunk-2d0ceef5":"31d6cfe0","chunk-2d0e19f1":"31d6cfe0","chunk-2d229636":"31d6cfe0"}[e]+".css",a=s.p+r,u=document.getElementsByTagName("link"),c=0;c<u.length;c++){var i=u[c],d=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(d===r||d===a))return n()}var l=document.getElementsByTagName("style");for(c=0;c<l.length;c++){i=l[c],d=i.getAttribute("data-href");if(d===r||d===a)return n()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=n,f.onerror=function(n){var r=n&&n.target&&n.target.src||a,u=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");u.code="CSS_CHUNK_LOAD_FAILED",u.request=r,delete o[e],f.parentNode.removeChild(f),t(u)},f.href=a;var h=document.getElementsByTagName("head")[0];h.appendChild(f)}).then(function(){o[e]=0}));var r=a[e];if(0!==r)if(r)n.push(r[2]);else{var u=new Promise(function(n,t){r=a[e]=[n,t]});n.push(r[2]=u);var i,d=document.createElement("script");d.charset="utf-8",d.timeout=120,s.nc&&d.setAttribute("nonce",s.nc),d.src=c(e),i=function(n){d.onerror=d.onload=null,clearTimeout(l);var t=a[e];if(0!==t){if(t){var r=n&&("load"===n.type?"missing":n.type),o=n&&n.target&&n.target.src,u=new Error("Loading chunk "+e+" failed.\n("+r+": "+o+")");u.type=r,u.request=o,t[1](u)}a[e]=void 0}};var l=setTimeout(function(){i({type:"timeout",target:d})},12e4);d.onerror=d.onload=i,document.head.appendChild(d)}return Promise.all(n)},s.m=e,s.c=r,s.d=function(e,n,t){s.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,n){if(1&n&&(e=s(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(s.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)s.d(t,r,function(n){return e[n]}.bind(null,r));return t},s.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(n,"a",n),n},s.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},s.p="/",s.oe=function(e){throw console.error(e),e};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],d=i.push.bind(i);i.push=n,i=i.slice();for(var l=0;l<i.length;l++)n(i[l]);var f=d;u.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"034f":function(e,n,t){"use strict";var r=t("64a9"),o=t.n(r);o.a},1:function(e,n){},"56d7":function(e,n,t){"use strict";t.r(n);t("cadf"),t("551c"),t("f751"),t("097d");var r=t("2b0e"),o=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},a=[],u=(t("034f"),t("2877")),c={},s=Object(u["a"])(c,o,a,!1,null,null,null),i=s.exports,d=(t("a481"),t("8c4f"));r["default"].use(d["a"]);var l=new d["a"]({routes:[{path:"/",name:"home",component:function(){return Promise.all([t.e("chunk-31d23718"),t.e("chunk-5dc2c362"),t.e("about")]).then(t.bind(null,"bb51"))},meta:{requireAuth:!0},children:[{path:"dashboard",component:function(){return Promise.all([t.e("chunk-31d23718"),t.e("dashboard")]).then(t.bind(null,"7277"))}},{path:"agents",component:function(){return t.e("agents").then(t.bind(null,"9392"))}},{path:"converter",component:function(){return Promise.all([t.e("chunk-31d23718"),t.e("images~resources"),t.e("images")]).then(t.bind(null,"ab31"))}},{path:"resources",component:function(){return Promise.all([t.e("chunk-31d23718"),t.e("chunk-5dc2c362"),t.e("images~resources"),t.e("resources")]).then(t.bind(null,"93b9"))}}]},{path:"/login",name:"login",component:function(){return Promise.all([t.e("chunk-31d23718"),t.e("chunk-5dc2c362"),t.e("images~resources"),t.e("resources")]).then(t.bind(null,"a55b"))}}]});l.beforeEach(function(e,n,t){if(e.matched.some(function(e){return e.meta.requireAuth})){var r=window.localStorage.getItem("isConnected");"true"===r?t():l.replace("/login")}else t()});var f=l,h=t("2f62");r["default"].use(h["a"]);var m=function(){var e=window.localStorage.getItem("surfaceHeight"),n=window.localStorage.getItem("surfaceWidth"),t=null==e||null==n||0==e||0==n;return t},p=new h["a"].Store({state:{doShowSurfaceDimensionsAlert:m(),isTransmissionProcessActive:!1,currentActivePort:void 0,sbContent:"",sbColor:"",sbVisibility:!1},mutations:{TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE:function(e){e.doShowSurfaceDimensionsAlert=!e.doShowSurfaceDimensionsAlert},TOGGLE_TRANSMISSION_PROCESS_STATE:function(e){e.isTransmissionProcessActive=!e.isTransmissionProcessActive},SET_TRANSMISSION_PROCESS_STATE:function(e,n){e.isTransmissionProcessActive=n},SET_CURRENT_ACTIVE_PORT:function(e,n){e.currentActivePort=n},SHOW_SNACKBAR:function(e,n){e.sbColor=n.color,e.sbContent=n.content},TOGGLE_SB_VISIBILITY:function(e,n){e.sbVisibility=n}},actions:{}}),b=t("ce5b"),g=t.n(b),v=t("f87c"),S=t("8055"),T=t.n(S);t("bf40");r["default"].use(g.a),r["default"].use(v["a"],T()("http://localhost:3000")),r["default"].config.productionTip=!1,new r["default"]({router:f,store:p,render:function(e){return e(i)}}).$mount("#app")},"64a9":function(e,n,t){}});
//# sourceMappingURL=app.58376e02.js.map