<template>
    <div draggbale="true" :class="cssBox" @dragover="dragover" @drop="drop">
        <div v-for="(item,index) in boxs" :key="index">
            <component v-bind:is="item.dragType" initDatas="item.initDatas"></component>
        </div>
    </div>
</template>
<script>
export default {
    name:'drag-Container',
    props:{
        cssBox:{
            type:String,
            defautl:"dragContainer",
        },//classname
        boxType:{
            type:String,
            default:"normal",
        },//box of type, Container、Normal 、Form、Control
        domType:String,//tag name
        boxIndex:Number,//id
        initDatas:Object,
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
            var boxName=e.dataTransfer.getData("boxName");
            var initDatas=e.dataTransfer.getData("initDatas");
            var length=this.boxs.length;
            this.boxs.push({boxName:boxName,initDatas:initDatas,boxIndex:max+1});
        }
    }
}
</script>
