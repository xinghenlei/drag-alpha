<template>
    <div :class="['nav',{clearfix:isCross==='false','fleft':isCross,fixed:'isFixed'}]">
        <div :class="cssHeader" v-if="navHeader_html">
                <slot><slot>
                {{navHeader_html}}            
        </div>
        <ul class="navUl" v-if="isDrag" v-for="(item,index) in navProps" :key="index">
            <li :class="item.cssLi||'navli'" draggable="true" @dragstart="dragstart(item.controlName,item.initDatas)" >
                <span class="controlIconWd">{{item.word}}</span>
                <img class="controlIcon" src="item.iconImg" alt="图标加载出错" />                
            </li>
        </ul>
        <ul v-else class="navUl"  v-for="(item,index) in navProps" :key="index">
            <li :class='item.cssLi||"navli"' >                
                <a :class="item.cssA||'navA'" href="item.link" @click="item.click||null">{{item.word}}</a>
            </li>
        </ul>
    </div>                  
</template>
<script>
export default {
  name: "drag-nav",
  props: {
    isDrag:{
      type:Boolean,
      default:true
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
          iconImg:"",
          controlLevel:1,
          controlName:null,
          initDatas:null,
          click: function(e) {
            return true;
          } //click event
        }];
      }
    } //菜单栏数据项
  },
  methods:{
    dragstart:function(ev,controlLevel,controlName,initDatas){
        ev.dataTransfer.setData("controlLevel",controlLevel);
        ev.dataTransfer.setData("controlName",controlName);
        ev.dataTransfer.setData("initDatas",initDatas);
    }
  }
};
</script>
