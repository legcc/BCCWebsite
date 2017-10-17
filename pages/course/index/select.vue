<template>
    <div>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left">
                            <div class="content-picture">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                        </div>
                        <div class="content-right">
                            <p class="topic">
                                <span>zhege nanren mei ganmao.</span>
                                <span>这个男人没感冒。</span>
                            </p>
                            <div class="option">
                                <div class="btn-true">T</div>
                                <div class="btn-false">F</div>
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
    .style-3 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
            }
            .content-left, .content-right {
                display: inline-block;
                vertical-align: middle;
                margin: 0 30px;
            }
            .content-picture {
                width: 3.2rem;
                height: 2.2rem;
                background: url("~~assets/img/main_content/course/l3-picture-frame.png") center center no-repeat;
                background-size: 100% 100%;
                vertical-align: middle;
                img {
                    width: 2.7rem;
                    height: 1.75rem;
                    margin: 0.22rem 0 0 0.07rem;
                }
            }
            .topic {
                font-size: 25px;
                span {
                    display: block;
                    margin: .1rem 0;
                }
            }
            .option {
                margin-top: .8rem;
            }
            .btn-true, .btn-false {
                display: inline-block;
                vertical-align: top;
                width: .6rem;
                height: .6rem;
                line-height: .6rem;
                color: white;
                font-size: 30px;
                background: rgb(129, 30, 29);
                border-radius: 15px;
                box-shadow: -3px -3px 0px 0px #591113 inset;
                margin: .3rem;
                cursor: pointer;
            }
        }

    }

</style>
