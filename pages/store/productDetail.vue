<template>
    <div class="container">
        <ul class="container-nav">
            <nuxt-link :to="{name:'index'}" tag="li">
                Home
            </nuxt-link>
            <nuxt-link :to="{name:'store'}" tag="li">
                Store
            </nuxt-link>
            <li class="active"> Production Detail</li>
        </ul>
        <div class="product-container">
            <article class="product-content">
                <template v-if="detailData.item_name === 'Annual Subscription' && detailData.allow_customer_type==2">
                    <div class="product-detail-wrap edu1">
                        <img :src="detailData.item_image" alt="" class="product-detail-img">
                        <h2 class="product-detail-title">{{detailData.item_name}}</h2>
                    </div>
                </template>
                <template v-if="detailData.item_name === 'Add Students' && detailData.allow_customer_type==2">
                    <div class="product-detail-wrap edu2">
                        <img :src="detailData.item_image" alt="" class="product-detail-img">
                        <h2 class="product-detail-title">{{detailData.item_name}}</h2>
                    </div>
                </template>
                <template v-if="detailData.item_name === 'Annual Subscription' && detailData.allow_customer_type==1">
                    <div class="product-detail-wrap stu0">
                        <img :src="detailData.item_image" alt="" class="product-detail-img">
                        <h2 class="product-detail-title">{{detailData.item_name}}</h2>
                    </div>
                </template>
                <template v-if="detailData.item_name === 'Level 1'">
                    <div class="product-detail-wrap stu1">
                        <img :src="detailData.item_image" alt="" class="product-detail-img">
                        <h2 class="product-detail-title">{{detailData.item_name}}</h2>
                    </div>
                </template>
                <template v-if="detailData.item_name === 'Level 2'">
                    <div class="product-detail-wrap stu2">
                        <img :src="detailData.item_image" alt="" class="product-detail-img">
                        <h2 class="product-detail-title">{{detailData.item_name}}</h2>
                    </div>
                </template>
                <template v-if="detailData.item_name === 'Level 3'">
                    <div class="product-detail-wrap stu3">
                        <img :src="detailData.item_image" alt="" class="product-detail-img">
                        <h2 class="product-detail-title">{{detailData.item_name}}</h2>
                    </div>
                </template>
                <template v-if="detailData.item_name === 'Level 4'">
                    <div class="product-detail-wrap stu4">
                        <img :src="detailData.item_image" alt="" class="product-detail-img">
                        <h2 class="product-detail-title">{{detailData.item_name}}</h2>
                    </div>
                </template>
                <div class="product-form" v-loading.body="loading">
                    <h1 v-if="detailData.allow_customer_type==2" class="product-form-title">
                        <template v-if="detailData.type_id==2">
                            Add more students
                        </template>
                        <template v-else>
                            Eudcator Online Subscription
                        </template>
                    </h1>
                    <h1 v-else class="product-form-title">Learner Online Subscription</h1>
                    <ul class="cont">
                        <template v-if="detailData.item_name === 'Level 1' && detailData.allow_customer_type==2">
                            <li><em>If you want to add more students to your existing subscription, please contact us by submitting your details below.</em></li>
                        </template>
                        <li v-if="detailData.topics>0 || detailData.vocabularies>0 || detailData.sentence_patterns>0">
                            <em class="series-item">Topics: {{detailData.topics}}</em>
                            <em class="series-item">Vocabularies: {{detailData.vocabularies}}</em>
                            <em class="series-item">Sentence Patterns: {{detailData.sentence_patterns}}</em>
                        </li>
                        <li v-if="detailData.short_desc"><em>{{detailData.short_desc}}</em></li>
                        <li v-if="detailData.type_id==1">
                            <el-row v-if="detailData.is_quantity_price==1">
                                <el-col :span="10">Periods of Use:</el-col>
                                <el-col :span="10" :offset="-4">
                                    <div v-for="(info,index) in price_list" class="price_list" v-bind:class="isActived===index&&'actived'"  @click="activedClick(index)">
                                    {{info.period_num}} {{detailData.period_type}}
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row v-else>
                                <el-col :span="10">Periods of Use:</el-col>
                                <el-col :span="10" :offset="-4">
                                    {{detailData.period_num}} {{detailData.period_type}}
                                </el-col>
                            </el-row>
                        </li>
                        <li v-if="detailData.allow_customer_type==2">
                            <el-row>
                                <el-col :span="5">Name:</el-col>
                                <el-col :span="10" :offset="-4">
                                    <p>
                                        <el-input v-model="purchaser.name"
                                        placeholder="Please enter name"
                                        class="customer-component"
                                        type="text"></el-input>
                                    </p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="5">Phone:</el-col>
                                <el-col :span="10" :offset="-4">
                                    <p>
                                        <el-input v-model="purchaser.phone"
                                        placeholder="Please enter phone"
                                        class="customer-component"
                                        type="text"></el-input>
                                    </p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="5">Email:</el-col>
                                <el-col :span="10" :offset="-4">
                                    <p>
                                        <el-input v-model="purchaser.email"
                                        placeholder="Please enter email"
                                        class="customer-component"
                                        type="text"></el-input>
                                    </p>
                                </el-col>
                            </el-row>
                            <!--<el-row  v-if="detailData.type_id==2">
                                <el-col :span="10">NO of Students:</el-col>
                                <el-col :span="10" :offset="-4">
                                    <el-input-number size="small" class="number-tool" :min="1" :max="500"
                                                     v-model="count"
                                                     @change="(val)=>handleNumChange(detailData.id,val)">
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row v-else>
                                <el-col :span="10">NO of Students:</el-col>
                                <el-col :span="10" :offset="-4">
                                    <p>
                                        <el-input-number size="small" class="number-tool" :min="0" :max="500"
                                                         v-model="count"
                                                         @change="(val)=>handleNumChange(3,val)">
                                        </el-input-number>
                                    </p>
                                </el-col>
                            </el-row>-->
                        </li>
                        <!--<li v-if="detailData.allow_customer_type==2 && detailData.type_id==1">
                            <em>Total Price:</em>
                            <strong class="current-price">￡
                            {{parseFloat((Math.floor(detailData.item_price*100)+Math.floor(total_item_price*100))/100).toFixed(2)}}</strong>
                            <em class="original-price">￡
                            {{parseFloat((Math.floor(detailData.original_price*100)+Math.floor(total_original_price*100))/100).toFixed(2)}}</em>
                        </li>
                        <li v-else-if="detailData.type_id==2">
                            <em>Total Price:</em>
                            <strong class="current-price">￡
                            {{total_item_price}}</strong>
                            <em class="original-price">￡
                            {{total_original_price}}</em>
                        </li>-->
                        <li v-if="detailData.allow_customer_type==1">
                            <em>Total Price:</em>
                            <strong class="current-price">￡
                            {{detailData.item_price}}</strong>
                            <em class="original-price">￡
                            {{detailData.original_price}}</em>
                        </li>
                    </ul>
                    <aside v-if="detailData.allow_customer_type==1">
                        <el-button type="warning" @click="addToCart(1)" :disabled="isBuy">BUY NOW</el-button>
                        <el-button type="primary" @click="addToCart(0)" :disabled="isBuy">ADD TO BASKET</el-button>
                    </aside>
                    <aside v-if="detailData.allow_customer_type==2">
                        <el-button type="primary"  :disabled="submitPrevent" 
                            @click="submitPrevent || submitConsult()">Submit</el-button>
                    </aside>
                </div>
            </article>
            <tabs :labels="labels" :defaultActive="defaultActive">
                <article slot="Production Detail" class="production-detail">
                    <section v-html="detailData.detail_text"></section>
                    <section></section>
                </article>
                <!--
                <article slot="User Comments" class="user-comments">
                    <aside class="alert">All Comments</aside>
                    <ul v-if="commentData.length>0">
                        <li class="user-comments-list" v-for="(info,index) in commentData">
                            <header class="user-info">
                                <i>
                                    <img :src="info.small_head_image" alt="">
                                </i>
                                <strong class="user-name">{{info.user_name}}</strong>
                                <i v-for="n in info.score" class="iconfont icon-wujiaoxing"></i>
                            </header>
                            <p class="comment-sentence">
                                {{info.comment_content}}
                            </p>
                            <aside class="comment-aside">
                                <em class="aside-info">{{info.item_name}}</em>
                                <em class="aside-info">{{info.period_num}} {{info.period_type}}</em>
                                <em class="aside-info">{{info.comment_time}}</em>
                            </aside>
                        </li>
                    </ul>
                    <ul v-else>
                        <li class="user-comments-list">
                            <p>There is no comment on this article. comment on it!</p>
                            <p>My BCC - Order >></p>
                        </li>
                    </ul>
                    <el-pagination
                            class="info-pagination"
                            layout="prev, pager, next"
                            :page-size="pageSize"
                            :current-page.sync="pageNum"
                            :total="commentData?commentData.length:0">
                    </el-pagination>
                </article>
                -->
            </tabs>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import utils from '~/plugins/utils';
    import {mapState, mapGetters, mapActions} from 'vuex';
    import Component from 'vue-class-component';
    import tabs from '~/components/tabs';
    import pagination from "~/components/pagination.vue";
    export default{
        async fetch({isServer, store, query, redirect}){
            let itemId = query.itemId;
            const home = "/store";
            if (isServer) {
                redirect(home);
                return void(0)
            }
            await store.dispatch('index/store/store/getItemData', {itemId: itemId});
            //await store.dispatch('index/store/store/getCommentData', {itemId: itemId});
        },
        asyncData({query}){
            return {
                itemId: query.itemId || 0,
            }
        },
        data () {
            return {
                STORE_HOME: '/store',
                count: 1,
                loading: false,
                submitPrevent: false,
                n: 1,
                //labels: ["User Comments", "Production Detail"],
                labels: ["Production Detail"],
                defaultActive: "Production Detail",
                type: "",
                pageNum: 1,
                //每页显示数量
                pageSize: 4,
                cryleOptions: ['3', '6', '9', '12', '24'],
                session_id: '',
                isBuy: false,
                isActived:0,
                item_num:1,
                price_list:[],
                total_item_price:0,
                total_original_price:0,
                detailData:[],
                purchaser:{
                    name: '',
                    phone:'',
                    email:''
                }
            }
        },
        created () {
            this.detailData=JSON.parse(JSON.stringify(this.detailDataNew));
            if(this.detailData.is_quantity_price == 1 && this.detailData.type_id==1){
                this.price_list = this.detailData.item_price;
                this.price_list.forEach((item, index) => {
                    if (index===0) {
                        this.detailData.item_price = item.item_price;
                    }
                });
            }
            if (this.detailData.type_id == 2) {
                this.detailData.period_num = this.detailData.default_num;
                this.total_item_price = this.detailData.item_price;
                this.total_original_price = this.detailData.original_price;
            }
            if (this.detailData.type_id == 1 && this.detailData.allow_customer_type==2 ) {
                this.count = 0;
            }/*else if (this.detailData.default_num > 0) {
                this.count = this.detailData.default_num;
            }*/
            if (!this.userInfo) {
                this.isBuy = false;
            } else if (this.detailData.allow_customer_type != this.userInfo.customerType) {
                this.isBuy = true;
            }
        },
        methods: {
            async addToCart(buyType){
                if (window.sessionStorage["session_id"]) {
                    this.session_id = sessionStorage.getItem("session_id");
                } else {
                    this.session_id = Math.random().toString(36).substr(2);
                    sessionStorage.setItem("session_id", this.session_id);
                }
                try {
                    let stu_id = 0;
                    if(this.count>0 && this.detailData.allow_customer_type==2){
                        stu_id = 3;
                    }
                    let res = await utils.sendAxiosPost('/api/store/addToCart',
                        {
                            uid: this.userInfo.uid,
                            itemId: this.itemId,
                            stuId: stu_id,
                            num: this.count,
                            itemNum: this.item_num,
                            session_id: this.session_id,
                            buyType:buyType
                        });
                    if (res.status === 200 && res.data.status_code === 200) {
                        if(buyType==0){
                            this.$_message("Successfully added shopping cart!");
                        }else{
                            let id_str = res.data.data.cartIds;
                            id_str = id_str.join('-');
                            this.$router.push({name: 'store-shopOrderInfo', query: {cartIds: id_str}})
                        }
                    } else {
                        this.$_error(res.data.message);
                    }
                } catch (e) {
                }
            },
            async buyNow(){
                this.$router.push({
                    name: 'store-orderInfo',
                    query: {itemId: this.itemId, count: this.count}
                });
            },
            async handleNumChange(itemId, value) {
                let that = this;
                let _data = {itemId: itemId, itemNum: value};
                let res = await utils.sendAxiosPost('/api/store/getQuantityPrice', _data);
                if (res.status === 200 && res.data.status_code === 200) {
                    let price_data = res.data.data;
                    if(that.detailData.type_id==2){
                        that.detailData.period_num = price_data.period_num;
                    }
                    that.count = price_data.item_num;
                    
                    that.total_item_price = parseFloat(price_data.total_item_price).toFixed(2);
                    that.total_original_price = parseFloat(price_data.total_original_price).toFixed(2);
                }
               
            },
            async activedClick(val){
                this.isActived=val;
                let that = this;
                this.price_list.forEach((item, index) => {
                    if (index===val) {
                        that.detailData.item_price = item.item_price;
                        that.item_num = item.item_num;
                        that.detailData.original_price = item.original_price*item.item_num;
                    }
                });
                
            },
            async submitConsult(){
                this.loading = true;
                this.submitPrevent = true;
                if (this.itemId && this.purchaser.name && this.purchaser.phone && this.purchaser.email) {

                } else {
                    this.$_error("Please fill out the form!");
                    return false;
                }
                try {
                    let res = await utils.sendAxiosPost('/api/store/createConsult',
                        {uid: this.userInfo.uid,itemId: this.itemId,...this.purchaser});
                    
                    if (res.status === 200 && res.data.status_code === 200) {
                        this.$_message("Submit successfully!");
                    } else {
                        //this.$_error(res.data.message);
                        this.$_message("Submit failure! Please try again.");
                    }
                } catch (e) {
                }
                this.loading = false;
                this.submitPrevent = false;
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        },
        components: {
            tabs,
            pagination
        },
        layout(){
            return 'store'
        },
        computed: {
            ...mapState('index/store/store', {
                detailDataNew: state => state.itemData
                //commentData: state => state.commentData
            }),
            userInfo(){
                return this.$store.state.authUser;
            },
            /*
            formatCommentData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count;
                return this.commentData.slice(begin, count * pageNum);
            }
            */
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/font/store/icon";
    @import "~~assets/less/store/productDetail";
</style>
<style lang="less" scoped>
    .cont{
        min-width:450px;
    }
    .price_list{
        width:160px;
        line-height:30px;
        padding:0 20px;
        border:1px dashed #F3F3F3;
        cursor:pointer;
    }
   .actived{
         border:1px solid #ff0000;
    }
    .customer-component {
        display: inline-block;
        margin: .05rem 0;
        width: 100%;
    }
    .customer-component:before{
      content:"*";
      color:red;
      display:inline-block;
      position: absolute;
      top: 50%;
      transform: translate(-180%,-50%);
    }
</style>