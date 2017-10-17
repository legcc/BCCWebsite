<template>
    <div class="user-setting-container" v-loading.body="loading">
        <tabs :labels="labels" :defaultActive="defaultActive" @changeTab="addPrefixHost">
            <article class="content" slot="Personal Information">
                <ul class="personal-information">
                    <li class="email-li">
                        <label class="option"><span class="option-name"><em>* </em>Email:</span><span
                                class="option-component">{{userInfoForm.email}}</span></label>
                        <nuxt-link :to="{name:'myBCC-securityCenter',query:{module:'email'}}">
                            <span class="change-email">Change Email</span>
                        </nuxt-link>
                    </li>
                    <li>
                        <label class="option"><span class="option-name"><em>* </em>User Name:</span>
                            <span class="option-component component-input">
                                <input :value="userInfoForm.username"
                                       :disabled="!!userInfo.username"
                                       placeholder="Please enter username"
                                       class="component-input-inner"
                                       type="text">
                        	</span>
                        </label>
                    </li>
                    <li>
                        <label class="option"><span class="option-name"><em>* </em>First Name:</span>
                            <span class="option-component component-input">
		                        <input v-model="userInfoForm.firstName"
                                       placeholder="Please enter name"
                                       class="component-input-inner"
                                       type="text">
                        	</span>
                        </label>
                    </li>
                    <li>
                        <label class="option"><span class="option-name"><em>* </em>Last Name:</span>
                            <span class="option-component component-input ">
		                        <input v-model="userInfoForm.lastName"
                                       placeholder="Please enter name"
                                       class="component-input-inner"
                                       type="text">
                        	</span>
                        </label>
                    </li>
                    <li>
                        <p class="option"><em class="option-name">Gender:</em>
                            <span class="option-component">
	                            <label class="gender">
	                            	<input type="radio" name="gender" value="1" v-model="userInfoForm.gender">
                               		<em class="gender-item">Male</em>
	                           	</label>
	                            <label class="gender">
	                            	<input type="radio" name="gender" value="2" v-model="userInfoForm.gender">
	                            	<em class="gender-item">Female</em>
	                           	</label>
	                            <label class="gender">
	                            	<input type="radio" name="gender" value="3" v-model="userInfoForm.gender">
	                            	<em class="gender-item">Secret</em>
	                           	</label>
	                        </span>
                        </p>
                    </li>
                    <li>
                        <div class="option"><em class="option-name">Birthday:</em>
                            <el-date-picker
                                    :editable="false"
                                    v-model="userInfoForm.birthday"
                                    class="option-component"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    placeholder="Please Enter Birthday">
                            </el-date-picker>
                        </div>
                    </li>
                    <!--
                    <li>
                        <div class="option"><em class="option-name">City:</em>
                            <el-cascader
                                    @active-item-change="handleItemChange"
                                    class="option-component"
                                    :options="addressOptions"
                                    v-model="address"
                                    :props="props"
                                    placeholder="Please Select City"
                            >
                            </el-cascader>
                        </div>
                    </li>
                    -->
                    <li>
                        <label class="option"><em class="option-name">Motivation:</em>
                            <el-select
                                    v-model="userInfoForm.motivation" placeholder="Please Select Motivation"
                                    class="option-component">
                                <el-option
                                        v-for="item in motivationOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </label>
                    </li>
                    <li>
                        <label class="option">
                            <template v-if="this.userInfo.customerType == 1">
                                <em class="option-name">Years of learning Mandarin:</em>
                            </template>
                            <template v-if="this.userInfo.customerType == 2">
                                <em class="option-name">Years of teaching Mandarin:</em>
                            </template>
                            <el-select v-model="userInfoForm.learningYears"
                                       placeholder="Please Select Year"
                                       class="option-component">
                                <el-option
                                        v-for="item in learnYearOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </label>
                    </li>
                    <li>
                        <p class="option">
                            <em class="option-name">Native Chinese Speaker:</em>
                            <span class="option-component">
                                <label class="speaker">
                                	<input name="speaker" type="radio" value="1" v-model="userInfoForm.nativeSpeaker">
                                	<em class="speaker-item">YES</em>
                               	</label>
                                <label class="speaker">
                                	<input name="speaker" type="radio" value="0" v-model="userInfoForm.nativeSpeaker">
                                	<em class="speaker-item">NO</em>
                               	</label>
                            </span>
                        </p>
                    </li>
                    <li>
                        <button class="submit-button" :disabled="submitPrevent" @click="submitPrevent || submitForm()">
                            Save
                        </button>
                    </li>
                </ul>
            </article>
            <article class="content" slot="Security Center" @changeTab="addPrefixHost">
                <ul class="security-center">
                    <!--
                    <li class="important">
                        <em class="normal-text ">The security level of your account:</em><em class="strong big">{{level}}</em>
                        <em class="set-hint">Recommend you set up a higher level password to protect account. Your password must be between 6 - 20 characters, and must include a combination of letters and at least one number or symbol.</em>
                    </li>
                    -->
                    <li>
                        <i class="lock"></i>
                        <em class="strong">Login Password</em>
                        <nuxt-link :to="{name:'myBCC-securityCenter',query:{module:'password'}}">
                            <button class="messgae-btn">Change</button>
                        </nuxt-link>
                    </li>
                    <li>
                        <i class="Arrow"></i>
                        <em class="strong">Change Email</em>
                        <em class="normal-text">{{userInfoForm.email}}</em>
                        <nuxt-link :to="{name:'myBCC-securityCenter',query:{module:'email'}}">
                            <button class="messgae-btn email">Change Email</button>
                        </nuxt-link>
                    </li>
                </ul>
            </article>
            <!--
            <article class="content" slot="Head Image">
                <head-image></head-image>
            </article>
            -->
        </tabs>
    </div>
