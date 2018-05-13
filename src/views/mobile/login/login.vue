<style lang="less" scoped>
@import './login.less';
</style>

<template>
    <div>
        <el-container>
            <el-header>
                <h5>登&nbsp;&nbsp;&nbsp;录</h5>
            </el-header>
            <el-main>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="员工号">
                        <el-input v-model="form.number"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    
                </el-form>
            </el-main>
             <el-footer>
                 <Button type="primary" size="large" long>登录</Button>
             </el-footer>
        </el-container>
    </div>
</template>
<script>
export default {
    data(){
        return{
            form:{
                number:null,
                password:null
            }
        }
    }
}
</script>
