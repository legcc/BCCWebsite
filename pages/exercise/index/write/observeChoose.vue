<template>
    <div>
        <figure class="tools-list">
            <figcaption>
                <div class="hint-icon" @click="hint||showHint()" :class="hint && 'active'"></div>
            </figcaption>
        </figure>
        <div class="container" :class="isUpdate&&'fadeIn'">
            <div class="practice_observe_choose practice_common_box">
                <div class="observe_choose_content">
                    <div class="observe_choose center_cell">
                        <div class="observe_choose_left">
                            <div class="center_cell">
                                <ul class="strokes_list">
                                    <li v-for="item in content.strokes" @click="answerHandler(item)">
                                        <loadingImage
                                                :src="addPrefixHost(item.stroke)"></loadingImage>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="observe_choose_right">
                            <div class="center_cell" v-for="item in content.words">
                                <div class="observe_choose_right_1">
                                    <div class="center_cell"><span>{{item.pinyin}}</span>
                                        <loadingImage class="observe_choose_wordimg"
                                                      :src="getWriteImage(item)"></loadingImage>
                                        <span>{{item.english}}</span>
                                    </div>
                                </div>
                                <div class="observe_choose_right_2" v-if="item.image">
                                    <div class="center_cell">
                                        <loadingImage
                                                :src="addPrefixHost(item.image)"></loadingImage>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
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
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            ...mapMutations('index/exercise/index', [
                'CompareControl',
            ]),
        },
        destroyed(){
            setTimeout(_ => this.CompareControl(true), 100);
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    writingPic: "",
                    rightOrder: [],
                    allObserve: [],
                    hint: false,
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                if (this.content.strokeOrder && this.content.strokeimg) {
                    this.rightOrder = R.split(",", this.content.strokeOrder[0]);
                    this.allObserve = R.clone(this.content.strokeimg);
                }
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600);
                this.init();
            }
        },
    })
    export default class choose extends Vue {
        isUpdate = false;
        writingPic = "";
        rightOrder = [];
        allObserve = [];
        hint = false;

        created() {
            this.$nextTick(_ => {
                //                    隐藏compare按钮
                setTimeout(_ => this.CompareControl(false), 100);
                if (this.content.strokeOrder && this.content.strokeimg) {
                    this.rightOrder = R.split(",", this.content.strokeOrder[0]);
                    this.allObserve = R.clone(this.content.strokeimg);
                }
            })
        }

        mounted() {
            this.init();
        }

        showHint() {
            this.hint = !this.hint;
            setTimeout(_ => {
                this.hint ? this.hint = false : '';
            }, 8000);
        }

        getWriteImage(item) {
            return !this.hint ? this.addPrefixHost(this.writingPic || item.wordImage) : this.addPrefixHost(item.wordGif);
        }

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: true,
                    prompt: true,
                    noCheck: true,
                });

            })
        }

        answerHandler(item) {
            if (this.rightOrder[0] === item.order) {
                if (this.allObserve.length) {
                    this.rightOrder = R.drop(1, this.rightOrder);
                    this.writingPic = this.allObserve[0];
                    this.allObserve = R.drop(1, this.allObserve);
                }
            } else {
                this.$message.error("Stroke error ...");
            }
            this.setAnswer({
                answer: true,
                prompt: true
            });
        }
    }
</script>

<style lang="scss" scoped>
    .fadeIn {
        animation: fadeIn .4s ease-in;
        transform: translateZ(0);
    }

    @import "~~assets/sass/functions";
    @import "~~assets/sass/mixins";
    @keyframes fadeIn {
        from {
            transform-origin: left;
            transform: scaleX(.4);
            opacity: 0;
        }
    }

    .practice_common_box {
        width: 750px;
        height: 100%;
        display: block;
        margin: 0 auto;
        position: relative;
        text-align: center;
        box-sizing: border-box;
    }

    .observe_choose_content {
        width: 100%;
        height: 100%;
        display: table;
        box-sizing: border-box;
    }

    .observe_choose {
        position: relative;
    }

    .center_cell {
        display: table-cell;
        vertical-align: middle;
    }

    .observe_lighten {
        float: left;
        width: 70px;
        height: 68px;
        cursor: pointer;
        display: inline-block;
        background: url(~~assets/img/main_content/exercise/lighten_img.png) no-repeat;
        background-position: center center !important;
        background-size: 100% 100% !important;
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: -200px;
        box-sizing: border-box;

        bottom: 0;

    }

    .observe_choose_left {
        width: 450px;
        height: 400px;
        float: left;
        background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
        background-size: 100% 100%;
        background-position: -8px 10px;
        border-radius: 20px;
        padding: 50px;
        display: table;
        box-sizing: border-box;

    }

    .observe_choose_left .center_cell {
        width: 100%;
        height: 100%;
    }

    .observe_choose_left .strokes_list li {
        display: inline-block;
        width: 140px;
        height: 80px;
        line-height: 80px;
        cursor: pointer;
        vertical-align: middle;
        margin: 10px;
        box-sizing: border-box;

    }

    .observe_choose_left .strokes_list li img {
        display: inline-block;
        max-width: 65px;
        max-height: 65px;
        vertical-align: middle;
    }

    .observe_choose_right {
        width: 250px;
        height: 400px;
        float: right;
        display: table;
    }

    .observe_choose_right .center_cell {
        width: 100%;
        height: 100%;
        padding: 30px;
    }

    .observe_choose_right_1, .observe_choose_right_2 {
        width: 240px;
        height: 180px;
        margin: 0 auto;
        background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
        background-size: 95% 100%;
        background-position: center 6px;
        color: black;
        display: table;
    }

    .observe_choose_right .center_cell {
        width: 100%;
        height: 100%;
    }

    .observe_choose_right_1 span, .observe_choose_right_2 span {
        display: block;
        font-size: 24px;
    }

    .observe_choose_right_1 .observe_choose_wordimg, .observe_choose_right_2 .observe_choose_wordimg {
        position: relative;
        width: 90px;
        height: 90px;
        margin: 0 auto;
    }

    .observe_choose_right_1 span, .observe_choose_right_2 span {
        display: block;
        font-size: 24px;
    }

    .observe_choose_right_1 .observe_choose_wordimg img, .observe_choose_right_2 .observe_choose_wordimg img {
        width: 100%;
        height: 100%;
    }

    img[class^="write"] {
        position: absolute;
        top: 0;
        left: -1px;
        display: none;
    }

    .observe_choose_right_1 .observe_choose_wordimg img, .observe_choose_right_2 .observe_choose_wordimg img {
        width: 100%;
        height: 100%;
    }

    .observe_choose_right_1, .observe_choose_right_2 {
        width: 240px;
        height: 180px;
        margin: 0 auto;
        background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
        background-size: 95% 100%;
        background-position: center 6px;
        color: black;
        display: table;
    }

    .observe_choose_right .center_cell {
        width: 100%;
        height: 100%;
    }

    .observe_choose_right_2 img {
        width: 120px;
        height: 120px;
    }

    .tools-list {
        position: absolute;
        margin-top: 20px;
        right: 100px;
        .hint-icon {
            cursor: pointer;
            width: 135px;
            height: 111px;
            @include fullBgWithPicName('hint.png');
            &:hover {
                transition: all .1s ease-in;
                opacity: .8;
            }
            &.active {
                transition: all .1s ease-in;
                filter: drop-shadow(2px 2px 2px black);
            }
        }
    }

</style>
