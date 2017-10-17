<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <ul class="option-list">
            <li class="option-item" v-for="(item,index) in content.answerWords" @click="chooseOption(item,index)"
                v-if="!activeArr[index]" :class="activeIndex===index&&'active'">
                <ul class="text">
                    <li v-if="item.chinese">{{item.chinese}}</li>
                    <li v-if="item.pinyin">{{item.pinyin}}</li>
                    <li v-if="item.english">{{item.english}}</li>
                </ul>
            </li>
        </ul>
        <div class="match-container">
            <!--<img :src="addPrefixHost(content.image)" alt="" class="match-img">-->

            <ul class="match-list">
                <li class="match-list-item" v-for="(item,index) in content.questions">
                    <ul>
                        <li v-if="item.chinese">{{item.chinese}}</li>
                        <li v-if="item.pinyin">{{item.pinyin}}</li>
                        <li v-if="item.english">{{item.english}}</li>
                        <li>
                            <loadingImage :src="addPrefixHost(item.image)" alt="" class="match-img"></loadingImage>
                        </li>
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
        components: {loadingImage,},
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

        init() {
            this.$nextTick(_ => {
                if (this.content.questions) {
                    const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                    this.setAnswer({
                        answer: false,
                        msg: `　${R.join("\n")(R.map(R.pipe(R.split(","),R.map(item=>R.pipe(R.find(R.propEq("order",item)),or(R.prop("chinese"),R.prop("english"),R.prop("pinyin")))(this.content.answerWords))))(this.content.answerOrder))}`
                    });
                }
            })
        }


        mounted() {
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
                this.activeItem = "";
                this.activeIndex = "";
                this.checkAnswer();
            } else {
                this.activeArr[R.findIndex(R.propEq('order', this.answerArr[index].order))(this.content.answerWords)] = false;
                Vue.set(this.answerArr, index, "");
            }
        }

        checkAnswer() {
            const answerOrder = R.map(R.prop("order"))(this.answerArr);
            const debug = item=>{console.log(item);return item;};
            debug(answerOrder)
            const answer = R.any(R.pipe(R.split(","),debug,R.equals(answerOrder)))(this.content.answerOrder);
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            this.setAnswer({
                answer,
                msg: `　${R.join("\n")(R.map(R.pipe(R.split(","),R.map(item=>R.pipe(R.find(R.propEq("order",item)),or(R.prop("chinese"),R.prop("english"),R.prop("pinyin")))(this.content.answerWords))))(this.content.answerOrder))}`
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
        margin-top: 90px;
        .option-list {
            display: inline-block;
            vertical-align: middle;
            min-height: 600px;
            min-width: 110px;
            .option-item {
                font-family: GothamRounded-Medium;
                font-size: 18px;
                cursor: pointer;
                @include cloud(110px, 110px);
                &.active {
                    @include fullBgWithMainContentPicName("practice_active_bg2.png");
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
            .match-list {
                font-size: 26px;
                font-family: GothamRounded-Medium;
                .match-img {
                    max-width: 160px;
                    max-height: 120px;
                }
                .match-list-item {
                    display: inline-block;
                    margin: 0 20px;
                }

                .pit-item {
                    min-width: 100px;
                    height: $pitHeight;
                    display: inline-block;
                    padding: 0 10px;
                    line-height: $pitHeight;
                    vertical-align: middle;
                    text-align: center;
                    font-family: GothamRounded-Medium;
                    font-size: 28px;
                    @include fullBgWithPicName("hollow.png");
                    margin-right: 10px;
                    margin-left: 10px;
                    cursor: pointer;
                    .text {
                        vertical-align: middle;
                        line-height: 1;
                        display: inline-block;
                        font-size: 22px;
                        font-family: GothamRounded-Book;
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