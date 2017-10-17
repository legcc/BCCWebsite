<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <ul class="option-list">
            <li class="option-item" v-for="(item,index) in content.answers" @click="chooseAnswer(item)"
                :class="activeIndex===item.order&&'active'">
                <em class="text" v-if="item.chinese">{{item.chinese}}</em>
                <em class="text" v-if="item.pinyin">{{item.pinyin}}</em>
                <em class="text" v-if="item.english">{{item.english}}</em>
            </li>
        </ul>
        <div class="match-container">
            <loadingImage :src="addPrefixHost(content.image)" alt="" class="match-img"
                          :style="{width:`${content.answers.length*160}px`}"></loadingImage>
            <ul class="match-list">
                <li class="pit-item" v-for="(item,index) in content.answers" @click="answerHandler(index)">
                    <em>{{answerArr[index] || ''}}</em></li>
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
    export default class matching extends Vue {
        isUpdate = false;
        activeIndex = "";
        activeText = "";
        answerArr = [];
        orderArr = [];

        init() {
            this.$nextTick(_ => {
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                this.setAnswer({
                    answer: false,
                    msg: this.content.answerOrder && `${R.map(i => R.pipe(R.find(R.propEq('order', i)), or(R.prop('chinese'), R.prop('english'), R.prop('pinyin')))(this.content.answers))(R.split(",")(this.content.answerOrder[0]))}`
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

                return item
            };
            const answer = R.pipe(R.split(","), debug, R.equals(this.orderArr))(this.content.answerOrder[0]);
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            this.setAnswer({
                answer,
                msg: `${R.map(i => R.pipe(R.find(R.propEq('order', i)), or(R.prop('chinese'), R.prop('english'), R.prop('pinyin')))(this.content.answers))(R.split(",")(this.content.answerOrder[0]))}`
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
                height: 120px;
                padding: 0 10px;
                line-height: 110px;
                font-family: GothamRounded-Medium;
                font-size: 28px;
                cursor: pointer;
                &.active {
                    @include fullBgWithMainContentPicName("practice_active_bg2.png");
                }
            }
        }
        .match-container {
            display: inline-block;
            vertical-align: middle;
            margin-left: 20px;
            $pitHeight: getHeightFromAspectRatio((width:155px, height:125px), 120px);
            .match-img {
                max-height: 600px;
                margin-bottom: 40px;
            }
            .match-list {
                .pit-item {
                    width: 100px;
                    height: $pitHeight;
                    display: inline-block;
                    padding: 0 10px;
                    vertical-align: middle;
                    line-height: $pitHeight;
                    font-family: GothamRounded-Medium;
                    font-size: 28px;
                    margin: 0 20px;
                    cursor: pointer;
                    text-align: center;
                    @include fullBgWithPicName("hollow.png");
                }
            }
        }
    }
</style>