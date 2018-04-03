<style lang="less" scoped>
    @import './attr-chart.less';
</style>
<template>
    <div class="chart-content">
        <Card>
            <Form slot="title" inline :label-width="100" :model="chartFilter" class="chart-content-title">
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
                        <Select v-model="chartFilter.unit" style="width:100px">
                            <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Select v-show="chartFilter.title2 == 0" v-model="chartFilter.person" style="width:100px">
                            <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    
                </FormItem>
            </Form>
            <div class="chart-body">
                <Row class="margin-bottom-10">
                    <Col span="12" :style="{height:height+'px','overflow-x':'auto'}">
                        <div class="data-source-row">
                            <data-source-pie></data-source-pie>
                        </div>
                    </Col>
                    <Col :style="{height:height+'px','overflow-x':'auto'}" span="12">
                        <div class="line-chart-con">
                            <service-requests></service-requests>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
</template>
<script>
import alCascader from '../../my-components/area-linkage/components/al-cascader.vue';
import dataSourcePie from '../../home/components/dataSourcePie.vue';
import serviceRequests from '../../home/components/serviceRequests.vue';

export default {
    name: 'attrChart',
    components: {
        alCascader,
        dataSourcePie,
        serviceRequests
    },
    data(){
        return{
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
                title:0,
                title2:0,
                date:'',
                person:[],
                person:null
            }
        }
    },
    mounted: function(){
        this.height = document.body.scrollHeight - 275;
    }
}
</script>

