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
                                    <el-input v-model="customerInfo.firstName"
                                              placeholder="Please enter first name"
                                              class="customer-component"
                                              type="text"></el-input>
                                </el-col>
                                <el-col :span="12">
                                    <el-input v-model="customerInfo.lastName"
                                              placeholder="Please enter last name"
                                              class="customer-component"
                                              type="text"></el-input>
                                </el-col>
                            </el-row>
                        </li>
                        <li class="customer-info-list">
                            <el-input v-model="customerInfo.email"
                                      placeholder="Please enter email"
                                      class="customer-component"
                                      type="text"></el-input>
                        </li>
                        <li class="customer-info-list">
                            <el-row :gutter="20">
                                <el-col :span="10">
                                    <el-select class="customer-component_none"
                                                   v-model="address"
                                                   @change="handleItemChange">
                                                <el-option
                                                        v-for="item in countryAddressData"
                                                        :key="item.id"
                                                        :label="item.english_name"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                  
                                </el-col>
                                <el-col :span="4">
                                    <em class="customer-component-phoneNum">+{{area_phone}}</em>

                                </el-col>
                                <el-col :span="10">
                                    <el-input v-model="customerInfo.phone"
                                              placeholder="Please enter phone"
                                              class="customer-component_none"
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
                        <tabs :labels="labels" :defaultActive="defaultActive" @changeTab="activeTab">
                            <article slot="Pay with card">
                                <ul class="payment-info-form">
                                    <li class="payment-info-list">

                                    </li>
                                    <li class="payment-info-list">
                                    <el-row :gutter="20">
                                        <el-col :span="8">
                                            <el-select class="payment-component"
                                                   v-model="userCard.cardType" placeholder="Card Type"
                                                   @change="handleCardTypeChange">
                                                <el-option
                                                        v-for="item in cardTypeOptions"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-input class="payment-component" name="card_number"
                                                  placeholder="Card Number"
                                                  v-model="userCard.card_number"></el-input>
                                        </el-col>
                                        
                                    </el-row>
                                    </li>
                                    <li class="payment-info-list">
                                        <el-row :gutter="20">
                                            <el-col :span="8">
                                                <el-input class="payment-component" name="cardholder_name"
                                                          value=""
                                                          placeholder="CardHolder Name"
                                                          v-model="userCard.cardholder_name"
                                                ></el-input>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-input class="payment-component" name="expiry_date_mm"
                                                          value=""
                                                          placeholder="MM/YY"
                                                          v-model="userCard.expiry_date_mm"
                                                ></el-input>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-input class="payment-component" name="cvn"
                                                          value=""
                                                          placeholder="CVV"
                                                          v-model="userCard.cvn"></el-input>
                                            </el-col>
                                        </el-row>
                                    </li>
                                </ul>
                            </article>
                            <article slot="Pay with PayPal">
                                <p class="payPal-tips">You will be redirected to the PayPal website.</p>
                                <label>
                                    <input name="pay_type" type="checkbox" v-model="pay_type" class="pay_display">
                                    <div class="payPal-submit-btn" v-bind:class="{btn_border: isborder}"
                                         @click="payClick()"></div>
                                </label>
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
                    <label><input type="checkbox" name="isActive" v-model="isActive" value="1">Activate resource immediately after purchase!</label>
                    <p class="order_tips">
                        If you don’t want to activate your service now, you can always activate it in Recourses。</p>
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
                        <button class="submit-button" :disabled="submitPrevent" @click="submitPrevent || submitForm()">
                            SUBMIT ORDER
                        </button>
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
                cartIds: query.cartIds || 0,
                order_id: query.order_id || 0,
                address: query.address || '',
                userCard: {
                    card_number: query.card_number || '',
                    cardType: query.cardType || '',
                    cardholder_name: query.cardholder_name || '',
                    expiry_date_mm: query.expiry_date_mm || '',
                    cvn: query.cvn || ''

                },
                customerInfo: {
                    firstName: query.firstName,
                    lastName: query.lastName,
                    email: query.email,
                    phone: query.phone,
                    customerType: query.customerType,
                },
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
                labels: ["Pay with card","Pay with PayPal"],
                //Mark By Allen
                //labels: ["Pay with PayPal"],
                defaultActive: "Pay with PayPal",
                address: '',
                area_phone: '0044',
                typeOptions: [{
                    value: '1',
                    label: 'Learner'
                }, {
                    value: '2',
                    label: 'Educator'
                }],
                pay_type: true,
                isborder: true,
                isActive: 1,
                cardTypeOptions:[{
                    value: 'VISA',
                    label: 'Visa'
                },
                {
                    value: 'MC',
                    label: 'MasterCard'
                }],
                item_type:0,
                /*userCard: {
                 card_number:'4263970000005262',
                 cardholder_name:'James Mason',
                 expiry_date_mm:'0119',
                 cvn:'123'
                 },*/
                /*amountData:{
                 num: 0,
                 total_price: 0,
                 discount: 0,
                 pay_amount: 0,
                 },*/
                
            }
        },

        methods: {
            //address change
            async handleItemChange(val){
                this.countryAddressOptions.forEach((item, index) => {
                    if (item.id == val) {
                        this.area_phone = item.area_phone_number;
                        this.customerInfo.address = val;
                        this.customerInfo.area_phone = this.area_phone;
                    }
                });
            },
            async handleCardTypeChange(val){
                this.cardTypeOptions.forEach((item, index) => {
                    if (item.value === val) {
                        this.userCard.cardType = item.value;
                    }
                });

            },
            async activeTab(tabName){
                if(tabName=="Pay with PayPal"){
                    this.pay_type = true;
                }else{
                    this.pay_type = false;
                }
                console.log(this.pay_type);
            },
            async submitForm(){
                if (this.customerInfo.firstName && this.customerInfo.lastName && this.customerInfo.email) {

                } else {
                    this.$_error("Buyer information cannot be empty!");
                    return false;
                }
                console.log(this.pay_type);
                if (this.pay_type == true) {
                    this.pay_type = 3;
                } else {
                    if (this.userCard.card_number && this.userCard.cardholder_name && this.userCard.expiry_date_mm && this.userCard.cvn) {

                    } else {
                        this.$_error("Card information cannot be empty!");
                        return false;
                    }
                }
                let uid = 0;
                if (this.$store.state.authUser) {
                    uid = this.$store.state.authUser.uid;
                }
                //判断输入的邮箱对应的用户类型
                try{
                    let ress = await utils.sendAxiosGet('/api/user/checkEmail',['email'], {email: this.customerInfo.email});
                    if (ress.status === 200 && ress.data.status_code === 20008) {
                        let customer_type = ress.data.data.customer_type;
                        console.log(customer_type);
                        if(customer_type != this.item_type){
                            this.$_error("User type is not consistent with product type and cannot be purchased!");
                            return false;
                        }
                    }else{
                        this.customerInfo.customerType = this.item_type;
                    }
                }catch (e) {

                }

                try {
                    let res = '';
                    if (this.order_id > 0) {
                        //当order_id不为空时，则更新订单信息
                        res = await utils.sendAxiosPost('/api/order/updateOrder', {
                            uid: uid,
                            order_id: this.order_id,
                            payType: this.pay_type,
                            isActive: this.isActive, ...this.customerInfo
                        });
                    } else {
                        //当order_id为空时，创建新的订单记录
                        res = await utils.sendAxiosPost('/api/order/createOrder', {
                            uid: uid,
                            orderType: 1,
                            orderSource: 1,
                            cartIds: this.cartIds,
                            payType: this.pay_type,
                            isActive: this.isActive, ...this.userCard, ...this.customerInfo
                        });
                    }
                    if (res.status === 200 && res.data.status_code === 200) {
                        let order_id = res.data.data.order.order_id;
                        if (this.$store.state.authUser.length == 0) {
                            uid = res.data.data.userInfo.id;
                        }

                        if (this.pay_type == 3) {
                            this.$router.push({
                                name: 'store-shopPayment',
                                query: {
                                    cartIds: this.cartIds,
                                    order_id: order_id,
                                    isActive: this.isActive, ...this.customerInfo,
                                    uid: uid
                                }
                            })
                        } else {
                            this.$router.push({
                                name: 'store-shopRealexpay',
                                query: {
                                    cartIds: this.cartIds,
                                    order_id: order_id,
                                    isActive: this.isActive, ...this.userCard, ...this.customerInfo,
                                    uid: uid
                                }
                            })
                        }

                    } else {
                        this.$_error("update order error!");
                    }
                } catch (e) {

                }


            },
            async payClick(){
                if (this.isborder == false) {
                    this.isborder = true;
                } else {
                    this.isborder = false;
                }

            }
        },
        components: {
            tabs
        },
        layout(){
            return 'store'
        },
        created () {

            //init&format 格式化后端数据  
            this.countryAddressData.forEach(item => {
                if (item.id == this.address) {
                    this.area_phone = item.area_phone_number;
                    this.customerInfo.address = this.address;
                    this.customerInfo.area_phone = this.area_phone;
                }
            });
            if (!this.customerInfo.email) {

                this.customerInfo.firstName = this.$store.state.authUser.firstName;
                this.customerInfo.lastName = this.$store.state.authUser.lastName;
                this.customerInfo.email = this.$store.state.authUser.email;
                this.customerInfo.phone = this.$store.state.authUser.phone;

                //this.isReadonly = true;
            };
            if(this.orderData){
                this.orderData.forEach(item => {
                    this.item_type = item.allow_customer_type;
                });
            }

        },
        computed: {
            ...mapState('index/store/store', {
                orderData: state => state.shopOrderData.shop_list,
                amountData: state => state.shopOrderData.total_amount || {
                    num: 0, total_price: 0, discount: 0, pay_amount: 0,
                },
                countryAddressData: state => state.countryAddressData,
            }),
            userInfo(){
                return this.$store.state.authUser;
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/store/orderInfo";
</style>