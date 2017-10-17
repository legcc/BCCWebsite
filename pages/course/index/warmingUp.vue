<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="left-picture">
                            <loadingImage :src="addPrefixHost(contentInfo.images&&contentInfo.images[0].image)"/>
                        </div>
                        <div class="content">
                            <ul class="sentence">
                                <li v-for="item in contentInfo.sentences">
                                    <p :style="{'display':pinyinSwitch ? 'block':'none'}" class="en">{{item.pinyin||''}}</p>
                                    <span class="cn">{{item.chinese}}</span>
                                    <span class="en">{{item.english}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="right-picture">
                            <loadingImage :src="addPrefixHost(contentInfo.images&&contentInfo.images[1].image)"/>
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
                templateStyle: state => state.templateStyle,
                pinyinSwitch: state => state.pinyinSwitch,
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

            .left-picture {
                display: inline-block;
                vertical-align: bottom;
                width: 2rem;
                height: 2.4rem;

                img {
                    width: auto;
                    height: 100%;
                }

            }
            .right-picture {
                display: inline-block;
                vertical-align: bottom;
                width: 2rem;
                height: 2.4rem;

                img {
                    width: 100%;
                    height: 100%;
                }

            }
            .content {
                display: inline-block;
                vertical-align: bottom;
                text-align: left;
                font-weight: 800;
                font-size: 22px;
                margin: 0 .5rem;
            }

            .sentence {

                li {
                    position: relative;
                    margin: .3rem 0 0 0;

                    span {
                        display: block;

                    }

                    span:nth-child(1) {
                        font-size: 18px;
                    }

                }
                li:nth-child(odd) {
                    padding: .05rem .1rem;
                    border: 1px solid black;
                    background: rgb(255, 122, 111);

                    &:before {
                        content: "";
                        position: absolute;
                        height: 0;
                        width: 0;
                        border-color: transparent;
                        border-style: solid;
                        border-width: .08rem;
                        border-right-color: #ff7a6f;
                        /* margin-top: -2px; */
                        /* margin-left: -3px; */
                        top: 35%;
                        left: -.16rem;
                        z-index: 2;
                    }

                    &:after {
                        content: "";
                        position: absolute;
                        height: 0;
                        width: 0;
                        border-color: transparent;
                        border-style: solid;
                        border-width: .08rem;
                        border-right-color: black;
                        top: 35%;
                        left: -.17rem;
                        z-index: 1;
                    }

                }
                li:nth-child(even) {
                    padding: .05rem .1rem;
                    border: 1px solid black;
                    background: rgb(134, 86, 247);

                    &:before {
                        content: "";
                        position: absolute;
                        height: 0;
                        width: 0;
                        border-color: transparent;
                        border-style: solid;
                        border-width: .08rem;
                        border-left-color: rgb(134, 86, 247);
                        /* margin-top: -2px; */
                        /* margin-left: -3px; */
                        top: 35%;
                        right: -.16rem;
                        z-index: 2;
                    }

                    &:after {
                        content: "";
                        position: absolute;
                        height: 0;
                        width: 0;
                        border-color: transparent;
                        border-style: solid;
                        border-width: .08rem;
                        border-left-color: black;
                        top: 35%;
                        right: -.17rem;
                        z-index: 1;
                    }

                }
            }
        }

    }

</style>
