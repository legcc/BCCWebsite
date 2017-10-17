<template>
    <div :class="isUpdate&&'fadeIn'">
        <div v-if="templateStyle==='level-4'" class="theme-1">
            <div>
                <div class="template-content">
                    <div class="top-title">{{content.sentence}}</div>
                    <draggable class="split-line" element="div" v-model="answerArr"
                               :options="{group:'pits',animation:300}" @end="answerHandler">
                        <span class="pit"
                              v-for="item in answerArr">{{item.chinese || item.pinyin || item.english}}</span>
                    </draggable>
                    <div>
                        <draggable element="div" class="options" v-model="optionArr"
                                   :options="{group:'pits',animation:300}" @end="answerHandler">
                            <span class="pit"
                                  v-for="item in optionArr">{{item.chinese || item.pinyin || item.english}}</span>
                        </draggable>
                    </div>

                </div>
            </div>
        </div>
        <div v-if="templateStyle==='level-3'" class="theme-2">
            <div>
                <div class="template-content">
                    <div class="top-title">He is about to come to Beijing.</div>
                    <draggable class="split-line" element="div" v-model="answerArr"
                               :options="{group:'pits',animation:300}" @end="answerHandler">
                        <span class="pit"
                              v-for="item in answerArr">{{item.chinese || item.pinyin || item.english}}</span>
                    </draggable>
                    <div>
                        <draggable element="div" class="options" v-model="optionArr"
                                   :options="{group:'pits',animation:300}" @end="answerHandler">
                            <span class="pit"
                                  v-for="item in optionArr">{{item.chinese || item.pinyin || item.english}}</span>
                        </draggable>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions,mapMutations} from 'vuex';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    import draggable from 'vuedraggable'
    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },

        data () {
            return {
                optionArr: [],
                answerArr: [],
                isUpdate: false
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            ...mapMutations('index/exercise/index', [
                'CompareControl',
            ]),
            answerHandler(){
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                const orderArr = R.map(R.prop("order"))(this.answerArr);
                const answer = R.any(R.pipe(R.split(","), R.equals(orderArr)))(this.content.answerOrder);
                this.setAnswer({answer,msg: R.pipe(R.map(or(R.prop("chinese"),R.prop("english"),R.prop("pinyin"))),R.join("、"))(this.content.answerSentences)});
            },
            init(){
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                this.$nextTick(_ => {
                    this.CompareControl(false);
                this.setAnswer({answer: false, msg: this.content.answerSentences&&R.pipe(R.map(or(R.prop("chinese"),R.prop("english"),R.prop("pinyin"))),R.join("、"))(this.content.answerSentences)});
                })
            }
        },
        destroyed(){
            this.CompareControl(true);
        },
        created(){
            this.$nextTick(_ => {
                this.optionArr = R.clone(this.content.words);
                this.init();

            })
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    optionArr: [],
                    answerArr: [],
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                this.$nextTick(_ => {
                    this.optionArr = R.clone(this.content.words);
                })
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600);
                this.init();

            }
        },

        components: {
            loadingImage,
            draggable
        }
    }
</script>

<style lang="scss" scoped>
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

    @import "~~assets/sass/functions";
    .theme-1 {
        text-align: center;
        .pit {
            background: url(~~assets/img/main_content/exercise/read-choose-pit.png) no-repeat;
            background-size: 100% 100%;
            font-size: 30px;
            padding: 10px 0;
            color: #071f30;
            text-align: center;
            display: inline-block;
            min-width: 150px;
            min-height: 40px;
            font-family: GothamRounded-Medium;
            font-weight: 400;
            font-style: normal;
            cursor: move;
            margin: 10px 20px;
            line-height: normal;
        }
        .template-content {
            display: inline-block;
        }
        .template-content .top-title {
            background: url(~~assets/img/main_content/exercise/read-content-bg.png) no-repeat;
            background-size: 100% 100%;
            display: inline-block;
            min-width: 600px;
            padding: 40px 60px;
            margin-top: 50px;
            font-size: 36px;
            color: #339;
            text-align: center;
            font-family: GothamRounded-Medium;
            font-weight: 400;
            font-style: normal;
        }
        .template-content .split-line {
            $width: 900px;
            min-width: $width;
            display: inline-block;
            height: 1.033735rem;
            line-height: 1rem;
            background: url(~~assets/img/main_content/exercise/split-line.png) no-repeat;
            background-position: left bottom -30px;
            background-size: 100% 100%;
            text-align: center;
            position: relative;
            white-space: nowrap;
            margin: 50px auto auto;
            .pit {
                min-width: 120px;
                min-height: 20px;
                vertical-align: middle;
                font-size: 20px;
                color: #1b2043;
                margin: 5px;
                font-family: GothamRounded-Medium;
            }
        }
        .template-content .options {
            width: 1000px;
            margin: 20px auto;

        }

    }

    .theme-2 {
        text-align: center;
        .template-content {
            display: inline-block;
        }
        .pit {
            background: url(~~assets/img/main_content/exercise/button-yellow.png) no-repeat;
            background-size: 100% 100%;
            padding: 20px 0;
            font-size: 30px;
            color: #071f30;
            text-align: center;
            display: inline-block;
            min-width: 200px;
            min-height: 40px;
            font-family: GothamRounded-Medium;
            font-weight: 400;
            font-style: normal;
            cursor: move;
            line-height: normal;
        }
        .template-content .top-title {
            background: url(~~assets/img/main_content/exercise/bg-yellow.png) no-repeat;
            background-size: 100% 100%;
            display: inline-block;
            min-width: 600px;
            padding: 40px 60px;
            margin-top: 50px;
            font-size: 36px;
            color: #ffffff;
            text-align: center;
            font-family: GothamRounded-Medium;
            font-weight: 400;
            font-style: normal;
        }
        .template-content .split-line {
            $width: 800px;
            min-width: $width;
            height: 1.033735rem;
            line-height: 1rem;
            background: url(~~assets/img/main_content/exercise/line-yellow.png) no-repeat;
            background-position: bottom;
            background-size: 100% 30%;
            text-align: center;
            position: relative;
            white-space: nowrap;
            margin: 50px auto auto;
            .pit {
                min-width: 120px;
                min-height: 30px;
                vertical-align: middle;
                font-size: 20px;
                color: #333e80;
                font-family: GothamRounded-Medium;
            }
        }
        .template-content .options {
            width: 1000px;
            margin: 10px auto;

        }

    }
</style>
