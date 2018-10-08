Vue.component("drag-nav", {
    template: '<div  ref="top"  class="dragnav clearfix" :class="{fleft:isCross,fixed:isFixed},propclass">\
                    <div :class="cssHeader" v-if="navHeader_html">\
                        <slot></slot>\
                        {{navHeader_html}}\
                    </div>\
                    <ul class="navUl" v-if="isDrag" v-for="(item,index) in navProps" :key="index">\
                        <li :class="item.cssLi" :draggable="isDrag" @dragstart="dragstart($event,item.controlName,item.controlLevel,item.initDatas)" >\
                            <span class="controlIconWd">{{item.word}}</span>\
                            <img class="controlIcon" :src="item.iconImg" alt="图标加载出错" @load="iconLoad" @error="iconLoad" />\
                        </li>\
                    </ul>\
                    <ul v-else class="navUl"  v-for="(item,index) in navProps" :key="index">\
                        <li :class="item.cssLi">\
                            <a :class="item.cssA" href="item.link" @click="item.click">{{item.word}}</a>\
                        </li>\
                    </ul>\
                </div> ',
    props: {
        propclass: {
            type: String,
            default: ""
        },
        isDrag: {
            type: Boolean,
            default: true
        },
        isFixed: {
            type: Boolean,
            default: false
        },
        isCross: {
            type: Boolean,
            default: true
        },
        nav: {
            type: String,
            default: "nav"
        }, //默认导航条样式
        cssHeader: {
            type: String,
            default: "cssHeader"
        },
        navHeader_html: {
            type: String,
            default: null
        }, //头部置顶
        navProps: {
            type: Array,
            default: function() {
                return [{
                    cssLi: null, //classname
                    cssA: null, //classname
                    link: "", //link
                    word: "test",
                    iconImg: "",
                    controlLevel: 1, //draglevel 
                    controlName: null,
                    initDatas: null,
                    click: function(e) {
                            return true;
                        } //click event
                }];
            }
        }, //菜单栏数据项
    },
    data: function() {
        return {
            ml_left: 0, //nav margin
        }
    },
    methods: {
        dragstart: function(ev, controlName, controlLevel, initDatas) {
            ev.dataTransfer.setData("controlName", controlName);
            ev.dataTransfer.setData("controlLevel", controlLevel);
            ev.dataTransfer.setData("initDatas", JSON.stringify(initDatas));
        },
        getStyle: function(dom, style) {
            if (dom instanceof Element) {
                var value = parseFloat(getComputedStyle(dom, null).getPropertyValue(style));
                return value;
            }
        },
        fixLeft: function(mt_container, ml_left) {
            var dom = this.$refs.top;
            dom.style.top = mt_container + 'px';
            this.ml_left = ml_left;
        },
        iconLoad: function() {
            var dom = this.$refs.top;
            var width = this.getStyle(dom, "width");
            dom.style.left = this.ml_left - width - 15 + "px";
        },
    },
    mounted: function() {
        this.$on("nav-fix", this.fixLeft);
    }
})
Vue.component('drag-containerbox', {
    template: '<div ref="top" draggable="isDrag" :class="cssBox" @dragover="dragover" @drop="drop">\
                <div ref="box" class="dragboxs" v-for="(item,index) in controls" :key="index" >\
                    <component v-bind:is="item.boxName" :controlName="item.controlName" :initDatas="item.initDatas" :boxIndex="item.boxIndex"></component>\
                </div>\
            </div>',
    name: "drag-containerbox",
    props: {
        isDrag: {
            type: Boolean,
            defaule: false
        },
        cssBox: {
            type: String,
            default: "dragContainer",
        }, //classname
        boxType: {
            type: String,
            default: "container",
        },
        domType: String,
        boxIndex: Number,
        controlLevel: {
            type: Number,
            default: 0
        },
        initDatas: Object,
        controls: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    computed: {
        selfId: function() {
            var timestamp = new Date().getTime().toString();
            return timestamp;
        }, //id
    },

    methods: {
        dragover: function(e) {
            e.preventDefault();
        },
        drop: function(e) {
            e.preventDefault();
            var controlName = e.dataTransfer.getData("controlName");
            var initDatas = JSON.parse(e.dataTransfer.getData("initDatas"));
            var controlLevel = parseInt(e.dataTransfer.getData("controlLevel"));
            var levelArr = [1, 2];
            var boxArr = ["drag-NormalBox"];
            if (!levelArr.includes(controlLevel)) {
                window.alert("拖动控件不符合")
                return false;
            }
            var length = this.controls ? this.controls.length : 0;
            store.commit("addControls", { boxName: boxArr[controlLevel - 1], controlName: controlName, initDatas: initDatas, boxIndex: length + 1 });
            //this.controls.push({ boxName: boxArr[controlLevel - 1], controlName: controlName, initDatas: initDatas, boxIndex: length + 1 });
            e.stopPropagation();
        },
    },

})
Vue.component('drag-NormalBox', {
    template: '<div draggable="false" :draggbale="isDrag" :class="cssBox" @dragover="dragover" @drop="drop" @dragover-boxSlwp="boxSlwp" ref="box">\
                    <component v-bind:is="controlName" :initDatas="initDatas" :index="boxIndex" :parentId="selfId"></component>\
                </div>',
    props: {
        isDrag: {
            type: Boolean,
            defaule: false,
        },
        IsNested: {
            type: Boolean,
            default: false,
        }, //Whether to load multiple Controls
        cssBox: {
            type: String,
            default: "dragNormalBox",
        }, //classname
        boxType: {
            type: String,
            default: "normal",
        }, //box of type, Container、Normal 、Form、Control
        controlName: {
            type: String, //tag name 
            required: true,
        },
        boxIndex: Number,
        controlLevel: {
            type: Number,
            default: 1
        }, //0 ——container、1————normal、2————form、3————formControl
        initDatas: Object,
    },
    computed: {
        selfId: function() {
                var timestamp = new Date().getTime().toString() + this.classname;
                return timestamp;
            } //id
    },
    methods: {
        dragover: function(e) {
            e.preventDefault();
        },
        drop: function(e) {
            e.preventDefault();
            var controlLevel = parseInt(e.dataTransfer.getData("controlLevel"));
            var dragIndex = parseInt(e.dataTransfer.getData("dragIndex"));
            if (controlLevel != 2 || controlLevel != 3) {
                window.alert("拖动控件不符合") //prompt update after a while 
                return false;
            }
            this.$emit("dragover-boxSlwp", parentId, this.boxIndex);
            this.$emit("dragover-controlSlwp", this.selfId, boxIndex);
            this.boxIndex = dragIndex;
            this.$refs.box.style.order = dragIndex;
            /*  
            I'm still thinking about the two ways of CSS(flex-basis) and data(initData slwp) for the control position exchange problem.
            if you want to talk about it,I'd be happy to discuss it with you on issues            
            */
            e.stopPropagation();
        }, //拖动功能实现
        boxSlwp: function(selfId, boxIndex) {
            if (this.selfId == selfId) {
                this.boxIndex = boxIndex;
                this.$emit("dragover-controlSlwp", selfId, boxIndex);
            }
        }
    }
})
Vue.component('drag-Img', {
    template: '<img draggable="true" :class="dragImg" :src="initDatas.src" :alt="initDatas.alt" @dragstart="dragstart($event)"/>',
    props: {
        classname: {
            type: String,
            defaule: "dragImg"
        },
        dragImg: {
            type: String,
            default: "dragImg",
        },
        initDatas: {
            type: Object,
            default: function() {
                return {
                    src: "",
                    alt: "图片加载失败",
                }
            }
        },
        controlLevel: {
            type: Number,
            default: 3
        },
        index: {
            type: Number,
            required: true
        },
        parentId: {
            type: String,
            required: true,
        },
    },
    mounted: function() {
        this.$on("dragover-controlSlwp", this.controlSlwp);
    },
    computed: {
        selfId: function() {
            var timestamp = new Date().getTime().toString();
            return timestamp;
        }
    },
    methods: {
        dragstart: function(ev) {
            ev.dataTransfer.setData("controlLevel", this.controlLevel);
            ev.dataTransfer.setData("boxindex", this.index);
            ev.dataTransfer.setData("parentId", this.parentId);
            //ev.dataTransfer.setData("initDatas", this.initDatas);
        },
        controlSlwp: function(parentId, boxIndex) {
            if (this.parentId == parentId) {
                this.index = boxIndex;
            }
        }
    }

})