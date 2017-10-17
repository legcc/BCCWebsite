<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <ul class="option-list">
            <template v-for="(item,index) in content.answers">
                <li class="option-item" v-if="!haveImg" :class="activeIndex===item.order&&'active'"
                    @click="chooseAnswer(item)">
                    <em class="text" v-if="item.chinese">{{item.chinese}}</em>
                    <em class="text" v-if="item.pinyin">{{item.pinyin}}</em>
                    <em class="text" v-if="item.english">{{item.english}}</em>
                </li>
                <li v-else>
                    <!--<img :src="addPrefixHost(item.image)" alt="">-->
                    <img src="~assets/img/img-loading.png" class="option-item-image" alt=""
                         :class="activeIndex===item.order&&'active'" @click="chooseAnswer(item)">
                </li>
            </template>
        </ul>
        <div class="match-container">
            <!--<img :src="addPrefixHost(content.image)" alt="" class="match-img">-->
            <img src="~assets/img/img-loading.png" alt="" class="match-img">
            <ul class="match-list">
                <template v-for="(item,index) in content.answers">
                    <li v-if="!haveImg" class="pit-item" @click="answerHandler(index)">
                        <em>{{answerArr[index] || ''}}</em></li>
                    <li v-if="haveImg" class="pit-item" @click="answerHandler(index)">
                        <img :src="answerArr[index]" alt="" class="icon" v-show="answerArr[index]">
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import draggable from 'vuedraggable'
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
        components: {
            loadingImage,
            draggable
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
    export default class place extends Vue {
        isUpdate = false;
        activeIndex = "";
        activeText = "";
        activeImage = "";
        answerArr = [];
        orderArr = [];

        chooseAnswer(item, index) {
            this.activeText = item.chinese || item.pinyin || item.english;
            this.activeImage = this.addPrefixHost(item.image);
            this.activeIndex = item.order;
        }

        answerHandler(index) {
            if (!this.answerArr[index]) {
                this.haveImg ? Vue.set(this.answerArr, index, this.activeImage) : Vue.set(this.answerArr, index, this.activeText);
                this.orderArr[index] = this.activeIndex;
                this.activeText = "";
                this.activeIndex = "";
            } else {
                Vue.set(this.answerArr, index, "");
                this.orderArr[index] = "";
            }
            const debug = item => {

                return item
            };
            const answer = R.pipe(R.split(","), debug, R.equals)(this.content.answerOrder[0])(this.orderArr);
            this.setAnswer({
                answer,
                msg: `${this.content.answerOrder[0]}`
            });
        }

        init() {
            this.$nextTick(_ => {

                this.setAnswer({
                    answer: false,
                    msg: this.content.answerOrder && `${this.content.answerOrder[0]}`
                });
            })
        }

        mounted() {
            this.init();
        }

        get haveImg() {
            return R.any(R.prop("image"))(this.content.answers)
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
            .option-item {
                @include fullBgWithMainContentPicName("cloud.png");
                min-width: 100px;
                height: 120px;
                padding: 0 10px;
                line-height: 110px;
                cursor: pointer;
                font-family: GothamRounded-Medium;
                font-size: 28px;
            }
            .option-item-image {
                min-width: 50px;
                margin: 20px 0;
                max-width: 100px;
                cursor: pointer;
                &.active {
                    border: 2px solid #526aff;
                    box-sizing: border-box;
                }
            }
        }
        .match-container {
            display: inline-block;
            vertical-align: middle;
            margin-left: 20px;
            $pitHeight: getHeightFromAspectRatio((width:155px, height:125px), 150px);
            .match-img {
                margin-bottom: 40px;
            }
            .match-list {
                .pit-item {
                    width: 130px;
                    height: $pitHeight;
                    display: inline-block;
                    padding: 0 10px;
                    line-height: 110px;
                    font-family: GothamRounded-Medium;
                    font-size: 28px;
                    margin: 0 20px;
                    vertical-align: middle;
                    cursor: pointer;
                    @include fullBgWithPicName("hollow.png");
                    .icon {
                        width: 80%;
                        height: 80%;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>