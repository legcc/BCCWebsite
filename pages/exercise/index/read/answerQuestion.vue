<template>
    <div
            :class="isUpdate&&'fadeIn'"
    >
        <transition name="fade">
            <div class="style-1" v-if="true">
                <div class="container">
                    <header class="header">
                        <p class="sentence">
                            昨天,爸爸和Ben昨天,爸爸和Ben昨天,,爸爸和Ben昨天,,爸爸和Ben昨天,,爸爸和Ben昨天,,爸爸和Ben昨天,,爸爸和Ben昨天,,爸爸和Ben昨天,爸爸和Ben昨天,爸爸和Ben昨天,爸爸和Ben昨天,爸爸和Ben昨天,爸爸和Ben昨天,爸爸和Ben</p>
                    </header>
                    <article class="content">
                        <ul class="answer-list">
                            <li>
                                <h2 class="question">1. What should Ben to do at home?</h2>
                                <div class="answer">
                                    <input type="text" placeholder="Place enter here..." class="answer-input">
                                </div>
                            </li>
                            <li>
                                <h2 class="question">2. What should Ben to do at home?</h2>
                                <div class="answer">
                                    <input type="text" placeholder="Place enter here..." class="answer-input">
                                </div>
                            </li>
                        </ul>
                    </article>
                </div>
            </div>
        </transition>

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
        watch: {
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

        computed: {
            ...mapState('index/exercise/index', {
                contentInfo: state => state.contentInfo,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        }
    })
    export default class chooseNumber extends Vue {

        isUpdate = false;

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

    .style-1 {
        .container {
            margin: 0 0 0 20%;
            .header {
                margin-top: .15rem;
                margin-right: 5%;
                background: url(~~assets/img/main_content/exercise/sentence-bg-yellow.png) no-repeat center;
                padding: .2rem .4rem;
                background-size: 100% 100%;
                box-sizing: border-box;
                text-indent: 2em;
                font-size: 26px;
                text-shadow: 0 1px 2px black;
                color: #ffffff;
                font-family: 楷体;
            }
            .content {
                margin-top: 2%;
                margin-left: 5%;
                .question {
                    font-size: 26px;
                    margin-bottom: 2%;
                }
                .answer-list li {
                    .answer {
                        margin: .2rem 0 .2rem -.2rem;
                        width: 8rem;
                        background: url(~~assets/img/main_content/exercise/line-yellow.png) no-repeat left bottom;
                        background-size: contain;
                        padding: 0 0 .2rem .5rem;
                        box-sizing: border-box;
                    }
                    .answer-input {
                        border: none;
                        outline: none;
                        background: none;
                        width: 100%;
                        font-size: 24px;
                        font-family: Calibri;
                        &::-webkit-input-placeholder {
                            color: #F37A2B;
                            text-indent: .5em;
                        }
                        &::-moz-placeholder {
                            color: #F37A2B;
                            text-indent: .5em;
                        }
                        &:-ms-input-placeholder {
                            color: #F37A2B;
                            text-indent: 1em;

                        }
                        &:-moz-placeholder {
                            color: #F37A2B;
                            text-indent: 1em;

                        }
                    }
                }

            }
        }
    }


</style>
