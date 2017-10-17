<template>
    <div class="table-container">
        <nav class="resources-nav">
            <section class="nav-left-side">
                <em class="nav-legend">Order Time</em>
                <el-date-picker
                        class="date-picker"
                        v-model="orderTime"
                        type="daterange"
                        :editable="false"
                        placeholder="Select a date range">
                </el-date-picker>
            </section>
            <section class="nav-right-side">
                <em class="nav-legend">Status</em>
                <el-select v-model="selectStatus" placeholder="All Status">
                    <el-option
                            v-for="item in orderStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input class="nav-el-input" v-model="keywords" placeholder="Please Enter"></el-input>
                <button class="nav-btn" @click="searchOrderTable">Search</button>
            </section>
        </nav>
        <article class="content-table">
            <!--<p class="info-desc">-->
            <!--</p>-->
            <template v-if="orderTableData.length > 0">
                <el-table
                        :stripe="true"
                        :data="formatTableData"
                        border
                        class="el-table-div"
                        @cell-mouse-enter="checkRow"
                        :default-sort="{prop: 'date', order: 'descending'}">
                    <el-table-column
                            prop="orderNo"
                            label="Order No"
                            align="center"
                            width="200"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="orderTime"
                            label="Order Time"
                            align="center"
                            width="170"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="payType"
                            label="Pay Type"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="shouldPayment"
                            label="Should Payment"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="actualPayment"
                            label="Actual Payment"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="Status"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            label="Action"
                            align="center"
                            width="90"
                    >
                        <template scope="scope">
                            <nuxt-link :to="{name:'myBCC-orderDetail',query:{orderId:selectId}}" tag="button"
                                       @click="(row)"
                                       type="text" size="small">View
                            </nuxt-link>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template v-else>
                <div class="empty-notice">
                    <p class="tip-sentence">
                        You haven't placed an order yet, Go to store to have a look!
                    </p>
                    <nuxt-link :to="{name: 'store'}" class="link-entry">Go to Store</nuxt-link>
                </div>
            </template>
        </article>
        <footer class="footer">
            <template v-if="orderTableData.length > 0">
                <el-pagination
                        class="table-info-pagination"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="orderTableData.length">
                </el-pagination>
            </template>
        </footer>
    </div>
</template>
<script>
    import utils from '~/plugins/utils'
    import {mapState, mapActions} from 'vuex'
    export default {
        async fetch({isServer, store}){
            //加载数据
            store.dispatch("index/myBCC/myBCC/changeEntryActive", "order");
            await Promise.all([store.dispatch("index/myBCC/myBCC/setOrderOptions"),
                store.dispatch("index/myBCC/myBCC/searchOrderTable")])
        },
        data () {
            return {
                CURRENT_PATH: [{
                    name: "My Order",
                    url: "myBCC-order"
                }],
                orderTime: [],
                selectStatus: "0",
                keywords: '',
                pageNum: 1,
                //每页显示数量
                pageSize: 10,
                selectId: ""
            }
        },
        methods: {
            searchOrderTable(){
                let endTime = this.orderTime.length && this.orderTime[1] && utils.dateFormat.call(new Date(this.orderTime[1].getTime() + (86399 * 1000)), 'yyyy-MM-dd hh:mm:ss'),
                    startTime = this.orderTime.length && this.orderTime[0] && utils.dateFormat.call(this.orderTime[0], 'yyyy-MM-dd hh:mm:ss');
                this.$store.dispatch("index/myBCC/myBCC/searchOrderTable", {
                    keywords: this.keywords || "0",
                    startTime: startTime || "0",
                    'endTime': endTime || "0",
                    status: this.selectStatus || "0",
                });
            },
            ...mapActions('index/myBCC/myBCC', [
                'changeCurrentPath'
            ]),
            checkRow(row, cell) {
                this.selectId = row.id;
            }
        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH)
        },
        computed: {
            ...mapState("index/myBCC/myBCC", {
                orderStatusOptions: state => state.orderStatusOptions,
                orderTableData: state => state.orderTableData
            }),
            formatTableData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return this.orderTableData.slice(begin, count * pageNum);
            }
        },
        components: {}
    }
</script>
<style lang="less">
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/tab_pagination";
</style>