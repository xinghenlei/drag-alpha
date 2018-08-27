<template>
    <form method="type" enctype="enctype" action="action" draggbale="true" :class="cssBox" @dragover="dragover" @drop="drop" @submit="submit">
        <div v-for="(item,index) in boxs" :key="index">
            <component v-bind:is="item.boxName" initDatas="item.initDatas" boxIndex="item.boxIndex"></component>
        </div>
    </form>
</template>
<script>
export default {
    name:'drag-FormBox',
    props:{
        type:{
            type:String,
            default:"post",
        },
        enctype:{
            type:String,
            defaule:"application/x-www-form-urlencoded",
        },
        action:String,
        submit:{
            type:Function,
            defaule:function(){
                return true;
            }
        },
        cssBox:{
            type:String,
            default:"dragForm",
        },//classname
        boxType:{
            type:String,
            default:"form",
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
            var boxName=e.dataTransfer.getData("boxName");            
            var initDatas=e.dataTransfer.getData("initDatas");
            var length=this.boxs.length;//The amount of controls loaded by the current container
            this.boxs.push({boxName:boxName,initDatas:initDatas,boxIndex:max+1});
            //  vuex update after some month in the future
        }//拖动功能实现        
    }
}
</script>
