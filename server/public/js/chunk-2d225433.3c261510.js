(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d225433"],{e43a:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",{staticClass:"pt-3 elevation-0",attrs:{color:"teal lighten-5"}},[a("v-alert",{staticClass:"mx-3",attrs:{value:!0,color:"teal darken-1",type:"info"}},[t._v("Here you can find the list of all the users of the system, both workers and admins, with there status of activeness")]),a("v-card-title",[a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"search",label:"Search",color:"teal darken-2","single-line":"","hide-details":"",clearable:""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),a("v-data-table",{staticClass:"elevation-3",attrs:{headers:t.headers,items:t.agents,search:t.search,loading:t.loading,"item-key":"index"},scopedSlots:t._u([{key:"items",fn:function(e){return[a("td",[a("v-badge",{attrs:{right:"",color:"transparent"},scopedSlots:t._u([{key:"badge",fn:function(){return[1==e.item.is_admin?a("span",[a("v-icon",{attrs:{"x-small":"",color:"teal darken-3"}},[t._v("fas fa-crown")])],1):a("span",[a("v-icon",{attrs:{"x-small":"",color:"teal"}},[t._v("fas fa-hard-hat")])],1)]},proxy:!0}],null,!0)},[t._v("\n          "+t._s(e.item.index)+"\n        ")])],1),e.item.is_active?a("td",{staticClass:"text-lg-center"},[a("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){return[a("v-chip",t._g({attrs:{small:"","text-color":"teal darken-2"}},e.on),[a("v-icon",{attrs:{small:""}},[t._v("fas fa-eye")])],1)]}}],null,!0)},[a("span",[t._v("Worker is active")])])],1):a("td",{staticClass:"text-lg-center"},[a("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){return[a("v-chip",t._g({attrs:{small:"","text-color":"grey darken-2"}},e.on),[a("v-icon",{attrs:{small:""}},[t._v("fas fa-eye-slash")])],1)]}}],null,!0)},[a("span",[t._v("Worker is not active")])])],1),a("td",[t._v(t._s(e.item.first_name))]),a("td",[t._v(t._s(e.item.last_name.toUpperCase()))]),a("td",[t._v(t._s(e.item.email))]),a("td",[a("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(s){return[a("v-btn",t._g({attrs:{icon:""},on:{click:function(a){return t.confirmResetingPassword(e.item.id)}}},s.on),[a("v-icon",{attrs:{small:"",color:"teal darken-2"}},[t._v("fas fa-power-off")])],1)]}}],null,!0)},[a("span",[t._v("Reset the password of this user account")])]),a("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(s){return[a("v-btn",t._g({attrs:{icon:""},on:{click:function(a){return t.showConfirmDeleteDialog(e.item.id)}}},s.on),[a("v-icon",{attrs:{small:"",color:"red darken-2"}},[t._v("fas fa-user-minus")])],1)]}}],null,!0)},[a("span",[t._v("Delete This User Account")])])],1)]}}])},[a("v-progress-linear",{attrs:{slot:"progress",color:"teal darken-2",indeterminate:""},slot:"progress"}),a("v-alert",{attrs:{slot:"no-results",value:!0,color:"error",icon:"warning"},slot:"no-results"},[t._v('Your search for "'+t._s(t.search)+'" found no results.')])],1),a("v-dialog",{attrs:{persistent:"",width:"500"},model:{value:t.confirmeDeleteDialog,callback:function(e){t.confirmeDeleteDialog=e},expression:"confirmeDeleteDialog"}},[a("v-card",{attrs:{color:"teal lighten-5",dark:""}},[a("v-card-title",{staticClass:"teal--text text--darken-2 headline"},[a("v-icon",{attrs:{color:"teal darken-2",large:"",left:""}},[t._v("fas fa-exclamation-circle")]),t._v("Confirm Deletion\n      ")],1),a("v-divider"),a("v-card-text",{staticClass:"font-weight-meduim teal lighten-5 teal--text text--darken-2"},[t._v("Confirm the deletion of user "),a("span",{staticClass:"font-weight-bold"},[t._v(t._s(t.selectedUserFullName))]),t._v(" ?")]),a("v-card-actions",[a("v-btn",{staticClass:"teal--text lighten-1",attrs:{flat:""},on:{click:function(e){return t.cancelConfirmDeleteDialog()}}},[t._v("Cancel")]),a("v-spacer"),a("v-btn",{staticClass:"white--text",attrs:{color:"red lighten-1"},on:{click:function(e){return t.deleteAgent()}}},[t._v("Yes")])],1)],1)],1),a("v-dialog",{attrs:{persistent:"",width:"500"},model:{value:t.confirmResetingPasswordDialog,callback:function(e){t.confirmResetingPasswordDialog=e},expression:"confirmResetingPasswordDialog"}},[a("v-card",{attrs:{color:"teal lighten-5",dark:""}},[a("v-card-title",{staticClass:"teal--text text--darken-2 headline"},[t._v("Worker Password Reset")]),a("v-card-text",{staticClass:"font-weight-light teal--text text--darken-4"},[t._v("\n        Are you sure you want to reset the password of the user\n        "),a("span",{staticClass:"font-weight-medium"},[t._v(t._s(t.selectedUserFullName))]),t._v("?\n      ")]),a("v-card-actions",[a("v-btn",{staticClass:"teal--text",attrs:{flat:""},on:{click:function(e){t.confirmResetingPasswordDialog=!1}}},[t._v("Close")]),a("v-spacer"),a("v-btn",{staticClass:"white--text",attrs:{color:"red lighten-1"},on:{click:function(e){return t.resetAgentPassword()}}},[t._v("Reset")])],1)],1)],1),a("v-dialog",{attrs:{persistent:"",width:"500"},model:{value:t.resetingPasswordDialog,callback:function(e){t.resetingPasswordDialog=e},expression:"resetingPasswordDialog"}},[a("v-card",{attrs:{color:"teal lighten-5",dark:""}},[a("v-card-title",{staticClass:"teal--text text--darken-2 headline"},[t._v("Worker Password Reset")]),a("v-progress-linear",{staticClass:"pa-0 mb-0",attrs:{indeterminate:"",color:"teal darken-2",active:t.loadingPass}}),a("v-card-text",{staticClass:"font-weight-light teal--text text--darken-4 py-0 mb-0"},[t._v("\n        The new password:\n        "),a("span",{staticClass:"font-weight-medium red--text"},[t._v(t._s(t.newPass))])]),a("v-card-actions",[a("v-spacer"),a("v-btn",{staticClass:"white--text",attrs:{color:"teal darken-2"},on:{click:function(e){return t.hideResetPasswordDialog()}}},[t._v("Ok")])],1)],1)],1)],1)},n=[],r=a("cebc"),i=(a("96cf"),a("3b8d")),o=a("1637"),l=a("2f62"),c={data:function(){return{search:"",confirmResetingPasswordDialog:!1,resetingPasswordDialog:!1,newPass:"Reseting ...",loadingPass:!0,loading:!0,confirmeDeleteDialog:!1,headers:[{text:"#",value:"index"},{text:"Activeness",value:"is_active"},{text:"First Name",value:"first_name"},{text:"Last Name",value:"last_name"},{text:"Email",value:"email"},{text:"Operations",value:"delete"}],agents:[],selectedAgentId:-1,snackbarContent:"",snackbarColor:"",snackbar:!1}},sockets:{onUserDeleted:function(t){this.removeDeletedUser(t.userId)},OnNewUserAdded:function(t){this.addNewUser(t.user[0])}},computed:{selectedUserFullName:function(){for(var t="",e=0;e<this.agents.length;e++)if(this.agents[e].id==this.selectedAgentId){t="".concat(this.agents[e].last_name.toUpperCase()," ").concat(this.agents[e].first_name);break}return t}},created:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:this.refrechAgentsList();case 1:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),methods:Object(r["a"])({},Object(l["c"])(["SHOW_SNACKBAR","TOGGLE_SB_VISIBILITY"]),{addNewUser:function(t){this.agents.push(t),this.SHOW_SNACKBAR({color:"success",content:"A new user was added, full name: ".concat(t.firstName," ").concat(t.lastName)})},removeDeletedUser:function(t){for(var e=0;e<this.agents.length;e++)if(this.agents[e].id==t){this.agents.splice(e,1);break}},confirmResetingPassword:function(t){this.selectedAgentId=t,this.confirmResetingPasswordDialog=!0},hideResetPasswordDialog:function(){this.resetingPasswordDialog=!1,this.newPass="Reseting ..."},refrechAgentsList:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,o["a"].getAgents().then(function(t){e.agents=t,e.loading=!1}).catch(function(t){e.$parent.showErrorSnackbar(t),e.loading=!1});case 2:case"end":return t.stop()}},t)}));function e(){return t.apply(this,arguments)}return e}(),showConfirmDeleteDialog:function(t){this.confirmeDeleteDialog=!0,this.selectedAgentId=t},cancelConfirmDeleteDialog:function(){this.confirmeDeleteDialog=!1,this.selectedAgentId=-1},deleteAgent:function(){var t=this;-1==this.selectedAgentId?this.$parent.showErrorSnackbar("Invalide agent id!"):o["a"].deleteAgentById(this.selectedAgentId).then(function(e){t.cancelConfirmDeleteDialog(),//! just to hide it
t.$parent.showSuccessSnackbar(e)}).catch(function(e){t.$parent.showErrorSnackbar(e),t.loading=!1})},resetAgentPassword:function(){var t=this;this.confirmResetingPasswordDialog=!1,this.resetingPasswordDialog=!0,-1!=this.selectedAgentId?o["a"].resetAgentPassword(this.selectedAgentId).then(function(e){t.loadingPass=!1,t.$parent.showSuccessSnackbar(e.data.success),t.newPass=e.data.password}).catch(function(e){t.$parent.showErrorSnackbar(e)}):this.$parent.showErrorSnackbar("No id is selected!!")}})},d=c,u=a("2877"),g=Object(u["a"])(d,s,n,!1,null,null,null);e["default"]=g.exports}}]);
//# sourceMappingURL=chunk-2d225433.3c261510.js.map