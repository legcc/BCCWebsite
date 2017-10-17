<template>
    <div ref="htgm" class="bar-graph"></div>
</template>

<script>
    import echarts from 'echarts'
    import utils  from '~/plugins/utils'
    export default {
        props: {
            //如果父级元素传递的是option则会整体刷新表图
            option: {
                type: Object,
                default(){
                    return {};
                }
            }
        },
        data () {
            return {};
        },
        methods: {
            // 绘图
            drawGraph(id) {
                // 绘图方法
                this.chart = echarts.init(this.$refs.htgm);
                // 皮肤添加同一般使用方式
                this.chart.showLoading();
                // set
                this.chart.setOption(this.myOption);
                this.chart.hideLoading();
            }
        },
        created(){
        },
        mounted() {
            this.$nextTick(function () {
                this.drawGraph('bar-graph');
            })
        },
        watch: {
            option(){
                this.chart.setOption(this.myOption);
            }
        },
        computed: {
            starProgressOption(){
                return this.option.starProgress || {};
            },
            myOption(){
                return {
                    xAxis: [{
                        name: '(Exercises)',
                        nameTextStyle: {'color': '#79788F'},
                        axisLine: {
                            onZero: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#EBEDF6'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#737479',
                                fontSize: 14,
                                fontFamily: 'GothamRounded-Light'
                            }
                        },
                        data: ['Listening', 'Speaking', 'Reading', 'Writing']
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '(Num)',
                        nameTextStyle: {'color': '#79788F'},
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
                        x: 70,
                        y: 50,
                        x2: 75,
                        y2: 25
                    },
                    series: [{
                        type: 'bar',
                        barWidth: '15%',
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
                                color: '#ed7d31'
                            }
                        },
                        data: [this.starProgressOption.listening, this.starProgressOption.speaking, this.starProgressOption.reading, this.starProgressOption.writting]
                    }]
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .bar-graph {
        width: 100%;
        height: 100%;
    }
</style>