</template>
<script>
    import axios from 'axios';
    import R from 'ramda';
    import {mapState, mapActions, mapGetters} from 'vuex';
    import tabs from "~/components/tabs";
    export default {
        async fetch({isServer, store}){
            //加载数据
            store.dispatch("index/myBCC/myBCC/changeEntryActive", "userSetting");
            await store.dispatch("index/myBCC/myBCC/setUserSettingOptions");
            //将Session中的authUser信息更新至store
            await store.dispatch("index/myBCC/myBCC/updateAuthUser", store.state.authUser);
        },
        asyncData({query, store}){
            if (query.moduleName && query.moduleName === 'security') {
                return {
                    defaultActive: 'Security Center'
                }
            }
            //init form data
            const userInfoForm = R.clone(store.state.authUser);
            const birthday = userInfoForm.birthday;
            userInfoForm.birthday = "0000-00-00 00:00:00" === birthday ? new Date() : birthday;
            userInfoForm.learningYears = (userInfoForm.learningYears === 0 || userInfoForm.learningYears === '0') ? "" : userInfoForm.learningYears;
            userInfoForm.motivation = (userInfoForm.motivation === 0 || userInfoForm.motivation === '0') ? "" : userInfoForm.motivation;
            return {
                defaultActive: 'Personal Information',
                userInfoForm
            }
        },
        data () {
            return {
                props: {
                    value: 'id',
                    label: 'english_name'
                },
                submitPrevent: false,
                CURRENT_PATH: [{
                    name: "Personal Information",
                    url: "myBCC-userSetting"
                }],
                //labels: ["Security Center", "Head Image", "Personal Information"],
                labels: ["Security Center", "Personal Information"],
                level: "Medium",
                //address: [],
                loading: false
            }
        },
        methods: {
            ...mapActions('index/myBCC/myBCC', [
                'changeCurrentPath'
            ]),
            //...mapActions('index/myBCC/myBCC', [
            //    'searchAddress'
            //]),
            //address change
            handleItemChange(val) {
                const arr = [];
                val.forEach((item, index) => {
                    +item !== 0 ? arr.push(item) : void(0);
                });
                this.searchAddress(arr);
            },
            addPrefixHost(path){
                this.CURRENT_PATH = [path];
                this.changeCurrentPath(this.CURRENT_PATH);
            },
            async submitForm(){
                this.submitPrevent = true;
                this.loading = true;
                let res = await axios.post("/api/personalSetting", {
                    data: {
                        uid: this.userInfo.uid,
                        email: this.userInfo.email,
                        username: this.userInfoForm.username,
                        firstName: this.userInfoForm.firstName,
                        lastName: this.userInfoForm.lastName,
                        gender: this.userInfoForm.gender,
                        birthday: this.userInfoForm.birthday,
                        //countryId: this.address[0],
                        //provinceId: this.address[1],
                        //cityId: this.address[2],
                        learningYears: this.userInfoForm.learningYears,
                        motivation: this.userInfoForm.motivation,
                        nativeSpeaker: this.userInfoForm.nativeSpeaker
                    }
                });
                if (res.status === 200 && res.data.status_code === 200) {
                    this.$_message("Update Successful!");
                    this.loading = false;
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    this.submitPrevent = false;
                    this.loading = false;
                    this.$_message("Update Failed!");
                }
            }
        },
        created() {
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        computed: {
            ...mapState("index/myBCC/myBCC", {
                motivationOptions: state => state.userSettingOptions.motivationOptions,
                learnYearOptions: state => state.userSettingOptions.learnYearOptions,
                //addressOptions: state => state.addressOptions,
                userInfo: state => state.currentAuthUser
            })
        },
        components: {
            tabs,
            headImage: () => import('./headImage')
        }
    }
</script>
<style lang="less">
    @import "~~assets/less/myBCC/userSetting.less";
    input:disabled {
        cursor: not-allowed;
        color: #cccccc;
        user-select: none;
    }
    .user-setting-container {
        overflow: hidden;
        padding: .2rem 0rem 0rem 0rem;
        font-family: GothamRounded-Book;
        font-size: 14px;
        color: #607592;
        background: white;
    }
</style>
