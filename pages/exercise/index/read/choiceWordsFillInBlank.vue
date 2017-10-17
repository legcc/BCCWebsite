<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="theme-1" v-if="templateStyle==='level-4'">
            <div class="practice_common_box" v-if="content.image">
                <div class="topic-image">
                    <loadingImage :src="addPrefixHost(content.image)"></loadingImage>
                </div>
                <div class="select-container">
                    <div class="topic" v-for="(sen,index) in content.sentences"
                         v-html="getHtml(sen,index)">
                    </div>
                    <div class="word-button" data-name="word-button" v-for="(item,index) in content.answers"
                         :class="activeIndex === item.order&&'active'"
                         @click="answerHandler(item,item.order)"
                    ><em v-if="item.chinese">{{item.chinese}}</em>
                        <em v-else-if="item.english">{{item.english}}</em>
                        <em v-else-if="item.pinyin">{{item.pinyin}}</em>
                    </div>
                </div>
            </div>
            <div class="container" v-else>
                <h2 class="english">
                    <div class="question" v-for="(sen,index) in content.sentences"
                         v-html="getHtml(sen,index)">
                    </div>
                </h2>
                <aside class="pit-words">
                    <div class="word-button" data-name="word-button" v-for="(item,index) in content.answers"
                         :class="activeIndex === item.order&&'active'"
                         @click="answerHandler(item,item.order)">
                        <em v-if="item.chinese">{{item.chinese}}</em>
                        <em v-else-if="item.english">{{item.english}}</em>
                        <em v-else-if="item.pinyin">{{item.pinyin}}</em>
                    </div>
                </aside>
            </div>
        </div>
        <div class="theme-2" v-else-if="templateStyle==='level-3'">
            <div class="container">
                <div class="english">
                    <div class="question" v-for="(sen,index) in content.sentences">
                        <h2 v-html="getHtml(sen,index)" class="text"></h2>
                    </div>
                </div>
                <aside class="pit-words">
                    <div class="chinese-words" data-name="word-button" v-for="(item,index) in content.answers"
                         :class="activeIndex === item.order&&'active'"
                         @click="answerHandler(item,item.order)">
                        <em v-if="item.chinese">{{item.chinese}}</em>
                        <em v-else-if="item.english">{{item.english}}</em>
                        <em v-else-if="item.pinyin">{{item.pinyin}}</em>
                    </div>
                </aside>
            </div>
        </div>
        <div v-else-if="templateStyle==='level-1'" class="theme-3">
            <div class="container">
                <div class="english">
                    <div class="question" v-for="(sen,index) in content.sentences">
                        <h2 v-html="getHtml(sen,index)" class="text"></h2>
                    </div>
                </div>
                <aside class="pit-words">
                    <div class="chinese-words" data-name="word-button" v-for="(item,index) in content.answers"
                         :class="activeIndex === index&&'active'"
                         @click="answerHandler(item,index)">
                        <em>{{item.answer || item.english || item.chinese || item.pinyin}}</em>
                    </div>
                </aside>
            </div>
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
        computed: {
            ...mapState('index/exercise/index', {
                contentInfo: state => state.contentInfo,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
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
                    activeText: "",
                    activeIndex: "",
                    answerArr: {},
                    eleArr: [],
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


    })
    export default class chooseNumber extends Vue {
        activeText = "";
        activeIndex = "";
        answerArr = {};
        eleArr = [];
        isUpdate = false;

        init() {
            this.$nextTick(_ => {
                const pits = document.querySelectorAll(".topic-pit-btn");
                R.forEach(item => {
                    const questionOrder = item.getAttribute('data-question');
                    if (!this.eleArr[questionOrder]) {
                        this.eleArr[questionOrder] = [];
                    }
                    this.eleArr[questionOrder].push(item);
                })(pits);
                const addEventListener = (event, fn, isPre = false) => {
                    return (item) => {
                        item.addEventListener(event, fn, isPre);
                    }
                };
                R.forEach(addEventListener("click", this.clickFn, false))(pits);
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                this.setAnswer({
                    answer: false,
                    msg: this.content.answerOrder && `${R.map(
                        item => R.pipe(
                            R.find(R.propEq('order', item)),
                            R.defaultTo({}),
                            or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))
                        )(this.content.answers)
                    )(R.split(",", this.content.answerOrder[0]))}`
                });
                if(this.templateStyle === 'level-4'){
                    this.setAnswer({
                        answer:false,
                        msg:this.content.answerSenteces&&`${R.join(",")(R.map(or(R.prop("chinese"),R.prop("english"),R.prop("pinyin")))(this.content.answerSenteces))}`
                    })
                }
            })

        }

        mounted() {
            this.init();
        }

        answerHandler(word, order) {
            this.activeText = word.pinyin || word.chinese || word.english || word.answer;
            this.activeIndex = order;
        }

        clickFn(e) {
            let ele = e.target;
            const answerOrder = ele.getAttribute('data-answer');
            const questionOrder = ele.getAttribute('data-question');
            if (this.templateStyle !== 'level-4') {
//            没有内容且选择了词汇
                if (!ele.innerText) {
                    if (!this.answerArr[questionOrder]) {
                        this.answerArr[questionOrder] ? void 0 : Vue.set(this.answerArr, questionOrder, []);

                        if (this.answerArr[questionOrder][answerOrder] !== "0") {
                            for (let i = 0, length = Object.keys(this.eleArr[questionOrder]).length; i < length; i++) {
                                this.answerArr[questionOrder][i] = "0";
                            }
                        }
                    }

                    ele.innerText = this.activeText;
                    Vue.set(this.answerArr[questionOrder], answerOrder, this.activeIndex  + "");
                } else {
                    ele.innerText = "";
                    if (this.answerArr[questionOrder][answerOrder]) {
                        this.answerArr[questionOrder][answerOrder] = "0";
                    } else {
                        this.answerArr[questionOrder] ? void 0 : this.answerArr[questionOrder] = [];
                        for (let i = 0, length = Object.keys(this.eleArr[questionOrder]).length; i < length; i++) {
                            this.answerArr[questionOrder][i] = "0";
                        }
                    }
                }
            } else {
                if (!ele.innerText ||this.activeText) {
                    if (!this.answerArr[questionOrder]||this.activeText) {
                        this.answerArr[questionOrder] ? void 0 : Vue.set(this.answerArr, questionOrder, []);

                        if (this.answerArr[questionOrder][answerOrder] !== "0"||this.activeText) {
                            for (let i = 0, length = Object.keys(this.eleArr[questionOrder]).length; i < length; i++) {
                                this.answerArr[questionOrder][i] = "0";
                            }
                        }
                    }
                    const pits = document.querySelectorAll(".topic-pit-btn");
                    pits.forEach(item=>item.innerText="");
                    ele.innerText = this.activeText;
                    Vue.set(this.answerArr[questionOrder], answerOrder, this.activeIndex  + "");
                } else {
                    ele.innerText = "";
                    if (this.answerArr[questionOrder][answerOrder]) {
                        this.answerArr[questionOrder][answerOrder] = "0";
                    } else {
                        this.answerArr[questionOrder] ? void 0 : this.answerArr[questionOrder] = [];
                        for (let i = 0, length = Object.keys(this.eleArr[questionOrder]).length; i < length; i++) {
                            this.answerArr[questionOrder][i] = "0";
                        }
                    }
                }
            }
            if (this.activeText) {
                if (this.content.answerOrder) {
                    let allAnswer = [];
                    for (let key in this.answerArr) {
                        allAnswer = allAnswer.concat(this.answerArr[key]);
                    }
                    const debug = item=>{console.log(item);return item;};
                    const answer = R.any(R.pipe(R.split(","), R.equals(allAnswer),debug))(this.content.answerOrder);
                    const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));

                    this.setAnswer({
                        answer,
                        msg: `${R.join(",")(R.map(or(R.prop("chinese"),R.prop("english"),R.prop("pinyin")))(this.content.answerSenteces))}`
                    })
                }
            }
        }

        getHtml(sen, num) {
            if (sen) {
                const indexArr = R.match(/\[.]/g, sen);
                indexArr.forEach((item, index) => {
                    sen = sen.replace(/\[.]/, `<div data-answer="${index}" data-question="${num}" class='topic-pit-btn'></div>`)
                });
            }
            return sen;
        }
    }
