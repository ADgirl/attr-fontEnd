<style lang="less" scoped>
@import './login.less';
</style>

<template>
    <div>
        <el-container>
            <!-- <el-header>
                <h5></h5>
            </el-header> -->
            <el-main>
                <el-form label-position="left" ref="form" :model="form" label-width="80px">
                    <el-form-item label="员工号:">
                        <el-input v-model="form.number"></el-input>
                    </el-form-item>
                    <el-form-item label="密码:">
                        <el-input v-model="form.password" type="password"></el-input>
                    </el-form-item>
                    
                </el-form>
            </el-main>
             <el-footer>
                 <Button type="primary" size="large" long @click="login">登录</Button>
             </el-footer>
        </el-container>
        <Alert type="error" v-show="errTip" show-icon :closable="true">
            密码或员工号错误！
        </Alert>
    </div>
</template>
<script>
import userJSON from '../../component-data/user.js';
export default {
    data(){
        return{
            form:{
                number:null,
                password:null
            },
            errTip:false,
            userJSON: []
        }
    },
    methods:{
        login: function(){
            this.userJSON = userJSON[0].users;
            var number = this.form.number;
            var pwd = this.form.password;
            var temp = 0;
            this.userJSON.forEach( (uItem) => {
                if(number == uItem.number && pwd == uItem.password){
                        temp = 1;
                }
            })
            
            if(temp == 1){
                let query = {user_id: number};
                        this.$router.push({
                            name: 'mobile_home',
                            query: query
                        });
                }else{
                    this.errTip = true;
                }
        }
    }
}
</script>
