<template>
    <div class="order-wrapper">
        <header class="order-header">
            <el-steps class="order-steps" :space="200" :align-center="true" :center="true" :active="1"
                      finish-status="success">
                <el-step title="1.Shopping Cart"></el-step>
                <el-step title="2.Fill in and Check"></el-step>
                <el-step title="3.Submit Success"></el-step>
            </el-steps>
            <div class="clear-fix"></div>
            <!-- <h2 class="order-title">Fill in and check the order information</h2> -->
        </header>
        <article class="order-content">
            <section class="customer-info">
                <div class="customer-info-left">
                    <h3 class="customer-info-title">Customer Information</h3>
                    <ul class="customer-info-form">
                        <li class="customer-info-list">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-input v-model="firstName"
                                              readonly="readonly"
                                              placeholder="Please enter first name"
                                              class="customer-component"
                                              type="text"></el-input>
                                </el-col>
                                <el-col :span="12">
                                    <el-input v-model="lastName"
                                              readonly="readonly"
                                              placeholder="Please enter last name"
                                              class="customer-component"
                                              type="text"></el-input>
                                </el-col>
                            </el-row>
                        </li>
                        <li class="customer-info-list">
                            <el-input v-model="email"
                                      readonly="readonly"
                                      placeholder="Please enter email"
                                      class="customer-component"
                                      type="text"></el-input>
                        </li>
                        <li class="customer-info-list" v-if="address || phone">
                            <el-row :gutter="20">
                                <el-col :span="10" v-if="address">
                                    <el-select class="customer-component_none"
                                                   v-model="address" disabled>
                                                <el-option
                                                        v-for="item in countryAddressData"
                                                        :key="item.id"
                                                        :label="item.english_name"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                </el-col>
                                <el-col :span="4" v-if="address">
                                    <em class="customer-component-phoneNum">+{{area_phone}}</em>
                                </el-col>
                                <el-col :span="10" v-if="phone">
                                    <el-input v-model="phone"
                                              readonly="readonly"
                                              placeholder="Please enter phone"
                                              class="customer-component"
                                              type="text"></el-input>
                                </el-col>
                            </el-row>

                        </li>
                    </ul>
                </div>
                <div class="customer-info-right">
                    <img src="~assets/img/store/paySecurity.png" alt="" class="customer-info-img">
                    <p class="customer-info-sentence">
                        Please note, your email here will be made automatically as your account name where the services will be activated for.  </p>
                </div>
            </section>
            <section class="payment-info">
                <div class="payment-info-left">
                    <h3 class="payment-info-title">Payment Information</h3>
                    <div class="payment-tabs-container">
                        <tabs :labels="labels" :defaultActive="defaultActive">
                            <article slot="Pay with card">
                                <ul class="payment-info-form">
                                    <li class="payment-info-list">
                                    </li>
                                    <li class="payment-info-list">
                                    <el-row :gutter="20">
                                        <el-col :span="8">
                                            <el-input class="payment-component" name="cardType" 
                                            readonly="readonly" v-model="cardType"></el-input>
                                        </el-col>
                                        <el-col :span="16">
                                        <el-input class="payment-component" name="card_number"
                                                  readonly="readonly"
                                                  placeholder="Card Number"
                                                  v-model="card_number"></el-input>
                                        </el-col>
                                    </el-row> 
                                    </li>
                                    <li class="payment-info-list">
                                        <el-row :gutter="20">
                                            <el-col :span="8">
                                                <el-input class="payment-component" name="cardholder_name"
                                                          readonly="readonly"
                                                          placeholder="CardHolder Name"
                                                          v-model="cardholder_name"
                                                ></el-input>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-input class="payment-component" name="expiry_date_mm"
                                                          readonly="readonly"
                                                          placeholder="MM/YY"
                                                          v-model="expiry_date_mm"
                                                ></el-input>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-input class="payment-component" name="cvn"
                                                          readonly="readonly"
                                                          placeholder="CVV"
                                                          v-model="cvn"></el-input>
                                            </el-col>
                                        </el-row>
                                    </li>
                                </ul>
                            </article>
                            <article slot="Pay with PayPal">
                                <p class="payPal-tips">You will be redirected to the PayPal website.</p>
                                <div class="payPal-submit-btn"></div>
                            </article>
                        </tabs>
                    </div>
                </div>
                <div class="payment-info-right">
                    <div class="payment-support-container">
                        <img src="~assets/img/store/pay-support 1.png" alt="" class="payment-support-img">
                        <img src="~assets/img/store/pay-support 2.png" alt="" class="payment-support-img">
                        <img src="~assets/img/store/pay-support 3.png" alt="" class="payment-support-img">
                        <img src="~assets/img/store/pay-support 4.png" alt="" class="payment-support-img">
                        <img src="~assets/img/store/pay-support 5.png" alt="" class="payment-support-img">
                    </div>
                    <img src="~assets/img/store/safe.png" alt="" class="payment-info-img">
                    <p class="payment-info-sentence">

                    </p>
                </div>
            </section>
            <section class="product-info">
                <header class="product-title-wrap">
                    <strong class="product-title">Product Information</strong>
                    <em class="product-title-tips">Go back to modify Shopping Cart</em>
                </header>
                <ul>
                    <li class="product-cart-list" v-for="(info, index) in orderData">
                        <div class="list-left">
                            <template v-if="info.item_name === 'Annual Subscription' && info.allow_customer_type==2">
                                <img :src="info.item_image" alt="" class="product-img edu1">
                            </template>
                            <template v-if="info.item_name === 'Add Students' && info.allow_customer_type==2">
                                <img :src="info.item_image" alt="" class="product-img edu2">
                            </template>
                            <template v-if="info.item_name === 'Annual Subscription' && info.allow_customer_type==1">
                                <img :src="info.item_image" alt="" class="product-img stu0">
                            </template>
                            <template v-if="info.item_name === 'Level 1'">
                                <img :src="info.item_image" alt="" class="product-img stu1">
                            </template>
                            <template v-if="info.item_name === 'Level 2'">
                                <img :src="info.item_image" alt="" class="product-img stu2">
                            </template>
                            <template v-if="info.item_name === 'Level 3'">
                                <img :src="info.item_image" alt="" class="product-img stu3">
                            </template>
                            <template v-if="info.item_name === 'Level 4'">
                                <img :src="info.item_image" alt="" class="product-img stu4">
                            </template>
                            <ul class="product-description">
                                <li>
                                    {{info.item_name}}
                                </li>
                                <li>
                                    {{info.type}}
                                </li>
                            </ul>
                        </div>
                        <div class="list-right">
                            <ul class="list-right-info">
                                <li>
                                    <div>
                                        <em class="money-unit-label">Unit Price:</em>
                                        <strong class="money-unit-num">￡{{info.item_price}}</strong>
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
                                        <em class="subtotal-label">Subtotal:</em><strong
                                            class="subtotal-num">￡{{info.item_total_price}}</strong>
                                    </div>
                                    <div class="money-reg">
                                        <em v-if="info.type_id==1"
                                            class="money-reg-label">{{info.item_num * info.period_num}} {{info.period_type}}</em>
                                        <em v-else class="money-reg-label">{{info.item_num}} {{info.period_type}}</em>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <aside class="order-aside">
                    <label><input type="checkbox" v-model="isActive" disabled>Activate resource immediately after purchase!</label>
                </aside>
            </section>
            <aside class="order-submit">
                <ul>
                    <li><label class="description-label"><em class="num-mark">{{amountData.num}}</em>
                        items, total amount:</label><strong
                            class="total-amount">￡{{amountData.total_price}}</strong></li>
                    <li><label class="description-label">Discount:</label><strong
                            class="discount">￡{{amountData.discount}}</strong></li>
                    <li><label class="description-label">Total amount payable:</label><strong
                            class="payable">￡{{amountData.pay_amount}}</strong></li>
                    <li>
                        <div class="left">
                            <button class="submit-button" @click="submitGoBack()">GO BACK</button>
                        </div>
                        <div class="left">
                            <button class="submit-button" @click="submitPayNow()">PAY NOW</button>
                        </div>
                    </li>
                </ul>
            </aside>
        </article>
    </div>
