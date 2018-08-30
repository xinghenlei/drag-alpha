<template>
    <img draggable="true" :class="dragImg" :src="initDatas.src" :alt="initDatas.alt" @click="initDatas.click" @dragstart="dragstart" @dragover-controlSlwp="controlSlwp(parentId,boxIndex)"/>
</template>
<script>
export default {
    name:'drag-Img',
    props:{
        dragImg:{
            type:String,
            default:"dragImg",
        },
        initDatas:{
            type:object,
            default:function(){
                return {
                    src:"",
                    alt:"图片加载失败",
                    click:function(){

                    }
                }
            }
        },      
        controlLevel:{
            type:Number,
            default:3
        },//0 ——container、1————normal、2————form、3————formControl
        
        index:{
            type:String,
            required:true
        },
        parentId:{
            type:string,
            required:true,
        },        
    },
    computed:{
        SelfId:{
           function() {
                var timestamp = new Date().getTime().toString() + this.classname;
                return timestamp;
            }
        }   //selfId  ,make it better after a while 
    },
    methods:{
        dragstart:function(ev){
            ev.dataTransfer.setData("controlLevel",this.controlLevel);
            ev.dataTransfer.setData("parentId",this.parentId);
            ev.dataTransfer.setData("boxindex",this.index);
            ev.dataTransfer.setData("initDatas",this.initDatas);
        },//drag event
        controlSlwp:function(parentId,boxIndex){
            if(this.parentId==parentId){
                this.index=boxIndex;                
            }            
        }
    }
}
</script>

