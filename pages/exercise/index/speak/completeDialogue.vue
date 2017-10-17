<template>
    <div :class="isUpdate&&'fadeIn'">
        <audio :src="audioUrl" class="audio" ref="audioPlayer"></audio>
        <div class="theme-1" v-if="templateStyle==='level-1'">
            <ul class="content">
                <li v-for="(dialogue,index) in dialogueArr">
                    <section class="question">
                        <loadingImage :src="addPrefixHost(dialogue.question&&dialogue.question.headImage)" alt=""
                                      class="question-head"></loadingImage>
                        <div class="question-content">
                            <p class="bubble-left">
                                <template
                                        v-if="!(dialogue.question&&(dialogue.question.pinyin||dialogue.question.chinese))">
                                    <button class="audio-icon"
                                            @click="audioToggle($event,dialogue.question.audio||dialogue.answer.audio)"></button>
                                </template>
                                <template v-else>
                                    <span class="pinyin">{{dialogue.question && dialogue.question.pinyin}}</span>
                                    <span class="chinese">{{dialogue.question && dialogue.question.chinese}}</span>
                                </template>
                            </p>
                            <em class="english">{{dialogue.question && dialogue.question.english}}</em>
                        </div>
                    </section>
                    <section class="answer">
                        <div class="answer-content">
                            <p class="bubble-right">
                                <button class="record-icon"
                                        @click="speakCountDown[index]||speakToggle($event,dialogue.answer.readTime,index)">{{speakCountDown[index]}}
                                </button>
                            </p>
                            <em class="english">{{dialogue.answer && (dialogue.answer.english||dialogue.answer.readNote)}}</em>
                        </div>
                        <loadingImage :src="addPrefixHost(dialogue.answer&&dialogue.answer.headImage)" alt=""
                                      class="answer-head"></loadingImage>
                        <button class="hint-icon"
                                @click="audioToggle($event,dialogue.question.audio||dialogue.answer.audio)"></button>
                    </section>
                </li>
            </ul>
        </div>
        <div class="theme-2" v-if="templateStyle==='level-2'">
            <ul class="content">
                <li v-for="(dialogue,index) in dialogueArr">
                    <section class="question">
                        <loadingImage
                                :src="addPrefixHost(dialogue.question&&(dialogue.question.headImage||dialogue.question.image))"
                                alt=""
                                class="question-head"></loadingImage>
                        <div class="question-content">
                            <p class="bubble-left">
                                <span class="pinyin">{{dialogue.question && dialogue.question.pinyin}}</span>
                                <span class="chinese">{{dialogue.question && dialogue.question.chinese}}</span>
                                <span class="chinese">{{dialogue.question && dialogue.question.sentence}}</span>
                            </p>
                            <em class="english">{{dialogue.question && dialogue.question.english}}</em>
                        </div>
                    </section>
                    <section class="answer">
                        <div class="answer-content">
                            <p class="bubble-right">
                                <button class="record-icon"
                                        @click="speakToggle($event,dialogue.answer.readTime)"></button>
                                <button class="hint-icon"
                                        @click="audioToggle($event,dialogue.answer.audio)"></button>
                            </p>
                            <em class="english"></em>
                        </div>
                        <loadingImage
                                :src="addPrefixHost(dialogue.answer&&(dialogue.answer.headImage||dialogue.answer.image))"
                                alt=""
                                class="answer-head"></loadingImage>
                    </section>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import utils from '~/plugins/utils';
    import contentContainer from '~/components/level_1_header.vue';
    import recorder from '~/plugins/gumadapter'
    import MediaStreamRecorder from '~/plugins/MediaStreamRecorder'
    import R from 'ramda';
    import Vue from 'vue';
    import loadingImage from '~/components/loadingImage'
    import axios from 'axios'

    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        data () {
            return {
                isUpdate: false,
                activeIndex: "",
                audioUrl: "",
                speakCountDown: []
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
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
            speakToggle(el, time,index){
                Vue.set(this.speakCountDown,index,+time);
                if (!(/active/.test(el.target.className))) {
                    el.target.classList.add("active");
//                    倒计时说话 倒计时结束后移除active
                    const timer = this.speakCountDown[index];
                    this.countDownToggle = true;
                    const eventLoop = setInterval(() => {
                        Vue.set(this.speakCountDown,index,this.speakCountDown[index]-1);
                        if (!this.speakCountDown[index]) {
                            Vue.set(this.speakCountDown,index,timer);
                            clearInterval(eventLoop);
                            this.countDownToggle = false;
                            Vue.set(this.speakCountDown,index,"");
                            el.target.classList.remove("active");
                        }
                    }, 600);
                    this.record(timer);
                } else {
                    return void(0)
                }
            },
            record(second){
                let httpPath = this.httpPath;
                let captureUserMedia = (mediaConstraints, successCallback, errorCallback) => {
                    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
                };
                this.setAnswer({
                    answer: true,
                    msg: ""
                });
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

                let mediaConstraints = {audio: true};
                captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);


            },
        },
        created(){
            this.$nextTick(_ => {
                this.setAudioInfo({display: 'none'});
            })
        },
        destroyed(){
            this.setAudioInfo({display: 'block'});
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
            dialogueArr(){
                const arr = [];
                const dialogue = this.content.dialogue;
                if (dialogue) {
                    dialogue.forEach((item, index) => {
                        if (index % 2 === 0) {
                            arr.push({
                                question: item,
                                answer: dialogue[index + 1]
                            })
                        }
                    });
                } else {
                    arr.push({
                        question: this.content.question,
                        answer: this.content.answer
                    })
                }
                return arr;
            }
        },
        components: {loadingImage,},

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
                }, 600)
            }
        },


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

    @import "~~assets/sass/mixins";
    @import "~~assets/sass/functions";
    .audio {
        display: none;
    }

    .theme-1 {
        text-align: center;
        margin: .3rem auto;
        .content {
            text-align: left;
            min-width: 9rem;
            display: inline-block;
            li section:nth-child(even) {
                text-align: right;
            }
        }
        .question {
            margin-top: .1rem;
            .question-head {
                $width: 180px;
                max-width: $width;
                vertical-align: middle;
            }
            .question-content {
                display: inline-block;
                margin-left: .4rem;
                vertical-align: middle;
                .bubble-left {
                    @include fullBg("~~assets/img/exercise/dialog.png");
                    border-radius: 5px;
                    position: relative;
                    display: inline-block;
                    min-width: 1.8rem;
                    padding: .2rem .3rem;
                    text-align: center;
                    font-size: 26px;
                    font-family: GothamRounded-Book;
                    .pinyin {
                        display: block;
                        font-size: 22px;
                    }
                    .chinese {
                        display: block;
                        color: #071f30;
                    }

                }
                .english {
                    color: green;
                    display: block;
                    text-align: center;
                    font-size: 16px;
                    margin-top: 3px;
                }
            }
        }

        .record-icon {
            $width: 80px;
            $ratio: (width:(166px), height:(138px));
            width: $width;
            color: white;
            font-size: 24px;
            font-family: GothamRounded-Medium;
            height: getHeightFromAspectRatio($ratio, $width);
            @include fullBgWithPicName("record.png");
            background-position: center;
            vertical-align: middle;
            margin: 0 .2rem;
            &.active {
                @include fullBg('~~assets/img/main_content/exercise/cloud_active.png');
                background-size: 100% 110%;
                background-position: center;
            }
        }
        .audio-icon, .hint-icon {
            $width: 80px;
            $ratio: (width:(166px), height:(138px));
            width: $width;
            height: getHeightFromAspectRatio($ratio, $width);
            @include fullBg('~~assets/img/main_content/exercise/audio_play.png');
            background-size: 130% 140%;
            background-position: center;
            vertical-align: middle;
            &.active {
                @include fullBg('~~assets/img/main_content/exercise/audio_play_active.png');
                background-size: 130% 140%;
                background-position: center;
            }
        }
        .answer {
            margin-top: .2rem;
            .answer-head {
                $width: 180px;
                max-width: $width;
                vertical-align: middle;
            }
            .answer-content {
                display: inline-block;
                margin-right: .2rem;
                vertical-align: middle;
                .bubble-right {
                    @include fullBg("~~assets/img/exercise/dialog-right.png");
                    position: relative;
                    display: inline-block;
                    min-width: 2rem;
                    text-align: center;
                    font-size: 30px;
                    font-family: GothamRounded-Book;
                    padding: 20px 20px;
                }
                .english {
                    color: #b53e2c;
                    display: block;
                    text-align: center;
                    font-size: 16px;
                    margin-top: 3px;
                }

            }

        }
    }

    .theme-2 {
        .content {
            margin: .3rem auto;
            text-align: left;
            width: 8.3rem;
            li section:nth-child(even) {
                text-align: right;
            }
        }
        .question {
            margin-top: .1rem;
            .question-head {
                $width: 90px;
                $ratio: (width:(130px), height:(153px));
                max-width: 3rem;
                max-height: 1.3rem;
                vertical-align: middle;
            }
            .question-content {
                display: inline-block;
                margin-left: .4rem;
                vertical-align: middle;
                .bubble-left {
                    @include fullBg("~~assets/img/exercise/level2/juzi.png");
                    border-radius: 5px;
                    position: relative;
                    display: inline-block;
                    min-width: 3.8rem;
                    padding: .2rem .3rem;
                    text-align: center;
                    font-size: 24px;
                    font-family: GothamRounded-Book;
                    .pinyin {
                        display: block;
                        font-size: 22px;
                    }
                    .chinese {
                        display: block;
                        color: #ffffff;
                    }

                }
                .english {
                    color: green;
                    display: block;
                    text-align: center;
                    font-size: 16px;
                    margin-top: 3px;
                }
            }
        }
        .record-icon {
            $width: 60px;
            $ratio: (width:(174px), height:(168px));
            width: $width;
            height: getHeightFromAspectRatio($ratio, $width);
            @include fullBgWithPicName("record-normal-state.png");
            vertical-align: middle;
            margin: 0 .2rem;
            &.active {
                @include fullBgWithPicName('level2/record.gif');
            }
        }
        .hint-icon {
            $width: 60px;
            $ratio: (width:(174px), height:(168px));
            width: $width;
            height: getHeightFromAspectRatio($ratio, $width);
            @include fullBgWithPicName("level2/light-normal-state.png");
            vertical-align: middle;
            margin: 0 .2rem;
            &.active {
                @include fullBgWithPicName('light.gif');
            }
        }
        .answer {
            margin-top: .2rem;
            .answer-head {
                $width: 90px;
                $ratio: (width:(130px), height:(153px));
                max-width: 3rem;
                max-height: 1.3rem;
                vertical-align: middle;
            }
            .answer-content {
                display: inline-block;
                margin-right: .4rem;
                vertical-align: middle;
                .bubble-right {
                    @include fullBg("~~assets/img/exercise/level2/juzi.png");
                    position: relative;
                    display: inline-block;
                    min-width: 3.8rem;
                    text-align: center;
                    font-size: 30px;
                    font-family: GothamRounded-Book;
                    padding: 10px 20px;
                }
            }

            .hint-icon {
                $width: 60px;
                $ratio: (width:(174px), height:(168px));
                width: $width;
                height: getHeightFromAspectRatio($ratio, $width);
                vertical-align: middle;
                margin: 0 .2rem;
            }
        }
    }
</style>
