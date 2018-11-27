<template>
    <!-- 新增模板 Dialog -->
    <el-dialog :title='title' :before-close="btnCancel" :visible="showDialog" size="tiny">
        <el-form ref="assignFormRef" :model="assignFormData" label-width="100px" v-if='optionData.length > 0'>
            <el-form-item label="环节与指派">
                <el-input placeholder="请输入内容" v-model="inputVal" :editable="false"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="assignFormData.designate" multiple placeholder="请选择">
                    <el-option
                        v-for="item in optionData"
                        :label="item.name"
                        :value="item.pk_user"
                        :key="item.pk_user"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <ifbp-form-button-area>
            <el-button type="primary" @click='btnConfirm'>确定</el-button>
            <el-button  @click="btnCancel">取消</el-button>
        </ifbp-form-button-area>
    </el-dialog>
</template>
<script>
  export default {
    name: 'assignsubmit',
    //title:弹窗的标题
    props: {
        billType:{
            type:String,
            default:''
        },
        billId:{
            type:String,
            default:''
        },
        title:{
            type:String,
            default:"提交单据"
        }
    },
    data(){
        return{
            showDialog:false,
            assignFormData:{
                designate:[]
            },
            optionData:[],
            inputVal:''
        }
    },
    methods: {
        showAssignDialog(){
            this.$nextTick(()=>{
                if(this.billType !== '' && this.billId !== ''){
                    this.request();
                }
            });
        },
        request(){
            var vm = this;
            let requestUrl = '/riart/fbpworkflows/assignsubmit';
            vm.$http({
            url: requestUrl,
            method: 'post',
            data: {
                billType: vm.billType,
                billId: vm.billId
            },
            dataType: 'json'
            }).then((res) => {
                debugger;
                if (res.data.status === true) {
                    if(res.data.data){
                        let getData = res.data.data;
                        vm.inputVal = getData[0].activityDesc;
                        vm.optionData = getData[0].allUsers;
                    }
                    vm.showDialog=true;
                } else {
                    vm.$message.error(res.data.msg);
                }
            }).catch((e) => {
                vm.$message.error('操作异常');
            });
        },
        btnConfirm(){
            debugger;
            let requestUrl = '/riart/fbpworkflows/dosubmit';
            this.$http({
            url: requestUrl,
            method: 'post',
            data: {
                billType: this.billType,
                billId: this.billId,
                param: this.assignFormData.designate
            },
            dataType: 'json'
            }).then((res) => {
                debugger;
                if (res.data.status === true) {
                    this.showDialog=false;
                    this.$emit("callBack");
                    this.btnCancel();
                    this.$message({
                        message: "提交成功！",
                        type: "success"
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
            }).catch((e) => {
                this.$message.error('操作异常');
            });
        },
        btnCancel(){
            this.showDialog=false;
            this.assignFormData.designate=[];
        },
    }
  };
</script>