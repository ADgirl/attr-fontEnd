<style lang="less" scoped>
    @import './attr-table.less';
</style>
<template>
    <div class="attr-content">
        <Card>
            <Form slot="title" inline :label-width="100" :model="chartFilter" class="attr-content-title">
                <FormItem prop="date">
                    <Select slot="label" v-model="chartFilter.title" style="width:100px">
                        <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="margin-left:5px;line-height:51px;">
                        <span>:</span>
                        <DatePicker v-if="chartFilter.title == 1" type="month" placeholder="选择年月" style="width: 200px;"></DatePicker>
                        <DatePicker v-else type="date" placeholder="选择日期" style="width: 200px;"></DatePicker>
                    </div>
                </FormItem>
                <FormItem prop="person">
                    <Select slot="label" v-model="chartFilter.title2" style="width:100px">
                        <Option v-for="item in titleList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="margin-left:5px;line-height:51px;">
                        <span>:</span>
                        <Select v-model="chartFilter.unit" style="width:100px;">
                            <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Select v-show="chartFilter.title2 == 0" v-model="chartFilter.person" style="width:100px">
                            <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </FormItem>
            </Form>
            <Table border style="margin:2px;" highlight-row no-data-text="无数据" :height="height" :columns="tableColumns" :data="tableData"></Table>
        </Card>
    </div>
</template>
<script>
export default {
    name:'attr-table',
    data(){
        return{
            height: 600,
            remark:'',
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
                title:0,
                title2:0,
                date:'',
                person:[],
                person:null
            },
            tableColumns: [
                {
                    title: '员工编号',
                    key: 'number',
                    align:'center'
                },
                {
                    title: '姓名',
                    key: 'name',
                    align:'center'
                },
                {
                    title: '上班时间',
                    key: 'work_up_time',
                    align:'center',
                    render: (h,params) => {
                        if(params.row.work_up_time == ''){
                            return h('span',{},'—')
                        }else{
                            return h('span',{},params.row.work_up_time)
                        }
                    }
                },
                {
                    title: '下班时间',
                    key: 'work_dowm_time',
                    align:'center',
                    render: (h,params) => {
                        if(params.row.work_dowm_time == ''){
                            return h('span',{},'—')
                        }else{
                            return h('span',{},params.row.work_dowm_time)
                        }
                    }
                },
                {
                    title: '考勤状态',
                    key: 'work_state',   //0：正常，1：加班，2：早退，3：矿工，4：迟到，5：休假
                    align:'center',
                    render: (h, params) => {
                            const row = params.row;

                            let color = 'green';
                            let text = '正常';
                            switch (row.work_state) {
                                case 0:
                                    color = 'green';
                                    text = '正常';
                                    break;
                                case 1:
                                    color = 'blue';
                                    text = '加班';
                                    break;
                                case 2:
                                    color = 'red';
                                    text = '早退';
                                    break;
                                case 3:
                                    color = 'red';
                                    text = '旷工';
                                    break;
                                case 4:
                                    color = 'red';
                                    text = '迟到';
                                    break;
                                case 5:
                                    color = 'green';
                                    text = '休假';
                                    break;
                            
                                default:
                                    break;
                            }
                            
                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                },
                {
                    title: '备注',
                    key: 'update_remark',
                    align:'center',
                    render: (h,params) => {
                        const row = params.row;
                        let that = this;
                        if(row.update_remark == ''){
                            return h('Button',{
                                props:{
                                    type:'primary',
                                    size: 'small'
                                },
                                on:{
                                    click:function(){
                                        that.resetRemark(row);
                                    }
                                }
                            },'编辑')
                        }else{
                            return h('span',{},row.update_remark)
                        }
                    }
                }
            ],
            tableData: [
                {
                    number:'01',
                    name: '李白',
                    work_up_time: '2018-03-09 08:00',
                    work_dowm_time: '2018-03-09 18:00',
                    work_state: 0,
                    update_remark: ''
                },
                {
                    number:'02',
                    name: '李白2',
                    work_up_time: '2018-03-09 08:00',
                    work_dowm_time: '2018-03-09 21:00',
                    work_state: 1,
                    update_remark: ''
                },
                {
                    number:'03',
                    name: '李白3',
                    work_up_time: '2018-03-09 08:00',
                    work_dowm_time: '2018-03-09 17:00',
                    work_state: 2,
                    update_remark: ''
                },
                {
                    number:'04',
                    name: '李白4',
                    work_up_time: '',
                    work_dowm_time: '',
                    work_state: 3,
                    update_remark: ''
                },
                {
                    number:'05',
                    name: '李白5',
                    work_up_time: '2018-03-09 09:00',
                    work_dowm_time: '2018-03-09 18:00',
                    work_state: 4,
                    update_remark: ''
                },
                {
                    number:'06',
                    name: '李白6',
                    work_up_time: '',
                    work_dowm_time: '',
                    work_state: 5,
                    update_remark: ''
                }
            ],

        }
    },
    mounted: function(){
        this.height = document.body.scrollHeight - 270;
    },
    methods:{
        resetRemark: function(index){
            var that = this;
            this.$Modal.confirm({
                    title:'备注',
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.remark,
                                autofocus: true,
                                placeholder: '考勤备注说明'
                            },
                            on: {
                                input: (val) => {
                                    this.remark = val;
                                }
                            }
                        })
                    },
                    onOk: function(){
                        index.update_remark = that.remark;
                    }
                })
        }

    }
}
</script>

