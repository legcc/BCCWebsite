<template>
    <div ref="main" class="charts-main"></div>
</template>

<script>
    import echarts from 'echarts'
    import {extend} from '~/plugins/utils'
    export default {
        props: {
            //如果父级元素传递的是option则会整体刷新表图
            option: Object,
            //如果是个回调函数则会使用默认的表图
            callback: Function
        },
        data () {
            return {
                chartInstance: {},
                defaultOption: {
                    pie: {
                        series: [{
                            type: 'pie',
                            radius: ['90%', '100%'],
                            label: {
                                normal: {
                                    position: "center"
                                }
                            },
                            data: [{
                                value: 80,
                                name: 'Courses',
                                itemStyle: {
                                    normal: {
                                        color: '#FB9902'
                                    }
                                },
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        textStyle: {
                                            fontSize: 16,
                                            color: '#737479',
                                            fontFamily: "GothamRounded-Medium"
                                        }
                                    }
                                },
                                hoverAnimation: false
                            }, {
                                value: 120,
                                label: {
                                    normal: {
                                        formatter: '+{d}%',
                                        textStyle: {
                                            color: '#F89A04',
                                            fontSize: 18,
                                            fontFamily: "GothamRounded-Medium"
                                        }
                                    }
                                },
                                tooltip: {
                                    show: false
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#ddd'
                                    }
                                },
                                hoverAnimation: false
                            }]
                        }]
                    }
                }
            }
        },
        methods: {
            async initChart(callback){
                this.chartInstance = echarts.init(this.$refs.main)
                if (callback) {
                    let param = await callback(),
                        chartType = param.chartType,
                        option = this.defaultOption[chartType]
                    extend(true, param, option)
                    this.chartInstance.setOption(param)
                }
            }
        },
        created(){
            this.$nextTick(() => {
                this.initChart(this.callback)
            })
        },
        watch: {
            option(newOption, oldOption) {
                this.chartInstance.setOption(newOption)
            }
        },
        computed: {}
    }
</script>

<style lang="less" scoped>
    body {
        font-size: 0.16rem;

        .charts-main {
            width: 1.32rem;
            height: 1.32rem;
        }

    }
</style>
