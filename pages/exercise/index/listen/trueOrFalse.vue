<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="theme-1" v-if="templateStyle === 'level-1'">
            <div class="practice_listen_answer practice_common_box">
                <div class="listen_answer_title"><span class="text">{{content.sentence}}</span></div>
                <div class="listen_answer_box">
                        <span class="listen_answer" v-for="(item,index) in content.answers"
                              :class="index === activeIndex&&'active'"
                              @click="answerHandler(index,item.isRight)">{{item.answer}}</span>
                </div>
            </div>
        </div>
        <div class="theme-2" v-if="templateStyle === 'level-2'">
            <div class="practice_listen_answer practice_common_box">
                <div class="listen_answer_title">{{content.sentence}}</div>
                <div class="listen_answer_box">
                        <span class="listen_answer" v-for="(item,index) in content.answers"
                              :class="index === activeIndex&&'active'"
                              @click="answerHandler(index,item.isRight)">{{item.answer}}</span>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        data () {
            return {
                isUpdate: false,
                activeIndex: ""
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            answerHandler(index, isRight){
                const answer = R.equals(isRight, 'T');
                this.setAnswer({answer, msg: R.find(R.propEq('isRight', 'T'))(this.content.answers).answer});
                this.activeIndex = index;
            },
            init(){
                this.$nextTick(_ => {
                    this.setAnswer({
                        answer: false,
                        msg: this.content.answers && R.pipe(R.find(R.propEq('isRight', 'T')), R.defaultTo({}), R.prop('answer'))(this.content.answers)
                    });

                })
            }

        },
        mounted(){
            this.init();

        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    activeIndex: "",
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

        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        components: {loadingImage,}
    }
</script>

<style lang="less" scoped>
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

    .theme-1 {
        .practice_common_box {
            width: 750px;
            display: block;
            margin: 0 auto;
            font-family: 'Arial Rounded MT Bold', 'Arial Rounded MT';
            text-align: center;
            position: relative;
        }
        .listen_answer_title {
            display: inline-block;
            width: 500px;
            min-height: 200px;
            padding: 0 30px;
            background: url(~~assets/img/main_content/exercise/answer_title_bg.png) no-repeat;
            background-size: 100%;
            background-position: center;
            font-size: 26px;
            color: #0000B4;
            line-height: 200px;
            margin-top: 40px;
            .text {
                text-align: left;
                display: inline-block;
                vertical-align: middle;
                line-height: 1.3;
            }
        }
        .listen_answer_box {
            margin-top: 40px;
        }
        .listen_answer:nth-child(1) {
            color: #000099;
        }
        .listen_answer:nth-child(2) {
            color: #FF0000;
        }
        .listen_answer {
            display: inline-block;
            width: 120px;
            height: 120px;
            background: url(~~assets/img/main_content/exercise/cloud.png) no-repeat;
            background-size: 100% 100% !important;
            background-position: center 5px !important;
            line-height: 120px;
            font-size: 40px;
            margin-left: 30px;
            margin-right: 30px;
            cursor: pointer;
            &.active {
                background: url(~~assets/img/main_content/exercise/cloud_active.png) no-repeat;
                color: white;
            }
        }
    }

    .theme-2 {
        .practice_common_box {
            width: 8rem;
            display: block;
            padding-bottom: 200px;
            height: 4rem;
            line-height: 4rem;
            margin: 0 auto;
            font-family: Arial Rounded MT Bold, Arial Rounded MT;
            text-align: center;
            position: relative;
            background: url("~~assets/img/exercise/level2/xiangkuang.png") no-repeat;
            background-size: 100% 100%;
            position: relative;
        }
        .listen_answer_title {
            display: inline-block;
            vertical-align: middle;
            font-size: 34px;
            line-height: 1;
            font-family: "GothamRounded-Medium";
            color: #071f30;
            margin: 0 90px;
        }
        .listen_answer_box {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            margin: 0 auto;
            text-align: center;
            width: 100%;
        }
        .listen_answer {
            color: white;
            text-shadow: 0 2px 3px black;
        }
        .listen_answer {
            display: inline-block;
            width: 180px;
            height: 88px;
            background: url(~~assets/img/exercise/level2/button.png) no-repeat center;
            background-size: 100% 100% !important;
            line-height: 88px;
            font-size: 40px;
            margin-left: 30px;
            margin-right: 30px;
            cursor: pointer;
            padding-right: 10px;
            &.active {
                background-image: url(~~assets/img/exercise/button-green-active.png);
                color: #e47d14;
            }
        }
    }
</style>
