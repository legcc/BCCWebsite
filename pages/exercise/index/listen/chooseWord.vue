<template>
    <div class="theme-1" :class="isUpdate&&'fadeIn'" v-if="templateStyle === 'level-1'">
        <aside class="bell">
        </aside>
        <ul class="balloon-list">
            <li class="balloon" aspect-ratio="354/686" v-for="(item,index) in content.words"
                :class="isActive(index)"
                @click="answerHandler(index,item.isRight)"
            >
                <p class="content">
                    <span class="pinyin">{{item.pinyin}}</span>
                    <span class="chinese">{{item.chinese}}</span>
                    <span class="english">{{item.english}}</span>
                </p>
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
                'setAnswer'
            ]),
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    activeIndex: [],
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
    export default class chooseWord extends Vue {
        activeIndex = [];
        rightAnswerArr = new Set();
        errorAnswerArr = new Set();
        isUpdate = false;

        isActive(index) {
            return R.contains(index, this.activeIndex) ? 'active' : '';
        }

        init() {
            this.$nextTick(_ => {
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                this.setAnswer({
                    answer: false,
                    msg: this.content.words && `${R.join('、', R.map(i => or(R.prop('english'), R.prop('chinese'), R.prop('pinyin'))(this.content.words[+i]))(this.rightArr))}`
                });
            })
        }

        answerHandler(index, isRight) {
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            if (R.not(R.contains(index, this.activeIndex))) {
                isRight === 'T' ? this.rightAnswerArr.add(index) : this.errorAnswerArr.add(index);
                if ([...this.errorAnswerArr].length === 0) {
                    const answer = R.all(R.contains(R.__, [...this.rightAnswerArr]))(this.rightArr);
                    this.setAnswer({
                        answer,
                        msg: `${R.join('、', R.map(i => or(R.prop('english'), R.prop('chinese'), R.prop('pinyin'))(this.content.words[+i]))(this.rightArr))}`
                    });
                } else {
                    this.setAnswer({
                        answer: false,
                        msg: `${R.join('、', R.map(i => or(R.prop('english'), R.prop('chinese'), R.prop('pinyin'))(this.content.words[+i]))(this.rightArr))}`
                    });
                }
//                多选
//                this.activeIndex.push(index);
//                单选
                Vue.set(this.activeIndex, 0, index);
            } else {
                const curIndex = this.activeIndex.indexOf(index);
                curIndex >= 0 ? this.activeIndex = R.remove(curIndex, 1, this.activeIndex) : void(0);
                isRight === 'T' ? this.rightAnswerArr.delete(index) : this.errorAnswerArr.delete(index);
                if ([...this.errorAnswerArr].length === 0) {
                    const answer = R.all(R.contains(R.__, [...this.rightAnswerArr]))(this.rightArr);
                    this.setAnswer({
                        answer,
                        msg: `${R.join('、', R.map(i => or(R.prop('english'), R.prop('chinese'), R.prop('pinyin'))(this.content.words[+i]))(this.rightArr))}`
                    });
                } else {
                    this.setAnswer({
                        answer: false,
                        msg: `${R.join('、', R.map(i => or(R.prop('english'), R.prop('chinese'), R.prop('pinyin'))(this.content.words[+i]))(this.rightArr))}`
                    });
                }

            }
        }

        mounted() {
            this.init();
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

    .theme-1 {
        text-align: center;
        padding-top: 40px;
        .bell {
            text-align: center;
            .timer {
                display: inline-block;
                min-width: 200px;
                height: 50px;
                color: white;
                font-size: 30px;
                text-shadow: 0 -2px 4px black;
                border-radius: 5px;
                line-height: 50px;
                font-family: GothamRounded-Medium;
                background-color: #249cd3;
                border: 1px solid #3b75bc;
            }
        }
        .balloon-list {
            display: inline-block;
            margin-top: 20px;
        }
        .balloon {
            position: relative;
            width: 150px;
            background-size: 100% 100%;
            display: inline-block;
            vertical-align: top;
            border: 1px solid transparent;
            margin: 0 10px;
            border-radius: 10px;
            &.active {
                border-color: white;
                background-color: rgba(255, 255, 255, .5);
            }
            &:before {
                content: '';
                display: block;
                width: 1px;
                margin-left: -1px;
                height: 0;
            }
            .content {
                position: absolute;
                top: 50px;
                left: 0;
                right: 0;
                bottom: 0;
                width: 96%;
                height: 100%;
                font-size: 20px;
                cursor: pointer;
                font-family: GothamRounded-Medium;
                .pinyin {
                    display: block;
                }
                .chinese {
                    display: block;
                }
            }
            &[aspect-ratio="354/686"] {
                aspect-ratio: '354:686';
            }
            &:nth-child(5n+1) {
                margin-top: 10px;
                background-image: url("~~assets/img/exercise/bolloon-blue.png")
            }
            &:nth-child(5n+2) {
                margin-top: 40px;

                background-image: url("~~assets/img/exercise/bolloon-green.png")
            }
            &:nth-child(5n+3) {
                margin-top: 10px;

                background-image: url("~~assets/img/exercise/bolloon-purple.png")
            }
            &:nth-child(5n+4) {
                margin-top: 40px;

                background-image: url("~~assets/img/exercise/bolloon-red.png")
            }
            &:nth-child(5n+5) {
                margin-top: 10px;

                background-image: url("~~assets/img/exercise/bolloon-yellow.png")
            }
        }
    }

</style>