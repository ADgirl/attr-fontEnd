<style lang="less" scoped>
    @import './attr-table.less';
</style>
<template>
    <div>
        <Card>
            <Form slot="title" inline :label-width="100" :model="chartFilter">
                <FormItem prop="date">
                    <Select slot="label" v-model="chartFilter.title" style="width:100px">
                        <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <span>:</span>
                    <DatePicker type="month" placeholder="Select year-month" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem prop="person">
                    <Select slot="label" v-model="chartFilter.title2" style="width:100px">
                        <Option v-for="item in titleList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <span>:</span>
                    <Select v-model="chartFilter.unit" style="width:100px">
                        <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="chartFilter.person" style="width:100px">
                        <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <Table style="margin:2px;" :height="height" :columns="tableColumns" :data="tableData"></Table>
        </Card>
    </div>
</template>
<script>
export default {
    name:'attr-table',
    data(){
        return{
            height: 600,
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
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Age',
                    key: 'age'
                },
                {
                    title: 'Address',
                    key: 'address'
                }
            ],
            tableData: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04'
                },
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04'
                }
            ],

        }
    },
    mounted: function(){
        this.height = document.body.scrollHeight - 270;
    },
    methods:{

    }
}
</script>

