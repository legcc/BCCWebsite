<template>
    <div :class="isUpdate&&'fadeIn'">
        <div v-if="templateStyle==='level-1'">
            <template v-if="haveImg">
                <div class="theme-1" v-if="position==='left'">
                    <div class="practice_listen_repeat1 practice_common_box">
                        <div class="listen_repeat1_left">
                            <div class="center_cell">
                                <ul class="listen_repeat1_wordinfor">
                                    <li><span class="pinyin">{{contentInfo.content.sentence[0].pinyin}}</span></li>
                                    <li><span
                                            class="listen_repeat1_cn">{{contentInfo.content.sentence[0].chinese}}</span>
                                    </li>
                                    <li>
                                        <span class="english">{{contentInfo.content.sentence[0].english}}</span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="listen_repeat1_right">
                            <div class="center_cell">
                                <div class="listen_repeat1_img listen_repeat1_img_h">
                                    <loadingImage class="picture"
                                                  :src="addPrefixHost(contentInfo.content.image)">
                                    </loadingImage>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="theme-2" v-if="position==='right'">
                    <div class="practice_listen_repeat1 practice_common_box">
                        <div class="listen_repeat1_left">
                            <div class="center_cell">
                                <div class="listen_repeat1_img listen_repeat1_img_h">
                                    <loadingImage class="picture"
                                                  :src="addPrefixHost(contentInfo.content.image)">
                                    </loadingImage>
                                </div>
                            </div>
                        </div>
                        <div class="listen_repeat1_right">

                            <div class="center_cell">
                                <ul class="listen_repeat1_wordinfor">
                                    <li><span class="pinyin">{{contentInfo.content.sentence[0].pinyin}}</span></li>
                                    <li><span
                                            class="listen_repeat1_cn">{{contentInfo.content.sentence[0].chinese}}</span>
                                    </li>
                                    <li>
                                        <span class="english">{{contentInfo.content.sentence[0].english}}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="theme-3">
                    <div class="container">
                        <ul class="content" v-for="item in content.sentence">
                            <li class="words"><em>{{item.pinyin}}</em></li>
                            <li class="words"><em>{{item.chinese}}</em></li>
                            <li class="words"><em>{{item.english}}</em></li>
                        </ul>
                    </div>
                </div>
            </template>
        </div>
        <div v-if="templateStyle==='level-2'" class="theme-6">
            <div class="practice_listen_repeat1 practice_common_box" v-if="!haveImg">
                <div class="listen_repeat1_left">
                    <div class="center_cell">
                        <div class="listen_repeat1_img listen_repeat1_img_h">
                            <loadingImage class="picture"
                                          :src="addPrefixHost(contentInfo.content.image)">
                            </loadingImage>
                        </div>
                    </div>
                </div>
                <div class="listen_repeat1_right">
                    <div class="center_cell">
                        <div v-if="isEnglish" class="sentence-container">
                            <p class="sentence">{{contentInfo.content.sentence[0].english}}</p>
                        </div>
                        <ul class="listen_repeat1_wordinfor" v-else>
                            <li><span class="pinyin">{{contentInfo.content.sentence[0].pinyin}}</span></li>
                            <li><span
                                    class="listen_repeat1_cn">{{contentInfo.content.sentence[0].chinese}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="practice_listen_repeat1 practice_common_box" v-else>
                <ul class="listen_repeat1_right noImg">
                    <li><span class="pinyin">{{contentInfo.content.sentence[0].pinyin}}</span></li>
                    <li><span
                            class="listen_repeat1_cn">{{contentInfo.content.sentence[0].chinese}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="templateStyle==='level-3'" class="theme-5">
            <div class="practice_common_box">
                <div class="left-content">
                    <loading-image class="content-image" :src="addPrefixHost(content.image)"></loading-image>
                </div>
                <div class="right-content">
                    <p class="sentence" v-for="item in content.sentence">{{item.chinese || item.english}}</p>

                </div>
            </div>
        </div>
        <div class="theme-4" v-if="templateStyle==='level-4'">
            <div class="practice_common_box">
                <template v-if="content.image">
                    <div class="left-content">
                        <loading-image class="content-image" :src="addPrefixHost(content.image)"></loading-image>
                    </div>
                    <div class="right-content">
                        <p class="sentence" v-for="(item,length) in content.sentences" v-if="length===0"
                           :class="isMore(item)">{{item.chinese || item.english || item.pinyin}}</p>
                    </div>
                </template>
                <template v-else>
                    <div class="right-content">
                        <p class="sentence noPicture" v-for="(item,length) in content.sentences" :class="isMore(item)">
                            {{item.chinese || item.english || item.pinyin}}</p>
                    </div>
                </template>
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
            }
        }, watch: {
            content(){
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
            isMore(item){
                return (item.chinese.length > 45 || item.english.length > 45 || item.pinyin.length > 45) && 'more';
            }
        },
        created(){
            this.$nextTick(_ => {
                setTimeout(_ => {
                    if(this.templateStyle !== "level-4"){
                    this.setAudioInfo({player: {display: 'none'}});}
                }, 600)
            })
        },
        destroyed(){
            this.setAudioInfo({player: {display: 'block'}});
        },
        computed: {
            ...mapState('index/exercise/index', {
                contentInfo: state => state.contentInfo,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
            haveImg(){
                let flag = false;
                try {
                    flag = R.ifElse(R.prop('image'), R.T, R.F)(this.content);
                } catch (e) {
                    return false;
                }
                return flag;
            },
            position(){
                const getPosition = R.prop('position');
                return getPosition(this.content.sentence[0]);
            },
            isEnglish(){
                return R.any(R.ifElse(R.prop('english'), R.T, R.F))(this.content.sentence)
            }
        },
        components: {loadingImage,}
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
    @import "~~assets/sass/mixins";

    .theme-1 {
        text-align: center;
        .practice_common_box {
            width: 750px;
            height: 100%;
            display: block;
            margin: 0 auto;
            position: relative;

            .listen_repeat1_left {
                width: 50%;
                height: 100%;
                display: table;
                float: left;
                text-align: center;
                margin-top: 1.5rem;
                .center_cell {
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 26px;
                    .pinyin {
                        color: #0000FF;
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
                    }
                }
            }
            .listen_repeat1_right {
                height: 100%;
                display: table;
                float: left;
                margin-top: .5rem;
                margin-left: .5rem;
                text-align: center;
                .center_cell {
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 26px;

                    .listen_repeat1_img_h {
                        width: 270px;
                        height: 320px;
                        background: url('~~assets/img/main_content/exercise/practice_bg_h.png') no-repeat;
                        background-size: 100% 100%;
                        line-height: 320px !important;
                        position: relative;
                        .picture {
                            max-width: 200px;
                            max-height: 260px;
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            border-radius: 5px;
                        }
                    }
                }
            }
        }

    }

    .theme-2 {
        text-align: center;
        .practice_common_box {
            min-width: 750px;
            height: 100%;
            display: block;
            margin: 0 auto;
            position: relative;

            .listen_repeat1_left {
                height: 100%;
                display: inline-block;
                vertical-align: middle;
                text-align: center;
                margin-top: 1rem;

                .center_cell {
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 26px;

                    .listen_repeat1_img_h {
                        line-height: 230px;
                        width: 300px;
                        height: 240px;
                        background: url('~~assets/img/main_content/exercise/choose1_img_bg.png') no-repeat left -7px top 6px;
                        background-size: 100% 100%;
                        position: relative;
                        .picture {
                            max-width: 200px;
                            max-height: 150px;
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            border-radius: 5px;
                        }
                    }
                }

            }
            .listen_repeat1_right {
                height: 100%;
                display: inline-block;
                vertical-align: middle;
                margin-left: .7rem;
                margin-top: 1.5rem;
                text-align: center;
                .center_cell {
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 26px;
                    .pinyin {
                        color: #0000FF;
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
                    }
                }

            }
        }

    }

    .theme-3 {
        .container {
            text-align: center;
            margin: 100px auto auto auto;
            width: 60%;
            .content {
                display: inline-block;
                font-size: 26px;
                .words {
                    min-width: 200px;
                    max-width: 7rem;
                }
                .words:nth-child(1) {
                    color: #b848a9;
                }
                .words:nth-child(2) {
                    border-radius: 20px;
                    font-size: 30px;
                    color: #041106;
                    display: inline-block;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    padding: 30px 60px;
                    background: url(~~assets/img/main_content/exercise/practice_bg_w.png) no-repeat;
                    background-position: center center;
                    background-size: 100% 100%;
                }
                .words:nth-child(3) {
                    color: #5974be;
                }
            }
        }
    }

    .theme-4 {
        .practice_common_box {
            text-align: center;
            margin: 40px auto auto auto;
        }
        .left-content {
            display: inline-block;
            margin-left: 100px;
            width: 490px;
            box-sizing: border-box;
            vertical-align: middle;
            height: 346px;
            background: url(~~assets/img/main_content/exercise/sentence_bg.png) no-repeat;
            background-size: contain;
            position: relative;
            padding: .25rem .35rem .24rem .2rem;
        }
        .content-image {
            width: 100%;
            border-radius: 5px;
            height: 100%;
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        .right-content {
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            word-break: break-all;
            padding-top: 40px;
            box-sizing: border-box;
        }
        .sentence {
            width: 360px;
            line-height: 50px;
            font-family: GothamRounded-Medium;
            font-style: normal;
            font-size: 40px;
            display: inline-block;
            color: rgb(11, 47, 73);
            margin-bottom: 30%;
            text-align: left;
            padding-left: 8%;
            margin-top: 10%;
            &.more {
                font-size: 24px;
            }
            &.noPicture {
                width: 55%;
                margin-top: 20px;
                margin-bottom: 20px;
            }
        }

        .speak-icon {
            position: relative;
            display: inline-block;
            float: right;
        }
        .hint {
            width: 118px;
            height: 114px;
            display: inline-block;
            background: url(~~assets/img/main_content/exercise/hint.png) no-repeat;
            cursor: pointer;
        }
        .record {
            display: inline-block;
            background: url(~~assets/img/main_content/exercise/record.png) center no-repeat;
            width: 118px;
            height: 114px;
            cursor: pointer;
        }
        .read_count_down {
            position: relative;
            top: 50% !important;
            transform: translateY(-50%);
            width: 118px;
            height: 114px;
            padding: 0;
            line-height: 113px;
            font-size: 42px;
            color: white;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            display: none;
            cursor: pointer;
        }
    }

    .theme-5 {
        .practice_common_box {
            height: 430px;
            text-align: center;
            margin: auto;
        }
        .left-content {
            display: inline-block;
            width: 430px;
            vertical-align: middle;
            box-sizing: border-box;
            height: 310px;
            background: url(~~assets/img/main_content/exercise/sentence_bg-yellow.png) no-repeat;
            background-size: 100% 100%;
            position: relative;
            padding: 13px;
        }
        .content-image {
            width: 100%;
            height: 100%;
        }
        .right-content {
            display: inline-block;
            height: 430px;
            vertical-align: middle;
            text-align: center;
        }
        .sentence {
            height: 25%;
            line-height: 50px;
            width: 320px;
            font-family: "Calibri", "楷体";
            font-style: normal;
            font-size: 40px;
            display: inline-block;
            color: rgb(0, 0, 0);
            margin-bottom: 30%;
            text-align: left;
            white-space: pre;
            padding-left: 8%;
            margin-top: 10%;
        }
    }

    .theme-6 {
        text-align: center;
        .practice_common_box {
            width: 900px;
            height: 100%;
            display: block;
            margin: 0 auto;
            position: relative;
            margin-top: .5rem;

            .listen_repeat1_left {
                height: 100%;
                display: inline-block;
                vertical-align: middle;
                text-align: center;

                .center_cell {
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 26px;

                    .listen_repeat1_img_h {
                        line-height: 230px;
                        width: 300px;
                        height: 240px;
                        @include fullBg('~~assets/img/exercise/level2/xiangkuangshu.png');
                        position: relative;
                        padding: 32px 24px 20px 40px;
                        .picture {
                            width: 100%;
                            height: 100%;
                            border-radius: 12px;
                        }
                    }
                }

            }
            .listen_repeat1_right {
                height: 100%;
                font-size: 26px;
                display: inline-block;
                vertical-align: middle;
                margin-left: 30px;
                text-align: center;
                .sentence-container {
                    $width: 360px;
                    $ratio: (width:(868px), height:(676px));
                    $height: getHeightFromAspectRatio($ratio, $width);
                    width: $width;
                    min-height: $height;
                    line-height: $height;
                    padding: 0 43px;
                    text-align: left;
                    display: inline-block;
                    @include fullBg('~~assets/img/exercise/level2/xiangkuang.png');
                    .sentence {
                        line-height: 1.6;
                        margin: 40px 0;
                        width: 100%;
                        word-wrap: break-word;
                        display: inline-block;
                    }

                }
                .center_cell {
                    display: table-cell;
                    vertical-align: middle;
                }
                .pinyin {
                    color: #071f30;
                }
                .listen_repeat1_cn {
                    padding: 5px 20px;
                    min-width: 300px;
                    @include fullBg('~~assets/img/exercise/level2/juzi.png');
                    font-size: 30px;
                    color: #ffffff;
                    display: inline-block;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                .english {
                    color: #008000;
                }
            }
            .noImg {
                margin-top: 100px;
            }
        }

    }

</style>
