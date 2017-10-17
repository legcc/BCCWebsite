<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <ul class="question-container">
            <li v-for="item in content.sentences" class="question">
                <em v-if="item.chinese">{{item.chinese}}</em>
                <em v-else-if="item.pinyin">{{item.pinyin}}</em>
                <em v-else-if="item.english">{{item.english}}</em>
            </li>
        </ul>
        <ul class="answer-input">
            <li v-for="(arr,index) in answerArr">
                <div class="input" @click="chooseInput(index)" :class="selectIndex===index&&'active'">
                    <ul class="answer-option">
                        <li class="cloud" v-for="(item,itemIndex) in arr" @click="cancelOption(item,index,itemIndex)">
                            <ul class="text">
                                <li>{{item.pinyin}}</li>
                                <li>{{item.chinese}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <ul class="answer-option">
            <li class="cloud" v-for="(item,index) in content.answerWords" @click="chooseOption(item,index)">
                <ul class="text">
                    <li>{{item.pinyin}}</li>
                    <li>{{item.chinese}}</li>
                </ul>
            </li>
        </ul>
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
                    answerArr: [],
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
    export default class translateWords extends Vue {
        isUpdate = false;
        answerArr = [];
        selectIndex = null;

        created() {
            this.$nextTick(_ => {
                this.answerArr = this.content.sentences.map(item => []);
            });
        }

        mounted() {
            this.init();
        }

        chooseInput(index) {
            this.selectIndex = index;
        }

        chooseOption(item, index) {
            if (this.selectIndex !== null) {
                this.answerArr[this.selectIndex].push(item);
                this.checkAnswer();
            } else {
                this.$message.warning("Please select an input box first");
            }
        }

        init() {
            this.$nextTick(_ => {
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                this.setAnswer({
                    answer: false,
                    msg: this.content.answerOrders && `${R.join("\n")(R.map(
                        R.pipe(R.split(","),
                            R.map(item => ( R.pipe(R.find(R.propEq("order", item)), or(R.prop('chinese'), R.prop('pinyin'), R.prop('english')))(this.content.answerWords))
                            ), R.join("")
                        )
                    )(this.content.answerOrders))}`
                });

            })
        }

        checkAnswer() {
            const orderArr = R.map(R.map(R.prop("order")))(this.answerArr);
            const rightOrder = R.map(R.split(","))(this.content.answerOrders);
            const answer = R.equals(orderArr, rightOrder);
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            this.setAnswer({
                answer,
                msg: this.content.answerOrders && `${R.join("\n")(R.map(
                    R.pipe(R.split(","),
                        R.map(item => ( R.pipe(R.find(R.propEq("order", item)), or(R.prop('chinese'), R.prop('pinyin'), R.prop('english')))(this.content.answerWords))
                        ), R.join("")
                    )
                )(this.content.answerOrders))}`
            });
        }

        cancelOption(item, answerIndex, itemIndex) {
            Vue.set(this.answerArr, answerIndex, R.remove(itemIndex, 1)(this.answerArr[answerIndex]));
            this.checkAnswer();
        }
    }
</script>
<style lang="scss" scoped>
    @import "~~assets/sass/mixins";
    @import "~~assets/sass/functions";

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

    .container {
        text-align: center;
        font-family: GothamRounded-Book;
        margin-top: 40px;

        .question-container {
            font-size: 28px;
            color: #d451a2;
            text-align: left;
            display: inline-block;
            .question:not(:first-child) {
                margin-top: 10px;
            }
        }
        .answer-input {
            margin-top: 20px;
            .input {
                min-width: 500px;
                display: inline-block;
                border-bottom: 2px solid black;
                min-height: 120px;
                cursor: pointer;
                &.active {
                    transition: border .1s ease-in;
                    border-bottom: 2px solid #19bce9;
                }
                .cloud {
                    display: inline-block;
                    @include cloud(90px, 90px);
                    font-size: 16px;
                    cursor: pointer;
                    .text {
                        display: inline-block;
                        vertical-align: middle;
                        line-height: 1.4;
                    }
                }
            }
        }
        .answer-option {
            margin-top: 40px;

            .cloud {
                display: inline-block;
                font-size: 20px;
                font-family: GothamRounded-Medium;
                @include cloud(140px, 140px);
                cursor: pointer;
                .text {
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 1.4;
                }
            }
        }
    }

</style>