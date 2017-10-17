<template>
    <div class="cart-wrap">
        <ul class="container-nav">
            <li>Home</li>
            <li>Store</li>
            <li class="active">Production Detail</li>
        </ul>
        <div class="cart-container">
            <header class="header">
                <h2>Check your shopping cart</h2>
            </header>
            <article class="content">
                <section class="top-tool-bar">
                    <div class="left-bar">
                        <el-row class="left-row">
                            <el-col :span="12">
                                <label class="left-bar-checkbox">
                                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                                                 @change="handleCheckAllChange">Select All
                                    </el-checkbox>
                                </label>
                            </el-col>
                            <el-col :span="12">
                                Product Information
                            </el-col>
                        </el-row>
                    </div>
                    <div class="right-bar">
                        <ul class="right-bar-ul">
                            <li>Unit Price</li>
                            <li>Quantity</li>
                            <li>Subtotal</li>
                            <li>Operation</li>
                        </ul>
                    </div>
                </section>
                <section class="cart-list-wrap">
                    <el-checkbox-group v-model="checkedItems" @change="handleCheckedItemsChange">
                        <ul>
                            <li class="cart-list" v-for="(info, index) in itemData">
                                <el-row class="cart-list-left">
                                    <el-col :span="11" :offset="1">
                                        <el-checkbox :label="info.id" id="el-checkbox" :key="info.id" :value="info.id" @change="(val)=>handleItemsChange(info.item_id,val)"></el-checkbox>
                                        <template
                                                v-if="info.item_name === 'Annual Subscription' && info.allow_customer_type==2">
                                            <img :src="info.item_image" alt="" class="product-img edu1">
                                        </template>
                                        <template
                                                v-if="info.item_name === 'Add Students' && info.allow_customer_type==2">
                                            <img :src="info.item_image" alt="" class="product-img edu2">
                                        </template>
                                        <template
                                                v-if="info.item_name === 'Annual Subscription' && info.allow_customer_type==1">
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
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="product-description">
                                            <h3 class="description-level">{{info.item_name}}</h3>
                                            <h3 class="description-species">
                                            <template v-if="info.allow_customer_type === '2'">
                                                 Eudcator Online Subscription 
                                            </template>
                                            <template v-else>
                                                Learner Online Subscription 
                                            </template>
                                            {{info.type}}
                                            </h3>
                                        </div>
                                    </el-col>
                                </el-row>
                                <div class="cart-list-right">
                                    <ul>
                                        <li>
                                            <strong class="current-price">￡{{info.item_price}}</strong>
                                            <span class="original-price">GBP<em
                                                    class="delete-line">￡{{info.original_price}}</em></span>
                                        </li>
                                        <li v-if="info.is_quantity_price==1">
                                            <el-input-number size="small" class="num-tool" :min="1" :max="+info.max_num" v-model="info.item_num"
                                                             @change="(val)=>handleNumChange(info.id,val,index)">
                                                             </el-input-number>
                          
                                        </li>
                                        <li v-else>
                                            <el-input-number size="small" class="num-tool" :min="1" :max="+info.max_num" v-model="info.item_num" @change="(val)=>handleNumChange(info.id,val,index)">
                                            </el-input-number>
                                            <!-- <el-input-number  v-if="info.type_id==2" size="small" class="num-tool" :min="1" :max="+info.max_num" v-model="info.item_num"
                                            @change="(val)=>handleNumChange(info.id,val,index)">
                                            </el-input-number> -->
                                        </li>
                                        <li>
                                            <strong class="current-price-orange">￡{{info.item_total_price}}</strong>
                                            <span v-if="info.type_id==1"
                                                  class="original-price">{{info.item_num * info.period_num}} {{info.period_type}}
                                            </span>
                                            <span v-else class="original-price">
                                                {{info.item_num}} {{info.period_type}}
                                            </span>
                                        </li>
                                        <li>
                                            <button class="action-btn" @click="DeleteItem(info.id)">Delete</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </el-checkbox-group>
                </section>
                <footer class="footer-wrap">
                    <div class="footer-left">
                        <label>
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                                         @change="handleCheckAllChange">Select All
                            </el-checkbox>
                        </label>

                        <em class="footer-delete" style="margin-left:20px; cursor:pointer;"
                            @click="DeleteItem(checkedItems)">Delete Selected</em>

                    </div>
                    <div class="footer-right">
                        <em class="footer-total-tips"><strong class="high-light-font">{{items_num}}</strong>
                            items have been selected</em>
                        <ul class="money">
                            <li><label>Discount:</label><em class="discount-money">￡{{discount}}</em></li>
                            <li><label>Total:</label><strong class="total-money">￡{{totalPrice}}</strong></li>
                        </ul>
                    </div>
                    <button class="submit-btn" @click="submitCheckOut()">CHECK OUT</button>
                </footer>
            </article>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import tabs from '~/components/tabs';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import utils from '~/plugins/utils';
    const itemsOptions = [];
    export default{
        async fetch({isServer, store, query, redirect}){
            const home = "/store";
            if (isServer) {
                redirect(home);
                return void(0)
            }
            let session_id = sessionStorage.getItem("session_id");
            await store.dispatch('index/store/store/getShoppingCartData', {session_id: session_id});
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
                checkAll: false,
                checkedItems: [],
                items: [],
                isIndeterminate: false,
                items_num: 0,
                discount: 0,
                total: 0,
                userInfoForm: this.$store.state.authUser,
                session_id: '',
                price: 0,
                itemData:[],
                item_type:[],
            }
        },
        methods: {
            async handleNumChange(cartId, value, index) {
                let that = this;
                let _data = {uid: this.$store.state.authUser.uid, cartId: cartId, itemNum: value};
                await utils.sendAxiosPost('/api/store/addOrDecrease', _data).then(function (res) {
                    if (res.status === 200 && res.data.status_code === 200) {
                        let price_data = res.data.data;
                        console.log(price_data);
                        that.itemData[index].item_price = price_data.item_price;
                        that.itemData[index].item_total_price = price_data.total_item_price;

                    }
                })
            },
            async DeleteItem(cartId) {
                if (cartId.length == 0) {
                    this.$_error("Please choose the goods first");
                } else {
                    let id_str = '';
                    if (Array.isArray(cartId)) {
                        id_str = cartId.join('-');
                    } else {
                        id_str = cartId;
                    }

                    let _this = this;
                    this.$confirm("Confirm delete?").then(_ => {
                        let _data = {uid: this.$store.state.authUser.uid, id_str: id_str};
                        utils.sendAxiosPost('/api/store/deleteShoppingCart', _data).then(function (res) {
                            if (res.status === 200 && res.data.status_code === 200) {
                                if (Array.isArray(cartId)) {
                                    cartId.forEach((value, key) => {
                                        var index = _this.itemData.indexOf(value[key])
                                        _this.itemData.splice(index, 1)
                                    });
                                } else {
                                    var index = _this.itemData.indexOf(cartId)
                                    _this.itemData.splice(index, 1)
                                }
                                //选中商品删除后，状态还原
                                _this.item_num = 0;
                                _this.total = 0;
                            }
                        })
                    }).catch(_ => {
                    });
                }
            },
            handleCheckAllChange(event) {
                this.checkedItems = [];
                this.checkedItems = event.target.checked ? itemsOptions : [];
                this.isIndeterminate = false;
                this.items_num = this.checkedItems.length;

                let that = this;
                this.checkedItems.forEach((item)=> {
                    this.itemData.forEach((item_info)=> {
                        if(item_info.id==item){
                            that.item_type.push(item_info.allow_customer_type);
                        }
                    });
                });
                that.item_type= this.removeDuplicatedItem(that.item_type);
                if(that.item_type.length>1){
                    this.checkedItems = [];
                    this.item_type = [];
                    this.items_num = this.checkedItems.length;
                    this.checkAll = false;

                    this.$_error("Please choose the same type of goods to buy");
                }
            },
            handleCheckedItemsChange(value) {
                this.checkedItems = value;
                
                let checkedCount = value.length;
                let itemCount = this.items.length;
                this.checkAll = checkedCount === itemCount;
                this.isIndeterminate = checkedCount > 0 && checkedCount < itemCount;
                this.items_num = checkedCount;
            },
            async handleItemsChange(item_id,value){
                if(this.checkedItems.length===0){
                    this.item_type = [];
                }
                let that = this;
                this.itemData.forEach((item,index)=> {
                    if(item.item_id==item_id){
                        if(value.target.checked===true){
                            if(that.item_type.length === 0){
                                that.item_type[0]=item.allow_customer_type;
                            }else{
                                if(that.item_type[0] != item.allow_customer_type){
                                    that.$_error("Please choose the same type of goods to buy");
                                    this.checkedItems.pop();
                                };
                                
                            }
                        }
                    }
                    
                });
                console.log(that.item_type);

            },
            async submitCheckOut(){
                if (this.checkedItems.length == 0) {
                    this.$_error("Please choose the goods first");
                } else {
                    let id_str = this.checkedItems.join('-');
                    this.checkedItems = [];
                    //后端检测商品类型
                    let res = await utils.sendAxiosPost('/api/store/checkItemType',{cartIds: id_str});
                    if (res.status === 200 && res.data.status_code === 200) {
                        this.$router.push({name: 'store-shopOrderInfo', query: {cartIds: id_str}})
                    }else{
                        that.$_error("Please choose the same type of goods to buy");
                    }

                }
            },
            //JS数组去重方法
            removeDuplicatedItem(ar) {
                var ret = [];
                for (var i = 0, j = ar.length; i < j; i++) {
                    if (ret.indexOf(ar[i]) === -1) {
                        ret.push(ar[i]);
                    }
                }
                return ret;
            }
        },
        components: {
            tabs
        },
        layout(){
            return 'store'
        },
        created () {
            this.session_id = sessionStorage.getItem("session_id");
            console.log(this.session_id);
            this.itemData=JSON.parse(JSON.stringify(this.itemDataNew));
            //init&format 格式化后端数据
            this.itemData.forEach(item => {
                itemsOptions.push(item.id);
            });
            this.items = itemsOptions;
            console.log(this.itemData);
        },
        computed: {
            ...mapState('index/store/store', {
                itemDataNew: state => state.shoppingCartData,
            }),
            totalPrice(){
                let total_price = 0;
                this.itemData.forEach((item, index) => {
                    if (this.checkedItems.indexOf(item.id) !== -1) {
                        total_price += Math.floor(item.item_total_price*100)/100;
                    }
                });
                return parseFloat(total_price).toFixed(2);
            },

        }
    }
</script>
<style>
#el-checkbox .el-checkbox__label{
    color:transparent;
}
</style>
<style lang="less" scoped>
    @import "~~assets/less/store/shoppingCart";
</style>