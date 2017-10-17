<template>
    <div>
        <div ref="all" class="all_contrast"></div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    import utils  from '~/plugins/utils'
    export default {
        props: {
            option: {
                type: Object,
                default(){
                    return {}
                }
            }
        },
        data () {
            return {
            }
        },
        methods: {
            // 绘图
            drawGraph(id) {
                // 绘图方法
                this.chart = echarts.init(this.$refs.all);
                // 皮肤添加同一般使用方式
                this.chart.showLoading();
                // set
                this.chart.setOption(this.myOption);
                this.chart.hideLoading();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.drawGraph('all_contrast');
            })
        },
        created(){
        },
        watch: {
            option(){
                this.chart.setOption(this.myOption);
            }
        },
        computed: {
            xData(){
                const names = [];
                this.option.courseProgress.forEach(item => {
                    names.push(item.name);
                });
                return names;
            },
            yData(){
                const data = [];
                this.option.courseProgress.forEach((item, index) => {
                    data.push(item.percentum);
                });
                return data;
            },
            myOption(){
                return {
                    legend: {
                        data: this.xData,
                        align: 'right',
                        right: 10
                    },
                    xAxis: [{
                        type: 'category',
                        name: '(Courses)',
                        nameTextStyle: {
                            'color': '#79788F'
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value} ',
                            textStyle: {
                                color: '#737479',
                                fontSize: 14,
                                fontFamily: 'GothamRounded-Light'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#EBEDF6'
                            }
                        },
                        data: this.xData
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '(Rate)',
                        nameTextStyle: {
                            'color': '#79788F'
                        },
                        max: 100,
                        min: 0,
                        interval: 25,
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value}% ',
                            textStyle: {
                                color: '#737479',
                                fontSize: 14,
                                fontFamily: 'GothamRounded-Light'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#EBEDF6'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#EBEDF6'
                            }
                        }
                    }, {
                        axisLine: {
                            lineStyle: {
                                color: '#EBEDF6'
                            }
                        }
                    }],
                    grid: {
                        x: 60,
                        y: 55,
                        x2: 74,
                        y2: 53,
                    },
                    series: [{
                        name: this.xData,
                        type: 'bar',
                        data: this.yData,
                        barMaxWidth: '25%',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{c}%',
                                textStyle: {
                                    color: '#737479',
                                    fontFamily: 'GothamRounded-Light',
                                    fontSize: 12,
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#8182BE'
                            }
                        }
                    }]
                };
            }
        }
    }
</script>
<style lang="less" scoped>
    .all_contrast {
        width: 7rem;
        height: 3.2rem;
        margin: 0 auto;
    }
</style>
