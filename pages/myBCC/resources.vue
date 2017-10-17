<template>
    <div>
        <el-dialog class="dialog-container"
                   :visible.sync="dialogVisible"
                   size="tiny"
                   :show-close="false">
            <h2 class="title">ADD RESOURCES</h2>
            <article>
                <div class="input-div">
                    <em class="dialog-input-legend">Auth Code:</em>
                    <el-input class="auth-input" v-model="authCode"></el-input>
                </div>
                <div class="input-div">
                    <em class="dialog-input-legend">Activate Now:</em>
                    <span class="option-component">
                    <label class="isActivate">
                        <input name="isActivate" type="radio" value="1" v-model="isActivate">
                        <em class="isActivate-item">YES</em>
                    </label>
                    <label class="isActivate">
                        <input name="isActivate" type="radio" value="0" v-model="isActivate">
                        <em class="isActivate-item">NO</em>
                    </label>
                </span>
                </div>
                <p class="website">
                    <nuxt-link :to="{name:'store'}" class="dialog-link" target="_blank">Buy New Resource?</nuxt-link>
                </p>
            </article>
            <span slot="footer" class="dialog-footer">
            <button class="dialog-btn submit" type="button" @click="submitAuthForm">Confirm</button>
            <button class="dialog-btn cancel" type="button" @click="dialogVisible = false">Cancel</button>
        </span>
        </el-dialog>
        <div class="table-container">
            <nav class="resources-nav">
                <section class="nav-left-side">
                    <em class="nav-legend">Status</em>
                    <el-select v-model="selectStatus" @change="changeCondition" placeholder="All Status">
                        <el-option
                                v-for="item in resourceStatusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <em class="nav-legend level">Level</em>
                    <el-select v-model="selectLevel" @change="changeCondition" placeholder="All Level">
                        <el-option
                                v-for="item in levelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </section>
                <section class="nav-right-side">
                    <button class="nav-long-btn" @click="dialogVisible = true">Add Resources</button>
                </section>
            </nav>
            <article class="content-table" v-loading.body="loading">
                <!--<p class="info-desc">-->
                <!--</p>-->
                <template v-if="resourceTableData.length > 0">
                    <el-table
                            :stripe="true"
                            :data="formatTableData"
                            border
                            class="el-table-div"
                            @cell-mouse-enter="checkRow"
                            :default-sort="{prop: 'date', order: 'descending'}">
                        <el-table-column
                                prop="levelInfo"
                                label="Level"
                                align="center"
                                width="70"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="resourceType"
                                label="Resource Type"
                                align="center"
                                width="120"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="sourceType"
                                label="Source"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="activateTime"
                                label="Active Time"
                                align="center"
                                width="160"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="expiredTime"
                                label="Expire Time"
                                align="center"
                                width="160"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="createTime"
                                label="Create Time"
                                align="center"
                                width="160"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="Status"
                                align="center"
                                width="100"
                        >
                        </el-table-column>
                        <el-table-column
                                label="Action"
                                align="center"
                                width="90"
                        >
                            <template scope="scope">
                                <template v-if="scope.row.statusCode === 0 || scope.row.statusCode === '0'">
                                    <button type="text"
                                            @click="activateResource(selectId)">Activate
                                    </button>
                                </template>
                                <nuxt-link :to="{name:'myBCC-resourceDetail',query:{resourceId:selectId}}" tag="button"
                                           @click="(row)" type="text" size="small">View
                                </nuxt-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <template v-else>
                    <div class="empty-notice">
                        <p class="tip-sentence">
                            There are no resources available!
                        </p>
                        <nuxt-link :to="{name: 'store'}" class="link-entry">Go to Store</nuxt-link>
                    </div>
                </template>
            </article>
            <footer class="footer">
                <template v-if="resourceTableData.length > 0">
                    <el-pagination
                            class="table-info-pagination"
                            layout="prev, pager, next"
                            :page-size="pageSize"
                            :current-page.sync="pageNum"
                            :total="resourceTableData.length">
                    </el-pagination>
                </template>
            </footer>
        </div>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import utils from  '~/plugins/utils'
    export default {
        async fetch({isServer, store}){
            //加载数据
            store.dispatch("index/myBCC/myBCC/changeEntryActive", "resources");
            await Promise.all([store.dispatch("index/myBCC/myBCC/setResourceStatusOptions"),
                store.dispatch("index/myBCC/myBCC/setLevelOptions"),
                store.dispatch("index/myBCC/myBCC/searchResourceTable")]);
        },
        data () {
            return {
                dialogVisible: false,
                loading: false,
                CURRENT_PATH: [{
                    name: "Resources",
                    url: "myBCC-resources"
                }],
                selectStatus: "0",
                selectLevel: "0",
                selectId: "0",
                pageNum: 1,
                //每页显示数量
                pageSize: 10,
                authCode: "",
                isActivate: 1
            }
        },
        methods: {
            async activateResource(selectId) {
                this.loading = true;
                try {
                    let res = await utils.sendAxiosGet('/api/resource/activeCurrentResource', ['uid', 'resourceId'], {
                        uid: this.$store.state.authUser.uid,
                        resourceId: selectId
                    });
                    if (res.status && res.data.status_code === 200) {
                        this.$_success("Resource activate successful!");
                    } else if (res.status && res.data.status_code === 20501) {
                        this.$_message('The resource has been activated!');
                    } else {
                        this.$_error('Resource activate failed!');
                    }
                    this.loading = false;
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } catch (e) {

                }
            },
            async submitAuthForm(){
                this.loading = true;
                let res = await  utils.sendAxiosGet('/api/resource/addResource', ['uid', 'authcode', 'isActivate'], {
                    uid: this.$store.state.authUser.uid,
                    authcode: this.authCode,
                    isActivate: this.isActivate
                });
                if (res.data && +res.data.status_code === 20506) {
                    this.$_success("Resource add and activate successful!");
                } else if (res.data && +res.data.status_code === 200) {
                    this.$_success("Resource add successful!");
                } else if (res.status && res.data.status_code === 20501) {
                    this.$_message('The resource has been activated!');
                } else if (res.data && +res.data.status_code === 20504) {
                    this.$_message("The resource has been added!");
                } else {
                    this.$_error('Resource add failed or authorization code type does not match!');
                }
                this.loading = false;
                setTimeout(() => {
                    this.dialogVisible = false;
                    window.location.reload();
                }, 1500);
            },
            checkRow(row, cell){
                this.selectId = row.id;
            },
            changeCondition(){
                this.searchResourceTable({
                    levelId: this.selectLevel || "0",
                    status: this.selectStatus || "0"
                });
            },
            ...mapActions('index/myBCC/myBCC', [
                'searchResourceTable'
            ]),
            ...mapActions('index/myBCC/myBCC', [
                'changeCurrentPath'
            ])
        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH)
        },
        computed: {
            ...mapState("index/myBCC/myBCC", {
                levelOptions: state => state.levelOptions,
                resourceStatusOptions: state => state.resourceStatusOptions,
                resourceTableData: state => state.resourceTableData
            }),
            formatTableData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return this.resourceTableData.slice(begin, count * pageNum);
            }
        },
        components: {}
    }
</script>
<style lang="less">
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/tab_pagination";
    @import "~~assets/less/element/dialog";
</style>