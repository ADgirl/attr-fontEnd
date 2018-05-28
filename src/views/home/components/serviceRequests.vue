<template>
    <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'serviceRequests',
    props:{
        lineTitle:{
            type:String,
            default: '所有员工'
        },
        lineData:{
            type: Object,
            default: () => {
                return{
                    nodeType: [],
                    dataArr: {
                        normal:[],
                        late:[],
                        early:[],
                        vacation: [],
                        absent: [],
                        delay: []
                    }
                }
            }
        }
    },
    computed:{
        pt: function(){
            return this.lineTitle;
        }
    },
    watch:{
        pt: function(n,o){
            console.log("更新line")
            if(n != o){
                var that = this;
                const option = {
                    title:{
                        text:that.lineTitle,
                        left:'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    grid: {
                        top: '4%',
                        left: '1.2%',
                        right: '1%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: that.lineData.nodeType
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '正常',
                            type: 'line',
                            // stack: '总量',
                            areaStyle: {normal: {
                                color: '#9bd598'
                            }},
                            data: that.lineData.dataArr.normal
                        },
                        {
                            name: '早退',
                            type: 'line',
                            // stack: '总量',
                            areaStyle: {normal: {
                                color: '#ffd58f'
                            }},
                            data: that.lineData.dataArr.early
                        },
                        {
                            name: '休假',
                            type: 'line',
                            // stack: '总量',
                            areaStyle: {normal: {
                                color: '#abd5f2'
                            }},
                            data: that.lineData.dataArr.vacation
                        },
                        {
                            name: '加班',
                            type: 'line',
                            // stack: '总量',
                            areaStyle: {normal: {
                                color: '#ab8df2'
                            }},
                            data: that.lineData.dataArr.delay
                        },
                        {
                            name: '旷工',
                            type: 'line',
                            // stack: '总量',
                            areaStyle: {normal: {
                                color: '#e14f60'
                            }},
                            data: that.lineData.dataArr.absent
                        },
                        {
                            name: '迟到',
                            type: 'line',
                            // stack: '总量',
                            areaStyle: {normal: {
                                color: '#FF6347'
                            }},
                            data: that.lineData.dataArr.late
                        }
                    ]
                };
                const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
                serviceRequestCharts.setOption(option);

                window.addEventListener('resize', function () {
                    serviceRequestCharts.resize();
                });
            }
        }
    },
    mounted () {
        var that = this;
        const option = {
            title:{
                text:that.lineTitle,
                left:'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                top: '4%',
                left: '1.2%',
                right: '1%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: that.lineData.nodeType
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '正常',
                    type: 'line',
                    // stack: '总量',
                    areaStyle: {normal: {
                        color: '#9bd598'
                    }},
                    data: that.lineData.dataArr.normal
                },
                {
                    name: '早退',
                    type: 'line',
                    // stack: '总量',
                    areaStyle: {normal: {
                        color: '#ffd58f'
                    }},
                    data: that.lineData.dataArr.early
                },
                {
                    name: '休假',
                    type: 'line',
                    // stack: '总量',
                    areaStyle: {normal: {
                        color: '#abd5f2'
                    }},
                    data: that.lineData.dataArr.vacation
                },
                {
                    name: '加班',
                    type: 'line',
                    // stack: '总量',
                    areaStyle: {normal: {
                        color: '#ab8df2'
                    }},
                    data: that.lineData.dataArr.delay
                },
                {
                    name: '旷工',
                    type: 'line',
                    // stack: '总量',
                    areaStyle: {normal: {
                        color: '#e14f60'
                    }},
                    data: that.lineData.dataArr.absent
                },
                {
                    name: '迟到',
                    type: 'line',
                    // stack: '总量',
                    areaStyle: {normal: {
                        color: '#FF6347'
                    }},
                    data: that.lineData.dataArr.late
                }
            ]
        };
        const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
        serviceRequestCharts.setOption(option);

        window.addEventListener('resize', function () {
            serviceRequestCharts.resize();
        });
    }
};
</script>