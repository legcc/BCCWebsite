<template>
    <div id="background-container">

        <div class="sky-container">
            <!--系统提示音频-->
            <audio :src="addPrefixHost('tools/audio/click-wrong.mp3')" ref="wrong" style="display: none;"></audio>
            <audio :src="addPrefixHost('tools/audio/click-right.wav')" ref="success" style="display: none;"></audio>
            <contentContainer :isEndpage="!!isEndpage" v-loading="!dataIsComplete">
                <template v-if="!isEndpage">
                    <article slot="body">
                        <div class="prompt-container" v-show="alert">
                            <div class="outer-container">
                                <div class="reverseRotate">
                                    <div class="animation-container">
                                        <aside class="prompt-success" v-show="answer">
                                            <ul>
                                                <li class="err-msg-container">
                                                    <h2 class="label">
                                                        {{(promptSuccessMsg || successPrompt) ? 'good practice!' : 'You are great!'}}</h2>
                                                    <strong class="message"
                                                            style="display: inline-block;text-align: left"
                                                            :class="isOverFlow(promptSuccessMsg,36)&&'overflow'"
                                                            v-html="promptSuccessMsg"></strong>
                                                </li>
                                                <li>
                                                    <button class="prompt-btn" @click="checkAnswer($event,true)">ok
                                                    </button>
                                                </li>
                                            </ul>
                                        </aside>
                                        <aside class="prompt-error" v-show="!answer">
                                            <ul>
                                                <li class="err-msg-container">
                                                    <h2 class="label">answer:</h2>
                                                    <strong class="message"
                                                            style="display: inline-block;text-align: left"
                                                            v-html="promptErrorMsg"></strong>
                                                </li>
                                                <li>
                                                    <button class="prompt-btn" @click="checkAnswer($event,true)">ok
                                                    </button>
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
                                <el-collapse-transition>
                            <span v-show="showAudio"
                                  class="practice_audio_playing audio_start"
                                  @click="audioToggle">
                            <audio ref="audioPlayer"
                                   :src="audioUrl"></audio>
                        </span>
                                </el-collapse-transition>
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
                        <el-button v-else-if="exerciseModuleName==='Writing'&&showCompare" type="primary"
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
                                    <p class="nav_progress_step_box">
                                        <span class="nav_progress_step"></span>
                                    </p>
                                </div>
                            </div>
                            <!--下一页-->
                            <span class="practice_nav_next" @click="dataIsComplete&&nextPage()"></span>
                            <p class="practice_pagination">
                                <span style="margin-right: 10px">Lesson - {{exerciseInfo.lessonId}}</span>
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
    </div>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex';
    import utils from '~/plugins/utils';
    import axios from 'axios';
    import contentContainer from '~/components/level_4_header.vue';
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
                speakCountDown: 8,
                countDownToggle: false,
//                右下角的星星转动
                turn: false,
                pageIn: false,
//                等待数据加载完毕
                dataIsComplete: true,
                beginTime: Date.now(),
                isEndpage: false,
