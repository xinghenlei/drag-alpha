<template>
    <div draggbale="false" :class="cssBox" @dragover="dragover" @drop="drop">
        <component v-bind:is="domType" initDatas="initDatas" boxIndex="boxIndex"></component>
    </div>
</template>
/* 
    Current normalBox do not allow nesting
*/
<script>
export default {
    name:'drag-NormalBox',
    props:{
        draggable:{
            type:Boolean,
            default:false,
        },
        IsNested:{
            type:Boolean,
            default:false,
        },//Whether to load multiple Controls
        cssBox:{
            type:String,
            default:"dragNormalBox",
        },//classname
        boxType:{
            type:String,
            default:"normal",
        },//box of type, Container、Normal 、Form、Control
        domType:String,//tag name
        boxIndex:Number,//id
        initDatas:Object,              
    },
    methods:{
        dragover = function(e) {
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
