<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="theme-1" v-if="templateStyle==='level-1'">
            <div class="container">
                <ul class="list">
                    <li class="list-item" v-for="(item,index) in content.answers">
                        <div class="list-container" :class="activeIndex===index&&'active'"
                             @click="answerHandler(index,item.isRight)"
                        >
                            <em class="text"
                                :class="isMore(item,15)">{{item.english || item.chinese || item.pinyin}}</em>
                        </div>
                    </li>
                </ul>

                <div class="pit-cloud">
                    <ul>
                        <li>{{content.pinyin}}</li>
                        <li>{{content.chinese}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="theme-2" v-if="templateStyle==='level-2'">
            <div class="container">
                <div class="yezi" :class="isMore(content,10)">
                    <ul class="text">
                        <li v-if="content.english"><em>{{content.english}}</em></li>
                        <li v-if="content.chinese"><em>{{content.chinese}}</em></li>
                        <li v-if="content.pinyin"><em>{{content.pinyin}}</em></li>
                    </ul>
                </div>
                <ul class="answer" :class="content.answers&&content.answers.length>4&&'overflow'">
                    <li :class="activeIndex===index&&'active'" v-for="(item,index) in content.answers"
                        class="answer-item"
                        @click="answerHandler(index,item.isRight)">
                        <ul class="text">
                            <li v-if="item.english">{{item.english}}</li>
                            <li v-if="item.chinese">{{item.chinese}}</li>
                            <li v-if="item.pinyin">{{item.pinyin}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    @Component({
        components: {loadingImage},
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ])
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    activeIndex: ""
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600);
                this.init();
            }
        },
    })
    export default class chooseNumber extends Vue {
        activeIndex = "";
        isUpdate = false;

        init() {
            this.$nextTick(_ => {
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                this.setAnswer({
                    answer: false,
                    msg: this.content.answers && ` ${R.compose(R.map(or(R.prop('english'), R.prop('chinese'), R.prop('pinyin'))), R.defaultTo([]), R.filter(R.propEq('isRight', 'T')), R.defaultTo([]))(this.content.answers)}`
                });

            })
        }

        mounted() {
            this.init();
        }

        answerHandler(index, isRight) {
            this.activeIndex = index;
            this.setAnswer({
                answer: isRight === 'T',
                msg: ` ${R.compose(R.map(R.or(R.prop('english'), R.prop('chinese'), R.prop('pinyin'))), R.filter(R.propEq('isRight', 'T')))(this.content.answers)}`
            });
        }
    }
</script>

<style lang="scss" scoped>
    .fadeIn {
        animation: fadeIn .4s ease-in;
        transform: translateZ(0);
    }

    @keyframes fadeIn {
        from {
            transform-origin: left;
            transform: scaleX(.4);
            opacity: 0;
        }
    }

    .theme-1 {
        font-family: GothamRounded-Medium;
        text-align: center;
        .container {
            display: inline-block;
            margin: 20px 0;
            position: relative;
            .list-item {
                width: 50%;
                text-align: center;
                display: inline-block;
                @for $index from 1 to 5 {
                    &:nth-child(4n+#{$index}) .list-container {
                        background-image: url("~~assets/img/exercise/cloud-#{$index}.png");
                    }
                }
                .list-container {
                    margin-top: 50px;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    min-width: 208px;
                    min-height: 119px;
                    display: inline-block;
                    font-size: 26px;
                    line-height: 50px;
                    color: #381a80;
                    text-align: center;
                    padding: 10px 20px;
                    cursor: pointer;
                    &.active {
                        text-shadow: black 0px 1px;
                        transition: all .1s ease-in;
                        background-image: url("~~assets/img/exercise/cloud-active.png");
                    }
                    .text {
                        display: inline-block;
                        margin-top: 50px;
                        &.more {
                            font-size: 16px;
                        }
                    }
                }
            }
            .pit-cloud {
                margin: 0 auto;
                background: url("~~assets/img/exercise/pit-cloud.png") no-repeat;
                background-size: 100% 100%;
                /*11/7*/
                width: 2.68rem;
                height: 1.59rem;
                font-size: 26px;
                text-align: center;
                color: #381a80;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                ul {
                    position: absolute;
                    bottom: 30px;
                    color: black;
                    left: 50%;
                    transform: translateX(-50%);
                    text-shadow: 0 -2px 4px white;
                }
            }
        }
    }

    .theme-2 {
        text-align: center;
        .container {
            display: inline-block;
            margin-top: 50px;
            .yezi {
                width: 210px;
                height: .9rem;
                padding: 10px 0;
                line-height: .8rem;
                background: url("~~assets/img/exercise/level2/kuang.png") no-repeat;
                background-size: 100% 100%;
                margin: 0 auto;
                &.more {
                    width: 310px;
                }
                .text {
                    margin-top: 5px;
                    display: inline-block;
                    line-height: 1.2;
                }
                li {
                    text-align: center;
                    font-size: 28px;
                    color: #071f30;
                    em {
                        line-height: 1.2;
                        vertical-align: middle;
                    }

                }
            }
            .answer {
                margin-top: 20px;
                width: 600px;
                &.overflow {
                    width: 900px;
                }
                .answer-item {
                    display: inline-block;
                    text-align: center;
                    color: #ffffff;
                    min-width: 200px;
                    background: url("~~assets/img/exercise/level2/pit.png") no-repeat;
                    background-size: 100% 100%;
                    padding: 5px 10px;
                    border-radius: 5px;
                    line-height: 70px;
                    font-size: 26px;
                    margin: 10px 30px;
                    cursor: pointer;
                    &.active {
                        transition: all .2s ease-in;
                        background-image: none;
                        background-color: #20a0ff;
                        border-radius: 10px;
                    }
                    .text {
                        margin-top: 5px;
                        display: inline-block;
                        line-height: 1.2;
                    }
                }

            }
        }
    }
</style>