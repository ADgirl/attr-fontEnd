<template>
    <div id="mobile" class="mobile-main">
        <Layout>
        <Header>{{headerTitle}}</Header>
        <Content>
            <router-view></router-view>
        </Content>
    </Layout>
        
    </div>
</template>

<script>
    export default {
        data () {
            return {
                headerTitle:"登录",
                theme: this.$store.state.app.themeColor,
            };
        },
        mounted () {
           
        },
        computed:{
            path:function(){
                return this.$route.name;
            }
        },
        watch:{
             path: function(n,o){
                if(n == "mobile_login"){
                    this.headerTitle = "登录";
                }else if(n == "mobile_home"){
                    this.headerTitle = "主页";
                }
                else{
                    this.headerTitle = "登录";
                }
            }
        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>

<style scoped>
html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
}
.mobile-main{
    width: 100%;
    height: 100%;
    background-color: #f5f7f9;
    background-image: url('/src/images/m_bg.jpg'); 
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
}
.ivu-layout-header{
    background-color: #1AAEAE;
    color: white;
    text-align: center;
    font-size: 28px;
}
.ivu-layout{
    background: none ;
}
</style>
