<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <article class="wrap">
            <div class="inner">
                <el-row class="top-list">
                    <el-col :span="8" class="list-item">
                        <ul class="word-container">
                            <li><em>年</em></li>
                            <li><input class="pit" type="text" v-model="year" @input="answerHandler"></li>
                        </ul>
                    </el-col>
                    <el-col :span="8" class="list-item">
                        <ul class="word-container">
                            <li><em>月</em></li>
                            <li><input class="pit" type="text" v-model="month" @input="answerHandler"></li>
                        </ul>
                    </el-col>
                    <el-col :span="8" class="list-item">
                        <ul class="word-container">
                            <li><em>日</em></li>
                            <li><input class="pit" type="text" v-model="day" @input="answerHandler"></li>
                        </ul>
                    </el-col>
                </el-row>

                <el-row class="under-list">
                    <el-col :span="4" class="list-item">
                        <div class="label"><h2>上午</h2>
                            <h2>下午</h2></div>
                    </el-col>
                    <el-col :span="5" class="list-item"><input class="pit" type="text" v-model="hour"
                                                               @input="answerHandler"></el-col>
                    <el-col :span="2" class="list-item">:</el-col>
                    <el-col :span="5" class="list-item"><input class="pit" type="text" v-model="minute"
                                                               @input="answerHandler"></el-col>
                    <el-col :span="2" class="list-item">:</el-col>
                    <el-col :span="5" class="list-item"><input class="pit" type="text" v-model="second"
                                                               @input="answerHandler"></el-col>
                </el-row>
            </div>
        </article>
    </div>

</template>
<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    @Component({
        components: {loadingImage},
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ])
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerArr: [],
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600);
                this.init();
            }
        },
    })
    export default class writeDown extends Vue {
        isUpdate = false;
        year = "";
        month = "";
        day = "";
        hour = "";
        minute = "";
        second = "";

        mounted() {
            this.init();
        }

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.content.answers && `${R.join("\n")(R.map(item => (`${R.prop('label', item)} ${R.prop('value', item)}`))(this.content.answers))}`
                });
            })
        }

        answerHandler() {
            const condition = item => {
                const prop = R.prop(R.prop("label", item))(this);
                return R.equals(R.prop('value', item), prop);
            };
            const answer = R.all(condition)(this.content.answers);
            this.setAnswer({
                answer,
                msg: `${R.join("\n")(R.map(item => (`${R.prop('label', item)} ${R.prop('value', item)}`))(this.content.answers))}`
            });
        }
    }
</script>
<style lang="scss" scoped>
    @import "~~assets/sass/mixins";
    @import "~~assets/sass/functions";

    .fadeIn {
        animation: fadeIn .4s ease-in;
        transform: translateZ(0);
    }

    @keyframes fadeIn {
        from {
            transform-origin: left;
            transform: scaleX(.4);
            opacity: 0;
        }
    }

    .container {
        text-align: center;
        .pit {
            width: 100px;
            height: 50px;
            border-radius: 10px;
            background-color: rgb(65, 204, 245);
            border: 4px solid white;
            font-size: 28px;
            font-family: GothamRounded-Book;
            margin: 20px 0;
            outline: none;
            text-align: center;
            line-height: 1;
            box-shadow: 0 2px 0 2px #246ebb;
        }
        .wrap {
            $width: 600px;
            box-sizing: border-box;
            padding: 40px 0;
            display: inline-block;
            margin-top: 60px;
            width: $width;
            text-align: center;
            background: linear-gradient(135deg, rgb(6, 212, 225), #2e8ef2, #ac44ff 120%);
            border-radius: 12px;
            box-shadow: 2px -2px 0 2px #246ebb;
            .inner {
                border: 5px solid #bacd41;
                border-radius: 6px;
                margin: 0 20px;
                padding: 30px 10px;
                box-shadow: 0 0 0 2px #246ebb;
            }
            .top-list {
                .list-item {
                    text-align: center;
                    display: inline-block;
                    font-size: 28px;
                    color: white;
                    vertical-align: middle;
                    .word-container {
                        display: inline-block;
                        margin-top: 20px;
                    }

                }
            }
            .under-list {
                margin-top: 40px;
                font-size: 26px;
                color: white;
                text-align: center;
                .list-item {
                    height: 100px;
                    line-height: 100px;
                    .label {
                        line-height: 1.4;
                        display: inline-block;
                        width: 100%;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>