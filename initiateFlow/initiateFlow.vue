<template>
    <!-- 流程部分 -->
    <div class="list-panel1" v-if="approvalComponent">
      <!-- 流程步骤 -->
        <div class="step fl">
          <div style="position: relative;">
            <el-steps :space="286" :active="3">
              <!-- 第一步 -->
              <el-step v-if='listData.length > 0' class="first-step">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="firstStep" placement="top">
                        <span>[{{listData[0].activeName}}]{{listData[0].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[0].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip class="item" effect="normal" :content="listData[0].deleteReason" placement="top">
                      <p class="titleAction"><span>{{listData[0].deleteReason}}</span></p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-more" style="cursor: pointer;" @mouseover="handleMouseover" @mouseout="handleMouseout"></div>
                  </div>
              </el-step>

              <!-- 没审批结束的第二步骤(非同意) -->
              <el-step v-if='isNext && listData.length > 0 && !isEnd && listData[listData.length-1].deleteReason != "同意" && listData[listData.length-1].deleteReason != "驳回"' class="second-step">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip 
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-1].messagenote" 
                      :disabled="listData[listData.length-1].messagenote ? false : true"
                      placement="top">
                      <p class="titleAction"><span>{{listData[listData.length-1].deleteReason}}</span> {{listData[listData.length-1].messagenote}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-edit"></div>
                  </div>
              </el-step>

              <!-- 没审批结束的第二步骤(驳回) -->
              <el-step v-if='isNext && listData.length > 0 && !isEnd && listData[listData.length-1].deleteReason != "批准" && listData[listData.length-1].deleteReason == "驳回"' class="second-step second-step-reject">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime }}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip
                      class="item"
                      effect="normal"
                      :content="listData[listData.length-1].messagenote"
                      :disabled="listData[listData.length-1].messagenote ? false : true"
                      placement="top">
                      <p class="titleAction"><span>{{listData[listData.length-1].deleteReason}}</span> {{listData[listData.length-1].messagenote}}</p>
                    </el-tooltip>
                    <!-- 驳回图标 -->
                    <div class="titleNumber ifbp-icon-undo"></div>
                  </div>
              </el-step>

              <!-- 没审批结束的第二步骤(同意) -->
              <el-step v-if='isNext && listData.length > 0 && !isEnd && listData[listData.length-1].deleteReason == "同意"' class="second-step-agree">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip 
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-1].messagenote" 
                      :disabled="listData[listData.length-1].messagenote ? false : true"
                      placement="top">
                      <p class="titleAction"><span>{{listData[listData.length-1].deleteReason}}</span> {{listData[listData.length-1].messagenote}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-check"></div>
                  </div>
              </el-step>
              

               <!-- 审批结束的第二步骤(同意) -->
              <el-step 
                v-if='isNext && listData.length > 0 && isEnd && listData[listData.length-2].deleteReason == "同意"'
                class="agree-status second-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStepAgree" placement="top">
                        <span>[{{listData[listData.length-2].activeName}}]{{listData[listData.length-2].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-2].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip  
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-2].messagenote"
                      :disabled="listData[listData.length-2].messagenote ? false : true" 
                      placement="top">
                      <p class="titleAction"><span>{{listData[listData.length-2].deleteReason}}</span> {{listData[listData.length-2].messagenote}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-check"></div>
                  </div>
              </el-step>

               <!-- 审批结束的第二步骤(不同意，拒绝) -->
              <el-step 
                v-if='isNext && listData.length > 0 && isEnd && (listData[listData.length-2].deleteReason == "拒绝" || listData[listData.length-2].deleteReason == "不同意" )'
                class="refuse-status refuse-second-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStepAgree" placement="top">
                        <span>[{{listData[listData.length-2].activeName}}]{{listData[listData.length-2].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-2].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip  
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-2].messagenote"
                      :disabled="listData[listData.length-2].messagenote ? false : true" 
                      placement="top">
                      <p class="titleAction"><span>{{listData[listData.length-2].deleteReason}}</span> {{listData[listData.length-2].messagenote}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-close"></div>
                  </div>
              </el-step>

              <!-- 审批结束的第二步骤(驳回) -->
              <el-step
                v-if='isNext && listData.length > 0 && isEnd && listData[listData.length-2].deleteReason == "驳回"'
                class="refuse-status refuse-second-status reject-second-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStepAgree" placement="top">
                        <span>[{{listData[listData.length-2].activeName}}]{{listData[listData.length-2].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-2].startTime }}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip
                      class="item"
                      effect="normal"
                      :content="listData[listData.length-2].messagenote"
                      :disabled="listData[listData.length-2].messagenote ? false : true"
                      placement="top">
                      <p class="titleAction"><span>{{listData[listData.length-2].deleteReason}}</span> {{listData[listData.length-2].messagenote}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-undo"></div>
                  </div>
              </el-step>

               <!-- 没审批结束最后一步 -->
              <el-step v-if='!isEnd' class="end-false">
                  <div slot="description">
                    <el-tooltip class="item" effect="normal" :content="waitApproves.join()" placement="top">
                      <p class="waitAction">
                        <a>待：</a>
                        <span>{{waitApproves.join()}}</span>
                        <a>处理</a>
                      </p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-edit"></div>
                  </div>
              </el-step>

               <!-- 审批结束最后一步(同意) -->
              <el-step 
                v-if='isEnd && listData.length > 0 && listData[listData.length-1].deleteReason == "同意"'
                class="agree-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip 
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-1].messagenote"
                      :disabled="listData[listData.length-1].messagenote ? false : true" 
                      placement="top">
                      <p class="titleAction"><span>{{listData[listData.length-1].deleteReason}}</span> {{listData[listData.length-1].messagenote}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-check"></div>
                  </div>
              </el-step>

              <!-- 审批结束最后一步(拒绝，不同意，驳回) -->
              <el-step 
                v-if='isEnd && listData.length > 0 && (listData[listData.length-1].deleteReason == "拒绝" || listData[listData.length-1].deleteReason == "不同意")'
                class="refuse-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip 
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-1].messagenote"
                      :disabled="listData[listData.length-1].messagenote ? false : true" 
                      placement="top">
                      <p class="titleAction"><span>{{listData[listData.length-1].deleteReason}}</span> {{listData[listData.length-1].messagenote}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-close"></div>
                  </div>
              </el-step>

              <!-- 审批结束最后一步(驳回) -->
              <el-step
                v-if='isEnd && listData.length > 0 && listData[listData.length-1].deleteReason == "驳回"'
                class="refuse-status reject-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip
                      class="item"
                      effect="normal"
                      :content="listData[listData.length-1].messagenote"
                      :disabled="listData[listData.length-1].messagenote ? false : true"
                      placement="top">
                      <p class="titleAction"><span>{{listData[listData.length-1].deleteReason}}</span> {{listData[listData.length-1].messagenote}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-undo"></div>
                  </div>
              </el-step>
            </el-steps>
          </div>
        </div>  
      <!-- 按钮 -->
      <div class="fl" v-if="this.params.showBtn != false || this.params.showBtn == undefined" style="margin-top:36px;margin-left:2px;">
        <!-- 待办任务不能有撤回按钮 -->
        <!-- <ul class="btnLists" v-if="this.params.stateFlage != 'his' && !isEnd && isAgree"> -->
        <ul class="btnLists" v-if=" !isEnd">
          <li v-for="item in consentBtn" :key="item.key">
            <el-button v-if="item.key!='assignAble'" type="primary" @click="clickButton(item.key)">{{item.value}}</el-button>
          </li>
          <li v-for="item in defaultBtn" :key="item.key">
            <el-button v-if="item.key!='assignAble'" @click="clickButton(item.key)">{{item.value}}</el-button>
          </li>
          <li v-show="hiddenBtn.length > 0" class="more-btn">
            <el-dropdown menu-align="start">
              <el-button class="ifbp-icon-more btn-more">
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in hiddenBtn" :key="item.key" @click.native="clickButton(item.key)">{{item.value}}</el-dropdown-item>
                <!--<el-dropdown-item @click.native="checkFlow">查看流程图</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>

        <!-- 会签任务,待认领,已办(全部流程结束或者下一个环节处理完),抄送的任务只显示查看流程图按钮 -->
		  <!--
        <ul v-else-if="this.params.stateFlage == 'copyFor' ||
                      this.params.stateFlage == 'claim' ||
                      (this.params.stateFlage == 'his' && (this.endActivityId || (!this.endActivityId && this.beenProcessed ))) ||
                      (this.params.stateFlage == 'todo' && ((this.endActivityId && (this.action == 'refuse' || this.action == 'reject')) || (!this.endActivityId && this.beenProcessed )))" 
            style="height: 85px">
          <el-button type="primary" @click="checkFlow" style="margin-left: 10px;">查看流程图</el-button>
        </ul>

        <ul v-else style="height: 85px">
          <el-button type="primary" @click="checkFlow" style="margin-left: 10px;">查看流程图</el-button>
          <el-button type="primary" @click="revocation" style="margin-left: 10px;">撤回</el-button>
        </ul>-->
      </div>
      <!-- 提交下拉 -->
      <div class="statusLists" v-show="isHiddenList" style="background: #fff">
        <a></a>
        <!-- 小三角 -->
        <span class="triangle"></span>
        <ul>
          <li v-for="(item,index) in listData" :key="item.startTime" style="min-width:390px;">
            <em>{{index+1}}</em>
            <div class="div-content">
              <strong>[{{item.activeName}}]</strong>
              <span style="font-size: 16px; color: #333;">{{item.userName}}</span>
              <div style="float: right; margin-left: 10px; font-size: 12px; color: #888; display: inline-block">{{item.startTime}}</div>
            </div>
            <p>
              <!--<span v-for="v in item.messagenote" :key="v" style="display: block">{{v}}</span>-->
	          <span style="display: block">{{item.deleteReason}}:{{item.messagenote}}</span>
            </p>
          </li>
        </ul>
      </div> 

      <!-- 弹框 -->
      <div>
        <el-dialog :title="defaultMap[this.action]" v-model="dialogFormVisible" size="tiny">
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </div>
          <template v-if="action === 'rejectAble'">
            <el-form label-position="left">
              <el-form-item label="审批意见：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
              </el-form-item>
              <el-form-item label="驳回到：" :label-width="formLabelWidth">
                <el-select v-model='rejectTo' placeholder="请选择节点">
                  <el-option
                    v-for="node in nodeList"
                    :key="node.value"
                    :label="node.key"
                    :value="node.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
          <template v-else-if="action === 'assignAble'">
            <el-form label-position="left">
              <el-form-item label="审批意见：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
              </el-form-item>
              <el-form-item label="人员：" :label-width="formLabelWidth">
                <el-ref :is-muti-select="true"
                        :ref-code="refcode"
                        :field="field"
                        :template-value="refTemplateValue"
                        width="300px"
                        :editable="isEdit"
                        placeholder="请选择人员">
                </el-ref>
              </el-form-item>
            </el-form>
          </template>
          <template v-else-if="action === 'refuseAble'">
            <el-form label-position="left">
              <el-form-item label="审批意见：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
              </el-form-item>
            </el-form>
          </template>

          <template v-else-if="action === 'agreeAble'">
            <el-form label-position="left" v-if="assignstatus">
              <el-form-item label="环节与指派：" :label-width="formLabelWidth" v-show="designateList.length">
                <el-ref :is-muti-select="true"
                        :ref-code="refcode"
                        :field="field"
                        :template-value="refTemplateValue"
                        width="300px"
                        :editable="isEdit"
                        placeholder="请选择">
                </el-ref>
              </el-form-item>
            </el-form>
	          <el-form label-position="left">
              <el-form-item label="审批意见：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="opinion" :rows="2" placeholder="同意"></el-input>
              </el-form-item>
            </el-form>
          </template>
          <template v-else-if="action === 'addsignAble'||action === 'delegateAble'" class="addsign">
            <el-form label-position="left">
              <el-form-item label="人员：" :label-width="formLabelWidth">
                <el-ref :is-muti-select="true"
                        :ref-code="refcode"
                        :field="field"
                        :template-value="refTemplateValue"
                        width="300px"
                        :editable="isEdit"
                        placeholder="请选择">
		            </el-ref>
              </el-form-item>
            </el-form>
          </template>
        </el-dialog>
        <el-dialog
          v-model="dialogVisible" size='full'>
          <div style="height: 1000px">
            <iframe :src="flowUrl" frameborder="0" style="width: 100%;height: 100%;"></iframe>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="提示"
          v-model="isHidRevocation"
          size="tiny">
          <span>确定收回单据？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isHidRevocation = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </span>
        </el-dialog>
	      <el-dialog
          title="提示"
          v-model="dialogCancelApprove"
          size="tiny">
          <span>确定要执行取消审批？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogCancelApprove = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </span>
        </el-dialog>
      </div>     
    </div>
</template>

<script>
export default {
  name: 'IfbpInitiateFlow',
  data() {
    return {
      // 审批组件
      approvalComponent: true,
      // 审批历史
      historicalApproval: [],
      // 任务结束标志
      endActivityId: '',
      // 历史记录
      historicalRecords: [],
      // 索引
      indexKey: '',
      // 下环节是否被处理
      beenProcessed: false,
      isHidRevocation: false,
      designateList: [],
      remoteUserId: "",
      dialogVisible: false,
      flowUrl: "",
      isAgree: true,
      author: "",
      isNext: false,
      isEnd: false,
      waitApproves: [],
      titleNumber: "...",
      isSponsor: false,
      params:{
          billId:this.billId,
          billType:this.billType,
          agentuserId:this.agentuserId,
          showBtn : this.showBtn,
          passValue : this.passValue,
		      stateFlage : this.stateFlage
        },
      params_01: {},
      assignstatus : false,     
      refcode: "alluserRef",
      field: "refcode",
      isEdit: true,
      refTemplateValue: {},
      pk: "",
      isifr: false,
      action: "",
      linkIframe: "",
      opinion: "",
      rejectTo: "",
      userId: "",
      nodeList: [],
      personList: [],
      isHiddenList: false,
      approveUrl: "",
      listData: [],
      isShowBtn:false,
      btnLists: [
        {
          value: "批准",
          key: "agreeAble",
		      show:false
        },
        {
          value: "驳回",
          key: "rejectAble",
		      show:false
        },
        {
          value: "委派",
          key: "weipaiAble",
		      show:false
        },
        {
          value:"加签",
          key:"addsignAble",
          show:false	
        },
        {
          value:"改派",
          key:"delegateAble",
          show:false
        },
        {
          value:"拒绝",
          key:"refuseAble",
          show:false
        }
      ],
      defaultBtn:[],
      hiddenBtn:[],
      consentBtn:[],
      multiinstanceModel:'',
      btnValue:'',
      dialogCancelApprove:false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      defaultMap: {
        assignAble: "指派",
        weipaiAble: "委派",
        rejectAble: "驳回",
        delegateAble: "改派",
        addsignAble: "加签",
        agreeAble: "批准",
        refuseAble: "拒绝",
	      recallAble:"收回"
      },
      formLabelWidth: "96px"
    };
  },
  computed:{
    firstStep(){
      return '[' + this.listData[0].activeName + ']' + this.listData[0].userName;
    },
    secondStep(){
      return '[' + this.listData[this.listData.length-1].activeName + ']' + this.listData[this.listData.length-1].userName;
    },
    secondStepAgree(){
      return '[' + this.listData[this.listData.length-2].activeName + ']' + this.listData[this.listData.length-2].userName;
    },
  },
  props:{
        billId:{type:String},
        billType:{type:String},
        agentuserId:{type:String},
        showBtn:{type:Boolean},
        passValue:{type:Boolean},
	      stateFlage:{type:String}
  },
  methods: {
    // 页面刷新事件
    reload(){
      this.approvalComponent = false;
      this.$nextTick(()=>{
        this.approvalComponent = true;
      });
    },
    // 提交的移入移出事件
    handleMouseover(){
      this.isHiddenList = true;
    },
    handleMouseout(){
      this.isHiddenList = false;
    },
    //撤回确定事件
    sureRevocation() {
      //let url = window.location.hash.substring(1).replace('stateFlage=his','stateFlage=todo');
      var vm = this;
      var params = {
        taskId: this.params.task_id,
        processInstanceId: this.params.processInstanceId,
        processKey: this.params.processKey,
        businessKey: this.params.businessKey,
        activityId: this.params.activityId,
      };
      this.$http({
        url: "/ifbp-bpm-service/proc/withdraw",
        method: "get",
        params: params
      }).then(res => {
          if (res.data.success) {
            vm.params.task_id = res.data.map.value.id;
            this.$message({
              message: "撤回成功！",
              type: "success"
            });
//            this.$router.push(url);
            vm.isAgree = true;
            this.requestHistory();
            //让默认按钮和同意按钮清空，重新调接口赋值
            this.defaultBtn = [];
            this.consentBtn = [];
            this.hiddenBtn = [];
            this.requestAction();
          } else {
            vm.$message({
              message: res.data.errorMessage,
              type: "error"
            });
          }
        this.isHidRevocation = false;
      }).catch(e => {
          this.$message.error(e);
      });
      this.$emit('afterAction','withDraw');
    },
    revocation() {
      this.isHidRevocation = true;
    },

    checkFlow() {
      // this.dialogVisible=true;
      this.flowUrl =
        "/ifbp-bpm-service/static/vendor/diagram-viewer/index.html?processDefinitionId=" +
        this.params.processDefinitionId +
        "&processInstanceId=" +
        this.params.processInstanceId;
      window.open(this.flowUrl);
    },
    requestPerson() {
      this.$http({
        url: "/riart/fbpworkflows/users"
      }).then(res => {
        var newList = res.data.data;
        // 将取到的值处理一下
        var curList = [];
        newList.forEach(item => {
          var obj = {
            key: item.name,
            value: item.userid
          };
          curList.push(obj);
        });
        this.personList = curList;
      });
    },
    requestAction() {
      var vm = this;
      vm.$http({
        url:
          "/riart/fbpworkflows/operation/" +
          vm.params.billType +
          "/" +
          vm.params.billId,
        method: "get"
      }).then(res => {
        var curArr = res.data.data;
        var btnOrder = {
	        cancelApprove:1,
          agreeAble: 2,
          refuseAble: 3,
          rejectAble: 4,
          assignAble: 5,
          delegateAble: 6,
          addsignAble: 7
        };
        var curList = [];
        curArr.forEach(action => {
          if(action.show){
            if(action.op === 'assignAble'){
              vm.assigntatus = true;
              action.show = false;
            }
            curList.push({
              key: action.op,
              value: action.text ? action.text : vm.defaultMap[action.op],
              show:action.show,
              });
            }
        });
        curList.sort((a, b) => btnOrder[a.key] > btnOrder[b.key]);
        vm.btnLists = curList;
        let temporary = [];
        vm.defaultBtn = [];
        vm.consentBtn = [];
        vm.hiddenBtn = [];
        curList.forEach((item,index)=>{
          if(item.key == "agreeAble" || item.key == "rejectAble" || item.key == "refuseAble"){
            if(item.key == "agreeAble"){
              vm.consentBtn.push(item);
            }else{
              vm.defaultBtn.push(item);
            }
          }else{
            temporary.push(item);
          }
        });
        temporary.forEach(item=>{
          if(item.key != "assignAble"){
            vm.hiddenBtn.push(item);
          }
        });
      });
    },
    getAssignment() {
      var vm = this;
      var params = {
        taskId: this.params.task_id
      };
      this.$http({
        url: "/ifbp-bpm-service/task/assign-checking",
        method: "get",
        params: params
      }).then(res => {
          if (res.data.status) {
            vm.designateList = res.data.data.assignInfoItems;
            vm.designateList.forEach(function(item, index) {
              vm.$set(item, "participants_01", []);
              item.participants_02 = [];
            });
          } else {
            
          }
        }).catch(() => {
          // this.$message.error("去掉代理失败");
        });
    },
    requestHistory() {
      this.historyData = [];
      var vm = this;
      this.$http({
        url: "/riart/fbpworkflows/approval-detail/"+ this.params.billType +"/"+ this.params.billId,
        method: "get"
      }).then(res => {
        if (res.data.status === true) {	  
           	if(!res.data.data ) {
	       		  this.$message.error('没有查到审批纪录');
	    	    }else{	    
	            vm.historicalRecords = res.data.data.historicTasks;
	            vm.endActivityId = res.data.data.endActivityId;
	            // 找到当前环节在审批历史中的位置
	            vm.historicalRecords.forEach((item,i)=>{
	              if(item.id == this.$route.query.task_id){
	                this.indexKey = i;
	              }
	            });
	            // 判断当前环节是不是最后环节
	            if(vm.historicalRecords.length == this.indexKey){
	              this.beenProcessed = true;
	            }else{
	              //let jointlySign = vm.historicalRecords[this.indexKey].activity.properties.multiinstanceModel;
	              // 不是最后环节,判断此环节是不是会签
	              //if( jointlySign == "Sign" || jointlySign == "Sequential"){
	              //  this.beenProcessed = true;
	              //}else{
	              //  if(vm.historicalRecords[this.indexKey].deleteReason != null && (vm.historicalRecords[this.indexKey].deleteReason.indexOf('refuse') != -1 || vm.historicalRecords[this.indexKey].deleteReason.indexOf('reject') != -1)){
	              //    this.beenProcessed = true;
	              //  }
	              // 下一环节处理了,无撤回按钮
	              //  if(vm.historicalRecords[this.indexKey + 1] && vm.historicalRecords[this.indexKey + 1].deleteReason != null){
	              //    this.beenProcessed = true;
	              //  }
	              }
	            }
	            vm.listData = [];
//	          vm.waitApproves = [];
              vm.isEnd = res.data.data.end;
	            var hisData = res.data.data.historicTasks;
	            //this.multiinstanceModel = hisData[hisData.length-1].activity.properties.multiinstanceModel;
	            var Time = res.data.data.startTime;
	            // 获取第一环节代理人
	                vm.listData.push({
	                  deleteReason: "提交",
	                  userName: res.data.data.userName,
	                  activeName: res.data.data.activeName,
	                  startTime: Time,
	                  compareTime: Time,
			              messagenote : "提交",
	                });
	                // 获取除了第一环节的代理人
	                hisData.forEach(function(item, index) {
	                      // 获取审批意见(将英文转为中文)
	                      var deleteReason = "";
                        var messagenote = "";
	                      if (item.deleteReason == "completed") {
	                        deleteReason = "同意";
                          messagenote = item.messagenote;
	                      } else if (item.deleteReason == "jumpToActivity") {
	                        deleteReason = "驳回";
                          messagenote = item.messagenote;
	                      }else if (item.deleteReason == "Inefficient") {
	                        deleteReason = "无效";
                          messagenote = "作废";
	                      } else if (item.deleteReason == "ACTIVITI_DELETED") {
	                        deleteReason = "驳回并中止";
                          messagenote = item.messagenote;
	                      } else if (item.deleteReason == "withdraw") {
	                        deleteReason = "审批后撤回";
                          messagenote = "不同意";
	                      } else if (item.deleteReason == "jump") {
	                        deleteReason = "调整";
                          messagenote = item.messagenote;
	                      } else if (item.deleteReason == "stop") {
	                        deleteReason = "终止";
                          messagenote = item.messagenote;
	                      } else if (item.deleteReason == "refuse") {
	                        deleteReason = "拒绝";
                          messagenote = item.messagenote;
	                      } else if (item.deleteReason && item.deleteReason.indexOf("reject") >= 0) {
	                        deleteReason = "驳回";
                          messagenote = item.messagenote;
	                      } else if (item.deleteReason == "deleted" || item.deleteReason == "Delete" || item.deleteReason == "delete") {
	                        deleteReason = "删除";
                          messagenote = item.messagenote;
	                      } else if (item.deleteReason == null) {
	                        deleteReason = "待审批";
                          messagenote = "";
	                      } else {
	                        deleteReason = "未知:" + item.deleteReason;
                          messagenote = item.messagenote;
	                      }

	                      // 时间处理
	                      var curTime;
	                      if (item.endTime) {
	                        curTime = item.endTime;
	                      } else {
	                        curTime = " ";
	                      }

	                      // 处理历史记录信息
	                      //var message;
	                      //if (item.taskComments) {
	                      //  if (item.taskComments[0]) {
	                      //    message = item.taskComments[0].message;
	                      //  } else {
	                      //    message = " ";
	                      //  }
	                      //} else {
	                      //  message = "";
	                      //}
	                      // 审批历史记录
	                      if (deleteReason != "删除" && deleteReason != "待审批" && deleteReason != "审批后撤回") {
	                        vm.listData.push({
	                          deleteReason: deleteReason,
				                    messagenote:messagenote,
	                          userName: item.check_userName,
				                    startTime:item.endDate,
	                          activeName: item.activeName,
	                          startTime: curTime,
	                          compareTime: curTime,
	                          //message: message,
	                          //taskDispearFlag: item.taskDispearFlag,
	                        });
	                      } else if (deleteReason == "待审批") {
                          vm.waitApproves = [];
	                        var user = "";
	                        user = "[" + item.activeName + "]" + item.check_userName;                          
	                        vm.waitApproves.push(user);
	                      } else if (deleteReason == "审批后撤回") {
	                        vm.listData.push({
	                          deleteReason: deleteReason,
				                    messagenote:messagenote,
	                          userName: item.check_userName,
				                    startTime:item.startDate,	
	                          activeName: item.activeName,
	                          startTime: curTime,
	                          compareTime: curTime,
	                          //message: "",
	                          //taskDispearFlag: item.taskDispearFlag,
	                        });
	                      }

	                      if (vm.listData.length > 2) {
	                        vm.isNext = true;
	                      }
                      
	                      // 审批历史时间处理,按时间排序
	                      //vm.listData.sort(function(a, b) {
                          //return (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()); //时间正序
	                       // return (new Date(a.compareTime).getTime() - new Date(b.compareTime).getTime()); //时间正序
	                      //});
	                      // vm.listData.forEach(function(item, index) {
	                      //   if ( new Date(item.startTime).toLocaleString() != "Invalid Date"){
	                      //     item.startTime = new Date(item.startTime).toLocaleString();
	                      //   }
	                      // }); 

	                      //vm.historyData.sort(function(a, b) {
	                       //return (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()); //时间正序
                         //return (new Date(a.compareTime).getTime() - new Date(b.compareTime).getTime()); //时间正序
	                     // });             
	                });
	          } else {
	            this.$message.error(res.data.msg);
	        }
        }).catch(() => {
          this.$message.error("审批历史请求失败");
        });
    },
    // 历史下拉接口
    historyList(){
      this.historicalApproval = [];
      this.$http({
        url: '/ifbp-bpm-service/proc/approval-detailExtend',
        method: "post",
        params: {
          processInstanceId: this.params.processInstanceId,
          taskId: this.params.task_id
        }
      }).then(res=>{
        if(res.data.status === true){
          let historyArray = res.data.data.historicTasks;
          let time = res.data.data.startTime;
          // 处理提交环节
          this.$http({
            url: "/ifbp-bpm-service/identity/info/" + res.data.data.startUserId,
            method: "get"
          }).then(res_start => {
            var userName_start = "";
            if (res_start.data.status === true) {
              userName_start = res_start.data.data.name;
            } else {
              userName_start = "此任务待认领";
            }
            this.historicalApproval.push({
              message: [{title:"提交",messagenote:''}],
              userName: userName_start,
              activeName: res.data.data.name,
              startTime: time,
              compareTime: time
            });

            // 处理其他环节
            historyArray.forEach( item => {
              // 查人
              this.$http({
                url: "/ifbp-bpm-service/identity/info/" + item.assignee,
                method: "get"
              }).then( res_person => {
                let showPerson = '';
                if(res_person.data.status === 1){
                  showPerson = res_person.data.data.name;
                }

                // 处理审批信息
                let messageArray = [];
                if(item.taskComments && item.taskComments.length > 0){
                  item.taskComments.forEach( v => {
                    // 此处应该用字典
                    if(v.deleteReasonMessage == 'completed'){
                      if(v.message.indexOf('同意') != -1){
                        v.deleteReasonMessage = '同意';
                      } else if(v.message.indexOf('加签') != -1){
                        v.deleteReasonMessage = '加签';
                      } else if(v.message.indexOf('改派') != -1){
                        v.deleteReasonMessage = '改派';
                      }
                    } else if(v.deleteReasonMessage == 'jumpToActivity' || (item.deleteReasonMessage && item.deleteReasonMessage.indexOf("reject") >= 0 )){
                      v.deleteReasonMessage = '驳回';
                    } else if (v.deleteReasonMessage == "ACTIVITI_DELETED") {
                      v.deleteReasonMessage = "驳回并中止";
                    } else if (v.deleteReasonMessage == "withdraw") {
                      v.deleteReasonMessage = "审批后撤回";
                    } else if (v.deleteReasonMessage == "jump") {
                      v.deleteReasonMessage = "调整";
                    } else if (v.deleteReasonMessage == "stop") {
                      v.deleteReasonMessage = "终止";
                    } else if (v.deleteReasonMessage == "refuse") {
                      v.deleteReasonMessage = "拒绝";
                    } else if (v.deleteReasonMessage == "deleted" || v.deleteReasonMessage == "Delete" || v.deleteReasonMessage == "delete") {
                      v.deleteReasonMessage = "删除";
                    } else if(v.deleteReasonMessage == "null" && v.message.indexOf('改派') != -1){
                      v.deleteReasonMessage = '改派';
                    }
                    let detail = v.deleteReasonMessage + '：' + v.message;
                    messageArray.push(detail);
                  });
                }
                if(item.deleteReason == "refuse"){
                  messageArray = ['拒绝'];
                }
                this.historicalApproval.push({
                  activeName: item.activity.name,
                  startTime: item.endTime ? item.endTime: item.startTime ? item.startTime : ' ',
                  compareTime: item.endTime ? item.endTime: item.startTime ? item.startTime : ' ',
                  message: messageArray,
                  taskDispearFlag: item.taskDispearFlag,
                  userName: showPerson
                });

                // 权限处理
                if(item.taskDispearFlag){
                  messageArray.forEach( value => {
                    value = '*** ***';
                  });
                }

                // 删除this.historicalApproval中message为空数组的那条数据
                this.historicalApproval.forEach( ( v, i ) => {
                  if(v.message.length == 0){
                    this.historicalApproval.splice( i, 1 );
                  }
                });

                // 按时间排序(正序)
                this.historicalApproval.sort((a,b) => {
                  return (new Date(a.compareTime).getTime() - new Date(b.compareTime).getTime());
                });
              }).catch(()=>{
              });
              // console.log('this.historicalApproval',this.historicalApproval)
            });
          })
        }else{
          this.$message.error(res.data.msg);
        }
      }).catch(()=>{
          this.$message.error("审批历史请求失败");
      });
    },
    showList() {
      this.isHiddenList = !this.isHiddenList;
    },
    customEvents(){
      if (this.action === "agreeAble") {
        //判断btnLists（数组）里面有没有"assignAble"，如果有的话，会出现下拉,掉接口
        //this.btnLists.forEach(item => {
        //  if (Object.values(item).indexOf("assignAble") != -1) {
        //    this.getAssignment();
        //  }
        //});
        this.dialogFormVisible = true;
      } else if (this.action === "refuseAble") {
        this.dialogFormVisible = true;
      } else if (this.action === "rejectAble") {
        this.$http.get("/riart/fbpworkflows/reject-check", {
            params: {
                billType: this.params.billType,
				        billId:this.params.billId
            }
          }).then(response => {
            if (response.data.status === false) {
              this.$message.error(response.data.msg);
            } else {
              var newList = response.data.data;
              // 将取到的值处理一下
              var curList = [];

              newList.forEach(item => {
                var obj = {
                  key: item.activityDesc,
                  value: item.activityDefId
                };
                curList.push(obj);
              });
              this.nodeList = curList;
              this.dialogFormVisible = true;
            }
          }).catch(error => {
			        this.$message.error("获取驳回列表失败！");
          });

      } else if (this.action === "assignAble") {
        //this.getAssignment();
	      this.dialogFormVisible = true;
      } else if (this.action === "addsignAble") {
        this.dialogFormVisible = true;
      } else if (this.action === "delegateAble") {
        this.dialogFormVisible = true;
      }else if (this.action === "cancelApprove") {
		    this.dialogCancelApprove = true;
	    }else if (this.action === 'recallAble') {
        this.isHidRevocation = true;
      }
    },
    clickButton(action) {
      if(this.params.passValue == true){
        this.action = action;
        this.$emit("callBack",action);
      }else if(this.params.passValue == undefined || this.params.passValue == false){
        var data = this.params;
        this.action = action;
        if (this.action === "agreeAble") {
          //判断btnLists（数组）里面有没有"assignAble"，如果有的话，会出现下拉,掉接口
          this.btnLists.forEach(item => {
            if (Object.values(item).indexOf("assignAble") != -1) {
              this.getAssignment();
            }
          });
          this.dialogFormVisible = true;
        } else if (this.action === "refuseAble") {
          this.dialogFormVisible = true;
        } else if (this.action === "rejectAble") {
          this.$http.get("/riart/fbpworkflows/reject-check", {
            params: {
              	billType: this.params.billType,
				        billId:this.params.billId
            }
          }).then(response => {
            // 获取驳回下拉列表
            if (response.data.status === false) {
              this.$message.error(response.data.msg);
            } else {
              var newList = response.data.data;
              // 将取到的值处理一下
              var curList = [];
              newList.forEach(item => {
                var obj = {
                  key: item.activityDesc,
                  value: item.activityDefId
                };
                curList.push(obj);
              });
              this.nodeList = curList;
              this.dialogFormVisible = true;
            }
          }).catch(error => {
			        this.$message.error("获取驳回列表失败！");
          });
        } else if (this.action === "assignAble") {
//          this.getAssignment();
	        this.dialogFormVisible = true;
        } else if (this.action === "addsignAble") {
			      this.dialogFormVisible = true;
        } else if (this.action === "delegateAble") {
			      this.dialogFormVisible = true;
        } else if (this.action === "cancelApprove") {
			      this.dialogCancelApprove = true;
	    	}else if (this.action === 'recallAble') {
            this.isHidRevocation = true;
        }
      }
    },
    waitApprove() {
      this.$http({
        url:
          "/riart/fbpworkflows/proc/" +
          this.params.processInstanceId +
          "/todoActivity",
        method: "get"
      }).then(res => {
          this.waitApproves = res.data.data.name;
        }).catch(() => {
          this.$message.error("请求失败");
        });
    },

    getOpinion() {
      this.$http.get("/ifbp-bpm-service/proc/approval-comments", {
          params: {
            processInstanceId: this.params.processInstanceId
          }
        }).then(res => {

        }).catch(error => {

        });
    },

    approveState() {
      this.$http({
        url:
          "/ifbp-bpm-service/proc/" + this.params.processInstanceId + "/status",
        method: "get"
      }).then(res => {
          if (res.data.data.status === "run") {
            this.isEnd = false;
          } else {
            this.isEnd = true;
          }
        }).catch(() => {
          this.$message.error("请求失败");
        });
    },

    confirm() {
      var vm = this;
      this.data = this.curdata;
      var designateListStr = "";
      
  //  let url = window.location.hash.substring(1).replace('stateFlage=todo','stateFlage=his');
      if (this.action === "agreeAble") {
  //        this.designateList.forEach(function(item, index) {
  //          for (var i = 0; i < item.participants_01.length; i++) {
  //            var itemId = item.participants_01[i];
  //            item.participants_02.push({
  //              id: itemId
  //            });
  //          }
  //        });
  //        if (!this.designateList.length > 0) {
  //          designateListStr = "";
  //        } else {
  //          designateListStr = JSON.stringify(this.designateList);
  //        }
          var obj = {};
          if(this.assignstatus){
              var user = this.refTemplateValue;
              if (user === undefined ) {
                this.$message({
                type: "error",
                message: "请选择具体指派人"
                });
                return;
              }
              
            obj.param_assign_info = user.refcode;
            obj.param_note = "指派";
            var param = JSON.stringify(obj);					
          }else{
            if ( this.opinion === "") {
              this.opinion = "同意";
            }
            obj.param_note = this.opinion;
            var em = {};
            em.nolockandconsist = "Y";
            obj.eParam = em;
            var param = JSON.stringify(obj);
                  
          }
          this.$http({
              url: "/riart/fbpworkflows/doAction",
              method: "post",
              data: {
                action : "agree",
                param : param,
                billType : this.params.billType,
                billId : this.params.billId,
                agentuserId:this.params.agentuserId,
                pk_checkflow:""
              },
              timeout:60000
            }).then(response => {
              this.dialogFormVisible = false;
              if (response && response.data && response.data.status === true) {                
                this.$message({
                  type: "success",
                  message: "已审批同意"
                });
  //            this.$router.push(url);
                this.requestHistory();
                this.requestAction();
                vm.isAgree = false;
  //            this.requestPerson();
  //            this.approveState();
  //            this.historyList();
              } else if (response && response.data && response.data.status === false) {
                this.$message({
                  type: "error",
                  message: response.data.msg
                });
              }
            }).catch(error => {
              this.dialogFormVisible = false;
            });
          } else if (this.action === 'cancelApprove') {
              var obj = {};
              obj.param_note = "cancelApprove";
              var param = JSON.stringify(obj);
              this.$http({
                  url: '/riart/fbpworkflows/doAction',
                  method: 'post',
                  data: {
                      action : 'cancelApprove',
                      param : param,
                      billType : this.params.billType,
                      billId : this.params.billId,
                      agentuserId:this.params.agentuserId,
                      pk_checkflow:''
                  }
              }).then((response) => {
                  this.dialogCancelApprove = false;
                  if (response && response.data && (response.data.status === true)) {  
                      this.$message({
                          type: 'success',
                          message: '取消审批'
                      });
                      this.requestHistory();
                      this.requestAction();
                      vm.isAgree=false;
                  } else if (response && response.data && (response.data.status === false)) {
                      this.$message({
                          type: 'error',
                          message: response.data.msg
                      });
                  }
              }).catch((error) => {
                  this.dialogCancelApprove = false;
                  this.$message({
                      type: 'error',
                      message: '请求失败'
                  });
              });
          }else if (this.action === "refuseAble") {
              var obj = {};
              obj.param_note = this.opinion;
              var param = JSON.stringify(obj);
              this.$http({
                  url: "/riart/fbpworkflows/doAction",
                  method: "post",
                  params: {
                    action : "disagree",
                    param : param,
                    billType : this.params.billType,
                    billId : this.params.billId,
                    agentuserId:this.params.agentuserId,
                    pk_checkflow:""
                  }
              }).then(response => {
                this.dialogFormVisible = false;
                if (response && response.data && response.data.status === true) {
                  this.dialogFormVisible = false;
                  this.$message({
                    type: "success",
                    message: "已拒绝流程"
                  });
          //      this.$router.push(url);
                  this.requestHistory();
                  this.requestAction();
                  vm.isAgree = false;
          //      this.requestPerson();
          //      this.approveState();
          //      this.historyList();
                } else if (
                  response &&
                  response.data &&
                  response.data.status === false
                ) {
                  this.$message({
                    type: "error",
                    message: response.data.msg
                  });
                }
              }).catch(error => {
                this.dialogFormVisible = false;
                this.$message({
                  type: "error",
                  message: "请求失败"
                });
              });
        } else if (this.action === "rejectAble") {
          // 驳回
          var obj = {};
          var param_reject_activity = this.rejectTo;
          obj.param_note = this.opinion;
          obj.param_reject_activity = param_reject_activity;
          var param = JSON.stringify(obj);
          var params;
          if (this.rejectTo === "REJECTTOINIT") {
            params = {
              rejectToInit: "true",
              action: "reject",
              param : param,
              billType : this.params.billType,
              billId : this.params.billId,
              agentuserId:this.params.agentuserId,
              pk_checkflow:""
              };
          } else {
            params = {
              action: "reject",
              param : param,
              billType : this.params.billType,
              billId : this.params.billId,
              agentuserId:this.params.agentuserId,
              pk_checkflow:""
            };
            if (this.rejectTo === "") {
              this.$message({
                type: "error",
                message: "请选择有效的节点"
              });
              return;
            }
          }
          this.$http({
            url: "/riart/fbpworkflows/doAction",
            method: "post",
            data: params
            }).then(response => {
                this.dialogFormVisible = false;
                if (response && response.data && response.data.status === true) {
                  this.$message({
                    type: "success",
                    message: "驳回成功"
                  });
    //              this.$router.push(url);
                    this.requestHistory();
                    this.requestAction();
                    vm.isAgree = false;
    //              this.requestPerson();
    //              this.approveState();
    //              this.historyList();
                } else if (
                  response &&
                  response.data &&
                  response.data.status === false
                ) {
                  this.$message({
                    type: "error",
                    message: response.data.msg
                  });
                }
            }).catch(error => {
              this.dialogFormVisible = false;
              this.$message({
                  type: "error",
                  message: "请求失败"
              });
            });
        } else if (this.action === "delegateAble") {
          var user = this.refTemplateValue1;
          if (user === undefined ) {
          this.$message({
            type: "error",
            message: "请选择具体改派人"
          });
          return;
          }
          var obj = {};
          obj.param_reaassign_user = user.refcode;
          obj.param_note = "改派";
          var param = JSON.stringify(obj);
          this.$http({
          url: "/riart/fbpworkflows/doAction",
          method: "post",
          data: {
            action : "reassign",
            param : param,
            billType : this.params.billType,
            billId : this.params.billId,
            agentuserId:this.params.agentuserId,
            pk_checkflow:""
          }

        }).then(response => {
          this.dialogFormVisible = false;
          if (response && response.data && response.data.status === true) {
            this.$message({
            type: "success",
            message: "改派成功"
            });
    //      this.$router.push(url);
            this.requestHistory();
            this.requestAction();
            vm.isAgree = false;
    //      this.requestPerson();
    //      this.approveState();
    //      this.historyList();
          } else if (
            response &&
            response.data &&
            response.data.status === false
          ) {
            this.$message({
              type: "error",
              message: response.data.msg
            });
          }
          }).catch(error => {
            this.dialogFormVisible = false;
            this.$message({
                  type: "error",
                  message: "请求失败"
            });
          });
      } else if (this.action === "addsignAble") {
          var users = this.refTemplateValue;
          if (users === undefined ) {
          this.$message({
            type: "error",
            message: "请选择具体加签人"
          });
          return;
          }
          var obj = {};
          obj.param_note = "加签";
          obj.param_addApprove =  users.refcode.replace("\"","").split(",");
          var param = JSON.stringify(obj);
          this.$http({
            url: "/riart/fbpworkflows/doAction",
            method: "post",
            data: {
              action : "addApprove",
              param : param,
              billType : this.params.billType,
              billId : this.params.billId,
              agentuserId:this.params.agentuserId,
              pk_checkflow:""
            }
          }).then(response => {
            this.dialogFormVisible = false;
            if (response && response.data && response.data.status === true) {
              this.$message({
                type: "success",
                message: "加签成功"
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree = false;
      //      this.requestPerson();
      //      this.approveState();
      //      this.historyList();
            } else if (
              response &&
              response.data &&
              response.data.status === false
            ) {
              this.$message({
                type: "error",
                message: response.data.msg
              });
            }
          }).catch(error => {
            this.dialogFormVisible = false;
            this.$message({
              type: "error",
              message: "请求失败"
            });
          });
        }else if (this.action === "assignAble") {
          this.nodeList.forEach(function(item, index) {
            if (item.value == vm.rejectTo) {
            vm.remoteUserId = item.remoteUserId;
            }
          });
          this.$http({
            url: "/ifbp-bpm-service/approval/action",
            method: "post",
            data: {
            taskId: this.params.task_id,
            action: "agree",
            comment: this.opinion,
            processInstanceId: this.params.processInstanceId,
            activityId: this.rejectTo,
            remoteUserId: vm.remoteUserId
            }
          }).then(response => {
            this.dialogFormVisible = false;
              if (response && response.data && response.data.status === 1) {
                  this.dialogFormVisible = false;
                  this.$message({
                    type: "success",
                    message: "指派成功"
                  });
      //      this.$router.push(url);
              this.requestHistory();
              this.requestAction();
              vm.isAgree = false;
      //      this.requestPerson();
      //      this.approveState();
      //      this.historyList();
            } else if (
              response &&
              response.data &&
              response.data.status === 0
            ) {
              this.$message({
                type: "error",
                message: response.data.msg
              });
            }
          }).catch(error => {
            this.dialogFormVisible = false;
            this.$message({
                type: "error",
                message: "请求失败"
            });
          });
        }else if(this.action === "recallAble"){
          var obj = {};
          obj.param_note = "recall";
          var param = JSON.stringify(obj);
          this.$http({
          url: "/riart/fbpworkflows/doAction",
          method: "post",
          data: {
            action : "recall",
            param : param,
            billType : this.params.billType,
            billId : this.params.billId,
            agentuserId:this.params.agentuserId,
            pk_checkflow:""
          }
        }).then(response => {
          this.isHidRevocation = false;
          if (response && response.data && response.data.status === true) {           
            this.$message({
              type: "success",
              message: "收回成功"
            });
            this.$nextTick(function(){
              this.$emit("isRecall",true);
            });
            vm.isAgree=true;
          } else if (response && response.data && response.data.status === false) {
            this.$message({
              type: "error",
              message: response.data.msg
            });
          }
        }).catch(error => {
          this.isHidRevocation = false;
          this.$message({
              type: "error",
              message: "请求失败"
          });
        });
      }
      this.rejectTo = "";
      this.opinion = "";
  //  this.userId = "";
      this.$emit("afterAction",this.action);
    },
    cancel() {
        this.dialogFormVisible = false;
        this.rejectTo = "";
        this.opinion = "";
  //      this.userId = "";
      },

    isEnable() {
      var sceneCode = this.params_01.sceneCode;
      if (sceneCode !== "undefined" && sceneCode) {
        this.$http.get("/ifbp-bpm-service/bmp_proc/check", {
            params: {
              buzicode: "KHGL",
              sceneCode: sceneCode
            }
          }).then(res => {
            this.isSponsor = res.data.data.enabled;
          }).catch(error => {

          });
      }
    },

    getParams() {
      var data = {};
      var tmp;
      var paramPK = location.href.split("?")[0].split("/");
      this.pk = paramPK[paramPK.length - 1];
      var paramStr = location.href.split("?")[1];
      if (paramStr) {
        var paramsArr = paramStr.split("&");
        paramsArr.forEach(v => {
          tmp = v.split("=");
          data[tmp[0]] = decodeURIComponent(tmp[1]);
        });
      }
      if (data.sceneCode) {
        this.params_01 = data;
      } else {
        this.params = data;
      }
    },
    // 处理传入组件的值
    doParams() {
      var data = {};
      var tmp;
      var paramStr = this.childMsg.split("?")[1];
      if (paramStr) {
        var paramsArr = paramStr.split("&");
        paramsArr.forEach(v => {
          tmp = v.split("=");
          data[tmp[0]] = decodeURIComponent(tmp[1]);
        });
      }
      this.params = data;
    },

    getUser() {
      this.$http({
        url:
          "/ifbp-bpm-service/identity/info/07016fea-dfc7-11e7-b686-005056944e95",
        method: "get"
      }).then(res => {

        }).catch(() => {
          this.$message.error("请求失败");
        });
    },

    // initiateProcess() {
    //   var params = {
    //     buzicode: "KHGL",
    //     sceneCode: this.params_01.sceneCode,
    //     processInstanceName: "个人客户流程",
    //     businessKey: this.pk,
    //     mdPK: this.pk
    //   };
    //   this.$http({
    //     url: "/ifbp-bpm-service/proc/start",
    //     method: "post",
    //     data: params
    //   }).then(res => {
    //       if (res.data.status === 1) {
    //         this.$message({
    //           type: "success",
    //           message: "发起流程成功"
    //         });
    //       } else {
    //         this.$message.error(res.data.msg);
    //       }
    //     }).catch(() => {
    //       this.$message.error("发起失败");
    //     });
    // }

  },
  created() {
      this.requestHistory();
      this.requestAction();

  },
  watch:{
    billId:function(billId){
        this.params.billId = billId;
    },
    billType:function(billType){
        this.params.billType = billType;
      },
    agentuserId:function(agentuserId){
        this.params.agentuserId = agentuserId;
      },
    showBtn:function(showBtn){
        this.params.showBtn = showBtn;
      },
    passValue:function(passValue){
        this.params.passValue = passValue;
      },
    stateFlage:function(stateFlage){
        this.params.stateFlage = stateFlage;
      },
    multiinstanceModel:{
      handler:function(val){
        if(val == "Sign" || val == "Sequential"){
          this.defaultBtn = [];
        }
      },
      deep:true
    }
  }
};
</script>

<style scoped>
  /* 提交按钮样式 */
  .flow-button-style{
    background-color: #fff;
  }
  .flow-button-submit{
    margin: 16px 0 16px 16px;
  }
  ul,li{
    padding:0;
    margin:0;
    list-style:none
  }
  .list-panel1 {
    height: 104px;
    width: 100%;
    background-color: #fff;
    margin-bottom: 16px;
    position: relative;
  }

  .step {
    position: relative;
    /* height: 104px; */
    margin-top: 28px;
    margin-left: 34px;
  }

  .waitAction {
    position: absolute;
    left: 65px;
    top: 16px;
    font-size: 14px;
    color: #333333;
    line-height: 21px;
    width: 196px;
  }
  .waitAction span {
  color: #5CB0E6;
  width:132px;
  display:inline-block;
  text-overflow : ellipsis;
  white-space : nowrap;
  overflow : hidden;
  line-height: 18px;
  vertical-align: sub;
}
.titleNumber {
  position: absolute;
  left: 4px;
  top: 4px;
  color: #fff;
  line-height: 48px;
  text-align: center;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
}
.titleNumber::before{
  color: #00A753;
  font-size: 26px;
  line-height: 40px;
}
.ifbp-icon-check:before{
  font-weight: 700;
}
.ifbp-icon-edit:before{
  font-size: 22px;
  color: #C0CCDA;
}
.ifbp-icon-close:before{
  color: #FF3B30;
  font-weight: 700;
  font-size: 26px;
}
.ifbp-icon-undo:before{
  color: #FF9500;
  font-size: 26px;
}
.titleText {
  position: absolute;
  left: 72px;
  top: -14px;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  /* width: 180px; */
}
.titleText span {
  display: inline-block;
  height: 18px;
  overflow: hidden;
  font-weight: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 212px;
}
.titleData {
  font-size: 12px;
  color: #888888;
  margin-top: -5px;
  font-weight: normal;
}
.titleAction {
  font-size: 14px;
  color: #475669;
  position: absolute;
  left: 72px;
  top: 30px;
  width: 166px;
  height: 14px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.titleAction span{
  color: #888;
}
#search-container {
  height: 100px;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: none !important;
}

.first_step .statuss {
  overflow: hidden;
}

.first_step .statuss span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #25c8ff;
  vertical-align: middle;
  text-align: center;
  line-height: 20px;
  color: #ddd;
}

.first_step .statuss em {
  display: inline-block;
  height: 3px;
  width: 200px;
  background: #25c8ff;
}

.first_step .statuss i {
  position: absolute;
  right: -10px;
  top: 30px;
  font-style: normal;
}

.first_step strong {
  text-align: center;
  width: 200px;
  position: absolute;
  left: 50%;
  top: -30px;
  margin-left: -100px;
  font-weight: normal;
}

.first_step .submissionTime {
  text-align: center;
}

.first_step p {
  width: 100px;
  position: absolute;
  left: 50%;
  margin-left: -50px;
  top: 20px;
  text-align: center;
}

.first_step p em {
  font-style: normal;
}

.btnLists {
  display: inline-block;
  overflow: hidden;
  /* height: 220px; */
}
.btnLists .more-btn{
  position: relative;
  /* width: 150px; */
}

.btnLists li {
  float: left;
  margin-left: 5px;
}
.hiddenBtnList{
  position: absolute;
  left: -5px;
  top: 36px;
  z-index: 800;
}
.hiddenBtnList li{
  float:none;
  margin-bottom: 10px;
  margin-right: 5px;
}
.hiddenBtnList a {
  position: absolute;
  top:-16px;
  left: 48px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #D2D2D7;
  border-left: 10px solid transparent;
}
.statusLists {
  position: absolute;
  left: 0px;
  top: 82px;
  z-index: 800;
  border: 1px solid #eee;
}
.statusLists a{
  position: absolute;
  top:-16px;
  left: 46px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #eee;
  border-left: 10px solid transparent;
}
.statusLists .triangle{
  position: absolute;
  top:-14px;
  left: 46px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
  border-left: 10px solid transparent;
}
.statusLists ul {
  height: 426px;
  overflow-x: hidden;
}

.statusLists li {
  background: #fff;
  position: relative;
}

.statusLists li:not(:first-child){
  padding-top: 8px;
}

.statusLists li .div-content{
  margin-left: 20px;
  line-height: 24px;
}
.statusLists li em {
  font-style: normal;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #C0CCDA;
  vertical-align: middle;
  text-align: center;
  line-height: 18px;
  color: #fff;
  font-size: 12px;
  position: absolute;
  top: 15px;
  left: 16px;
}

.statusLists li span {
  /* margin-left: 10px; */
}

.statusLists li strong {
  font-weight: 400;
  margin-left: 8px;
  font-size: 16px;
  color: #333;
}

.statusLists li {
  padding: 8px 16px 0 16px;
}

.statusLists li p {
  /* padding-top: 10px; */
  margin-left: 28px;
  border-bottom: 1px solid #E6E6EB;
  padding-bottom: 8px;
  /* line-height: 24px; */
  margin-top: 1px;
}

.statusLists li p span{
  font-size:14px;
  color:#888;
}

.clickList {
  cursor: pointer;
}
.el-dropdown-menu__item{
  width: 102px;
  padding: 0 16px;
}
</style>
<style>
.step .el-step__head.is-text{
  width: 44px !important;
  height: 44px !important;
}
/* 第一步流程的样式 */
.step .first-step .el-step__head.is-text{
  background-color: #00A753;
  border-color: #00A753;
}
.step .first-step.el-step.is-horizontal .el-step__line{
  background-color: #00A753;
}
/* 未审批的第二步样式(不包含驳回) */
.step .second-step .el-step__head.is-text{
  background-color: #C0CCDA !important;
  border-color: #C0CCDA !important;
}
/* 未审批的第二步样式--驳回 */
.step .second-step.second-step-reject .el-step__head.is-text{
  background-color: #FF9500 !important;
  border-color: #FF9500 !important;
}
.step .second-step.second-step-reject.el-step.is-horizontal .el-step__line{
  background-color: #FF9500;
}

/* 审批第二步同意 */
.step .second-step-agree .el-step__head.is-text{
  background-color: #00A753;
  border-color: #00A753;
}
.step .second-step-agree.el-step.is-horizontal .el-step__line{
  background-color: #00A753;
}
/* 结束状态的时候样式 */
.step .el-step__head.is-text.is-finish{
  background-color: #00A753;
  border-color: #00A753;
}
.step .end-false .el-step__head.is-text{
  width: 44px !important;
  height: 44px !important;
  background-color: #C0CCDA !important;
  border-color: #C0CCDA !important;
}
/* 审批最后一步（拒绝，不同意） */
.step .refuse-status .el-step__head.is-text{
  background-color: #FF3B30;
  border-color: #FF3B30;
}
/* 审批最后一步--驳回 */
.step .refuse-status.reject-status .el-step__head.is-text{
  background-color: #FF9500;
  border-color: #FF9500;
}
/* 审批最后一步（同意） */
.step .agree-status .el-step__head.is-text{
  background-color: #00A753;
  border-color: #00A753;
}
.step .el-step.is-horizontal .el-step__line{
  top:22px !important;
  margin-left: 14px;
}
/* 审批第二步同意时线的样式 */
.step .second-status.el-step.is-horizontal .el-step__line{
  background-color: #00A753;
}
/* 审批第二步不同意(不包含驳回)时线的样式 */
.step .refuse-second-status.el-step.is-horizontal .el-step__line{
  background-color: #FF3B30;
}
/* 审批第二步不同意--驳回时线的样式 */
.step .refuse-second-status.reject-second-status.el-step.is-horizontal .el-step__line{
  background-color: #FF9500;
}
/* reject-second-status */
.btnLists .more-btn .btn-more{
  width: 32px !important;
  min-width: 32px !important;
  padding-left: 1px !important;
}
.btnLists .more-btn .btn-more::before{
  margin-left: 6px !important;
}
</style>
