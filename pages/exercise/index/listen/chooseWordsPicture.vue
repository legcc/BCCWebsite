<template>
    <div :class="isUpdate&&'fadeIn'">
        <div v-if="templateStyle === 'level-4'">
            <transition name="fade">
                <div class="theme-1" v-if="!haveImage">
                    <div class="practice_common_box">
                        <div class="all-option">
                            <div :class="activeIndex===index&&'active'"
                                 @click="answerHandler(index,item.isRight)"
                                 v-for="(item,index) in content.words"
                            ><span :class="isMore(item,16)">{{item.english || item.chinese || item.pinyin}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="theme-2" v-if="haveImage">
                    <div class="practice_common_box">
                        <div class="option-left">
                            <div class="firstOption" :class="activeIndex===index&&'active'"
                                 @click="answerHandler(index,item.isRight)"
                                 v-for="(item,index) in content.words"
                            >
                                <loadingImage class="option-inner-img"
                                              :src="addPrefixHost(item.image)"></loadingImage>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <div v-if="templateStyle === 'level-3'">
            <transition name="fade">
                <div class="theme-3" v-if="!haveImage">
                    <div class="practice_common_box">
                        <div class="all-option">
                            <div :class="activeIndex===index&&'active'"
                                 @click="answerHandler(index,item.isRight)"
                                 v-for="(item,index) in content.words"
                            ><span :class="isMore(item,13)">{{item.english || item.chinese || item.english}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="theme-4" v-if="haveImage">
                    <div class="practice_common_box">
                        <div class="option-left">
                            <div class="firstOption" :class="activeIndex===index&&'active'"
                                 @click="answerHandler(index,item.isRight)"
                                 v-for="(item,index) in content.words"
                            >
                                <loadingImage class="option-inner-img"
                                              :src="addPrefixHost(item.image)"></loadingImage>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
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
                activeIndex: "",
                isUpdate: false

            }
        },
        methods: {

            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            answerHandler(index, isRight){
                R.pipe(R.equals, this.setAnswer)(isRight, 'T');
                const answer = R.equals(isRight, 'T');
                let msg = "";
                const or = R.curry((a, b,  d) => (a(d) || b(d) ));
                if (this.templateStyle === 'level-4' && this.content.answerSentences){
                    msg = this.content.answerSentences[0].chinese;
                }else{
                    msg = R.pipe(R.filter(R.propEq('isRight', 'T')), R.map(or(R.prop('english'), R.prop("chinese"))), R.join(","))(this.content.words);
                }
                this.setAnswer({
                    answer,
                    msg
                });
                this.activeIndex = index;
            },
            init(){
                this.$nextTick(_ => {
                    const or = R.curry((a, b,  d) => (a(d) || b(d) ));
                    if (this.templateStyle === 'level-4'&& this.content.answerSentences){
                        this.setAnswer({
                            answer: false,
                            msg: this.content.answerSentences && this.content.answerSentences[0].chinese
                        });
                    }else{
                    this.setAnswer({
                        answer: false,
                        msg: this.content.words && R.pipe(
                            R.filter(R.propEq('isRight', 'T')),
                            R.map(or(R.prop('english'), R.prop("chinese"))),
                            R.join(",")
                        )(this.content.words)
                    });

                    }
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
                content: state => state.contentInfo ? state.contentInfo.content : {},
                templateStyle: state => state.templateStyle
            }),
            haveImage(){
                let flag = false;
                try {
                    this.content.words && this.content.words.forEach(item => {
                        item.image ? flag = true : void 0;
                    });
                } catch (e) {
                    return flag;
                }
                return flag;
            },
        },
        components: {loadingImage}
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
        font-family: GothamRounded-Medium;
        .practice_common_box {
            margin: 1% auto 0 auto;
            width: 60%;
            position: relative;
            text-align: center;
        }
        div[class$="-option"] {
            width: 100%;
            margin-top: 100px;
        }
        div[class$="-option"] > div {
            min-width: 2.2rem;
            padding: 24px 0;
            margin: 20px;
            background: url(~~assets/img/main_content/exercise/pit2.png) no-repeat;
            cursor: pointer;
            background-size: 100% 100%;
            display: inline-block;
            &.active {
                background-image: url(~~assets/img/main_content/exercise/pit2-active.png);
            }
        }
        div[class$="-option"] > div > span {
            font-size: 24px;
            color: black;
            user-select: none;
            cursor: pointer;
            &.more {
                font-size: 16px;
                margin: 0 10px;
            }
        }
        .audio {
            width: 18%;
            height: 430px;
            float: left;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            .audio-tool {
                display: none;
            }
        }
        .audio-icon {
            background: url(~~assets/img/main_content/exercise/audio-icon.png) no-repeat;
            width: 145px;
            height: 145px;
            position: relative;
            top: 10%;
            right: 4%;
        }
        .audio-button {
            background: url(~~assets/img/main_content/exercise/audio-play.png) no-repeat;
            width: 195px;
            height: 64px;
            position: relative;
            top: 15%;
            left: -22%;
            background-size: 100% 100%;
            cursor: pointer;
            &.active {
                background: url(~~assets/img/main_content/exercise/audio-player-active-style1.png) no-repeat;
                background-size: 100% 100%;
            }
        }
        .right-option {
            float: right;
        }

    }

    .theme-2 {
        .practice_common_box {
            margin: 1% auto 50px auto;
            position: relative;
            text-align: center;
        }
        .option-left {
            display: inline-block;
            width: 849px;
        }
        div[class*="Option"] {
            width: 250px;
            height: 198px;
            background: url(~~assets/img/main_content/exercise/picture-border.png);
            background-size: 100% 100%;
            margin-top: 50px;
            cursor: pointer;
            display: inline-block;
            margin-left: 40px;
            &.active {
                background: url(~~assets/img/main_content/exercise/picture-border2.png);
                background-size: 100% 100%;
            }
        }
        .option-inner-img {
            margin-top: 15px;
            width: 90%;
            height: 86%;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .audio {
            width: 18%;
            height: 430px;
            float: left;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            .audio-icon {
                background: url(~~assets/img/main_content/exercise/audio-icon.png);
                width: 145px;
                height: 145px;
                position: relative;
                top: 10%;
                right: 4%;
            }
            .audio-button {
                background: url(~~assets/img/main_content/exercise/audio-play.png);
                width: 195px;
                height: 64px;
                position: relative;
                top: 15%;
                left: -22%;
                cursor: pointer;
                &.active {
                    background: url(~~assets/img/main_content/exercise/audio-player-active-style1.png) no-repeat;
                    background-size: 100% 100%;
                }
            }

        }
        .option-right {
            float: right;
        }
    }

    .theme-3 {
        font-family: GothamRounded-Medium;
        .practice_common_box {
            margin: 1% auto 0 auto;
            width: 60%;
            position: relative;
            text-align: center;
        }
        div[class$="-option"] {
            width: 100%;
            margin-top: 100px;
        }
        div[class$="-option"] > div {
            width: 220px;
            padding: 24px 0;
            margin: 20px;
            background: url(~~assets/img/main_content/exercise/pit-yellow.png) no-repeat;
            cursor: pointer;
            background-size: 100% 100%;
            background-position: left top 6px;
            display: inline-block;
            &.active {
                background-image: url(~~assets/img/main_content/exercise/pit-yellow-active.png);
            }
        }
        div[class$="-option"] > div > span {
            font-size: 24px;
            color: black;
            user-select: none;
            cursor: pointer;
            &.more {
                font-size: 18px;
            }
        }
        .audio {
            width: 18%;
            height: 430px;
            float: left;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            .audio-tool {
                display: none;
            }
        }

        .right-option {
            float: right;
        }

    }

    .theme-4 {
        .practice_common_box {
            margin: 50px auto;
            position: relative;
            text-align: center;
        }
        .option-left {
            width: 6rem;
            display: inline-block;
        }
        div[class*="Option"] {
            width: 250px;
            height: 198px;
            background: url(~~assets/img/main_content/exercise/picture-border-yellow.png);
            background-size: 100% 100%;
            cursor: pointer;
            display: inline-block;
            margin: 50px 20px 0 20px;
            box-sizing: border-box;
            padding: 0.09rem 0.06rem 0.09rem 0.07rem;
            &.active {
                background: url(~~assets/img/main_content/exercise/sentence_bg_active.png);
                background-size: 100% 100%;
                height: 2.06rem;
                padding: 0.09rem 0.12rem 0.16rem 0.07rem;
                transition: all .1s ease-in;
            }
        }
        .option-inner-img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
        }
        .audio {
            width: 18%;
            height: 430px;
            float: left;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;

        }
        .option-right {
            float: right;
        }
    }


</style>
