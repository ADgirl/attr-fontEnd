<style lang="less" scoped>
    @import './attr-chart.less';
</style>
<template>
    <div class="chart-content">
        <Card>
            <Form slot="title" inline :label-width="100" :model="chartFilter" class="chart-content-title">
                <FormItem prop="date">
                    <Select slot="label" v-model="chartFilter.timeType" style="width:100px">
                        <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="margin-left:5px;line-height:51px;">
                        <span>:</span>
                        <DatePicker v-if="chartFilter.timeType == 1" v-model="chartFilter.month" type="month" placeholder="选择年月" style="width: 200px;"></DatePicker>
                        <DatePicker v-else v-model="chartFilter.date" type="date" placeholder="选择日期" style="width: 200px;"></DatePicker>
                    </div>
                </FormItem>
                <FormItem prop="person">
                    <Select slot="label" v-model="chartFilter.userType" style="width:100px">
                        <Option v-for="item in titleList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="margin-left:5px;line-height:51px;">
                        <span>:</span>
                        <Select v-model="chartFilter.unit" style="width:100px">
                            <Option v-for="item in unitJSON" :value="item.unitNo" :key="item.value">{{ item.unit_name }}</Option>
                        </Select>
                        <Select v-show="chartFilter.userType == 0" v-model="chartFilter.person" style="width:100px">
                            <Option v-for="item in personJSON" :value="item.number" :key="item.value">{{ item.name }}</Option>
                        </Select>
                    </div>
                    
                </FormItem>
                
                <FormItem>
                    <Button type="primary" size="default" icon="ios-search" @click="search">查询</Button>
                </FormItem>
            </Form>
            <div class="chart-body">
                <Row class="margin-bottom-10">
                    <Col span="12" :style="{height:height+'px','overflow-x':'auto'}">
                        <div class="data-source-row">
                            <data-source-pie :pie-data="pieData" :pie-title="pieTitle"></data-source-pie>
                        </div>
                    </Col>
                    <Col :style="{height:height+'px','overflow-x':'auto'}" span="12">
                        <div class="line-chart-con">
                            <service-requests :line-title="lineTitle" :line-data="lineData"></service-requests>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
</template>
<script>
import dataSourcePie from '../../home/components/dataSourcePie.vue';
import serviceRequests from '../../home/components/serviceRequests.vue';
import util from '@/libs/util';
import unitJSON from "../../component-data/unit.js";
import personJSON from "../../component-data/user.js";
import workJSON from "../../component-data/work_time.js";
import managerJSON from "../../component-data/manager.js";

