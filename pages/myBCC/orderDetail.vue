<template>
    <div class="detail-container">
        <header class="header">
            <h2 class="title">Order Detail</h2>
        </header>
        <article class="article">
            <section class="order-info">
                <div class="order-info-left">
                    <ul>
                        <li>
                            <strong class="">Order No:{{orderDetail.order_no}}</strong>
                        </li>
                        <li>
                            <strong class="order_status">{{orderDetail.status_desc}}</strong>
                        </li>
                        <li>
                            <button v-if="(orderDetail.payments.status !=1) && (orderDetail.status==1)" type="button"
                                    @click="toPay()" class="back-btn">To Pay
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="order-info-right">
                    <img src="~assets/img/store/order_status.png" alt="" class="order-info-img">
                    <div class="order-info-sentence">
                        <ul>
                            <li>
                                <strong>1.Submit order</strong><br>
                                <em>{{orderDetail.create_time}}</em>
                            </li>
                            <li>
                                <strong v-if="orderDetail.payments.status==1">2.Pay Success</strong>
                            </li>
                            <li>
                                <strong v-if="orderDetail.payments.status==1 && orderDetail.status==6">3.Finish</strong>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section class="product-info">
                <header class="product-title-wrap">
                    <strong class="product-title">Product Information</strong>
                </header>
                <ul>
                    <li class="product-cart-list" v-for="(info, index) in orderDetail['items']">
                        <div class="list-left">
                            <img src="~assets/img/store/cart.png" alt="" class="product-img">
                            <ul class="product-description">
                                <li>
                                    {{info.item_name}}
                                </li>
                                <li>
                                    {{info.short_desc}}
                                </li>
                            </ul>
                        </div>
                        <div class="list-right">
                            <ul class="list-right-info">
                                <li>
                                    <div>
                                        <em class="money-unit-label">Unit Price:</em>
                                        <strong class="money-unit-num">${{info.item_price}}</strong>
                                    </div>
                                    <div class="money-reg">
                                        <em class="money-reg-label">GBP:</em>
                                        <strong class="money-reg-num">￡{{info.original_price}}</strong>
                                    </div>
                                </li>
                                <li>
                                    <em>x{{info.item_num}}</em>
                                </li>
                                <li>
                                    <div>
                                        <em class="subtotal-label">Subtotal:</em><strong class="subtotal-num">
                                        ￡{{info.item_total_price}}</strong>
                                    </div>
                                    <div class="money-reg">
                                        <em class="money-reg-label">{{info.item_num * info.period_num}} {{info.period_type}}</em>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </section>
            <section class="payment-info">
                <div class="payment-info-left">
                    <h3 class="payment-info-title">Customer Information</h3>
                    <div class="payment-info-customer">
                        <ul>
                            <li v-if="orderDetail.customer.customer_name">
                                <span>Name:</span>
                                <em>{{orderDetail.customer.customer_name}}</em>
                            </li>
                            <li v-if="orderDetail.customer.customer_email">
                                <span>Email:</span>
                                <em>{{orderDetail.customer.customer_email}}</em>
                            </li>
                            <li v-if="orderDetail.customer.customer_phone">
                                <span>Phone:</span>
                                <em>{{orderDetail.customer.customer_phone}}</em>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="payment-info-left">
                    <h3 class="payment-info-title">Payment Information</h3>
                    <div class="payment-info-list">
                        <ul>
                            <li v-if="orderDetail.payments.payType">
                                <span>Pay Method:</span>
                                <em>{{orderDetail.payments.payType}}</em>
                            </li>
                            <li v-if="orderDetail.payments.payTime">
                                <span>Pay Time:</span>
                                <em>{{orderDetail.payments.payTime}}</em>
                            </li>
                            <li v-if="orderDetail.payments.amount">
                                <span>Total Amount:</span>
                                <em>￡{{orderDetail.payments.amount}}</em>
                            </li>
                            <li>
                                <span>Discount:</span>
                                <em><s>-￡{{orderDetail.payments.discount}}</s></em>
                            </li>
                            <li v-if="orderDetail.payments.actual_amount">
                                <span>Actual Amount:</span>
                                <em>￡{{orderDetail.payments.actual_amount}}</em>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="payment-info-right">
                    <h3 class="payment-info-title">Invoice Information</h3>
                    <div class="payment-info-list">
                        <ul>
                            <li>
                                <span>Invoice Type:</span>
                                <em>Electronic invoice</em>
                            </li>
                            <li>
                                <span>Stauts:</span>
                                <em>Not apply</em>
                            </li>
                            
                            <li v-if="orderDetail.status==5 || orderDetail.status==6">
                                <button type="button" @click="downLoadInvoicePDF" class="back-btn">Apply Invoice</button>
                            </li>
                          
                        </ul>
                    </div>
                </div>
            </section>
            <div class="button-list">
                <nuxt-link :to="{name:'myBCC-order'}">
                    <button type="button" class="back-btn-l back-btn-left">Back</button>
                </nuxt-link>
                <button type="button" class="back-btn-l" v-if="orderDetail.status==1" @click="cancelOrder()">Cancel
                </button>
            </div>
        </article>
    </div>
