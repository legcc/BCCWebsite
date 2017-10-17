<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <h1>{{contentInfo.sentence}}</h1>
                        <div class="interim-backdrop">
                            <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <h1>{{contentInfo.sentence}}</h1>
                        <div class="picture" v-for="item in contentInfo.image">
                            <loadingImage :src="addPrefixHost(item)"/>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition>
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <h1>{{contentInfo.sentence}}</h1>
                        <div class="content-picture">
                            <div v-for="item in contentInfo.image">
                                <loadingImage :src="addPrefixHost(item)"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition>
            <div class="style-4" v-if="templateStyle ==='style-4'">
                <div class="course_common_box">
                    <div class="course-content">
                        <h1>{{contentInfo.sentence}}</h1>
                        <div class="content-main">
                            <div v-for="item in contentInfo.image">
                                <loadingImage :src="addPrefixHost(item)"/>
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
    export default {
        async fetch({isServer, redirect, store, params}){
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}){
            return {extendData: params.extendData}
        }, data () {
            return {}
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
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
                width: 8rem;
                display: inline-block;
                h1 {
                    text-align: center;
                    color: black;
                    font-size: 20px;
                    font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal', 'Showcard Gothic';
                }

                .interim-backdrop {

                    img {
                        border-radius: 0.1rem;
                        margin-top: .1rem;
                        /* width: 100%; */
                        /* height: 100%; */
                        max-width: 6rem;
                        max-height: 4rem;
                    }

                }
            }

        }
    }

    .style-2 {

        .course_common_box {
            text-align: center;

            .course-content {
                width: 750px;
                display: inline-block;

                h1 {
                    text-align: center;
                    color: black;
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 20px;
                }
                .picture {
                    img {
                        max-width: 700px;
                        max-height: 300px;
                    }
                }
            }

        }
    }

    .style-3 {

        .course_common_box {
            text-align: center;
            .course-content {
                width: 750px;
                display: inline-block;
                h1 {
                    text-align: center;
                    color: black;
                    font-size: 20px;
                    margin-bottom: 20px;
                }
                .content-picture {
                    text-align: center;
                    img {
                        max-width: 7rem;
                        max-height: 3.1rem;
                    }
                }

            }

        }
    }

    .style-4 {

        .course_common_box {
            text-align: center;

            .course-content {
                width: 750px;
                display: inline-block;

                h1 {
                    text-align: center;
                    color: black;
                    font-size: 20px;
                    margin-bottom: 20px;
                }

                .content-main {
                    img {
                        max-width: 700px;
                        max-height: 210px;
                    }
                }
            }

        }
    }

</style>
