<template>
    <div class="btn-line-wrapper" id="btnLineWrap" :style="{width:width+'px','text-align':textAlign}"><!--
         左侧 文字按钮区域 
        --><div class="font-btns" id="fontBtnSec" v-if="showTextBtns">
            <!-- 默认最多显示3个文字按钮 -->
            <template v-for="(btn,index) in leftTextBtns">
                <el-button :key="index" type="text" @click="handleBtnClick(btn)" :disabled="btn.disabled">{{btn.title}}</el-button>    
            </template>
            <template v-if="leftDropDownBtns.length>0">
                <!-- 按钮过多时,显示为下拉按钮 -->
                <el-dropdown @command="this.dropDownCommandFn" menu-align="start">
                    <span>更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown" class="font-btns-dropdown">
                        <template v-for="(dropdown,index) in leftDropDownBtns">
                            <el-dropdown-item :key="index" :command="dropdown.command" :disabled="dropdown.disabled">{{dropdown.title}}</el-dropdown-item>                        
                        </template>
                    </el-dropdown-menu>
                </el-dropdown>    
            </template>
        </div><!--
         搜索对话框区域 this.$slots['search-dialog'] 
        --><div class="search-section" id="searchSec" v-if="showBigSearch">
            <slot name="search-dialog"></slot>
        </div><!-- 
            右侧 图标按钮区域 
        --><div class="icon-btns" id="iconBtnSec">
            <!-- 宽度足够时显示图标按钮 -->
            <template v-for="(icon,index) in calcIconBtns">
                <i :key="index" :class="icon.iconfont"  @click="icon.fn" :title="icon.title"></i>            
            </template>
            <!-- 宽度不足,显示下拉列表 -->
            <template>   
                <el-dropdown @command="this.rightdropDownFn" menu-align="end" trigger="click" v-if="hasMoreBtn">
                    <i class="ifbp-icon-more" title="更多"></i>
                    <el-dropdown-menu slot="dropdown" class="all-btns-dropdown">
                        <!-- 搜索框 -->
                        <template v-if="!showBigSearch">
                            <slot name="search-dialog"></slot>
                        </template>
                        <!-- 显示 文字按钮 -->
                        <template v-for="(rightTextBtn,index) in rightTextBtns" v-if="rightTextBtns.length>0">
                            <el-dropdown-item :key="index" :command="rightTextBtn.command" :disabled="rightTextBtn.disabled">{{rightTextBtn.title}}</el-dropdown-item>                        
                        </template>
                        <!-- 显示 图标按钮 -->
                        <template v-for="(rightIconBtn,index) in rightIconBtns" v-if="rightIconBtns.length>0">
                            <el-dropdown-item :key="index" :command="rightIconBtn.command">
                                <i :key="index" :class="rightIconBtn.iconfont"></i>
                                 {{rightIconBtn.title}}
                            </el-dropdown-item>
                        </template>
                    </el-dropdown-menu>
                </el-dropdown>    
            </template>            
        </div> 
    </div>
