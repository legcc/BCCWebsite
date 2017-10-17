<template>
    <div class="theme-1" :class="isUpdate&&'fadeIn'">
        <div class="container">
            <ul class="word-list">
                <li v-for="(item,arrIndex) in wordArr" class="list-item">
                    <!--:style="{backgroundImage:`${addPrefixHost(item.image)}`}"-->
                    <div class="picture">
                        <span>{{item.chinese}}</span>
                    </div>
                    <div v-for="(child,index) in item.childArr"
                         @click="answerHandler(index,item.childArr,`${arrIndex}-${index}`)" class="pit"
                         :class="pitActiveIndex===`${arrIndex}-${index}`&&'active'">
                        <div class="word-item" v-if="child">{{child.chinese || child.english || child.pinyin}}</div>
                    </div>
                </li>
            </ul>
            <ul class="answer-list">
                <li v-for="(item,index) in content.answerWords" @click="chooseWord(item)" class="word-item"
                    :class="activeItem===item&&'active'">
                    {{item.chinese || item.english || item.pinyin}}
                </li>
            </ul>
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

        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {};
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
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ])
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        }
    })
    export default class chooseNumber extends Vue {
        isUpdate = false;
        wordArr = [];
        activeItem = "";
        pitActiveIndex = "";

        mounted() {
            this.init();
        }

        init() {
            this.$nextTick(_ => {
                const arr = [];
                this.content.words && this.content.words.forEach(parentItem => {
                    this.content.answers.forEach(item => {
                        item.wordOrder === parentItem.wordOrder && arr.push({
                            ...parentItem,
                            childArr: R.map(R.always(""))(item.answerOrder)
                        })
                    })
                });
                this.wordArr = arr;
                this.setAnswer({
                    answer: false,
                    msg: this.content.answers && ` ${R.chain(R.prop('answerOrder'))(this.content.answers)}`
                })

            })
        }

        chooseWord(item) {
            this.activeItem = item;
            this.checkAnswer();
        }

        checkAnswer() {
            const answers = this.wordArr.map(item => {
                const wordOrder = item.wordOrder;
                const orderArr = R.pipe(R.find(R.propEq('wordOrder', wordOrder)), R.prop('answerOrder'))(this.content.answers);
                const answerArr = R.map(R.prop("order"))(item.childArr);
                return R.any(R.pipe(R.split(","), R.all(R.contains(R.__, answerArr))))(orderArr);
            });
            this.setAnswer({
                answer: R.all(R.clone)(answers),
                msg: ` ${R.chain(R.prop('answerOrder'))(this.content.answers)}`
            })
        }

        answerHandler(index, pitArr, tag) {
            this.pitActiveIndex = tag;
            if (!pitArr[index]) {
                Vue.set(pitArr, index, this.activeItem);
            } else {
                Vue.set(pitArr, index, "");
            }
            this.checkAnswer();
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
        .word-item {
            background: url("~~assets/img/exercise/4.png") no-repeat;
            background-size: 100% 120%;
            background-position: center;
            width: 140px;
            height: 140px;
            margin: 0 auto;
            line-height: 140px;
            cursor: pointer;
            font-size: 30px;
            font-family: 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', '宋体';
            text-align: center;
        }
        .container {
            display: inline-block;
            text-align: left;
        }
        .word-list {
            display: inline-block;
            .list-item {
                margin-top: 40px;
            }
            .picture {
                display: inline-block;
                background: url("~~assets/img/exercise/4.1.png") no-repeat;
                width: 160px;
                height: 160px;
                text-align: center;
                line-height: 160px;
                vertical-align: middle;
                font-size: 30px;
                font-family: 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', '宋体';
                color: #bf0000;
                margin-right: 100px;
                cursor: pointer;
                background-size: 100% 140%;
                background-position: center;
            }
            .pit {
                display: inline-block;
                width: 120px;
                height: 120px;
                line-height: 120px;
                border: 2px dashed #704e32;
                cursor: pointer;
                vertical-align: middle;
                margin-left: 40px;
                text-align: center;
                &.active {
                    transition: all .2s ease-in;
                    border: 2px dashed #345cce;
                }
                .word-item {
                    background-size: 130% 160%;
                    background-position: center;
                    width: 1rem;
                    height: 1rem;
                    line-height: .9rem;
                    vertical-align: middle;
                    display: inline-block;
                }
            }
        }
        .answer-list {
            display: inline-block;
            vertical-align: bottom;
            margin-left: 100px;
            .word-item.active {
                transition: all .2s ease-in;
                filter: drop-shadow(4px 6px 2px black);
            }
        }
    }

</style>