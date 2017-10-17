<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <ul class="option-list">
            <li class="option-item" v-for="(item,index) in content.answers" @click="chooseOption(item,index)"
                v-if="!activeArr[index]" :class="activeIndex===index&&'active'">
                <ul class="text">
                    <li v-if="item.chinese">{{item.chinese}}</li>
                    <li v-if="item.pinyin">{{item.pinyin}}</li>
                    <li v-if="item.english">{{item.english}}</li>
                </ul>
            </li>
        </ul>
        <div class="match-container">
            <ul class="sentence">
                <li v-for="item in content.sentence">{{item}}</li>
            </ul>
            <img src="~assets/img/img-loading.png" alt="" class="match-img">
            <ul class="match-list">
                <li class="match-list-item" v-for="(item,index) in content.answers">
                    <ul>
                        <li class="pit-item" @click="answerHandler(index)">
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
    export default class match extends Vue {
        isUpdate = false;
        answerArr = [];
        activeArr = [];
        activeItem = "";
        activeIndex = "";

        chooseOption(item, index) {
            this.activeItem = item;
            this.activeIndex = index;
        }

        answerHandler(index) {
            if (!this.answerArr[index]) {
                Vue.set(this.activeArr, this.activeIndex, true);
                Vue.set(this.answerArr, index, this.activeItem);
                this.activeItem = "";
                this.activeIndex = "";
                this.checkAnswer();
            } else {
                this.activeArr[R.findIndex(R.propEq('order', this.answerArr[index].order))(this.content.answers)] = false;
                Vue.set(this.answerArr, index, "");
            }
        }

        init() {
            this.$nextTick(_ => {
                if (this.content.answerOrder) {
                    const rightOrder = R.map(R.split(","))(this.content.answerOrder);
                    const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                    this.setAnswer({
                        answer,
                        msg: `${R.map(item => or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(R.find(R.propEq('order', item))(this.content.answers)))
                        (rightOrder[0])}`
                    });
                }
            })
        }

        mounted() {
            this.init();
        }

        checkAnswer() {
            const answerOrder = R.map(R.ifElse(R.clone, R.prop("order"), R.F))(this.answerArr);
            const rightOrder = R.map(R.split(","))(this.content.answerOrder);
            const answer = R.any(R.equals(answerOrder))(rightOrder);
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));

            this.setAnswer({
                answer,
                msg: `${R.map(item => or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(R.find(R.propEq('order', item))(this.content.answers)))
                (rightOrder[0])}`
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
        .option-list {
            display: inline-block;
            vertical-align: middle;
            min-width: 220px;
            height: 600px;
            .option-item {
                @include fullBgWithMainContentPicName("button-yellow.png");
                min-width: 120px;
                height: 50px;
                padding: 20px;
                line-height: 30px;
                color: white;
                cursor: pointer;
                font-family: GothamRounded-Medium;
                font-size: 22px;
                &.active {
                    transition: all .1s ease-in;
                    color: black;
                    @include fullBgWithMainContentPicName("button-yellow-active.png");
                }
                .text {
                    vertical-align: middle;
                    line-height: 1;
                    display: inline-block;
                }
            }
        }
        .match-container {
            display: inline-block;
            vertical-align: middle;
            margin-left: 20px;
            $pitHeight: getHeightFromAspectRatio((width:155px, height:125px), 120px);
            .sentence {
                width: 700px;
                font-size: 20px;
                font-family: GothamRounded-Medium;
                text-align: left;
                color: white;
                padding: 20px 40px;
                margin-bottom: 20px;
                @include fullBgWithPicName("bg-yellow.png");
            }
            .match-img {
                width: 100%;
            }
            .match-list {
                font-size: 26px;
                font-family: GothamRounded-Medium;
                .match-img {
                    max-width: 160px;
                }
                .match-list-item {
                    display: inline-block;
                }

                .pit-item {
                    @include fullBgWithPicName("yellow-ou.png");
                    min-width: 120px;
                    height: 40px;
                    padding: 20px;
                    line-height: 30px;
                    vertical-align: middle;
                    color: white;
                    font-family: GothamRounded-Medium;
                    font-size: 22px;
                    cursor: pointer;
                    position: relative;
                    .text {
                        line-height: 1;
                        display: inline-block;
                        font-size: 20px;
                        font-family: GothamRounded-Book;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        li {
                            margin: 0;
                        }
                    }
                }
                li {
                    margin-top: 30px;
                }
            }
        }
    }
</style>