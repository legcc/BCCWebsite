<template>
    <div ref="csPie" class="courses_pie"></div>
</template>
<script>
    import echarts from 'echarts'
    import utils  from '~/plugins/utils'
    export default {
        props: {
            option: {
                type: Object,
                default: _ => {
                }
            }
        },
        data() {
            return {
                // 初始化空对象
                chart: null
            }
        },
        methods: {
            // 绘图
            drawGraph(id) {
                // 绘图方法
                this.chart = echarts.init(this.$refs.csPie)
                // 皮肤添加同一般使用方式
                this.chart.showLoading()
                // set
                this.chart.setOption(this.myOption);
                this.chart.hideLoading()
            }
        },
        created () {
        },
        mounted() {
            this.$nextTick(function () {
                this.drawGraph('courses_pie')
            })
        },
        computed: {
            myOption(){
                return {
                    series: [{
                        type: 'pie',
                        radius: ['90%', '100%'],
                        label: {
                            normal: {
                                position: 'center'
                            }
                        },
                        data: [{
                            value: 100 - (this.option.courseProgress || 0),
                            name: 'Courses',
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    textStyle: {
                                        fontSize: 14,
                                        color: '#607592',
                                        fontFamily: 'GothamRounded-Medium'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ebeaf7'
                                }
                            },
                            hoverAnimation: false
                        }, {
                            value: (this.option.courseProgress || 0),
                            name: 'Courses',
                            label: {
                                normal: {
                                    formatter: '+{d}%',
                                    textStyle: {
                                        fontSize: 16,
                                        color: '#ff9b27',
                                        fontFamily: 'GothamRounded-Medium'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ed7d31'
                                }
                            },
                            hoverAnimation: false
                        }]
                    }]
                }
            }
        },
        watch: {
            option(){
                this.chart.setOption(this.myOption);
            }
        }
    }
</script>

<style lang="less" scoped>
    .courses_pie {
        width: 100%;
        height: 100%;
    }
</style>