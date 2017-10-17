<template>
    <div>
        <div class="theme-1" :class="isUpdate&&'fadeIn'" v-if="templateStyle === 'level-4'">
            <div class="practice_common_box">

                <div class="right-content">

                    <div class="content-item" v-for="(item,index)  in content.questions">
                        <span class="article">{{item.question}}</span>
                        <div class="icon-container"><i class="icon-true"
                                                       @click="iconToggle($event,index,item.isRight,'T')"></i>
                            <i class="icon-false" @click="iconToggle($event,index,item.isRight,'F')"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="theme-2" :class="isUpdate&&'fadeIn'" v-else-if="templateStyle === 'level-1'">
            <div class="practice_common_box">

                <div class="right-content">
                    <div class="content-item" v-for="(item,index) in content.questions">
                            <span class="article">
                            <em>{{item.question}}</em>
                        </span>
                        <i class="icon-false" @click="iconToggle($event,index,item.isRight,'F')"></i><i
                            class="icon-true" @click="iconToggle($event,index,item.isRight,'T')"></i>
                    </div>

                </div>
            </div>
        </div>
        <div v-else class="coming-soon-container">
            <div class="coming-soon"></div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage';
    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        data () {
            return {
                answers: [],
                isUpdate: false
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            iconToggle(ev, index, isRight, select){
                this.answers.length ? void(0) : this.answers = R.map(R.always(""))(this.content.questions);
                this.answers = R.adjust(R.always(isRight === select), index, this.answers);
                const answer = R.all(R.clone)(this.answers);
                this.setAnswer({
                    answer,
                    msg: R.pipe(R.map(R.prop("isRight")), R.join(","))(this.content.questions)
                });
                const ele = ev.target;
                ele.classList.add('active');
                if (ele.nextElementSibling) {
                    ele.nextElementSibling.classList.remove('active');
                } else {
                    ele.previousElementSibling.classList.remove('active');
                }
            },
            init(){
                this.$nextTick(_ => {
                    if (this.content.questions) {

                        this.setAnswer({
                            answer: false,
                            msg: R.pipe(R.map(R.prop("isRight")), R.join(","))(this.content.questions)
                        })
                    }
                    ;
                })
            }
        },
        mounted(){
            this.init();
        },
        computed: {
            ...mapState('index/exercise/index', {
                content: state => state.contentInfo ? state.contentInfo.content : {},
                templateStyle: state => state.templateStyle
            }),
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answers: [],
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

    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
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
        text-align: center;
        .practice_common_box {
            text-align: center;
            margin-top: 3%;
            display: inline-block;
            min-width: 720px;
            .right-content {
                background: url(~~assets/img/main_content/exercise/listenText-01.png) no-repeat center;
                background-size: 100% 100%;
                padding: 5% 100px;
                margin-left: 10px;
                .content-item {
                    width: 100%;
                    text-align: left;
                }
                .content-item > span {
                    width: 500px;
                    display: inline-block;
                    font-size: 25px;
                    color: blue;
                    line-height: 1.3;
                    vertical-align: middle;
                }
                .icon-container {
                    display: inline-block;
                    vertical-align: middle;
                }
                .icon-true {
                    display: inline-block;
                    background: url(~~assets/img/main_content/exercise/T.png) no-repeat;
                    width: 71px;
                    height: 90px;
                    cursor: pointer;
                    &.active {
                        background: url(~~assets/img/main_content/exercise/TT.png) no-repeat;
                    }
                }
                .icon-false {
                    display: inline-block;
                    background: url(~~assets/img/main_content/exercise/FF.png) no-repeat;
                    width: 71px;
                    height: 90px;
                    cursor: pointer;
                    &.active {
                        background: url(~~assets/img/main_content/exercise/F.png) no-repeat;
                    }
                }
            }

        }
    }

    .theme-2 {
        text-align: center;
        .practice_common_box {
            text-align: center;
            margin-top: 3%;
            display: inline-block;
            min-width: 720px;
            .right-content {
                background: url(~~assets/img/main_content/exercise/answer-bg.png) no-repeat center;
                background-size: 100% 100%;
                padding: 2% 4% 2% 2%;
                .content-item {
                    width: 100%;
                    height: 1rem;
                    margin-left: 20px;
                    line-height: 1rem;
                    vertical-align: middle;
                    text-align: left;
                    &:after {
                        clear: both;
                        display: block;
                        content: '';
                    }
                }
                .content-item > span {
                    width: 500px;
                    display: inline-block;
                    line-height: 1.3;
                    font-size: 28px;
                    color: #ffffff;
                    font-family: "华文楷体", "宋体", "GothamRounded-Book";
                    vertical-align: middle;
                }
                .icon-container {
                    position: relative;
                }
                .icon-true {
                    display: block;
                    background: url(~~assets/img/main_content/exercise/T-yellow.png) no-repeat center;
                    width: 60px;
                    height: 63px;
                    cursor: pointer;
                    background-size: 100% 100%;
                    vertical-align: middle;
                    margin-right: 10px;
                    float: right;
                    margin-top: 3%;
                    &.active {
                        background-image: url(~~assets/img/main_content/exercise/T-yellow-active.png);

                    }
                }
                .icon-false {
                    display: block;
                    background: url(~~assets/img/main_content/exercise/F-yellow.png) no-repeat center;
                    width: 60px;
                    height: 63px;
                    cursor: pointer;
                    background-size: 100% 100%;
                    vertical-align: middle;
                    float: right;
                    margin-right: 20px;
                    margin-top: 3%;
                    &.active {
                        background-image: url(~~assets/img/main_content/exercise/F-yellow-active.png);
                    }
                }
            }
        }
    }
</style>
