(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{"456d":function(t,e,o){var i=o("4bf8"),r=o("0d58");o("5eda")("keys",function(){return function(t){return r(i(t))}})},"5eda":function(t,e,o){var i=o("5ca1"),r=o("8378"),a=o("79e5");t.exports=function(t,e){var o=(r.Object||{})[t]||Object[t],s={};s[t]=e(o),i(i.S+i.F*a(function(){o(1)}),"Object",s)}},6762:function(t,e,o){"use strict";var i=o("5ca1"),r=o("c366")(!0);i(i.P,"Array",{includes:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),o("9c6c")("includes")},"6bf2":function(t,e,o){"use strict";var i=o("d225"),r=o("b0b4"),a=o("bc3a"),s=o.n(a),n="api/local/auth/",l=function(){function t(){Object(i["a"])(this,t)}return Object(r["a"])(t,null,[{key:"Login",value:function(t){return new Promise(function(e,o){s.a.post(n+"login",t).then(function(t){e(t.data)}).catch(function(t){t.response?o(t.response.data.failure):t.request?o(t.request):o(t.message)})})}},{key:"Logout",value:function(t){return new Promise(function(e,o){s.a.post(n+"logout",{id:t},{headers:{Authorization:"Bearer "+window.localStorage.token}}).then(function(){e(!0)}).catch(function(t){t.response?o(t.response.data.failure):t.request?o(t.request):o(t.message)})})}}]),t}();e["a"]=l},a481:function(t,e,o){"use strict";var i=o("cb7c"),r=o("4bf8"),a=o("9def"),s=o("4588"),n=o("0390"),l=o("5f1b"),c=Math.max,u=Math.min,v=Math.floor,d=/\$([$&`']|\d\d?|<[^>]*>)/g,f=/\$([$&`']|\d\d?)/g,h=function(t){return void 0===t?t:String(t)};o("214f")("replace",2,function(t,e,o,p){return[function(i,r){var a=t(this),s=void 0==i?void 0:i[e];return void 0!==s?s.call(i,a,r):o.call(String(a),i,r)},function(t,e){var r=p(o,t,this,e);if(r.done)return r.value;var v=i(t),d=String(this),f="function"===typeof e;f||(e=String(e));var g=v.global;if(g){var b=v.unicode;v.lastIndex=0}var P=[];while(1){var S=l(v,d);if(null===S)break;if(P.push(S),!g)break;var w=String(S[0]);""===w&&(v.lastIndex=n(d,a(v.lastIndex),b))}for(var _="",x=0,k=0;k<P.length;k++){S=P[k];for(var C=String(S[0]),D=c(u(s(S.index),d.length),0),T=[],E=1;E<S.length;E++)T.push(h(S[E]));var O=S.groups;if(f){var y=[C].concat(T,D,d);void 0!==O&&y.push(O);var I=String(e.apply(void 0,y))}else I=m(C,d,D,T,O,e);D>=x&&(_+=d.slice(x,D)+I,x=D+C.length)}return _+d.slice(x)}];function m(t,e,i,a,s,n){var l=i+t.length,c=a.length,u=f;return void 0!==s&&(s=r(s),u=d),o.call(n,u,function(o,r){var n;switch(r.charAt(0)){case"$":return"$";case"&":return t;case"`":return e.slice(0,i);case"'":return e.slice(l);case"<":n=s[r.slice(1,-1)];break;default:var u=+r;if(0===u)return o;if(u>c){var d=v(u/10);return 0===d?o:d<=c?void 0===a[d-1]?r.charAt(1):a[d-1]+r.charAt(1):o}n=a[u-1]}return void 0===n?"":n})}})},ac6a:function(t,e,o){for(var i=o("cadf"),r=o("0d58"),a=o("2aba"),s=o("7726"),n=o("32e9"),l=o("84f2"),c=o("2b4c"),u=c("iterator"),v=c("toStringTag"),d=l.Array,f={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},h=r(f),p=0;p<h.length;p++){var m,g=h[p],b=f[g],P=s[g],S=P&&P.prototype;if(S&&(S[u]||n(S,u,d),S[v]||n(S,v,g),l[g]=d,b))for(m in i)S[m]||a(S,m,i[m],!0)}},bb51:function(t,e,o){"use strict";o.r(e);var i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-app",{attrs:{id:"inspire"}},[o("v-navigation-drawer",{attrs:{clipped:t.$vuetify.breakpoint.lgAndUp,fixed:"",app:"",absolute:""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[o("v-toolbar",{staticClass:"transparent",attrs:{flat:""}},[o("v-list",{staticClass:"pa-0"},[o("v-list-tile",{attrs:{avatar:""}},[t.isAdmin?o("v-list-tile-avatar",[o("v-icon",{attrs:{color:"teal darker-2","x-large":""}},[t._v("fas fa-crown")])],1):o("v-list-tile-avatar",[o("v-icon",{attrs:{color:"teal darker-2","x-large":""}},[t._v("fas fa-hard-hat")])],1),o("v-list-tile-content",[o("v-list-tile-title",[t._v(t._s(t.fullName))])],1),o("v-list-tile-action",[o("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[o("v-btn",t._g({attrs:{icon:"",ripple:"",small:""},on:{click:function(e){return t.launcheEditProfile()}}},i),[o("v-icon",{attrs:{small:"",color:"grey"}},[t._v("fas fa-user-edit")])],1)]}}])},[o("span",[t._v("Edit profile data")])])],1)],1)],1)],1),o("v-divider"),o("div",{staticClass:"hidden-md-and-up"},[o("v-list",{staticClass:"pt-0",attrs:{dense:""}},[o("v-list-tile",{attrs:{to:"/dashboard"}},[o("v-list-tile-action",[o("v-icon",{attrs:{left:""}},[t._v("fas fa-tachometer-alt")])],1),o("v-list-tile-content",[o("v-list-tile-title",[t._v("Dashboard")])],1)],1),1==t.isAdmin?o("v-list-tile",{attrs:{to:"/agents"}},[o("v-list-tile-action",[o("v-icon",{attrs:{left:""}},[t._v("fas fa-hard-hat")])],1),o("v-list-tile-content",[o("v-list-tile-title",[t._v("Workers")])],1)],1):t._e(),o("v-list-tile",{attrs:{to:"/converter"}},[o("v-list-tile-action",[o("v-icon",{attrs:{left:""}},[t._v("fas fa-recycle")])],1),o("v-list-tile-content",[o("v-list-tile-title",[t._v("Converter")])],1)],1),o("v-list-tile",{attrs:{to:"/resources"}},[o("v-list-tile-action",[o("v-icon",{attrs:{left:""}},[t._v("fas fa-boxes")])],1),o("v-list-tile-content",[o("v-list-tile-title",[t._v("Files")])],1)],1),o("v-list-tile",{on:{click:function(e){return t.performLogout()}}},[o("v-list-tile-action",[o("v-icon",{attrs:{left:""}},[t._v("fas fa-sign-out-alt")])],1),o("v-list-tile-content",[o("v-list-tile-title",[t._v("Logout")])],1)],1)],1)],1),o("v-divider"),o("v-list",{staticClass:"pt-0",attrs:{dense:""}},[o("v-list-tile",{on:{click:function(e){return t.showSettingsDialog()}}},[o("v-list-tile-action",[o("v-icon",[t._v("fas fa-tools")])],1),o("v-list-tile-content",[o("v-list-tile-title",[t._v("Settings")])],1)],1),o("v-divider"),0!=t.portsCount?o("v-list-group",{attrs:{"prepend-icon":"fas fa-parking",value:"true"},scopedSlots:t._u([{key:"activator",fn:function(){return[o("v-list-tile",[o("v-list-tile-title",[t._v("Ports")])],1)]},proxy:!0}],null,!1,3309181926)},t._l(t.portsList,function(e,i){return o("v-list-tile",{key:i,on:{click:function(o){return t.showPortPanel(e)}}},[o("v-list-tile-avatar",[o("h6",{staticClass:"text--teal"},[t._v(t._s(i))])]),o("v-list-tile-content",[o("v-list-tile-title",{domProps:{textContent:t._s(e.comName)}})],1)],1)}),1):o("v-list-tile",[o("v-list-tile-action",[o("v-icon",{attrs:{color:"red"}},[t._v("fas fa-exclamation-circle")])],1),o("v-list-tile-content",[o("v-list-tile-title",[t._v("No port is active")])],1)],1)],1)],1),o("v-toolbar",{attrs:{"clipped-left":t.$vuetify.breakpoint.lgAndUp,color:"teal",dark:"",app:"",fixed:""}},[o("v-toolbar-title",{staticClass:"ml-0 pl-0"},[o("v-toolbar-side-icon",{on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}}),o("span",{staticClass:"center"},[t._v("LOUDJEIN CNC")])],1),o("v-spacer"),o("v-toolbar-items",{staticClass:"hidden-sm-and-down"},[o("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){return[o("v-btn",t._g({staticClass:"m-0",attrs:{flat:"",to:"/dashboard"}},e.on),[o("v-icon",{attrs:{left:""}},[t._v("fas fa-tachometer-alt")]),t._v("Dashboard\n          ")],1)]}}])},[o("span",[t._v("Moniter the system and control it's data")])]),o("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([1==t.isAdmin?{key:"activator",fn:function(e){return[o("v-btn",t._g({staticClass:"m-0",attrs:{flat:"",to:"/agents"}},e.on),[t._v("Workers")])]}}:null],null,!0)},[o("span",[t._v("Consult workers list and manage there accounts")])]),o("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){return[o("v-btn",t._g({staticClass:"m-0",attrs:{flat:"",to:"/converter"}},e.on),[t._v("Converter")])]}}])},[o("span",[t._v("Convert image into gcode and transmit the file to machine")])]),o("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){return[o("v-btn",t._g({attrs:{flat:"",to:"/resources"}},e.on),[t._v("Files")])]}}])},[o("span",[t._v("Consult directory tree of all the resources in the server")])]),o("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){return[o("v-btn",t._g({attrs:{flat:""},on:{click:t.performLogout}},e.on),[o("v-icon",{attrs:{left:"",color:"white"}},[t._v("fas fa-sign-out-alt")]),t._v("Logout\n          ")],1)]}}])},[o("span",[t._v("logout")])])],1)],1),o("v-content",[o("v-container",{attrs:{"justify-center":"","align-center":"",fluid:""}},[o("v-fade-transition",[o("v-layout",{directives:[{name:"show",rawName:"v-show",value:t.doShowSurfaceDimensionsAlert,expression:"doShowSurfaceDimensionsAlert"}],attrs:{row:"",wrap:""}},[o("v-flex",{attrs:{xs12:"",ms12:"",md12:"",lg12:"","px-1":"","pb-1":""}},[o("v-list",{staticClass:"teal darken-4 pa-2 elevation-5"},[o("v-list-tile",{attrs:{avatar:"","three-line":""}},[o("v-list-tile-avatar",[o("v-icon",{attrs:{left:"",large:"",color:"white"}},[t._v("fas fa-exclamation-triangle")])],1),o("v-list-tile-content",{staticClass:"font-weight-bold"},[o("v-list-tile-title",{staticClass:"white--text text-lighten-3"},[t._v("Height & Width of the Drawing Surface are NOT DEFINED")]),o("v-list-tile-sub-title",{staticClass:"teal--text text-lighten-3"},[t._v("\n                    in settings page, please set them so you can convert the uploaded images\n                    into gcode.\n                  ")])],1),o("v-list-tile-action",[o("v-btn",{staticClass:"font-weight-bold elevation-1",attrs:{flat:"",color:"white"},on:{click:function(e){return t.showSettingsDialog()}}},[t._v("Set")])],1)],1)],1)],1)],1)],1),o("v-layout",{attrs:{row:"",wrap:""}},[o("router-view")],1)],1)],1),o("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",transition:"dialog-bottom-transition"},model:{value:t.settingsDialog,callback:function(e){t.settingsDialog=e},expression:"settingsDialog"}},[o("v-card",[o("v-toolbar",{attrs:{dark:"",color:"teal"}},[o("v-btn",{attrs:{icon:"",dark:"",disabled:t.doDisableCloseSettingsDialogBtn},on:{click:function(e){t.settingsDialog=!1}}},[o("v-icon",[t._v("close")])],1),o("v-toolbar-title",[t._v("Settings")]),o("v-spacer")],1),o("v-card-text",[o("v-layout",{attrs:{row:"",wrap:""}},[o("v-flex",{attrs:{xs12:""}},[o("v-list",{staticClass:"py-0",attrs:{"three-line":""}},[o("v-list-tile",[o("v-list-tile-content",[o("v-list-tile-title",[t._v("The Drawing Surface Dimensions")]),o("v-list-tile-sub-title",[t._v("These two values will be used to generate appropriate gcode coordinates according to the drawing surface of the machine")])],1)],1)],1)],1)],1),o("v-layout",{attrs:{row:"",wrap:""}},[o("v-flex",{attrs:{xs12:"",sm12:"",md6:"",lg3:"","px-2":"","pl-4":""}},[o("v-text-field",{attrs:{type:"number",label:"Width",clearable:"","error-messages":t.surfaceWidthErrors},on:{input:function(e){return t.$v.surfaceWidth.$touch()},blur:function(e){return t.$v.surfaceWidth.$touch()}},model:{value:t.surfaceWidth,callback:function(e){t.surfaceWidth=e},expression:"surfaceWidth"}})],1),o("v-flex",{attrs:{xs12:"",sm12:"",md6:"",lg3:"","px-2":""}},[o("v-text-field",{attrs:{type:"number",label:"Height",clearable:"","error-messages":t.surfaceHeightErrors},on:{input:function(e){return t.$v.surfaceHeight.$touch()},blur:function(e){return t.$v.surfaceHeight.$touch()}},model:{value:t.surfaceHeight,callback:function(e){t.surfaceHeight=e},expression:"surfaceHeight"}})],1)],1),o("v-layout",{attrs:{row:"",wrap:""}},[o("v-spacer"),o("v-btn",{staticClass:"white--text",attrs:{color:"teal",disabled:t.doDisableSurfaceDimensionsUpdateBtn},on:{click:function(e){return t.updateSurfaceDimensions()}}},[t._v("Update")])],1)],1),o("v-divider")],1)],1),o("v-layout",{attrs:{row:"","justify-center":""}},[o("v-dialog",{attrs:{persistent:"",fullscreen:"",transition:"dialog-bottom-transition"},model:{value:t.doShowPortPanel,callback:function(e){t.doShowPortPanel=e},expression:"doShowPortPanel"}},[o("v-card",[o("v-toolbar",{attrs:{dark:"",color:"teal"}},[o("v-btn",{attrs:{icon:"",dark:""},on:{click:function(e){1==t.openPortDis?t.leavePortPanelDialog=!0:t.doShowPortPanel=!1}}},[o("v-icon",[t._v("close")])],1),o("v-toolbar-title",[t._v("Port Panel")]),o("v-spacer"),o("v-toolbar-items",[o("v-btn",{attrs:{dark:"",flat:"",disabled:t.openPortDis},on:{click:function(e){return t.openPort(t.selectedPortObject.comName)}}},[o("v-icon",{attrs:{left:""}},[t._v("fas fa-door-open")]),t._v("Open Port\n            ")],1)],1),o("v-toolbar-items",[o("v-btn",{attrs:{dark:"",flat:"",disabled:t.closePortDis},on:{click:function(e){return t.closePort(t.selectedPortObject.comName)}}},[o("v-icon",{attrs:{left:""}},[t._v("fas fa-times-circle")]),t._v("Close Port\n            ")],1)],1),o("v-toolbar-items",[o("v-btn",{attrs:{dark:"",flat:"",disabled:t.flushPortDis},on:{click:function(e){return t.flushPort(t.selectedPortObject.comName)}}},[o("v-icon",{attrs:{left:""}},[t._v("fas fa-arrow-alt-circle-down")]),t._v("Flush Data\n            ")],1)],1),o("v-toolbar-items",[o("v-btn",{attrs:{dark:"",flat:"",disabled:t.resumePortDis},on:{click:function(e){return t.resumePort(t.selectedPortObject.comName)}}},[o("v-icon",{attrs:{left:""}},[t._v("fas fa-play-circle")]),t._v("Resume Data\n            ")],1)],1),o("v-toolbar-items",[o("v-btn",{attrs:{dark:"",flat:"",disabled:t.pausePortDis},on:{click:function(e){return t.pausePort(t.selectedPortObject.comName)}}},[o("v-icon",{attrs:{left:""}},[t._v("fas fa-pause-circle")]),t._v("Pause Data\n            ")],1)],1)],1),o("v-alert",{staticClass:"mx-3",attrs:{value:!0,type:"info",color:"teal darken-4",transition:"fade-transition"}},[t._v('Only "Port Name" is guaranteed 100%, other information is related to the connected device of the current port.')]),void 0!=t.selectedPortObject?o("v-list",[o("v-list-tile",{attrs:{avatar:""}},[o("v-list-tile-content",[o("v-list-tile-title",[t._v("Port Name")]),o("v-list-tile-sub-title",[t._v(t._s(t.selectedPortObject.comName))])],1)],1),o("v-list-tile",{attrs:{avatar:""}},[o("v-list-tile-content",[o("v-list-tile-title",[t._v("Manufacturer")]),o("v-list-tile-sub-title",[t._v(t._s(t.selectedPortObject.manufacturer))])],1)],1),o("v-list-tile",{attrs:{avatar:""}},[o("v-list-tile-content",[o("v-list-tile-title",[t._v("Serial Number")]),o("v-list-tile-sub-title",[t._v(t._s(t.selectedPortObject.serialNumber))])],1)],1),o("v-list-tile",{attrs:{avatar:""}},[o("v-list-tile-content",[o("v-list-tile-title",[t._v("Plug and Play ID")]),o("v-list-tile-sub-title",[t._v(t._s(t.selectedPortObject.pnpId))])],1)],1),o("v-list-tile",{attrs:{avatar:""}},[o("v-list-tile-content",[o("v-list-tile-title",[t._v("Procudt ID")]),o("v-list-tile-sub-title",[t._v(t._s(t.selectedPortObject.productId))])],1)],1),o("v-list-tile",{attrs:{avatar:""}},[o("v-list-tile-content",[o("v-list-tile-title",[t._v("Vendor ID")]),o("v-list-tile-sub-title",[t._v(t._s(t.selectedPortObject.vendorId))])],1)],1)],1):t._e(),o("v-divider"),o("v-layout",{attrs:{row:"",wrap:""}},[o("v-flex",{attrs:{xs12:"","px-3":""}},[o("v-toolbar",{staticClass:"elevation-0 mt-2 teal--text text--darken-1",attrs:{color:"teal lighten-4",card:""}},[o("v-text-field",{staticClass:"pt-2 teal--text text--darken-4",attrs:{label:"Commands",solo:""},model:{value:t.writeToPortTextField,callback:function(e){t.writeToPortTextField=e},expression:"writeToPortTextField"}}),o("v-fade-transition",[""!=t.writeToPortTextField?o("v-btn",{attrs:{icon:""},on:{click:function(e){return t.sendCommandToPort(t.selectedPortObject.comName)}}},[o("v-icon",{attrs:{color:"teal darken-4"}},[t._v("fas fa-paper-plane")])],1):t._e()],1),o("v-btn",{attrs:{icon:""},on:{click:function(e){return t.clearPortConsole()}}},[o("v-icon",{attrs:{color:"teal darken-4"}},[t._v("fas fa-eraser")])],1)],1)],1),o("v-flex",{attrs:{xs12:"","pb-3":""}},[o("v-card",{staticClass:"scroll scrollbar-style mx-3",attrs:{height:"300px",color:"teal lighten-4 elevation-0"}},[o("v-card-text",{staticClass:"black--text text-darken-4"},[o("table",t._l(t.portConsoleTxt,function(e,i){return o("tr",{key:i},[">"==e.charAt(1)?o("td",{staticClass:"font-weight-meduim"},[t._v(t._s(e))]):o("td",{staticClass:"red--text text-darken-1 font-weight-meduim"},[t._v(t._s(e))])])}),0)])],1)],1)],1)],1)],1)],1),o("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.leavePortPanelDialog,callback:function(e){t.leavePortPanelDialog=e},expression:"leavePortPanelDialog"}},[o("v-card",{attrs:{color:"teal lighten-5"}},[o("v-card-title",{staticClass:"teal--text text--darken-2 headline"},[o("v-icon",{attrs:{color:"teal darken-2",large:"",left:""}},[t._v("fas fa-exclamation-circle")]),t._v("Leave Port Panel\n      ")],1),o("v-card-text",[o("p",[t._v("The port will be closed after leaving Port Panel, are you sure you want to leave?")])]),o("v-card-actions",[o("v-btn",{staticClass:"teal--text",attrs:{flat:""},on:{click:function(e){t.leavePortPanelDialog=!1}}},[t._v("Cancel")]),o("v-spacer"),o("v-btn",{staticClass:"white--text",attrs:{color:"error"},on:{click:function(e){return t.closePortPanelDialog()}}},[t._v("Yes")])],1)],1)],1),o("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.editProfileDialog,callback:function(e){t.editProfileDialog=e},expression:"editProfileDialog"}},[o("v-card",{attrs:{color:"teal lighten-5"}},[o("v-card-title",{staticClass:"teal--text text--darken-2 headline"},[o("v-icon",{attrs:{"x-large":"",color:"teal darken-2",left:""}},[t._v("fas fa-user-edit")]),t._v("Edit Profile Data\n      ")],1),o("v-card-text",[o("InfoFormVue",{ref:"infoFormRef"}),o("v-divider"),o("PassFormVue",{ref:"passFormRef"})],1),o("v-card-actions",[o("v-spacer"),o("v-btn",{staticClass:"white--text",attrs:{color:"teal"},on:{click:function(e){return t.closeEditInfoDialog()}}},[t._v("Close")])],1)],1)],1),o("v-snackbar",{staticClass:"mb-2",attrs:{bottom:"",color:t.sbColor,"multi-line":"multi-line"},model:{value:t.sbVisibility,callback:function(e){t.sbVisibility=e},expression:"sbVisibility"}},[t._v(t._s(t.sbContent))])],1)},r=[],a=(o("a481"),o("6762"),o("ac6a"),o("456d"),o("cebc")),s=o("6bf2"),n=o("1637"),l=o("d6bd"),c=o("1dce"),u=o("b5ae"),v=o("2f62"),d=o("5118"),f=function(){return o.e("chunk-2d0e19f1").then(o.bind(null,"7ae6"))},h=function(){return o.e("chunk-2d229636").then(o.bind(null,"dcde"))},p={components:{InfoFormVue:f,PassFormVue:h},mixins:[c["validationMixin"]],validations:{surfaceWidth:{required:u["required"],minValue:Object(u["minValue"])(50),maxValue:Object(u["maxValue"])(2e3)},surfaceHeight:{required:u["required"],minValue:Object(u["minValue"])(50),maxValue:Object(u["maxValue"])(2e3)}},data:function(){return{portsList:[],portsCount:0,fullName:window.localStorage.getItem("last_name").toUpperCase()+" "+window.localStorage.getItem("first_name"),isAdmin:!1,editProfileDialog:!1,drawer:!1,right:null,doShowPortPanel:!1,selectedPortObject:void 0,leavePortPanelDialog:!1,flushPortDis:!0,pausePortDis:!0,resumePortDis:!0,openPortDis:!1,closePortDis:!0,writeToPortTextField:"",writeToPortProgress:!1,writeToPortProgressValue:"",portConsoleTxt:[],settingsDialog:!1,surfaceHeight:0,surfaceWidth:0,keepShowingSurfaceDimensionsAlert:!0}},computed:Object(a["a"])({},Object(v["c"])(["doShowSurfaceDimensionsAlert","isTransmissionProcessActive","sbColor","sbContent","sbVisibility"]),{surfaceWidthErrors:function(){var t=[];return this.$v.surfaceWidth.$dirty?(!this.$v.surfaceWidth.required&&t.push("Surface Width is required."),!this.$v.surfaceWidth.minValue&&t.push("Surface Width sould be more then 50mm."),!this.$v.surfaceWidth.maxValue&&t.push("Surface Width sould be less then 2000mm."),t):t},surfaceHeightErrors:function(){var t=[];return this.$v.surfaceHeight.$dirty?(!this.$v.surfaceHeight.required&&t.push("Surface Height is required."),!this.$v.surfaceHeight.minValue&&t.push("Surface Height sould be more then 50mm."),!this.$v.surfaceHeight.maxValue&&t.push("Surface Height sould be less then 2000mm."),t):t},doDisableSurfaceDimensionsUpdateBtn:function(){return this.$v.$invalid},doDisableCloseSettingsDialogBtn:function(){return this.doDisableSurfaceDimensionsUpdateBtn}}),sockets:{connect:function(){},onPortsListChanged:function(t){this.onActiveCallback(t)},onSinglePortData:function(t){t.target===window.localStorage.getItem("id")&&this.onSinglePortDataCallback(t)},onServerStatusChanged:function(t){this.SET_TRANSMISSION_PROCESS_STATE(t.status)}},methods:Object(a["a"])({},Object(v["b"])(["TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE","SET_TRANSMISSION_PROCESS_STATE","SHOW_SNACKBAR","TOGGLE_SB_VISIBILITY"]),{onSinglePortDataCallback:function(t){this.portConsoleTxt.unshift("-> data received: "+t.data)},onActiveCallback:function(t){this.portsCount=Object.keys(t).length;for(var e=[],o=0;o<this.portsCount;o++)e.push(t[o+1]);void 0==this.selectedPortObject||e.includes(this.selectedPortObject)||(this.showErrorSnackbar("".concat(this.selectedPortObject.comName," is not active anymore")),this.doShowPortPanel=!1,this.selectedPortObject=void 0),this.portsList=e},closePortPanelDialog:function(){var t=this;l["a"].closePort(this.selectedPortObject.comName).then(function(){t.leavePortPanelDialog=!1,t.doShowPortPanel=!1,t.openPortDis=!0,t.resumePortDis=!0,t.closePortDis=!1,t.pausePortDis=!1,t.flushPortDis=!1}).catch(function(e){t.portConsoleTxt.unshift("Error occurred: "+e),t.showErrorSnackbar(e)})},performLogout:function(){var t=this,e=localStorage.getItem("id");s["a"].Logout(e).then(function(){window.localStorage.setItem("isConnected",!1),//! remove data from local storage
window.localStorage.removeItem("id"),window.localStorage.removeItem("first_name"),window.localStorage.removeItem("last_name"),window.localStorage.removeItem("email"),window.localStorage.removeItem("token"),window.localStorage.removeItem("refresh_token"),t.isConnected=!1,t.$router.replace("/login")}).catch(function(e){t.showErrorSnackbar(e)})},pausePort:function(t){var e=this;this.portConsoleTxt.unshift("-> Pause emitting data on port: "+t),l["a"].pauseEmittingPort(t).then(function(t){e.portConsoleTxt.unshift("-> Emitting data on port is paused"),e.resumePortDis=!1,//! means enable btn
e.pausePortDis=!0,//! means disable btn
e.showSuccessSnackbar(t.success)}).catch(function(t){e.portConsoleTxt.unshift("Error occurred: "+t),e.showErrorSnackbar(t)})},resumePort:function(t){var e=this;this.portConsoleTxt.unshift("-> Resume emitting data on port: "+t),l["a"].resumeEmittingPort(t).then(function(t){e.portConsoleTxt.unshift("-> Emitting data on port is resumed"),e.pausePortDis=!1,e.resumePortDis=!0,e.showSuccessSnackbar(t.success)}).catch(function(t){e.portConsoleTxt.unshift("Error occurred: "+t),e.showErrorSnackbar(t)})},flushPort:function(t){var e=this;this.portConsoleTxt.unshift("-> Flushing data on port: "+t),l["a"].flushPort(t).then(function(t){e.portConsoleTxt.unshift("-> Data is flushed"),e.showSuccessSnackbar(t.success)}).catch(function(t){e.portConsoleTxt.unshift("Error occurred: "+t),e.showErrorSnackbar(t)})},openPort:function(t){var e=this;this.portConsoleTxt.unshift("-> Opening port: "+t),l["a"].openPort(t).then(function(t){e.portConsoleTxt.unshift("-> Port is opened"),e.showSuccessSnackbar(t),e.openPortDis=!0,e.resumePortDis=!0,e.closePortDis=!1,e.pausePortDis=!1,e.flushPortDis=!1}).catch(function(t){e.portConsoleTxt.unshift("Error occurred: "+t),e.showErrorSnackbar(t)})},closePort:function(t){var e=this;this.portConsoleTxt.unshift("-> Closing port: "+t),l["a"].closePort(t).then(function(t){e.portConsoleTxt.unshift("-> Port is closed"),e.showSuccessSnackbar(t),e.openPortDis=!1,e.resumePortDis=!0,e.closePortDis=!0,e.pausePortDis=!0,e.flushPortDis=!0}).catch(function(t){e.portConsoleTxt.unshift("Error occurred: "+t),e.showErrorSnackbar(t)})},sendCommandToPort:function(t){var e=this;""!=this.writeToPortTextField&&void 0!=this.writeToPortTextField?(this.portConsoleTxt.unshift("Writing: "+this.writeToPortTextField),l["a"].writeToPort(t,this.writeToPortTextField+"\r").then(function(t){e.writeToPortTextField="",e.showSuccessSnackbar(t)}).catch(function(t){e.portConsoleTxt.unshift("Error occurred: "+t),e.showErrorSnackbar(t)})):this.showErrorSnackbar("Can NOT send empty data!!")},showPortPanel:function(t){var e=this;this.selectedPortObject=t,l["a"].isPortOpen(t.comName).then(function(o){e.isSelectedPortOpened=o,l["a"].isPortActive(t.comName).then(function(t){t?(e.doShowPortPanel=!1,e.showErrorSnackbar("The port is already active, you can't use the panel")):e.doShowPortPanel=!0}).catch(function(t){e.showErrorSnackbar("Error while checking port activeness status!"+t)}),o?(e.openPortDis=!0,e.closePortDis=!1):(e.openPortDis=!1,e.closePortDis=!0)}).catch(function(t){e.showErrorSnackbar("Error while checking port open status!"+t)})},clearPortConsole:function(){this.portConsoleTxt=[]},showSuccessSnackbar:function(t){var e=this;this.TOGGLE_SB_VISIBILITY(!0),this.SHOW_SNACKBAR({color:"success",content:t}),Object(d["setTimeout"])(function(){e.TOGGLE_SB_VISIBILITY(!1)},5e3)},showErrorSnackbar:function(t){var e=this;this.TOGGLE_SB_VISIBILITY(!0),this.SHOW_SNACKBAR({color:"error",content:t}),Object(d["setTimeout"])(function(){e.TOGGLE_SB_VISIBILITY(!1)},5e3)},closeEditInfoDialog:function(){this.editProfileDialog=!1,this.$refs.passFormRef.$v.$reset(),this.$refs.infoFormRef.$v.$reset()},showSettingsDialog:function(){this.surfaceWidth=window.localStorage.getItem("surfaceWidth"),this.surfaceHeight=window.localStorage.getItem("surfaceHeight"),this.settingsDialog=!0},launcheEditProfile:function(){this.editProfileDialog=!0},updateSurfaceDimensions:function(){this.$v.$touch(),this.$v.$invalid||(window.localStorage.setItem("surfaceWidth",this.surfaceWidth),window.localStorage.setItem("surfaceHeight",this.surfaceHeight),this.doShowSurfaceDimensionsAlert&&this.TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE(),this.showSuccessSnackbar("Information Updated Successfully"))}}),
//! DON'T use arrow functions here
created:function(){var t=this,e=window.localStorage.getItem("id");n["a"].getRole(e).then(function(e){t.isAdmin=e.data.result}).catch(function(e){t.showErrorSnackbar(e)}),l["a"].getConnectedPortsList().then(function(e){t.portsCount=e.count,0!=e.count&&(t.portsList=e.ports)}).catch(function(e){t.showErrorSnackbar(e)}),this.$router.replace("/dashboard")}},m=p,g=(o("cccb"),o("2877")),b=Object(g["a"])(m,i,r,!1,null,null,null);e["default"]=b.exports},cccb:function(t,e,o){"use strict";var i=o("d563"),r=o.n(i);r.a},d563:function(t,e,o){}}]);
//# sourceMappingURL=about.16f2a270.js.map