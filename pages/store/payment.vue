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
                                    <el-select class="customer-component"
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
                                        <em v-if="info.type_id==1" class="money-reg-label">{{count * info.period_num}} {{info.period_type}}</em>
                                        <em v-else class="money-reg-label">{{count}} {{info.period_type}}</em>
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
                            <div id="paypal-button-container"></div>
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
            await store.dispatch('index/store/store/getOrderData',
                {itemId: query.itemId, itemNum: query.count});
        },
        asyncData({query}){
            return {
                uid: query.uid || 0,
                itemId: query.itemId || 0,
                count: query.count || 1,
                order_id: query.order_id,
                isActive: query.isActive || 0,
                firstName: query.firstName,
                lastName: query.lastName,
                email: query.email,
                address: query.address,
                phone: query.phone,
                customerType: query.customerType,
            }
        },
        data () {
            return {
                STORE_HOME: '/store/payment',
                submitPrevent: false,
                props: {
                    value: 'id',
                    label: 'english_name',
                },
                labels: ["Pay with PayPal"],
                defaultActive: "Pay with PayPal",
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
                }
                //console.log(this.userCard);
                //console.log(this.customerInfo);
                this.$router.push({
                    name: 'store-orderInfo',
                    query: {
                        itemId: this.itemId,
                        count: this.count,
                        order_id: this.order_id,
                        address: this.address, ...this.userCard, ...this.customerInfo
                    }
                })
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
            this.countryAddressData.forEach(item => {
                if (item.id == this.address) {
                    this.area_phone = item.area_phone_number;
                }
            });

            this.$nextTick(_ => {
                checkout && checkout();

                if (this.$store.state.authUser) {
                    this.uid = this.$store.state.authUser.uid;
                }
                let order_id = this.order_id;
                let _router = this.$router;
                let userid = this.uid;
                let isActive = this.isActive;

                window.paypal.Button.render({

                    // Set your environment
                    env: 'production', // sandbox | production

                    // Specify the style of the button
                    style: {
                        label: 'buynow',
                        //fundingicons: true, // optional
                        branding: true, // optional
                        size: 'medium', // small | medium | large | responsive
                        shape: 'rect',   // pill | rect
                        color: 'gold'   // gold | blue | silve | black
                    },

                    // PayPal Client IDs - replace with your own
                    // Create a PayPal app: https://developer.paypal.com/developer/applications/create

                    client: {
                        sandbox: 'AXaE6cL_CtR6qHcyDzd0GkyyqLGeltLX5qFL6NR6YwfHtVAY6l0z-1-r4qY7Z3J2-E2HvadEe10tojiw',
                        production: 'Af25Ftd5s7Vy3odD9iCMMzt2JbwJsANg0zbBtYQ9pD_NKYj5nKkTB6kfnHaVu_blJFPOtZZ0YfzU14Gi'
                    },

                    // Wait for the PayPal button to be clicked
                    payment: function () {
                        console.log(order_id);
                        // Set up a url on your server to create the payment
                        //let CREATE_URL = _url + 'payment/store';
                        let _data = {order_id: order_id};

                        // Make a call to your server to set up the payment
                        return utils.sendAxiosPost('/api/payment/store', _data).then(function (res) {
                            res = res.data;
                            if (res.state == "created") {
                                let datas = utils.sendAxiosPost('/api/payment/updatePayment', {
                                    order_id: order_id,
                                    payment_id: res.id
                                });
                            }
                            return res.id;
                        });
                    },

                    // Wait for the payment to be authorized by the customer

                    // onAuthorize() is called when the buyer approves the payment
                    onAuthorize(data, actions) {
                        // Set up a url on your server to execute the payment
                        //let EXECUTE_URL = _url + 'payment/execute';

                        // Set up the data you need to pass to your server
                        let _data = {
                            paymentID: data.paymentID,
                            payerID: data.payerID
                        };

                        // Make a call to your server to execute the payment
                        return utils.sendAxiosPost('/api/payment/execute', _data).then(function (res) {
                            res = res.data;

                            if (res.state == "approved") {

                                utils.sendAxiosPost('/api/payment/updateOrder', {
                                    uid: userid,
                                    payment_id: res.id,
                                    isActive: isActive
                                }).then(function (datas) {
                                    datas = datas.data;
                                    _router.push({name: 'prompt-success', query: {type: 9, order_no: datas}})
                                });

                            } else {
                                _router.push({name: 'prompt-failure', query: {type: 1}})
                            }
                        });
                    }

                }, '#paypal-button-container');

            }, 2000)
        },
        computed: {
            ...mapState('index/store/store', {
                orderData: state => state.orderData.shop_list,
                amountData: state => state.orderData.total_amount,
                countryAddressData: state => state.countryAddressData
            })
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/store/orderInfo";
</style>