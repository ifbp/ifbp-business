<template>
    <div ref="item" id="vueGridLayout" class="vue-grid-layout" :style="mergedStyle">
        <slot></slot>
        <grid-item class="vue-grid-placeholder"
                   v-show="isDragging"
                   :x="placeholder.x"
                   :y="placeholder.y"
                   :w="placeholder.w"
                   :h="placeholder.h"
                   :i="placeholder.i">
        </grid-item>
    </div>
</template>
<style>
    .vue-grid-layout {
        position: relative;
        transition: height 200ms ease;
        min-height:1650px;
        background-color:#F2F6FA;
    }
    .bgSection{
        display: inline-block;
        position: absolute;
        width: 100px;
        height: 48px;
        background:#DEE8F2;
    }
</style>
<script>
    import Vue from 'vue';
    // var elementResizeDetectorMaker = require("element-resize-detector");
    import {} from "../helpers/element-resize-detector";
    import {bottom, compact, getLayoutItem, moveElement, validateLayout} from '../helpers/utils';
    //var eventBus = require('./eventBus');
    import GridItem from './GridItem.vue'
    import {addWindowEventListener, removeWindowEventListener} from "../helpers/DOM";

    export default {
        name: "GridLayout",
        provide() {
            return {
                eventBus: null
            }
        },
        components: {
            GridItem,
        },
        props: {
            // If true, the container height swells and contracts to fit contents
            autoSize: {
                type: Boolean,
                default: true
            },
            colNum: {
                type: Number,
                default: 12
            },
            rowHeight: {
                type: Number,
                default:48
            },
            maxRows: {
                type: Number,
                default: Infinity
            },
            margin: {
                type: Array,
                default: function () {
                    return [10, 10];
                }
            },
            isDraggable: {
                type: Boolean,
                default: true
            },
            isResizable: {
                type: Boolean,
                default: true
            },
            isMirrored: {
                type: Boolean,
                default: false
            },
            useCssTransforms: {
                type: Boolean,
                default: true
            },
            verticalCompact: {
                type: Boolean,
                default: true
            },
            layout: {
                type: Array,
                required: true,
            },
            chgBackground:{
                type: Boolean,
                default:true
            }
        },
        data: function () {
            return {
                width: null,
                mergedStyle: {},
                lastLayoutLength: 0,
                isDragging: false,
                placeholder: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0,
                    i: -1
                },
            };
        },
        created () {
            const self = this;

            // Accessible refernces of functions for removing in beforeDestroy
            self.resizeEventHandler = function(eventType, i, x, y, h, w) {
                self.resizeEvent(eventType, i, x, y, h, w);
            };

            self.dragEventHandler = function(eventType, i, x, y, h, w) {
                self.dragEvent(eventType, i, x, y, h, w);
            };

            self._provided.eventBus =  new Vue();
            self.eventBus = self._provided.eventBus;
            self.eventBus.$on('resizeEvent', self.resizeEventHandler);
            self.eventBus.$on('dragEvent', self.dragEventHandler);
        },
        beforeDestroy: function(){
            //Remove listeners
            this.eventBus.$off('resizeEvent', this.resizeEventHandler);
            this.eventBus.$off('dragEvent', this.dragEventHandler);
            removeWindowEventListener("resize", this.onWindowResize);
        },
        mounted: function() {
            //初始化设置背景div;
            this.handleBgDiv();
            //初始化背景Div的颜色;
            this.handleBgColor();

            this.$nextTick(function () {
                validateLayout(this.layout);
                const self = this;
                this.$nextTick(function() {
                    if (self.width === null) {
                        self.onWindowResize();
                        //self.width = self.$el.offsetWidth;
                        addWindowEventListener('resize', self.onWindowResize);
                    }
                    compact(self.layout, self.verticalCompact);

                    self.updateHeight();
                    self.$nextTick(function () {
                        const erd = elementResizeDetectorMaker({
                            strategy: "scroll" //<- For ultra performance.
                        });
                        erd.listenTo(self.$refs.item, function () {
                            self.onWindowResize();
                        });
                    });
                });

                addWindowEventListener("load", self.onWindowLoad.bind(this));
            });
        },
        watch: {
            width: function () {
                this.$nextTick(function () {
                    //this.$broadcast("updateWidth", this.width);
                    this.eventBus.$emit("updateWidth", this.width);
                    this.updateHeight();
                });
            },
            layout: function () {
                this.layoutUpdate();
            },
            colNum: function (val) {
                this.eventBus.$emit("setColNum", val);
            },
            rowHeight: function() {
                this.eventBus.$emit("setRowHeight", this.rowHeight);
            },
            isDraggable: function() {
                this.eventBus.$emit("setDraggable", this.isDraggable);
            },
            isResizable: function() {
                this.eventBus.$emit("setResizable", this.isResizable);
            },
            chgBackground:function(){
               this.handleBgColor();
            }
        },
        methods: {
            onWindowLoad: function(){
                const self = this;

                if (self.width === null) {
                    self.onWindowResize();
                    //self.width = self.$el.offsetWidth;
                    addWindowEventListener('resize', self.onWindowResize);
                }
                compact(self.layout, self.verticalCompact);

                self.updateHeight();
                self.$nextTick(function () {
                    const erd = elementResizeDetectorMaker({
                        strategy: "scroll" //<- For ultra performance.
                    });
                    erd.listenTo(self.$refs.item, function () {
                        self.onWindowResize();
                    });
                });
            },
            layoutUpdate() {
                if (this.layout !== undefined) {
                    if (this.layout.length !== this.lastLayoutLength) {
                        //console.log("### LAYOUT UPDATE!");
                        this.lastLayoutLength = this.layout.length;
                    }
                    compact(this.layout, this.verticalCompact);
                    this.eventBus.$emit("updateWidth", this.width);
                    this.updateHeight();
                }
            },
            updateHeight: function () {
                this.mergedStyle = {
                    height: this.containerHeight()
                };
            },
            onWindowResize: function () {
                this.handleBgDiv()
                if (this.$refs !== null && this.$refs.item !== null && this.$refs.item !== undefined) {
                    this.width = this.$refs.item.offsetWidth;
                }
            },
            containerHeight: function () {
                if (!this.autoSize) return;
                return bottom(this.layout) * (this.rowHeight + this.margin[1]) + this.margin[1] + 'px';
            },
            dragEvent: function (eventName, id, x, y, h, w) {
                if (eventName === "dragmove" || eventName === "dragstart") {
                    this.placeholder.i = id;
                    this.placeholder.x = x;
                    this.placeholder.y = y;
                    this.placeholder.w = w;
                    this.placeholder.h = h;
                    this.$nextTick(function() {
                        this.isDragging = true;
                    });
                    //this.$broadcast("updateWidth", this.width);
                    this.eventBus.$emit("updateWidth", this.width);
                } else {
                    this.$nextTick(function() {
                        this.isDragging = false;
                    });
                }
                //console.log(eventName + " id=" + id + ", x=" + x + ", y=" + y);
                let l = getLayoutItem(this.layout, id);
                //GetLayoutItem sometimes returns null object
                if (l === undefined || l === null){
                    l = {x:0, y:0}
                }
                l.x = x;
                l.y = y;
                // Move the element to the dragged location.
                this.layout = moveElement(this.layout, l, x, y, true);
                compact(this.layout, this.verticalCompact);
                // needed because vue can't detect changes on array element properties
                this.eventBus.$emit("compact");
                this.updateHeight();
                if (eventName === 'dragend') this.$emit('layout-updated', this.layout);
            },
            resizeEvent: function (eventName, id, x, y, h, w) {
                if (eventName === "resizestart" || eventName === "resizemove") {
                    this.placeholder.i = id;
                    this.placeholder.x = x;
                    this.placeholder.y = y;
                    this.placeholder.w = w;
                    this.placeholder.h = h;
                    this.$nextTick(function() {
                        this.isDragging = true;
                    });
                    //this.$broadcast("updateWidth", this.width);
                    this.eventBus.$emit("updateWidth", this.width);

                } else {
                    this.$nextTick(function() {
                        this.isDragging = false;
                    });
                }
                let l = getLayoutItem(this.layout, id);
                //GetLayoutItem sometimes return null object
                if (l === undefined || l === null){
                    l = {h:0, w:0}
                }
                l.h = h;
                l.w = w;
                compact(this.layout, this.verticalCompact);
                this.eventBus.$emit("compact");
                this.updateHeight();
                if (eventName === 'resizeend') this.$emit('layout-updated', this.layout);
            },
             //初始化设置背景Div;
            handleBgDiv(){
                // debugger;
                var gridLayout=document.getElementById("vueGridLayout");
                var winWidth=document.body.offsetWidth;
                var margin=this.margin[0];
                var secWidth=(winWidth-13*10)/12;
                var secHeight=48;
                for(var j=0;j<28;j++){
                    for(var i=0;i<12;i++){
                        let secTop=j*secHeight+(j+1)*margin;
                        let secLeft=i*secWidth+(i+1)*margin;
                        gridLayout.insertAdjacentHTML('afterbegin','<div class="bgSection" style="left:'+secLeft+'px;width:'+secWidth+'px;top:'+secTop+'px"></div>');
                    }
                }
            },
            //根据传入值改变是否显示背景颜色;
            handleBgColor(){
                var flag=this.chgBackground;
                if(flag){
                    $(".vue-grid-layout").css("background","#F2F6FA");
                    $(".bgSection").css("background","#DEE8F2");
                }else{
                    $(".vue-grid-layout,.bgSection").css("background","transparent");
                }
            }

        },
       
    }
</script>