</template>
<script>
    import axios from 'axios';
    import utils from '~/plugins/utils';
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex';
    export default {
        async fetch({store, query}) {
            if (query.orderId > 0) {
                await store.dispatch("index/myBCC/myBCC/setOrderDetail", {orderId: query.orderId});
            }
        },
        asyncData({query, redirect}){
            if (Object.keys(query).length) {
                let obj = {};
                obj.moduleName = "orderDetail";
                obj.CURRENT_PATH = [{
                    name: "My Order",
                    url: "myBCC-order"
                }, {
                    name: "Order Detail",
                    url: "myBCC-orderDetail"
                }];
                return obj;
            } else {
                redirect("/myBcc/myBCC");
            }
        },
        data () {
            return {
                optionKeys: {
                    order_no: "Order NO"
                }
            }
        },
        methods: {
            async toPay(){
                let id_str = this.orderDetail.item_ids;
                this.$router.push({name: 'store-orderInfo', query: {itemId: id_str, order_id: this.orderDetail.id}})
            },
            async cancelOrder(){
                let that = this;
                this.$confirm("Do you confirm cancellation of order?").then(_ => {
                    let _data = {uid: this.$store.state.authUser.uid, orderId: this.orderDetail.id, status: 7};
                    utils.sendAxiosPost('/api/order/updateOrderStatus', _data).then(function (res) {
                        if (res.status === 200 && res.data.status_code === 200) {
                            that.$_message("The order has been cancelled successfully");
                            setTimeout(function () {
                                that.$router.push({name: 'myBCC-order'})
                            }, 3000);
                        }
                    })
                }).catch(_ => {
                });
            },
            async downLoadInvoicePDF(){
                let res = await utils.sendAxiosPost('/api/order/createInvoicePDF', {uid:this.$store.state.authUser.uid,order_no:this.orderDetail.order_no});
                if (res.status && res.data.status_code === 200) {
                    //window.location.href = res.data.data["download_url"];
                    window.open(res.data.data["download_url"]);
                }else{
                    this.$_error('Error generating PDF file!');
                }
            },
            ...mapActions('index/myBCC/myBCC', [
                'changeCurrentPath'
            ]),

        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH)

        },
        computed: {
            orderDetail(){
                return this.orderDetail
            },
            ...mapState('index/myBCC/myBCC', {
                orderDetail: state => state.orderDetail
            })
        },
        components: {}
    }
</script>
<style lang="less" scoped>
    @import "~element-ui/lib/theme-default/icon.css";
    @import "~~assets/less/myBCC/detail";
    @import "~~assets/less/myBCC/orderDetail";
</style>
