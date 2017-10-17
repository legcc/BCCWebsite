<template>
    <div class="container" v-if="templateStyle==='level-1'" :class="isUpdate&&'fadeIn'">
        <ul class="option-list">
            <li class="option-item" v-for="(item,index) in content.words" @click="chooseOption(item,index)"
                v-if="!activeArr[index]" :class="activeIndex===index&&'active'">
                <ul class="text">
                    <li v-if="item.chinese">{{item.chinese}}</li>
                    <li v-else-if="item.pinyin">{{item.pinyin}}</li>
                    <li v-else-if="item.english">{{item.english}}</li>
                </ul>
            </li>
        </ul>
        <div class="match-container">

            <ul class="match-list">
                <li class="match-list-item" v-for="(item,index) in content.bottomSentences">
                    <ul>
                        <li>
                            <loadingImage :src="addPrefixHost(content.image)" alt="" class="match-img"></loadingImage>
                        </li>
                        <li v-html="getHtml(item,index)"></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    <div v-else>
        <div class="coming-soon"></div>
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
                this.init();
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600)
            }
        },
    })
    export default class Sentence extends Vue {
        isUpdate = false;
        answerArr = [];
        activeArr = [];
        activeItem = "";
        activeIndex = "";

        chooseOption(item, index) {
            this.activeItem = item;
            this.activeIndex = index;
        }

        checkAnswer() {
            const answerOrder = R.map(R.ifElse(R.clone, R.prop("order"), R.F))(this.answerArr);
            const rightOrder = R.map(R.split(","))(this.content.answerOrder);
            const answer = R.any(R.equals(answerOrder))(rightOrder);
            this.setAnswer({
                answer,
                msg: `　${R.map(item => R.or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(R.find(R.propEq('order', item))(this.content.words)))
                (rightOrder[0])}`
            });
        }

        mounted() {
            this.init();
        }

        created() {
            this.$nextTick(_ => {
                const pits = document.querySelectorAll(".pit-item");
                const addEventListener = (event, fn, isPre = false) => {
                    return (item) => {
                        item.addEventListener(event, fn, isPre);
                    }
                };
                R.forEach(addEventListener("click", this.clickFn, false))(pits);
            })
        }

        init() {
            this.$nextTick(_ => {
                if (this.content.words) {
                    const rightOrder = R.map(R.split(","))(this.content.answerOrder);

                    this.setAnswer({
                        answer: false,
                        msg: `　${R.map(item => R.or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(R.find(R.propEq('order', item))(this.content.words)))
                        (rightOrder[0])}`
                    });
                }
            })
        }


        clickFn(ev) {
            const target = ev.target;
            const qIndex = target.getAttribute("data-group");
            if (this.activeItem) {
                Vue.set(this.activeArr, this.activeIndex, true);
                Vue.set(this.answerArr, qIndex, this.activeItem);
                target.innerText = this.activeItem.chinese;
                this.activeItem = "";
                this.activeIndex = "";
                this.checkAnswer();
            } else {
                if (this.answerArr[qIndex]) {
                    const index = R.findIndex(R.propEq('order', this.answerArr[qIndex].order))(this.content.words);
                    Vue.set(this.activeArr, index, false);
                    Vue.set(this.answerArr, qIndex, "");
                    target.innerText = "";
                }
            }
        }

        getHtml(sen, index) {
            const indexArr = R.match(/\[.+[\]、]/g, sen);
            indexArr.forEach((item) => {
                sen = sen.replace(/\[.+[\]、]/, `<div data-group="${index}" class='pit-item'></div>`)
            });
            return sen;
        }
    }
</script>
<style lang="scss">
    .match-list-item {
        .pit-item {
            min-width: 100px;
            height: 60px;
            display: inline-block;
            padding: 0 10px;
            line-height: 60px;
            font-family: GothamRounded-Medium;
            font-size: 24px;
            text-align: center;
            cursor: pointer;
            background: url("~~assets/img/main_content/exercise/pit2-active.png") no-repeat;
            background-size: 100% 100%;
            vertical-align: middle;
        }
    }
</style>
<style lang="scss" scoped>
    @import "~~assets/sass/mixins";
    @import "~~assets/sass/functions";

    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
    }

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

            .option-item {
                @include fullBgWithMainContentPicName("read-choose-pit.png");
                min-width: 1.23rem;
                line-height: .6rem;
                font-family: GothamRounded-Medium;
                font-size: 22px;
                cursor: pointer;
                &.active {
                    transition: all .1s ease-in;
                    @include fullBgWithMainContentPicName("btn-purple.png");
                }
                &:not(:first-child) {
                    margin-top: 30px;
                }
                .text {
                    vertical-align: middle;
                    line-height: 1;
                    display: inline-block;
                    li:not(:first-child) {
                        margin-top: 5px;
                    }
                }
            }
        }
        .match-container {
            display: inline-block;
            vertical-align: middle;
            margin-left: 20px;
            .match-list {
                font-size: 26px;
                font-family: GothamRounded-Medium;
                .match-img {
                    max-width: 160px;
                }
                .match-list-item {
                    display: inline-block;
                    margin: 0 20px;
                }

                li {
                    margin-top: 30px;
                }
            }
        }
    }
</style>