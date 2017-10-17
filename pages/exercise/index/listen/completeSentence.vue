<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <article class="content">
            <p class="question"
               v-html="content.questions.replace(/\[.]/g,`<div  type='text'  id='answer-input'></div>`)"></p>
            <div class="answer">
                <button class="answer-list" v-for="(item,index) in content.answers" @click="answerHandler(index,item)"
                        :class="activeIndex===index&&'active'"
                ><em class="text" :class="isOverflow(item,8)">{{item}}</em></button>
            </div>
        </article>
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
                answer: "",
                activeIndex: ""
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            answerHandler(index, val){
                document.getElementById("answer-input").innerText = val;
                const answer = R.equals(val, this.content.rightAnswer);
                this.setAnswer({
                    answer,
                    msg: this.content.rightAnswer
                });
                this.activeIndex = index;
            },
            isOverflow(item, len){
                return item && item.length > len && 'more'
            },
            init(){
                this.$nextTick(_ => {
                    this.setAnswer({
                        answer: false,
                        msg: this.content.rightAnswer
                    });

                })
            }
        },
        created(){
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

    .container {
        text-align: center;
    }

    .content {
        background: url('~~assets/img/exercise/level2/xiangkuang.png') no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        width: 700px;
        height: 500px;
        margin: 0 auto;
        position: relative;
        line-height: 300px;
        padding: 20px 40px 80px 40px;
        .question {
            display: inline-block;
            vertical-align: middle;
            line-height: 1;
            font-size: 36px;
            padding: 0 70px;
            text-align: left;
            font-family: GothamRounded-Medium;
            color: #071f30;
        }
        .answer {
            width: 100%;
            line-height: 1;
            margin-top: -30px;
            .answer-list {
                background: url("~~assets/img/exercise/level2/button.png") no-repeat;
                background-size: 100% 100%;
                background-position: left bottom -3px;
                min-width: 150px;
                height: 80px;
                margin: 0 15px;
                text-align: center;
                color: white;
                cursor: pointer;
                padding: 0 50px;
                box-sizing: border-box;
                vertical-align: middle;
                .text {
                    font-size: 28px;
                }
                .more {
                    font-size: 18px;
                }
                &.active {
                    background-image: url("~~assets/img/exercise/button-green-active.png");
                }
            }
        }
    }

</style>
<style lang="less">
    .content {
        #answer-input {
            display: inline-block;
            text-align: center;
            outline: none;
            border-bottom: 2px solid black;
            min-width: 160px;
        }
    }
</style>