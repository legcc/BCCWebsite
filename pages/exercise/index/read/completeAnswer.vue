<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <ul v-for="arr in optionArr" class="optionList">
            <li class="cloud" v-for="(item,index) in arr" :class="activeItem===item&&'active'"
                @click="chooseOption(item,index)">
                <ul class="text">
                    <li v-if="item.pinyin">{{item.pinyin}}</li>
                    <li v-if="item.chinese">{{item.chinese}}</li>
                </ul>
            </li>
        </ul>
        <div class="content">
            <div class="content-container">
                <ul v-for="(item,index) in content.sentences">
                    <li>
                        <ul class="text">
                            <li class="pinyin" v-html="getHtml(item.pinyin,index)"></li>
                            <li v-html="getHtml(item.chinese,index)"></li>
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
    export default class completeAnswer extends Vue {
        isUpdate = false;
        answerArr = [];
        activeItem = "";

        get optionArr() {
            const arr = [];
            this.content.answerWords.forEach((item, index) => {
                if ((index % 4) === 0) {
                    arr.push([]);
                }
                arr[arr.length - 1].push(item);
            });
            return arr;
        }

        chooseOption(item, index) {
            this.activeItem = item
        }

        created() {
            this.$nextTick(_ => {
                const pits = document.querySelectorAll(".answer-pit");
                const addEventListener = (event, fn, isPre = false) => {
                    return (item) => {
                        item.addEventListener(event, fn, isPre);
                    }
                };
                R.forEach(addEventListener("click", this.clickFn, false))(pits);
            })
        }

        mounted() {
            this.init();
        }

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.content.answerOrders && ` ${R.join("、")(R.head(R.map(
                        R.pipe(R.split(","),
                            R.map(item => ( R.pipe(R.find(R.propEq("order", item)), R.or(R.prop('chinese'), R.prop('pinyin'), R.prop('english')))(this.content.answerWords))
                            )
                        )
                    )(this.content.answerOrders)))}`
                });
            })
        }

        clickFn(ev) {
            const target = ev.target;
            const questionId = target.getAttribute("data-question");
            const answerId = target.getAttribute("data-answer");
            if (!this.answerArr[questionId]) {
                this.answerArr[questionId] = [];
            }
            if (!this.answerArr[questionId][answerId]) {
                this.answerArr[questionId][answerId] = this.activeItem.order;
                target.innerText = this.activeItem.chinese || "";
            } else {
                this.answerArr[questionId][answerId] = "";
                target.innerText = "";
            }
            const orderArr = [];
            this.answerArr.forEach(item => {
                if (item) {
                    item.forEach(item => {
                        if (item) {
                            orderArr.push(item);
                        }
                    })
                }
            });
            const answer = R.any(R.pipe(R.split(","), R.equals(orderArr)))(this.content.answerOrders);
            this.setAnswer({
                answer,
                msg: ` ${R.join("、")(R.head(R.map(
                    R.pipe(R.split(","),
                        R.map(item => ( R.pipe(R.find(R.propEq("order", item)), R.or(R.prop('chinese'), R.prop('pinyin'), R.prop('english')))(this.content.answerWords))
                        )
                    )
                )(this.content.answerOrders)))}`
            });
        }

        getHtml(sen, questionId) {
            const indexArr = R.match(/\[.]/g, sen);
            indexArr.forEach((item, index) => {
                sen = sen.replace(/\[.]/, `<div class='answer-pit' data-answer="${index}" data-question="${questionId}"></div>`)
            });
            return sen;
        }
    }
</script>
<style lang="scss">
    .content-container {
        .answer-pit {
            text-align: center;
            line-height: 1.3;
            display: inline-block;
            border-bottom: 1px solid black;
            min-width: 70px;
            vertical-align: middle;
            box-sizing: border-box;
            height: 40px;
            color: #ff91c5;
            margin: 0 5px;
            cursor: pointer;
        }

    }
</style>
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
        .optionList {
            display: inline-block;
            vertical-align: middle;
            margin-right: 40px;
            .cloud {
                cursor: pointer;
                font-size: 22px;
                @include cloud();
                &.active {
                    color: white;
                    transition: all .1s ease-in;
                    @include fullBgWithMainContentPicName("cloud_active.png")
                }
                .text {
                    display: inline-block;
                    line-height: 1.4;
                    vertical-align: middle;
                }
            }
        }
        .content {
            font-family: GothamRounded-Book;
            text-align: left;
            display: inline-block;
            vertical-align: middle;
            width: 500px;
            min-height: 400px;
            padding: 20px;
            line-height: 400px;
            background-color: rgb(1, 153, 254);
            border-radius: 32px;
            color: white;
            .content-container {
                display: inline-block;
                line-height: 1.4;
                vertical-align: middle;
                .text {
                    margin-top: 10px;
                    font-size: 26px;
                    .pinyin {
                        text-indent: 1em;
                    }
                }
            }
        }
    }
</style>