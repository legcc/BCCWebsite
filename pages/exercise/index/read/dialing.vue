<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <audio :src="addPrefixHost('tools/audio/click-click.wav')" ref="clickAudio"></audio>
        <div class="phone-container">
            <table class="keyboard">
                <tr v-for="arr in number">
                    <td v-for="num in arr">
                        <div class="number" @click="chooseNumber(num)">{{num}}</div>
                    </td>
                </tr>
            </table>
        </div>
        <div class="sentence-container">
            <div class="question-container">
                <ul>
                    <li v-for="(item,index) in content.question" :key="index" class="question"
                        :class="activeArr[index]&&'active'"
                        @click="selectQuestion(index)"
                    >
                        <ul>
                            <li class="name">{{item.name}}</li>
                            <li class="phone-number">{{item.phoneNumber}}</li>
                        </ul>
                    </li>
                </ul>
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
    export default class dialing extends Vue {
        isUpdate = false;
        number = [[1, 2, 3], [4, 5, 6], [7, 8, 9], ["*", 0, "#"]];
        activeArr = [];
        answerArr = [];
        selectQuestionIndex = null;

        mounted() {
            this.init();
        }

        selectQuestion(index) {
            if (this.selectQuestionIndex===null) {
                this.answerArr[index] = [];
                this.selectQuestionIndex = index;
                Vue.set(this.activeArr, index, true);
            }
        }

        init() {
            this.$nextTick(_ => {
                if (this.content.question) {
                    const rightNumbers = R.map(R.pipe(R.prop("clickNumber"), R.split(",")))(this.content.question);
                    this.setAnswer({
                        answer: false,
                        msg: rightNumbers&&` ${R.join("\n")(R.map(R.join(""))(rightNumbers))}`
                    });
                }
            })
        }

        chooseNumber(num) {
            if (this.selectQuestionIndex !== null) {
                this.$refs.clickAudio.play();
                this.answerArr[this.selectQuestionIndex].push(num + "");
                const rightNumbers = R.map(R.pipe(R.prop("clickNumber"), R.split(",")))(this.content.question);
                const answer = R.equals(this.answerArr[this.selectQuestionIndex])(rightNumbers[this.selectQuestionIndex]);
                this.setAnswer({
                    answer,
                    msg: ` ${R.join("、")(rightNumbers[this.selectQuestionIndex])}`,
                    prompt: true
                });
            } else {
                this.$message("Please choose a question first")
            }
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
        margin-top: 100px;
        font-family: GothamRounded-Book;
    }

    .phone-container {
        width: 260px;
        min-height: getHeightFromAspectRatio((width:(260px), height:(300px)), 260px);
        vertical-align: middle;
        display: inline-block;
        margin-right: 100px;
        position: relative;
        @include fullBgWithPicName("phone.png");
        .keyboard {
            left: .95rem;
            top: 1.1rem;
            position: absolute;
        }
        .number {
            width: 30px;
            height: 30px;
            cursor: pointer;
            line-height: 30px;
            font-weight: 600;
            border-radius: 50%;
            text-align: center;
            vertical-align: middle;
            border: 1px solid black;
            margin: 2px 5px;
            font-family: GothamRounded-Medium;
            background-color: rgb(7, 233, 82);
            &:hover {
                transition: all .1s ease-in;
                background-color: rgb(25, 188, 233);
            }
        }
    }

    .sentence-container {
        display: inline-block;
        vertical-align: middle;
        min-width: 400px;
        font-family: GothamRounded-Medium;
        .question-container {
            width: 450px;
            text-align: left;
            height: getHeightFromAspectRatio((width:(759px), height:(493px)), 450px);
            @include fullBgWithPicName("book.png");
            .question {
                display: inline-block;
                vertical-align: middle;
                margin-top: 40px;
                float: none;
                text-align: left;
                margin-left: 20px;
                padding: 2px;
                border: 2px solid transparent;
                cursor: pointer;
                &.active {
                    transition: border .1s ease-in;
                    border: 2px solid #4b62be;
                    border-radius: 4px;
                }
                .name {
                    display: inline-block;
                    min-width: 40px;
                    margin-bottom: 10px;
                }
                $list: (#b4d455, #5bbe75, #4b62be, #be6b81);
                @for $index from 1 to 5 {
                    &:nth-child(4n+#{$index}) {
                        .name {
                            border: 2px solid black;
                            padding: 4px 8px;
                            background-color: nth($list, $index);
                        }
                    }
                }
                &:nth-child(2n) {
                    margin-left: 70px;
                }
                .phone-number {
                    border-bottom: 1px dashed black;
                    padding-bottom: 2px;
                }
            }

        }
    }
</style>