//                compare时间
                waitingTime: 5000
            }
        },

        methods: {
            ...mapActions('index/exercise/index', ['setAnswer', 'setTotalStar', 'setAudioUrl']),
            ...mapMutations('index/exercise/index', ['COMPARE', 'Correct', 'InitStatisticsInfo']),
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
//            文字是否溢出
            isOverFlow(msg, len){
                return msg && msg.length > len;
            },
//            回答问题的check
            checkAnswer(ev, pass){
//                不检查的情况
                if (this.noCheck) {
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
//不检查情况默认执行错误方法
                    this.setAnswer({answer: errorHandler(), msg: ""});
//                翻页
                    this.nextPage();
                    this.turn = true;
                    setTimeout(_ => {
                        this.turn = false;
                    }, 1000);
                }
//                如果检查
                else {
                    this.alert = !this.alert;
                }
//                如果检查通过
                if (pass) {
                    const successHandler = _ => {
                        if (+this.contentInfo.star&&!this.statisticsInfo.correct[this.curPageIndex]) {
                            this.setTotalStar(this.totalStar + (+this.contentInfo.star));
                            this.Correct({pageNum: this.curPageIndex, isCorrect: true});
                            this.submitAnswer(1);
                        }
                        return false;
                    };
                    const errorHandler = _ => {
                        this.submitAnswer(0);
                        this.Correct({pageNum: this.curPageIndex, isCorrect: false});
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
//                不通过
                else {
                    this.answer ? this.$refs.success.play() : this.$refs.wrong.play();
                }
            },
            //            回答问题的compare
            compare(){
                this.COMPARE(true);
                this.dataIsComplete = false;
                const waitingTime = this.waitingTime;
                setTimeout(() => {
                    this.dataIsComplete = true;
                    const successHandler = _ => {
                        if (+this.contentInfo.star&&!this.statisticsInfo.correct[this.curPageIndex]) {
                            this.setTotalStar(this.totalStar + (+this.contentInfo.star));
                            this.Correct({pageNum: this.curPageIndex, isCorrect: true});
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
                        if (+this.contentInfo.star&&!this.statisticsInfo.correct[this.curPageIndex]) {
                            this.setTotalStar(this.totalStar + (+this.contentInfo.star));
                            this.Correct({pageNum: this.curPageIndex, isCorrect: true});
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
                    mediaRecorder.ondataavailable = (blob) => {
                        let file = new File([blob], Date.now() + '.wav', {type: blob.type, lastModified: Date.now()});
                        let data = new FormData();
                        data.append('recording', file);
                        data.append('uid', this.$store.state.authUser.uid);
                        data.append('exerciseId', this.contentInfo.id);
                        data.append('exercisePageId', this.templates[0].exerciseId);
                        axios.post(httpPath + '/api/study/moveSoundRecording', data)
                            .then((result) => {
                                console.log(result);
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
//           初始化练习信息
            this.InitStatisticsInfo();
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
                , noCheck: state => state.noCheck
                , errorMsg: state => state.errorMsg
//                统计数据
                , statisticsInfo: state => state.statisticsInfo
                , successMsg: state => state.successMsg
                , totalStar: state => state.totalStar
                , exerciseInfo: state => state.exerciseInfo
                , exerciseModuleName: state => state.exerciseModuleName
                , audioUrlWithOutHost: state => state.audioUrl
                , showCompare: state => state.showCompare
                , successPrompt: state => state.successPrompt
            }),
            showAudio(){
                let flag = this.showTool.player;
                if (this.audioStyle.player && this.audioStyle.player.display) {
                    flag = flag && this.audioStyle.player.display === 'block';
                }
                return flag;
            },
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
            promptErrorMsg(){
                const msg = this.errorMsg || 'There is no information !';
                return msg.replace(/\n/g, `<br>`);
            }, promptSuccessMsg(){
                const msg = this.successMsg || '';
                return msg.replace(/\n/g, `<br>`);
            },
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

        .outer-container {
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
            background-repeat: no-repeat;

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

        .prompt-success {
            background-image: url("~~assets/img/exercise/popup_good.gif");
            background-size: 100% 100%;
            background-position: left bottom -50px;
            background-color: #f6f6f2;
            .err-msg-container {
                word-wrap: break-word;
            }
            .label {
                margin: .05rem auto;
                width: 100%;
                font-size: 35px;
                color: #FF4658;
                text-shadow: 3px 3px 0 #ccc, 5px 5px 0 #eee;
            }
            .message {
                margin: .05rem .4rem;
                font-size: 28px;
                color: #FF4658;
                word-break: break-all;
                &.overflow {
                    font-size: 22px;
                }
            }
        }
        .prompt-error {
            background-image: url("~~assets/img/exercise/popup_error.gif");
            background-size: 100% 89%;
            background-position: left bottom -.4rem;
            background-color: #f6f6f2;
            height: 430px;
            .err-msg-container {
                word-wrap: break-word;
            }
            .label, .message {
                margin: .05rem .4rem;
                font-size: 28px;
                color: #FF4658;
            }
        }
    }

    .sky-container {
        padding-bottom: .5rem;
        position: relative;
        transition: all .2s linear;
        height: 100%;
        background: url("~~assets/img/main_content/layouts/level4-body-bg.png");
        background-size: 100% 100%;
    }

    .page-enter-active, .page-leave-active {
        transition: opacity .2s ease-in-out
    }

    .page-enter, .page-leave-active {
        opacity: 0;
    }

    /*left*/

    .practice_left {
        width: 150px;
        text-align: center;
        position: absolute;
        left: 50px;
        top: 80px;
        padding-top: 8%;
        bottom: 0;
    }

    .practice_score {
        display: inline-block;
        width: 186px;
        height: 213px;
        background: url(~~assets/img/main_content/exercise/left-icon-score.png) no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        position: absolute;
        left: -20%;
        top: 8%;
    }

    .practice_left ul {
        top: 29%;
        left: 25%;
        position: absolute;
        .practice_grade_plus {
            background: url(~~assets/img/main_content/exercise/practice_grade_2.png) no-repeat;
            background-size: 100% 100%;
            background-position: center center;
        }
    }

    .practice_score ul li {
        width: 22px;
        height: 22px;
        display: inline-block;
        background: url(~~assets/img/main_content/exercise/practice_grade.png) no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        &:nth-child(2) {
            margin-bottom: -20%;
        }
    }

    .audio_start {
        position: absolute;
        width: 120px;
        height: 120px;
        background: url("~~assets/img/exercise/bofang-blue.png") no-repeat;
        background-size: 100% 100%;
        left: 0;
        cursor: pointer;
        top: 60%;
        transform: translateY(-50%);
        z-index: 99;
        &.active {
            filter: drop-shadow(2px 2px 4px black);
        }
    }

    .practice_speaking {
        position: absolute;
        cursor: pointer;
        z-index: 99;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
        background: url("~~assets/img/exercise/l4-speaker.png") no-repeat;
        background-size: 100% 100%;
        left: 0;
        top: 85%;
        color: #692f13;
        font-size: 28px;
        font-family: GothamRounded-Medium;
        transform: translateY(-50%);
        &.active {
            transition: all .1s ease-in;
            background: url("~~assets/img/exercise/l4-speaker-active.png") no-repeat;
            background-size: 100% 100%;
        }
    }

    /*底部*/
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
        background: #6151af linear-gradient(#7361d1 0) no-repeat;
        background-size: 0 100%;
        border: none;
        outline: none;
        &.active {
            background-size: 100% 100%;
            transition: all .8s linear;
        }

    }

    .practice_nav_box {
        width: 100%;
        max-width: 650px;
        display: block;
        position: absolute;
        margin: auto;
        top: 30%;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
    }

    .practice_nav_prev {
        background: url(~~assets/img/main_content/exercise/next.png) no-repeat;
        float: left;
    }

    .practice_nav_prev, .practice_nav_next {
        vertical-align: middle;
        width: 30px;
        height: 25px;
        display: inline-block;
        background-size: 100% 100% !important;
        background-position: center center !important;
        cursor: pointer;
    }

    .practice_nav_box .progress {
        vertical-align: middle;
        width: 75%;
        margin: 0;
        height: 18px;
        display: inline-block;
        border: 1px groove white;
        border-radius: 20px;
        overflow: visible;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
        background: linear-gradient(to top, #ffffff, #a7a9e6 70%);

    }

    .practice_nav_box .progress-bar {
        position: relative;
        background: -webkit-linear-gradient(135deg, #43B0F5 25%, #3282B7 0, #3282B7 50%, #43B0F5 0, #43B0F5 75%, #3282B7 0);
        background: linear-gradient(-45deg, #43B0F5 25%, #3282B7 0, #3282B7 50%, #43B0F5 0, #43B0F5 75%, #3282B7 0);
        background-size: 6px 6px;
        border-radius: 20px;
    }

    .progress-bar {
        float: left;
        width: 0;
        height: 100%;
        font-size: 12px;
        line-height: 20px;
        color: #fff;
        text-align: center;
        background-color: #337ab7;
        -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
        box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
        -webkit-transition: width .6s ease;
        -o-transition: width .6s ease;
        transition: width .6s ease;
    }

    .practice_nav_next {
        background: url(~~assets/img/main_content/exercise/prev.png) no-repeat;
        float: right;
    }

    .practice_pagination {
        margin: 17px auto auto;
        color: #6600fe;
        font-weight: 700;
    }

    .practice_pagination span, .practice_pagination i {
        display: inline-block;
    }

    .practice_nav_box .nav_progress_step_box {
        display: block;
        position: absolute;
        right: -40px;
        bottom: -14px;
        margin: 0;
    }

    .practice_nav_box .nav_progress_step_box .nav_progress_step {
        width: 80px;
        height: 60px;
        display: block;
        background: url(~~assets/img/main_content/exercise/progress-icon.png) no-repeat left bottom -6px;
        background-size: 100% 100%;
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

</style>
