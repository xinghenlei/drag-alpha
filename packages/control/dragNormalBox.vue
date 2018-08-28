<template>
    <div draggbale="isDrag" :class="cssBox" @dragover="dragover" @drop="drop" ref="box">
        <component v-bind:is="domType" initDatas="initDatas" index="boxIndex"></component>
    </div>
</template>
/* 
    Current normalBox do not allow nesting
*/
<script>
export default {
    name:'drag-NormalBox',
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
            default:"dragNormalBox",
        },//classname
        boxType:{
            type:String,
            default:"normal",
        },//box of type, Container、Normal 、Form、Control
        controlName:{
            type:String,//tag name 
            required:true,
        },
        boxIndex:Number,
        controlLevel:{
            type:Number,
            default:1
        },//0 ——container、1————normal、2————form、3————formControl
        initDatas:Object,              
    },
    computed:{
        randomId: function() {
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
            var dragIndex=e.dataTransfer.getData("dragIndex");
            var randomId=e.dataTransfer.getData("randomId");
            if(controlLevel!=2||controlLevel!=1){
                window.alert("拖动控件不符合")//prompt update after a while 
                return false;
            }
            $emit("dragover-slwp",randomId,this.boxIndex);
            this.boxIndex=dragIndex;
            /*  
            I'm still thinking about the two ways of CSS(flex-basis) and data(initData slwp) for the control position exchange problem.
            if you want to talk about it,I'd be happy to discuss it with you on issues            
            */
            e.stopPropagation();
        }//拖动功能实现
    }
}
</script>
