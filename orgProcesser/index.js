function addOrgFilter(e,t){t.comp&&t.formModel?t.$on("before-edit",function(e,t,o){setOrg(t),o()}):setTimeout(function(){addOrgFilter(e,t)},500)}function setOrg(e,t){var o=e.$refs[e._uiTemplateRef].getFormData()[e._orgField];t.setOrg(o)}export default{page:null,init(e,t,o){this.page=e;var n=this;for(var r in e._uiTemplateRef=t,e._orgField=o,e.$refs[t].$on("change",function(e,t,r){e===o&&this.$confirm("组织变化, 是否清空表单中的其它字段?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"info"}).then(()=>{n.cleanRefValue()}).catch(()=>{}),r()}),e.$refs)"ifbp-template"==e.$refs[r].$options._componentTag?addOrgFilter(e,e.$refs[r]):"ifbp-dynamic-panel"==e.$refs[r].$options._componentTag&&e.$refs[r].$on("before-edit",function(t,o,n,r){setOrg(e,n),r()})},cleanRefValue(){var e=this.page._uiTemplateRef,t=(this.page._orgField,this.page.$refs[e]);t.getFormComp()&&t.getFormComp().$children&&t.getFormComp().$children.forEach(function(e){e.$children[0]&&"el-ref"===e.$children[0].$options._componentTag&&t.setFormDataByField(e.prop,"")})}};