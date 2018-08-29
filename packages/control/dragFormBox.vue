<template>
    <form draggbale="isDrag" :method="type" :enctype="enctype" :action="action"  :class="cssBox" @dragover="dragover" @drop="drop" @submit="submit" @dragover-slwp="slwp(parentId,boxIndex)">
        <div v-for="(item,index) in boxs" :key="index">
            <component v-bind:is="item.boxName" initDatas="item.initDatas" boxIndex="item.boxIndex"></component>
        </div>
    </form>
</template>
<script>
export default {
    name:'drag-FormBox',
    props:{
        isDrag:{
            type:Boolean,
            defaule:true
        },
        type:{
            type:String,
            default:"post",
        },
        enctype:{
            type:String,
            defaule:"application/x-www-form-urlencoded",
        },
        action:String,//  Url  RegExp is not yet unified  ,suggest you handle it yourself
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
        controlLevel:{
            type:Number,
            default:2
        },//0 ——container、1————normal、2————form、3————formControl
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
    computed:{
        selfId: function() {
            var timestamp = new Date().getTime().toString() + this.classname;
            return timestamp;
        }//id
    },
    methods:{
        dragover:function(e) {
            e.preventDefault();
        },
        drop:function(e){
            e.preventDefault();
            var controlLevel=e.dataTransfer.getData("controlLevel");
            switch(controlLevel){
                case 1:
                case 2:{
                    var dragIndex=e.dataTransfer.getData("dragIndex");
                    var parentId=e.dataTransfer.getData("parentId");
                    this.$emit("dragover-slwp",parentId,this.boxIndex);
                    this.boxIndex=dragIndex;
                }
                break;                
                case 3:{
                    var boxName=e.dataTransfer.getData("boxName");            
                    var initDatas=e.dataTransfer.getData("initDatas");
                    var length=this.boxs.length;//The amount of controls loaded by the current container
                    this.boxs.push({boxName:boxName,initDatas:initDatas,boxIndex:max+1});
                }
                break;
            }//  vuex update after some month in the future                                   
        },//拖动功能实现     
    dragstart:function(){
        ev.dataTransfer.setData("controlLevel",this.controlLevel);
        ev.dataTransfer.setData("parentId",this.selfId);
        ev.dataTransfer.setData("boxindex",this.index)
        },
    slwp:function(parentId,boxIndex){
            if(this.parentId==parentId){
                this.index=boxIndex;
            }            
        }                   
    }
}
</script>
