<template>
    <div class="theme-1"
         :class="isUpdate&&'fadeIn'"
    >
        <div class="container">
            <ul class="choose-options">
                <li class="yinbiao" v-for="(item,index) in yinBiaoArr"
                    :class="activeIndex===index&&'active'"
                    @click="answerHandler(index)"
                >{{item}}
                </li>
            </ul>
            <div class="answer-container">
                <ul class="answer">
                    <li class="answer-yinbiao">{{chooseYinBiao}}</li>
                    <li class="answer-pinyin">{{content.pinyin}}</li>
                </ul>
                <em class="chinese">{{content.chinese}}</em>
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
                contentInfo: state => state.contentInfo,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    yinBiaoArr: ["一", "/", "V", "\\"],
                    activeIndex: "",
                    chooseYinBiao: "",
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
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
        }
    })
    export default class selectTheStandard extends Vue {
        yinBiaoArr = ["一", "/", "V", "\\"];
        activeIndex = "";
        chooseYinBiao = "";
        isUpdate = false;

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.content.answerTone != null && `${this.yinBiaoArr[this.content.answerTone - 1]}`
                });

            })
        }


        mounted() {
            this.init();
        }

        answerHandler(index) {
            this.activeIndex = index;
            this.chooseYinBiao = this.yinBiaoArr[index];
            const answer = R.pipe(R.add(1), R.equals(+this.content.answerTone))(index);
            this.setAnswer({
                answer,
                msg: `${this.yinBiaoArr[this.content.answerTone - 1]}`
            });
        }

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
        text-align: center;
        .container {
            display: inline-block;
            margin-top: 50px;
        }
        .choose-options {
            margin: 0 auto;
            .yinbiao {
                display: inline-block;
                width: 110px;
                height: 110px;
                text-align: center;
                background: url(~~assets/img/main_content/exercise/cloud.png) no-repeat;
                background-size: 100% 100%;
                background-position: center 5px;
                line-height: 110px;
                font-size: 36px;
                vertical-align: middle;
                cursor: pointer;
                font-family: GothamRounded-Medium;
                color: #497ab9;
                margin: 0 15px 40px 15px;
                cursor: pointer;
                &.active {
                    background-image: url(~~assets/img/main_content/exercise/audio_speaking_active.png);
                    background-size: 130% 120%;
                    background-position: center;
                    color: white;

                }
            }
        }
        .answer-container {
            display: inline-block;
            text-align: center;
            .chinese {
                color: #497ab9;
                font-family: GothamRounded-Medium;
                font-size: 28px;
            }
        }
        .answer {
            width: 180px;
            height: 150px;
            background: url(~~assets/img/main_content/exercise/choose_block_bg_active.png) no-repeat;
            background-size: 100% 100%;
            margin: 0 auto;
            padding-top: 30px;
            color: #497ab9;
            font-size: 24px;
            font-family: GothamRounded-Medium;
            .answer-yinbiao {
                background-color: #bce2e8;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                line-height: 60px;
                margin: 0 auto;
            }
            .answer-pinyin {
                margin: 10px auto auto auto;
                font-size: 30px;
            }
        }
    }

</style>