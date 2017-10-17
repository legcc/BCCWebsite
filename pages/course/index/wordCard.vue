<template>
    <div>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div>
                            <dl class="item">
                                <dt><img src=""/></dt>
                                <dd>
                                    <ul>
                                        <li>Herbal medicine</li>
                                        <li>中草药</li>
                                        <li>zhong cao yao</li>
                                    </ul>
                                </dd>
                            </dl>
                            <dl class="item">
                                <dt><img src=""/></dt>
                                <dd>
                                    <ul>
                                        <li>Herbal medicine</li>
                                        <li>中草药</li>
                                        <li>zhong cao yao</li>
                                    </ul>
                                </dd>
                            </dl>
                        </div>
                        <div>
                            <dl class="item">
                                <dt><img src=""/></dt>
                                <dd>
                                    <ul>
                                        <li>Herbal medicine</li>
                                        <li>中草药</li>
                                        <li>zhong cao yao</li>
                                    </ul>
                                </dd>
                            </dl>
                            <dl class="item">
                                <dt><img src=""/></dt>
                                <dd>
                                    <ul>
                                        <li>Herbal medicine</li>
                                        <li>中草药</li>
                                        <li>zhong cao yao</li>
                                    </ul>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
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

            .item {
                margin: 15px;
                display: inline-block;

                dt {
                    display: inline-block;
                    width: 240px;
                    height: 165px;
                    border: 5px solid black;
                    vertical-align: middle;

                    img {
                        width: 100%;
                        height: 100%;
                    }

                }
                dd {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 10px;
                    font-size: 18px;
                }

            }
        }

    }

</style>
