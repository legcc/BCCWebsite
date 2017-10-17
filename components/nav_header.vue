<template>
    <div class="header">
        <div class="head-inner">
            <div class="head-logo">
                <a href="#" class="logo-bd"></a>
                <a href="#" class="logo-name">BCC Mandarin</a>
            </div>
            <div class="head-menu">
                <ul class="menu">
                    <li class="home" @click="entryHighLight=false">
                        <nuxt-link :to="HOME">Home</nuxt-link>
                    </li>
                    <li class="notHome" @click="entryHighLight=false">
                        <nuxt-link :to="STORE">Store</nuxt-link>
                    </li>
                    <li class="notHome" v-show="user && user.uid && +user.customerType === 1"
                        @click="entryHighLight=false">
                        <nuxt-link :to="LEARNER_CENTER">Learning Center</nuxt-link>
                    </li>
                    <li class="notHome" v-show="user && user.uid && +user.customerType === 2"
                        @click="entryHighLight=false">
                        <nuxt-link :to="TEACHER_CENTER">Teaching Center</nuxt-link>
                    </li>
                    <li class="notHome" v-show="!user || !user.uid" @click="entryHighLight=false">
                        <nuxt-link :to="SIGN_IN_PATH">Sign in</nuxt-link>
                    </li>
                    <li class="notHome" v-show="user">
                    </li>
                    <li class="notHome" v-show="!user || !user.uid" @click="entryHighLight=false">
                        <nuxt-link :to="REGISTER_PATH">
                            <button class="g-start">Get started</button>
                        </nuxt-link>
                    </li>
                    <li class="notHome" v-show="user && user.uid" >
                        <a @click.pre="showList"
                           :class="entryHighLight&&'nuxt-link-active'">{{(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` :
                            (user.username || user.email)}}
                            <i class="el-icon-caret-bottom el-icon--right" ></i>
                        </a>
                    </li>
                </ul>
                <transition name="el-zoom-in-top">
                    <ul class="head-drop-down" v-show="dropDown">
                        <nuxt-link :to="item.path" :key="index"
                                   v-for="(item,index) in setUpOptions">
                            <li class="list" @click="enterModule">
                                {{item.label}}
                            </li>
                        </nuxt-link>
                        <li class="list" @click="signUp">Sign out</li>
                    </ul>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import {mapState, mapActions} from 'vuex'
    export default {
        components: {},
        data () {
            return {
                dropDown: false,
                setUpOptions: [
                    {label: 'User Setting', path: {name: 'myBCC-userSetting'}},
                    {label: 'Order', path: {name: 'myBCC-order'}},
                    {label: 'Resources', path: {name: 'myBCC-resources'}},
                    {label: 'Message', path: {name: 'myBCC-message'}}
                ],
                entryHighLight: false,
                HOME: {name: 'index'},
                SIGN_IN_PATH: {name: 'home-login'},
                REGISTER_PATH: {name: 'home-regist'},
                LEARNER_CENTER: {name: 'learner'},
                TEACHER_CENTER: {name: 'educator'},
                STORE: {name: 'store'},
            }
        },
        methods: {
            showList(){
                this.dropDown = !this.dropDown;
                const wrap = document.querySelector("#container-wrap");
                const removeEvent = () => {
                    this.dropDown = false;
                    wrap.removeEventListener('click', removeEvent);
                };
                wrap.addEventListener('click', removeEvent, false);
            },
            signUp(){
                axios.post(`${this.httpPath.replace(/\/proxy/, "")}/api/signUp`);
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            },
            enterModule(){
                this.entryHighLight = true;
                this.dropDown = false;
            }
        },
        created () {
        },
        computed: {
            user() {
                return this.$store.state.authUser;
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/home/nav_head";
</style>
