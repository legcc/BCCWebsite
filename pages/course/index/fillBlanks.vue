<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <ul class="option-list" ref="lList">
                            <li v-for="(item,index) in contentInfo.scenes" ref="leftOption"
                                @click="getOption($event,index)">
                                <div class="tb">
                                    <span :style="{'display':pinyinSwitch ? 'block':'none'}" class="en">{{item.scene[0].pinyin}}</span>
                                    <span class="cn">{{item.scene[0].chinese}}</span>
                                </div>
                            </li>
                        </ul>
                        <div class="content">
                            <div class="inside">
                                <ul ref="rList">
                                    <li v-for="(item,index) in contentInfo.scenes">
                                        <div class="option-picture">
                                            <div class="picture"></div>
                                            <loadingImage :src="addPrefixHost(item.image)"/>
                                        </div>
                                        <div v-for="list in item.scene" class="option-word">
                                            <em>{{list.name}}:</em>
                                            <div class="option-blank">
                                                <div class="blank-inside">
                                                    <div v-if="list.isBlank=='F'" class="tb">
                                                        <span :style="{'display':pinyinSwitch ? 'block':'none'}" class="en">{{list.isBlank == 'F' ? list.pinyin : ''}}</span>
                                                        <span class="cn">{{list.isBlank == 'F' ? list.chinese : ''}}</span>
                                                    </div>
                                                    <div v-if="list.isBlank=='T'" class="blank tb"
                                                         @click="setOption($event,index);Answer($event,index)">

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
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
        async fetch({isServer, redirect, store, params}){
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}){
            return {extendData: params.extendData}
        }, data () {
            return {
                nodeInfo: "",
                creatAnswer: [],
                getAnswer: [],
                setData: [],
                lIndex: 0,
                rIndex: 0,
                getObj: "",
                contrast: [],
                errorMessage: ""
            }
        },
        methods: {
            setOption(e, Index){
                this.rIndex = Index;
                if (this.nodeInfo.length != "") {
                    if (this.setData.length != 0) {
                        for (let i in this.setData) {
                            if (this.setData[i].rIndex === this.rIndex) {
                                this.$refs.leftOption[this.setData[i].lIndex].style.visibility = "visible";
                                this.setData.splice(i, 1);
                            }
                        }
                    }
                    e.currentTarget.innerHTML = "";
                    e.currentTarget.innerHTML = this.nodeInfo;
                    e.currentTarget.classList.add('active');
                    this.getObj.style.visibility = "hidden";
                    this.nodeInfo = "";
                    this.getObj.classList.remove('active');
                    this.setData.push({
                        lIndex: this.lIndex,
                        rIndex: this.rIndex,
                    });
                } else {
                    for (let i in this.setData) {
                        if (this.setData[i].rIndex === this.rIndex) {
                            e.currentTarget.innerHTML = "";
                            this.$refs.leftOption[this.setData[i].lIndex].style.visibility = "visible";
                            this.setData.splice(i, 1);
                        }
                    }
                }
            },
            getOption(e, Index){
                let target = e.currentTarget;
                this.lIndex = Index;
                for (let i = 0; i < this.$refs.leftOption.length; i++) {
                    this.$refs.leftOption[i].classList.remove('active');
                }
                this.nodeInfo = target.children[0].innerHTML;
//                let nodeChildren = target.children[0].children;
                this.getObj = target;
                target.classList.add('active');
//                for (let i = 0; i < nodeChildren.length; i++) {
//                    this.nodeInfo[i] = ("<span>" + nodeChildren[i].innerHTML + "</span>")
//                }
            },
            Answer(e, Index){
                const _li = document.querySelectorAll(".blank")[Index].children;
                const _ul = document.querySelectorAll(".blank");
                for (let i = 0; i < _ul.length; i++) {
                    if (_ul[i].children.length < 1) {
                        this.getAnswer[i] = 0;
                    }
                }
                for (let j = 0; j < _li.length; j++) {
                    if (_li[j].innerHTML === this.creatAnswer[Index].pinyin || _li[j].innerHTML === this.creatAnswer[Index].chinese) {
                        this.getAnswer[Index] = 1;
                    } else {
                        this.getAnswer[Index] = 0;
                    }
                }

                //判断所有数值是否为1
                let answer = false;
                if (this.getAnswer.join(",") === this.contrast.join(",")) {
                    answer = true;
                }
                this.setAnswer({
                    answer: answer,
                    msg: this.errorMessage
                });
            },
            init(){
                this.$nextTick(_ => {
                    if (this.contentInfo.scenes) {
                        for (let i = 0; i < this.contentInfo.scenes.length; i++) {
                            for (let j = 0; j < this.contentInfo.scenes[i].scene.length; j++) {
                                if (this.contentInfo.scenes[i].scene[j].isBlank === 'T') {
                                    this.errorMessage += (i + 1) + '.' + (this.contentInfo.scenes[i].scene[j].chinese + "<br>");
                                }
                            }
                        }
                        this.contentInfo.scenes.forEach((item, index) => {
                            for (let i = 0; i < item.scene.length; i++) {
                                if (item.scene[i].isBlank === 'T') {
                                    this.creatAnswer.push(item.scene[i]);
                                }

                            }
                            this.getAnswer.push(0);
                            this.contrast.push(1);
                        });
                    }
                    this.setAnswer({
                        answer: false,
                        msg: this.errorMessage
                    });
                })
            },
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
        },
        mounted() {
            this.init()
        },
        watch: {
            contentInfo(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerArr: [],
                    correctArr: [],
                    errorMessage: ""
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
        created () {
        },
        computed: {
            contentInfo(){
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                pinyinSwitch: state => state.pinyinSwitch,
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

    .option-list {
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;

    .active {
        background: #619ABE;

    div {
        background: dodgerblue;
    }

    }

    li {
        background: #002D32;
        border-radius: 0.05rem;
        padding: 0.05rem;
        font-size: 0.18rem;
        color: white;
        margin: .1rem 0;
        cursor: pointer;
        display: table;
        min-width: .8rem;
        min-height: .7rem;

    div {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background: #00565F;
        border: 2px dashed white;
        border-radius: 5px;
        min-height: .7rem;
        padding: .05rem;

    span {
        display: block;
    }

    }
    }
    }
    .content {
        display: inline-block;
        vertical-align: middle;
        border-radius: 10px;
        background: #002D32;
        color: white;
        font-size: 16px;
        padding: 0.13rem;

    .inside {
        background: #00565F;
        border-radius: 0.1rem;
        border: 0.02rem dashed white;
        padding: 0.1rem;
        min-width: 6rem;
        min-height: 3rem;
    }

    ul li {
        display: inline-block;
        margin: 0 10px;
    }

    .option-picture {
        width: 210px;
        height: 150px;
        position: relative;
        margin-bottom: 40px;

    .picture {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        filter: blur(20px);
        background: white;
        z-index: 0;
    }

    img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 210px;
        max-height: 150px;
        z-index: 1;
        border-radius: 0.05rem;
    }

    }
    .option-word {
        text-align: left;
        margin-top: 20px;

    em {
        display: inline-block;
        margin-right: 10px;
        width: .3rem;
    }

    .active {
        color: #ffde72;
    }

    .option-blank {
        display: inline-block;
        min-width: 1rem;
        height: .65rem;
        border-bottom: 0.02rem solid white;
        text-align: center;
        cursor: pointer;
        vertical-align: bottom;

    .blank-inside {
        display: table;
        width: 100%;
        height: 100%;
    }

    /*.blank {*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*}*/
    span {
        display: block;
    }

    }
    }
    }

    }

    }

</style>
