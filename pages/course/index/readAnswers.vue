<template>
    <div>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="picture">
                            <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                        </div>
                        <div class="content">
                            <ul class="text">
                                <li v-for="item in contentInfo.questions">
                                    <p>{{item.question}}</p>
                                    <ul class="option">
                                        <li v-for="list in item.answer">
                                            <loadingImage :src="addPrefixHost(list.image)"/>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
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
    .style-3 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
                max-width: 800px;
            }

            .picture {
                margin: 0 20px 0 0;
                display: inline-block;
                vertical-align: middle;

                img {
                    max-width: 2.2rem;
                    max-height: 2.5rem;
                }

            }
            .content {
                display: inline-block;
                vertical-align: middle;
                font-size: 20px;

                .text {
                    text-align: left;
                }

                .option {
                    text-align: center;
                    margin-top: 10px;
                    li {
                        border-radius: 5px;
                        cursor: pointer;
                        display: inline-block;
                        vertical-align: middle;
                        margin: 0 40px;

                        img {
                            max-width: 1rem;
                            max-height: 1rem;
                        }
                        &:hover {
                            background: chocolate;
                        }

                    }
                }
            }

        }
    }

</style>