</template>
<script>
export default {
  name: "ifbpBtnLine",
  props: {
    //左侧文字按钮;
    textBtnArr: {
      type: Array,
      default: function() {
        return [];
      },
      //自定义函数判断有无visible和disable属性,没有的增加默认值;
      validator: function(arr) {
        if (arr.length > 0) {
          $.each(arr, function(btnKey, btn) {
            if (typeof btn.visible === "undefined") {
              btn.visible = true;
            }
            if (typeof btn.disabled === "undefined") {
              btn.disabled = false;
            }
          });
        }
        return true;
      }
    },
    //右侧图标按钮;
    iconBtnArr: {
      type: Array,
      default: function() {
        return [];
      },
      //自定义函数判读，增加默认属性
      validator: function(arr) {
        if (arr.length > 0) {
          $.each(arr, function(btnKey, btn) {
            if (typeof btn.visible === "undefined") {
              btn.visible = true;
            }
          });
        }
        return true;
      }
    },
    width: {
      type: Number,
      default: 700
    },
    textAlign: {
      type: String,
      default: "left"
    }
  },
  data() {
    return {
      currentIconBtns: this.iconBtnArr,
      currentTextBtns: this.textBtnArr,
      showBigSearch: true,
      showTextBtns: true,
      hasMoreBtn: false,

      leftTextBtns: [],
      leftDropDownBtns: [],
      calcIconBtns: [],

      rightTextBtns: [],
      rightIconBtns: [],
      //可见的文字按钮
      visibleTextBtnArr: [],
      //隐藏的文字按钮
      invisibleTextBtnArr: []
    };
  },
  created() {
    
    var vm = this;
    $.each(vm.currentTextBtns, function(index, textBtn) {
      textBtn["width"] = 14 * textBtn.fontNum + 24;
      if (textBtn.visible) {
        //过滤,实际上展示的只是显示的按钮,不是currentTextBtns;
        vm.visibleTextBtnArr.push(textBtn);
      } else {
        vm.invisibleTextBtnArr.push(textBtn);
      }
    });
    $.each(this.currentIconBtns, function(index, iconBtn) {
      iconBtn["width"] = 18 + 24;
    });
    // 设置不同的边界值;
    var nodeRange = this.getNodeRange();
    this.handleChgStyle(nodeRange, this.width);
  },
  watch: {
    iconBtnArr(newVal, oldVal) {
      this.currentIconBtns = newVal;
    },
    textBtnArr: {
      //监听,当父组件的btn的visible属性变化时,重新渲染;
      handler(newVal, oldVal) {
        var vm = this;
        this.visibleTextBtnArr = [];
        this.invisibleTextBtnArr = [];
        this.currentTextBtns = newVal;
        $.each(newVal, function(index, textBtn) {
          if (textBtn.visible) {
            vm.visibleTextBtnArr.push(textBtn);
          } else {
            vm.invisibleTextBtnArr.push(textBtn);
          }
        });
        // 重新计算;
        var nodeRange = vm.getNodeRange();
        vm.handleChgStyle(nodeRange, vm.width);
      },
      deep: true //watch 深度监听
    },
    // 监测组件宽度变化;
    width(newVal, oldVal) {
      var vm = this;
      var nodeRange = this.getNodeRange();
      vm.handleChgStyle(nodeRange, newVal);
    }
  },
  methods: {
    // 点击文字按钮触发;
    handleBtnClick(btn) {
      btn.fn();
      this.$emit("handleTextBtn", this);
    },
    //获取边界值;
    getNodeRange() {
      var step = [];
      step[0] = 42;
      $.each(this.visibleTextBtnArr, function(index, textBtn) {
        if (index < 3) {
          step[index + 1] = step[index] + textBtn.width;
        }
      });
      step[4] = (step[3] || step[2] || step[1] || step[0]) + 70;
      //中间search;
      var searchSecW = 0;
      if (this.$slots["search-dialog"]) {
        searchSecW = 273;
      }
      step[5] = step[4] + searchSecW || step[4];
      //右侧;
      $.each(this.currentIconBtns, function(index, iconBtn) {
        step[index + 6] = step[5 + index] + iconBtn.width;
      });
      return step || [];
    },
    //下拉选择中触发
    dropDownCommandFn(command) {
      var vm = this;
      $.each(this.leftDropDownBtns, function(index, dropDown) {
        if (dropDown.command === command) {
          var fn = dropDown.fn;
          fn();
          return false;
        }
      });
    },
    //下拉选择中触发
    rightdropDownFn(command) {
      var vm = this;
      $.each(this.rightTextBtns, function(index, textBtn) {
        if (textBtn.command === command) {
          var fn = textBtn.fn;
          fn();
          return false;
        }
      });
      $.each(this.rightIconBtns, function(index, iconBtn) {
        if (iconBtn.command === command) {
          var fn = iconBtn.fn;
          fn();
          return false;
        }
      });
    },
    // 处理不同情况的展示;
    handleChgStyle(nodeRange, fullWidth) {
      var vm = this;
      if (nodeRange[1] && fullWidth < nodeRange[1]) {
        vm.hasMoreBtn = true;
        vm.rightTextBtns = vm.visibleTextBtnArr;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;
        vm.leftTextBtns = [];
      } else if (
        nodeRange[1] &&
        nodeRange[2] &&
        fullWidth > nodeRange[1] &&
        fullWidth < nodeRange[2]
      ) {
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;

        vm.leftTextBtns = vm.visibleTextBtnArr.slice(0, 1);
        vm.rightTextBtns = vm.visibleTextBtnArr.slice(1);
      } else if (
        nodeRange[2] &&
        nodeRange[3] &&
        fullWidth > nodeRange[2] &&
        fullWidth < nodeRange[3]
      ) {
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;

        vm.leftTextBtns = vm.visibleTextBtnArr.slice(0, 2);
        vm.rightTextBtns = vm.visibleTextBtnArr.slice(2);
      } else if (
        nodeRange[3] &&
        nodeRange[4] &&
        fullWidth > nodeRange[3] &&
        fullWidth < nodeRange[4]
      ) {
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;

        vm.leftTextBtns = vm.visibleTextBtnArr.slice(0, 3);
        vm.rightTextBtns = vm.visibleTextBtnArr.slice(3);
        vm.leftDropDownBtns = [];
      } else if (
        nodeRange[4] &&
        nodeRange[5] &&
        fullWidth > nodeRange[4] &&
        fullWidth < nodeRange[5]
      ) {
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;

        vm.leftTextBtns = vm.visibleTextBtnArr.slice(0, 3);
        vm.leftDropDownBtns = vm.visibleTextBtnArr.slice(3);
        vm.rightTextBtns = [];
      } else if (
        nodeRange[5] &&
        nodeRange[6] &&
        fullWidth > nodeRange[5] &&
        fullWidth < nodeRange[6]
      ) {
        //搜索框
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = true;
        //
        vm.leftTextBtns = vm.visibleTextBtnArr.slice(0, 3);
        vm.leftDropDownBtns = vm.visibleTextBtnArr.slice(3);
        vm.calcIconBtns = [];
      } else {
        // 右侧IconBtn
        var iconBtnLen = vm.currentIconBtns.length;
        if (iconBtnLen > 0) {
          for (var j = 1; j <= iconBtnLen; j++) {
            if (j == iconBtnLen && fullWidth >= nodeRange[5 + j]) {
              vm.hasMoreBtn = false;
              vm.leftTextBtns = vm.visibleTextBtnArr.slice(0, 3);
              vm.leftDropDownBtns = vm.visibleTextBtnArr.slice(3);
              vm.showBigSearch = true;
              vm.calcIconBtns = vm.currentIconBtns;
              vm.rightIconBtns = [];
              break;
            }
            if (
              nodeRange[j + 4] &&
              nodeRange[j + 5] &&
              fullWidth >= nodeRange[4 + j] &&
              fullWidth < nodeRange[5 + j]
            ) {
              vm.hasMoreBtn = true;
              vm.leftTextBtns = vm.visibleTextBtnArr.slice(0, 3);
              vm.leftDropDownBtns = vm.visibleTextBtnArr.slice(3);
              vm.showBigSearch = true;

              vm.calcIconBtns = vm.currentIconBtns.slice(0, j - 1);
              vm.rightIconBtns = vm.currentIconBtns.slice(j - 1);
              break;
            }
          }
        } else {
          vm.leftTextBtns = vm.visibleTextBtnArr.slice(0, 3);
          vm.leftDropDownBtns = vm.visibleTextBtnArr.slice(3);
          vm.showBigSearch = true;
          vm.rightTextBtns = [];
        }
      }
    }
  }
};
</script>
<style scoped>
.btn-line-wrapper {
  height: 48px;
  line-height: 48px;
  display: inline-block;
  overflow: hidden;
}
.btn-line-wrapper .font-btns *,
.btn-line-wrapper .search-section *,
.btn-line-wrapper .icon-btns * {
  vertical-align: middle;
}

