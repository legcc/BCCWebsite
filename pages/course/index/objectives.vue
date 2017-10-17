<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-inside">
                            <h1>{{contentInfo.contentTitle}}</h1>
                            <ol>
                                <li>
                                    <h2>{{contentInfo.keyVocabularyTitle}}</h2>
                                    <ul>
                                        <li v-for="item in contentInfo.keyVocabularyData ?contentInfo.keyVocabularyData.words:[]">
                                            <span :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                  class="en">{{item.pinyin}} </span>
                                            <span class="cn">{{item.chinese}} </span>
                                            <span class="en">{{item.english}} </span>
                                        </li>
                                    </ul>
                                </li>
                                <li v-if="contentInfo.grammarPoints">
                                    <h2>Grammar Point</h2>
                                    <!--<p v-for="(item,index) in contentInfo.grammarPoints"  :class="index===1&&'cn'">{{item}}</p>-->
                                    <p v-for="(item,index) in contentInfo.grammarPoints">{{item}}</p>
                                </li>
                                <li>
                                    <h2>Communication Skill</h2>
                                    <p v-if="contentInfo.communicationSkill?contentInfo.communicationSkill.length:''">
                                        {{contentInfo.communicationSkill}}</p>
                                </li>
                                <li v-if="contentInfo.introduction?contentInfo.introduction.length:''">
                                    <h2>{{contentInfo.introduction}}</h2>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <h1>{{contentInfo.contentTitle}}</h1>
                        <ul class="main-list">
                            <li>
                                <h2>{{contentInfo.keyVocabularyTitle}}</h2>
                                <ul class="word-list">
                                    <li v-for="item in contentInfo.keyVocabularyData ?contentInfo.keyVocabularyData.words:[]">
                                        <div class="tb">
                                            <span :style="{'display':pinyinSwitch ? 'block':'none'}">{{item.pinyin}} </span>
                                            <span>{{item.chinese}} </span>
                                            <span>{{item.english}} </span>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <h2>Sentence Pattern</h2>
                                <ol class="sentence-list"
                                    v-if="contentInfo.grammarPoints&&contentInfo.grammarPoints.length">
                                    <li v-for="item in contentInfo.grammarPoints" v-if="item&&item.length">{{item}}</li>
                                </ol>
                            </li>
                            <li v-if="contentInfo.communicationSkill&&contentInfo.communicationSkill.length">
                                <h2>Communication Skills</h2>
                                <p>{{contentInfo.communicationSkill}}</p>
                            </li>
                            <li v-if="contentInfo.introduction?contentInfo.introduction.length:''">
                                <h2>{{contentInfo.introduction}}</h2>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <h1>{{contentInfo.contentTitle}}</h1>
                        <ul class="main-list">
                            <li>
                                <h2>{{contentInfo.keyVocabularyTitle}}</h2>
                                <ul class="word-list">
                                    <li v-for="item in contentInfo.keyVocabularyData.words">
                                        <span>{{item.pinyin}}</span>
                                        <span>{{item.chinese}}</span>
                                        <span>{{item.english}}</span>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <h2>Grammatical structure</h2>
                                <ol class="sentence-list">
                                    <li v-for="item in contentInfo.grammarPoints">
                                        {{item}}
                                    </li>
                                </ol>
                            </li>
                            <li>
                                <h2>Communication Skills</h2>
                                <ol class="sentence-list en">
                                    <li v-if="contentInfo.communicationSkill">{{contentInfo.communicationSkill}}</li>
                                </ol>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-4" v-if="templateStyle ==='style-4'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-wrap">
                            <h1>{{contentInfo.contentTitle}}</h1>
                            <div class="box">
                                <ul class="main-list">
                                    <li>
                                        <h2>{{contentInfo.keyVocabularyTitle}}</h2>
                                        <ul class="word-list">
                                            <li v-for="item in contentInfo.keyVocabularyData ?contentInfo.keyVocabularyData.words:[]">
                                                <div class="tb">
                                                    <span :style="{'display':pinyinSwitch ? 'block':'none'}">{{item.pinyin}} </span>
                                                    <span>{{item.chinese}}</span>
                                                    <span>{{item.english}}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li v-if="contentInfo.grammarPoints">
                                        <h2>Grammar Point</h2>
                                        <p v-for="item in contentInfo.grammarPoints">{{item}}</p>
                                    </li>
                                    <li>
                                        <h2>Communication Skill</h2>
                                        <p v-if="contentInfo.communicationSkill?contentInfo.communicationSkill.length:''"
                                           class="en">
                                            {{contentInfo.communicationSkill}}</p>
                                    </li>
                                    <li v-if="contentInfo.introduction?contentInfo.introduction.length:''">
                                        <h2>{{contentInfo.introduction}}</h2>
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

            .course-content {
                box-sizing: border-box;
                color: white;
                font-size: 0.18rem;
                background: #002D32;
                padding: 0.1rem;
                border-radius: 15px;
                margin: 0 auto;
                font-family: -webkit-pictograph, KaiTi;

                .content-inside {
                    border-radius: 5px;
                    border: 2px dashed white;
                    padding: 15px;
                    background: #00565F;
                    color: white;
                    min-height: 3.6rem;
                    width: 750px;
                }

                h1 {
                    display: block;
                    text-align: center;
                    font-size: 22px;
                }

                p {
                    margin: 10px 0 10px 0;
                }

                h2 {
                    text-decoration: underline;
                    font-size: 22px;
                }

                ol {
                    margin: 10px 0 0 25px;

                    ul {
                        margin: 10px 0 10px 0;

                        li {
                            margin: 0 5px;
                            display: inline-block;

                            span {
                                display: block;
                                text-align: center;
                                color: #00DFE6;
                            }
                            span:nth-child(2) {
                                font-size: 22px;
                            }
                        }
                    }
                }
            }

        }
    }

    .style-2 {

        .course_common_box {
            margin: 0 auto;

            .course-content {
                width: 750px;
                margin: 0 auto;
                color: black;

                h1 {
                    display: block;
                    text-align: center;
                    font-size: 25px;
                }

                h2 {
                    text-decoration: underline;
                    font-size: 24px;
                    font-weight: 700;
                }
                p {
                    font-size: 20px;
                }
                .main-list {
                    margin-top: 10px
                }

                .sentence-list {
                    font-size: 20px;
                    list-style: disc;
                    margin-left: 25px;
                    margin-top: 10px;

                    li {
                        margin: 5px 0 5px 0;
                        padding-left: 10px;

                        em {
                            color: red;
                        }

                    }

                }
                .word-list {
                    overflow: hidden;
                    margin: 10px 0 10px 0;

                    li {
                        border-radius: 10px;
                        min-width: 120px;
                        height: 91px;
                        border: 5px solid #4A9C00;
                        background: linear-gradient(lighten(#FDFC81, 10%) 0, #E5E685 90%);
                        box-sizing: border-box;
                        margin: 0 5px 5px 0;
                        padding: 0 2px 0 2px;
                        box-shadow: 0px 2px 5px -1px black;
                        display: table;
                        float: left;

                        span {
                            display: block;
                            text-align: center;
                            font-size: 18px;
                        }

                        span:nth-child(2) {
                            font-size: 0.3rem;
                        }

                    }
                }
            }

        }

    }

    .style-3 {

        .course_common_box {
            margin: 0 auto;

            .course-content {
                width: 800px;
                margin: 0 auto;
                color: black;

                h1 {
                    display: block;
                    text-align: center;
                }

                h2 {
                    text-decoration: underline;
                }

                h1, h2 {
                    font-size: 24px;
                }

                .main-list {
                    margin-top: 10px;

                    li {
                        margin-bottom: 10px;
                        display: flow-root;
                    }

                }
                .sentence-list {
                    list-style: disc;
                    margin-left: 25px;
                    margin-top: 10px;

                    li {
                        margin: 10px 0 0 0;
                        display: list-item;
                    }

                }
                .word-list {
                    /* overflow: hidden; */
                    /* overflow: overlay; */
                    /* height: 97px; */
                    margin-top: 0.1rem;

                    li {
                        min-width: 1.05rem;
                        min-height: 0.9rem;
                        background: #A8352F;
                        border-radius: 0.15rem;
                        float: left;
                        -webkit-box-shadow: 0 0.02rem 0.08rem -0.01rem black inset;
                        box-shadow: 0 -0.01rem 0.09rem 0rem black inset;
                        margin: 0 0 0.05rem 0;
                        display: grid;
                        padding: 0 .03rem;

                        span {
                            display: block;
                            text-align: center;
                            color: white;
                            font-size: 14px;
                            line-height: 30px;
                        }

                        span:nth-child(2) {
                            font-size: 20px;
                        }

                    }
                }

            }
        }
    }

    .style-4 {

        .course_common_box {

            .course-content {
                .box {
                    width: 5.7rem;
                }
                h1 {
                    display: block;
                    text-align: center;
                }

                h2 {
                    font-weight: 800;
                }

                h1, h2 {
                    font-size: 24px;
                }

                .main-list {
                    margin-top: 10px;
                    width: 700px;
                    li {
                        font-family: Calibri, KaiTi;
                        font-size: 20px;
                        p {
                            padding-left: 15px;
                        }

                    }

                }
                .sentence-list {
                    list-style: disc;
                    margin-left: 25px;
                    margin-top: 10px;

                    li {
                        margin: 10px 0 0 0;

                    }

                }
                .word-list {
                    overflow: hidden;
                    margin-top: 10px;

                    li {
                        min-width: 1.4rem;
                        min-height: 0.8rem;
                        background: #AA8FFA;
                        border-radius: 0.05rem;
                        float: left;
                        margin: 0 0.1rem 0.1rem 0;
                        padding: .02rem;
                        display: table;

                        span {
                            display: block;
                            text-align: center;
                            color: black;
                        }

                        span:nth-child(2) {
                            font-size: 28px;
                            font-family: KaiTi;
                            font-weight: 700;
                        }

                    }
                }

            }
        }
    }

</style>
