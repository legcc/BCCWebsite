<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-tool">
                            <span class="parts-audio" @click="playAudio($event)"></span>
                            <!--<span>PLAY</span>-->
                        </div>
                        <div class="content-left">
                            <ul class="left-picture">
                                <li v-for="(item,index) in contentInfo.images" ref="bottomList"
                                    @click="getOption($event,item.order)">
                                    <loadingImage :src="addPrefixHost(item.image)"/>
                                </li>
                            </ul>
                        </div>
                        <div class="content-right">
                            <ul class="right-picture">
                                <li v-for="item in contentInfo.Matching">
                                    <loadingImage :src="addPrefixHost(item.image)"/>
                                </li>
                            </ul>
                            <div class="right-gap" v-for="(item,index) in contentInfo.Matching" @click="setOption($event,index);Answer(index,item.order)">
                                 <img/>
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
                getAnswer: [],
                nodeInfo:"",
                setData: [],
                bIndex: 0,
                tIndex: 0,
                getObj: "",
                errorMessage:"",
                clickOrder:""
            }
        },
        methods: {
            playAudio(ev){
                this.$emit("playAudio", this.addPrefixHost(this.contentInfo.audio), ev);
            },
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            setOption(e, Index){
                this.tIndex = Index;
                const img = e.currentTarget.getElementsByTagName("img")[0];
                const gap = e.currentTarget;
                if (this.nodeInfo != "") {
                    if (this.setData.length != 0) {
                        for (let i in this.setData) {
                            if (this.setData[i].tIndex === this.tIndex) {
                                this.$refs.bottomList[this.setData[i].bIndex].style.visibility = "visible";
                                this.setData.splice(i, 1);
                            }
                        }
                    }
                    gap.classList.add('active');
                    img.src = this.addPrefixHost(this.nodeInfo.image);
                    this.nodeInfo = "";
                    this.getObj.classList.remove('active');
                    this.getObj.style.visibility = "hidden";
                    this.setData.push({
                        bIndex: this.bIndex,
                        tIndex: this.tIndex,
                    });
                } else {
                    for (let i in this.setData) {
                        if (this.setData[i].tIndex === this.tIndex) {
                            img.src = "";
                            gap.classList.remove('active');
                            this.$refs.bottomList[this.setData[i].bIndex].style.visibility = "visible";
                            this.setData.splice(i, 1);
                        }
                    }
                }
            },
            getOption(e, order){
                this.clickOrder=order;
                this.$refs.bottomList.forEach((item, index) => {
                    item.classList.remove('active');
                });
                this.getObj = e.currentTarget;
                e.currentTarget.classList.add('active');
                this.bIndex = order - 1;
                for (let i = 0; i < this.contentInfo.images.length; i++) {
                    if (this.contentInfo.images[i].order === order) {
                        this.nodeInfo = this.contentInfo.images[i];
                    }
                }
            },
            Answer(Index,order){
                let answer=false;
                    this.getAnswer[Index]=this.clickOrder;
                   if(this.getAnswer.join(",")===this.contentInfo.anwserOrder[0]){
                       answer=true;
                   }
                this.setAnswer({
                    answer: answer,
                    msg:this.errorMessage
                });
            },
            init(){
                this.$nextTick(_ => {
                    const orderArr = this.contentInfo.anwserOrder && this.contentInfo.anwserOrder[0].split(",");
                    if (orderArr) {
                        for (let j = 0; j < orderArr.length; j++) {
                            if (this.contentInfo.images) {
                                for (let k = 0; k < this.contentInfo.images.length; k++) {
                                    if (this.contentInfo.images[k].order === orderArr[j]) {
                                        this.errorMessage += (j+1)+"."+ (this.contentInfo.images[k].chinese || this.contentInfo.images[k].english) + "<br>";
                                    }
                                }
                            }
                        }
                    }
                    this.setAnswer({
                        answer: false,
                        msg: this.errorMessage
                    });
                })
            }
        },
        mounted() {
            this.init()
        },
        watch: {
            contentInfo(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    getAnswer: [],
                    nodeInfo:"",
                    setData: [],
                    bIndex: 0,
                    tIndex: 0,
                    getObj: "",
                    errorMessage:"",
                    clickOrder:""
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
             console.log(this.contentInfo)
        },
        computed: {
            contentInfo(){
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle
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

            .content-tool {
                display: inline-block;
                vertical-align: middle;

                .parts-audio {
                    display: block;
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    cursor: pointer;
                    background: url("~~assets/img/main_content/course/lv1-audio.png") center no-repeat;
                    background-size: cover;
                }
    .play-active{
        background: url("~~assets/img/main_content/course/lv1-audio-active.png") center no-repeat;
        background-size: cover;
    }
            }
            .content-left {
                display: inline-block;
                vertical-align: middle;
                margin-right: 25px;
            }

            .content-right {
                position: relative;
                display: inline-block;
                vertical-align: middle;
            }

            .left-picture {
                .active {
                    background: rgba(255, 255, 255, .7);
                    border-radius: 10px;
                }
                li {
                    cursor: pointer;
                    margin: 15px 0;

                    img {
                        max-width: 1.5rem;
                        max-height: 1.5rem;
                    }

                }
            }
            .right-picture {
                position: relative;
                height: 400px;
                width: 600px;

                li {
                    position: absolute;
                    cursor: pointer;

                    img {
                        max-width: 2.5rem;
                        max-height: 2.5rem;
                    }

                    &:nth-child(3) {
                        left: 150px;
                    }

                    &:nth-child(2) {
                        top: 145px;
                    }

                    &:nth-child(1) {
                        top: 1.45rem;
                        left: 3.3rem;
                    }

                }
            }
            .right-gap {
                cursor: pointer;
                position: absolute;
                width: 100px;
                height: 100px;
                background: url("~~assets/img/main_content/course/you-head.png") center no-repeat;
                background-size: contain;
                top: 275px;
                left: 231px;
                &:before{
                    content: "3";
                    position: absolute;
                    left: 0;
                }
                img {
                    max-width: 140px;
                    max-height: 120px;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .active {
                background: none;
            }
            .right-gap:nth-child(2) {
                top: 30px;
                left: 50px;
                &:before{
                    content: "1";
                    position: absolute;
                    left: 0;
                }
            }
            .right-gap:nth-child(3) {
                left: 4.02rem;
                top: 30px;
                &:before{
                    content: "2";
                    position: absolute;
                    left: 0;
                }
            }
        }

    }

</style>