.font-btns,
.icon-btns,
.search-section {
  display: inline-block;
  vertical-align: middle;
}
.search-section {
  padding-left: 16px;
}
.btn-line-wrapper .font-btns > .el-button,
.btn-line-wrapper .font-btns > .el-dropdown {
  top: 0;
  margin-left: 24px;
  min-width: auto;
}

.btn-line-wrapper .font-btns {
  font-size: 0px;
}
.font-btns-dropdown {
  color: #5cb0e6;
}
.all-btns-dropdown {
  width: 268px;
  padding:0;
  color: #5cb0e6;
}
.all-btns-dropdown .el-dropdown-menu__item {
  padding-left: 16px;
  line-height: 36px;
  font-size: 14px;
  color: #5cb0e6;
}
.all-btns-dropdown .el-dropdown-menu__item i {
  vertical-align:bottom;
}
.btn-line-wrapper .icon-btns i {
  margin: 0 0 0 24px;
  color: #5cb0e6;
  font-size: 18px;
}
.btn-line-wrapper .icon-btns {
  font-size: 0;
}

.ml16 {
  margin-left: 16px;
}
.ml24 {
  margin-left: 24px;
}
</style>
<style>
.btn-line-wrapper .search-section .btn-more i {
  line-height: unset;
  vertical-align: middle;
  color: #5cb0e6;
}
.btn-line-wrapper .font-btns span {
  font-size: 14px;
}
.btn-line-wrapper .font-btns > .el-button span {
  color: rgba(92, 176, 230, 1);
}
.btn-line-wrapper .font-btns > .el-button.is-disabled span {
  color: rgba(92, 176, 230, 0.5);
}
.btn-line-wrapper .font-btns > .el-dropdown span {
  color: #5cb0e6;
  vertical-align: unset;
}
.el-dropdown-menu.font-btns-dropdown .el-dropdown-menu__item.is-disabled,
.el-dropdown-menu.all-btns-dropdown .el-dropdown-menu__item.is-disabled {
  color: rgba(92, 176, 230, 0.5);
}
.el-dropdown-menu.all-btns-dropdown .el-dropdown-menu__item:not(.is-disabled):hover{
   color:#2a9be3;
}
.all-btns-dropdown > div{
  padding:12px 8px 4px 16px;
}
</style>
