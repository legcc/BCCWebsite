<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <ul class="optionList">
            <li class="cloud" v-for="(item,index) in content.answerWords" @click="chooseOption(item,index)"
                v-if="!activeArr[index]" :class="activeIndex===index&&'active'">
                <ul class="text">
                    <li v-if="item.pinyin">{{item.pinyin}}</li>
                    <li v-if="item.chinese">{{item.chinese}}</li>
                    <li v-if="item.english">{{item.english}}</li>
                </ul>
            </li>
        </ul>
        <div class="content">
            <div class="content-container">
                <ul v-for="(item,index) in content.questions" class="question">
                    <li>
                        <ul class="text">
                            <li class="pinyin">{{item.pinyin}}</li>
                            <li class="chinese">{{item.chinese}}</li>
                            <li class="pit" @click="answerHandler(index)">
                                <ul class="text" v-if="answerArr[index]">
                                    <li v-if="answerArr[index].chinese">{{answerArr[index].chinese}}</li>
                                    <li v-if="answerArr[index].pinyin">{{answerArr[index].pinyin}}</li>
                                    <li v-if="answerArr[index].english">{{answerArr[index].english}}</li>
                                </ul>
                            </li>
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
                    activeArr: [],
                    activeItem: null,
                    activeIndex: null,
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
    export default class match extends Vue {
        isUpdate = false;
        answerArr = [];
        activeArr = [];
        activeItem = null;
        activeIndex = null;

        init() {
            this.$nextTick(_ => {

                this.setAnswer({
                    answer: false,
                    msg: ` ${this.content.answerOrder}`
                });

            })
        }

        created() {
            this.init();
        }

        chooseOption(item, index) {
            this.activeItem = item;
            this.activeIndex = index;
        }

        answerHandler(index) {
            if (!this.answerArr[index]) {
                Vue.set(this.activeArr, this.activeIndex, true);
                Vue.set(this.answerArr, index, this.activeItem);
                this.activeItem = null;
                this.activeIndex = null;
            } else {
                this.activeArr[R.findIndex(R.propEq('order', this.answerArr[index].order))(this.content.answerWords)] = false;
                Vue.set(this.answerArr, index, "");
//                放入新的答案
                if (this.activeIndex !== null) {
                    Vue.set(this.activeArr, this.activeIndex, true);
                    Vue.set(this.answerArr, index, this.activeItem);
                    this.activeItem = null;
                    this.activeIndex = null;
                }
            }
            this.checkAnswer();

        }

        checkAnswer() {
            const answerOrder = R.map(R.ifElse(R.clone, R.prop("order"), R.F))(this.answerArr);
            const answer = R.any(R.pipe(R.split(","), R.equals(answerOrder)))(this.content.answerOrder);
            this.setAnswer({
                answer,
                msg: ` ${this.content.answerOrder}`
            });
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
        margin-top: 40px;
        .optionList {
            display: inline-block;
            vertical-align: middle;
            width: 460px;
            text-align: left;
            .cloud {
                display: inline-block;
                font-size: 22px;
                cursor: pointer;
                @include cloud();
                margin: 0 10px;
                &.active {
                    @include fullBgWithMainContentPicName("practice_active_bg2.png");
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
            display: inline-block;
            vertical-align: middle;
            width: 500px;
            min-height: 400px;
            padding: 20px;
            line-height: 400px;
            color: white;
            .content-container {
                display: inline-block;
                line-height: 1.4;
                vertical-align: middle;
                .question {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 40px;
                    font-family: GothamRounded-Medium;
                    font-size: 28px;
                }
                .text {
                    margin-top: 10px;
                }
                .pinyin {
                    color: #0d4a1a;
                    margin-bottom: 40px;
                }
                .chinese {
                    color: #333e80;
                    margin-bottom: 40px;
                }
                .pit {
                    $pitHeight: getHeightFromAspectRatio((width:155px, height:125px), 120px);
                    width: 100px;
                    height: $pitHeight;
                    display: inline-block;
                    padding: 0 10px;
                    line-height: $pitHeight - 10px;
                    vertical-align: middle;
                    @include fullBgWithPicName("hollow.png");
                    margin-right: 10px;
                    margin-left: 10px;
                    cursor: pointer;
                    color: black;
                    .text {
                        vertical-align: middle;
                        line-height: 1;
                        display: inline-block;
                        font-size: 24px;
                        font-family: GothamRounded-Book;
                        li {
                            margin: 0;
                        }
                    }

                }
            }
        }
    }
</style>