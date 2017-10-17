<template>
    <div>
        <figure class="tools-list">
            <figcaption>
                <div class="hint-icon" @click="hint||showHint()" :class="hint && 'active'"></div>
            </figcaption>
        </figure>
        <div :class="isUpdate&&'fadeIn'">
            <div class="theme-1" v-if="templateStyle==='level-1'">
                <ul class="cell-list">
                    <li class="rect-cell" v-for="(item,index) in content.words"
                        :style="hint&&{backgroundImage:`url(${addPrefixHost(item.gifImage)})`}">
                        <canvas ref="canvas" @mousedown="moveBegin($event,index)"
                                @mousemove="move($event,index)"
                                @mouseout="leave($event,index)"
                                @mouseup="leave($event,index)"></canvas>
                    </li>
                </ul>
            </div>
            <div class="theme-2" v-else-if="templateStyle==='level-4'">
                <p class="tip-button" v-if="!content.audio">{{content.english || content.chinese || content.pinyin}}</p>
                <ul class="cell-list">
                    <li class="rect-cell" v-for="(item,index) in content.words"
                        :style="hint&&{backgroundImage:`url(${addPrefixHost(item.gifImage)})`}">
                        <canvas ref="canvas" @mousedown="moveBegin($event,index)"
                                @mousemove="move($event,index)"
                                @mouseout="leave($event,index)"
                                @mouseup="leave($event,index)"></canvas>
                    </li>
                </ul>
            </div>
            <div class="theme-3" v-else-if="templateStyle==='level-2'">
                <div class="cell-container" :class="+content.wordNum>4&&'overflow'">
                    <div class="rect-cell" v-for="(item,index) in +content.wordNum"
                         :style="hint&&{backgroundImage:`url(${addPrefixHost(item.gifImage)})`}">
                        <canvas ref="canvas" @mousedown="moveBegin($event,index)"
                                @mousemove="move($event,index)"
                                @mouseout="leave($event,index)"
                                @mouseup="leave($event,index)"></canvas>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="coming-soon"></div>
            </div>

        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },

        data () {
            return {
                ratio:3,
                lineWidth:16,
                canvas: [],
                start: [],
                touched: [],
                hint: false,
                isUpdate: false
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAudioUrl',
                'setAnswer'
            ]),
            showHint(){
                this.hint = !this.hint;
                setTimeout(_ => {
                    this.hint ? this.hint = false : '';
                }, 8000);
            },
            moveBegin(ev, index){
                this.start[index] ? void 0 : this.start[index] = {};
                const start = this.start[index];
                start.x = ev.offsetX*this.ratio;
                start.y = ev.offsetY*this.ratio;
                const canvas = this.canvas[index];
                canvas.beginPath();
                canvas.moveTo(this.start.x, this.start.y);
                canvas.lineWidth = this.lineWidth;
                this.canvas.lineJoin = "round";
                this.canvas.lineCap = "round";
                canvas.strokeStyle = "#00fed8";
                this.touched[index] = true;
                this.setAnswer({
                    answer: true,
                    msg: ""
                })
            },
            move(ev, index){
                if (this.touched[index]) {
                    const canvas = this.canvas[index];
                    canvas.lineTo(ev.offsetX*this.ratio, ev.offsetY*this.ratio);
                    canvas.stroke();
                    canvas.save();
                }
            }, leave(ev, index){
                this.touched[index] = false;
            },
            init(){

                this.$nextTick(_ => {
                    if (this.$refs.canvas) {
                        for (let i = 0, len = this.$refs.canvas.length; i < len; i++) {
                            const ele = this.$refs.canvas[i];
                            ele.height = ele.parentNode.offsetHeight*this.ratio;
                            ele.width = ele.parentNode.offsetWidth*this.ratio;
                            ele.style.height = ele.parentNode.offsetHeight+"px";
                            ele.style.width = ele.parentNode.offsetWidth+"px";
                        }
                        for (let i = 0, len = this.$refs.canvas.length; i < len; i++) {
                            const ele = this.$refs.canvas[i];
                            this.canvas.push(ele.getContext("2d"));
                        }
                    }
                    if (this.content.audio) {
                        this.setAudioInfo({player: {display: 'block'}});
                        this.setAudioUrl(this.content.audio);
                    }
                })
            },

        },
        created(){
            this.init();
        },
        destroyed(){
            this.setAudioInfo({player: {display: 'none'}});
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
            haveImg(){
                let flag = false;
                try {
                    flag = R.ifElse(R.prop('image'), R.T, R.F)(this.content);
                } catch (e) {
                    return false;
                }
                return flag;
            },
            isEnglish(){
                return R.ifElse(R.prop('english'), R.T, R.F)(this.content);
            }
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerArr: "",
                    canvas: [],
                    start: [],
                    touched: [],
                    hint: false,
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
        components: {loadingImage,}
    }
