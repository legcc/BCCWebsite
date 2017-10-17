<template>
    <div class="theme-1" :class="isUpdate&&'fadeIn'">
        <div class="container">
            <div class="left">
                <loading-image class="picture" :src="addPrefixHost(content.image)" alt=""></loading-image>
                <p class="english">{{content.english}}</p>
            </div>
            <div class="right">
                <table>
                    <tr v-for="(arr,rIndex) in sortTableData">
                        <td class="word-item" v-for="(item,cIndex) in arr"
                            @click="answerHandler(item.isRight,`${rIndex}-${cIndex}`)"
                            :class="activeIndex===`${rIndex}-${cIndex}`&&'active'">
                            <em class="pinyin">{{item.pinyin}}</em>
                            <em class="chinese">{{item.chinese}}</em>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
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
                contentInfo: state => state.contentInfo,
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
                    activeIndex: ""
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
    export default class chooseNumber extends Vue {
        isUpdate = false;
        activeIndex = "";

        get sortTableData() {
            const arr = [];
            const answer = this.content.answers;
            answer.forEach((item, index) => {
                if ((index + 1) % 3 === 0) {
                    arr.push([item, answer[index - 1], answer[index - 2]])
                }
            });
            return arr;
        }

        mounted() {
            this.init();
        }

        init() {
            this.$nextTick(_ => {
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));

                this.setAnswer({
                    answer: false,
                    msg: this.content.answers && ` ${or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(R.find(R.propEq('isRight', 'T'))(this.content.answers))}`
                });
            })
        }

        answerHandler(isRight, index) {
            this.activeIndex = index;
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));

            this.setAnswer({
                answer: isRight === "T",
                msg: ` ${or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(R.find(R.propEq('isRight', 'T'))(this.content.answers))}`
            });
        }
    }
</script>
<style lang="less" scoped>
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

    .theme-1 {
        text-align: center;
        .container {
            background: url("~~assets/img/exercise/book-bg.png") no-repeat center;
            min-width: 6.8rem;
            display: inline-block;
            background-size: 100% 100%;
            text-align: left;
            padding: 0.8rem .9rem 0.5rem 0.6rem;
            margin-top: .4rem;
        }
        .left {
            display: inline-block;
            vertical-align: top;
            text-align: center;
            font-family: GothamRounded-Medium;
            font-size: 22px;
            color: #1671b5;
            .english {
                width: 128px;
                margin: 0 auto;
            }
            .picture {
                width: 198px;
                max-height: 112px;
                margin: 40px 10px;
            }
        }
        .right {
            display: inline-block;
            margin-left: 80px;
            .chinese {
                display: block;
            }
            .word-item {
                text-align: center;
                vertical-align: middle;
                width: 100px;
                height: 100px;
                border: 2px solid #5c69ff;
                font-size: 22px;
                color: #af00af;
                cursor: pointer;
                font-family: GothamRounded-Medium;
                &.active {
                    transition: all .1s ease-in;
                    box-shadow: 0 0 0 2px #1590af inset;
                    color: #ed00ed;
                }
            }
        }
    }

</style>