export default {
    name: 'attrChart',
    components: {
        dataSourcePie,
        serviceRequests
    },
    data(){
        return{
            pieData: {
                normal:0,
                early: 0,
                vacation: 0,
                delay: 0,
                absent: 0,
                late: 0
            },
            pieTitle: '所有员工本月考勤统计',
            lineTitle:'所有员工本月考勤统计',
            lineData: {
                nodeType: [],
                dataArr: {
                    normal:[],
                    late:[],
                    early:[],
                    vacation: [],
                    absent: [],
                    delay: []
                }
            },
            personJSON:[],
            unitJSON:[],
            height: 250,
            titleList:[
                {
                    value: 0,
                    label: '日期'
                },
                {
                    value: 1,
                    label: '月份'
                }
            ],
            titleList2:[
                {
                    value: 0,
                    label: '员工'
                },
                {
                    value: 1,
                    label: '部门'
                }
            ],
            chartFilter:{
                timeType:0,
                userType:0,
                date:null,
                month:null,
                unit:null,
                person:null
            }
        }
    },
    computed: {
        title2ed() {
            return this.chartFilter.userType;
        },
        united() {
            return this.chartFilter.unit;
        },
        personed() {
            return this.chartFilter.person;
        }
    },
    watch: {
        title2ed: function(newValue, old) {
            if (newValue == 1) {
                this.chartFilter.unit = null;
            }
        },
        united: function(newValue, old) {
            var that = this;
            var personJSONed = [];
            this.chartFilter.person = [];
            personJSON[0].users.forEach(item => {
                if (item.unit_no == newValue) {
                personJSONed.push(item);
                }
            });
            that.personJSON = personJSONed;
        },
        personed: function(newValue, old) {
            return newValue;
        }
    },
    mounted: function(){
        this.height = document.body.scrollHeight - 275;
    },
    methods:{
        getData: function() {
            this.unitJSON = unitJSON[0].unit;
            this.personJSON = personJSON[0].users;
            var persons = personJSON[0].users;
            var managers = managerJSON[0].manager;
            var workes = workJSON[0].work;
            var that = this;
            this.pieTitle = that.lineTitle = '所有员工本月考勤统计';

            var normal = [],delay = [],early = [],late = [],absent = [],vacation = [];
            var n = 0,d = 0,e = 0,l = 0,v = 0,a = 0;
            var res = [],res2 = [];
            var currentMonth = '2018-05';

            for(var i=0;i<workes.length;i++){
                if(res.indexOf(workes[i].work_date)==-1){
                    res.push(workes[i].work_date);
                    res.sort();
                }
            }
            // if(res.length > 5){
            //     res = res.slice(0,5);
            // }
            workes.forEach(item => {
                res.forEach((dateItem,index) => {
                    if(item.work_date.slice(0,7) == currentMonth){
                        switch (item.work_state) {
                            case 0:
                                that.pieData.normal++;
                                if(that.pieData.normal > 0){
                                    if(dateItem == item.work_date){
                                        n++;
                                        normal[index] = n;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        normal[r] = 0;
                                    }
                                }
                                
                                
                                break;
                            case 1:
                                that.pieData.delay++;
                                if(that.pieData.delay > 0){
                                    if(dateItem == item.work_date){
                                        d++;
                                        delay[index] = d;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        delay[r] = 0;
                                    }
                                }
                                
                                break;
                            case 2:
                                that.pieData.early++;
                                if(that.pieData.early > 0){
                                    if(dateItem == item.work_date){
                                        e++;
                                        early[index] = e;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        early[r] = 0;
                                    }
                                }
                                
                                break;
                            case 3:
                                that.pieData.absent++;
                                if(that.pieData.absent > 0){
                                    if(dateItem == item.work_date){
                                        a++;
                                        absent[index] = a;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        absent[r] = 0;
                                    }
                                }
                                
                                break;
                            case 4:
                                that.pieData.late++;
                                if(that.pieData.late > 0){
                                    if(dateItem == item.work_date){
                                        l++;
                                        late[index] = l;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        late[r] = 0;
                                    }
                                }
                                
                                break;
                            case 5:
                                that.pieData.vacation++;
                                if(that.pieData.vacation > 0){
                                    if(dateItem == item.work_date){
                                        v++;
                                        vacation[index] = v;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        vacation[r] = 0;
                                    }
                                }
                                
                                break;
                            default:
                                that.pieData.normal++;
                                if(that.pieData.normal > 0){
                                    if(dateItem == item.work_date){
                                        n++;
                                        normal[index] = n;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        normal[r] = 0;
                                    }
                                }
                                
                                break;
                        }
                    }
                    
                });
            });
            that.lineData = {
                nodeType: res,
                dataArr: {
                    normal:normal,
                    late:late,
                    early:early,
                    vacation: vacation,
                    absent: absent,
                    delay: delay
                }
            };
        },

        search: function() {
            console.log('search')
            var that = this;
            this.tableData2 = [];
            var timeType = this.chartFilter.timeType;
            var userType = this.chartFilter.userType;
            var dt = this.chartFilter.date;
            var month = this.chartFilter.month;
            var person = this.chartFilter.person;
            var users = personJSON[0].users;
            var works = workJSON[0].work;
            var units = unitJSON[0].unit;
            var unit = this.chartFilter.unit;
            console.log('timeType:'+timeType+','+'userType:'+userType);

            if ((dt != "" && dt != null)&&timeType == 0) {    //0：一天
                that.pieData = {
                        normal:0,
                        early: 0,
                        vacation: 0,
                        delay: 0,
                        absent: 0,
                        late: 0
                    };
               if((userType == 0&&person == null) ||(userType == 1&&unit == null)){//第二个条件未选择,即没有选人员，默认全部员工
                    // month = util.dateFormat(new Date(),"YYYY-MM");
                    that.pieData.pieTitle = util.dateFormat(dt,'yyyy年MM月dd日') + '员工考勤统计';
                    works.forEach((work) => {
                         users.forEach((user) => {
                             if(work.number == user.number && work.work_date == util.dateFormat(dt,'yyyy-MM-dd')){
                                switch (work.work_state) {
                                    case 0:
                                        that.pieData.normal++;
                                        break;
                                    case 1:
                                        that.pieData.delay++;
                                        break;
                                    case 2:
                                        that.pieData.early++;
                                        break;
                                    case 3:
                                        that.pieData.absent++;
                                        break;
                                    case 4:
                                        that.pieData.late++;
                                        break;
                                    case 5:
                                        that.pieData.vacation++;
                                        break;
                                }
                            }
                        })
                    });
                    console.log(that.pieData)
                   
               }else{   //时间人员都有
                    if(userType == 0){  //一人一天
                        return;
                    }else{  //一天一个部门
                        var unitname = '';
                        units.forEach((item) => {
                            if(item.unitNo == unit){
                                unitname = item.unit_name;
                            }
                        })
                        that.pieData.pieTitle = util.dateFormat(dt,'yyyy年MM月dd日') + unitname + '员工考勤统计';
                            users.forEach((userItem) => {
                                works.forEach((workItem) => {
                                    if(userItem.number == workItem.number && userItem.unit_no == unit && workItem.work_date == util.dateFormat(dt,'yyyy-MM-dd')){
                                        switch (workItem.work_state) {
                                            case 0:
                                                that.pieData.normal++;
                                                break;
                                            case 1:
                                                that.pieData.delay++;
                                                break;
                                            case 2:
                                                that.pieData.early++;
                                                break;
                                            case 3:
                                                that.pieData.absent++;
                                                break;
                                            case 4:
                                                that.pieData.late++;
                                                break;
                                            case 5:
                                                that.pieData.vacation++;
                                                break;
                                        }
                                    }
                                })
                            });
                            console.log(that.pieData)
                    }
               }
            } else if((month != "" && month != null)&&timeType == 1){    //1：一个月
            console.log(month);
                that.pieData.pieTitle = that.lineData.lineTitle = util.dateFormat(month,'yyyy年MM月') + '员工考勤统计';
                console.log(that.pieData.pieTitle)
                if((userType == 0&&person == null) ||(userType == 1&&unit == null)){    //第二个选项没有选,默认统计全体员工
                    var currentMonth = util.dateFormat(month,'yyyy-MM');
                    var res = [];
                    var normal = [],delay = [],early = [],late = [],absent = [],vacation = [];
                    var n = 0,d = 0,e = 0,l = 0,v = 0,a = 0;
                    works.forEach((workItem) => {
                        workItem.work_dmonth = workItem.work_date.slice(0,7);
                        if(workItem.work_month == currentMonth){
                            if(res.indexOf(workes[i].work_date)==-1){
                                res.push(workes[i].work_date);
                                res.sort();
                            }
                            console.log(res);
                            // switch (item.work_state) {
                            //     case 0:
                            //         that.pieData.normal++;
                            //         if(that.pieData.normal > 0){
                            //             if(dateItem == item.work_date){
                            //                 n++;
                            //                 normal[index] = n;
                            //             }
                            //         }else{
                            //             for(var r = 0;r < res.length;r++){
                            //                 normal[r] = 0;
                            //             }
                            //         }
                                    
                                    
                            //         break;
                            //     case 1:
                            //         that.pieData.delay++;
                            //         if(that.pieData.delay > 0){
                            //             if(dateItem == item.work_date){
                            //                 d++;
                            //                 delay[index] = d;
                            //             }
                            //         }else{
                            //             for(var r = 0;r < res.length;r++){
                            //                 delay[r] = 0;
                            //             }
                            //         }
                                    
                            //         break;
                            //     case 2:
                            //         that.pieData.early++;
                            //         if(that.pieData.early > 0){
                            //             if(dateItem == item.work_date){
                            //                 e++;
                            //                 early[index] = e;
                            //             }
                            //         }else{
                            //             for(var r = 0;r < res.length;r++){
                            //                 early[r] = 0;
                            //             }
                            //         }
                                    
                            //         break;
                            //     case 3:
                            //         that.pieData.absent++;
                            //         if(that.pieData.absent > 0){
                            //             if(dateItem == item.work_date){
                            //                 a++;
                            //                 absent[index] = a;
                            //             }
                            //         }else{
                            //             for(var r = 0;r < res.length;r++){
                            //                 absent[r] = 0;
                            //             }
                            //         }
                                    
                            //         break;
                            //     case 4:
                            //         that.pieData.late++;
                            //         if(that.pieData.late > 0){
                            //             if(dateItem == item.work_date){
                            //                 l++;
                            //                 late[index] = l;
                            //             }
                            //         }else{
                            //             for(var r = 0;r < res.length;r++){
                            //                 late[r] = 0;
                            //             }
                            //         }
                                    
                            //         break;
                            //     case 5:
                            //         that.pieData.vacation++;
                            //         if(that.pieData.vacation > 0){
                            //             if(dateItem == item.work_date){
                            //                 v++;
                            //                 vacation[index] = v;
                            //             }
                            //         }else{
                            //             for(var r = 0;r < res.length;r++){
                            //                 vacation[r] = 0;
                            //             }
                            //         }
                                    
                            //         break;
                            //     default:
                            //         that.pieData.normal++;
                            //         if(that.pieData.normal > 0){
                            //             if(dateItem == item.work_date){
                            //                 n++;
                            //                 normal[index] = n;
                            //             }
                            //         }else{
                            //             for(var r = 0;r < res.length;r++){
                            //                 normal[r] = 0;
                            //             }
                            //         }
                                    
                            //         break;
                            // }
                            
                            res.forEach((dateItem,index) => {
                    if(item.work_date.slice(0,7) == currentMonth){
                        switch (item.work_state) {
                            case 0:
                                that.pieData.normal++;
                                if(that.pieData.normal > 0){
                                    if(dateItem == item.work_date){
                                        n++;
                                        normal[index] = n;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        normal[r] = 0;
                                    }
                                }
                                
                                
                                break;
                            case 1:
                                that.pieData.delay++;
                                if(that.pieData.delay > 0){
                                    if(dateItem == item.work_date){
                                        d++;
                                        delay[index] = d;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        delay[r] = 0;
                                    }
                                }
                                
                                break;
                            case 2:
                                that.pieData.early++;
                                if(that.pieData.early > 0){
                                    if(dateItem == item.work_date){
                                        e++;
                                        early[index] = e;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        early[r] = 0;
                                    }
                                }
                                
                                break;
                            case 3:
                                that.pieData.absent++;
                                if(that.pieData.absent > 0){
                                    if(dateItem == item.work_date){
                                        a++;
                                        absent[index] = a;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        absent[r] = 0;
                                    }
                                }
                                
                                break;
                            case 4:
                                that.pieData.late++;
                                if(that.pieData.late > 0){
                                    if(dateItem == item.work_date){
                                        l++;
                                        late[index] = l;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        late[r] = 0;
                                    }
                                }
                                
                                break;
                            case 5:
                                that.pieData.vacation++;
                                if(that.pieData.vacation > 0){
                                    if(dateItem == item.work_date){
                                        v++;
                                        vacation[index] = v;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        vacation[r] = 0;
                                    }
                                }
                                
                                break;
                            default:
                                that.pieData.normal++;
                                if(that.pieData.normal > 0){
                                    if(dateItem == item.work_date){
                                        n++;
                                        normal[index] = n;
                                    }
                                }else{
                                    for(var r = 0;r < res.length;r++){
                                        normal[r] = 0;
                                    }
                                }
                                
                                break;
                        }
                    }
                    
                });
                        }
                    });
                    console.log(that.pieData);

                }else{

                }
            }
        },
    },
     created:function(){
        this.getData();
    }
}
</script>

