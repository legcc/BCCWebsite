<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <figure class="senlin-container" v-if="isSenlin">
            <figcaption class="yiyuan" @click="answerHandler(1)"
                        :class="trackArr.indexOf('1')>=0&&'active'"></figcaption>
            <figcaption class="shop"></figcaption>
            <figcaption class="school" @click="answerHandler(2)"
                        :class="trackArr.indexOf('2')>=0&&'active'"></figcaption>
            <figcaption class="canting" @click="answerHandler(4)"
                        :class="trackArr.indexOf('4')>=0&&'active'"></figcaption>
            <figcaption class="cinema" @click="answerHandler(3)"
                        :class="trackArr.indexOf('3')>=0&&'active'"></figcaption>
        </figure>
        <figure class="home-container" v-else>
            <figcaption class="table" @click="answerHandler(2)"
                        :class="trackArr.indexOf('2')>=0&&'active'"></figcaption>
            <figcaption class="chair" @click="answerHandler(4)"
                        :class="trackArr.indexOf('4')>=0&&'active'"></figcaption>
            <figcaption class="money" @click="answerHandler(1)"
                        :class="trackArr.indexOf('1')>=0&&'active'"></figcaption>
            <figcaption class="television" @click="answerHandler(3)"
                        :class="trackArr.indexOf('3')>=0&&'active'"></figcaption>
        </figure>
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
    export default class tapTourHeard extends Vue {
        isUpdate = false;
        trackArr = [];

        init() {
            this.$nextTick(_ => {
                if (this.content.answerOrder) {
                    const getAnswerWord = item => R.or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(item);
                    this.setAnswer({
                        answer: false,
                        msg: `${R.pipe(R.split(","), R.map(item => R.pipe(R.find(R.propEq('order', item)), getAnswerWord)(this.content.answers)))(this.content.answerOrder[0])}`
                    })
                }
            })
        }

        get isSenlin() {
            return this.content.answerOrder[0] === '2,1,4,3';
        }

        mounted() {
            this.init();
        }

        answerHandler(order) {
            order = order + "";
            if (R.contains(order)(this.trackArr)) {
                const trackIndex = R.findIndex(R.equals(order))(this.trackArr);
                this.trackArr = R.remove(trackIndex, 1, this.trackArr);
            } else {
                this.trackArr = R.append(order)(this.trackArr);
            }
            this.checkAnswer();
        }

        checkAnswer() {
            const answer = R.pipe(R.split(","), R.equals(this.trackArr))(this.content.answerOrder[0]);
            const getAnswerWord = item => R.or(R.prop('chinese'), R.prop('english'), R.prop('pinyin'))(item);
            this.setAnswer({
                answer,
                msg: `${R.pipe(R.split(","), R.map(item => R.pipe(R.find(R.propEq('order', item)), getAnswerWord)(this.content.answers)))(this.content.answerOrder[0])}`
            })
        }
    }
</script>
<style lang="scss" scoped>
    @import "~~assets/sass/mixins";

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

    .home-container {
        $percent: 0.7;
        @function multiplicationWithNum($num) {
            @return $num * $percent;
        }
        @include exerciseContainer((width:(1120px), height:(516px)), multiplicationWithNum(1120px), 'pintu/home.png');
        margin-top: 60px;
        position: relative;
        .table {
            @include exerciseContainer((width:(88px), height:(105px)), multiplicationWithNum(88px), 'pintu/table.png');
            position: absolute;
            left: 44.3%;
            top: 47.6%;
            cursor: pointer;
            filter: drop-shadow(2px 2px 2px black);
        }
        .chair {
            @include exerciseContainer((width:(109px), height:(182px)), multiplicationWithNum(109px), 'pintu/chair.png');
            position: absolute;
            left: 28.62%;
            top: 41.3%;
            cursor: pointer;
            filter: drop-shadow(2px 2px 2px black);
        }
        .money {
            @include exerciseContainer((width:(102px), height:(31px)), multiplicationWithNum(102px), 'pintu/money.png');
            position: absolute;
            left: 62%;
            top: 66%;
            cursor: pointer;
            filter: drop-shadow(2px 2px 2px black);
        }
        .television {
            @include exerciseContainer((width:(54px), height:(43px)), multiplicationWithNum(54px), 'pintu/television.png');
            position: absolute;
            left: 36%;
            top: 34%;
            cursor: pointer;
            filter: drop-shadow(2px 2px 2px black);
        }
        .active {
            filter: drop-shadow(6px 2px 2px purple);
        }
    }

    .senlin-container {
        $percent: 0.6;
        @function multiplicationWithNum($num) {
            @return $num * $percent;
        }
        @include exerciseContainer((width:(1366px), height:(599px)), multiplicationWithNum(1366px), 'pintu/senlin.png');
        margin-top: 60px;
        position: relative;
        .yiyuan {
            @include exerciseContainer((width:(204px), height:(204px)), multiplicationWithNum(204px), 'pintu/yiyuan.png');
            position: absolute;
            left: 75.89%;
            top: 56.4%;
            cursor: pointer;
            filter: drop-shadow(2px 2px 2px black);
        }
        .shop {
            @include exerciseContainer((width:(165px), height:(158px)), multiplicationWithNum(165px), 'pintu/shop.png');
            position: absolute;
            left: 37.89%;
            top: 37.4%;
            cursor: pointer;
            filter: drop-shadow(2px 2px 2px black);
        }
        .canting {
            @include exerciseContainer((width:(229px), height:(178px)), multiplicationWithNum(229px), 'pintu/canting.png');
            position: absolute;
            left: 13.8%;
            top: 62%;
            cursor: pointer;
            filter: drop-shadow(2px 2px 2px black);
        }
        .cinema {
            @include exerciseContainer((width:(219px), height:(216px)), multiplicationWithNum(219px), 'pintu/cinema.png');
            position: absolute;
            left: 65%;
            top: -12%;
            cursor: pointer;
            filter: drop-shadow(2px 2px 2px black);
        }
        .school {
            @include exerciseContainer((width:(309px), height:(174px)), multiplicationWithNum(309px), 'pintu/school.png');
            position: absolute;
            left: 15.6%;
            top: -5%;
            cursor: pointer;
            filter: drop-shadow(2px 2px 2px black);
        }
        .active {
            filter: drop-shadow(6px 2px 2px purple);
        }
    }
</style>