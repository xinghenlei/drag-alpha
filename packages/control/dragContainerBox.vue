<template>
    <div draggbale="true" :class="cssBox" @dragover="dragover" @drop="drop">
        <div v-for="(item,index) in boxs" :key="index">
            <component v-bind:is="item.boxName" initDatas="item.initDatas" boxIndex="item.boxIndex"></component>
        </div>
    </div>
</template>
<script>
export default {
    name:'drag-ContainerBox',
    props:{
        cssBox:{
            type:String,
            default:"dragContainer",
        },//classname
        boxType:{
            type:String,
            default:"container",
        },//box of type, Container、Normal 、Form、Control
        domType:String,//tag name
        boxIndex:Number,//id
        initDatas:Object,/*
        default property:
            controlName  string   
            ……
        */
        boxs:{
            type:Array,
            default:function(){
                return null;
            }
        }/* box data array
        [{
            boxName:"" //dragImg、dragForm、dragSingleInput等
            initDatas:"",
            boxIndex
        }] */        
    },
    methods:{
        dragover = function(e) {
            e.preventDefault();
        },
        drop:function(e){        
            e.preventDefault();
            var allowBox=["drag-Normalbox","drag-FormBox"]
            var boxName=e.dataTransfer.getData("boxName");
            if(allowBox.indexOf(boxName)==-1){
                window.alert("控件类型不对，请注意拖拽操作范围");
                return false;
            }
            var initDatas=e.dataTransfer.getData("initDatas");
            var length=this.boxs.length;//The amount of controls loaded by the current container
            this.boxs.push({boxName:boxName,initDatas:initDatas,boxIndex:max+1});
            e.stopPropagation();
            //  vuex update after some month in the future
        }//拖动功能实现
    }
}
</script>
