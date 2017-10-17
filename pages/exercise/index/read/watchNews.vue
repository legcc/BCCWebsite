<template>
    <div>
        <div v-if="templateStyle==='level-4'" class="theme-1" :class="isUpdate&&'fadeIn'">
            <el-carousel :interval="10000" type="card" indicator-position="none" arrow="never" class="rotation">
                <el-carousel-item v-for="item in content.images" :key="item" class="item">
                    <img class="banner" :src="addPrefixHost(item)" alt="">
                </el-carousel-item>
            </el-carousel>
            <div class="answer-container">
                <ul class="answer-list" v-for="(arr,rIndex) in answerArr">
                    <li class="answer-item" v-for="(item,cIndex) in arr">
                        <h2 class="question">{{item.question}}</h2>
                        <div class="answer-container"><input class="answer-input" type="text"
                                                             v-model="answerText"
                                                             @input="answerHandler($event,item,`${rIndex}-${cIndex}`)">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="templateStyle==='level-1'" class="theme-2">
            <img :src="addPrefixHost(image)" class="picture" alt="" v-for="image in content.images">
            <ul class="questions">
                <li class="answer-item" v-for="(item,index) in content.questions">
                    <h2 class="question">{{item.question}}</h2>
                    <input class="answer-input" type="text" style="margin-top: .1rem" v-model="answerText"
                           @input="answerHandler($event,item,index)">
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
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer',
                'answerText'
            ]),
        },
        created () {
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerText: ""
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
    export default class watchNews extends Vue {
        isUpdate = false;
        result = {};
        answerText = "";

        get answerArr() {
            const arr = [[], []];
            const questions = this.content.questions;
            const half = questions.length / 2;
            const length = questions.length;
            for (let i = 0; i < half; i++) {
                arr[0].push(questions[i])
            }
            for (let i = half; i < length; i++) {
                arr[1].push(questions[i])
            }
            return arr;
        }

        init() {
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.content.questions && ` ${R.pipe(R.reduce((pre, item) => (pre.concat(item.keyWords)), []),
                        R.map(or(R.prop('chinese'), R.prop('english'), R.prop('chinese'))))
                    (this.content.questions)}`
                });

            })
        }

        answerHandler(ev, item, order) {
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            const isContainsByProp = propName => R.pipe(R.prop(propName),R.ifElse(R.clone,R.contains(R.__, ev.target.value),R.F) );
            this.result[order] = R.all(or(isContainsByProp('chinese'), isContainsByProp('english'), isContainsByProp('pinyin')))(item.keyWords)
            let answer = false;
            if (Object.keys(this.result).length === this.content.questions.length) {
                answer = R.all(R.clone)(R.props(Object.keys(this.result))(this.result));
            }
            this.setAnswer({
                answer,
                msg: ` ${R.pipe(R.reduce((pre, item) => (pre.concat(item.keyWords)), []),
                    R.map(or(R.prop('chinese'), R.prop('english'), R.prop('chinese'))))
                (this.content.questions)}`
            });
        }

        mounted() {
            this.init();
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
        .rotation {
            width: 8rem;
            height: 3.2rem;
            margin: 20px auto auto auto;
            .banner {
                width: 100%;
            }
            .el-carousel__item:nth-child(2n) {
                background-color: #99a9bf;
            }

            .el-carousel__item:nth-child(2n+1) {
                background-color: #d3dce6;
            }

        }
        .answer-container {
            display: inline-block;
            text-align: center;
            .answer-list {
                display: inline-block;
                vertical-align: middle;
                margin: 0 20px;
                .answer-item {
                    margin-top: 20px;
                }
            }
            .question {
                font-size: 18px;
                color: #125a8f;
                padding: 0 20px;
                text-indent: 2em;
                max-width: 400px;
                font-family: GothamRounded-Medium;
            }
            .answer-container {
                height: 60px;
                width: 100%;
                font-size: 18px;
                background: url("~~assets/img/exercise/split-line.png") no-repeat left bottom;
                background-size: 100% 100%;
                margin-top: 20px;
                .answer-input {
                    width: 80%;
                    margin: 8px 55px 0 55px;
                    border: none;
                    outline: none;
                    background: none;
                }
            }
        }
    }

    .theme-2 {
        text-align: center;
        margin: 60px 0;
        .picture {
            display: inline-block;
            vertical-align: middle;
            max-width: 320px;
            max-height: 380px;
        }
        .answer-item:not(:first-child) {
            margin-top: 20px;
        }
        .questions {
            display: inline-block;
            vertical-align: middle;
            min-width: 260px;
            max-width: 420px;
            min-height: 180px;
            padding: 30px 20px;
            text-align: left;
            border-radius: 5px;
            font-family: GothamRounded-Medium;
            color: #3e3e3e;
            font-size: 24px;
            margin-left: 80px;
            .answer-input {
                border: none;
                outline: none;
                background: none;
                font-size: 20px;
                border-bottom: 2px solid #2a2a2a;
                height: 26px;
                width: 85%;
            }
        }
    }
</style>