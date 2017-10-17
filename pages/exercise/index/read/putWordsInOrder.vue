<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="practice_groupof_words practice_common_box">
            <div class="groupof_words_box">
                <div class="groupof_words_list" :class="isActive(index)"
                     @click="answerHandler(index,item.word)" v-for="(item,index) in wordsArr">
                    <p><span>{{item.word || item.pinyin || item.chinese || item.english}}</span></p></div>
            </div>
            <div class="groupof_words_fill">
                <div class="groupof_words_head"><span class="qi"></span></div>
                <div class="groupof_words_body" @click="removeAnswer(index)" v-for="(item,index) in content.words">
                    {{answerArr[index] && answerArr[index].content}}
                </div>
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
                    activeIndex: [],
                    answerArr: [],
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
            ])
        }
    })
    export default class chooseNumber extends Vue {
        activeIndex = [];
        answerArr = [];
        isUpdate = false;

        answerHandler(index, word) {
            this.activeIndex.push(index);
            this.answerArr.push({content: word});
            const answer = this.content.words.every((item,index)=>{
                return this.wordsArr[+this.activeIndex[index]].order===item.order;
            });
            this.setAnswer({
                answer,
                msg: this.content.words && `${R.join("")(R.map(R.prop('word'))(this.content.words))}`
            });
        }

        get wordsArr() {
            return R.sort(_ => Math.random() - .5)(this.content.words);
        }

        removeAnswer(index) {
            this.activeIndex = R.remove(index, 1, this.activeIndex);
            this.answerArr = R.remove(index, 1, this.answerArr);
            const answer = this.content.words.every((item,index)=>{
                return this.wordsArr[+this.activeIndex[index]].order===item.order;
            });
            this.setAnswer({
                answer,
                msg: `${R.join("、")(R.map(R.prop('word'))(this.content.words))}`
            });
        }

        init() {
            this.$nextTick(_ => {

                this.setAnswer({
                    answer: false,
                    msg: this.content.words && `${R.join("")(R.map(R.prop('word'))(this.content.words))}`
                });

            })
        }


        mounted() {
            this.init();
        }

        isActive(index) {
            return this.activeIndex.indexOf(index) !== -1 && 'active'
        }

        get rightOrder() {
            return R.map(R.pipe(R.prop('order'), R.add(-1)))(this.content.words);
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

    .practice_common_box {
        min-width: 750px;
        height: 100%;
        display: block;
        margin: 0 auto;
        position: relative;
        text-align: center;
    }

    .groupof_words_box {
        width: 100%;
        height: 120px;
        float: left;
        margin-top: 100px;
    }

    .groupof_words_list {
        width: 120px;
        height: 120px;
        background: url(~~assets/img/main_content/exercise/cloud.png) no-repeat;
        background-size: 100% 100% !important;
        background-position: center center !important;
        color: #0000FF;
        font-size: 20px;
        font-weight: 700;
        display: inline-block;
        padding-top: 40px;
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
        &.active {
            visibility: hidden;
        }
    }

    .groupof_words_box div:nth-child(2n+0) {
        bottom: 40px;
    }

    .groupof_words_list p span {
        vertical-align: middle;
        display: block;

    }

    .groupof_words_fill {
        width: 100%;
        height: 100px;
        display: inline-block;
        margin-top: 9%;
    }

    .groupof_words_fill .groupof_words_head {
        background: url(~~assets/img/main_content/exercise/car_head.png) no-repeat;
        position: relative;
    }

    .groupof_words_fill .groupof_words_body {
        background: url(~~assets/img/main_content/exercise/car_body.png) no-repeat;
    }

    .groupof_words_fill .groupof_words_head, .groupof_words_fill .groupof_words_body {
        width: 130px;
        height: 100px;
        line-height: 80px;
        font-size: 24px;
        display: inline-block;
        background-size: 100% !important;
        color: yellow;
        background-position: center !important;
        vertical-align: middle;
        cursor: pointer;
    }

    .groupof_words_fill .groupof_words_head .qi {
        width: 100px;
        height: 40px;
        display: block;
        background: url(~~assets/img/main_content/exercise/qi.png) no-repeat;
        background-size: 100%;
        position: absolute;
        top: -35px;
        right: 10px;
    }
</style>
