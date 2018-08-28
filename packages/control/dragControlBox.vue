<template>
    <div draggable="isDrag" :class="cssBox" @dragover="dragover" @drop="drop">
        <component v-bind:is="domType" initDatas="initDatas" boxIndex="boxIndex"></component>
    </div>
</template>
/* 
    Current controls do not allow nesting
*/
<script>
export default {
    name:'drag-ComtrolBox',
    props:{
        isDrag:{
            type:Boolean,
            defaule:false,
        },
        IsNested:{
            type:Boolean,
            default:false,
        },//Whether to load multiple Controls
        cssBox:{
            type:String,
            default:"dragComtrolBox",
        },//classname
        boxType:{
            type:String,
            default:"formComtrol",
        },//box of type, Container、Normal 、Form、Control
        controlName:String,//tag name
        boxIndex:Number,//id
        controlLevel:{
            type:Number,
            default:3
        },//0 ——container、1————normal、2————form、3————formControl
        initDatas:Object,              
    },
    methods:{
        dragover:function(e) {
            e.preventDefault();
        },
        drop:function(e){
            e.preventDefault();
            var domType=e.dataTransfer.getData("domType");
            var initDatas=e.dataTransfer.getData("initDatas");
            this.domType=domType;
            this.initDatas=initDatas;
            e.stopPropagation();
        }//拖动功能实现
    }
}
</script>
