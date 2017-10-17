<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left">
                            <div class="content-left-word">
                                <loadingImage :src="addPrefixHost(imgToggle)" ref="sImg"/>
                            </div>
                            <div class="content-left-spell">
                                <span class="parts-hint" @click="hintToggle($event)"></span>
                                <span class="spell">
                                    <em :style="{'display':pinyinSwitch ? 'block':'none'}">{{contentInfo.words && contentInfo.words.pinyin}}</em>
                                    <em>{{contentInfo.words && contentInfo.words.english}}</em>
                                </span>
                            </div>
                        </div>
                        <div class="content-right">
                            <div class="content-right-img">
                                <loadingImage :src="addPrefixHost(contentInfo.relate&&contentInfo.relate.image)"/>
                            </div>
                            <div class="content-right-sentence">
                                {{contentInfo.relate && contentInfo.relate.remark}}
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
                        <div class="content-left">
                            <span class="content-left-spell">wang</span>
                            <div class="content-left-word"></div>
                            <span class="content-left-spell">net</span>
                        </div>
                        <div class="content-right">
                            <div class="content-right-img"></div>
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

    export default {
        async fetch({isServer, redirect, store, params}){
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}){
            return {
                extendData: params.extendData
            }
        },
        data () {
            return {
                isReplace: true,
                imgToggle: "",
            }
        },
        methods: {
            hintToggle(e){
                if (this.isReplace) {
                    e.target.classList.add('hint-active');
                    this.isReplace = false;
                    this.imgToggle = this.contentInfo.wordImages.image_gif;
                } else {
                    this.isReplace = true;
                    e.target.classList.remove('hint-active');
                    this.imgToggle = this.contentInfo.wordImages.image;
                }
            },
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),

        },
        created () {
            this.imgToggle = this.contentInfo.wordImages && this.contentInfo.wordImages.image;
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
            })
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
                width: 8.1rem;
                height: 4.6rem;
                border-radius: 10px;
                text-align: center;
                background-position: center;
                background: url("~~assets/img/main_content/course/lv1-related-bg.png") 0 0 no-repeat;
                background-size: 100% 100%;

                .content-left {
                    float: left;
                }

                .content-right {
                    float: right;
                }

                .content-left, .content-right {
                    width: 4rem;
                    padding-top: 1rem;
                    box-sizing: border-box;
                    vertical-align: top;

                }

                .content-left-spell, .content-right-sentence {
                    border-top: 1px dashed black;
                    width: 80%;
                    margin: 0 auto;
                    padding-top: 20px;
                    font-size: 22px;

                    .parts-hint {
                        display: inline-block;
                        width: 68px;
                        height: 68px;
                        border-radius: 50%;
                        vertical-align: top;
                        margin-top: 7px;
                        cursor: pointer;
                        background: url("~~assets/img/main_content/course/lv1-hint.png") center no-repeat;
                        background-size: cover;
                        vertical-align: middle;
                    }

                    .hint-active {
                        background: url("~~assets/img/main_content/course/lv1-hint-active.png") center no-repeat;
                        background-size: cover;
                    }

                }
                .content-right-sentence {
                    padding-top: 25px;
                    text-align: left;
                }

                .content-left {
                    box-sizing: border-box;

                    .content-left-word {
                        width: 150px;
                        height: 150px;
                        border-radius: 10px;
                        border: 3px solid black;
                        margin: 0 auto;
                        margin-bottom: .4rem;
                        overflow: hidden;

                        img {
                            width: 100%;
                            height: 100%;
                        }

                    }

                    .spell {
                        display: inline-block;
                        vertical-align: middle;

                        em:nth-child(1) {
                            color: red;
                            margin-top: 0;
                        }

                        em {
                            display: block;
                            margin: 10px 0 10px 20px;
                        }

                    }
                }
                .content-right {

                    .content-right-img {
                        width: 150px;
                        height: 150px;
                        border-radius: 10px;
                        border: 3px solid black;
                        margin: 0 auto;
                        overflow: hidden;
                        margin-bottom: .4rem;
                        background: white;

                        img {
                            width: 100%;
                            height: 100%;
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
                width: 7.5rem;
                height: 4.7rem;
                border: 5px solid black;
                border-radius: 10px;
                margin: 0 auto;
                text-align: center;
                margin-top: 3%;

                .content-left, .content-right {
                    width: 3rem;
                    height: 4.7rem;
                    display: inline-block;
                    border: 1px solid black;
                    vertical-align: top;
                    padding-top: 120px;
                    box-sizing: border-box;
                }

                .content-left-spell {
                    margin: 0 auto;
                    font-size: 22px;
                }

                .content-left {
                    box-sizing: border-box;

                    .content-left-word {
                        width: 150px;
                        height: 150px;
                        border-radius: 10px;
                        border: 5px solid #53A600;
                        margin: 0 auto;
                        margin-top: 10px;
                        margin-bottom: 10px;
                    }

                }
                .content-right {
                    padding-top: 160px;

                    .content-right-img {
                        width: 150px;
                        height: 160px;
                        border-radius: 10px;
                        border: 2px dashed #53A600;
                        margin: 0 auto;
                        margin-bottom: .4rem;
                    }

                }
            }

        }
    }
</style>
