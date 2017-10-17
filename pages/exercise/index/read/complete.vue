<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <div class="option-container">
            <div v-for="(item,index) in content.answerWords" class="cloud" @click="chooseOption(item,index)"
                 :class="activeIndex===index&&'active'">
                <ul class="text">
                    <li v-if="item.pinyin">{{item.pinyin}}</li>
                    <li v-if="item.chinese">{{item.chinese}}</li>
                    <li v-if="item.english">{{item.english}}</li>
                </ul>
            </div>
        </div>
        <ul class="dialog-container">
            <li v-for="(item,index) in content.sentences" class="sentence">
                <template v-if="!isEmpty(item)">
                    <loadingImage :src="addPrefixHost(item.headImage)" alt="" class="head-img"></loadingImage>
                    <div class="dialog">
                        <ul class="text">
                            <li class="pinyin" v-if="item.pinyin">{{item.pinyin}}</li>
                            <li class="chinese" v-if="item.chinese">{{item.chinese}}</li>
                            <li class="english" v-if="item.english">{{item.english}}</li>
                        </ul>
                    </div>
                </template>
                <template v-if="isEmpty(item)">
                    <div class="pit-container" @click="chooseInput(index)" :class="selectIndex===index&&'active'">
                        <div class="pit-list">
                            <div v-for="(answer,itemIndex) in answerArr[index]" class="cloud"
                                 @click="cancelOption(answer,index,itemIndex)">
                                <ul class="text">
                                    <li>{{answer.pinyin}}</li>
                                    <li>{{answer.chinese}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <loadingImage :src="addPrefixHost(item.headImage)" alt="" class="head-img"></loadingImage>
                </template>
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
        components: {loadingImage},
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
        activeIndex = "";

        created() {
            this.$nextTick(_ => {
                this.answerArr = this.content.sentences.map(item => []);
            })
        }

        mounted() {
            this.init();
        }

        init() {
            this.$nextTick(_ => {
                const reduce = R.reduce((pre, item) => (pre.concat(item)), []);
                this.setAnswer({
                    answer: false,
                    msg: this.content.answerOrders && R.pipe(R.map(R.pipe(R.prop('answerOrder'), R.map(R.split(",")))), R.map(R.map(R.map(item => (R.pipe(R.find(R.propEq('order', item)), R.or(R.prop("chinese"), R.prop("pinyin")))(this.content.answerWords))))), reduce, R.map(R.join("")), R.join("\n"))(this.content.answerOrders)
                });
            })
        }

        chooseInput(index) {
            this.selectIndex = index;
        }

        chooseOption(item, index) {
            if (this.selectIndex !== null) {
                this.answerArr[this.selectIndex].push(item);
                this.activeIndex = index;
                this.checkAnswer();
            } else {
                this.$message.warning("Please select an input box first");
            }
        }

        checkAnswer() {
            const orderArr = R.filter(R.length)(R.map(R.map(R.prop("order")))(this.answerArr));
            const rightOrder = R.map(R.pipe(R.prop("answerOrder"), R.head, R.split(",")))(this.content.answerOrders);
            const answer = R.equals(orderArr, rightOrder);
            const reduce = R.reduce((pre, item) => (pre.concat(item)), []);
            this.setAnswer({
                answer,
                msg: R.pipe(R.map(R.pipe(R.prop('answerOrder'), R.map(R.split(",")))), R.map(R.map(R.map(item => (R.pipe(R.find(R.propEq('order', item)), R.or(R.prop("chinese"), R.prop("pinyin")))(this.content.answerWords))))), reduce, R.join("\n"))(this.content.answerOrders),
            });
        }

        isEmpty(item) {
            return /[.+[\]、]/g.test(item.english) || /[.+[\]、]/g.test(item.chinese) || /[.+[\]、]/g.test(item.pinyin);
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
    }

    .option-container {
        display: inline-block;
        vertical-align: middle;
        min-height: 600px;
        margin-left: 1.2rem;
        .cloud {
            cursor: pointer;
            @include cloud();
            background-position: center;
            &.active {
                background-image: url(~~assets/img/main_content/exercise/audio_speaking_active.png);
                background-size: 130% 120%;
                color: black;
                transition: all .1s ease-in;
            }
            .text {
                display: inline-block;
                line-height: 1.4;
                vertical-align: middle;
            }
        }
    }

    .dialog-container {
        display: inline-block;
        vertical-align: middle;
        min-width: 800px;
        margin-left: 30px;
        $height: getHeightFromAspectRatio((width:249px, height:107px), 300px);
        .dialog {
            display: inline-block;
            vertical-align: middle;
            min-width: 300px;
            line-height: $height;
            height: $height;
            text-align: center;
            @include fullBgWithPicName("dialog.png");
            .text {
                vertical-align: middle;
                font-family: GothamRounded-Book;
                display: inline-block;
                line-height: 1.3;
            }
        }
        .pit-container {
            display: inline-block;
            vertical-align: middle;
            min-width: 300px;
            height: $height;
            line-height: $height;
            padding: 0 40px;
            cursor: pointer;
            text-align: center;
            @include fullBgWithPicName("dialog-right.png");
            &.active {
                transition: all .1s ease-in;
                @include fullBgWithPicName("dialog-active.png");
                background-size: 110% 110%;
                background-position: center;
            }
            .pit-list {
                min-width: 200px;
                min-height: 100px;
                display: inline-block;
                vertical-align: middle;
            }

            .cloud {
                cursor: pointer;
                display: inline-block;
                @include cloud();
                font-size: 16px;
                .text {
                    display: inline-block;
                    line-height: 1.4;
                    vertical-align: middle;
                }
            }

        }
        .head-img {
            width: 150px;
            vertical-align: middle;
        }
        .sentence:nth-child(2n+1) {
            text-align: left;
        }
        .sentence:nth-child(2n+2) {
            text-align: right;
        }
    }
</style>