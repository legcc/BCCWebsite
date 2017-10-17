<template>
    <div>
        <el-collapse-transition>
            <figure class="tools-list" v-show="haveGifImage">
                <figcaption>
                    <div class="hint-icon" @click="hint||showHint()" :class="hint && 'active'"></div>
                </figcaption>
            </figure>
        </el-collapse-transition>
        <div :class="isUpdate&&'fadeIn'">
            <audio :src="audioUrl" class="audio" ref="audioPlayer"></audio>
            <div class="theme-1" v-if="templateStyle==='level-1'">
                <div class="practice_observe_choose practice_common_box" v-if="haveImg">
                    <div class="observe_choose_content" v-for="(item,index) in content.words">
                        <div class="observe_choose center_cell">
                            <div class="observe_choose_left">
                                <div class="center_cell">
                                    <div class="observe_choose_leftword">
                                        <canvas ref="canvas" @mousedown="moveBegin($event,index)"
                                                @mousemove="move($event,index)"
                                                @mouseout="leave($event,index)"
                                                @mouseup="leave($event,index)">
                                            Your browser does not support write operation
                                        </canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="observe_choose_right">
                                <div class="center_cell">
                                    <div class="observe_choose_right_1">
                                        <div class="center_cell"><span>{{item.pinyin}}</span><span
                                                class="observe_choose_wordimg"><loadingImage
                                                :src="!hint?addPrefixHost(item.defaultImage):`${addPrefixHost(item.gifImage)}?${Math.random()}`"></loadingImage></span><span>{{item.chinese || item.english || content.english}}</span>
                                        </div>
                                    </div>
                                    <div class="observe_choose_right_2">
                                        <div class="center_cell">
                                            <loadingImage
                                                    :src="addPrefixHost(item.image)"></loadingImage>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="write-container" v-else>
                    <div class="left">
                        <template v-if="!content.audio">
                            <div class="rect-cell" v-for="(item,index) in content.words"
                                 :style="compare&&{backgroundImage:`url(${addPrefixHost(item.image)})`,border:`2px solid green`}">
                                <canvas ref="canvas" @mousedown="moveBegin($event,index)"
                                        @mousemove="move($event,index)"
                                        @mouseout="leave($event,index)"
                                        @mouseup="leave($event,index)"></canvas>
                            </div>
                        </template>
                        <template v-else>
                            <div class="rect-cell" v-for="(item,index) in +content.wordNum"
                                 :style="compare&&{backgroundImage:`url(${addPrefixHost(item.image)})`,border:`2px solid green`}">
                                <canvas ref="canvas" @mousedown="moveBegin($event,index)"
                                        @mousemove="move($event,index)"
                                        @mouseout="leave($event,index)"
                                        @mouseup="leave($event,index)"></canvas>
                            </div>
                        </template>
                    </div>
                    <div class="right">
                        <template v-if="content.audio">
                            <div class="hint" @click="audioToggle($event,content.audio)"></div>
                        </template>
                        <template v-else>
                            <div class="content" v-for="(item,index) in content.words">
                                <!--如果是没有图片的就不给边框-->
                                <div class="rect-cell"
                                     :style="showCanvasImg(item)">
                                    <h2 class="pinyin" :class="isMore(item,10)">{{item.pinyin}}</h2>
                                    <h2 class="english" :class="isMore(item,10)" v-if="content.center!=='true'">
                                        {{item.english || content.english}}</h2>
                                </div>
                            </div>
                            <!--如果是只有一个英文的 需要居中-->
                            <!--如果没有图片的 还需要给文字网上移动一些-->
                            <h2 class="english-center" :class="isMore(content.english,10)"
                                v-if="content.center==='true'"
                                :style="englishCenter(content)">
                                {{content.english}}</h2>
                        </template>
                    </div>
                </div>
            </div>
            <div class="theme-2" v-if="templateStyle==='level-4'">
                <div class="template-content">
                    <p class="tip-button" v-if="!content.audio">
                        {{content.english || content.chinese || content.pinyin}}</p>
                    <ul class="canvas-container">
                        <li class="cell" v-for="(item,index) in content.words"
                            :style="l4CanvasStyle(item)">
                            <canvas ref="canvas" @mousedown="moveBegin($event,index)"
                                    @mousemove="move($event,index)"
                                    @mouseout="leave($event,index)"
                                    @mouseup="leave($event,index)"></canvas>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="theme-4" v-if="templateStyle==='level-2'">
                <div class="cell-container">
                    <div class="rect-cell" v-for="(item,index) in content.words"
                         :style="hint&&{backgroundImage:
                         `url(${addPrefixHost(item.gifImage)}?${Math.random()})`}">
                        <canvas ref="canvas" @mousedown="moveBegin($event,index)"
                                @mousemove="move($event,index)"
                                @mouseout="leave($event,index)"
                                @mouseup="leave($event,index)"></canvas>
                    </div>
                </div>
                <ul class="english-option" v-if="isEnglish">
                    <li>{{content.english}}</li>
                </ul>
                <ul class="chinese-option" v-if="!isEnglish">
                    <li><em class="pinyin">{{content.pinyin || content.words[0].pinyin}}</em></li>
                    <li>
                        <button class="chinese">{{content.chinese || content.words[0].chinese}}</button>
                    </li>
                    <li>
                        <div class="under-pit"></div>
                    </li>
                </ul>
            </div>
            <div v-if="templateStyle==='level-3'" class="theme-5">
                <div class="container">
                    <button class="cell-title">{{content.english}}</button>
                    <ul class="cell-list">
                        <li class="rect-cell" v-for="(item,index) in content.words"
                            :style="hint&&{backgroundImage:`url(${addPrefixHost(item.gifImage)}?${Math.random()})`}">
                            <canvas ref="canvas" @mousedown="moveBegin($event,index)"
                                    @mousemove="move($event,index)"
                                    @mouseout="leave($event,index)"
                                    @mouseup="leave($event,index)"></canvas>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    function isTest(target,name,dcrition) {
        console.log(target);
        console.log(name);
        console.log(dcrition);
    }
    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },

        data () {
            return {
                ratio:3,
                lineWidth:16,
                audioUrl: "",
                canvas: [],
                start: [],
                touched: [],
                hint: false,
                isUpdate: false
            }
        },
        methods: {
            @isTest
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
                    setTimeout(_ => {
                        if (this.content.audio) {
                            this.setAudioInfo({player: {display: 'block'}})
                        }
                    }, 600)
                });

            },
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer',
                'setAudioUrl'
            ]),
            l4CanvasStyle(item){
                let style ;
                if (this.hint){
                    style = {backgroundImage:`url(${this.addPrefixHost(item.gifImage)}?${Math.random()})`,border:`2px solid green`};
                }
                if(this.compare){
                    style = {backgroundImage:`url(${this.addPrefixHost(item.image)}?${Math.random()})`,border:`2px solid green`};
                }
                return style;
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
                this.checkAnswer();
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
            audioToggle(el, url){
                this.audioUrl = this.addPrefixHost(url);
                setTimeout(_ => {
                    const shapeAudio = this.$refs.audioPlayer;
                    if (!/active/.test(el.target.className)) {
                        el.target.classList.add("active");
//                    播放音乐 播放结束后移除active
                        shapeAudio.play();
                        const is_playFinish = setInterval(() => {
                            if (shapeAudio.ended) {
//                            音乐结束
                                el.target.classList.remove("active");
                                window.clearInterval(is_playFinish);
                            }
                        }, 600);
                    }
                })
            },
            checkAnswer(){
                this.setAnswer({
                    answer: true,
                    msg: `Correct chinese: ${R.join("、")(R.map(R.prop('chinese'))(this.content.words))}`
                })
            },
            showHint(){
                this.hint = !this.hint;
                setTimeout(_ => {
                    this.hint ? this.hint = false : '';
                }, 8000);
            },
            showCanvasImg(item){
                const style = {};
                if (item) {
                    style.backgroundImage = (this.hint && item.gifImage) ? `url(${this.addPrefixHost(item.gifImage)}?${Math.random()})` : `url(${this.addPrefixHost(item.defaultImage)})`;
                    style.border = (item.gifImage || item.defaultImage) ? '2px solid green' : '';
                }
                return style;
            },
            englishCenter(content){
                const style = {};
                content.words.forEach(item => {
                    if (item) {
                        (item.gifImage || item.defaultImage) ? void 0 : void function(){
                            style.bottom = '.3rem';
                            style.fontSize = '.48rem';
                            style.textShadow = '2px 2px 2px black';
                            style.color = 'green'
                        }();
                    }
                });
                return style;
            }
        },
        watch: {
            content()
            {
                console.log(this.content)
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    audioUrl: "",
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
        }
        ,
        created()
        {
            this.init();
        }
        ,
        destroyed()
        {
            setTimeout(_ => this.CompareControl(true), 100);
            this.setAudioInfo({player: {display: 'none'}});
        }
        ,
        computed: {
            ...
                mapState('index/exercise/index', {
                    templateStyle: state => state.templateStyle,
                    content: state => state.contentInfo ? state.contentInfo.content : {},
                    compare: state => state.compare
                }),

            haveImg()
            {
                let flag = false;
                try {
                    flag = R.ifElse(R.prop('image'), R.T, R.F)(this.content);
                } catch (e) {
                    return false;
                }
                return flag;
            }
            ,
            isEnglish()
            {
                return R.ifElse(R.prop('english'), R.T, R.F)(this.content);
            }
            ,
            haveGifImage()
            {
                return this.content.words && R.any(R.prop('gifImage'))(this.content.words);
            }
        }
        ,
        components: {
            loadingImage,
        }
    }
