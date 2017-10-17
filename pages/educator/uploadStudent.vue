<template>
    <div class="main-body">
        <div class="table-container">
            <div class="main-title">
                Confirm your upload students accout
            </div>
            <article class="content-table">
                <div class="info-desc">
                    You can add more <em>{{authNum}}</em> students into your class under your account, <em>{{totalStudentNum}}</em> are already added,
                    <nuxt-link :to="'/store'" target="_blank">Click here</nuxt-link> to add more.<br/>
                    The systmer will send the detialed students' account information to your email after you confirmed.
                </div>
                <template v-if="excelData.length > 0">
                    <el-table
                            v-loading.body="loading"
                            :stripe="true"
                            :data="formatTableData"
                            border
                            class="el-table-div"
                            :default-sort="{prop: 'date', order: 'descending'}">
                        <el-table-column
                                prop="student_id"
                                label="Student ID"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="classname"
                                label="Class Name"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="student_name"
                                label="Student Name"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                label="Action"
                                align="center"
                                width="115"
                        >
                            <template scope="scope">
                                <el-button
                                        @click="deleteRow(scope.$index)"
                                        type="text" size="small">
                                    Delete
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </article>
            <footer class="footer">
                <template v-if="excelData.length > 0">
                    <el-pagination
                            class="table-info-pagination"
                            layout="prev, pager, next"
                            :page-size="pageSize"
                            :current-page.sync="pageNum"
                            :total="excelData?excelData.length:0">
                    </el-pagination>
                </template>
                <div class="upload-operation">
                    <nuxt-link :to="MY_CLASS_PATH">
                        <button class="upload-operation">Cancel</button>
                    </nuxt-link>
                    <button class="upload-submit" :disabled="submitPrevent" @click="submitPrevent || submitForm()">
                        Confirm
                    </button>
                </div>
            </footer>
        </div>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex';
    import axios from 'axios';
    export default {
        async fetch({isServer, store, redirect}){
            isServer && redirect('/educator')
            await store.dispatch("index/educator/addClass/getEducatorAuthCodeNum");
            await store.dispatch("index/educator/myClass/getStudent");
        },
        data () {
            return {
                loading: false,
                pageSize: 7,
                pageNum: 1,
                submitPrevent: false,
                MY_CLASS_PATH: {name: 'educator-myClass'},
                FOR_WARD_PATH: {name: 'educator'},
                CURRENT_PATH: [{
                    name: "My Class",
                    url: "educator-myClass"
                }, {
                    name: "Upload Student",
                    url: "educator-uploadStudent"
                }]
            }
        },
        methods: {
            ...mapActions('index/educator/educator', [
                'changeCurrentPath'
            ]),
            async deleteRow(index){
                this.$confirm('Are you sure you to delete ?', 'prompt', {
                    confirmButtonText: 'yes',
                    cancelButtonText: 'no',
                    type: 'warning'
                }).then(() => {
                    //Mark by allen 报错；
                    //this.excelData.splice(index, 1);
                    //this.excelData.$remove(index);
                    this.$store.dispatch("index/educator/uploadStudent/deleteExcelData", index);
                    this.$message({
                        type: 'success',
                        message: 'Delete Successful!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Cancel Successful!'
                    });
                });
            },
            async submitForm(){
                try {
                    this.loading = true;
                    this.submitPrevent = true;
                    const formData = new FormData();
                    formData.append('uid', this.$store.state.authUser.uid)
                    formData.append('levelId', this.excelData[0].levelId)
                    formData.append('classId', this.excelData[0].classId)
                    formData.append('num', this.authNum)
                    formData.append('student', JSON.stringify(this.excelData))
                    let res = (await  axios.post(`${this.httpPath}/api/educator/storeStudents`, formData));
                    let httpData = res.data;
                    this.loading = false;
                    this.submitPrevent = false;
                    if (httpData.status_code === 200) {
                        this.$_success('Submit Successful! Please Check your email for Your students’ accounts and passwords.');
                        setTimeout(() => {
                            this.$router.push(this.FOR_WARD_PATH);
                            window.location.reload();
                        }, 4000);
                    } else if (httpData.status_code === 20503) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else if (httpData.data) {
                        let account = [];
                        httpData.data.forEach(item => {
                            account.push(item.account);
                        });
                        this.$_warning(`These accounts already exist ( ${account.join('、')} )`);
                    }
                } catch (e) {
                    this.loading = false;
                    this.submitPrevent = false;
                }
            }
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        computed: {
            ...mapState('index/educator/uploadStudent', {
                excelData: state => state.excelData
            }),
            ...mapState("index/educator/myClass", {
                totalStudentNum: state => state.totalStudentNum
            }),
            ...mapState('index/educator/addClass', {
                authNum: state => state.authNum,

            }),
            formatTableData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count;
                return this.excelData.slice(begin, count * pageNum);
            }
        },
        components: {}
    }
</script>
<style lang="less">
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/tab_pagination";
    @import "~~assets/less/educator/uploadStudent";
</style>
