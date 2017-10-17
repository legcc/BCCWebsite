<template>
    <div class="footer">
        <div class="footer-p">
            <div class="left-div">
                <nuxt-link :to="TERMS" target="_blank">Terms of Use</nuxt-link>
                |
                <nuxt-link :to="CONTACT" target="_blank">Contact Us</nuxt-link>
            </div>
            <div class="right-div">
                <div class="left-div">
                    Feedback and Follow Us:
                </div>
                <div class="right-div" title="Please give us your feedback on here.">
                    <a class="facebook-bd" href="https://www.facebook.com/BCCMandarin" target="_blank"></a>
                </div>
            </div>
            </br>
            <div class="left-div">
                Copyright © 2016 - 2017 BCC Mandarin Ltd. All rights reserved.
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                TERMS: {name: 'terms'},
                CONTACT: {name: 'contact'}
            }
        },
        methods: {},
        created () {

        },
        computed: {}
    }
</script>

<style lang="less" scoped>
    @import "~~assets/less/home/nav_footer";
</style>
