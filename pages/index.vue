<template>
    <div class="home-main">
        <div class="banner">
            <div class="b-jionus">
                <!--
                <h1 class="b-title">Just Enjoy Mandarin!</h1>
                <p class="b-tx">
                    Study Smarter, Keep Pace, Take Control of Your Learning with BCC Mandarin End to End Learning Platform!</p>
                <nuxt-link tag="button" :to="FREE_TRIAL_PATH" class="b-start">Free trial</nuxt-link>
                -->
            </div>
        </div>
        <div class="content">
            <!--
            <div class="b-intro io-t">
                <div class="tb">
                    <h2>BCC Mandarin Learning Platform</h2>
                    <p>BCC Mandarin for Educator delivers engaging content developed by industry professionals, while
                        giving managers admin tools that help them effectively monitor their team's learning.</p>
                </div>
            </div>
            -->
            <div class="b-intro io-c">
                <div class="tb">
                    <div class="io-img io-1"></div>
                    <div>
                        <h2>For Learner</h2>
                        <ul>
                            <li>Self Sufficient</li>
                            <li>Academic Quality</li>
                            <li>Carefully Designed Progression</li>
                            <li>Great Fun - 60+ types of practices/games</li>
                            <li>100+ Chinese Cultural Topics</li>
                        </ul>
                        <a href="https://static.bccmandarin.com/base/video/learner-demo.mp4" target="_blank">
                            <button type="button" class="learn-more">Learn more</button>
                        </a>
                    </div>
                </div>
            </div>
            <div class="b-intro io-c">
                <div class="tb">
                    <div>
                        <h2>For Educator</h2>
                        <ul>
                            <li>Save 80% lesson preparation time</li>
                            <li>Automated homework marking</li>
                            <li>Realtime Performance Tracking</li>
                            <li>Enhanced 4-Skill Practices</li>
                            <li>Better Engagement with Students</li>
                        </ul>
                        <a href="https://static.bccmandarin.com/base/video/educator-demo.mp4" target="_blank">
                            <button type="button" class="learn-more">Learn more</button>
                        </a>
                    </div>
                    <div class="io-img io-2"></div>
                </div>
            </div>
            <div class="b-intro io-c">
                <div class="tb">
                    <div class="io-img io-1"></div>
                    <div>
                        <h2>Course Outline</h2>
                        <ul>
                            <li>Aligned to new GCSE specification</li>
                            <li>Covered all GCSE themes and topics</li>
                            <li>140+ detailed explained grammar points</li>
                            <li>Offered Study tips and cultural insights</li>
                            <li>Equivalent to HSK 1-3</li>
                        </ul>
                        <a href="https://static.bccmandarin.com/tools/Course_Outline.pdf" target="_blank">
                            <button type="button" class="learn-more">View Detail</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    export default {
        data () {
            const state = this.$store.state;
            let path = "";
            if (state.authUser) {
                if (+state.authUser.customerType === 1) {
                    path = "learner"
                } else if (+state.authUser.customerType === 2) {
                    path = "educator"
                } else {
                    path = "home-login"
                }
            } else {
                path = "home-login"
            }
            return {
                FREE_TRIAL_PATH: path
            }
        },
        methods: {},
        created () {

        },
        computed: {}
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/home/index";
</style>
