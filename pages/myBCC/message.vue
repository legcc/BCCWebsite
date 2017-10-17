<template>
    <div class="table-container">
        <nav class="resources-nav">
            <!--
            <section class="nav-left-side">
                <em class="breadcrumb active">All Message</em>
                <em class="breadcrumb">System Message</em>
                <em class="breadcrumb">Order Message</em>
            </section>
            -->
            <section class="nav-right-side">
                <em class="nav-legend">Status</em>
                <el-select v-model="selectStatus" placeholder="All Status">
                    <el-option
                            v-for="item in messageStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input class="nav-el-input" v-model="keywords" placeholder="Please Enter"></el-input>
                <button class="nav-btn" @click="searchMessageTable">Search</button>
            </section>
        </nav>
        <article class="content-table">
            <!--<p class="info-desc">-->
            <!--</p>-->
            <template v-if="messageTableData.length > 0">
                <el-table
                        :stripe="true"
                        :data="formatTableData"
                        border
                        class="el-table-div"
                        @cell-mouse-enter="checkRow"
                        :default-sort="{prop: 'date', order: 'descending'}">
                    <el-table-column
                            align="center"
                            prop="messageType"
                            label="Message Type"
                            width="150"
                    >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="title"
                            label="Title"
                    >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="sendTime"
                            label="Message Time"
                            width="150"
                    >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="readStatus"
                            label="Status"
                            width="120"
                    >
                    </el-table-column>
                    <el-table-column
                            label="Action"
                            align="center"
                            width="90"
                    >
                        <template scope="scope">
                            <nuxt-link :to="{name:'myBCC-messageDetail',query:{messageId:selectId}}" tag="button"
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
                        You haven’t received any new message!
                    </p>
                </div>
            </template>
        </article>
        <footer class="footer">
            <template v-if="messageTableData.length > 0">
                <el-pagination
                        class="table-info-pagination"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="messageTableData.length">
                </el-pagination>
            </template>
        </footer>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch({isServer, store}){
            //加载数据
            store.dispatch("index/myBCC/myBCC/changeEntryActive", "message");
            await Promise.all([store.dispatch("index/myBCC/myBCC/setMessageOptions"),
                store.dispatch("index/myBCC/myBCC/searchMessageTable")]);
        },
        data () {
            return {
                CURRENT_PATH: [{
                    name: "Message",
                    url: "myBCC-message"
                }],
                DETAIL_TITLE: ["MESSAGE DETAIL"],
                selectStatus: "0",
                keywords: "",
                pageNum: 1,
                //每页显示数量
                pageSize: 10,
                selectId: ""
            }
        },
        methods: {
            searchMessageTable(){
                this.$store.dispatch("index/myBCC/myBCC/searchMessageTable", {
                    keywords: this.keywords || "0",
                    status: this.selectStatus || "0",
                    page: this.page || "0",
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
                messageStatusOptions: state => state.messageStatusOptions,
                messageTableData: state => state.messageTableData
            }),
            formatTableData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return this.messageTableData.slice(begin, count * pageNum);
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
