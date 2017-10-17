<template>
    <div>
        <div class="main-title">
            Add Class
        </div>
        <div class="main-view">
            <div class="cl-hint">
                You can add more <em>{{authNum}}</em> students into your class under your account, <em>{{totalStudentNum}}</em> are already added, <nuxt-link :to="'/store'" target="_blank">Click here</nuxt-link> to add more.
                After your students added succesfully, the students' account shall be generated automatically and mail to you, and you will be able to view and to track their learning record and performance.
            </div>
            <div class="add-class-from">
                <table class="" v-loading.body="loading">
                    <tbody>
                    <tr>
                        <td><em>*</em>Class Name:</td>
                        <td>
                            <input placeholder="Please enter your class name" v-model="className"
                                   class="input-component" type="text">
                        </td>
                        <td class="e-hint"></td>
                    </tr>
                    <tr>
                        <td><em>*</em>Choose level of your class:</td>
                        <td>
                            <el-select v-model="level" class="select-component" placeholder="Please Select">
                                <el-option
                                        v-for="item in levelsOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="e-hint">
                            <el-tooltip class="item" effect="dark" :content="tipContent" placement="top">
                                    <span class="round-container">
                                        <i class="question-icon">?</i>
                                    </span>
                            </el-tooltip>
                            <el-button type="text" @click="dialogVisible = true"
                                       class="hint-btn" v-if="+hasResource === 0">
                                Add Resources
                            </el-button>
                            <el-button type="text" @click="dialogVisible = true"
                                       class="hint-btn" v-if="+hasResource === 1">
                                Activate Resources
                            </el-button>
                        </td>
                    </tr>
                    <tr>
                        <td><em>*</em>Class Age:</td>
                        <td>
                            <el-select v-model="classAge" class="select-component" placeholder="Please Select">
                                <el-option
                                        v-for="item in classAgeOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="e-hint"></td>
                    </tr>
                    <tr>
                        <td><em>*</em>Years of learning Mandarin:</td>
                        <td>
                            <el-select v-model="learningYear" class="select-component" placeholder="Please Select">
                                <el-option
                                        v-for="item in learningYearsOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="e-hint"></td>
                    </tr>
                    <tr>
                        <td><em>*</em>Presumed hr of teaching/week:</td>
                        <td>
                            <el-select v-model="teachingWeek" class="select-component" placeholder="Please Select">
                                <el-option
                                        v-for="item in teachingWeekOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="e-hint"></td>
                    </tr>
                    <tr>
                        <td>Key Stage Year(if applicable):</td>
                        <td>
                            <el-select v-model="keyStage" class="select-component" placeholder="Please Select">
                                <el-option
                                        v-for="item in keyStageYear"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="e-hint"></td>
                    </tr>
                    <tr>
                        <td>Upload Student List:</td>
                        <td>
                            <input placeholder="Please upload your students list in excel." v-model="this.fileName"
                                   class="input-component" type="text" disabled>
                        </td>
                        <td>
                            <template v-if="authNum > 0">
                                <label class="upload-btn">
                                    <input ref="fileTool" class="upload-input"
                                           type="file" @change="handleFileChange" :disabled="false">
                                    Upload
                                </label>
                            </template>
                            <template v-else>
                                <label class="upload-btn-disable" title="Please note you can add 0 student now.">
                                    <input ref="fileTool" class="upload-input"
                                           type="file" @change="handleFileChange" :disabled="true">
                                    Upload
                                </label>
                            </template>
                        </td>
                    </tr>
                    <tr>
                    <tr>
                        <td></td>
                        <td>
                            <a :href="`${backEndImgPath}/tools/template/T1_Student_Account_V1.0.xls`"
                               class="download-it">
                                Download Student list Template
                            </a>
                        </td>
                        <td class="note">Please do not change the file name of the template when you save and upload it.</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button class="submmit-btn" :disabled="submitPrevent"
                                    @click="submitPrevent || submitForm()">Save
                            </button>
                            <nuxt-link :to="{name:'educator-myClass'}">
                                <button type="button" class="back-btn-l">Cancel</button>
                            </nuxt-link>
                        </td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--弹窗 Start-->
        <el-dialog class="dialog-container"
                   :visible.sync="dialogVisible"
                   size="tiny"
                   :show-close="false">
            <article v-if="+hasResource === 0">
                <h2 class="title">ADD RESOURCES</h2>
                <section>
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
                        <nuxt-link :to="{name:'store'}" class="dialog-link" target="_blank">Buy New Resource?
                        </nuxt-link>
                    </p>
                </section>
            </article>
            <!--active-->
            <article v-if="+hasResource === 1">
                <h2 class="title">ACTIVATE RESOURCES</h2>
                <label>
                    <em class="dialog-input-legend">Resource:</em>
                    <el-select v-model="resourceId" placeholder="Please Select" class="dialog-selector">
                        <el-option
                                v-for="item in resourceOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <p class="website">
                        <nuxt-link :to="{name:'myBCC-resources'}" target="_blank" class="dialog-link">
                            Add more Resource?
                        </nuxt-link>
                    </p>
                </label>
            </article>
            <span slot="footer" class="dialog-footer">
                <button class="dialog-btn submit" type="button" @click="activeResource">Confirm</button>
                <button class="dialog-btn cancel" type="button" @click="dialogVisible = false">Cancel</button>
            </span>
        </el-dialog>
        <!--弹窗 End-->
    </div>
