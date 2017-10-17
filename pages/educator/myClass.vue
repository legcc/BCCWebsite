<template>
    <div class="class-content" v-loading.body="loading">
        <tabs :labels="labels" :defaultActive="labels[2]">
            <article slot="My Class">
                <div class="class-view" v-if="!addshow">
                    <!--select-->
                    <div class="resources-select">
                        <nav class="resources-nav">
                            <section class="nav-left-side">
                                <div class="btn-type">
                                    <em class="nav-legend ">Level</em>
                                    <el-select v-model="selectLevel" @change="changeLevel">
                                        <el-option
                                                v-for="item in levelOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </section>
                        </nav>
                        <p class="info-desc">
                            Before you create a class, make sure that you have purchased and activated the corresponding resources. You can also
                            <nuxt-link :to="'/myBCC/resources'" target="_blank">Click Here</nuxt-link>
                            to add or activate resources. You can add <em>{{authNum}}</em> students now. <nuxt-link :to="'/store'" target="_blank">Click here</nuxt-link> to add more.
                        </p>
                    </div>
                    <div class="content-view">
                        <ul class="class-operation">
                            <nuxt-link :to="'/educator/addClass'">
                                <li class="add-class">
                                    <div class="tb">
                                        <div class="img-container">
                                            <img class="class-info-bear" src="~assets/img/class/add-class.svg" alt=""/>
                                        </div>
                                        <h1>Add Class</h1>
                                    </div>
                                </li>
                            </nuxt-link>
                            <li class="class-info" v-for="info in formatClassData">
                                <div class="class-info-start">
                                    <div :class="LEVEL_BG[info.levelId]">
                                        <div class="img-container">
                                            {{info.classname}}
                                        </div>
                                    </div>
                                    <ul class="class-introduction">
                                        <li>Last Lesson:<em>{{info.lastLesson}}</em></li>
                                        <template v-if="info.lessonTime == '0000-00-00 00:00:00'">
                                            <li>Lesson Time:<em>Not Start</em></li>
                                        </template>
                                        <template v-if="info.lessonTime != '0000-00-00 00:00:00'">
                                            <li>Lesson Time:<em>{{info.lessonTime}}</em></li>
                                        </template>
                                        <template v-if="info.studentsNum < 1">
                                            <li>Students Num:<em>None students added</em></li>
                                        </template>
                                        <template v-if="info.studentsNum > 0">
                                            <li>Students Num:<em>{{info.studentsNum}}</em></li>
                                        </template>
                                    </ul>
                                </div>
                                <div class="class-info-shade">
                                    <div class="info-shade">
                                        <div class="tb">
                                            <nuxt-link
                                                    :to="{name:'educator-courseList',query:{levelId:info.levelId,classId:info.id}}">
                                                <button>Class Begin</button>
                                            </nuxt-link>
                                            <nuxt-link
                                                    :to="{name:'educator-editClass',query:{classId:info.id}}">
                                                <button>Edit Class</button>
                                            </nuxt-link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <footer class="footer">
                        <template v-if="classOptions.length > 0">
                            <el-pagination
                                    class="table-info-pagination"
                                    layout="prev, pager, next"
                                    :page-size="pageSize"
                                    :current-page.sync="pageNum"
                                    :total="classOptions.length">
                            </el-pagination>
                        </template>
                    </footer>
                </div>
                <div class="class-init" v-if="addshow">
                    <p class="class-init-hint">You have not set up your Class yet,<br/>you may
                        <nuxt-link :to="'/educator/addclass'">Click Here</nuxt-link>
                        to set up!
                    </p>
                </div>
            </article>
            <!--student-->
            <article slot="My Student">
                <!--add student弹框 Start -->
                <el-dialog class="dialog-container"
                           :visible.sync="dialogVisible"
                           size="tiny"
                           :show-close="false">
                    <article>
                        <h2 class="title">ADD STUDENT</h2>
                        <p class="tips">
                            You can add <em>{{authNum}}</em> students now.
                        </p>
                        <label>
                            <em class="dialog-input-legend">Class:</em>
                            <el-select v-model="addStudentForm.classId" placeholder="Please Select"
                                        class="dialog-selector">
                                <el-option
                                        v-for="item in studentSelectOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </label>
                        <label><em class="dialog-input-legend">Student Id:</em>
                            <el-input class="dialog-input" v-model="addStudentForm.id"></el-input>
                        </label>
                        <label><em class="dialog-input-legend">Student Name:</em>
                            <el-input class="dialog-input" v-model="addStudentForm.name"></el-input>
                        </label>
                    </article>
                    <span slot="footer" class="dialog-footer">
                        <template v-if="authNum < 1">
                            <button class="dialog-btn dis-submit" :disabled="true" type="button"
                                    @click="addStudentSubmit">Confirm</button>
                        </template>
                        <template v-if="authNum > 0">
                            <button class="dialog-btn submit" :disabled="false" type="button" @click="addStudentSubmit">Confirm</button>
                        </template>
                        <button class="dialog-btn cancel" type="button" @click="dialogVisible = false">Cancel</button>
                    </span>
                </el-dialog>
                <!--add student弹框 End -->
                <div class="table-container">
                    <nav class="resources-nav">
                        <section class="nav-left-side">
                            <div class="btn-type">
                                <em class="nav-legend ">Class</em>
                                <el-select class="el-long-select" v-model="selectClass" @change="changeStudentData">
                                    <el-option
                                            v-for="item in studentSelectOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </section>
                        <section class="nav-right-side teacher">
                            <template v-if="selectClass > 0">
                                <label class="upload-btn">
                                    <input ref="fileTool" @change="uploadStudent" :disabled="false"
                                           class="upload-input" type="file">
                                    Upload Students
                                </label>
                            </template>
                            <template v-if="selectClass < 1">
                                <label class="upload-btn-disable" title="Please select class first.">
                                    <input ref="fileTool" @change="uploadStudent" :disabled="true"
                                           class="upload-input" type="file">
                                    Upload Students
                                </label>
                            </template>
                            <button class="nav-right-btn" @click="dialogVisible = true">Add Student</button>
                        </section>
                    </nav>
                    <article class="info-desc"><!-- 此处请不要将article修改成p或者div,否则报错 -->
                        You can add more <em>{{authNum}}</em> students into your class under your account, <em>{{totalStudentNum}}</em>
                        are already added,
                        <nuxt-link :to="'/store'" target="_blank">Click here</nuxt-link> to add more.
                        After your students added succesfully, the students' account shall be generated automatically and mail to you, and you will be able to view and to track their learning record and performance. <a
                            :href="`${backEndImgPath}/tools/template/T1_Student_Account_V1.0.xls`">Click here</a>
                        to download students' template.
                    </article>
                    <article class="content-table">
                        <template v-if="studentOptions.length > 0">
                            <el-table
                                    :stripe="true"
                                    :data="formatStudentData"
                                    border
                                    style="width: 100%"
                                    :default-sort="{prop: 'date', order: 'descending'}"
                                    :fit="true"
                                    ref="table"
                                    @row-click="handleCurrentChange"
                                    @selection-change="handleSelectionChange">
                                <el-table-column
                                  type="selection"
                                  width="55"
                                  align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="classname"
                                        label="ClassName"
                                        align="center"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="level"
                                        label="Level"
                                        align="center"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="studentName"
                                        label="Student Name"
                                        align="center"
                                        width="160"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="studentId"
                                        label="Student ID"
                                        align="center"
                                        width="160"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="account"
                                        label="Account"
                                        align="center"
                                        width="160"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="createTime"
                                        label="Create Time"
                                        align="center"
                                        width="170"
                                >
                                </el-table-column>
                                
                                <el-table-column
                                        label="Action"
                                        align="center"
                                >
                                    <template scope="scope">
                                        <el-button
                                                @click="deleteRow(scope)"
                                                class="table-action" type="text" size="small">
                                            Delete
                                        </el-button>
                                    </template>
                                </el-table-column>
                                
                            </el-table>
                        </template>
                    </article>
                    <footer class="footer">
                        <template v-if="studentOptions.length > 0">
                            <el-pagination
                                    class="table-info-pagination"
                                    layout="prev, pager, next"
                                    :page-size="stuPageSize"
                                    :current-page.sync="stuPageNum"
                                    :total="studentOptions?studentOptions.length:0">
                            </el-pagination>
                        </template>
                        <template>
                            <button type="button" @click="deleteAll" :disabled="multipleSelection.length === 0" class="right-btn">Delete</button>
                        </template>
                    </footer>
                </div> 
            </article>
            <!--My Course-->
            <article slot="My Course">
                <div class="main-view">
                    <ul class="learner-Level-list">
                        <li class="level-info" v-for="(info,index) in statusOptions">
                            <nuxt-link :to="{name:'educator-courseList',query:{levelId:info.id}}"
                                       v-if="info.lock==0" class="level-info-start">
                                <div class="tb">
                                    <div class="img-box">
                                        <img class="level-info-bear" :src="IMGSET[levelInfo[index].icon]" alt=""/>
                                    </div>
                                    <h1 class="level-title">{{levelInfo[index].title}}</h1>
                                </div>
                            </nuxt-link>
                            <nuxt-link :to="'/store'" v-if="info.lock==1" class="level-info-start">
                                <div class="tb">
                                    <div class="img-box">
                                        <img class="level-info-bear" :src="IMGSET[levelInfo[index].icon]" alt=""/>
                                    </div>
                                    <h1 class="level-title">{{levelInfo[index].title}}</h1>
                                </div>
                            </nuxt-link>
                            <nuxt-link :to="'/store'" target="_blank" v-if="info.lock==1" class="level-info-shade-lock" title="Please click here to purchase all other levels.">
                            </nuxt-link>
                        </li>
                    </ul>
                    <p class="content-note">Note: You can use free trail courses or buy the courses which you need, or you can
                        <nuxt-link :to="'/myBCC/resources'" target="_blank">click here</nuxt-link>
                        to activate your courses.
                    </p>
                </div>
            </article>
        </tabs>
    </div>
