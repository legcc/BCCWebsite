<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-top">
                            <div class="top-title">
                                <span v-for="item in contentInfo.title">{{item}}</span>
                            </div>
                            <div class="top-picture"></div>
                        </div>
                        <div class="content-container">
                            <div class="container-item" v-for="(item,index) in contentInfo.grammar">
                                <div class="item-info">
                                    <h1 class="title">{{item.title}}</h1>
                                    <ul class="sentence">
                                        <li v-for="list in item.data">
                                            <span :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                  class="en">{{list.pinyin}}</span>
                                            <span class="cn">{{list.chinese}}</span>
                                            <span class="en">{{list.english}}</span>
                                        </li>
                                    </ul>
                                </div>
                                <span class="line"></span>
                                <ul class="item-option" ref="other">
                                    <li v-for="item in 3" @click="slide($event,index)">
                                        <span class="tick"></span>
                                        <span class="slide"></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-top">
                            <div class="top-title">
                                <p v-for="item in contentInfo.title">{{item}}</p>
                            </div>
                            <div class="top-picture">

                            </div>
                        </div>
                        <div class="content-container">
                            <div class="container-item" v-for="item in contentInfo.grammar">
                                <div class="item-info">
                                    <h1 class="title" v-if="item.title.length">{{item.title}}</h1>
                                    <ul class="sentence">
                                        <li v-for="list in item.data">
                                            <span>{{list.pinyin}}</span>
                                            <span>{{list.chinese}}</span>
                                            <span>{{list.english}}</span>
                                        </li>
                                    </ul>
                                </div>
                                <span class="line"></span>
                                <ul class="item-option">
                                    <li>
                                        <span class="tick"></span>
                                        <span class="slide"></span>
                                    </li>
                                    <li>
                                        <span class="tick"></span>
                                        <span class="slide"></span>
                                    </li>
                                    <li>
                                        <span class="tick"></span>
                                        <span class="slide"></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-top">
                            <div class="top-title">
                                <span v-for="item in contentInfo.title">{{item}}</span>
                            </div>
                            <div class="top-picture">
                            </div>
                        </div>
                        <div class="content-container">
                            <div class="container-item" v-for="item in contentInfo.grammar">
                                <div class="item-info">
                                    <p v-for="list in item.data">{{list.chinese}}</p>
                                </div>
                                <ul class="item-option">
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-4" v-if="templateStyle ==='style-4'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-top">
                            <div class="top-title">
                                <span v-for="item in contentInfo.title">{{item}}</span>
                            </div>
                            <div class="top-picture">
                            </div>
                        </div>
                        <div class="content-container">
                            <div class="container-item" v-for="(item,index) in contentInfo.grammar">
                                <div class="item-info">
                                    <!--<h1>{{item.title}}:</h1>-->
                                    <p v-for="list in item.data">{{list.pinyin}}</p>
                                    <p v-for="list in item.data">{{list.chinese}}</p>
                                    <p v-for="list in item.data">{{list.english}}</p>
                                </div>
                                <ul class="item-option" ref="other">
                                    <li v-for="item in 3" @click="slide($event,index)">
                                        <span class="tick"></span>
                                        <span class="slide"></span>
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

    export default {
        async fetch({store, params, isServer, redirect}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {}
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            slide(e, index) {
                if (e.currentTarget.children[1].className.indexOf('inMove') > -1) {
                    e.currentTarget.children[1].classList.remove('inMove')
                } else {

                    for (let j = 0; j < this.$refs.other[index].children.length; j++) {
                        this.$refs.other[index].children[j].children[1].classList.remove('inMove')
                    }

                    e.currentTarget.children[1].classList.add('inMove')
                }
            }
        },
        created() {
        },
        computed: {
            contentInfo() {
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                pinyinSwitch: state => state.pinyinSwitch,
            }),
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

            .content-container {
                margin-top: 20px;
            }

            .container-item {
                margin: 15px 0;
            }

            .course-content-top {
                overflow: hidden;
            }

            .top-title {
                float: left;
                font-size: 30px;
                font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal', 'Showcard Gothic';
                text-align: left;
                display: inline-block;
                vertical-align: middle;
                margin: 20px 70px 0 0;

                span {
                    display: block;
                }

            }
            .top-picture {
                float: right;
                width: 220px;
                height: 120px;
                vertical-align: middle;
                background: url("~~assets/img/main_content/course/lv1-traffic-light.png") center no-repeat;
                background-size: contain;
            }

            .item-info {
                position: relative;
                display: inline-block;
                width: 430px;
                padding: 10px 5px;
                border: 5px solid black;
                border-radius: 15px;
                background: white;
                vertical-align: middle;

                .title {
                    text-align: left;
                    font-size: 22px;
                    text-decoration: underline;
                    margin-bottom: 10px;
                }

                .sentence {
                    text-align: left;
                    font-size: 0.22rem;
                    padding-left: 20px;
                    li {
                        display: inline-block;
                        margin: 0 5px;
                        span {
                            display: block;
                            text-align: center;
                        }

                    }
                }

            }
            .line {
                display: inline-block;
                width: 200px;
                border-bottom: 5px solid black;
                vertical-align: middle;
            }

            .item-option {
                display: inline-block;
                vertical-align: middle;

                li {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 5px solid black;
                    display: inline-block;
                    background: white;
                    margin: 0 10px 0 0;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                li {

                    .tick {
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        position: absolute;
                        left: 5px;
                        top: 5px;
                    }

                    .slide {
                        display: inline-block;
                        position: absolute;
                        left: 5px;
                        top: 5px;
                        width: 40px;
                        height: 40px;
                        background: white;
                        transition: all .2s;
                    }
                    .inMove {
                        left: .5rem;
                    }

                }
                li:nth-child(1) {

                    .tick {
                        background: url("~~assets/img/main_content/course/tick-1.png") center no-repeat;
                        background-size: contain;
                    }

                }
                li:nth-child(2) {

                    .tick {
                        background: url("~~assets/img/main_content/course/tick-2.png") center no-repeat;
                        background-size: contain;
                    }

                }
                li:nth-child(3) {

                    .tick {
                        background: url("~~assets/img/main_content/course/tick-3.png") center no-repeat;
                        background-size: contain;
                    }

                }
            }

        }

    }

    .style-2 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
            }

            .content-container {
                margin-top: 20px;
            }

            .container-item {
                margin: 15px 0;
            }

            .course-content-top {
                overflow: hidden;
            }

            .top-title {
                float: left;
                font-size: 28px;
                text-align: left;
                vertical-align: top;
                margin: 20px 70px 0 0;

                span {
                    display: block;
                }

            }
            .top-picture {
                width: 210px;
                height: 120px;
                vertical-align: top;
                float: right;
                background: url("~~assets/img/main_content/course/l2-traffic-light.png") center no-repeat;
                background-size: contain;
            }

            .item-info {
                display: inline-block;
                border: 5px solid #083A09;
                border-radius: 40px;
                background: white;
                padding: 30px 5px;
                font-size: 20px;
                width: 490px;
                .title {
                    text-align: left;
                    font-size: 22px;
                    text-decoration: underline;
                    margin-bottom: 10px;
                }

                .sentence {
                    text-align: left;
                    font-size: 0.18rem;
                    li {
                        display: inline-block;
                        margin: 0 5px;
                        span {
                            display: block;
                        }

                    }
                }
            }

            .line {
                display: inline-block;
                width: 150px;
                border-bottom: 5px solid #083A09;
                position: relative;
                bottom: 5px;
            }

            .item-option {
                display: inline-block;
                position: relative;
                top: 20px;

                li {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: 5px solid #083A09;
                    display: inline-block;
                    background: white;
                    margin: 0 10px 0 0;
                    cursor: pointer;
                }

            }
        }

    }

    .style-3 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
            }

            .content-container {
                margin-top: 30px;
            }

            .container-item {
                margin: 40px 0;

            }

            .course-content-top {
                overflow: hidden;
            }

            .top-title {
                float: left;
                font-size: 28px;
                text-align: left;
                vertical-align: top;
                margin: 20px 70px 0 0;

                span {
                    display: block;
                }

            }
            .top-picture {
                width: 220px;
                height: 100px;
                vertical-align: top;
                float: right;
                background: url("~~assets/img/main_content/course/lv3-traffic-light.png") center center no-repeat;
                background-size: 100% 100%;
            }

            .item-info {
                width: 500px;
                display: inline-block;
                border-bottom: 2px solid #D95428;
                margin-right: 20px;
                vertical-align: bottom;
                text-align: left;
            }

            .item-option {
                display: inline-block;

                li {
                    width: 50px;
                    height: 50px;
                    border: 1px solid #FABC6E;
                    display: inline-block;
                    background: #FBB638;
                    margin-left: 33px;
                    cursor: pointer;
                    box-shadow: 8px 9px 6px -3px #E06414 inset, -2px 0px 4px 1px #E06414 inset;
                }

            }
        }

    }

    .style-4 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
                padding: .1rem .3rem 0.1rem .7rem;
                background: url("~~assets/img/main_content/course/l4-summary-bg.png") center center no-repeat;
                background-size: 100% 100%;
                min-height: 4rem;
            }

            .container-item {
                border-bottom: 2px dashed black;
                font-family: Calibri, KaiTi;
            }

            .course-content-top {
                overflow: hidden;
                border-bottom: 2px solid black;
                padding-bottom: 35px;
            }

            .top-title {
                float: left;
                font-size: 30px;
                text-align: left;
                vertical-align: top;
                margin: 20px 70px 0 0;
                font-weight: 700;
                font-family: Calibri;
                span {
                    display: block;
                }

            }
            .top-picture {
                width: 220px;
                height: 100px;
                vertical-align: top;
                float: right;
                background: url("~~assets/img/main_content/course/l4-traffic-light.png") center center no-repeat;
                background-size: 100% 100%;
            }

            .item-info {
                display: inline-block;
                padding: 0.2rem 0;
                font-size: 0.24rem;
                width: 5.5rem;
                vertical-align: middle;
                text-align: left;
                h1 {
                    font-weight: 700;
                }
            }

            .line {
                display: inline-block;
                width: 150px;
                border-bottom: 5px solid #083A09;
                vertical-align: middle;
            }

            .item-option {
                display: inline-block;
                vertical-align: middle;
                li {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: 5px solid #083A09;
                    display: inline-block;
                    background: white;
                    margin: 0 10px 0 0;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .tick {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    position: absolute;
                    left: 2px;
                    top: 5px;
                }

                .slide {
                    display: inline-block;
                    position: absolute;
                    left: 2px;
                    top: 5px;
                    width: 40px;
                    height: 40px;
                    background: white;
                    transition: all .2s;
                }
                .inMove {
                    left: .5rem;
                }

                li:nth-child(1) {

                    .tick {
                        background: url("~~assets/img/main_content/course/tick-1.png") center no-repeat;
                        background-size: contain;
                    }

                }
                li:nth-child(2) {

                    .tick {
                        background: url("~~assets/img/main_content/course/tick-2.png") center no-repeat;
                        background-size: contain;
                    }

                }
                li:nth-child(3) {

                    .tick {
                        background: url("~~assets/img/main_content/course/tick-3.png") center no-repeat;
                        background-size: contain;
                    }

                }
            }
        }

    }

</style>
