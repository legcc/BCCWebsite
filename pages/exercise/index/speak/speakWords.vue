<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="theme-1" v-if="templateStyle==='level-1'&&haveImg">
            <div class="practice_listen_repeat1 practice_common_box">
                <div class="listen_repeat1_left">
                    <div class="center_cell">
                        <div class="listen_repeat1_img">
                            <loadingImage
                                    class="picture"
                                    :src="addPrefixHost(content.image)"></loadingImage>
                        </div>
                    </div>
                </div>
                <div class="listen_repeat1_right" v-for="item in content.words">
                    <div class="center_cell"><p>
                        <span class="pinyin">{{item.pinyin}}</span>
                        <span class="listen_repeat1_cn">{{item.chinese}}</span>
                        <span class="english">{{content.english}}</span></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="theme-2" v-if="templateStyle==='level-1'&&!haveImg">
            <div :class="isUpdate&&'fadeIn'" class="practice_listen_repeat2 practice_common_box">
                <template v-for="item in content.words">
                    <div class="listen_repeat2_word" :class="isMore(item,16)">
                        <div class="container" :class="isMore(item,7)">
                            <span class="pinyin">{{item.pinyin}}</span>
                            <span>{{item.chinese}}</span>
                            <span class="english">{{item.english}}</span>
                        </div>
                    </div>
                    <span v-if="item.english">{{item.english}}</span>
                </template>
            </div>
        </div>
        <div class="theme-3" v-if="templateStyle==='level-2'">
            <div class="container">
                <div class="picture-container">
                    <loadingImage :src="addPrefixHost(content.image)" class="pic" alt=""></loadingImage>
                </div>
                <button class="answer-btn" v-for="item in content.words">
                    {{item.chinese || item.english || item.pinyin}}
                </button>
            </div>
        </div>
        <div class="theme-4" v-if="templateStyle==='level-3'">
            <div class="practice_common_box">
                <div class="left-content" v-for="item in content.words" :class="isOverflow(item.english,7)">
                    <div class="content-text"><span>{{item.chinese || item.english || item.pinyin}}</span></div>
                </div>
            </div>
        </div>
        <div class="theme-5" v-if="templateStyle==='level-4'">
            <div class="practice_common_box">
                <div class="left-content" v-for="item in content.words">
                    <div class="content-text"><span class="chinese" :class="isMore(item,4)"
                                                    v-if="item.chinese">{{item.chinese}}</span><span
                            :class="isMore(item,10)" v-else>{{item.english || item.pinyin}}</span></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import axios from 'axios';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        data () {
            return {
                isUpdate: false,

            }
        }, watch: {
            content(){
//                当数据发生变化时传入新的音频
                this.setAudioUrl(this.content.audio);
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {};
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600)
            }
        },

        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAudioUrl'
            ]),
            isOverflow(word, maxLen){
                return word.length > maxLen && 'overflow'
            }
        },
        created(){
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
            haveImg(){
                let flag = false;
                try {
                    const condition = R.pipe(R.prop('image'), R.not);
                    R.ifElse(condition, R.F, R.T)(this.content);
                } catch (e) {
                    return false;
                }
                return flag;
            }
        },
        components: {loadingImage,}
    }
</script>

