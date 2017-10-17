<template>
    <div class="entries-container">
        <div class="topBanner-container">
            <div class="background-container">
            </div>
        </div>
        <article class="content-container">
            <section class="production-section-top">
                <h2 class="production-title">Learner Solution</h2>
                <ul class="production-ul">
                    <li class="production-list" v-for="(info,index) in learnerProductList">
                        <nuxt-link :to="{name:'store-productDetail',query:{itemId:info.id}}">
                            <div>
                                <div :class="learnerTopStyle(info)">
                                    <img :src="learnerImgStyle(info)" alt="" class="bear-head">
                                    <h2 class="top-container-title">{{info.item_name}}</h2>
                                    <em class="card-description">{{info.type}}</em>
                                </div>
                                <article class="card-content">
                                    <ul>
                                        <template v-if="info.item_name === 'Learner Annual Subscription'">
                                            <li>Levels: 1 - 4</li>
                                        </template>
                                        <template v-else>
                                            <li v-if="info.topics>0">Topics: {{info.topics}}</li>
                                        </template>
                                        <li v-if="info.vocabularies>0">Key Vocabularies: {{info.vocabularies}}</li>
                                        <li v-if="info.sentence_patterns>0">Sentence Patterns: {{info.sentence_patterns}}</li>
                                    </ul>
                                    <aside class="card-aside">
                                        <div v-if="info.is_quantity_price==1">
                                            <p v-for="price_info in info.item_price">
                                                <em class="valid-period">
                                                    {{price_info.period_num}} {{price_info.period_type}}
                                                </em>
                                                <strong class="current-price">
                                                    <template v-if="info.item_name === 'Level 1'">
                                                        ￡{{price_info.item_price}}
                                                    </template>
                                                    <template v-else>
                                                        ￡XXXX
                                                    </template>
                                                </strong>
                                            </p>
                                        </div>
                                        <div v-else>
                                            <div class="div-left">
                                                <em class="valid-period">
                                                    {{info.period_num}}
                                                    {{info.period_type}}
                                                </em>
                                                <template v-if="info.original_price != info.item_price">
                                                    <em class="original-price">
                                                        <template v-if="info.item_name === 'Level 1'">
                                                            ￡{{info.original_price}}
                                                        </template>
                                                        <template v-else>
                                                            ￡XXXX
                                                        </template>
                                                    </em>
                                                </template>
                                            </div>
                                            <strong class="current-price">
                                                <template v-if="info.item_name === 'Level 1'">
                                                    ￡{{info.item_price}}
                                                </template>
                                                <template v-else>
                                                    ￡XXXX
                                                </template>
                                            </strong>
                                        </div>
                                    </aside>
                                </article>
                            </div>
                        </nuxt-link>
                        <template v-if="info.item_name != 'Level 1'">
                            <div class="level-info-shade-lock" title="Product will be available soon."></div>
                        </template>
                    </li>
                </ul>
            </section>
            <section class="production-section-not-top">
                <h2 class="production-title">Educator Solution</h2>
                <ul class="production-ul">
                    <li class="production-list" v-for="(info,index) in educatorProductList">
                        <nuxt-link :to="{name:'store-productDetail',query:{itemId:info.id}}">
                            <div>
                                <div :class="educatorTopStyle(info)">
                                    <img :src="educatorImgStyle(info)" alt="" class="bear-head">
                                    <h2 class="top-container-title">{{info.item_name}}</h2>
                                    <template v-if="info.item_name === 'Annual Subscription'">
                                        <em class="card-description">Interactive ppt</em>
                                        <em class="card-description">homework marking</em>
                                        <em class="card-description">Performance Tracking</em>
                                    </template>
                                    <template v-else>
                                        <em class="card-description">{{info.type}}</em>
                                    </template>
                                </div>
                                <article class="card-content">
                                    <ul>
                                        <template v-if="info.item_name === 'Annual Subscription'">
                                            <li>Levels: 1 - 4</li>
                                        </template>
                                        <template v-else>
                                            <li v-if="info.topics>0">Topics: {{info.topics}}</li>
                                        </template>
                                        <li v-if="info.vocabularies>0">Key Vocabularies: {{info.vocabularies}}</li>
                                        <li v-if="info.sentence_patterns>0">Sentence Patterns: {{info.sentence_patterns}}</li>
                                        <template v-if="info.item_name === 'Add Students'">
                                            <li v-if="info.short_desc">{{info.short_desc}}</li>
                                        </template>
                                    </ul>
                                    <aside class="card-aside">
                                        <div v-if="info.is_quantity_price==1
                                            && info.item_name ==='Level 1'">
                                            <p v-for="price_info in info.item_price">
                                                <em class="valid-period">
                                                    {{price_info.period_num}}
                                                    {{price_info.period_type}}
                                                </em>
                                                <strong class="current-price">
                                                    <template v-if="info.item_name === 'Level 1'">
                                                        ￡XXXX<!--{{price_info.item_price}}-->
                                                    </template>
                                                    <template v-else>
                                                        ￡XXXX
                                                    </template>
                                                </strong>
                                            </p>
                                        </div>
                                        <div v-if="info.is_quantity_price==1
                                            && info.item_name === 'Add Students'">
                                            <em class="valid-period">
                                                {{info.default_num}}
                                                {{info.period_type}}
                                            </em>
                                            <strong class="current-price">
                                                ￡XXXX<!--{{info.item_price}}-->
                                            </strong>
                                        </div>
                                        <div v-else>
                                            <div class="div-left">
                                                <em class="valid-period">
                                                    {{info.period_num}}
                                                    {{info.period_type}}
                                                </em>
                                                <template v-if="info.original_price != info.item_price">
                                                    <em class="original-price">
                                                        <template v-if="info.item_name === 'Level 1'">
                                                            ￡XXXX<!--{{info.original_price}}-->
                                                        </template>
                                                        <template v-else>
                                                            ￡XXXX
                                                        </template>
                                                    </em>
                                                </template>
                                            </div>
                                            <strong class="current-price">
                                                <template v-if="info.item_name === 'Level 1'">
                                                    ￡XXXX<!--{{info.item_price}}-->
                                                </template>
                                                <template v-else>
                                                    ￡XXXX
                                                </template>
                                            </strong>
                                        </div>
                                    </aside>
                                </article>
                            </div>
                        </nuxt-link>
                        <template v-if="info.item_name != 'Level 1'">
                            <div class="level-info-shade-lock" title="Product will be available soon."></div>
                        </template>
                    </li>
                </ul>
            </section>
        </article>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex';
    const backEndImgPath = require('~/static/server.config.js').backEndImgPath;
    export default {
        async fetch({store, redirect}){
            try {
                await store.dispatch("index/store/store/getProductList");
            } catch (e) {
                redirect("/");
            }
        },
        data () {
            return {
                backEndImgPath,
                count: 1
            }
        },
        methods: {
            learnerTopStyle: function(info) {
                if(info.item_name === 'Learner Annual Subscription') {
                    return 'production-top-container stu0';
                } else if(info.item_name === 'Level 1') {
                    return 'production-top-container stu1';
                } else if(info.item_name === 'Level 2') {
                    return 'production-top-container stu2';
                } else if(info.item_name === 'Level 3') {
                    return 'production-top-container stu3';
                } else if(info.item_name === 'Level 4') {
                    return 'production-top-container stu4';
                }
            },
            learnerImgStyle: function(info) {
                if(info.item_name === 'Learner Annual Subscription') {
                    return this.backEndImgPath + '/item/item-learner.png';
                } else if(info.item_name === 'Level 1') {
                    return this.backEndImgPath + '/item/item-level1.svg';
                } else if(info.item_name === 'Level 2') {
                    return this.backEndImgPath + '/item/item-level2.svg';
                } else if(info.item_name === 'Level 3') {
                    return this.backEndImgPath + '/item/item-level3.svg';
                } else if(info.item_name === 'Level 4') {
                    return this.backEndImgPath + '/item/item-level4.svg';
                }
            },
            educatorTopStyle: function(info) {
                if(info.item_name === 'Annual Subscription') {
                    return 'production-top-container edu1';
                } else if(info.item_name == 'Add Students') {
                    return 'production-top-container edu2';
                } else if(info.item_name === 'Level 1') {
                    return 'production-top-container stu1';
                } else if(info.item_name === 'Level 2') {
                    return 'production-top-container stu2';
                } else if(info.item_name === 'Level 3') {
                    return 'production-top-container stu3';
                } else if(info.item_name === 'Level 4') {
                    return 'production-top-container stu4';
                }
            },
            educatorImgStyle: function(info) {
                if(info.item_name === 'Annual Subscription') {
                    return this.backEndImgPath + '/item/item-educator.png';
                } else if(info.item_name == 'Add Students') {
                    return this.backEndImgPath + '/item/item-studentNum.png';
                } else if(info.item_name === 'Level 1') {
                    return this.backEndImgPath + '/item/item-level1.svg';
                } else if(info.item_name === 'Level 2') {
                    return this.backEndImgPath + '/item/item-level2.svg';
                } else if(info.item_name === 'Level 3') {
                    return this.backEndImgPath + '/item/item-level3.svg';
                } else if(info.item_name === 'Level 4') {
                    return this.backEndImgPath + '/item/item-level4.svg';
                }
            },
            educatorVideoControl: function () {
                if (this.$refs.educatorVideo.paused) {
                    this.$refs.educatorVideo.play();
                } else {

                    this.$refs.educatorVideo.pause();
                }
            },
            learnerVideoControl: function () {
                if (this.$refs.learnerVideo.paused) {
                    this.$refs.learnerVideo.play();
                } else {
                    this.$refs.learnerVideo.pause();
                }
            }
        },
        created () {
        },
        computed: {
            ...mapState("index/store/store", {
                educatorProductList: state => state.educatorProductList,
                learnerProductList: state => state.learnerProductList
            })
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/store/store";
</style>