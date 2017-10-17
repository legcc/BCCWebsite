<template>
    <div class="sky-container">
        <contentContainer v-loading="!dataIsComplete">
            <template v-if="!isEndpage">

                <article slot="body">
                    <div class="prompt-container" v-show="alert">
                        <div class="container">
                            <div class="reverseRotate">
                                <div class="animation-container">
                                    <aside class="prompt-success" v-show="answer">
                                        <ul>
                                            <li class="err-msg-container"><h2 class="message">Good practice!</h2></li>
                                            <li>
                                                <button class="prompt-btn" @click="checkAnswer($event,true)">ok</button>
                                            </li>
                                        </ul>
                                    </aside>
                                    <aside class="prompt-error" v-show="!answer">
                                        <ul>
                                            <li class="err-msg-container">
                                                <h2 class="label">answer:</h2>
                                                <strong class="message">{{errorMsg || 'null'}}</strong>
                                            </li>
                                            <li>
                                                <button class="prompt-btn" @click="checkAnswer($event,true)">ok</button>
                                            </li>
                                        </ul>
                                    </aside>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--audioStyle 对应音频的样式和内容-->
                    <div class="practice_left">
                        <div id="page_score_view" class="practice_score">
                            <!--星星(当前分数)-->
                            <ul>
                                <li :class="star" v-for="star in starArr"></li>
                            </ul>
                        </div>
                        <div class="practice_left_tool_container" :style="audioStyle">
                            <!--音频元素-->
                            <span v-show="showTool.player" :style="audioStyle.player"
                                  class="practice_audio_playing audio_start"
                                  @click="audioToggle">
                            <audio ref="audioPlayer"
                                   :src="audioUrl"></audio>
                        </span>
                            <!--音频倒计时-->
                            <span v-show="showTool.recorder" class="practice_speaking" @click.self="speakToggle">
                            <em v-show="countDownToggle">{{speakCountDown}}</em>
                        </span>
                        </div>
                    </div>
                    <!--模板-->
                    <nuxt/>
                    <div class="practice_right">
                        <div id="self_score_view" class="grade_box">
                            <p class="center_cell">
                                <!--右下角的星星(总分数)-->
                                <span class="grade" :class="turn?'addStar':''"></span>
                                <i>+</i>
                                <span class="grade_num">{{totalStar}}</span>
                            </p>
                        </div>
                    </div>
                </article>
                <aside slot="footer">
                    <!--check 按钮-->
                    <el-button v-if="exerciseModuleName==='Speaking'" type="primary"
                               @click="dataIsComplete&&save($event)"
                               :class="progressBegin&&'active'" :disabled="progressBegin" class="footer-btn">
                        save
                    </el-button>
                    <el-button v-else-if="exerciseModuleName==='Writing'" type="primary"
                               @click="dataIsComplete&&compare($event)"
                               :class="progressBegin&&'active'" :disabled="progressBegin" class="footer-btn">
                        compare
                    </el-button>
                    <el-button v-else type="primary" @click="dataIsComplete&&checkAnswer($event)"
                               :class="progressBegin&&'active'" :disabled="progressBegin" class="footer-btn">
                        check
                    </el-button>
                    <div class="practice_nav_box">
                        <!--上一页-->
                        <span class="practice_nav_prev" @click="dataIsComplete&&prePage()"></span>
                        <div class="progress">
                            <!--进度条-->
                            <div class="progress-bar progress-bar-info" role="progressbar"
                                 :style="'width:'+progress+'%'">
                            </div>
                        </div>
                        <!--下一页-->
                        <span class="practice_nav_next" @click="dataIsComplete&&nextPage()"></span>
                        <p class="practice_pagination">
                            <span>Page:</span>
                            <span>
                            <!--当前页码 由于计算是从0开始 所以显示需要加一 但是实际数据是从0开始处理-->
                            <i class="practice_current_page">{{curPageIndex + 1}}</i>
                            <em>/</em>
                            <i>{{totalPage}}</i>
                        </span>
                        </p>
                    </div>
                </aside>
            </template>
            <template v-else>
                <article slot="body">
                    <nuxt/>
                </article>
            </template>
        </contentContainer>
    </div>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex';
    import utils from '~/plugins/utils';
    import axios from 'axios';
    import contentContainer from '~/components/level_2_header.vue';
    import recorder from '~/plugins/gumadapter'
    import MediaStreamRecorder from '~/plugins/MediaStreamRecorder'
    import R from 'ramda'
    import loadingImage from '~/components/loadingImage'

    export default {
        data () {
            return {
                alert: false,
                progressBegin: false,
                progress: 0,
                curPageIndex: 0,
                speakCountDown: 2,
                countDownToggle: false,
//                右下角的星星转动
                turn: false,
                pageIn: false,
//                等待数据加载完毕
                dataIsComplete: true,
                beginTime: Date.now(),
                isEndpage: false
            }
        },

        methods: {
            ...mapActions('index/exercise/index', ['setAnswer', 'setTotalStar', 'setAudioUrl']),
            ...mapMutations('index/exercise/index', ['COMPARE']),
            prePage(){
                const ifHandler = _ => {
                    this.forWardPage(--this.curPageIndex);
                    const segment = (1 / (this.totalPage - 1)) * 100;
                    const num = utils.accSub(this.progress, segment);
                    this.progress = num < 0 ? 0 : num;

                    this.dataIsComplete = false;
                };
                const elseHandler = _ => {
                    setTimeout(_ => {
                        this.$message.error("NO PRE PAGE");
                    })
                };
                const condition = R.multiply(100)(1 / this.totalPage);
                R.ifElse(R.gte)(ifHandler, elseHandler)(this.progress)(condition);
            },
            nextPage(){
                const ifHandler = _ => {
                    this.forWardPage(++this.curPageIndex);
                    const segment = (1 / (this.totalPage - 1)) * 100;
                    this.progress = utils.accAdd(this.progress, segment);

                    this.dataIsComplete = false;
                };
                const elseHandler = _ => {
                    this.isEndpage = true;
                    this.$router.replace({
                        name: "exercise-index-consequence-level1"
                    });
                };
                const condition = R.multiply(100)(1 / this.totalPage);
                R.ifElse(R.lt)(ifHandler, elseHandler)(this.progress)(100 - condition);

            },
            speakToggle(el){
                if (!(/active/.test(el.target.className))
                    && /practice_speaking/.test(el.target.className)) {
                    el.target.classList.add("active");
//                    倒计时说话 倒计时结束后移除active
                    const timer = this.speakCountDown;
                    this.countDownToggle = true;
                    const eventLoop = setInterval(() => {
                        this.speakCountDown--;
                        if (!this.speakCountDown) {
                            this.speakCountDown = timer;
                            clearInterval(eventLoop);
                            this.countDownToggle = false;
                            el.target.classList.remove("active");
                        }
                    }, 1000);
                    this.record(timer);
                } else {
                    return void(0)
                }
            },
//            回答问题的check
            checkAnswer(ev, pass){
                this.alert = !this.alert;
                if (pass) {
                    const successHandler = _ => {
                        if (+this.contentInfo.star) {
                            this.setTotalStar(this.totalStar + (+this.contentInfo.star));
                            this.submitAnswer(1);
                        }
                        return false;
                    };
                    const errorHandler = _ => {
                        this.submitAnswer(0);
                        return false;
                    };
                    //                按钮进度条动画
                    this.progressBegin = true;
                    setTimeout(_ => {
//                            一秒按钮进度条动画
                        this.progressBegin = false;
                    }, 1000);
                    //                回答正确进行正确操作 否则错误操作
                    this.setAnswer({answer: R.ifElse(R.clone, successHandler, errorHandler)(this.answer), msg: ""});
//                翻页
                    this.nextPage();
                    this.turn = true;
                    setTimeout(_ => {
                        this.turn = false;
                    }, 1000);
                }
            },
            //            回答问题的compare
            compare(){
                this.COMPARE(true);
                this.dataIsComplete = false;
                const waitingTime = 3000;
                setTimeout(() => {
                    this.dataIsComplete = true;
                    const successHandler = _ => {
                        if (+this.contentInfo.star) {
                            this.setTotalStar(this.totalStar + (+this.contentInfo.star));
                            this.submitAnswer(1);
                        }
                        return false;
                    };
                    const errorHandler = _ => {
                        this.submitAnswer(0);
                        return false;
                    };
                    //                按钮进度条动画
                    this.progressBegin = true;
                    setTimeout(_ => {
//                            一秒按钮进度条动画
                        this.progressBegin = false;
                    }, 1000);
                    //                回答正确进行正确操作 否则错误操作
                    this.setAnswer({answer: R.ifElse(R.clone, successHandler, errorHandler)(true), msg: ""});
//                翻页
                    this.nextPage();
                    this.turn = true;
                    setTimeout(_ => {
                        this.turn = false;
                    }, 1000);
                    this.COMPARE(false);
                }, waitingTime)
            },
            //            回答问题的save
            save(){
                this.COMPARE(true);
                const waitingTime = 2000;
                this.dataIsComplete = false;
                setTimeout(() => {
                    this.dataIsComplete = true;
                    const successHandler = _ => {
                        if (+this.contentInfo.star) {
                            this.setTotalStar(this.totalStar + (+this.contentInfo.star));
                            this.submitAnswer(1);
                        }
                        return false;
                    };
                    const errorHandler = _ => {
                        this.submitAnswer(0);
                        return false;
                    };
                    //                按钮进度条动画
                    this.progressBegin = true;
                    setTimeout(_ => {
//                            一秒按钮进度条动画
                        this.progressBegin = false;
                    }, 1000);
                    //                回答正确进行正确操作 否则错误操作
                    this.setAnswer({answer: R.ifElse(R.clone, successHandler, errorHandler)(true), msg: ""});
//                翻页
                    this.nextPage();
                    this.turn = true;
                    setTimeout(_ => {
                        this.turn = false;
                    }, 1000);
                    this.COMPARE(false);
                }, waitingTime)
            },
            audioToggle(el){
                const shapeAudio = this.$refs.audioPlayer;
                if (!/active/.test(el.target.className)) {
//                    播放时禁止跳页
                    this.dataIsComplete = false;
                    el.target.classList.add("active");
//                    播放音乐 播放结束后移除active
                    shapeAudio.play();
                    const is_playFinish = setInterval(() => {
                        if (shapeAudio.ended) {
//                            结束后允许跳页
                            this.dataIsComplete = true;
//                            音乐结束
                            el.target.classList.remove("active");
                            window.clearInterval(is_playFinish);
                        }
                    }, 1000);
                }
            },
            async  forWardPage(num){
//                模板对应字典
                const TEMPLATE_PATH_DICTIONARY = require('~/static/template_path');
//                获取对应页码的模板 即从详情页面获取到的模板数组中对应角标的模板对象
                const TEMPLATE = this.templates[num];

//                根据模板对象中的template_no获取到模板对应的vue文件名称 即路由路径
                const ENTRY_PATH = R.pipe(R.prop('template_no'), R.prop)(TEMPLATE)(TEMPLATE_PATH_DICTIONARY);


                const notEqualNextTemp = _ => {
                    this.setTemplateStyle(`level-${TEMPLATE.level}`);
                    this.$router.replace({
                        name: `exercise-${ENTRY_PATH}`,
                        params: {
                            lessonId: TEMPLATE.lesson,
                            exerciseId: TEMPLATE.exerciseId,
                            textId: TEMPLATE.pageNum
                        }
                    })
                };
                const isEqualNextTemp = _ => {
                    this.setTemplateStyle(`level-${TEMPLATE.level}`);
                    this.setContentInfo({
                        lessonId: TEMPLATE.lesson,
                        exerciseId: TEMPLATE.exerciseId,
                        textId: TEMPLATE.pageNum
                    });
                };
                const judgment = R.ifElse(R.equals, isEqualNextTemp, notEqualNextTemp);

                const curTempName = this.$router.currentRoute.name;
                const nextTempName = `exercise-${ENTRY_PATH}`;

                judgment(curTempName)(nextTempName);

            },
//            录音
            record(second){
                let httpPath = this.httpPath;
                let captureUserMedia = (mediaConstraints, successCallback, errorCallback) => {
                    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
                };
                this.setAnswer({
                    answer: true,
                    msg: ""
                });
//                录音时开启等待
                this.dataIsComplete = false;
                let onMediaSuccess = (stream) => {
                    let mediaRecorder = new MediaStreamRecorder(stream);
                    mediaRecorder.stream = stream;
                    mediaRecorder.recorderType = MediaStreamRecorder.StereoAudioRecorder;
                    mediaRecorder.audioChannels = 1;
                    mediaRecorder.mimeType = 'audio/wav';
                    mediaRecorder.ondataavailable = function (blob) {
                        let file = new File([blob], Date.now() + '.wav', {type: blob.type, lastModified: Date.now()});
                        let data = new FormData();
                        data.append('recording', file);
                        data.append('uid', 7);
                        axios.post(httpPath + '/api/study/moveSoundRecording', data)
                            .then(function (result) {
                            }).catch((e) => {

                        });

                    };
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, parseInt(second) * 1000);
                    mediaRecorder.start(parseInt(second) * 1000);
                };
                let onMediaError = (e) => {
                    console.error('media error', e);
                };
                setTimeout(() => {
                    //                录音结束时取消等待动画
                    this.dataIsComplete = true;
                }, parseInt(second) * 1000);
                let mediaConstraints = {audio: true};
                captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);


            },
            ...mapActions('index/exercise/index', ['setContentInfo', 'setTemplateStyle']),
            async submitAnswer(isTrue){

                const endTime = Date.now() - this.beginTime;
                this.beginTime = Date.now();
                let res = await utils.sendAxiosPost('/api/study/checkExercise', {
                    uid: this.userInfo.uid,
                    customerType: this.userInfo.customerType,
                    exercisePageId: this.contentInfo.id,
                    levelId: this.exerciseInfo.levelId,
                    lessonId: this.exerciseInfo.lessonId,
                    classId: this.exerciseInfo.classId,
                    costTime: endTime,
                    totalStar: +this.contentInfo.star,
                    earnedStar: isTrue && +this.contentInfo.star,
                    result: isTrue
                });

            }
        },
        created(){
            this.forWardPage(this.curPageIndex);
            this.setTotalStar(0);
        },
        computed: {
            ...mapState('index/exercise/index', {
                templates: state => state.templates
//                所有内容 包括标题等
                , contentInfo: state => state.contentInfo
//                模板数据
                , content: state => state.contentInfo.content
                , audioStyle: state => state.audioStyle
                , totalPage: state => state.totalPage
//                每个模板问题是否正确
                , answer: state => state.answer
                , errorMsg: state => state.errorMsg
                , totalStar: state => state.totalStar
                , exerciseInfo: state => state.exerciseInfo
                , exerciseModuleName: state => state.exerciseModuleName
                , audioUrlWithOutHost: state => state.audioUrl
            }),
            audioUrl(){
                const defaultAudio = R.defaultTo("");
                return this.addPrefixHost(R.replace("/^\//", "")(defaultAudio(this.audioUrlWithOutHost)));
            },
            showTool(){
                const shower = {player: false, recorder: false};
                switch (this.exerciseModuleName) {
                    case "Listening":
                        shower.player = true;
                        break;
                    case "Speaking":
                        shower.player = true;
                        shower.recorder = true;
                        break;
                    case "Reading":
                        break;
                    case "Writing":
                        break;
                }
                return shower;
            },
            starArr(){
                const emptyStarArr = ["", "", ""];
                const starCount = +this.contentInfo.star || 0;

                const mapWithIndex = R.addIndex(R.map);
                const judgment = R.ifElse(R.gt, R.always('practice_grade_plus'), R.always(''))(starCount);
                const mapFn = (item, index) => (judgment(index));
                const thisPageStarArr = mapWithIndex(mapFn)(emptyStarArr);
                return thisPageStarArr;
            },
            userInfo(){
                return this.$store.state.authUser;
            },
            promptMsg(){
                const msg = this.errorMsg || 'There is no information !';
                return msg.replace(':', `:<br>`)
            }
        },
        watch: {
            contentInfo(){
//                当数据发生变化才允许点击下一步按钮
                this.dataIsComplete = true;
//                更新音频资源
                const defaultAudio = R.defaultTo("");
                this.setAudioUrl(defaultAudio(this.content.audio));
            }
        },
        components: {
            contentContainer,
            loadingImage
        }
    }
