<template>
    <div>
        <transition name="fade" :class="isUpdate&&'fadeIn'">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left">
                            <div class="content-left-img">
                            </div>
                            <div class="conten-left-spell getOption">
                                <ul class="">
                                    <li v-for="(item,index) in contentInfo.chars&&contentInfo.chars.initials"
                                        :class="activeIndex===(index+'1')&&'active'"
                                        @click="getOption($event,index,item.letter,'1')">
                                        {{item.letter}}
                                    </li>
                                </ul>
                                <ul class="">
                                    <li v-for="(item,index) in contentInfo.chars&&contentInfo.chars.finals"
                                        :class="activeIndex===(index+'2')&&'active'"
                                        @click="getOption($event,index,item.letter,'2')">
                                        {{item.letter}}
                                    </li>
                                </ul>
                                <ul>
                                    <li v-for="(item,index) in contentInfo.chars&&contentInfo.chars.tones"
                                        :class="activeIndex===(index+'3')&&'active'"
                                        @click="getOption($event,index,item.letter,'3')">
                                        {{item.letter}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="content-right">
                            <div class="content-right-option" v-for="(item,supIndex) in contentInfo.words">
                                <ul class="pinyin-option-gap setOption">
                                    <li v-for="(item,index) in initHtml"
                                        @click="setOption($event,item,supIndex,index)">
                                        {{answerArr[supIndex] && answerArr[supIndex][index]}}
                                    </li>
                                </ul>
                                <div class="option-word">
                                    <loadingImage :src="addPrefixHost(item.resource)"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex';
    import loadingImage from '~/components/loadingImage';
    import R from 'ramda';
    import Vue from 'vue';
    export default {
        async fetch({store, params, isServer, redirect}){
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}){
            return {extendData: params.extendData}
        }, data () {
            return {
                initHtml: ["tones", "initials", "finals"],
                activeIndex: null,
                pitchIndex: null,
                answerArr: [],
                activeItem: null,
                correctArr: [],
                errorArr: [],
                isUpdate: false,
            }

        },
        methods: {
            getOption(e, index, item, type){
                this.activeIndex = index + type;
                this.activeItem = item;
            },
            setOption(e, item, supIndex, index){
                this.Answer(item, supIndex, index);
                if (this.activeItem != null) {
                    if (!this.answerArr[supIndex][index]) {
                        Vue.set(this.answerArr[supIndex], index, this.activeItem);
                        this.activeItem = null;
                        this.activeIndex = null;
                    } else {
                        Vue.set(this.answerArr[supIndex], index, this.activeItem);
                        this.activeItem = null;
                        this.activeIndex = null;
                    }
                } else {
                    Vue.set(this.answerArr[supIndex], index,"");
                }
            },
            Answer(item, supIndex, index){
                const answerArr = this.content.answer;
                if (this.activeItem === answerArr[item][supIndex]) {
                    this.errorArr[supIndex][index] = 1;
                }else{
                    if(answerArr[item][supIndex]===""){
                        this.errorArr[supIndex][index] = 1;
                    }else{
                        this.errorArr[supIndex][index] = 0;
                    }
                }
                for(let i=0;i<this.initHtml.length;i++){
                    if(answerArr[this.initHtml[i]][supIndex]===""){
                        this.correctArr[supIndex][i] = 0;
                    }
                }
                let answer = false;
                if (this.errorArr.toString() === this.correctArr.toString()) {
                    answer = true;
                }
                this.setAnswer({
                    answer: answer,
                    msg: this.content.answer && this.content.answer.correct
                });
            },
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            init(){
                this.$nextTick(_ => {
                    if (this.contentInfo.words) {
                        for (let i = 0; i < this.content.words.length; i++) {
                            this.answerArr.push([]);
                        }
                        if (this.correctArr.length < 1) {
                            for (let i = 0; i < this.content.words.length; i++) {
                                this.correctArr.push([]);
                                this.errorArr.push([]);
                                for (let j = 0; j < this.initHtml.length; j++) {
                                    this.correctArr[i].push(1);
                                    this.errorArr[i].push(0);
                                }

                            }
                        }
                    }
                    this.setAnswer({
                        answer: false,
                        msg: this.content.answer && this.content.answer.correct
                    });
                })
            }
        },
        created()
        {
        },
        mounted() {
            this.init();
        },
        watch: {
            contentInfo(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    activeIndex: null,
                    pitchIndex: null,
                    answerArr: [],
                    activeItem: null,
                    correctArr: [],
                    errorArr: [],
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600);
                this.init();
            },
        },
        computed: {
            contentInfo(){
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {},
            }),
        },
        components: {
            loadingImage
        }
    }
