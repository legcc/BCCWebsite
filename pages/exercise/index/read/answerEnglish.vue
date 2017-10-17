<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="theme-1" v-if="templateStyle==='level-3'">
            <div class="container">
                <p class="top-content">{{content.sentences[0].chinese}}</p>
                <aside>
                    <ul>
                        <li class="list" v-for="(item,index) in content.questions">
                            <strong class="question">{{item.question}}</strong>
                            <div class="answer-container">
                                <input type="text" class="answer-input" @input="answerHandler($event,index)">
                            </div>
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
        <div class="theme-2" v-else-if="templateStyle==='level-1'">
            <div class="dialogue-container">
                <ul>
                    <li v-for="item in content.sentences">
                        <em class="speaker">{{item.name}}:</em>
                        <span class="dialogue">
                            <span class="pinyin">{{item.pinyin}}</span>
                            <span>{{item.chinese}}</span>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="question-container">
                <ul>
                    <li v-for="(item,index) in content.questions">
                        <label class="item"><em>Q:</em><em>{{item.question}}</em></label>
                        <label class="item"><em>A:</em><input class="answer-input" type="text"
                                                              @input="answerHandler($event,index)"></label>
                    </li>
                </ul>
            </div>
        </div>
        <div class="theme-3" v-else-if="templateStyle === 'level-4'">
            <p class="content" v-for="item in content.sentences"><span
                    class="text">{{item.chinese || item.english || item.pinyin}}</span></p>
            <ul class="list">
                <li class="list-item" v-for="(item,index) in content.questions">
                    <template v-if="item.keyWords">
                        <div class="question-container">
                            <h2 class="question">{{item.question}}</h2>
                            <div class="answer-container">
                                <input type="text" @input="checkInputAnswer($event,item,index)" class="answer-input">
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="question-container">
                            <strong class="question-inline">{{item.question}}</strong>
                            <figure class="answer-container-inline">
                                <figcaption class="icon-true" @click="l4AnswerHandler(index,'T')" :class="answerArr[index]==='T'&&'active'"></figcaption>
                                <figcaption class="icon-false" @click="l4AnswerHandler(index,'F')" :class="answerArr[index]==='F'&&'active'"></figcaption>
                            </figure>
                        </div>
                    </template>
                </li>
            </ul>
        </div>
        <div v-else class="coming-soon-container">
            <div class="coming-soon"></div>
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
                const initData = {
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
            ]),
            checkInputAnswer(event,item,index){
                const text = event.target.value;
                let itemFlag;
                if (R.find(R.propEq("mustInclude","T"))(item.keyWords)){
                itemFlag = R.pipe(R.filter(R.propEq("mustInclude","T")),R.all(R.pipe(R.prop("keyWord"),R.contains(R.__,text))))(item.keyWords);
                }else{
                    itemFlag = R.pipe(R.filter(R.propEq("mustInclude","F")),R.any(R.pipe(R.prop("keyWord"),R.contains(R.__,text))))(item.keyWords);
                }
                this.answerArr[index] = itemFlag;
                const answer = (this.answerArr.length===this.content.questions.length)&&R.all(R.clone)(this.answerArr);
                this.setAnswer({
                    answer,
                    msg : `${R.pipe(
                        R.map(R.pipe(
                            R.prop("keyWords"),
                            R.filter(R.propEq("mustInclude","T"))
                            ,R.map(R.prop("keyWord")),
                            R.join("、")
                        )),
                        R.join("\n"))
                    (this.content.questions)}`
                });
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
        answerArr = [];

        init() {
            this.$nextTick(_ => {
                let msg = "";
                if (this.templateStyle === 'level-4'){
                    if(this.content.questions){
                        if (this.content.questions[0].keyWords){
                            msg = `${R.pipe(
                                R.map(R.pipe(
                                    R.prop("keyWords"),
                                    R.filter(R.propEq("mustInclude","T"))
                                    ,R.map(R.prop("keyWord")),
                                    R.join("、")
                                )),
                                R.join("\n"))
                            (this.content.questions)}`;
                        }else{
                        msg = `${R.pipe(R.map(R.prop("isRight")),R.join("、"))(this.content.questions)}`;
                        }
                    }

                }else{
                    msg = this.content.questions && `${R.join("、")(R.reduce((pre, item) => (pre.concat(item.keyWords)), [])(this.content.questions))}`;
                }
                this.setAnswer({
                    answer: false,
                    msg
                })
            })
        }


        mounted() {
            this.init();
        }
        l4AnswerHandler(index,optional){
            Vue.set(this.answerArr,index,optional);
            const answer = R.pipe(R.map(R.prop("isRight")),R.equals(this.answerArr))(this.content.questions);
            this.setAnswer({
                answer,
                msg:`${this.content.questions&&R.pipe(R.map(R.prop("isRight")),R.join("、"))(this.content.questions)}`
            })
    }
        answerHandler(ev, index) {
            this.answerArr[index] = ev.target.value;
            const resultArr = this.content.questions.map((item, index) => R.any(item => R.contains(R.toLower(item), R.toLower(this.answerArr[index]) || ''))(item.keyWords));
            const answer = R.all(R.clone)(resultArr);
            this.setAnswer({
                answer,
                msg: `${R.join("、")(R.reduce((pre, item) => (pre.concat(item.keyWords)), [])(this.content.questions))}`
            })
        }
    }
