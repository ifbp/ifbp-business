<template>
    <div class="btn-line-wrapper" id="btnLineWrap" :style="{width:width+'px','text-align':textAlign}"><!--
         左侧 文字按钮区域 
        --><div class="font-btns" id="fontBtnSec" v-if="showTextBtns">
            <!-- 默认最多显示3个文字按钮 -->
            <template v-for="(btn,index) in leftTextBtns">
                <el-button :key="index" type="text" @click="btn.fn" :disabled="btn.disabled">{{btn.title}}</el-button>    
            </template>
            <template v-if="leftDropDownBtns.length>0">
                <!-- 按钮过多时,显示为下拉按钮 -->
                <el-dropdown @command="this.dropDownCommandFn" menu-align="start">
                    <span>更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown" class="font-btns-dropdown">
                        <template v-for="(dropdown,index) in leftDropDownBtns">
                            <el-dropdown-item :key="index" :command="dropdown.command"  :disabled="dropdown.disabled">{{dropdown.title}}</el-dropdown-item>                        
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
                            <el-dropdown-item :key="index" :command="rightTextBtn.command">{{rightTextBtn.title}}</el-dropdown-item>                        
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
  name:"ifbpBtnLine",
  props: {
    textBtnArr: {
      type: Array,
      default: []
    },
    iconBtnArr: {
      type: Array,
      default: []
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
    };
  },
  created() {
    $.each(this.currentTextBtns, function(index, textBtn) {
      textBtn["width"] = 14 * textBtn.fontNum + 24;
    });
    $.each(this.currentIconBtns, function(index, iconBtn) {
      iconBtn["width"] = 18 + 24;
    });
  },
  mounted() {
    // 设置不同的边界值;
    var nodeRange = this.getNodeRange();
    this.handleChgStyle(nodeRange, this.width);
  },
  watch: {
    iconBtnArr(newVal, oldVal) {
      this.currentIconBtns = newVal;
    },
    // 监测组件宽度变化;
    width(newVal, oldVal) {
      var vm = this;
      var nodeRange = this.getNodeRange();
      vm.handleChgStyle(nodeRange, newVal);
    }
  },
  methods: {
    //获取边界值;
    getNodeRange() {
      var step = [];
      step[0] = 42;
      $.each(this.currentTextBtns, function(index, textBtn) {
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
        vm.rightTextBtns = vm.currentTextBtns;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;
        vm.leftTextBtns = [];
      } else if (nodeRange[1] && nodeRange[2] && fullWidth > nodeRange[1] && fullWidth < nodeRange[2]) {
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;
        
        vm.leftTextBtns = vm.currentTextBtns.slice(0, 1);
        vm.rightTextBtns = vm.currentTextBtns.slice(1);
      } else if (nodeRange[2] && nodeRange[3] && fullWidth > nodeRange[2] && fullWidth < nodeRange[3]) {
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;

        vm.leftTextBtns = vm.currentTextBtns.slice(0, 2);
        vm.rightTextBtns = vm.currentTextBtns.slice(2);
      } else if (nodeRange[3] && nodeRange[4] && fullWidth > nodeRange[3] && fullWidth < nodeRange[4]) {
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;
        
        vm.leftTextBtns = vm.currentTextBtns.slice(0, 3);
        vm.rightTextBtns = vm.currentTextBtns.slice(3);
        vm.leftDropDownBtns = [];
      } else if (nodeRange[4] && nodeRange[5] && fullWidth > nodeRange[4] && fullWidth < nodeRange[5]) {
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = false;
        
        vm.leftTextBtns = vm.currentTextBtns.slice(0, 3);
        vm.leftDropDownBtns = vm.currentTextBtns.slice(3);
        vm.rightTextBtns = [];
      } else if (nodeRange[5] && nodeRange[6] && fullWidth > nodeRange[5] && fullWidth < nodeRange[6]) {
        //搜索框
        vm.hasMoreBtn = true;
        vm.rightIconBtns = vm.currentIconBtns;
        vm.showBigSearch = true;
        //
        vm.leftTextBtns = vm.currentTextBtns.slice(0, 3);
        vm.leftDropDownBtns = vm.currentTextBtns.slice(3);
        vm.calcIconBtns = [];
      } else {
        // 右侧IconBtn
        var iconBtnLen = vm.currentIconBtns.length;
        if (iconBtnLen > 0) {
          for (var j = 1; j <= iconBtnLen; j++) {
            if (j == iconBtnLen && fullWidth >= nodeRange[5 + j]) {
              vm.hasMoreBtn = false;
              vm.leftTextBtns = vm.currentTextBtns.slice(0, 3);
              vm.leftDropDownBtns = vm.currentTextBtns.slice(3);
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
              vm.leftTextBtns = vm.currentTextBtns.slice(0, 3);
              vm.leftDropDownBtns = vm.currentTextBtns.slice(3);
              vm.showBigSearch = true;

              vm.calcIconBtns = vm.currentIconBtns.slice(0, j - 1);
              vm.rightIconBtns = vm.currentIconBtns.slice(j - 1);
              break;
            }
          }
        } else {
          vm.leftTextBtns = vm.currentTextBtns.slice(0, 3);
          vm.leftDropDownBtns = vm.currentTextBtns.slice(3);
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
  padding-right:24px;
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
.btn-line-wrapper .font-btns > .el-dropdown span {
  color: #5cb0e6;
}

.font-btns-dropdown {
  color: #5cb0e6;
}
.all-btns-dropdown {
  width: 268px;
  padding: 8px 16px;
  color: #5cb0e6;
}
.all-btns-dropdown .el-dropdown-menu__item {
  padding-left: 0;
  line-height: 36px;
  font-size: 14px;
  color: #5cb0e6;
}
.all-btns-dropdown .el-dropdown-menu__item i {
  vertical-align: middle;
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
.btn-line-wrapper .search-section .btn-more {
  line-height: initial;
  color: #5cb0e6;
}
.btn-line-wrapper .search-section .el-input {
  vertical-align:baseline;
}
.btn-line-wrapper .font-btns span {
  font-size: 14px;
}
</style>
