Vue.component("drag-nav", {
    template: '<div :class="["nav",{clearfix:isCross==="false","fleft":isCross,fixed:"isFixed"}]">\
                    <div :class="cssHeader" v-if="navHeader_html">\
                        <slot><slot>\
                        {{navHeader_html}}\
                    </div>\
                    <ul class="navUl" v-if="isDrag" v-for="(item,index) in navProps" :key="index">\
                        <li :class="item.cssLi||"navli"" :draggable="isDrag" @dragstart="dragstart" >\
                            <span class="controlIconWd">{{item.word}}</span>\
                            <img class="controlIcon" src="item.iconImg" alt="图标加载出错" />\
                        </li>\
                    </ul>\
                    <ul v-else class="navUl"  v-for="(item,index) in navProps" :key="index">\
                        <li :class="item.cssLi||"navli"">\
                            <a :class="item.cssA||"navA"" href="item.link" @click="item.click||null">{{item.word}}</a>\
                        </li>\
                    </ul>\
                </div> ',
    props: {
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
                    controlLevel: 1,
                    controlName: null,
                    initDatas: null,
                    click: function(e) {
                            return true;
                        } //click event
                }];
            }
        } //菜单栏数据项
    },
    methods: {
        dragstart: function(ev, controlLevel, controlName, initDatas) {
            ev.dataTransfer.setData("controlLevel", controlLevel);
            ev.dataTransfer.setData("controlName", controlName);
            ev.dataTransfer.setData("initDatas", initDatas);
        }
    }
})
Vue.component('drag-ContainerBox', {
    template: '<div draggable="isDrag" :class="cssBox" @dragover="dragover" @drop="drop">\
                <div v-for="(item,index) in boxs" :key="index">\
                    <component v-bind:is="item.controlName" initDatas="item.initDatas" boxIndex="item.boxIndex"></component>\
                </div>\
            </div>',
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
                return null;
            }
        }
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
            var controlName = e.dataTransfer.getData("controlName");
            var initDatas = e.dataTransfer.getData("initDatas");
            var controlLevel = e.dataTransfer.getData("controlLevel");
            if (controlLevel != 2 || controlLevel != 1) {
                window.alert("拖动控件不符合")
                return false;
            }
            var length = this.boxs.length;
            this.controls.push({ controlName: controlName, initDatas: initDatas, controlLevel: controlLevel, boxIndex: max + 1 });
            e.stopPropagation();
        }
    }
})
Vue.component('drag-NormalBox', {
    template: '<div :draggbale="isDrag" :class="cssBox" @dragover="dragover" @drop="drop" @dragover-boxSlwp="boxSlwp" ref="box">\
                    <component v-bind:is="domType" :initDatas="initDatas" :index="boxIndex" :ParentId="randomId"></component>\
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
            var controlLevel = e.dataTransfer.getData("controlLevel");
            var dragIndex = e.dataTransfer.getData("dragIndex");
            var parentId = e.dataTransfer.getData("parentId"); //dragoverDom of parentId
            if (controlLevel != 2 || controlLevel != 1) {
                window.alert("拖动控件不符合") //prompt update after a while 
                return false;
            }
            this.$emit("dragover-boxSlwp", parentId, this.boxIndex);
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
    template: '<img draggable="true" :class="dragImg" :src="initDatas.src" :alt="initDatas.alt" @click="initDatas.click"\ @dragstart="dragstart" @dragover-controlSlwp="controlSlwp(parentId,boxIndex)"/>',
    props: {
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
                    click: function() {

                    }
                }
            }
        },
        controlLevel: {
            type: Number,
            default: 3
        },
        index: {
            type: String,
            required: true
        },
        parentId: {
            type: String,
            required: true,
        },
    },
    computed: {
        SelfId: {
            function() {
                var timestamp = new Date().getTime().toString() + this.classname;
                return timestamp;
            }
        }
    },
    methods: {
        dragstart: function() {
            ev.dataTransfer.setData("controlLevel", this.controlLevel);
            ev.dataTransfer.setData("parentId", this.parentId);
            ev.dataTransfer.setData("boxindex", this.index);
            ev.dataTransfer.setData("initDatas", this.initDatas);
        },
        controlSlwp: function(parentId, boxIndex) {
            if (this.parentId == parentId) {
                this.index = boxIndex;
            }
        }
    }
})