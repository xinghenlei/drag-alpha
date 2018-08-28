<template>
    <img draggable="true" class="dragImg" src="src" alt="alt" @click="click" @dragstart="dragstart" @dragover-slwp="slwp(randomId,boxIndex)"/>
</template>
<script>
export default {
    name:'drag-Img',
    props:{
        dragImg:{
            type:String,
            default:"dragImg",
        },
        src:{
            type:String,
            required:true, 
        },//Url  RegExp is not yet unified  ,suggest you handle it yourself
        alt:{
            type:String,
            default:"图片加载失败",
        },
        controlLevel:{
            type:Number,
            default:3
        },//0 ——container、1————normal、2————form、3————formControl
        click:{
            type:Function,
            default:function(){
            },
        },
        index:{
            type:String,
            required:true
        }    
    },
    computed:{
        randomId: function() {
            var timestamp = new Date().getTime().toString() + this.classname;
            return timestamp;
        }
    },//selfId  ,make it better after a while 
    methods:{
        dragstart:function(){
            ev.dataTransfer.setData("controlLevel",this.controlLevel);
            ev.dataTransfer.setData("randomId",this.randomId);
            ev.dataTransfer.setData("boxindex",this.index)
        },
        slwp:function(randomId,boxIndex){

        }
    }
}
</script>