<style lang="scss" scoped>

    @import "~~assets/sass/functions";
    @import "~~assets/sass/mixins";

    @mixin center {
        margin: 0 auto;
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

    .theme-1 {
        .audio-player {
            display: none;
        }
        .practice_common_box {
            width: 750px;
            height: 70%;
            display: block;
            margin: 0 auto;
            position: absolute;
            left: 0;
            right: 0;
            .listen_repeat1_left, .listen_repeat1_right, .listen_repeat1_wordbox {
                width: 50%;
                height: 100%;
                display: table;
                float: left;
                text-align: center;
                .center_cell {
                    display: table-cell;
                    vertical-align: middle;
                    .listen_repeat1_img {
                        display: inline-block;
                        background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
                        background-position: -6px center;
                        background-size: 100% 100%;
                        line-height: 230px;
                        width: 300px;
                        height: 240px;
                        .picture {
                            width: 200px;
                            height: 150px;
                            display: inline-block;
                            vertical-align: middle;
                        }
                    }
                }
                .pinyin {
                    color: #0000FF;
                    display: block;
                    font-size: 26px;
                }

                .listen_repeat1_cn {
                    padding: 5px 20px;
                    background: white;
                    border-radius: 20px;
                    font-size: 30px;
                    color: #0082AA;
                    display: inline-block;
                    margin-top: 10px;
                    margin-bottom: 10px;

                }
                .english {
                    color: #008000;
                    display: block;
                    font-size: 26px;
                }
            }
        }
    }

    .theme-5 {
        .practice_common_box {
            height: 430px;
            padding-top: 3%;
            box-sizing: border-box;
            min-width: 850px;
        }
        .left-content {
            display: block;
            margin: 0 auto;
            height: 376px;
            width: 533px;
            background: url(~~assets/img/main_content/exercise/eyes_bg.png) no-repeat;
            background-size: contain;
            position: relative;
        }
        .content-text > span {
            font-family: 'Calibri';
            font-weight: 400;
            font-style: normal;
            font-size: 90px;
            cursor: pointer;
            color: black;
            display: inline-block;
            position: absolute;
            height: 90px;
            margin: 0 20px;
            line-height: 80px;
            width: 435px;
            top: 50%;
            text-align: center;
            right: 0;
            transform: translateY(-50%);
            &.more {
                font-size: 50px;
            }
            &.chinese.more {
                font-size: 60px;
            }
        }

    }

    .theme-2 {

        .practice_common_box {
            text-align: center;
            display: block;
            margin: 100px auto auto auto;
            width: 100%;
        }
        .listen_repeat2_word {
            background: url(~~assets/img/main_content/exercise/listen_choose5_bg.png) no-repeat;
            background-position: center;
            background-size: 100% 80%;
            font-size: 40px;
            text-align: center;
            color: #CC0099;
            display: inline-block;
            min-width: 230px;
            padding: 100px 30px;
            text-align: center;
            &.more {
                margin-top: -40px;
                padding: 1.3rem 0.3rem;
            }
            .container {
                display: inline-block;
                vertical-align: middle;
                line-height: 1;
                &.more {
                    margin: .2rem .5rem;
                    font-size: 30px;
                }
                .pinyin {
                    color: rgb(2, 128, 0);

                }
                .english {
                    color: #125a8f;
                }
                span {
                    display: block;
                    text-align: center;
                    margin: 8px auto;
                    min-width: 180px;
                }
            }
        }
    }

    .theme-4 {
        .practice_common_box {
            height: 430px;
            font-family: "宋体";
            padding-top: 3%;
            box-sizing: border-box;
            min-width: 850px;
            text-align: center;
        }
        .left-content {
            display: inline-block;
            min-width: 383px;
            height: 331px;
            position: relative;
            word-wrap: break-word;
            word-break: break-all;
            background: url(~~assets/img/main_content/exercise/words_bg_yellow.png) no-repeat center;
            background-size: 100% 100%;
            text-align: center;
            line-height: 331px;
            &.overflow {
                padding: 20px 40px;
                .content-text > span {

                    font-size: 50px;
                }
            }
        }
        .content-text > span {
            font-family: chinese;
            text-shadow: 0 1px 2px white;
            font-weight: bold;
            font-style: normal;
            font-size: 90px;
            cursor: pointer;
            color: black;

        }

    }

    .theme-3 {
        text-align: center;
        .container {
            display: inline-block;
        }
        .picture-container {
            width: 300px;
            $ratio: (width:(682px), height:(587px));
            height: getHeightFromAspectRatio($ratio, 300px);
            text-align: center;
            padding: 36px 25px 22px 42px;
            @include center;
            @include fullBg("~~assets/img/exercise/level2/xiangkuangshu.png");
            .pic {
                width: 100%;
                height: 100%;
                border-radius: 12px;
            }
        }
        .answer-btn {
            $ratio: (width:(518px), height:(257px));
            min-width: 1.5rem;
            padding: 0 40px;
            $height: getHeightFromAspectRatio($ratio, 150px);
            height: $height;
            line-height: $height - 10px;
            font-size: 26px;
            @include fullBg("~~assets/img/exercise/level2/button.png");
            @include center;
            margin-top: 40px;

        }
    }
</style>