</script>

<style lang="scss" scoped>
    .audio {
        display: none;
    }

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

    .theme-1 {
        .practice_common_box {
            width: 750px;
            height: 100%;
            display: block;
            margin: 30px auto auto auto;
            position: relative;
            text-align: center;
            box-sizing: border-box;
        }
        .observe_choose_content {
            width: 100%;
            height: 100%;
            display: table;
        }
        .observe_choose {
            position: relative;
        }

        .center_cell {
            display: table-cell;
            vertical-align: middle;
        }
        .observe_lighten {
            float: left;
            width: 70px;
            height: 68px;
            cursor: pointer;
            display: inline-block;
            background: url(~~assets/img/main_content/exercise/lighten_img.png) no-repeat;
            background-position: center center !important;
            background-size: 100% 100% !important;
            position: absolute;
            margin: auto;
            top: 0;
            left: 0;
            right: -200px;
            bottom: 0;
            box-sizing: border-box;

        }
        .observe_choose_left {
            width: 450px;
            height: 400px;
            float: left;
            background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
            background-size: 100% 100%;
            background-position: -8px 10px;
            border-radius: 20px;
            padding: 50px;
            display: table;
            box-sizing: border-box;

        }
        .observe_choose_left .center_cell {
            width: 100%;
            height: 100%;
        }
        .center_cell {
            display: table-cell;
            vertical-align: middle;
        }
        .observe_choose_leftword {
            width: 200px;
            height: 200px;
            background: url(~~assets/img/main_content/exercise/writing_bg.png) no-repeat;
            background-size: 111% 110%;
            background-position: center;
            display: inline-block;
            cursor: pointer;
        }

        audio, canvas, progress, video {
            display: inline-block;
            vertical-align: baseline;
        }

        .observe_choose_right {
            width: 250px;
            height: 400px;
            float: right;
            display: table;
        }
        .observe_choose_right_1, .observe_choose_right_2 {
            width: 240px;
            height: 180px;
            margin: 0 auto;
            background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
            background-size: 95% 100%;
            background-position: center 6px;
            color: black;
            display: table;
        }
        .observe_choose_right_1 span, .observe_choose_right_2 span {
            display: block;
            font-size: 24px;
        }
        .observe_choose_right_1 .observe_choose_wordimg, .observe_choose_right_2 .observe_choose_wordimg {
            position: relative;
            width: 90px;
            height: 90px;
            margin: 0 auto;
        }
        .observe_choose_right_1 span, .observe_choose_right_2 span {
            display: block;
            font-size: 24px;
        }
        .observe_choose_right_1 .observe_choose_wordimg img, .observe_choose_right_2 .observe_choose_wordimg img {
            width: 100%;
            height: 100%;
        }
        .observe_choose_right_1 span, .observe_choose_right_2 span {
            display: block;
            font-size: 24px;
        }
        .observe_choose_right_1, .observe_choose_right_2 {
            width: 240px;
            height: 180px;
            margin: 0 auto;
            background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
            background-size: 95% 100%;
            background-position: center 6px;
            color: black;
            display: table;
        }
        .observe_choose_right .center_cell {
            width: 100%;
            height: 100%;
        }

        .observe_choose_right_2 img {
            width: 120px;
            height: 120px;
        }

    }

    /*level-1 no picture theme*/
    .write-container {
        $width: 850px;
        $ratio: (width:(981px), height:(494px));
        $height: getHeightFromAspectRatio($ratio, $width);
        width: $width;
        height: $height;
        @include fullBg('~~assets/img/exercise/xiebg.png');
        margin: 40px auto auto;
        padding: 20px;
        .left, .right {
            height: 100%;
            width: 50%;
            display: inline-block;
            line-height: 400px;
            text-align: center;
            vertical-align: middle;
            position: relative;
        }
        .content {
            display: inline-block;
            line-height: 1.4;
            vertical-align: middle;
        }
        .pinyin {
            font-size: 28px;
            color: green;
            left: 50%;
            top: -40px;
            position: absolute;
            transform: translateX(-50%);
            display: inline-block;
            width: 300%;
            font-family: GothamRounded-Medium;
        }
        .english {
            font-size: 28px;
            color: purple;
            font-family: GothamRounded-Medium;
            position: absolute;
            left: 50%;
            bottom: -40px;
            display: inline-block;
            width: 300%;
            transform: translateX(-50%);
        }
        .english-center {
            font-size: .28rem;
            color: purple;
            font-family: GothamRounded-Medium;
            position: absolute;
            left: 50%;
            bottom: 1rem;
            display: inline-block;
            white-space: nowrap;
            transform: translateX(-50%);
            line-height: 1.4;
        }
        .more {
            font-size: 20px;
            width: 3.6rem;
            height: 26px;
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
            margin: 0 20px;
            position: relative;
            @include fullBg('~~assets/img/exercise/tianzige.png');
            background-size: 111% 110%;
            background-position: center;
            canvas {
                vertical-align: top;
            }
        }
        .hint {
            $width: 150px;
            $ratio: (width:(225px), height:(197px));
            $height: getHeightFromAspectRatio($ratio, $width);
            width: $width;
            height: $height;
            display: inline-block;
            cursor: pointer;
            vertical-align: middle;
            @include fullBg('~~assets/img/main_content/exercise/audio_play.png');
            &.active {
                @include fullBgWithMainContentPicName("audio_play_active.png")
            }
        }
    }

    .theme-2 {
        .template-content {
            width: 700px;
            margin: 4% 0 0 25.5%;
            text-align: center;
        }

        .template-content .tip-button {
            background: url(~~assets/img/main_content/exercise/tip-button-bg.png) no-repeat;
            width: 206px;
            margin: 40px auto;
            height: 81px;
            font-size: 28px;
            line-height: 58px;
            cursor: pointer;
            font-family: Calibri;
            background-size: contain;
        }
        .canvas-container {
            display: inline-block;
            margin: 0 auto;
            text-align: center;
            li {
                margin: 0 40px;
                display: inline-block;
            }
        }
        .template-content [class$=-cell] {
            margin: 0 30px;
            transform: translateY(20%);
            display: inline-block;
        }
        .template-content .cell, .template-content .cell-bg-jing {
            width: 253px;
            height: 255px;
            border-radius: 5px;
            cursor: pointer;
        }

        .template-content .cell {
            background: url(~~assets/img/main_content/exercise/tianzige.png) no-repeat;
            background-size: 100% 100%  ;
            margin-top: 20px;
        }
        audio, canvas, progress, video {
            display: inline-block;
            vertical-align: baseline;
        }
        .template-content [class$=-cell] {
            margin: 0 30px;
            transform: translateY(20%);
            display: inline-block;
        }
        .template-content .hint {
            width: 76px;
            height: 76px;
            background: url(~~assets/img/main_content/exercise/hint-03.png);
            cursor: pointer;
            position: absolute;
            top: -33%;
            right: 0;
        }
        .template-content .cell, .template-content .cell-bg-jing {
            width: 253px;
            height: 255px;
            border-radius: 5px;
            cursor: pointer;
        }
        .template-content .cell {
            background: url(~~assets/img/main_content/exercise/tianzige.png) no-repeat;
            background-size: 100% 100%  ;
        }
    }

    .theme-4 {
        text-align: center;
        margin-top: 100px;
        .cell-container {
            display: inline-block;
            vertical-align: middle;
            min-width: 5rem;
            padding: 0.4rem;
            box-sizing: border-box;
            @include fullBgWithPicName('level2/xiebg.png');
            height: 280px;
            .rect-cell {
                $width: 150px;
                cursor: pointer;
                $ratio: (width:(480px), height:(480px));
                $height: getHeightFromAspectRatio($ratio, $width);
                width: $width;
                height: $height;
                display: inline-block;
                vertical-align: middle;
                margin: 0 10px;
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

    .theme-5 {
        text-align: center;
        .container {
            display: inline-block;
            .cell-title {
                min-width: 200px;
                margin-top: 30px;
                font-size: 28px;
                color: #ffffff;
                padding: 40px 60px;
                font-family: GothamRounded-Medium;
                text-align: center;
                @include fullBgWithPicName('content-button.png');
            }
            .cell-list {
                margin-top: 30px;
                .rect-cell {
                    $width: 240px;
                    $ratio: (width:(480px), height:(480px));
                    $height: getHeightFromAspectRatio($ratio, $width);
                    width: $width;
                    height: $height;
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 50px;
                    cursor: pointer;
                    @include fullBgWithPicName('tianzige-yellow.png');
                    background-size: 111% 110%;
                    background-position: center;
                }
            }
        }
    }

</style>
