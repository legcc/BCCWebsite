<template>
    <div>
        <transition name="fade">
            <div class="style-1">
                <div class="course_common_box">
                    <div class="course-content">
                        <p class="content-title" v-if="contentInfo.title&&contentInfo.title.length">
                            {{contentInfo ? contentInfo.title : ""}}</p>
                        <p v-for="item in contentInfo.sentences" class="sentence">{{item}}</p>
                        <div class="content-picture">
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
    import {mapState, mapGetters, mapActions} from 'vuex';
    import loadingImage from '~/components/loadingImage';
    import R from 'ramda';
    import Vue from 'vue';

    export default {
        async fetch({isServer, redirect, store, params}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {
                isUpdate: false,
            }
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            init() {
                this.$nextTick(_ => {
                })
            }
        },
        created() {
        },
        watch: {
            contentInfo() {
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {};
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600);
                this.init();
            }
        },
        computed: {
            contentInfo() {
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {},
                contentType: state => state.contentInfo
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

            .course-content {
                text-align: center;
                width: 800px;

                .inside {
                    display: inline-block;

                    p {
                        text-align: left;
                    }

                }
                .sentence{
                    font-size: 24px;
                }
                .content-title {
                    font-size: 18px;
                    margin-bottom: 5px;
                    color: #E8651B;
                }

                .content-picture {
                    display: inline-block;
                    overflow: hidden;
                    margin-top: 0.05rem;
                    background: cadetblue;
                    border-radius: 10px;
                    img {
                        max-width: 7rem;
                        max-height: 4rem;
                        margin: 0 auto;
                    }

                }
            }

        }

    }

</style>
