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
                    <Button type="primary" size="default" icon="ios-trash-outline" @click="reset">重置</Button>
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
    created(){
        this.getData();
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
        //重置
        reset(){
            this.chartFilter = {
                timeType:0,
                userType:0,
                date:null,
                month:null,
                unit:null,
                person:null
            };
        },
        //根据月份查所有员工的饼状图和折线图
        monthPieAndLine: function(currentMonth,workes){
            // console.log(currentMonth)
            var that = this;
            var normal = [],delay = [],early = [],late = [],absent = [],vacation = [];
            var n = 0,d = 0,e = 0,l = 0,v = 0,a = 0;
            var res = [],res2 = [],i = 0,k = 0;
            that.pieData = {
                normal:0,
                early: 0,
                vacation: 0,
                delay: 0,
                absent: 0,
                late: 0
            };
            //日期去重并排序
            for(i=0;i<workes.length;i++){
                if(res.indexOf(workes[i].work_date)==-1){
                    res.push(workes[i].work_date);
                    res.sort();
                }
            }

            //日期分月
            for(i = 0;i < res.length; i++){
                if(res2.indexOf(res[i].slice(0,7)) == -1){
                    res2.push(res[i].slice(0,7));
                    res2.sort();
                }
            }
            res2.forEach((item,index) => {
                if(item == currentMonth){
                    k = index;
                }else if(index == res2.length+1){
                    k = -1;
                }
            })

            //日期分月排序
            var diff = res[0].slice(0,7);
            var objMonth = [],arr = [];
            for(i = 0;i < res.length;i++){
                if(res[i].slice(0,7) == diff){
                    arr.push(res[i]);
                }else{
                    diff = res[i].slice(0,7);
                    objMonth.push(arr);
                    arr = [];
                    arr.push(res[i]);
                }
            }
            objMonth.push(arr);
            //判断是否存在当前查询月的数据
            if(k == -1){
                this.$Message.error('暂无相关数据');
                return;
            }
            //筛选出当月的不同考勤状态的总人数，以及当月不同日期不同考勤状态的人数
            objMonth[k].forEach((dateItem,index) => {
                that.pieData = {
                    normal:0,
                    early: 0,
                    vacation: 0,
                    delay: 0,
                    absent: 0,
                    late: 0
                };
                n = 0;d = 0;e = 0;l = 0;v = 0;a = 0;
                normal[index] = 0;late[index] = 0;early[index] = 0;delay[index] = 0;vacation[index] = 0;absent[index] = 0;
                workes.forEach((item,workIndex) => {
                    that.switchWorkState(item.work_state);
                    if(dateItem == item.work_date){
                        switch (item.work_state) {
                            case 0:
                                normal[index]++;
                            break;
                            case 1:
                                delay[index]++;
                            break;
                            case 2:
                                early[index]++;
                            break;
                            case 3:
                                absent[index]++;
                            break;
                            case 4:
                                late[index]++;
                            break;
                            case 5:
                                vacation[index]++;
                            break;
                            default:break;
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
            // console.log(that.pieData)
        },
        //考勤状态分类switch
        switchWorkState: function(index){
            var that = this;
                switch (index) {
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
        },
        getData: function() {
            this.unitJSON = unitJSON[0].unit;
            this.personJSON = personJSON[0].users;
            var persons = personJSON[0].users;
            var managers = managerJSON[0].manager;
            var workes = workJSON[0].work;
            var that = this;
            this.pieTitle = this.lineTitle = '所有员工本月考勤统计';
            var currentMonth = '2018-05';
            this.monthPieAndLine(currentMonth,workes);
        },

        search: function() {
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

            if ((dt != "" && dt != null)&&timeType == 0) {    //0：一天:，0：日期
            console.log("日期")
                that.pieData = {
                        normal:0,
                        early: 0,
                        vacation: 0,
                        delay: 0,
                        absent: 0,
                        late: 0
                    };
               if(person == null && unit == null){//第二个条件未选择,即没有选人员，默认全部员工
                    console.log("日期+null")
                    that.pieTitle = util.dateFormat(dt,'yyyy年MM月dd日') + '员工考勤统计';
                    works.forEach((work) => {
                         users.forEach((user) => {
                             if(work.number == user.number && work.work_date == util.dateFormat(dt,'yyyy-MM-dd')){
                                that.switchWorkState(work.work_state);
                            }
                        })
                    });
               }else{   //日期人员都有
                    if(userType == 0){  //一人一天
                    console.log("日期+人员")
                        return;
                    }else{  //一天一个部门
                    console.log("日期+部门")
                        var unitname = '';
                        units.forEach((item) => {
                            if(item.unitNo == unit){
                                unitname = item.unit_name;
                            }
                        })
                        that.pieTitle = util.dateFormat(dt,'yyyy年MM月dd日') + unitname + '考勤统计';
                            users.forEach((userItem) => {
                                works.forEach((workItem) => {
                                    if(userItem.number == workItem.number && userItem.unit_no == unit && workItem.work_date == util.dateFormat(dt,'yyyy-MM-dd')){
                                        that.switchWorkState(workItem.work_state);
                                    }
                                })
                            });
                    }
               }
            } else if((month != "" && month != null)&&timeType == 1){    //1：一个月，1：月份
            console.log("月份")
                that.pieData = {
                        normal:0,
                        early: 0,
                        vacation: 0,
                        delay: 0,
                        absent: 0,
                        late: 0
                    };
                that.pieTitle = that.lineTitle = util.dateFormat(month,'yyyy年MM月') + '员工考勤统计';
                if(person == null && unit == null){    //第二个选项没有选,默认统计全体员工
                    that.pieTitle = that.lineTitle = util.dateFormat(month,'yyyy年MM月') + '员工考勤统计';
                    console.log("月份+null")
                    var currentMonth = util.dateFormat(month,'yyyy-MM');
                    that.monthPieAndLine(currentMonth,works);

                }else{  
                    var currentMonth = util.dateFormat(month,'yyyy-MM');
                    if(userType == 0){  //一个月某个员工的饼状图
                        console.log("月份+员工")
                        var username = '';
                        users.forEach(item => {
                            if(item.number == person){
                                username = item.name;
                            }
                        })
                        that.pieTitle = util.dateFormat(month,'yyyy年MM月') +username + '考勤统计';
                        works.forEach((workItem) => {
                            if(workItem.work_date.slice(0,7) == currentMonth && workItem.number == person){
                                that.switchWorkState(workItem.work_state);
                            }
                        });
                    }else{      //一个月某个部门的考勤折线图和饼状图
                        console.log("月份+部门")
                        var unitname = '';
                        var choosePeople = [];
                        units.forEach((item) => {
                            if(item.unitNo == unit){
                                unitname = item.unit_name;
                            }
                        })
                        that.pieTitle = that.lineTitle = util.dateFormat(month,'yyyy年MM月') + unitname + '考勤统计';
                        users.forEach(itemUser => {
                            if(itemUser.unit_no == unit){
                                choosePeople.push(itemUser);
                            }
                        })
                        var workData = [];
                        works.forEach(workItem => {
                            choosePeople.forEach( userItem => {
                                if(userItem.number == workItem.number){
                                    workData.push(workItem);
                                }
                            })
                        });
                        that.monthPieAndLine(month,workData);
                    }
                }
            }
        },
    },
}
</script>

