(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0ae9a9"],{"0b89":function(t,s,e){"use strict";e.r(s);var o=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("v-dialog",{attrs:{persistent:"",width:"700"},model:{value:t.showPortsListDialog,callback:function(s){t.showPortsListDialog=s},expression:"showPortsListDialog"}},[e("v-card",{attrs:{color:"teal lighten-5"}},[e("v-card-title",{staticClass:"headline teal--text"},[t._v("Ports List")]),e("v-card-text",{staticClass:"py-0 px-0"},[t.progressStatus?e("v-progress-linear",{staticClass:"pa-0",attrs:{indeterminate:!0,color:"teal darken-2"}}):t._e(),e("v-container",{attrs:{"grid-list-sm":""}},[e("v-alert",{staticClass:"mb-2",attrs:{value:!0,color:"teal darken-4",type:"info"}},[t._v("\n          Tranmission process consume to mush time, so be patient until it's successfully completed,\n          You can monitor the whole process from the two consoles below after you select the port.\n          If the process hang up for some reasons, you can pause and resume it.\n        ")]),e("p",{staticClass:"title"},[t._v("Chose port:")]),e("v-alert",{attrs:{value:t.isTransmissionProcessActive,type:"warning"}},[t._v("There is already a transmission process going on")]),e("v-fade-transition",[0!==t.portsList.length?e("v-list",t._l(t.portsList,function(s,o){return e("v-list-tile",{key:o,attrs:{disabled:t.isTransmissionProcessActive},on:{click:function(e){return t.startTransmitingGCode(s.comName)}}},[e("v-list-tile-content",[e("v-list-tile-title",{staticClass:"font-weight-bold"},[t._v(t._s(s.comName))]),e("v-list-tile-sub-title",{staticClass:"font-weight-medium font-italic"},[t._v(t._s(s.manufacturer))])],1)],1)}),1):e("v-list",[e("v-alert",{attrs:{value:!0,type:"error"}},[t._v("No port is connected!")])],1)],1)],1)],1),e("v-card-actions",[e("v-btn",{attrs:{flat:"",color:"teal"},on:{click:function(s){t.showPortsListDialog=!1}}},[t._v("Cancel")]),e("v-spacer")],1)],1)],1)},i=[],r=e("cebc"),a=e("d6bd"),n=e("2f62"),l={data:function(){return{showPortsListDialog:!1,portsList:[],progressStatus:!1}},computed:Object(r["a"])({},Object(n["d"])(["isTransmissionProcessActive"])),methods:{togglePortsListDialogeVisibility:function(){this.showPortsListDialog=!this.showPortsListDialog},toggleProgressStatus:function(){this.progressStatus,this.progressStatus},fetchPortsList:function(){var t=this;this.progressStatus=!0,a["a"].getConnectedPortsList().then(function(s){t.progressStatus=!1,0!==s.count&&(t.portsList=s.ports)}).catch(function(s){t.progressStatus=!1,t.$refs.portsListDialogRef.togglePortsListDialogeVisibility(),t.$parent.showErrorSnackbar(s)})},startTransmitingGCode:function(t){this.$parent.startTransmitingGCode(t)}}},c=l,u=e("2877"),p=Object(u["a"])(c,o,i,!1,null,null,null);s["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d0ae9a9.d45e9ad6.js.map