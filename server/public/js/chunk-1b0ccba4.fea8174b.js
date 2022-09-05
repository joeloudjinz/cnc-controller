(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1b0ccba4"],{bdce:function(e,t,s){"use strict";s.r(t);var r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("v-dialog",{attrs:{persistent:"","max-width":"700"},model:{value:e.showConversionParamsDialog,callback:function(t){e.showConversionParamsDialog=t},expression:"showConversionParamsDialog"}},[s("v-card",[s("v-card-text",[s("v-alert",{attrs:{value:e.showBeforConversionAlert,color:"teal darken-4",transition:"fade-transition"}},[e._v("The image doesn't have a gcode file, adjust these paramaters to convert it first.")]),s("v-alert",{attrs:{value:e.showConversionResultAlert,color:"teal darken-4",transition:"fade-transition"}},[e._v("This is the percentages of the proccessed and unproccessed pixels in the picture.")]),s("v-progress-linear",{directives:[{name:"show",rawName:"v-show",value:e.showConversionProgress,expression:"showConversionProgress"}],attrs:{indeterminate:!0,color:"teal darken-2"}}),e.doShowParamsForm?s("v-container",{attrs:{fluid:"","grid-list-lg":""}},[s("v-flex",{attrs:{xs12:""}},[s("v-list",{staticClass:"teal lighten-5 pt-0",attrs:{"three-line":""}},[s("v-list-tile",[s("v-list-tile-content",[s("v-list-tile-title",{staticClass:"title"},[e._v("Laser Mode")]),s("v-list-tile-sub-title",{staticClass:"teal--text font-weight-medium"},[e._v("If you are using CNC machine with laser tool, activate the laser mode, IF NOT turn it off")])],1),s("v-list-tile-action",[s("v-switch",{attrs:{color:"teal darken-2"},model:{value:e.laserModeStatus,callback:function(t){e.laserModeStatus=t},expression:"laserModeStatus"}})],1)],1)],1)],1),s("v-flex",{attrs:{xs12:""}},[s("v-subheader",{staticClass:"pl-0"},[e._v("Tool Diameter")]),s("v-slider",{attrs:{color:"teal","thumb-label":"always",min:"0",max:"3",step:"0.01"},model:{value:e.toolDiameter,callback:function(t){e.toolDiameter=t},expression:"toolDiameter"}})],1),s("v-flex",{attrs:{xs12:""}},[s("v-subheader",{staticClass:"pl-0"},[e._v("Sensitivity")]),s("v-slider",{attrs:{color:"teal","thumb-label":"always",min:"0",max:"1",step:"0.01"},model:{value:e.sensitivity,callback:function(t){e.sensitivity=t},expression:"sensitivity"}})],1),s("v-layout",{attrs:{"justify-center":"",row:"",wrap:""}},[s("v-flex",{attrs:{xs12:"",sm12:"",md6:"",lg6:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"Scale Axes","persistent-hint":"",hint:"This field is required",color:"teal darken-2",type:"number",error:e.scaleAxesErrorState,"error-messages":e.scaleAxesErrorContent},model:{value:e.scaleAxes,callback:function(t){e.scaleAxes=t},expression:"scaleAxes"}})],1),s("v-flex",{attrs:{xs12:"",sm12:"",md6:"",lg6:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"Deep Step",color:"teal darken-2",type:"number"},model:{value:e.deepStep,callback:function(t){e.deepStep=t},expression:"deepStep"}})],1)],1),s("v-layout",{attrs:{"justify-center":"",row:"",wrap:""}},[s("v-flex",{attrs:{xs12:"",sm12:"",md4:"",lg4:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"White Z",color:"teal darken-2",type:"number"},model:{value:e.whiteZ,callback:function(t){e.whiteZ=t},expression:"whiteZ"}})],1),s("v-flex",{attrs:{xs12:"",sm12:"",md4:"",lg4:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"Black Z",color:"teal darken-2",type:"number"},model:{value:e.blackZ,callback:function(t){e.blackZ=t},expression:"blackZ"}})],1),s("v-flex",{attrs:{xs12:"",sm12:"",md4:"",lg4:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"Safe Z",color:"teal darken-2",type:"number"},model:{value:e.safeZ,callback:function(t){e.safeZ=t},expression:"safeZ"}})],1)],1),e._v("Feed Rate\n        "),s("v-layout",{attrs:{"justify-center":"",row:"",wrap:""}},[s("v-flex",{attrs:{xs12:"",sm12:"",md6:"",lg6:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"Work",color:"teal darken-2",type:"number"},model:{value:e.work,callback:function(t){e.work=t},expression:"work"}})],1),s("v-flex",{attrs:{xs12:"",sm12:"",md6:"",lg6:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"Idle",color:"teal darken-2",type:"number"},model:{value:e.idle,callback:function(t){e.idle=t},expression:"idle"}})],1)],1),s("v-layout",{attrs:{"justify-center":"",row:"",wrap:""}},[s("v-flex",{attrs:{xs12:"",sm12:"",md4:"",lg4:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"Command Power On",type:"text",color:"teal darken-2",disabled:!e.laserModeStatus},model:{value:e.powerOn,callback:function(t){e.powerOn=t},expression:"powerOn"}})],1),s("v-flex",{attrs:{xs12:"",sm12:"",md4:"",lg4:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"Spindle",type:"text",color:"teal darken-2",disabled:!e.laserModeStatus},model:{value:e.spindle,callback:function(t){e.spindle=t},expression:"spindle"}})],1),s("v-flex",{attrs:{xs12:"",sm12:"",md4:"",lg4:""}},[s("v-text-field",{staticClass:"mt-0",attrs:{label:"Command Power Off",type:"text",color:"teal darken-2",disabled:!e.laserModeStatus},model:{value:e.powerOff,callback:function(t){e.powerOff=t},expression:"powerOff"}})],1)],1)],1):s("v-container",[s("v-layout",{attrs:{"align-center":"","justify-center":"",row:"","fill-height":"",wrap:""}},[s("v-flex",{attrs:{xs12:"",sm12:"",md6:"",lg6:""}},[s("v-layout",{attrs:{"align-center":"","justify-center":"",row:"","fill-height":""}},[s("v-tooltip",{attrs:{bottom:""},scopedSlots:e._u([{key:"activator",fn:function(t){return[s("v-progress-circular",e._g({attrs:{rotate:360,size:170,width:20,value:e.proccessBlackPixelsValue,color:"teal lighten-1"}},t.on),[e._v(e._s(e.proccessBlackPixelsValue)+"%")])]}}])},[s("span",[e._v("The percentage of the proccessed black pixels in the picture")])])],1)],1),s("v-flex",{attrs:{xs12:"",sm12:"",md6:"",lg6:""}},[s("v-layout",{attrs:{"align-center":"","justify-center":"",row:"","fill-height":""}},[s("v-tooltip",{attrs:{bottom:""},scopedSlots:e._u([{key:"activator",fn:function(t){return[s("v-progress-circular",e._g({attrs:{rotate:360,size:170,width:20,value:e.unproccessBlackPixelsValue,color:"red lighten-1"}},t.on),[e._v(e._s(e.unproccessBlackPixelsValue)+"%")])]}}])},[s("span",[e._v("The percentage of the unproccessed black pixels in the picture")])])],1)],1)],1)],1)],1),s("v-card-actions",[s("v-btn",{staticClass:"teal--text lighten-1",attrs:{flat:""},on:{click:function(t){e.showConversionParamsDialog=!1}}},[e._v("Cancel")]),s("v-spacer"),s("v-btn",{directives:[{name:"show",rawName:"v-show",value:e.doShowConversionBtn,expression:"doShowConversionBtn"}],staticClass:"white--text",attrs:{color:"teal lighten-1"},on:{click:function(t){return e.startConversionProcess()}}},[e._v("Convert")]),s("v-btn",{directives:[{name:"show",rawName:"v-show",value:!e.doShowConversionBtn,expression:"!doShowConversionBtn"}],staticClass:"teal--text",attrs:{disabled:e.disableConversionCardActionBtns,color:"white"},on:{click:function(t){return e.reStartConversionProcess()}}},[e._v("Re-Convert")]),s("v-btn",{directives:[{name:"show",rawName:"v-show",value:!e.doShowConversionBtn,expression:"!doShowConversionBtn"}],staticClass:"white--text",attrs:{disabled:e.disableConversionCardActionBtns,color:"teal lighten-1"},on:{click:function(t){return e.prepareQuickDrawOperation()}}},[e._v("Draw")])],1)],1)],1)},a=[],o=(s("6762"),s("2fdb"),s("cebc")),n=s("f31c"),i=s("2f62"),l={data:function(){return{showConversionParamsDialog:!1,doShowParamsForm:!0,toolDiameter:1,sensitivity:.95,scaleAxes:0,scaleAxesErrorContent:"",scaleAxesErrorState:!1,deepStep:-1,blackZ:-2,whiteZ:0,safeZ:1,work:1200,idle:3e3,laserModeStatus:!1,powerOn:"M3",spindle:"s600",powerOff:"M05",showBeforConversionAlert:!0,proccessBlackPixelsValue:0,unproccessBlackPixelsValue:0,showConversionResultAlert:!1,conversionProgressValue:0,conversionProgressQuery:!1,showConversionProgress:!1,conversionProgressInterval:0}},sockets:{onQuickConversionEnded:function(e){
//! if you use store state here, import 'id' state;
e.target==localStorage.id&&(this.showConversionProgress=!1,this.doShowParamsForm=!1,this.showConversionResultAlert=!0,this.proccessBlackPixelsValue=100-e.conversionDetails,this.unproccessBlackPixelsValue=e.conversionDetails,this.$parent.$parent.showSuccessSnackbar("Converted successfully"))},onQuickConversionErrorOccur:function(e){e.target==localStorage.id&&(this.doShowParamsForm=!0,this.showConversionProgress=!1,this.showConversionResultAlert=!1,this.showBeforConversionAlert=!0,this.$parent.$parent.showErrorSnackbar(e.errorData))}},computed:Object(o["a"])({},Object(i["d"])(["currentFileName"]),{disableConversionCardActionBtns:function(){return this.showConversionProgress},doShowConversionBtn:function(){return this.doShowParamsForm}}),methods:{toggleDialogVisibility:function(){this.showConversionParamsDialog=!this.showConversionParamsDialog,this.currentFileName.includes("M")?this.laserModeStatus=!0:this.laserModeStatus=!1},hideDialog:function(){this.showConversionParamsDialog=!1},startConversionProcess:function(){var e=this;if(this.scaleAxes<=50)this.scaleAxesErrorState=!0,this.scaleAxesErrorContent="Scale Axes must be superior of 50mm";else{var t=parseInt(window.localStorage.getItem("surfaceHeight"));this.scaleAxes<t?(this.showConversionProgress=!0,this.showBeforConversionAlert=!1,this.doShowParamsForm=!1,this.scaleAxesErrorState=!1,this.scaleAxesErrorContent="",n["a"].QuickConvertImage(this.currentFileName,{toolDiameter:this.toolDiameter,sensitivity:this.sensitivity,scaleAxes:this.scaleAxes,deepStep:this.deepStep,blackZ:this.blackZ,whiteZ:this.whiteZ,safeZ:this.safeZ,work:this.work,idle:this.idle},{laserModeStatus:this.laserModeStatus,powerOn:this.powerOn+" "+this.spindle,powerOff:this.powerOff}).then(function(t){e.$parent.$parent.showSuccessSnackbar(t.success)}).catch(function(t){e.showConversionProgress=!1,e.doShowParamsForm=!0,e.$parent.$parent.showErrorSnackbar(t)})):(this.scaleAxesErrorState=!0,this.scaleAxesErrorContent="Scale Axes must be less then the height of the surface ("+t+"mm)")}},initializeDialog:function(){this.scaleAxes=0,this.laserModeStatus=!1,this.doShowParamsForm=!0,this.proccessBlackPixelsValue=0,this.unproccessBlackPixelsValue=0},showParamsForm:function(){this.doShowParamsForm=!0},prepareQuickDrawOperation:function(){this.$parent.prepareQuickDrawOperation()},reStartConversionProcess:function(){this.scaleAxes=0,this.$parent.reStartConversionProcess()}}},c=l,u=s("2877"),h=Object(u["a"])(c,r,a,!1,null,null,null);t["default"]=h.exports},f31c:function(e,t,s){"use strict";s("96cf");var r=s("3b8d"),a=s("d225"),o=s("b0b4"),n=s("bc3a"),i=s.n(n),l=s("1637"),c="api/local/conversions",u=function(){function e(){Object(a["a"])(this,e)}return Object(o["a"])(e,null,[{key:"ConvertImage",value:function(t){return new Promise(function(){var s=Object(r["a"])(regeneratorRuntime.mark(function s(r,a){return regeneratorRuntime.wrap(function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,i.a.post(c+"/convert",t).then(function(e){r(e.data)}).catch(function(s){s.response?406==s.response.status?l["a"].RefreshToken().then(function(){r(e.ConvertImage(t))}).catch(function(e){a(e)}):a(s.response.data.failure):s.request?a("Check you internet connection!"):a(s.message)});case 2:case"end":return s.stop()}},s)}));return function(e,t){return s.apply(this,arguments)}}())}},{key:"QuickConvertImage",value:function(t,s,a){return new Promise(function(){var o=Object(r["a"])(regeneratorRuntime.mark(function r(o,n){return regeneratorRuntime.wrap(function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,i.a.post(c+"/convert/quick",{parameters:s,target:localStorage.id,laserConfig:a},{params:{imageName:t}}).then(function(e){o(e.data)}).catch(function(r){r.response?406==r.response.status?l["a"].RefreshToken().then(function(){o(e.QuickConvertImage(t,s))}).catch(function(e){n(e)}):n(r.response.data.failure):r.request?n("Check you internet connection!"):n(r.message)});case 2:case"end":return r.stop()}},r)}));return function(e,t){return o.apply(this,arguments)}}())}},{key:"getConversionsCount",value:function(){return new Promise(function(){var t=Object(r["a"])(regeneratorRuntime.mark(function t(s,r){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,i.a.get(c+"/count").then(function(e){s(e.data.count)}).catch(function(t){t.response?406==t.response.status?l["a"].RefreshToken().then(function(){s(e.getConversionsCount())}).catch(function(e){r(e)}):r(t.response.data.failure):t.request?r("Check you internet connection!"):r(t.message)});case 2:case"end":return t.stop()}},t)}));return function(e,s){return t.apply(this,arguments)}}())}}]),e}();t["a"]=u}}]);
//# sourceMappingURL=chunk-1b0ccba4.fea8174b.js.map