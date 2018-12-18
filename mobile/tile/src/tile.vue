<template lang="html">
  <div class="mobile-card" :class="sizeClass" :style="styleObject" @click="cardClick">
    <div class="mobile-card-info">
      <div class="mobile-card-info-icon">
        <i :class="icon ? icon : 'ifbp-icon-Track'" :style="{'color':iconColor}"></i>
      </div>
      <div class="mobile-card-title">
        {{title}}
      </div>
    </div>
    <div :class="['card-icon-status',iconStatus==='add'?'card-add':'',iconStatus==='minus'?'card-minus':'']" v-if="iconStatus">
      <i class="ifbp-icon-add" v-if="iconStatus==='add'"></i>
      <i class="ifbp-icon-close" v-if="iconStatus==='minus'"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileTile',
  data() {
    return {
      sizeClass:'sm',
      styleObject: {
        color: '#333',
        fontSize: '12px'
      }
    };
  },
  props: {
    title:{
      type:String
    },
    size: {
      type:String
    },
    icon:{
      type:String,
      default:'ifbp-icon-Track'
    },
    iconColor: {
      type: String,
      default: '#5CB0E6'
    },
    cardStyle: {
      type:Object
    },
    iconStatus: {
      type:String
    }
  },
  watch: {
    cardStyle(val) {
      this.styleObject = val;
    }
  },
  methods: {
    cardClick() {
      this.$emit('card-click');
    }
  },
  created() {
    if (this.size) {
          this.sizeClass = this.size;
        }
        if (this.cardStyle) {
          this.styleObject = this.cardStyle;
        }
  },
  mounted() {

  }
}
</script>
<style lang="css">
div {
  margin: 0;
  padding: 0;
}
.sm {
  width:25%;
  height:92px;
}
.md {
  width:33.33%;
  height:92px;
}
.lg{
  width:50%;
  height:92px;
}
.mobile-card{
  border: 1px solid transparent;
  text-align: center;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
}
.mobile-card:hover {
  border: 1px solid #6bcaea;
  cursor: pointer;
}
.mobile-card-title {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  line-height: 17px;
  font-size: 12px;
  color: #333;
  margin-top: 8px;
}
.mobile-card-info{
  width:100%;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.mobile-card-info-icon {
  height: 24px;
  line-height: 24px;
}
.mobile-card-info-icon i {
  line-height: 24px;
  font-size: 24px;
}
.card-icon-status {
  position: absolute;
  top: 0;
  right: 0;
  width:24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
}
.card-icon-status i{
  font-size: 24px;
  color: #fff;
}
.card-icon-status.card-minus {
  background-color:#E60012;
}
.card-icon-status.card-add {
  background-color:#0089FA;
}

</style>