</template>
<script>
    import axios from 'axios';
    import utils from '~/plugins/utils';
    import {mapState, mapGetters, mapActions} from 'vuex';
    const backEndImgPath = require('~/static/server.config.js').backEndImgPath;
    export default {
        async fetch({store}){
            await Promise.all([
                store.dispatch('index/educator/educator/changeEntryActive', 'myClass'),
                store.dispatch("index/educator/myClass/getStudent"),
                store.dispatch("index/educator/addClass/getOptions"),
                store.dispatch("index/educator/addClass/getEducatorAuthCodeNum")
            ]);
        },
        data () {
            return {
                backEndImgPath,
                loading: false,
                //弹窗
                resourceId: "",
                authCode: "",
                fileName: "",
                isActivate: 1,
                dialogVisible: false,
                CURRENT_PATH: [{
                    name: "My Class",
                    url: "educator-myClass"
                }, {
                    name: "Add Class",
                    url: "educator-addClass"
                }],
                level: "",
                submitPrevent: false,
                classAge: "",
                learningYear: "",
                teachingWeek: "",
                keyStage: "",
                className: "",
                UPLOAD_STUDENT_PATH: {name: 'educator-uploadStudent'},
                MY_CLASS_PATH: {name: 'educator-myClass'},
                tipContent: "You can use the activation code to add a new service or activate an existing service."
            }
        },
        methods: {
            ...mapActions('index/educator/educator', [
                'changeCurrentPath',
                'changeEntryActive'
            ]),
            ...mapActions('index/educator/addClass', [
                'removeResourceOption'
            ]),
            ...mapActions('index/educator/uploadStudent', [
                'setExcelData'
            ]),
            handleFileChange (e) {
                let inputDOM = this.$refs.fileTool;
                // 通过DOM取文件数据
                this.file = inputDOM.files[0];
                // 这里就可以获取到文件的名字了
                this.fileName = this.file.name;
            },
            async activeResource(){
                if (+this.hasResource === 1) {
                    this.loading = true;
                    let res = await utils.sendAxiosGet('/api/resource/activeCurrentResource',
                        ['uid', 'resourceId'], {
                            uid: this.$store.state.authUser.uid,
                            resourceId: this.resourceId
                        });
                    if (res.status && res.data.status_code === 200) {
                        this.$_success("Resource activated successfully!");
                    } else if (res.status && res.data.status_code === 20501) {
                        this.$_message('The resource has been activated!');
                    } else {
                        this.$_error('Resource activation failed!');
                    }
                    this.loading = false;
                    setTimeout(() => {
                        this.dialogVisible = false;
                        window.location.reload();
                    }, 1000);
                } else if (+this.hasResource === 0) {
                    this.loading = true;
                    let res = await utils.sendAxiosGet('/api/resource/addResource',
                        ['uid', 'authcode', 'isActivate'], {
                            uid: this.$store.state.authUser.uid,
                            authcode: this.authCode,
                            isActivate: this.isActivate
                        });
                    if (res.data && +res.data.status_code === 20506) {
                        this.$_success("Resource added/activated successfully!");
                    } else if (res.data && +res.data.status_code === 200) {
                        this.$_success("Resource added successfully!");
                    } else if (res.status && res.data.status_code === 20501) {
                        this.$_message('The resource has been activated!');
                    } else if (res.data && +res.data.status_code === 20504) {
                        this.$_message("The resource has been added!");
                    } else {
                        this.$_message('Resource add failed!');
                    }
                    this.loading = false;
                    setTimeout(() => {
                        this.dialogVisible = false;
                        window.location.reload();
                    }, 1500);
                }
            },
            async submitForm(){
                //阻止重复提交
                this.submitPrevent = true;
                this.loading = true;
                let data = new FormData();
                data.append('uid', this.$store.state.authUser.uid);
                data.append('name', this.className);
                data.append('levelId', this.level);
                data.append('classAge', this.classAge);
                data.append('learningYears', this.learningYear);
                data.append('teachingHours', this.teachingWeek);
                data.append('keyStageYear', this.keyStage);
                data.append('uploadfile', this.$refs.fileTool.files[0]);
                try {
                    let httpData = (await axios.post(`${this.httpPath}/api/educator/createClass`, data)).data;
                    this.loading = false;
                    if (httpData.error) {
                        //如果有验证未通过的表单数据则把错误信息输出
                        for (let key in httpData.error) {
                            setTimeout(() => {
                                this.$notify({
                                    message: httpData.error[key][0],
                                    type: 'error'
                                });
                            })
                        }
                    } else {
                        //把接口获取到的解析过的excel数据获取到 然后存入upload里然后转跳页面
                        if (httpData && +httpData.status_code === 200) {
                            this.$_success("Class added Successfully!");
                            if (httpData.data && httpData.data.length) {
                                //返回Data,需要继续添加学生
                                this.setExcelData(httpData.data);
                                this.$router.push(this.UPLOAD_STUDENT_PATH);
                            } else {
                                //Data无数据，不需要继续添加学生
                                this.$router.push(this.MY_CLASS_PATH);
                            }
                        } else if (httpData && +httpData.status_code === 20022) {
                            this.$_warning("Oops, You’ve had a class with this name already.");
                        }
                    }
                    this.submitPrevent = false;
                } catch (e) {
                    this.loading = false;
                    console.error(e);
                    this.submitPrevent = false;
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            }
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        computed: {
            ...mapState('index/educator/addClass', {
                authNum: state => state.authNum
            }),
            ...mapState("index/educator/myClass", {
                studentOptions: state => state.studentOptions,
                totalStudentNum: state => state.totalStudentNum,
            }),
            ...mapGetters('index/educator/addClass', [
                'levelsOption',
                'classAgeOption',
                'learningYearsOption',
                'teachingWeekOption',
                'keyStageYear',
                'hasResource',
                'resourceOption'
            ]),
            dialogTitle(){
                let title;
                +this.hasResource === 0 ? title = 'ADD RESOURCE' : 'ACTIVATE RESOURCE';
                return title;
            }
        }
    }
</script>
<style lang="less">
    @import "~~assets/less/educator/addClass";
    @import "~~assets/less/element/dialog";
</style>