<template>
    <div>
        <div class="main-title">
            Edit Class
            <button class="submmit-btn btn_right" @click="deleteClass">Delete</button>
        </div>
        <div class="main-view">
            <div class="add-class-from">
                <table class="" v-loading.body="loading">
                    <tbody>
                    <tr>
                        <td>Class Auth Code:</td>
                        <td>
                            <input v-model="classAuthCode" class="input-component" type="text" readonly>
                        </td>
                        <td class="e-hint"></td>
                    </tr>
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
                            <el-select v-model="levelId" placeholder="Please Select" class="selector">
                                <el-option
                                        v-for="item in levelsOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>

                        </td>
                    </tr>
                    <tr>
                        <td><em>*</em>Class Age:</td>
                        <td>
                            <el-select v-model="classAge" placeholder="Please Select" class="selector">
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
                            <el-select v-model="learningYear" placeholder="Please Select" class="selector">
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
                            <el-select v-model="teachingWeek" placeholder="Please Select" class="selector">
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
                            <el-select v-model="keyStage" placeholder="Please Select" class="selector">
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
                        <td></td>
                        <td>
                            <button class="submmit-btn" :disabled="submitPrevent"
                                    @click="submitPrevent || submitForm()">Update
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
    </div>
</template>
<script>
    import Vue from 'vue';
    import axios from 'axios';
    import utils from '~/plugins/utils';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    const nodePath = require('~/static/server.config.js').nodePath;
    @Component({
        async fetch({store, query}) {
            await Promise.all([
                store.dispatch('index/educator/educator/changeEntryActive', 'myClass'),
                store.dispatch("index/educator/editClass/getOptions"),
                store.dispatch("index/educator/editClass/getFormData", {class_id: query.classId}),
                store.dispatch("index/educator/editClass/getEducatorAuthCodeNum")
            ])
        },
        asyncData({query}){
            return {
                classId: query.classId
            }
        },
        methods: {
            ...mapActions('index/educator/educator', ['changeCurrentPath', 'changeEntryActive'
            ]),
            deleteClass(){
                let confirm_msg = 'Are you sure you want to delete the class information ?';
                if(this.formData.studentNum>0){
                    //当前班级中有学生时，删除提醒
                    confirm_msg = 'There are students in the class. Are you sure you want to delete this class and student information?';
                }
                this.$confirm(confirm_msg, 'Notice', {
                    confirmButtonText: 'yes',cancelButtonText: 'no',type: 'warning'
                }).then((resolve) => {
                    return utils.sendAxiosPost(`/api/educator/deleteMyClass`, {
                        uid: this.$store.state.authUser.uid,
                        classIds: this.classId
                    })
                }).then((res) => {
                    if (res.data && res.data.status_code) {
                        this.$_success('Deleted!');
                    } else {
                        this.$_message('Delete Failed!');
                    }
                    setTimeout(() => {
                        this.$router.push({name:"educator-myClass"})
                    }, 2000);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Cancelled'
                    });
                });
            }
        },
        computed: {
            ...mapState('index/educator/editClass', {
                authNum: state => state.authNum,
                formData: state => state.formData
            }),
            ...mapGetters('index/educator/editClass', [
                'levelsOption',
                'classAgeOption',
                'learningYearsOption',
                'teachingWeekOption',
                'keyStageYear',
                'status'
            ])
        }
    })
    export default class editClass extends Vue {
        nodePath = nodePath;
        CURRENT_PATH = [{
            name: "My Class",
            url: "educator-myClass"
        }, {
            name: "Edit Class",
            url: "educator-editClass"
        }];
        levelId = "";
        submitPrevent = false;
        classAge = "";
        learningYear = "";
        teachingWeek = "";
        keyStage = "";
        className = "";
        classAuthCode = "";
        loading = false;
        UPLOAD_STUDENT_PATH = {name: 'educator'};
        tipContent = "hello";

        async submitForm() {
            //阻止重复提交
            this.submitPrevent = true;
            this.loading = true;
            let data = new FormData();
            data.append('uid', this.$store.state.authUser.uid);
            data.append('name', this.className);
            data.append('levelId', this.levelId);
            data.append('classId', this.classId);
            data.append('classAge', this.classAge);
            data.append('learningYears', this.learningYear);
            data.append('teachingHours', this.teachingWeek);
            data.append('keyStageYear', this.keyStage);
            try {
                let httpData = (await axios.post(`${this.httpPath}/api/educator/updateMyClass`, data));
                this.loading = false;
                if(httpData.status && httpData.data.status_code === 200){
                    this.$_success("Update Successful！");
                    this.$router.push(this.UPLOAD_STUDENT_PATH);
                }else{
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
                        this.$_success(httpData.data.message);
                        this.$router.push(this.UPLOAD_STUDENT_PATH);
                    }
                }
            
                this.submitPrevent = false;
            } catch (e) {
                console.error(e);
                this.loading = false;
                this.submitPrevent = false;
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }

        get dialogTitle() {
            let title;
            +this.status === 0 ? title = 'ADD RESOURCE' : 'ACTIVATE RESOURCE';
            return title;
        }

        echoForm(formArr, dataArr) {
            formArr.forEach((item, index) => {
                this[item] = this.formData[dataArr[index]] + "";
                this[item] === "0" ? this[item] = "" : "";
            })
        }

        created() {
            this.changeCurrentPath(this.CURRENT_PATH);
            this.echoForm(['classAuthCode','className', 'levelId', 'classAge', 'learningYear', 'teachingWeek', 'keyStage'],
                ['class_auth_code','name', 'level_id', 'class_age', 'learning_years', 'teaching_hours', 'key_stage_year']);
        }
    }
</script>
<style lang="less">
    @import "~~assets/less/educator/addClass";
    @import "~~assets/less/element/dialog";
</style>
<style>
    .btn_right{
        float: right;
        margin-top: .1rem;
        margin-right: .25rem
    }
</style>