</script>
<style lang="less">
    .el-loading-mask {
        background-color: transparent;
    }
</style>
<style lang="less" scoped>
    @keyframes rotate {
        0% {
            transform: rotateX(0deg) rotateZ(0deg);
        }
        50% {
            transform: rotateX(20deg) rotateZ(180deg);
        }
        100% {
            transform: rotateX(0deg) rotateZ(360deg);
        }
    }

    @keyframes reverseRotate {
        to {
            transform: rotate(-360deg);
        }
    }

    .prompt-container {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .5);
        z-index: 9999;
        font-family: GothamRounded-Medium;

        .container {
            position: absolute;
            width: 630px;
            height: 600px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            transform-style: preserve-3d;
            perspective: 1000px;
        }
        .reverseRotate {
            position: absolute;
            width: 630px;
            height: 600px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            animation: reverseRotate 5s linear infinite reverse;
        }
        .animation-container {
            position: absolute;
            width: 630px;
            height: 600px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            animation: rotate 5s linear infinite reverse;
        }
        .prompt-success {
            background: url("~~assets/img/exercise/popup_good.gif") no-repeat;
            background-size: 100% 100%;
            background-position: left bottom -50px;
            .err-msg-container {
                word-wrap: break-word;
            }
            .message {
                margin: .05rem 20px 0 20px;
                width: 100%;
                font-size: 35px;
                color: #FF4658;
                text-shadow: 3px 3px 0 #ccc, 5px 5px 0 #eee;
            }
        }
        .prompt-error {
            background: url("~~assets/img/exercise/popup_error.gif") no-repeat;
            background-size: 100% 100%;
            background-position: left bottom -50px;
            .err-msg-container {
                word-wrap: break-word;
            }
            .label, .message {
                margin-top: 5px;
                font-size: 28px;
                color: #FF4658;
            }
        }
        .prompt-success, .prompt-error {
            position: absolute;
            width: 430px;
            height: 400px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background-color: white;
            border-radius: 12px;
            border: 1px solid #cccccc;
            text-align: center;

            .prompt-btn {
                width: 230px;
                height: 40px;
                background-color: #009eb0;
                border-radius: 22px;
                position: absolute;
                left: 0;
                font-size: 28px;
                color: white;
                right: 0;
                bottom: 10px;
                margin: auto;
            }
        }
    }

    .sky-container {
        background: url("~~assets/img/exercise/level2/bg-green.png") no-repeat;
        background-size: 100% 100%;
        padding-bottom: .5rem;
        position: relative;
        min-height: 100%;
    }

    .page-enter-active, .page-leave-active {
        transition: transform .2s ease-in-out
    }

    .page-enter, .page-leave-active {
        transform: translateX(130%);
    }

    /*left*/
    .practice_left {
        width: 150px;
        height: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        top: 0;
    }

    .content-body {
        position: relative;
    }

    .practice_score {
        display: inline-block;
        width: 223px;
        height: 191px;
        background: url("~~assets/img/exercise/level2/star-bg.png") no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        position: absolute;
        left: 0;
        top: 76px;
    }

    .practice_score ul {
        display: block;
        margin: 0;
        position: absolute;
        bottom: 15px;
        left: .72rem;
    }

    .practice_score ul li {
        width: 32px;
        height: 32px;
        display: inline-block;
        background: url("~~assets/img/main_content/exercise/practice_grade.png") no-repeat;
        background-size: 100% 100% !important;
        background-position: center center !important;
        animation: star-out .5s ease-in;
    }

    .practice_grade_plus {
        background: url("~~assets/img/main_content/exercise/practice_grade_2.png") no-repeat !important;
        animation: star-in .5s ease-in !important;
    }

    @keyframes star-in {
        0% {
            opacity: 0;
            transform: translateX(-.2rem) rotate(.5turn);
        }
        100% {
            opacity: 1;
            transform: translateX(0) rotate(0);
        }
    }

    @keyframes star-out {
        0% {
            opacity: 1;
            transform: translateX(.2rem) rotate(.5turn);
        }
        100% {
            opacity: 0;
            transform: translateX(0) rotate(0);
        }
    }

    .practice_left_tool_container {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 60;
    }

    /*播放按钮*/
    .audio_start {
        position: absolute;
        width: 120px;
        height: 120px;
        background: url("~~assets/img/exercise/green-audio.png") no-repeat;
        background-size: 100% 100%;
        left: .3rem;
        top: 60%;
        cursor: pointer;
        transform: translateY(-50%);
        &.active {
            background-image: url("~~assets/img/exercise/green-active.gif");
        }
    }

    .practice_speaking {
        position: absolute;
        cursor: pointer;
        width: 120px;
        height: 120px;
        line-height: 100px;
        text-align: center;
        background: url("~~assets/img/exercise/record-normal-state.png") no-repeat;
        background-size: 100% 100%;
        left: .3rem;
        top: 80%;
        color: #692f13;
        font-size: 28px;
        font-family: GothamRounded-Medium;
        transform: translateY(-50%);
        &.active {
            transition: all .1s ease-in;
            background: url("~~assets/img/exercise/record-active.gif") no-repeat;
            background-size: 100% 100%;
        }
    }

    /*footer*/
    .footer-btn {
        width: 1.8rem;
        font-family: GothamRounded-Medium;
        font-size: 18px;
        position: absolute;
        top: -.7rem;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 20;
        background: #fc5c26 linear-gradient(#be9117 0) no-repeat;
        background-size: 0 100%;
        border: none;
        outline: none;
        &.active {
            background-size: 100% 100%;
            transition: all .8s linear;
        }

    }

    /*right*/
    .practice_right {
        width: 150px;
        text-align: center;
        position: absolute;
        right: 50px;
        bottom: 0;
    }

    .grade_box {
        border: 2px solid white;
        background: white;
        width: 120px;
        height: 50px;
        font-weight: 700;
        border-radius: 30px;
        -webkit-box-shadow: 2px 4px 5px #888888 inset;
        box-shadow: 2px 4px 5px #888888 inset;
        display: table;
        font-size: 26px;
        color: #FFA447;
        position: absolute;
        bottom: 15px;
        left: 15px;

    }

    .grade {
        &.addStar {
            animation: turnStar 1.2s ease-in-out;
        }
    }

    @keyframes turnStar {
        0% {
            transform: none;
        }
        50% {
            transform: scale(1.5) rotateY(180deg);
        }
        100% {
            transform: none;
        }
    }

    .grade_box p {
        margin: 0 auto;
        text-align: center;
        top: 50%;
        left: 0;
        right: 0;
        position: absolute;
        transform: translateY(-50%);
    }

    .grade_box span,
    .grade_box i {
        display: inline-block;
        vertical-align: middle;
        *zoom: 1;
        *display: inline;
    }

    .grade_box .grade {
        width: 30px;
        height: 30px;
        display: inline-block;
        background: url("~~assets/img/main_content/exercise/grade_icon.png") no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        vertical-align: middle;
        *zoom: 1;
        *display: inline;
    }

    /*footer*/
    .footer-btn {
        width: 1.8rem;
        font-family: GothamRounded-Medium;
        font-size: 18px;
        position: absolute;
        top: -.3rem;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 20;
        border-color: #1e682b;
        background: #1e682b linear-gradient(lighten(#1e682b, 10%) 0) no-repeat;
        background-size: 0 100%;
        &.active {
            background-size: 100% 100%;
            transition: all .8s linear;
        }

    }

    .practice_nav_box {
        width: 100%;
        max-width: 650px;
        padding-top: .4rem;
        display: block;
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
    }

    .practice_nav_prev,
    .practice_nav_next {
        vertical-align: middle;
        *zoom: 1;
        *display: inline;
        width: 30px;
        height: 25px;
        display: inline-block;
        background-size: 100% 100% !important;
        background-position: center center !important;
        cursor: pointer;
    }

    .practice_nav_prev {
        background: url("~~assets/img/exercise/l.png") no-repeat;
        float: left;
    }

    .practice_nav_next {
        background: url("~~assets/img/exercise/r.png") no-repeat;
        float: right;
    }

    .practice_nav_box .progress {
        vertical-align: middle;
        *zoom: 1;
        *display: inline;
        width: 75%;
        margin: 0;
        height: 28px;
        display: inline-block;
        background: linear-gradient(180deg, #092506, #0e3413, #061804);
        -webkit-box-shadow: 2px 2px 2px black inset;
        box-shadow: 2px 2px 2px black inset;
        border-radius: 8px;
        overflow: visible;
        padding: 2px 0;
    }

    .practice_nav_box .progress-bar {
        position: relative;
        background: repeating-linear-gradient(-60deg, #28951c, #28951c 10px, #0e2c14 0, #0e2c14 20px);
        background-size: 100% 100%;
        border-radius: 8px;
    }

    .progress-bar {
        height: 100%;
        transition: all .5s linear;
    }

    .practice_nav_box .nav_progress_step_box {
        display: block;
        position: absolute;
        right: -25px;
        bottom: -10px;
        margin: 0;
    }

    .practice_nav_box .nav_progress_step_box .nav_progress_step {
        width: 50px;
        height: 50px;
        display: block;
        background: url("~~assets/img/exercise/hua.png") no-repeat;
        background-size: 100% 100%;
    }

    .practice_pagination {
        margin-top: 10px;
        margin-bottom: 0;
        color: #0d4e15;
        font-weight: 700;
    }

    .practice_pagination span,
    .practice_pagination i {
        display: inline-block;
    }

</style>