</script>
<style lang="scss">
    @import "~~assets/sass/mixins";

    .theme-2 {
        .topic-pit-btn {
            min-width: 1.4rem;
            height: .5rem;
            vertical-align: middle;
            display: inline-block;
            border-radius: .2rem;
            box-shadow: -4px 4px 6px 2px #D63D0C inset, 2px -2px 6px #ffffff inset;
            background: #FB9A1E;
            text-align: center;
            line-height: .5rem;
            margin: 0 .1rem;
            cursor: pointer;
            font-size: 26px;
        }
    }

    .theme-3 {
        .topic-pit-btn {
            vertical-align: middle;
            display: inline-block;
            border-radius: .2rem;
            background: url("~~assets/img/exercise/hollow.png") no-repeat;
            background-size: 100% 100%;
            @include ratioContainer(110px, 30px, (width:(155px), height:(125px)));
            text-align: center;
            margin: 0 .1rem;
            cursor: pointer;
            font-size: 26px;
            font-family: chinese;
        }
    }

    .theme-1 {
        .topic-pit-btn {
            min-width: 141px;
            height: 61px;
            font-size: 26px;
            line-height: 61px;
            text-align: center;
            padding: 0 10px;
            display: inline-block;
            vertical-align: middle;
            background: url(~~assets/img/main_content/exercise/read-choose-pit-03.png) no-repeat;
            background-size: 100% 100%;
            cursor: pointer;

        }
    }
