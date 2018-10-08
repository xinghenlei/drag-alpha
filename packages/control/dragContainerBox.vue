<template>
    <div draggable="isDrag" :class="cssBox" @dragover="dragover" @drop="drop">
        <div v-for="(item,index) in controls" :key="index">
            <component v-bind:is="item.controlName" initDatas="item.initDatas" boxIndex="item.boxIndex"></component>
        </div>
    </div>
</template>
<script>
export default {
    name:'drag-containerbox',
    props:{
        isDrag:{
            type:Boolean,
            defaule:false
        },
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
        controlLevel:{
            type:Number,
            default:0
        },//0 ——container、1————normal、2————form、3————formControl
        initDatas:Object,/*
        default property:
            controlName  string   
            ……
        */
        controls:{
            type:Array,
            default:function(){
                return null;
            }
        }/* controls data array
        [{
            controlName:"" //dragImg、dragForm、dragSingleInput等
            controlLevel:0,
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
            var controlName=e.dataTransfer.getData("controlName");   
            var initDatas=e.dataTransfer.getData("initDatas");
            var controlLevel=e.dataTransfer.getData("controlLevel");
            if(controlLevel!=2||controlLevel!=1){
                window.alert("拖动控件不符合")//prompt update after a while 
                return false;
            }
            var length=this.controls.length;//The amount of controls loaded by the current container
            this.controls.push({controlName:controlName,initDatas:initDatas,controlLevel:controlLevel,boxIndex:max+1});
            e.stopPropagation();
            //  vuex update after some month
        }//拖动功能实现
    }
}
</script>
