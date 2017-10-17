<template>
    <div class="main-content">
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
        </div>
        <div class="info-desc">
            Please choose one class to view it’s performance, or choose more classes to view performance comparison among the chosen classes(Maximum 4 classes).
        </div>
        <div class="performance-view">
            <ul class="sLevel-list">
                <li class="level-info" v-for="info in levelInfos" :key="info.id">
                    <template v-if="info.levelId == 1">
                        <nuxt-link :to="{name:'educator-statistics',
                                    query:{levelId:info.levelId, classId:info.id}}">
                            <div class="class-card lv1-bg">
                                <div class="img-container">
                                    {{info.classname}}
                                </div>
                            </div>
                        </nuxt-link>
                    </template>
                    <template v-if="info.levelId == 2">
                        <nuxt-link :to="{name:'educator-statistics',
                                    query:{levelId:info.levelId, classId:info.id}}">
                            <div class="class-card lv2-bg">
                                <div class="img-container">
                                    {{info.classname}}
                                </div>
                            </div>
                        </nuxt-link>
                    </template>
                    <template v-if="info.levelId == 3">
                        <nuxt-link :to="{name:'educator-statistics',
                                    query:{levelId:info.levelId, classId:info.id}}">
                            <div class="class-card lv3-bg">
                                <div class="img-container">
                                    {{info.classname}}
                                </div>
                            </div>
                        </nuxt-link>
                    </template>
                    <template v-if="info.levelId == 4">
                        <nuxt-link :to="{name:'educator-statistics',
                                    query:{levelId:info.levelId, classId:info.id}}">
                            <div class="class-card lv4-bg">
                                <div class="img-container">
                                    {{info.classname}}
                                </div>
                            </div>
                        </nuxt-link>
                    </template>
                    <template v-if="info.levelId == 5">
                        <nuxt-link :to="{name:'educator-statistics',
                                    query:{levelId:info.levelId, classId:info.id}}">
                            <div class="class-card lv5-bg">
                                <div class="img-container">
                                    {{info.classname}}
                                </div>
                            </div>
                        </nuxt-link>
                    </template>
                    <template v-if="info.levelId == 6">
                        <nuxt-link :to="{name:'educator-statistics',
                                    query:{levelId:info.levelId, classId:info.id}}">
                            <div class="class-card lv6-bg">
                                <div class="img-container">
                                    {{info.classname}}
                                </div>
                            </div>
                        </nuxt-link>
                    </template>
                    <label>
                        <div>
                            <input type="checkbox" :value="info.id" v-model="classIDsArr"/>
                        </div>
                    </label>
                </li>
            </ul>
        </div>
        <footer class="footer">
            <template v-if="dataOptions.length > 0">
                <el-pagination
                        class="table-info-pagination"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="dataOptions.length">
                </el-pagination>
                <template v-if="classIDsArr.length > 1">
                    <nuxt-link :to="{name:'educator-compare',query:{classIds:convert}}">
                        <button type="button" class="right-btn">Compare</button>
                    </nuxt-link>
                </template>
                <template v-else>
                    <button type="button" class="right-btn-dis" title="Please choose more classes to view performance.">Compare</button>
                </template>
            </template>
        </footer>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        async fetch({store}){
            await Promise.all([
                store.dispatch('index/educator/educator/changeEntryActive', 'performance'),
                store.dispatch("index/educator/performance/setOptions"),
                store.dispatch("index/educator/performance/getData")
            ])
        },
        data () {
            return {
                CURRENT_PATH: [{
                    name: "Performance",
                    url: "educator-performance"
                }],
                selectLevel: "0",
                classIDsArr: [],
                classIDsStr: "",
                pageNum: 1,
                pageSize: 8
            }
        },
        methods: {
            ...mapActions('index/educator/educator', [
                'changeCurrentPath',
                'changeEntryActive'
            ]),
            ...mapActions('index/educator/performance/', [
                'getData'
            ]),
            changeLevel(){
                this.getData({
                    levelId: this.selectLevel
                });
            }
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH)
        },
        computed: {
            ...mapState("index/educator/performance", {
                dataOptions: state => state.dataOptions,
                levelOptions: state => state.levelOptions,
            }),
            convert: function () {
                if (this.classIDsArr) {
                    if (this.classIDsArr.length > 4) {
                        this.classIDsArr.splice(0, 1);
                        this.$_warning("Up to four classes can be compared")
                    }
                    return this.classIDsStr = this.classIDsArr.join("-")
                }
            },
            levelInfos(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return this.dataOptions.slice(begin, count * pageNum);
            }
        },
        components: {}
    }
</script>

<style lang="less">
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/tab_pagination";
    @import "~~assets/less/educator/performance";
</style>
