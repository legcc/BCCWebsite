<template>
    <div ref="star" class="star_contrast"></div>
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
        created(){
        },
        methods: {
            // 绘图
            drawGraph(id) {
                // 绘图方法
                this.chart = echarts.init(this.$refs.star);
                // 皮肤添加同一般使用方式
                this.chart.showLoading();
                // set
                this.chart.setOption(this.myOption);
                this.chart.hideLoading();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.drawGraph('star_contrast');
            })
        },
        watch: {
            option(){
                this.chart.setOption(this.myOption);
            }
        },
        computed: {
            labels(){
                const names = [];
                if (this.option.earnedStars) {
                    this.option.earnedStars.count.forEach(item => {
                        names.push(item.classname);
                    })
                }
                return names;
            },
            yData(){
                const data = [];
                const color = ['#ed7d31', '#ffc000', '#70ad47', '#5b9bd5'];
                if (this.option.earnedStars) {
                    this.option.earnedStars.count.forEach((item, index) => {
                        data.push({
                            name: item.classname,
                            type: 'bar',
                            data: [item.listening, item.speaking, item.reading, item.writing],
                            barMaxWidth: '15%',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{c}%',
                                    textStyle: {
                                        color: color,
                                        fontFamily: 'GothamRounded-Light',
                                        fontSize: 12
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: color[index]
                                }
                            }
                        })
                    })
                }
                return data;
            },
            myOption(){
                return {
                    legend: {
                        data: this.labels,
                        align: 'right',
                        right: 10
                    },
                    xAxis: [{
                        type: 'category',
                        name: '(Exercises)',
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
                        data: ['Listening', 'Speaking', 'Reading', 'Writing']
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
                    series: this.yData
                };
            }
        }
    }
</script>
<style lang="less" scoped>
    .star_contrast {
        width: 100%;
        height: 100%;
    }
</style>