(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["login"],{5118:function(e,t,n){(function(e){var i="undefined"!==typeof e&&e||"undefined"!==typeof self&&self||window,a=Function.prototype.apply;function r(e,t){this._id=e,this._clearFn=t}t.setTimeout=function(){return new r(a.call(setTimeout,i,arguments),clearTimeout)},t.setInterval=function(){return new r(a.call(setInterval,i,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(i,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},n("6017"),t.setImmediate="undefined"!==typeof self&&self.setImmediate||"undefined"!==typeof e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!==typeof self&&self.clearImmediate||"undefined"!==typeof e&&e.clearImmediate||this&&this.clearImmediate}).call(this,n("24aa"))},6017:function(e,t,n){(function(e,t){(function(e,n){"use strict";if(!e.setImmediate){var i,a=1,r={},o=!1,s=e.document,l=Object.getPrototypeOf&&Object.getPrototypeOf(e);l=l&&l.setTimeout?l:e,"[object process]"==={}.toString.call(e.process)?m():p()?v():e.MessageChannel?h():s&&"onreadystatechange"in s.createElement("script")?b():g(),l.setImmediate=c,l.clearImmediate=u}function c(e){"function"!==typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var o={callback:e,args:t};return r[a]=o,i(a),a++}function u(e){delete r[e]}function f(e){var t=e.callback,i=e.args;switch(i.length){case 0:t();break;case 1:t(i[0]);break;case 2:t(i[0],i[1]);break;case 3:t(i[0],i[1],i[2]);break;default:t.apply(n,i);break}}function d(e){if(o)setTimeout(d,0,e);else{var t=r[e];if(t){o=!0;try{f(t)}finally{u(e),o=!1}}}}function m(){i=function(e){t.nextTick(function(){d(e)})}}function p(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=n,t}}function v(){var t="setImmediate$"+Math.random()+"$",n=function(n){n.source===e&&"string"===typeof n.data&&0===n.data.indexOf(t)&&d(+n.data.slice(t.length))};e.addEventListener?e.addEventListener("message",n,!1):e.attachEvent("onmessage",n),i=function(n){e.postMessage(t+n,"*")}}function h(){var e=new MessageChannel;e.port1.onmessage=function(e){var t=e.data;d(t)},i=function(t){e.port2.postMessage(t)}}function b(){var e=s.documentElement;i=function(t){var n=s.createElement("script");n.onreadystatechange=function(){d(t),n.onreadystatechange=null,e.removeChild(n),n=null},e.appendChild(n)}}function g(){i=function(e){setTimeout(d,0,e)}}})("undefined"===typeof self?"undefined"===typeof e?this:e:self)}).call(this,n("24aa"),n("f28c"))},"6bf2":function(e,t,n){"use strict";var i=n("d225"),a=n("b0b4"),r=n("bc3a"),o=n.n(r),s="api/local/auth/",l=function(){function e(){Object(i["a"])(this,e)}return Object(a["a"])(e,null,[{key:"Login",value:function(e){return new Promise(function(t,n){o.a.post(s+"login",e).then(function(e){t(e.data)}).catch(function(e){e.response?n(e.response.data.failure):e.request?n(e.request):n(e.message)})})}},{key:"Logout",value:function(e){return new Promise(function(t,n){o.a.post(s+"logout",{id:e}).then(function(){t(!0)}).catch(function(e){e.response?n(e.response.data.failure):e.request?n(e.request):n(e.message)})})}}]),e}();t["a"]=l},"7c30":function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-snackbar",{staticClass:"mb-2",attrs:{bottom:"",color:e.sbColor,"multi-line":"multi-line"},model:{value:e.visibility,callback:function(t){e.visibility=t},expression:"visibility"}},[e._v(e._s(e.sbContent))])},a=[],r={props:{color:String,content:String,visibility:Boolean},computed:{sbColor:function(){return this.color},sbContent:function(){return this.content}}},o=r,s=n("2877"),l=Object(s["a"])(o,i,a,!1,null,null,null);t["a"]=l.exports},a55b:function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",{attrs:{id:"inspire"}},[n("v-content",[n("v-container",{staticClass:"teal lighten-5",attrs:{fluid:"","fill-height":""}},[n("v-layout",{attrs:{"align-center":"","justify-center":""}},[n("v-flex",{attrs:{xs11:"",sm8:"",md5:""}},[n("v-card",{staticClass:"teal lighten-4 elevation-8"},[n("v-img",{attrs:{"aspect-ratio":16/9,src:e.url}}),n("v-alert",{attrs:{value:e.alertValue,type:"error",dismissible:"",transition:"fade-transition"}},[e._v(e._s(e.alertContent))]),n("v-card-text",[n("v-form",[n("v-text-field",{attrs:{"error-messages":e.emailErrors,label:"E-mail",required:"",color:"teal darken-5",outline:"",clearable:"","prepend-inner-icon":"fas fa-at"},on:{input:function(t){return e.$v.email.$touch()},blur:function(t){return e.$v.email.$touch()}},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}}),n("v-text-field",{attrs:{"error-messages":e.passwordErrors,counter:0,type:"password",label:"Password",clearable:"",required:"",color:"teal darken-5","prepend-inner-icon":"fas fa-lock",outline:""},on:{input:function(t){return e.$v.password.$touch()},blur:function(t){return e.$v.password.$touch()}},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1)],1),n("v-card-actions",[n("v-spacer"),n("v-btn",{staticClass:"teal--text",attrs:{color:"white"},on:{click:e.submit}},[e._v("Login")])],1)],1)],1)],1)],1)],1),n("SnackBar",{attrs:{color:e.color,content:e.content,visibility:e.visibility}})],1)},a=[],r=(n("a481"),n("cebc")),o=n("1dce"),s=n("b5ae"),l=n("2f62"),c=n("6bf2"),u=n("7c30"),f=n("5118"),d={name:"login",mixins:[o["validationMixin"]],validations:{email:{required:s["required"],email:s["email"]},password:{required:s["required"],minLength:Object(s["minLength"])(6)}},components:{SnackBar:u["a"]},data:function(){return{url:n("b16d"),drawer:null,email:"",password:"",color:"teal",content:"",visibility:!1}},props:{source:String},computed:{alertValue:function(){return this.$store.state.loginAlertValue},alertContent:function(){return this.$store.state.loginAlertContent},emailErrors:function(){var e=[];return this.$v.email.$dirty?(!this.$v.email.email&&e.push("Must be valid e-mail"),!this.$v.email.required&&e.push("E-mail is required"),e):e},passwordErrors:function(){var e=[];return this.$v.password.$dirty?(!this.$v.password.minLength&&e.push("Password must be at least 6 caracters"),!this.$v.password.required&&e.push("Password is required"),e):e}},methods:Object(r["a"])({},Object(l["c"])(["TOGGLE_IS_CONNECTED_STATE","HIDE_LOGIN_ALERT_VALUE"]),{submit:function(){var e=this;this.$v.$touch(),this.$v.$invalid||c["a"].Login({email:this.email,password:this.password}).then(function(t){e.HIDE_LOGIN_ALERT_VALUE(),localStorage.id=t.agent.id,localStorage.email=t.agent.email,localStorage.last_name=t.agent.last_name,localStorage.first_name=t.agent.first_name,localStorage.token=t.token,localStorage.refresh_token=t.refresh_token,e.$router.replace("/")}).catch(function(t){e.showErrorSnackbar(t)})},showErrorSnackbar:function(e){var t=this;this.color="error",this.content=e,this.visibility=!0,Object(f["setTimeout"])(function(){t.visibility=!1},5e3)}})},m=d,p=n("2877"),v=Object(p["a"])(m,i,a,!1,null,null,null);t["default"]=v.exports},b16d:function(e,t,n){e.exports=n.p+"img/machine.60d351e8.jpg"}}]);
//# sourceMappingURL=login.bfd1c3be.js.map