</style>
<style lang="scss" scoped>
    @import "~~assets/sass/mixins";

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
        margin-top: 100px;
        .practice_common_box {
            display: inline-block;
            margin: auto auto;
            text-align: center;
        }

        .topic {
            width: 100%;
            vertical-align: middle;
            font-family: "楷体", GothamRounded-Book;
            margin: 10px 0;
            font-style: normal;
            font-size: 32px;
            color: rgb(44, 54, 133);
            line-height: 1.2;
        }

        .select-container {
            max-width: 450px;
            display: inline-block;
            vertical-align: middle;
            text-align: left;
            margin-left: 40px;
        }

        .topic-image {
            display: inline-block;
            width: 403px;
            height: 293px;
            vertical-align: middle;
            background: url(~~assets/img/main_content/exercise/border-lg.png) no-repeat;
            background-size: contain;
            padding: 20px 15px 10px 15px;
            float: left;
            box-sizing: border-box;
        }

        .topic-image > img {
            width: 97%;
            height: 96%
        }

        .word-button {
            display: inline-block;
            min-width: 163px;
            height: 63px;
            line-height: 63px;
            background: url(~~assets/img/main_content/exercise/read-choose-pit.png) no-repeat;
            background-size: 100% 100%;
            position: relative;
            text-align: center;
            padding: 0 10px;
            font-size: 28px;
            margin-top: 20px;
            color: #2c3685;
            margin: 0 15px;
            cursor: pointer;
            &.active {
                background-image: url(~~assets/img/main_content/exercise/btn-purple.png);
            }
        }
        .english {
            margin: .3rem 0;
            font-family: Calibri;
            font-size: 36px;

        }
        .pit-words {
            margin-top: .8rem;
            text-align: center;
            .word-button {
                top: auto;
                left: auto;
            }
        }
        .container {
            text-align: center;
            position: relative;
            width: 60%;
            margin: 0 auto;
            .english {
                margin: .3rem 0;
                font-family: Calibri;
                font-size: 36px;

            }
        }
    }

    .theme-2 {
        text-align: center;
        .question {
            line-height: 1.9;
            text-align: center;
            .text {
                font-weight: 600;
                display: inline-block;
                text-align: left;
            }
        }
        .container {
            text-align: left;
            min-height: 4rem;
            width: 7rem;
            margin: 20px 0;
            display: inline-block;
            .answer {
                vertical-align: middle;
            }
            .english {
                margin: .3rem 0;
                font-family: chinese;
                font-size: 36px;
                font-weight: 600;

            }
            .chinese {
                margin: .3rem 0;
                font-size: 28px;
                font-family: 'GothamRounded-Book';
                .pit {
                    width: 1.4rem;
                    height: .5rem;
                    vertical-align: middle;
                    display: inline-block;
                    border-radius: .2rem;
                    box-shadow: -4px 4px 6px 2px #D63D0C inset, 2px -2px 6px #ffffff inset;
                    background: #FB9A1E;
                    margin: 0 .1rem;
                }
            }
            .pit-words {
                margin-top: .8rem;
                text-align: center;
                .chinese-words {
                    font-size: 28px;
                    font-family: 'GothamRounded-Book';
                    padding: .2rem .6rem;
                    box-sizing: border-box;
                    background: url("~~assets/img/main_content/exercise/content-button.png") no-repeat left top 4px;
                    background-size: 100% 100%;
                    border-radius: .3rem;
                    $jianju: .6rem;
                    cursor: pointer;
                    display: inline-block;
                    margin: 0 20px;
                    &.active {
                        transition: all .1s ease-in;
                        background-image: url('~~assets/img/main_content/exercise/button-yellow-active.png');
                    }

                }
            }
        }
    }

    .theme-3 {
        text-align: center;
        .question {
            line-height: 1.9;
            text-align: center;
            .text {
                font-weight: 600;
                display: inline-block;
                text-align: left;
            }
        }
        .container {
            text-align: left;
            min-height: 4rem;
            width: 7rem;
            margin: 20px 0;
            display: inline-block;
            .answer {
                vertical-align: middle;
            }
            .english {
                margin: .3rem 0;
                font-family: chinese;
                font-size: 36px;
                font-weight: 600;

            }
            .chinese {
                margin: .3rem 0;
                font-size: 28px;
                font-family: 'GothamRounded-Book';
                .pit {
                    width: 1.4rem;
                    height: .5rem;
                    vertical-align: middle;
                    display: inline-block;
                    border-radius: .2rem;
                    box-shadow: -4px 4px 6px 2px #D63D0C inset, 2px -2px 6px #ffffff inset;
                    background: #FB9A1E;
                    margin: 0 .1rem;
                }
            }
            .pit-words {
                margin-top: .8rem;
                text-align: center;
                .chinese-words {
                    vertical-align: middle;
                    display: inline-block;
                    border-radius: .2rem;
                    background: url("~~assets/img/exercise/hollow.png") no-repeat;
                    background-size: 100% 100%;
                    @include ratioContainer(110px, 30px, (width:(155px), height:(125px)));
                    text-align: center;
                    margin: 0 .1rem;
                    cursor: pointer;
                    font-size: 26px;
                    font-family: chinese;
                    em {
                        font-weight: 600;
                    }
                    &.active {
                        background-size: 140% 150%;
                        background-position: center;
                        color: white;
                        transition: all .1s ease-in;
                        background-image: url('~~assets/img/main_content/exercise/audio_speaking_active.png');
                    }

                }
            }
        }
    }
</style>
