<template>
    <div class="resources-select">
        <nav class="resources-nav">
            <section class="nav-left-side">
                <div class="btn-type" v-if="show.resource">
                    <em class="nav-legend">Resource Type</em>
                    <el-select v-model="address">
                        <el-option
                                v-for="item in addressOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="btn-type" v-if="show.learning">
                    <em class="nav-legend">Learning Status</em>
                    <el-select v-model="address">
                        <el-option
                                v-for="item in addressOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="btn-type" v-if="show.status">
                    <em class="nav-legend">Status</em>
                    <el-select v-model="address">
                        <el-option
                                v-for="item in addressOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="btn-type" v-if="show.level">
                    <em class="nav-legend ">Level</em>
                    <el-select v-model="address">
                        <el-option
                                v-for="item in addressOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="btn-type" v-if="show.lesson">
                    <em class="nav-legend">Lesson</em>
                    <el-select v-model="address">
                        <el-option
                                v-for="item in addressOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </section>
            <section class="nav-right-side">
                <nuxt-link :to="'1'" v-if="show.download">
                    <button class="right-btn">Download Single Word Template</button>
                </nuxt-link>
                <nuxt-link :to="'1'" v-if="show.view">
                    <button class="view-btn">View Performance</button>
                </nuxt-link>
            </section>
        </nav>
    </div>
</template>

<script>

    import axios from 'axios';


    export default {
        data () {
            return {
                addressOptions: [{
                    value: '美国',
                    label: '美国'
                }, {
                    value: '中国',
                    label: '中国'
                }],
                address: "",
            }
        },
        methods: {},
        created () {
        },
        computed: {},
        components: {},
        props: {
            show: Object
        }
    }
</script>

<style lang="less">
    .resources-select {
        .resources-nav {
            height: .44rem;
            line-height: .44rem;
            background: #F2F4FA;
            position: relative;
            border-radius: 5px;
            font-family: GothamRounded-Medium;
            font-size: 14px;

            .nav-right-side {
                position: absolute;
                top: 50%;
                right: .18rem;
                transform: translateY(-50%);

                button {
                    padding-left: .15rem;
                    padding-right: .15rem;
                    height: .32rem;
                    background: #ff9900;
                    color: white;
                    font-family: GothamRounded-Medium;

                    margin-left: .15rem;
                }
            }
            .nav-legend {
                margin-right: 0;
                color: #6B7788;
                margin-left: .2rem;
            }

        }
        .btn-type {
            float: left;
        }
        .el-select {
            margin-left: .1rem;
        }

        .el-input__inner {
            cursor: pointer;
            height: .32rem;
            color: #7F8CA0;
            box-shadow: 0 1px 2px #878b92 inset;
            width: 1.05rem;
            &::-webkit-input-placeholder {
                color: #C2C7CE;
                text-indent: 4px;
                font-family: GothamRounded-Book;
                font-weight: normal;
            }
            &::-moz-placeholder {
                color: #C2C7CE;
                text-indent: 4px;
                font-family: GothamRounded-Book;
                font-weight: normal;
            }
            &:-ms-input-placeholder {
                color: #C2C7CE;
                text-indent: 4px;
                font-family: GothamRounded-Book;
                font-weight: normal;
            }
            &:-moz-placeholder {
                color: #C2C7CE;
                text-indent: 4px;
                font-family: GothamRounded-Book;
                font-weight: normal;
            }
        }

    }
</style>
