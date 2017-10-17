<template>
    <div class="theme-1" :class="isUpdate&&'fadeIn'" v-if="templateStyle==='level-1'">
        <div class="practice_speak_out practice_common_box">
            <div class="speak_out_content">
                <div class="speak_out_py">
                    <ul ref="list">
                        <li v-for="item in wordArr">{{item}}</li>
                    </ul>
                </div>
                <button class="speak_out_play" @click="begin">PLAY</button>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="coming-soon"></div>

    </div>
</template>
<script>
    import Vue from 'vue';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    import move from 'move-js'
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    @Component(
        {
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
            },

            watch: {
                content(){
//                当数据发生变化后执行动画效果
                    this.isUpdate = true;
                    const initData = {
                        wordArr: []
                    };
                    const init = (val, key) => {
                        this[key] = val;
                    };
                    R.forEachObjIndexed(init)(initData);
                    this.init();
                    setTimeout(_ => {
                        this.isUpdate = false;
                    }, 600)
                }
            },


        }
    )
    export default class ballot extends Vue {
        isUpdate = false;
        wordArr = [];

        begin() {
            const ele = this.$refs.list;
            const moveBack = move(ele)
                .set('bottom', 0);
            const moveGo = move(ele)
                .set('bottom', `-${ele.offsetHeight - 200}px`);
            this.wordArr.sort(function () {
                return 0.5 - Math.random()
            });
            move(ele).set('bottom', `-${ele.offsetHeight - 200}px`).then(moveBack).then(moveGo).then(moveBack).end();
        }

        init() {
            this.$nextTick(_ => {
                if (this.content.words) {
                    const arr = R.map(item => (R.prop('pinyin', item) || R.prop('chinese', item) || R.prop('english', item)))(this.content.words);
                    this.wordArr = R.chain(R.repeat(R.__, 10))(arr);
                }
                this.setAudioInfo({player: {display: 'none'}});
            })
        }

        destroyed() {
            this.setAudioInfo({player: {display: 'block'}});
        }

        created() {
            this.init();
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

    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
    }

    .theme-1 {
        .practice_common_box {
            width: 750px;
            height: 400px;
            display: block;
            margin: 30px auto auto auto;
            position: relative;
        }
        .speak_out_content {
            position: absolute;
            margin: auto;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            width: 750px;
            height: 405px;
            background: url(~~assets/img/exercise/speak_out_bg.png) no-repeat;
            background-size: 35% 90%;
            background-position: center center;
        }
        .speak_out_py {
            width: 197px;
            height: 92px;
            line-height: 92px;
            border-radius: 8px;
            display: block;
            position: absolute;
            margin: auto;
            top: 0%;
            left: 0;
            bottom: 0;
            right: 0;
            text-align: center;
            overflow: hidden;
        }
        .speak_out_play {
            width: 150px;
            height: 40px;
            background: url(~~assets/img/exercise/speak_out_play_bg.png) no-repeat;
            background-size: 100% 100% !important;
            background-position: center center !important;
            color: #F25044;
            font-weight: 700;
            position: absolute;
            margin: auto;
            top: 45%;
            bottom: 0;
            left: 3px;
            right: 0;
        }
        .speak_out_py ul {
            width: 100%;
            font-size: 45px;
            color: red;
            position: absolute;
            bottom: 92px;
            left: 0;
            margin: 0;
        }
        .speak_out_py ul li {
            display: block;
            width: 100%;
            height: 100%;
        }
    }

</style>