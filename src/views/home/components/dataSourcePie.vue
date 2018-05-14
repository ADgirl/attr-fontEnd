<template>
    <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'dataSourcePie',
    props:{
        pieTitle:{
            type: String,
            default: '所有员工'
        },
        pieData: {
            type: Object,
            default: () => {
                return {
                    normal:0,
                    early: 0,
                    vacation: 0,
                    delay: 0,
                    absent: 0,
                    late: 0
                }
            }
        }
    },
    data () {
        return {
            //
        };
    },
    computed:{
        pt: function(){
            return this.pieTitle;
        }
    },
    watch:{
        pt(newValue,old){
            console.log(newValue,old)
        }
    },
    mounted () {
        var that = this;
        this.$nextTick(() => {
            var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
            const option = {
                title:{
                    text:that.pieTitle,
                    left:'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: ['正常', '早退', '休假', '加班', '旷工','迟到']
                },
                series: [
                    {
                        name: that.pieTitle,
                        type: 'pie',
                        radius: '66%',
                        center: ['50%', '60%'],
                        data: [
                            {value: that.pieData.normal, name: '正常', itemStyle: {normal: {color: '#9bd598'}}},
                            {value: that.pieData.early, name: '早退', itemStyle: {normal: {color: '#ffd58f'}}},
                            {value: that.pieData.vacation, name: '休假', itemStyle: {normal: {color: '#abd5f2'}}},
                            {value: that.pieData.delay, name: '加班', itemStyle: {normal: {color: '#ab8df2'}}},
                            {value: that.pieData.absent, name: '旷工', itemStyle: {normal: {color: '#e14f60'}}},
                            {value: that.pieData.late, name: '迟到', itemStyle: {normal: {color: '#FF6347'}}}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
                dataSourcePie.resize();
            });
        });
    }
};
</script>