</template>
<script>
    import tabs from "~/components/tabs";
    import axios from "axios";
    import utils from '~/plugins/utils';
    import {mapState, mapActions} from 'vuex';
    const backEndImgPath = require('~/static/server.config.js').backEndImgPath;
    export default {
        async fetch({store, redirect}){
            try {
                await Promise.all([
                    //获取授权数
                    store.dispatch("index/educator/addClass/getEducatorAuthCodeNum"),
                    store.dispatch("index/educator/myClass/getClass"),
                    store.dispatch("index/educator/myClass/setStudentOptions"),
                    store.dispatch("index/educator/myClass/getStudent"),
                    store.dispatch("index/educator/myClass/setOptions"),
                    //获取当前用户可用的LEVEL
                    store.dispatch("index/learner/myCourse/getLevel"),
                ]);
            } catch (e) {
                redirect("/")
            }
            store.dispatch('index/educator/educator/changeEntryActive', 'myClass');
        },
        data () {
            return {
                backEndImgPath,
                loading: false,
                dialogVisible: false,
                CURRENT_PATH: [{
                    name: "My Class",
                    url: "educator-myClass"
                }],
                LEVEL_BG: [
                    '',
                    'class-card lv1-bg',
                    'class-card lv2-bg',
                    'class-card lv3-bg',
                    'class-card lv4-bg',
                    'class-card lv5-bg',
                    'class-card lv6-bg'
                ],
                labels: ["My Course","My Student","My Class"],
                levelInfo: [{
                    icon: 1,
                    title: "Level 1",
                }, {
                    icon: 2,
                    title: "Level 2"
                }, {
                    icon: 3,
                    title: "Level 3"
                }, {
                    icon: 4,
                    title: "Level 4"
                }, {
                    icon: 5,
                    title: "Level 5"
                }, {
                    icon: 6,
                    title: "Level 6"
                }],
                IMGSET: [
                    "",
                    require("~/assets/img/bear_face_icon/level1.png"),
                    require("~/assets/img/bear_face_icon/level2.png"),
                    require("~/assets/img/bear_face_icon/level3.png"),
                    require("~/assets/img/bear_face_icon/level4.png"),
                    require("~/assets/img/bear_face_icon/level5.png"),
                    require("~/assets/img/bear_face_icon/level6.png")
                ],
                addshow: false,
                selectLevel: "0",
                selectClass: "0",
                pageSize: 7,
                pageNum: 1,
                stuPageSize: 9,
                stuPageNum: 1,
                UPLOAD_STUDENT_PATH: {name: 'educator-uploadStudent'},
                addStudentForm: {id: "", name: "", classId: ""},
                multipleSelection: [],//选中的值显示   
            }
        },
        mounted(){
        },
        methods: {
            async uploadStudent(e){
                const files = e.target.files;
                const file = e.target.files[0];
                const formData = new FormData();
                formData.append('uid', this.$store.state.authUser.uid);
                formData.append('classId', this.selectClass);
                formData.append('uploadfile', file);
                try {
                    let res = await axios.post(`${this.httpPath}/api/educator/uploadStudents`, formData);
                    let httpData = res.data;
                    //把接口获取到的解析过的excel数据获取到 然后存入upload里然后转跳页面
                    if (httpData.data) {
                        this.$_success("Upload Successful! Please confirm and submit.");
                        setTimeout(() => {
                        }, 3000);
                    }
                    if (httpData.data && httpData.data.length) {
                        this.setExcelData(httpData.data);
                        this.$router.push(this.UPLOAD_STUDENT_PATH);
                    }
                } catch (e) {
                    console.error(e);
                }
            },
            async addStudentSubmit(){
                this.loading = true;
                this.dialogVisible = false;
                const formData = new FormData();
                formData.append('uid', this.$store.state.authUser.uid);
                formData.append('num', this.authNum);
                formData.append('classId', this.addStudentForm.classId);
                formData.append('student', JSON.stringify([{
                    'student_id': this.addStudentForm.id,
                    'student_name': this.addStudentForm.name
                }]));
                let res = (await  axios.post(`${this.httpPath}/api/educator/storeStudents`, formData));
                let httpData = res.data;
                if (httpData.status_code === 200) {
                    this.$_success('Student added Successful! Please Check your email for Your students’ accounts and passwords.');
                    setTimeout(() => {
                        this.getStudent({classId: this.selectClass});
                    }, 4000);
                } else if(httpData.status_code === 20009){
                    this.$_warning('Student add Failed!The user mailbox does not exist!');
                } else {
                    this.$_warning('Student add Failed!');
                }
                this.loading = false;
            },
            changeLevel(){
                this.getClass({
                    levelId: this.selectLevel
                });
            },
            changeStudentData(){
                this.loading = true;
                this.getStudent({
                    classId: this.selectClass, cover: this
                });
            },
            //处理批量删除学生
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(row, event, column) {  
                this.$refs.table.toggleRowSelection(row)  
            },
            ...mapActions('index/educator/myClass', [
                'getClass', 'getStudent'
            ]),
            ...mapActions('index/educator/educator', ['changeCurrentPath', 'changeEntryActive'
            ]),
            ...mapActions('index/educator/uploadStudent', [
                'setExcelData'
            ]),
            deleteAll(){
                //获取所有选中行的id组成的字符串，以逗号分隔 
                var studentIds = this.multipleSelection.map(item => item.id);
                if (studentIds.length == 0) {
                    this.$_error("Please choose the student first");
                } else {
                    let id_str = '';
                    if (Array.isArray(studentIds)) {
                        id_str = studentIds.join('-');
                    } else {
                        id_str = studentIds;
                    }
                    this.$confirm('Are you sure you want to delete the student information ?', 'Notice', {
                        confirmButtonText: 'yes',
                        cancelButtonText: 'no',
                        type: 'warning'
                    }).then((resolve) => {
                        console.log(id_str);
                        return utils.sendAxiosPost(`/api/educator/deleteStudentFromClass`, {
                            uid: this.$store.state.authUser.uid,
                            student_id: id_str
                        })
                    }).then((res) => {
                        if (res.data && res.data.status_code) {
                            this.$_success('Deleted!');
                        } else {
                            this.$_message('Delete Failed!');
                        }
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: 'Cancelled'
                        });
                    });
                }
            },
            deleteRow(scope){
                const index = scope.$index, id = scope.row.id;
                this.$confirm('Are you sure you want to delete the student information ?', 'Notice', {
                    confirmButtonText: 'yes',
                    cancelButtonText: 'no',
                    type: 'warning'
                }).then((resolve) => {
                    console.log(id);
                    return utils.sendAxiosPost(`/api/educator/deleteStudentFromClass`, {
                        uid: this.$store.state.authUser.uid,
                        student_id: id
                    })
                }).then((res) => {
                    if (res.data && res.data.status_code) {
                        this.$_success('Deleted!');
                    } else {
                        this.$_message('Delete Failed!');
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Cancelled'
                    });
                });
            },
            /*getLevelId(levelName){
                return levelName.match(/(\d)$/) ? levelName.match(/(\d)$/)[0] : 0;
            },*/
        },
        computed: {
            ...mapState('index/educator/addClass', {
                authNum: state => state.authNum
            }),
            ...mapState("index/educator/myClass", {
                classOptions: state => state.classOptions,
                studentOptions: state => state.studentOptions,
                levelOptions: state => state.levelOptions,
                totalStudentNum: state => state.totalStudentNum,
                studentSelectOptions: state => state.studentSelectOptions
            }),
            ...mapState("index/learner/myCourse", {
                statusOptions: state => state.statusOptions,
            }),
            formatClassData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return this.classOptions.slice(begin, count * pageNum);
            },
            formatStudentData(){
                let pageNum = this.stuPageNum;
                const count = this.stuPageSize;
                let begin = (pageNum - 1) * count
                return this.studentOptions.slice(begin, count * pageNum);
            }
        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        components: {
            tabs
        }
    }
</script>

<style lang="less">
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/tab_pagination";
    @import "~~assets/less/element/dialog";
    @import "~~assets/less/educator/myClass";
    @import "~~assets/less/element/common";
    @import "~~assets/less/learner/myCourse";
</style>
