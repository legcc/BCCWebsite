<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="theme-2" v-if="templateStyle==='level-2'">
            <div class="container">
                <div class="top-content">
                    <span class="pinyin">{{content.sentence}}</span>
                </div>
                <div class="answer">
                    <ul class="list">
                        <li v-for="(item,index) in answerEle" class="list-item" @click="cancelHandler(index,item)">
                            <ul class="word">
                                <li>{{item.pinyin}}</li>
                                <li>{{item.chinese}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="bottom">
                    <ul class="list">
                        <li v-for="(item,index) in content.words" v-if="answerArr[index]!==item.order" class="list-item"
                            @click="answerHandler(index,item)">
                            <ul class="word">
                                <li>{{item.pinyin}}</li>
                                <li>{{item.chinese}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="theme-1" v-if="templateStyle==='level-1'">
            <div class="container">
                <div class="top-content">
                    <span class="pinyin">{{content.sentence}}</span>
                </div>
                <div class="answer">
                    <ul class="list">
                        <li v-for="(item,index) in answerEle" class="list-item" @click="cancelHandler(index,item)">
                            <ul class="word">
                                <li>{{item.pinyin}}</li>
                                <li>{{item.chinese}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="bottom">
                    <ul class="list">
                        <li v-for="(item,index) in content.words" v-if="answerArr[index]!==item.order" class="list-item"
                            @click="answerHandler(index,item)">
                            <ul class="word">
                                <li>{{item.pinyin}}</li>
                                <li>{{item.chinese}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-else>
            <div class="coming-soon"></div>
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
                contentInfo: state => state.contentInfo,
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
                    answerArr: [],
                    answerEle: [],
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
        isUpdate = false;
        answerArr = [];
        answerEle = [];

        answerHandler(index, item) {
            if (!this.answerArr[index]) {
                item = R.clone(item);
                Vue.set(this.answerArr, index, item.order);
                this.answerEle.push(item);
                Vue.set(this, "answerEle", this.answerEle);
            }
            this.checkAnswer();
        }

        checkAnswer() {
            const orderArr = R.map(R.prop('order'))(this.answerEle);
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            if (orderArr.length === R.split(",")(this.content.answerOrder[0]).length) {
                const answer = R.any(R.pipe(R.split(","), R.equals(orderArr)))(this.content.answerOrder);
                this.setAnswer({
                    answer,
                    msg: this.content.answerOrder && this.content.words && `${
                        R.pipe(R.map(R.pipe(
                            R.split(","),
                            R.pipe(
                                R.map(
                                    item => R.pipe(R.find(R.propEq('order', item)), or(R.prop('chinese'), R.prop('english'), R.prop('pinyin')))(this.content.words)
                                ), R.join(""))
                            )
                        ), R.join(""))(this.content.answerOrder)}`
                });
            } else {
                this.setAnswer({
                    answer: false,
                    msg: this.content.answerOrder && this.content.words && `${
                        R.pipe(R.map(R.pipe(
                            R.split(","),
                            R.pipe(
                                R.map(
                                    item => R.pipe(R.find(R.propEq('order', item)), or(R.prop('chinese'), R.prop('english'), R.prop('pinyin')))(this.content.words)
                                ), R.join(""))
                            )
                        ), R.join(""))(this.content.answerOrder)}`
                });
            }
        }

        init() {
            this.$nextTick(_ => {
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                this.setAnswer({
                    answer: false,
                    msg: this.content.answerOrder && this.content.words && `${
                        R.pipe(R.map(R.pipe(
                            R.split(","),
                            R.pipe(
                                R.map(
                                    item => R.pipe(R.find(R.propEq('order', item)), or(R.prop('chinese'), R.prop('english'), R.prop('pinyin')))(this.content.words)
                                ), R.join(""))
                            )
                        ), R.join(""))(this.content.answerOrder)}`
                });

            })
        }

        mounted() {
            this.init();
        }

        cancelHandler(index, item) {
            Vue.set(this.answerArr, R.findIndex(R.propEq('order', item.order))(this.content.words), "");
            this.answerEle = R.remove(index, 1, this.answerEle);
            this.checkAnswer();
        }

    }
</script>
<style lang="less" scoped>
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

    .theme-2 {
        .container {
            min-width: 7rem;
            text-align: center;
            .top-content {
                width: 5rem;
                min-height: .5rem;
                line-height: .5rem;
                font-family: GothamRounded-Book;
                font-weight: bold;
                font-style: normal;
                font-size: 26px;
                color: #ffffff;
                text-align: center;
                padding: 20px 70px;
                margin: 60px auto auto auto;
                background: url("~~assets/img/exercise/level2/juzi.png") no-repeat;
                background-size: 100% 100%;
                .pinyin {
                    vertical-align: middle;
                    line-height: 1.2;
                    display: inline-block;
                }
            }
            .answer {
                min-width: 700px;
                height: 100px;
                display: inline-block;
                background: url("~~assets/img/exercise/level2/tengtiao.png") no-repeat;
                background-size: 100% 100%;
                background-position: left bottom;
                margin: 90px auto auto auto;
                padding-bottom: 100px;
                position: relative;
                .list-item {
                    display: inline-block;
                    width: 100px;
                    height: 40px;
                    cursor: pointer;
                    line-height: 40px;
                    background: url("~~assets/img/exercise/level2/pit.png") no-repeat;
                    background-size: 100% 100%;
                    padding: 10px 20px;
                    text-align: center;
                    border-radius: 10px;
                    position: relative;
                    font-size: 16px;
                    margin: 20px 5px;
                    .word {
                        color: #ffffff;
                        display: inline-block;
                        line-height: 1.3;
                        vertical-align: middle;
                    }
                }
            }
            .bottom {
                text-align: center;
                .list {
                    width: 700px;
                    margin: 0 auto;
                }
                .list-item {
                    display: inline-block;
                    cursor: pointer;
                    width: 180px;
                    height: 60px;
                    background: url("~~assets/img/exercise/level2/pit.png") no-repeat;
                    background-size: 100% 100%;
                    padding: 10px 20px;
                    text-align: center;
                    border-radius: 10px;
                    position: relative;
                    font-family: GothamRounded-Book;
                    margin: 20px 5px;
                    .word {
                        color: #ffffff;
                        font-family: GothamRounded-Book;
                        position: absolute;
                        top: 50%;
                        font-size: 20px;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                }
            }

        }
    }

    .theme-1 {
        .container {
            min-width: 7rem;
            text-align: center;
            .top-content {
                width: 5rem;
                min-height: .5rem;
                line-height: .5rem;
                font-family: GothamRounded-Book;
                font-weight: bold;
                font-style: normal;
                font-size: 26px;
                color: #482c2c;
                text-align: center;
                padding: 60px 70px;
                margin: 60px auto auto auto;
                background: url("~~assets/img/exercise/text-bg.png") no-repeat;
                background-size: 100% 100%;
                .pinyin {
                    vertical-align: middle;
                    line-height: 1.2;
                    display: inline-block;
                }
            }
            .answer {
                min-width: 700px;
                min-height: 100px;
                display: inline-block;
                background: url("~~assets/img/exercise/text-bg.png") no-repeat;
                background-size: 100% 100%;
                background-position: left bottom;
                margin: 30px auto;
                padding: 30px;
                position: relative;
                .list-item {
                    display: inline-block;
                    min-width: 50px;
                    height: 50px;
                    cursor: pointer;
                    background: url("~~assets/img/main_content/exercise/cloud.png") no-repeat;
                    background-size: 100% 100%;
                    padding: .3rem;
                    text-align: center;
                    border-radius: 10px;
                    position: relative;
                    font-size: 18px;
                    margin: 20px 5px;
                    .word {
                        color: #0b2f49;
                        display: inline-block;
                        line-height: 1.3;
                        vertical-align: middle;
                    }
                }
            }
            .bottom {
                text-align: center;
                .list {
                    width: 700px;
                    margin: 0 auto;
                }
                .list-item {
                    display: inline-block;
                    width: 100px;
                    height: 100px;
                    cursor: pointer;
                    background: url("~~assets/img/main_content/exercise/cloud.png") no-repeat;
                    background-size: 100% 100%;
                    padding: 10px 20px;
                    text-align: center;
                    border-radius: 10px;
                    position: relative;
                    font-family: GothamRounded-Book;
                    margin: 20px 5px;
                    .word {
                        color: #0b2f49;
                        font-family: GothamRounded-Book;
                        position: absolute;
                        top: 50%;
                        font-size: 22px;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                }
            }

        }
    }

    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
    }

</style>