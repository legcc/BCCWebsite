<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <ul class="option-list">
            <li class="option-item" v-for="(item,index) in content.answers" @click="chooseAnswer(item)"
                :class="activeIndex===item.order&&'active'">
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
                <li class="match-list-item" v-for="(item,index) in content.answers">
                    <ul>
                        <li>
                            <loadingImage :src="addPrefixHost(item.image)" alt="" class="match-img"></loadingImage>
                        </li>
                        <li class="pit-item" @click="answerHandler(index)">{{answerArr[index] || ''}}</li>
                    </ul>
                </li>
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
    export default class matchingPic extends Vue {
        isUpdate = false;
        activeIndex = "";
        activeText = "";
        answerArr = [];
        orderArr = [];

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.content.answers && `${R.pipe(R.map(R.prop("chinese")), R.join("、"))(this.content.answers)}`
                });

            })
        }

        mounted() {
            this.init();

        }

        chooseAnswer(item, index) {
            this.activeText = item.chinese || item.pinyin || item.english;
            this.activeIndex = item.order;
        }

        answerHandler(index) {
            if (!this.answerArr[index]) {
                Vue.set(this.answerArr, index, this.activeText);
                this.orderArr[index] = this.activeIndex;
                this.activeText = "";
                this.activeIndex = "";
            } else {
                Vue.set(this.answerArr, index, "");
                this.orderArr[index] = "";
            }
            const debug = item => {
                console.log(item);
                return item
            };
            const answer = R.pipe(R.map(R.prop("order")), debug, R.equals(this.orderArr))(this.content.answers);
            this.setAnswer({
                answer,
                msg: ` ${R.pipe(R.map(R.prop("chinese")), R.join("、"))(this.content.answers)}`
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

            .option-item {
                @include fullBgWithMainContentPicName("cloud.png");
                min-width: 100px;
                min-height: 120px;
                padding: 20px 30px;
                line-height: 110px;
                font-family: GothamRounded-Medium;
                font-size: 20px;
                cursor: pointer;
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
                .match-img {
                    max-width: 160px;
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
                    vertical-align: middle;
                    cursor: pointer;
                    line-height: 110px;
                    font-family: GothamRounded-Medium;
                    font-size: 28px;
                    margin: 100px 20px 0 20px;
                    @include fullBgWithPicName("hollow.png");
                }
            }
        }
    }
</style>