export default{data:function(){return{pageMixinAutoCreate:!0,ltktestlinshitijiao:"",pageMixinIfbpTemplates:[],pageMixinAllIfbpTemplates:[],pageMixinIfbpDynamicPanels:[],pageMixinAllIfbpDynamicPanels:[],pageMixinIfbpTemplatesSort:[]}},watch:{pageMixinIfbpTemplatesSort(){this.pageMixinIfbpTemplatesInit()}},mounted(){this.pageMixinGetAllTemplateAndDynamic()},destroyed(){},methods:{pageMixinGetAllTemplateAndDynamic(){let e=$(this.$el).find(".yon-uitemplate,.ifbp-dynamic-panel");this.pageMixinIfbpDynamicPanels=[],this.pageMixinIfbpTemplates=[],this.pageMixinAllIfbpTemplates=[],this.pageMixinAllIfbpDynamicPanels=[],this.pageMixinIfbpTemplatesSort=[];for(let i=0;i<e.length;i++){let t=e[i].__vue__;try{"ifbp-dynamic-panel"===t.$vnode.componentOptions.tag?(t.$on("dynamic-data-change",this.pageMixinDynamicDataChange),this.pageMixinIfbpDynamicPanels.push(t),this.pageMixinAllIfbpTemplates.push(null),this.pageMixinAllIfbpDynamicPanels.push(t),this.pageMixinIfbpTemplatesSort=this.pageMixinIfbpTemplatesSort.concat(t.getIfbpTemplates())):"ifbp-template"===t.$vnode.componentOptions.tag&&(this.pageMixinIfbpTemplates.push(t),this.pageMixinAllIfbpTemplates.push(t),this.pageMixinAllIfbpDynamicPanels.push(null),this.pageMixinIfbpTemplatesSort.push(t),t.$on("after-create",this.pageMixinTemplateAfterCreated))}catch(e){}}},pageMixinTemplateAfterCreated(e){this.pageMixinIfbpTemplatesInit()},pageMixinDynamicDataChange(){this.pageMixinDynamicDataChangeTimeout&&this.clearTimeout(this.pageMixinDynamicDataChangeTimeout),this.pageMixinDynamicDataChangeTimeout=setTimeout(()=>{this.pageMixinDynamicDataChangeFun()},100)},pageMixinDynamicDataChangeFun(){this.pageMixinIfbpTemplatesSort=[];for(let e=0;e<this.pageMixinAllIfbpTemplates.length;e++)this.pageMixinAllIfbpTemplates[e]?this.pageMixinIfbpTemplatesSort.push(this.pageMixinAllIfbpTemplates[e]):this.pageMixinAllIfbpDynamicPanels[e]&&(this.pageMixinIfbpTemplatesSort=this.pageMixinIfbpTemplatesSort.concat(this.pageMixinAllIfbpDynamicPanels[e].getIfbpTemplates()))},pageMixinIfbpTemplatesInit(){this.pageMixinIfbpTemplatesInitTimeout&&clearTimeout(this.pageMixinIfbpTemplatesInitTimeout),this.pageMixinIfbpTemplatesInitTimeout=setTimeout(()=>{this.pageMixinIfbpTemplatesInitFun()},200)},pageMixinIfbpTemplatesInitFun(){for(let e=0;e<this.pageMixinIfbpTemplatesSort.length;e++){let i=this.pageMixinIfbpTemplatesSort[e];if(!i.hasInit()&&(console.log("init fun 22:"+i.tplId+":time-"+((new Date).getTime()-window.beforeCreate)),i.init(),e>0))return}}}};