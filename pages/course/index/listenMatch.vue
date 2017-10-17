<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-tool" @click="playAudio($event)">
                            <span class="parts-audio"></span>
                        </div>
                        <ul class="picture-option">
                            <li v-for="(item,index) in contentInfo.images"
                                @click="setOption($event,index);Answer(index,item.order)">
                                <loadingImage :src="addPrefixHost(item.image)"/>
                                <div class="gap">
                                    <img/>
                                </div>
                            </li>
                        </ul>
                        <ul class="word-option">
                            <li v-for="(item,index) in contentInfo.Matching" ref="bottomList"
                                @click="getOption($event,item.order)">
                                <loadingImage :src="addPrefixHost(item.image)"/>
                            </li>
                        </ul>
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
                creatAnswer: [],
                getAnswer: [],
                saveData: "",
                nodeInfo: [],
                setData: [],
                bIndex: 0,
                tIndex: 0,
                getObj: "",
                errorMessage: "",
                clickOrder: "",
                isUpdate: false
            }
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            playAudio(ev){
                this.$emit("playAudio", this.addPrefixHost(this.contentInfo.audio), ev);
            },
            setOption(e, Index){
                this.tIndex = Index;
                const img = e.currentTarget.getElementsByTagName("img")[1];
                const gap = e.currentTarget.getElementsByTagName("div")[0];
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
                this.clickOrder = order;
                this.$refs.bottomList.forEach((item, index) => {
                    item.classList.remove('active');
                });
                this.getObj = e.currentTarget;
                e.currentTarget.classList.add('active');
                this.bIndex = order - 1;
                for (let i = 0; i < this.contentInfo.Matching.length; i++) {
                    if (this.contentInfo.Matching[i].order === order) {
                        this.nodeInfo = this.contentInfo.Matching[i];
                    }
                }
            },
            Answer(Index, order){
                let answer = false;
                this.getAnswer[Index] = this.clickOrder;
                if (this.getAnswer.join(",") === this.contentInfo.anwserOrder[0]) {
                    answer = true;
                }
                this.setAnswer({
                    answer: answer,
                    msg: this.errorMessage
                });
            },
            init(){
                this.$nextTick(_ => {
                    const orderArr = this.contentInfo.anwserOrder && this.contentInfo.anwserOrder[0].split(",");
                    if (orderArr) {
                        for (let j = 0; j < orderArr.length; j++) {
                            if (this.contentInfo.Matching) {
                                for (let k = 0; k < this.contentInfo.Matching.length; k++) {
                                    if (this.contentInfo.Matching[k].order === orderArr[j]) {
                                        this.errorMessage += (j+1)+"."+ (this.contentInfo.Matching[k].chinese || this.contentInfo.Matching[k].english) + "<br>";
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
                    creatAnswer: [],
                    getAnswer: [],
                    saveData: "",
                    nodeInfo: [],
                    setData: [],
                    bIndex: 0,
                    tIndex: 0,
                    getObj: "",
                    errorMessage: "",
                    clickOrder: ""
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
                position: relative;
                display: inline-block;
                font-size: 18px;

                .picture-option {
                    margin: 0 0 20px 0;

                    li {
                        position: relative;
                        cursor: pointer;
                        margin: 0 10px;
                        display: inline-block;
                        vertical-align: middle;

                        img {
                            max-width: 2.4rem;
                            max-height: 2.4rem;
                        }
                        .active {
                            background: white;
                        }
                        .gap {
                            position: absolute;
                            width: .85rem;
                            height: 0.75rem;
                            /* border: 0.01rem solid black; */
                            top: 62%;
                            left: 8%;

                            img {
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%, -50%);
                                max-width: 85px;
                                max-height: 75px;
                            }

                        }
                    }
                }
                .word-option {
                    margin-top: 20px;

                    .active {
                        background: rgba(255, 255, 255, .7);
                        border-radius: 10px;
                    }

                    li {
                        cursor: pointer;
                        margin: 0 10px;
                        display: inline-block;
                        vertical-align: middle;

                        img {
                            max-width: 1.6rem;
                            max-height: 1.4rem;
                        }

                    }
                }
                .parts-audio {
                    background: url("~~assets/img/main_content/course/lv1-audio.png") center no-repeat;
                    background-size: cover;
                }

                .parts-audio {
                    display: block;
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    cursor: pointer;
                    position: absolute;
                    left: -70px;
                    top: 0;
                }

            }

        }

    }

</style>