</script>

<style lang="scss" scoped>
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

    @import "~~assets/sass/functions";
    @import "~~assets/sass/mixins";
    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
    }

    .theme-1 {
        text-align: center;
        .cell-list {
            margin-top: 150px;
            .rect-cell {
                $width: 240px;
                $ratio: (width:(480px), height:(480px));
                $height: getHeightFromAspectRatio($ratio, $width);
                width: $width;
                height: $height;
                display: inline-block;
                vertical-align: middle;
                margin: 0 50px;
                @include fullBgWithPicName('tianzige-yellow.png');
                cursor: pointer;
                background-size: 111% 110%;
                background-position: center;
            }
        }
    }

    .theme-2 {
        text-align: center;
        .tip-button {
            background: url(~~assets/img/main_content/exercise/tip-button-bg.png) no-repeat;
            min-width: 2.06rem;
            display: inline-block;
            margin: .4rem auto auto;
            height: .81rem;
            padding: 0 20px;
            font-size: .28rem;
            line-height: .78rem;
            cursor: pointer;
            font-family: Calibri;
            background-size: 100% 100%;
            color: #fff;
            &.more {
                font-size: 16px;
            }
        }
        .cell-list {
            margin: .8rem 0 .2rem 0;
            .rect-cell {
                $width: 240px;
                $ratio: (width:(480px), height:(480px));
                $height: getHeightFromAspectRatio($ratio, $width);
                width: $width;
                height: $height;
                display: inline-block;
                vertical-align: middle;
                margin: 20px 50px 0 50px;
                @include fullBgWithPicName('tianzige-bai.png');
                cursor: pointer;
                background-size: 111% 110%;
                background-position: center;
            }
        }
    }

    .theme-3 {
        text-align: center;
        margin-top: 100px;
        .cell-container {
            display: inline-block;
            vertical-align: middle;
            min-width: 5rem;
            max-width: 7rem;
            padding: 0.4rem;
            background-size: 100% 100%;
            @include fullBgWithPicName('level2/xiebg.png');
            &.overflow {
                padding: 1.2rem .9rem;
            }
            .rect-cell {
                $width: 150px;
                cursor: pointer;
                $ratio: (width:(480px), height:(480px));
                $height: getHeightFromAspectRatio($ratio, $width);
                width: $width;
                height: $height;
                display: inline-block;
                vertical-align: middle;
                margin: 10px;
                @include fullBgWithPicName('level2/tianzige.png');
            }
        }
        .english-option {
            display: inline-block;
            vertical-align: middle;
            font-size: 26px;
            color: #ffffff;
            width: 160px;
            min-height: .5rem;
            @include fullBgWithPicName('level2/pit.png');
            padding: 20px 40px;
        }
        .chinese-option {
            display: inline-block;
            vertical-align: middle;
            font-size: 26px;
            margin-left: 30px;
            li {
                margin-top: 20px;
            }
            .pinyin {
                color: #000000;
            }
            .chinese {
                color: #ffffff;
                min-width: 160px;
                font-size: 26px;
                height: 80px;
                @include fullBgWithPicName('level2/pit.png');
                padding: 20px 40px;
            }
            .under-pit {
                min-width: 160px;
                box-sizing: border-box;
                display: inline-block;
                color: #ffffff;
                height: 80px;
                @include fullBgWithPicName('level2/kuang.png');
                padding: 20px 40px;
            }
        }
    }

    .tools-list {
        position: absolute;
        margin-top: 20px;
        right: 100px;
        .hint-icon {
            cursor: pointer;
            width: 135px;
            height: 111px;
            @include fullBgWithPicName('hint.png');
            &:hover {
                transition: all .1s ease-in;
                opacity: .8;
            }
            &.active {
                transition: all .1s ease-in;
                filter: drop-shadow(2px 2px 2px black);
            }
        }
    }

    .player {
        position: absolute;
        @include exerciseContainer((width:103px, height:104px), 120px, 'bofang-yellow.png');
        top: 0;
        bottom: 0;
        left: 100px;
        margin: auto;
    }

</style>
