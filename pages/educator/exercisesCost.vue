<template>
    <div ref="csLine" class="courses_line"></div>
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
                    return {}
                }
            }
        },
        data () {
            return {
                chart: null,
            }
        },
        methods: {
            // 绘图
            drawGraph(id) {
                // 绘图方法
                this.chart = echarts.init(this.$refs.csLine)
                // 皮肤添加同一般使用方式
                this.chart.showLoading()
                // set
                this.chart.setOption(this.myOption)
                this.chart.hideLoading()
            },
        },
        created(){

        },
        mounted() {
            this.$nextTick(function () {
                this.drawGraph('courses_line')
            })
        },
        watch: {
            option(){
                this.chart.setOption(this.myOption)
            }
        },
        computed: {
            chartData(){
                const valueArr = [];
                const levelNameArr = [];
                let maxExerciseTime = 0;
                let xName = "";
                if (this.option.exerciseTime) {
                    if (this.option.exerciseTime.levels) {
                        for (let i in this.option.exerciseTime.levels) {
                            valueArr.push(this.option.exerciseTime.levels[i]);
                            levelNameArr.push(i);
                            if(this.option.exerciseTime.levels[i] &&
                                this.option.exerciseTime.levels[i] - maxExerciseTime > 0) {
                                maxExerciseTime = this.option.exerciseTime.levels[i];
                            }
                        }
                        xName = "(Level)";
                    } else if (this.option.exerciseTime.lessons) {
                        for (let i in this.option.exerciseTime.lessons) {
                            valueArr.push(this.option.exerciseTime.lessons[i]);
                            levelNameArr.push(i);
                            if(this.option.exerciseTime.lessons[i] &&
                                this.option.exerciseTime.lessons[i] - maxExerciseTime > 0) {
                                maxExerciseTime = this.option.exerciseTime.lessons[i];
                            }
                        }
                        xName = "(Lesson)";
                    } else {
                        for (let i in this.option.exerciseTime) {
                            valueArr.push(this.option.exerciseTime[i]);
                            levelNameArr.push(i);
                            if(this.option.exerciseTime[i] &&
                                this.option.exerciseTime[i] - maxExerciseTime > 0) {
                                maxExerciseTime = this.option.exerciseTime[i];
                            }
                        }
                        xName = "(Exercises)";
                    }
                }
                if(maxExerciseTime <= 5) {
                    return {
                        valueArr: valueArr,
                        maxTime: 5,
                        maxInterval: 1,
                        xName: xName,
                        levelNameArr: levelNameArr
                    };
                } else if(maxExerciseTime > 5 && maxExerciseTime <= 50) {
                    return {
                        valueArr: valueArr,
                        maxTime: Math.ceil(maxExerciseTime/5) * 5,
                        maxInterval: Math.ceil(maxExerciseTime/5),
                        xName: xName,
                        levelNameArr: levelNameArr
                    };
                } else {
                    return {
                        valueArr: valueArr,
                        maxTime: Math.ceil(Math.ceil(maxExerciseTime/10)/5) * 50,
                        maxInterval: Math.ceil(Math.ceil(maxExerciseTime/10)/5) * 10,
                        xName: xName,
                        levelNameArr: levelNameArr
                    };
                }
            },
            myOption(){
                return {
                    tooltip: {
                        trigger: 'item',
                        formatter: 'Level-{b} : {c}'
                    },
                    xAxis: [{
                        type: 'category',
                        name: this.chartData.xName,
                        nameTextStyle: {'color': '#79788F'},
                        boundaryGap: true,
                        data: this.chartData.levelNameArr,
                        axisTick: {
                            'show': false
                        },
                        axisLabel: {
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
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '(Avg Mins)',
                        nameTextStyle: {'color': '#79788F'},
                        min: 0,
                        max: this.chartData.maxTime,
                        interval: this.chartData.maxInterval,
                        axisTick: {
                            'show': false
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
                        x2: 55,
                        y2: 40
                    },
                    series: [{
                        type: 'line',
                        data: this.chartData.valueArr,
                        symbolSize: 10,
                        symbol: 'circle',
                        itemStyle: {
                            normal: {
                                color: '#41aebd',
                                lineStyle: {
                                    width: 5,
                                    color: '#41aebd'
                                }
                            }
                        }
                    }]
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .courses_line {
        width: 100%;
        height: 100%;
    }
</style>