</script>

<style lang="less" scoped>
    .style-1 {

    .course_common_box {
        text-align: center;

    .course-content {
        display: inline-block;
    }

    .content-left, .content-right {
        display: inline-block;
        vertical-align: middle;
    }

    .content-left {
        width: 300px;
        margin-right: 30px;
    }

    .content-right {
        margin-left: 30px;
        box-sizing: border-box;
    }

    .content-left-img {
        display: block;
        text-align: center;
        width: 260px;
        height: 85px;
        background: url("~~assets/img/main_content/course/lv1-click-group.png") center no-repeat;
        background-size: contain;
        margin: 0 auto;
        margin-bottom: .2rem;
    }

    .conten-left-spell {
        display: block;

    ul {
        display: inline-block;
    }

    ul li {
        display: block;
        text-align: center;
        background: #084E62;
        box-sizing: border-box;
        font-size: 25px;
        color: white;
        margin: 10px;
        cursor: pointer;
        width: .7rem;
        height: .4rem;
        border-radius: 5px;
        border: 0.02rem dotted white;
        box-shadow: 0 0 0 0.02rem #002D32;
    }

    .active {
        background: dodgerblue;
        box-shadow: 0 0 0 3px #619ABE;
    }

    }
    .content-right-option {
        display: inline-block;
        margin: 0 20px 0 20px;
    }

    .option-word {
        width: 150px;
        height: 150px;
        border: 5px solid #002D32;
        border-radius: 5px;
        margin: 0 auto;
        margin-top: 20px;

    img {
        width: 100%;
        height: 100%;
    }

    }

    .pinyin-option-gap {
        display: block;

    li {
        display: inline-block;
        width: 80px;
        height: 45px;
        font-size: 18px;
        line-height: 38px;
        border-radius: 5px;
        border: 2px dotted black;
        text-align: center;
        position: relative;
        box-sizing: border-box;
        /*font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal', 'Showcard Gothic';*/
        margin: 10px;
        padding: 1px;
        color: #084E62;
        cursor: pointer;
        vertical-align: middle;

    div {
        float: left;
        background: #084E62;
        border-radius: 0.05rem;
        line-height: 0.4rem;
        width: 100%;
        height: 100%;
        font-size: 0.25rem;
        color: white;
    }

    }
    li:before {
        line-height: normal;
        font-size: 18px;
        color: #084E62;
        position: absolute;
        /*font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal', 'Showcard Gothic';*/
    }

    li:nth-child(1) {
        display: block;
        margin-left: 110px;
        /*background: url("~~assets/img/main_content/course/l1-tone.png") center no-repeat;*/
        /*background-size: 70% 55%;*/
    }

    li:nth-child(2) {
        /*background: url("~~assets/img/main_content/course/l1-initial.png") center no-repeat;*/
        /*background-size: 70% 40%;*/
    }

    li:nth-child(3) {
        /*background: url("~~assets/img/main_content/course/l1-final.png") center no-repeat;*/
        /*background-size: 70% 40%;*/
    }

    li:nth-child(1):before {
        content: "1";
        top: -9px;
        left: -15px;
        font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal','Showcard Gothic';
    }

    li:nth-child(2):before {
        content: "2";
        top: -9px;
        left: -15px;
        font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal','Showcard Gothic';
    }

    li:nth-child(3):before {
        content: "3";
        top: -9px;
        left: -15px;
        font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal','Showcard Gothic';
    }

    }
    }
    }


</style>
