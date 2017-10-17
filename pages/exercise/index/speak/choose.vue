<template>

    <div class="container" :class="isUpdate&&'fadeIn'">
        <ul class="answer-container">
            <!--数据有误 我先用角标代替-->
            <li class="answer-option" v-for="(item,index) in content.sentences"><em class="text">{{index + 1}}</em></li>
        </ul>
        <ul class="question-container">
            <li class="question-option" v-for="(item,index) in content.sentences">
                <em v-if="item.english">{{item.english}}</em>
                <em v-else-if="item.pinyin">{{item.pinyin}}</em>
                <em v-else-if="item.chinese">{{item.chinese}}</em>
            </li>
        </ul>
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
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ])
        }, created(){
            this.$nextTick(_ => {
                setTimeout(_ => {
                    this.setAudioInfo({player: {display: 'none'}});
                }, 600)
            })
        },
        destroyed(){
            this.setAudioInfo({player: {display: 'block'}});
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerArr: [],
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600)
            }
        },
    })
    export default class choose extends Vue {
        isUpdate = false;

    }
</script>
<style lang="scss" scoped>
    @import "~~assets/sass/mixins";

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
        margin-top: 40px;
        text-align: center;
        font-family: GothamRounded-Medium;
        .answer-container {
            display: inline-block;
            vertical-align: middle;
            margin: 0 40px;
            .answer-option {
                font-family: GothamRounded-Medium;
                font-size: 24px;
                @include cloud();
                &:not(:first-child) {
                    margin-top: 20px;
                }
                .text {
                    line-height: 1.4;
                    display: inline-block;
                }
            }
            .question-container {
                display: inline-block;
                margin: 0 20px;

            }
        }
        .question-container {
            display: inline-block;
            margin: 0 40px;
            vertical-align: middle;
            .question-option {
                width: 450px;
                min-height: 100px;
                padding: 40px;
                box-sizing: border-box;
                @include fullBgWithMainContentPicName("answer_title_bg.png");
            }
        }
    }
</style>