<template>
    <div class="main">
        <div class="topBanner"></div>
        <div class="content">
            <ul class="tab-title clearfloat">
                <li>
                    <nuxt-link :to="TERMS">Terms of Use</nuxt-link>
                </li>
                <li class="selected">
                    <nuxt-link :to="CONTACT">Contact Us</nuxt-link>
                </li>
            </ul>
            <div class="tab-content">
                <div class="article_content">
                    <h3>BCC Mandarin Ltd.</h3>
                    <h3>Contact Us</h3>

                    <p>Whether you're looking for answers about buying a product, technical support, frequently asked
                        questions or just learning more about BCC Mandarin, getting in touch is just a click away</p>

                    <p>1.1For Technical support, frequently ased questions, payment, return and exchange</p>

                    <p>Check out our FAQs or contact us directly by sending email to customer_support@bccmandarin.com</p>

                    <p>1.2More information about BCC prodcuts, purchasing, cooperations</p>

                    <p>Contact us directly by sending email to info@bccmandarin.com</p>

                    <p>When contact us directly, please include below information in your email</p>
                    <ul class="articleUl">
                        <li>Your name</li>
                        <li>Telephone number</li>
                        <li>Your Query or comments</li>
                        <li>Any necessary evidence of your query</li>
                    </ul>

                    <p class="pBottom">Last Revised: Apr 20, 2017</p>
                </div>
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
    .main {
        width: 100%;
    }

    .clearfloat:after {
        display: block;
        clear: both;
        content: "";
        visibility: hidden;
        height: 0;
    }

    .clearfloat {
        zoom: 1;
    }

    .content {
        width: 100%;
        background: white;
        font-family: GothamRounded-Medium;
        padding-bottom: .4rem;
    }

    .topBanner {
        width: 100%;
        height: 200px;
        overflow: hidden;
        background-size: 100% 100%;
        background: url(~~assets/img/home/content-banner.jpg) top center no-repeat;
    }

    .tab-title {
        width: 914px;
        height: auto;
        margin: 0 auto;
        padding-top: 10px;
        border-bottom: 1px solid #C7C7C7;
    }

    .tab-title li {
        color: #333333;
        width: 120px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        font-size: 16px;
        float: left;
        border-bottom: 2px solid #FFF;
        a {
            color: #333333;
        }
    }

    .tab-title li.selected {
        color: #8296c7;
        border-color: #8296C7;
        a {
            color: #8296c7;
        }
    }

    .tab-content {
        width: 914px;
        height: auto;
        margin: 0 auto;
    }

    .tab-content > div {
        padding-top: 20px;
    }

    .tab-content h5 {
        font-size: 18px;
        color: #333;
        line-height: 32px;
    }

    .tab-content p {
        font-size: 14px;
        color: #666;
        line-height: 22px;
        margin-bottom: 10px;
    }

    .tab-content .pBlue {
        font-size: 14px;
        color: #8296c7;
    }

    .tab-content h3 {
        font-size: 18px;
        color: #333;
        line-height: 36px;
    }

    .tab-content h3:first-child {
        line-height: 26px;
    }

    .articleUl li {
        font-size: 14px;
        color: #8296C7;
        line-height: 22px;
    }

    .tab-content .pBottom {
        font-size: 18px;
        color: #666;
        line-height: 46px;
        margin-bottom: 24px;
    }
</style>
