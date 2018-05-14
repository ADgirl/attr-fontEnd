<template>
    <div class="home" :style="{height:height+'px','overflow-x':'auto'}">
        <h2>欢迎进入企业考勤后台管理系统</h2>
        <p>现在是北京时间<span>{{nowTime}}</span></p>
    </div> 
</template>
<script>
export default {
    data(){
        return{
            nowTime:'',
            height:'600'
        }
    },
    mounted: function(){
        this.height = document.body.scrollHeight - 150;
        this.getTime();
    },
    computed:{

    },
    methods:{
        getTime(){
            // var nowTime ;
	        var time = new Date();
	        this.nowTime = time.getFullYear()+"年"+time.getMonth()+"月"+time.getDate()+"日"+time.getHours()+"时"+time.getMinutes()+"分"+time.getSeconds()+"秒";
	        // document.getElementById("d").innerHTML = nowTime;
	        // setInterval(this.getTime(),1000);
        }
    }
}
</script>

<style lang="less" scoped>
    html,body{
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
    }
    .home{
        text-align: center;
        vertical-align: middle;
        background-color: #5cacb3;
        height: 100%;
        padding-top: 50px;
        background-image: url(/src/images/bg4.jpg);
        background-size: 100% 100%;
        color: white;
        font-size: 16px;
    }
</style>

