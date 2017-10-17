<template>
    <div :class="isUpdate&&'fadeIn'" v-if="templateStyle==='level-1'">
        <div class="theme-1" v-if="haveImg">
            <div class="column" v-for="(words,index) in content.words" @click="answerHandler(index,words.isRight)">
                <div class="pic-container" :class="activeIndex===index&&'active'">
                    <loadingImage :src="addPrefixHost(words.image)" alt="" class="picture"></loadingImage>
                </div>
                <ul class="pic-legend" v-if="words.pinyin||words.chinese||words.english">
                    <template v-if="words.chinese">
                        <li class="sup-name" :class="isOverflow(words.pinyin,5)">
                            {{words.pinyin}}
                        </li>
                        <li class="chinese-name" :class="activeIndex===index&&'active'">
                            {{words.chinese}}
                        </li>
                        <li>
                        <li class="sub-name">
                            {{words.english}}
                        </li>
                    </template>
                    <template v-else-if="words.pinyin">
                        <li class="chinese-name-single" :class="activeIndex===index&&'active'">
                            <em :class="isMore(words,7)">{{words.pinyin }}</em>
                        </li>
                    </template>
                    <template v-else-if="words.english">
                        <li class="chinese-name-single" :class="activeIndex===index&&'active'">
                            <em :class="isMore(words,7)">{{words.english }}</em>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <div class="theme-2" v-if="!haveImg">
            <div class="column" v-for="(words,index) in content.words" @click="answerHandler(index,words.isRight)">
                <ul class="pic-words-list" :class="activeIndex===index&&'active'">
                    <template v-if="words.chinese">
                        <li>
                            <em class="sup-name" :class="isOverflow(words.pinyin,5)">
                                {{words.pinyin}}
                            </em></li>
                        <li>
                        <span class="chinese-name" :class="activeIndex===index&&'active'">
                                {{words.chinese}}
                            </span>
                        </li>
                        <li><em class="sub-name">
                            {{words.english}}
                        </em></li>
                    </template>
                    <template v-else-if="words.pinyin">
                        <li>
                            <span class="chinese-name-single" :class="activeIndex===index&&'active'">
                                <em :class="isMore(words,7)">{{words.pinyin }}</em>
                            </span>
                        </li>
                    </template>
                    <template v-else-if="words.english">
                        <li>
                            <span class="chinese-name-single" :class="activeIndex===index&&'active'">
                                <em :class="isMore(words,7)">{{words.english }}</em>
                            </span>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
    <div :class="isUpdate&&'fadeIn'" v-else-if="templateStyle==='level-2'">
        <div class="theme-3" v-if="haveImg">
            <div class="column" :class="content.words&&content.words.length>2&&'overflow'"
                 v-for="(words,index) in content.words" @click="answerHandler(index,words.isRight)">
                <div class="pic-container" :class="activeIndex===index&&'active'">
                    <loadingImage :src="addPrefixHost(words.image)" alt="" class="picture"></loadingImage>
                </div>
                <ul class="pic-legend">
                    <li class="sup-name" v-if="words.pinyin">{{words.pinyin}}</li>
                    <li class="chinese-name">{{words.chinese}}</li>
                </ul>
            </div>
        </div>
        <div class="theme-4" v-if="!haveImg">
            <div class="column" v-for="(words,index) in content.words" @click="answerHandler(index,words.isRight)">
                <ul class="pic-words-list" :class="activeIndex===index&&'active'">
                    <template v-if="words.chinese||words.pinyin">
                        <li>
                            <span class="chinese-name" :class="activeIndex===index&&'active'">
                                <em :class="isMore(words,9)">{{words.chinese || words.pinyin}}</em>
                            </span>
                        </li>
                        <li><em class="sub-name">
                            {{words.english}}
                        </em></li>
                    </template>
                    <template v-else>
                        <li>
                            <span class="chinese-name" :class="activeIndex===index&&'active'">
                                <em :class="isMore(words,9)">{{words.english }}</em>
                            </span>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    import Vue from 'vue'
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
                'setAudioUrl',
                'setAnswer'
            ]),
            answerHandler(index, isRight){
                const answer = R.equals(isRight, 'T');
                const word = R.find(R.propEq('isRight', 'T'))(this.content.words);
                this.setAnswer({answer, msg: word.chinese || word.english || word.pinyin});
                this.activeIndex = index;
            },
            isOverflow(item, len){
                return item.length > len && 'overflow'
            },
            init(){
                this.$nextTick(_ => {
                    if (this.content.words) {
                        const word = R.find(R.propEq('isRight', 'T'))(this.content.words);
                        this.setAnswer({answer: false, msg: word.chinese || word.english || word.pinyin});
                    }
                })
            }
        },
        mounted(){
//            设置是否播放器样式
//            this.setAudioInfo({style: "display:none"});
            this.init();
            this.setAudioUrl(this.content.audio);
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
                    const words = this.contentInfo.content.words;
                    flag = R.ifElse(R.any(R.ifElse(R.prop('image'), R.T, R.F)), R.T, R.F)(words);
                } catch (e) {
                    return false;
                }
                return flag;
            }
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.setAudioUrl(this.content.audio);
                this.isUpdate = true;
                const initData = {
                    activeIndex: "",
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
        components: {loadingImage,}
    }
