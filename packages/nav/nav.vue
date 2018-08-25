<template>
    <div :class="['nav',{clearfix:isCross==='false','fleft':isCross,fixed:'isFixed'}]" ref="topDiv">
        <div :class="cssHeader" v-if="navHeader_html">
                <slot><slot>
                {{navHeader_html}}            
        </div>
        <ul class="navUl" v-for="(item,index) in navProps" :key="index">
            <li :class='item.cssLi||"navli"' >
                <a :class="item.cssA||'navA'" href="item.link" @click="item.click||null">{{item.word}}</a>
            </li>
        </ul>
    </div>                  
</template>
<script>
export default {
  name: "nav",
  prop: {
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
      type: Object,
      default: {
        cssLi: null, //classname
        cssA: null, //classname
        link: "", //link
        word: "test",
        click: function(e) {
          return true;
        } //click event
      }
    } //菜单栏数据项
  }
};
</script>
