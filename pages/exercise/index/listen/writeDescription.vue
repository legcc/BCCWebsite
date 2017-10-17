<template>
    <div class="container">
        <div class="content">
            <ul class="ball-list" v-for="(arr,rIndex) in ballList">
                <li class="ball" @click="moveBall(item,index,`${rIndex}-${index}`)"
                    :class="activeObj[`${rIndex}-${index}`]&&'active'" v-for="(item,index) in arr">
                    {{item.chinese || item.pinyin || item.english}}
                </li>
            </ul>
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
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ])
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        }
    })
    export default class writeDescription extends Vue {
        activeObj = {};
        chooseArr = [];

        get ballList() {
            const arr = [];
            this.content.answers && this.content.answers.forEach((item, index) => {
                if ((index + 1) % 5 === 0) {
                    const list = this.content.answers;
                    arr.push([item, list[index - 1], list[index - 2], list[index - 3], list[index - 4]])
                }
            });
            return arr;
        }

        init() {
            this.$nextTick(_ => {
                if (this.content.answers) {
                    const rightArr = R.filter(R.propEq('isRight', 'T'))(this.content.answers);
                    const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                    this.setAnswer({
                        answer: false,
                        msg: `${R.join("、")(R.map(or(R.prop('chinese'), R.prop('english'), R.prop('pinyin')))(rightArr))}`
                    })
                }
            })
        }

        mounted() {
            this.init();
        }


        moveBall(item, index, tag) {
            Vue.set(this.activeObj, tag, true);
            this.chooseArr.push(item);
            const rightArr = R.filter(R.propEq('isRight', 'T'))(this.content.answers);
            const likeLen = R.pipe(R.length, R.equals(rightArr.length));
            let answer = R.both(likeLen, R.all(R.contains(R.__, rightArr)))(this.chooseArr);
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            this.setAnswer({
                answer,
                msg: `${R.join("、")(R.map(or(R.prop('chinese'), R.prop('english'), R.prop('pinyin')))(rightArr))}`
            })
        }

    }
</script>
<style lang="scss" scoped>
    @import "~~assets/sass/mixins";
    @import "~~assets/sass/functions";

    .container {
        .content {
            $width: 700px;
            $containerHeight: getHeightFromAspectRatio((width:(1010px), height:(250px)), $width);
            width: $width;
            margin: 150px auto auto auto;
            height: $containerHeight;
            padding: 0 0 0 111px;
            box-sizing: border-box;
            position: relative;
            @include fullBgWithPicName("taiqiuzhuo.png");
            @for $index from 1 to 3 {
                .ball-list:nth-child(2n + #{$index}) {
                    top: ($index * 50px)-20px;
                    left: $index * 60px;
                }
            }
            $arr: (red, yellow, purple, blue, purple);
            .ball {
                width: 50px;
                height: 50px;
                display: inline-block;
                text-align: center;
                line-height: 50px;
                font-size: 24px;
                font-family: GothamRounded-Medium;
                border-radius: 50%;
                position: absolute;
                cursor: pointer;
                transition: all .6s ease-in;

            }
            @for $heightIndex from 1 to 3 {
                .ball-list:nth-child(2n + #{$heightIndex}) {
                    @for $index from 1 to 6 {
                        .ball:nth-child(5n + #{$index}) {
                            $paddingLeft: $heightIndex * 60px;
                            width: 50px;
                            height: 50px;
                            top: ($heightIndex * 65px)-50px;
                            left: 80px * $index + $paddingLeft;
                            border: 1px solid nth($arr, $index);
                            box-shadow: 0 1px 8px 5px nth($arr, $index) inset;
                            background: rgba(255, 255, 255, .8);
                            margin: 10px;
                            &.active {
                                left: 811px;
                                top: $containerHeight;
                                transform: translate(-50%, -50%);
                                opacity: 0;
                            }
                        }
                    }
                }
            }
        }

    }
</style>