</script>
<style lang="scss" scoped>
    .fadeIn {
        animation: fadeIn .4s ease-in;
        transform: translateZ(0);
    }

    @import "~~assets/sass/mixins";
    @keyframes fadeIn {
        from {
            transform-origin: left;
            transform: scaleX(.4);
            opacity: 0;
        }
    }

    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
    }

    .theme-1 {
        text-align: center;
        .container {
            margin-top: 60px;
            display: inline-block;
        }
        .top-content {
            max-width: 782px;
            padding: 20px 40px;
            min-height: 150px;
            text-align: left;
            margin: 0 auto;
            text-indent: 2em;
            text-shadow: 0 2px 4px black;
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
            color: white;
            font-size: 30px;
            background: url("~~assets/img/exercise/bg-yellow.png") no-repeat;
            background-size: 100% 100%;
        }
        .list {
            text-align: left;
            margin-top: 20px;
        }
        .question {
            margin-left: 50px;
            font-family: GothamRounded-Medium;
            font-size: 30px;
            color: #794425;
            width: 6rem;
            display: inline-block;
        }
        .answer-container {
            background: url("~~assets/img/exercise/line-yellow.png") no-repeat;
            background-size: 100% 80%;
            background-position: left bottom;
            padding-bottom: 20px;
            margin-top: 10px;
            .answer-input {
                border: none;
                outline: none;
                background: none;
                font-family: GothamRounded-Medium;
                height: 30px;
                width: 100%;
                margin: 0 50px;
            }
        }
    }

    .theme-2 {
        padding-top: 60px;
        .speaker {
            vertical-align: middle;
            margin-right: 20px;
        }
        .pinyin {
            display: block;
        }
        .dialogue {
            display: inline-block;
            vertical-align: middle;

        }
        .dialogue-container {
            display: inline-block;
            width: 40%;
            margin-left: 230px;
            background: url("~~assets/img/exercise/text-bg.png") no-repeat;
            background-size: 100% 100%;
            padding: .8rem .2rem;
            text-align: left;
            font-size: 26px;
            color: #1879c1;
            font-family: GothamRounded-Medium;
        }
        .question-container {
            display: inline-block;
            width: 30%;
            margin-left: 30px;
            .item {
                display: block;
                font-size: 22px;
                color: #14619c;
                font-family: GothamRounded-Book;
                margin-top: 20px;
                .answer-input {
                    background: none;
                    outline: none;
                    border: none;
                    width: 80%;
                    border-bottom: 3px solid #20a0ff;
                }
            }
        }
    }

    .theme-3 {
        text-align: center;
        margin: 40px 0;
        .content {
            width: 700px;
            min-height: 100px;
            line-height: 100px;
            display: inline-block;
            text-align: center;
            margin: 10px auto;
            padding: 0 50px;
            @include fullBgWithPicName("bg-purple.png");
            .text {
                line-height: 1.4;
                text-indent: 2em;
                display: inline-block;
                text-align: left;
                font-size: 26px;
                color: #0c549f;
                vertical-align: middle;
                font-family: chinese;
                font-weight: 600;
            }
        }
        .question-container {
            width: 700px;
            margin: 20px auto;
            .question {
                color: #0e63bc;
                font-family: GothamRounded-Medium;
                font-size: 26px;
                text-align: left;
            }
            .answer-container {
                box-sizing: border-box;
                padding: 0 30px;
                @include fullBgWithMainContentPicName("split-line.png");
                width: 6.5rem;
                height: .5rem;
                background-position: left -0.38rem bottom -0.35rem;
                background-size: 109% 180%;
                position: relative;
                text-align: left;

                .answer-input {
                    background: none;
                    outline: none;
                    border: none;
                    width: 100%;
                    left: .4rem;
                    bottom: .1rem;
                    position: absolute;
                }
            }
            /*inline style*/
            .question-inline {
                width: calc(100% - 1.5rem);
                vertical-align: middle;
                display: inline-block;
                color: #0e63bc;
                font-family: GothamRounded-Medium;
                font-size: 26px;
                text-align: left;
            }
            .answer-container-inline {
                width: 1.5rem;
                vertical-align: middle;
                display: inline-block;
                text-align: left;
                .icon-true {
                    display: inline-block;
                    width: .71rem;
                    height: .91rem;
                    cursor: pointer;
                    @include fullBgWithMainContentPicName('T.png');
                    &.active{
                        @include fullBgWithMainContentPicName('TT.png');
                    }
                }
                .icon-false {
                    display: inline-block;
                    width: .71rem;
                    height: .91rem;
                    cursor: pointer;
                    @include fullBgWithMainContentPicName('FF.png');
                    &.active{
                        @include fullBgWithMainContentPicName('F.png');
                    }
                }
            }
        }
    }
</style>