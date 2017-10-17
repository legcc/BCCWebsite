<template>
    <div ref="kindType" class="kind-multi"></div>
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
                // 初始化空对象
                chart: null
            }
        },
        methods: {
            // 绘图
            drawGraph(id) {
                // 绘图方法
                this.chart = echarts.init(this.$refs.kindType)
                // 皮肤添加同一般使用方式
                this.chart.showLoading()
                // set
                this.chart.setOption(this.myOption)
                this.chart.hideLoading()
            }
        },
        created(){
        },
        watch: {
            option(){
                this.chart.setOption(this.myOption)
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.drawGraph('kind-multi')
            })
        },
        computed: {
            exerciseProgressOption(){
                return this.option.exerciseProgress || {}
            },
            myOption(){
                return {
                    series: [{
                        center: ['25.0%', '27%'],
                        radius: ['40%', '46%'],
                        hoverAnimation: false,
                        type: 'pie',
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [{
                            value: 100 - (this.exerciseProgressOption.listening || 0),
                            name: 'Listening',
                            label: {
                                normal: {
                                    position: 'center',
                                    show: true,
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
                        }, {
                            value: (this.exerciseProgressOption.listening || 0),
                            name: 'Listening',
                            label: {
                                normal: {
                                    position: 'center',
                                    show: true,
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
                            }
                        }]
                    }, {
                        center: ['75.0%', '27%'],
                        radius: ['40%', '46%'],
                        hoverAnimation: false,
                        type: 'pie',
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [{
                            value: 100 - (this.exerciseProgressOption.speaking || 0),
                            name: 'Speaking',
                            label: {
                                normal: {
                                    position: 'center',
                                    show: true,
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
                            }
                        }, {
                            value: (this.exerciseProgressOption.speaking || 0),
                            name: 'Speaking',
                            label: {
                                normal: {
                                    position: 'center',
                                    show: true,
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
                                    color: '#ffc000'
                                }
                            }
                        }]
                    }, {
                        center: ['25.0%', '77%'],
                        radius: ['40%', '46%'],
                        hoverAnimation: false,
                        type: 'pie',
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [{
                            value: 100 - (this.exerciseProgressOption.reading || 0),
                            name: 'Reading',
                            label: {
                                normal: {
                                    position: 'center',
                                    show: true,
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
                            }
                        }, {
                            value: (this.exerciseProgressOption.reading || 0),
                            name: 'Reading',
                            label: {
                                normal: {
                                    position: 'center',
                                    show: true,
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
                                    color: '#70ad47'
                                }
                            }
                        }]
                    }, {
                        center: ['75.0%', '77%'],
                        radius: ['40%', '46%'],
                        hoverAnimation: false,
                        type: 'pie',
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [{
                            value: 100 - (this.exerciseProgressOption.writting || 0),
                            name: 'Writing',
                            label: {
                                normal: {
                                    position: 'center',
                                    show: true,
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
                            }
                        }, {
                            value: (this.exerciseProgressOption.writting || 0),
                            name: 'Writing',
                            label: {
                                normal: {
                                    position: 'center',
                                    show: true,
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
                                    color: '#41aebd'
                                }
                            }
                        }]
                    }]
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    /*.multi-list {*/
    /*width: 1.29rem;*/
    /*height: 1.2rem;*/
    /*display: inline-block;*/
    /*margin: .05rem .05rem 0rem .05rem;*/
    /*}*/
    .kind-multi {
        width: 100%;
        height: 100%;
    }
</style>
