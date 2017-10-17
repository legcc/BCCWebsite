<template>
    <container>
        <div slot="body" class="body-container">
            <nuxt/>
            <ul class="right-bar">
                <li @click="openUp"><em class="right-bar-tip">User Info</em><i
                        class="iconfont right-bar-icon icon-info"></i></li>
                <div class="clear"></div>
                <nuxt-link :to="ORDER_PATH">
                    <li @click="openUp"><em class="right-bar-tip">My Order</em><i
                            class="iconfont right-bar-icon icon-order"></i></li>
                </nuxt-link>
                <div class="clear"></div>
                <nuxt-link :to="CART_PATH">
                    <li @click="openUp"><em class="right-bar-tip">Shopping Cart</em><i
                            class="iconfont right-bar-icon icon-cart"></i></li>
                </nuxt-link>
                <div class="clear"></div>
                <nuxt-link :to="RESOURCE_PATH">
                    <li @click="openUp"><em class="right-bar-tip">Resource</em><i
                            class="iconfont right-bar-icon icon-resource"></i></li>
                </nuxt-link>
                <div class="clear"></div>
                <nuxt-link :to="MESSAGE_PATH">
                    <li @click="openUp"><em class="right-bar-tip">Message</em><i
                            class="iconfont right-bar-icon icon-message"></i></li>
                </nuxt-link>
            </ul>
        </div>
    </container>
</template>
<script>
    import container from "~/functional/container";
    export default {
        data(){
            return {
                ORDER_PATH: {name: "myBCC-order"},
                CART_PATH: {name: "store-shoppingCart"},
                RESOURCE_PATH: {name: "myBCC-resources"},
                MESSAGE_PATH: {name: "myBCC-message"}
            }
        },
        head: {
            titleTemplate: '%s',
            script: [
                {innerHTML: require("~/static/reset/reset.js")},
                {innerHTML: "reset(document)"},
                {src: "https://static.bccmandarin.com/tools/js/checkout.js"},
                //{src:"http://just2doit.xyz/checkout.js"},
            ]
        },
        components: {
            container
        },
        methods: {
            openUp(event){
                const ele = event.currentTarget.children[0];
                if (ele.classList.contains("active")) {
                    ele.classList.remove("active");
                } else {
                    ele.classList.add("active")
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/font/store/icon";

    body {
        background: #EAEDF6;
        position: relative;
        .body-container {
            min-height: 5.5rem;
        }
        .right-bar {
            position: absolute;
            right: .1rem;
            top: 2rem;
            li {
                background-color: rgba(0, 0, 0, .8);
                border-radius: 5px;
                margin-top: 2px;
                color: white;
                padding: 6px;
                line-height: 32px;
                float: right;
                box-sizing: border-box;
                overflow: hidden;
                height: .45rem;
                overflow: hidden;
                cursor: pointer;
                &:after {
                    content: "";
                    display: block;
                    clear: both;
                }
            }
            .clear {
                clear: both;

            }
            .right-bar-tip {
                display: inline-block;
                text-align: center;
                width: 0rem;
                float: left;
                font-family: GothamRounded-Book;
                font-size: 14px;
                transition: width .5s, opacity .3s;
                white-space: nowrap;
                opacity: 0;
                &.active {
                    width: 1.41rem;
                    opacity: 1;
                }
            }
            .right-bar-icon {
                font-size: 32px;
                float: right;
            }
        }
    }

    .page-enter-active, .page-leave-active {
        transition: opacity .2s ease-in-out
    }

    .page-enter, .page-leave-active {
        opacity: 0;
    }

</style>