</script>

<style lang="less" scoped>
    .fadeIn {
        animation: fadeIn .6s ease-in;
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
        .column {
            display: inline-block;
            margin-top: .5rem;
            text-align: center;
            cursor: pointer;
            &:not(:last-child) {
                margin-right: 2%;

            }
            .pic-container {
                width: 300px;
                height: 240px;
                background: url("~~assets/img/main_content/exercise/choose_block_bg.png") no-repeat;
                background-size: 300px 240px;
                position: relative;
                background-position: left -0.05rem bottom -0.08rem;
                &.active {
                    background-image: url("~~assets/img/main_content/exercise/choose_block_bg_active.png");
                }
                .picture {
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: auto;
                    position: absolute;
                    max-width: 2.1rem;
                    max-height: 1.5rem;
                    border-radius: 5px;
                }
            }
            .pic-legend {
                margin: .15rem auto 0 auto;
                min-width: .9rem;
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                .sup-name {
                    color: #BC7EB4;
                    font-family: Calibri;
                }
                .chinese-name {
                    color: black;
                    font-family: GothamRounded-Book;
                    font-weight: normal;
                    margin: 4px 0;
                    min-width: 120px;
                    height: .4rem;
                    line-height: .4rem;
                    background: white;
                    display: inline-block;
                    border-radius: .25rem;
                }
                .chinese-name-single {
                    color: black;
                    font-family: GothamRounded-Book;
                    font-weight: normal;
                    margin: 4px 0;
                    min-width: 120px;
                    height: .4rem;
                    display: inline-block;
                    line-height: .4rem;
                    background: white;
                    border-radius: .25rem;
                    .more {
                        display: inline-block;
                        font-size: 18px;
                        vertical-align: middle;
                    }
                }

                .sub-name {
                    color: #435CF7;
                    font-family: Calibri;
                }
            }
        }
    }

    .theme-2 {
        text-align: center;
        .column {
            display: inline-block;
            margin-top: 1rem;
            text-align: center;
            &:not(:last-child) {
                margin-right: 2%;

            }
            .pic-words-list {
                min-width: 2rem;
                border: 1px solid transparent;
                padding-bottom: 10px;
                cursor: pointer;
                &.active {
                    border-color: white;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 10px;
                }
                li {
                    text-align: center;
                    font-size: 26px;

                }

                .sup-name {
                    color: #CC00CC;
                }
                .sub-name {
                    color: #008000;
                }
                .chinese-name {
                    margin: .08rem 0 .1rem 0;
                    display: inline-block;
                    background: url("~~assets/img/main_content/exercise/cloud.png");
                    color: #0082AA;
                    min-width: 140px;
                    padding: 0 10px;
                    height: 140px;
                    background-size: 100% 100%;
                    background-position: center;
                    line-height: 130px;
                    font-size: 36px;

                }
                .chinese-name-single {
                    margin: .08rem 0 .1rem 0;
                    display: inline-block;
                    background: url("~~assets/img/main_content/exercise/cloud.png");
                    color: #0082AA;
                    min-width: 140px;
                    padding: 0 10px;
                    min-height: 140px;
                    background-size: 100% 100%;
                    background-position: center;
                    line-height: 130px;
                    font-size: 36px;
                    .more {
                        margin: 20px 40px 40px 40px;
                        display: inline-block;
                        font-size: 28px;
                    }
                }
            }
        }
    }

    .theme-3 {
        text-align: center;
        .column {
            display: inline-block;
            margin-top: .5rem;
            text-align: center;
            cursor: pointer;
            &:not(:last-child) {
                margin-right: 2%;
            }
            &.overflow:not(:last-child) {
                margin-right: 5px;
            }
            &.overflow {
                .pic-container {
                    width: 300px;
                    height: 250px;
                    background: url("~~assets/img/exercise/level2/xiangkuangshu.png") no-repeat center;
                    background-size: 100% 100%;
                    position: relative;
                    padding: 0.28rem 0.2rem 0.2rem 0.35rem;
                    box-sizing: border-box;
                    background-position: center;
                    &.active {
                        transition: all .1s ease-in;
                        padding: 0.3rem 0.26rem 0.22rem 0.35rem;
                        background-image: url("~~assets/img/exercise/level2/kuang-active.png");
                    }
                }
            }
            .pic-container {
                width: 340px;
                height: 290px;
                background: url("~~assets/img/exercise/level2/xiangkuangshu.png") no-repeat center;
                background-size: 100% 100%;
                position: relative;
                padding: 0.3rem 0.23rem 0.2rem 0.35rem;
                box-sizing: border-box;
                background-position: center;
                &.active {
                    transition: all .1s ease-in;
                    padding: 0.3rem 0.29rem 0.22rem 0.35rem;
                    background-image: url("~~assets/img/exercise/level2/kuang-active.png");
                }
                .picture {
                    width: 100%;
                    height: 100%;
                    border-radius: .05rem;
                }
            }
            .pic-legend {
                margin: .15rem auto 0 auto;
                width: 1.2rem;
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                .sup-name {
                    color: #071f30;
                    font-family: Calibri;
                }
                .chinese-name {
                    color: black;
                    font-family: GothamRounded-Book;
                    font-weight: normal;
                    margin: 4px 0;
                    width: 100%;
                    height: .6rem;
                    line-height: .6rem;
                    font-size: 24px;
                    color: #071f30;
                    background: url("~~assets/img/exercise/level2/button.png");
                    background-size: 100% 100%;
                }
                .sub-name {
                    color: #435CF7;
                    font-family: Calibri;
                }
            }
        }
    }

    .theme-4 {
        text-align: center;
        .column {
            display: inline-block;
            margin-top: 1.3rem;
            text-align: center;
            &:not(:last-child) {
                margin-right: 2%;

            }
            .pic-words-list {
                min-width: 2rem;
                border: 1px solid transparent;
                padding-bottom: 10px;
                cursor: pointer;
                &.active {
                    .chinese-name {
                        background-image: url("~~assets/img/exercise/button-green-active.png");
                    }
                }
                li {
                    text-align: center;
                    font-size: 26px;
                    .overflow {
                        font-size: 20px;

                    }

                }

                .sup-name {
                    color: #CC00CC;
                }
                .sub-name {
                    color: #071f30;
                }
                .chinese-name {
                    margin: .08rem 0 .5rem 0;
                    display: inline-block;
                    background: url("~~assets/img/exercise/level2/button.png");
                    min-width: 200px;
                    height: 100px;
                    background-size: 100% 100%;
                    background-position: center;
                    padding: 0 30px;
                    line-height: 80px;
                    font-size: 34px;
                    color: #0b2f49;
                    .more {
                        font-size: 24px;
                        display: inline-block;
                        margin: 0 30px;
                    }
                }

            }
        }
    }

</style>
