(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{1559:function(e,t,r){var content=r(1561);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(25).default)("15e36496",content,!0,{sourceMap:!1})},1560:function(e,t,r){"use strict";var n=r(1559);r.n(n).a},1561:function(e,t,r){(t=r(24)(!1)).push([e.i,".v-card[data-v-606496de]{background-color:unset!important}",""]),e.exports=t},1562:function(e,t,r){"use strict";r(20),r(15),r(12),r(6),r(16);var n=r(2),o=r(85);function c(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var d=r(13).Unit,v={props:{campaign:{type:Object}},data:function(){return{pledgeDialog:!1}},computed:l({},Object(o.c)(["getSumPledges","getRedemptionTxId","getUsernameByOwnerId"])),methods:l(l({},Object(o.b)(["fetchDocuments"])),{},{DuffsinDash:function(e){return d.fromSatoshis(e).toBTC()},viewCampaign:function(e){this.$router.push("/project/view/"+e)},progressPledges:function(e){return parseInt(this.getSumPledges(e.$id))/parseInt(this.campaign.amount)*100}})},f=(r(1560),r(92)),m=r(114),O=r.n(m),y=r(1556),h=r(373),w=r(136),j=r(1551),_=r(1558),P=r(376),C=r(1553),component=Object(f.a)(v,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("v-card",{staticClass:"mx-auto",staticStyle:{"background-color":"unset !important"},attrs:{"max-width":"1000"},on:{click:function(t){return e.viewCampaign(e.campaign.$id)}}},[e.getRedemptionTxId(e.campaign.$id)?r("v-alert",{staticClass:"ma-2",attrs:{color:"cyan",outlined:"",icon:"mdi-balloon"}},[r("strong",[e._v("Congratulations!")]),e._v(" This Project is successfully funded!\n    ")]):e._e(),e._v(" "),r("v-container",[r("v-row",[r("v-col",[r("v-card",{staticClass:"mx-5",attrs:{elevation:"0","min-height":"155"}},[r("v-card-subtitle",{staticClass:"mb-0 py-0"},[e._v("\n              "+e._s(e.getUsernameByOwnerId(e.campaign.$ownerId))+"\n            ")]),e._v(" "),r("v-card-title",{staticClass:"pledged mt-0 pt-0"},[e._v("\n              "+e._s(e.campaign.title)+"\n            ")]),e._v(" "),r("v-card-text",{staticStyle:{"font-size":"20px","font-weight":"500px"}},[e._v("\n              "+e._s(e.campaign.description)+"\n            ")])],1)],1),e._v(" "),r("v-col",[r("v-progress-linear",{staticClass:"mt-5",attrs:{height:"18",color:"cyan",striped:"",value:e.progressPledges(e.campaign)}}),e._v(" "),r("div",[r("div",{staticClass:"pledgedtext"},[e._v("\n              backed\n              "),r("span",{staticClass:"pledged"},[e._v("\n                "+e._s(e.DuffsinDash(e.getSumPledges(e.campaign.$id)))+" Dash\n              ")])]),e._v(" "),r("div",{staticClass:"pledgedtext"},[e._v("\n              goal\n              "),r("span",{staticClass:"pledged"},[e._v("\n                "+e._s(e.DuffsinDash(e.campaign.amount))+" Dash\n              ")]),e._v(" "),r("span")])])],1)],1)],1)],1)],1)}),[],!1,null,"606496de",null);t.a=component.exports;O()(component,{VAlert:y.a,VCard:h.a,VCardSubtitle:w.b,VCardText:w.c,VCardTitle:w.d,VCol:j.a,VContainer:_.a,VProgressLinear:P.a,VRow:C.a})},1574:function(e,t,r){"use strict";r.r(t);r(20),r(15),r(12),r(6),r(16),r(91);var n=r(17),o=r(2),c=r(85),l=r(1562);function d(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function v(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var f={props:{pledge:{type:Object,default:function(){}}},data:function(){return{isRevoking:!1,isRevoked:!1}},computed:v({},Object(c.c)(["getDocumentById"])),created:function(){return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)})))()},methods:v(v({},Object(c.b)(["revokePledge"])),{},{showCampaignName:function(e){return this.getDocumentById(e.campaignId)||e.$id},revokePledgeWrapper:function(e){var t=this;return Object(n.a)(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return t.isRevoking=!0,console.log("revoke pledge :>> ",e),r.next=4,t.revokePledge(e);case 4:t.isRevoking=!1,t.isRevoked=!0;case 6:case"end":return r.stop()}}),r)})))()}})},m=r(92),O=r(114),y=r.n(O),h=r(377),w=r(373),j=r(136),_=r(1551),P=r(374),C=r(1553),component=Object(m.a)(f,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-card",{attrs:{nuxt:"",to:"/project/view/"+e.pledge.campaignId}},[e.isRevoked?r("v-overlay",{attrs:{absolute:"",color:"#949494"}}):e._e(),e._v(" "),r("v-row",{attrs:{justify:"space-between"}},[r("v-col",{attrs:{cols:"7"}},[r("v-card-title",{staticStyle:{"font-weight":"normal","font-size":"26px"}},[e._v("\n        "+e._s(e.showCampaignName(e.pledge).title))])],1),e._v(" "),r("v-col",{attrs:{cols:"3","align-self":"center"}},[r("v-card-title",{staticClass:"pledged"},[e._v(e._s(e.pledge._dash)+" Dash ")])],1),e._v(" "),r("v-col",{attrs:{cols:"2","align-self":"center"}},[r("v-btn",{attrs:{loading:e.isRevoking,disabled:e.isRevoked,color:"cyan",dark:!e.isRevoked,"align-self":"end"},on:{click:function(t){return t.preventDefault(),e.revokePledgeWrapper(e.pledge)}}},[e._v("Revoke")])],1)],1)],1)}),[],!1,null,null,null),k=component.exports;function x(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function D(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?x(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):x(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}y()(component,{VBtn:h.a,VCard:w.a,VCardTitle:j.d,VCol:_.a,VOverlay:P.a,VRow:C.a});var R={components:{listCard:l.a,MyBacking:k},data:function(){return{}},computed:D({},Object(c.c)(["getCampaigns","getCampaignPledges","getUserPledges","getDocumentById"])),created:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.fetchDocuments({typeLocator:"springboard.campaign",queryOpts:{orderBy:[["$createdAt","desc"]]}});case 2:console.log("show cache",e.getUserPledges);case 3:case"end":return t.stop()}}),t)})))()},methods:D(D({},Object(c.b)(["fetchDocuments","revokePledge"])),{},{revokePledgeWrapper:function(e){console.log("revoke pledge :>> ",e),this.revokePledge(e)},showUserCampaigns:function(){var e=this;if(!this.$store.state.identityId)return"";var t=this.getCampaigns.filter((function(t){return t.$ownerId===e.$store.state.identityId}));return console.log("myCampaigns",t),t}})},V=Object(m.a)(R,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"mx-auto",staticStyle:{"max-width":"1000px"}},[r("v-row",[r("v-col",{attrs:{cols:"12"}},[r("span",{staticStyle:{"font-size":"24px","font-weight":"1100px"}},[e._v("My Backings")])])],1),e._v(" "),e._l(e.getUserPledges,(function(e){return r("MyBacking",{key:e.$id,attrs:{pledge:e}})})),e._v(" "),r("v-row",{staticClass:"mt-12"},[r("v-col",{attrs:{cols:"12"}},[r("span",{staticStyle:{"font-size":"24px","font-weight":"1100px"}},[e._v("My Projects")])])],1),e._v(" "),r("v-row",[r("v-col",{staticClass:"pt-0",attrs:{cols:"12"}},e._l(e.showUserCampaigns(),(function(t,i){return r("v-card",{key:i,staticClass:"mt-1",on:{click:function(r){return e.$router.push("/project/view/"+t.$id)}}},[r("listCard",{attrs:{campaign:t}})],1)})),1)],1)],2)}),[],!1,null,null,null);t.default=V.exports;y()(V,{VCard:w.a,VCol:_.a,VRow:C.a})}}]);