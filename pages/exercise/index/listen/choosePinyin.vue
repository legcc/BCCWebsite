<template>
    <div class="theme-1" :class="isUpdate&&'fadeIn'">
        <ul class="list">
            <li v-for="(item,index) in content.words" class="list-item"
                :class="isActive(index)"
                @click="answerHandler(index,item.isRight)">{{item.pinyin || item.chinese || item.english}}
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
            rightArr(){
                const arr = [];
                this.content.words.forEach((item, index) => {
                    const result = R.ifElse(R.pipe(R.prop('isRight'), R.equals('T')), R.always(index), R.F)(item);
                    if (result !== false) {
                        arr.push(result);
                    }
                });
                return arr;
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAudioUrl',
                'setAnswer'
            ])
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    activeIndex: "",
                    rightAnswerArr: new Set(),
                    errorAnswerArr: new Set(),
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
    })
    export default class choosePinyin extends Vue {
        activeIndex = "";
        rightAnswerArr = new Set();
        errorAnswerArr = new Set();
        isUpdate = false;

        created() {
            this.setAudioUrl(this.content.audio);
        }

        mounted() {
            this.init();
        }

        answerHandler(index, isRight) {
            let answer = false;
            if (index !== this.activeIndex) {
                this.activeIndex = index;
                isRight === 'T' ? answer = true : '';
            } else {
                this.activeIndex = "";
            }
            this.checkAnswer(answer);
        }

        checkAnswer(answer) {
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            const getAnswerWord = item => or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(item);
            this.setAnswer({
                answer,
                msg: `${R.join('、', R.map(i => getAnswerWord(R.nth(+i)(this.content.words)))(this.rightArr))}`
            });
        }

        isActive(index) {
            return this.activeIndex === index ? 'active' : '';

        }

        init() {
            this.$nextTick(_ => {
                if (this.content.words) {
                    const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                    const getAnswerWord = item => or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(item);
                    this.setAnswer({
                        answer: false,
                        msg: `${R.join('、', R.map(i => getAnswerWord(R.nth(+i)(this.content.words)))(this.rightArr))}`
                    });
                }
            })
        }

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

    .theme-1 {
        text-align: center;
        .list {
            display: block;
            width: 800px;
            margin: 60px auto auto auto;
            .list-item {
                margin: 30px;
                display: inline-block;
                width: 177px;
                height: 89px;
                line-height: 99px;
                font-family: GothamRounded-Medium;
                font-size: 30px;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
                @for $index from 1 to 5 {
                    &:nth-child(4n+#{$index}) {
                        background-image: url("~~assets/img/exercise/cloud-#{$index}.png");
                        &.active {
                            color: white;
                            background-image: url("~~assets/img/exercise/cloud-active.png");
                        }
                    }
                }
            }
        }
    }

</style>