</template>
<script>
    import Vue from 'vue';
    import tabs from '~/components/tabs';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import utils from '~/plugins/utils';

    export default{
        async fetch({isServer, store, query, redirect}){
            const home = "/store";
            if (isServer) {
                redirect(home);
                return void(0)
            }
            await store.dispatch('index/store/store/countryAddressData');
            await store.dispatch('index/store/store/getShopOrderData',
                {cartIds: query.cartIds});
        },
        asyncData({query}){
            return {
                uid: query.uid || 0,
                cartIds: query.cartIds || 0,
                isActive: query.isActive || 0,
                order_id: query.order_id,
                firstName: query.firstName,
                lastName: query.lastName,
                email: query.email,
                address: query.address || '',
                phone: query.phone,
                customerType: query.customerType,
                card_number: query.card_number,
                cardholder_name: query.cardholder_name,
                expiry_date_mm: query.expiry_date_mm,
                cvn: query.cvn,
                cardType: query.cardType,
            }
        },
        data () {
            return {
                STORE_HOME: '/store',
                submitPrevent: false,
                props: {
                    value: 'id',
                    label: 'english_name',
                },
                labels: ["Pay with card"],
                defaultActive: "Pay with card",
                address: '',
                userInfo: this.$store.state.authUser,
                customerInfo: [],
                userCard: [],
            }
        },
        methods: {
            async submitGoBack(){
                this.customerInfo = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    phone: this.phone,
                }
                if (this.customerType) {
                    this.customerInfo.customerType = this.customerType;
                }
                this.userCard = {
                    card_number: this.card_number,
                    cardholder_name: this.cardholder_name,
                    expiry_date_mm: this.expiry_date_mm,
                    cvn: this.cvn,
                    cardType: this.cardType,
                }
                this.$router.push({
                    name: 'store-shopOrderInfo',
                    query: {
                        cartIds: this.cartIds,
                        order_id: this.order_id,
                        address: this.address, ...this.userCard, ...this.customerInfo
                    }
                })
            },
            async submitPayNow(){
                if (this.$store.state.authUser) {
                    this.uid = this.$store.state.authUser.uid;
                }
                let _router = this.$router;
                let _data = {
                    card_number: this.card_number,
                    expiry_date_mm: this.expiry_date_mm,
                    expiry_date_yy: '',
                    cardholder_name: this.cardholder_name,
                    cvn: this.cvn,
                    cardType: this.cardType,
                    amount: this.amount
                };

                let res = await utils.sendAxiosPost('/api/payment/createRealexpay', _data);
                if (res.status === 200 && res.data.status_code === 200) {
                    res = res.data.data;
                    if (res.resultCode == "00") {
                        utils.sendAxiosPost('/api/payment/updatePayOrder', {
                            uid: this.uid,
                            order_id: this.order_id,
                            payment_id: res.orderId,
                            isActive: this.isActive,
                            cartIds: this.cartIds
                        }).then(function (datas) {
                            datas = datas.data;
                            _router.push({name: 'prompt-success', query: {type: 9, order_no: datas}})
                        });
                    }
                }else{
                    if(res.status === 200 && res.data.status_code === 30506){
                        this.$_error("Card information does not conform to the model");
                    }else{
                        this.$_error(res.data.message);
                    }
                }
            }
        },
        components: {
            tabs
        },
        layout(){
            return 'store'
        },
        /*head: {
         script: [{src:"https://www.paypalobjects.com/api/checkout.js"}]
         },*/
        created () {
            //init&format 格式化后端数据
            this.countryAddressData.forEach(item => {
                if (item.id == this.address) {
                    this.area_phone = item.area_phone_number;
                }
            });
        },
        computed: {
            ...mapState('index/store/store', {
                orderData: state => state.shopOrderData.shop_list,
                amountData: state => state.shopOrderData.total_amount,
                countryAddressData: state => state.countryAddressData,
            }),
            amount(){
                return parseFloat(this.amountData.pay_amount * 100).toFixed(0);
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/store/orderInfo";
</style>