<style lang="less" scoped>
@import './home.less';
</style>
<template>
<div id="home" class="home">

    <Menu active-name="1" mode="horizontal" @on-select="handleActive">
        <MenuItem name="1">
            <Icon type="settings"></Icon>
            打卡
        </MenuItem>
        <MenuItem name="2">
            <Icon type="stats-bars"></Icon>
            本月打卡记录
        </MenuItem>
    </Menu>
    <div v-if="activeName == 1" class="tab-item">
        <Button class="cbtn" type="primary" shape="circle" size="large" @click="toclock">
            <span v-if="!clock">打卡</span>
            <span v-else><span style="display:block;font-size:16px;">打卡时间</span>{{ clockTime }}</span>
        </Button>
    </div>
    <div v-else class="tab-item">
        <Table border :columns="columns" :data="tableData"></Table>
    </div>
    <Button class="fbtn" type="primary" size="large" long @click="loginout">退     &nbsp;&nbsp;&nbsp;出</Button>
</div>
</template>
<script>
import util from '@/libs/util';
import work from '../data/work_time.js';

export default {
    name:'mobileHome',
    data(){
        return {
            activeName: 1,
            clock:false,
            clockTime:"",
            columns: [
                    {
                        title: '日期',
                        key: 'work_date'
                    },
                    {
                        title: '上班时间',
                        key: 'work_up'
                    },
                    {
                        title: '下班时间',
                        key: 'work_down'
                    }
                ],
            tableData:[],
            userId:'',
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init: function(){
            var that = this;
            var workJSON = work.data[0].work;
           this.userId = parseInt(this.$route.query.user_id);
            var nowMonth = util.dateFormat(new Date(),"YYYY-MM");
            workJSON.forEach((item) => {
                var workDate = item.work_date;
                if(that.userId == item.number && nowMonth == workDate.slice(0,7)){
                    that.tableData.push(item)
                }
            })
        },
        handleActive: function(name){
            this.activeName = name;
        },
        toclock () {
                this.clock = true;
                this.clockTime = util.dateFormat(new Date(),"HH:MM:SS");
                var date = util.dateFormat(new Date(),"YYYY-MM-dd");
                var data = {
                    number: this.userId,
                    work_date: date,
                    work_up: this.clockTime,
                    work_down:  null,
                    work_state: 1,
                    update_remark: null,
                    update_user: null
                }
                this.tableData.push(data);
            },
            loginout(){
                this.$router.push({
                        name: 'mobile_login'
                    });
            }
    }
}
</script>
