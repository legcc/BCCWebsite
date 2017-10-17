<template>
    <div>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="picture">
                            <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                        </div>
                        <div class="sentence">
                            <ul class="sentence-option">
                                <li v-for="item in contentInfo.questions"
                                    v-html="item.replace(/\[.+[\]、]/g,`<div class='l3-gap'></div>`)"
                                >
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
        async fetch({store, params, isServer, redirect}){
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
            loadingImage,
        }
    }
</script>
<style lang="less">
    .l3-gap {
        display: inline-block;
        min-width: 140px;
        height: 50px;
        line-height: 50px;
        background: #681515;
        border-left: 2px solid #901D1C;
        border-bottom: 2px solid #901D1C;
        box-shadow: -3px 5px 20px black inset;
        box-sizing: border-box;
        color: white;
        vertical-align: middle;
        cursor: pointer;
        font-size: 20px;
        padding: 0 .02rem;
        margin: 10px 0;

    }
</style>
<style lang="less" scoped>

    .style-3 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
            }

            .picture, .sentence {
                display: inline-block;
                vertical-align: middle;

            }
            .sentence {
                font-size: 20px;
                text-align: left;
                max-width: 5.5rem;
            }
            .picture {
                margin-right: 20px;
                img {
                    max-width: 2.5rem;
                    max-height: 2.7rem;
                }
            }

        }

    }
</style>
