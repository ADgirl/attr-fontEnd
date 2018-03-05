<style lang="less" scoped>
    @import './attr-chart.less';
</style>
<template>
    <div class="chart">
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
            <div>
                <Row class="margin-top-10">
                    <Col span="12" style="height:250px;">
                        <!-- <Card>
                            <p slot="title" class="card-title">
                                <Icon type="ios-pulse-strong"></Icon>
                                数据来源统计
                            </p> -->
                            <div class="data-source-row">
                                <data-source-pie></data-source-pie>
                            </div>
                        <!-- </Card> -->
                    </Col>
                <!-- </Row>
                <Row class="margin-top-10"> -->
                    <Col style="height:250px;" span="12">
                        <!-- <Card>
                            <p slot="title" class="card-title">
                                <Icon type="ios-shuffle-strong"></Icon>
                                上周每日服务调用量(万)
                            </p> -->
                            <div class="line-chart-con">
                                <service-requests></service-requests>
                            </div>
                        <!-- </Card> -->
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
    }
}
</script>

