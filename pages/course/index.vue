<template>
    <div>
        <audio ref="audioPlayer" :src="AUDIO_PATH" class="audio-player">
        </audio>
        <div :class="isUpdate&&'fadeIn'">
            <nuxt-child @playAudio="playAudio" @record="record"></nuxt-child>
        </div>
    </div>

</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import axios from 'axios'
    import MediaStreamRecorder from '~/plugins/MediaStreamRecorder'
    export default {
        async fetch(ctx){
            let {store, params, isServer, redirect} = ctx;
            const home = "/learner";
            if (params.course) {
                await store.dispatch('index/course/index/setCourseTemplates', params.course.templates);
            } else if (typeof window === "object" && window.history) {
                redirect(home);
            }
        },
        layout ({isServer, store}) {
//           控制使用哪个模板来包裹当前路由下的子组件
            return `course_level_${store.state.courseLayout}`;
//            if (!isServer) {
//                return `course_level_1`;
//            }
        },
        data () {
            return {
                AUDIO_PATH: "",
                isUpdate:false,
                countDownToggle: false,
                preventSubmit: false,
            }
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer',
                'setDataIsComplete'
            ]),
//            传入音频地址 和event对象
            playAudio(audioPath, ev){
                const shapeAudio = this.$refs.audioPlayer;
                const playFunc = _ => {
                    if (!ev.target.classList.contains("play-active")) {
                        ev.target.classList.add("play-active");
//                    播放音乐 播放结束后移除active
                        shapeAudio.play();
                        const is_playFinish = setInterval(() => {
                            if (shapeAudio.ended) {
//                            音乐结束
                                ev.target.classList.remove("play-active");
                                window.clearInterval(is_playFinish);
                            }
                        }, 10);
                    }
                };
                if (this.AUDIO_PATH !== audioPath) {
//                    如果当前音频资源和传入的音频资源是同一个则直接播放 否则等到新资源加载完毕再播放
                    this.AUDIO_PATH = audioPath;
                    shapeAudio.oncanplay = playFunc
                } else {
                    playFunc();
                }
            },
//            传入event对象和一个this中的对象 会改变对象中的count来响应事件
            record(ev, timerObj){
                if (!ev.target.classList.contains("active")) {
                    ev.target.classList.add("active");
//                    倒计时说话 倒计时结束后移除active
                    const timer = timerObj.count;
                    this.countDownToggle = true;
                    const eventLoop = setInterval(() => {
                        timerObj.count--;
                        if (!timerObj.count) {
                            timerObj.count = timer;
                            clearInterval(eventLoop);
                            this.countDownToggle = false;
                            ev.target.classList.remove("active");
                        }
                    }, 1000);
                    this.sendRecordAudio(timer);
                } else {
                    return void(0)
                }
            },
//            接口有问题
            sendRecordAudio(second){
                let httpPath = this.httpPath;
                let captureUserMedia = (mediaConstraints, successCallback, errorCallback) => {
                    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
                };
                this.setAnswer({
                    answer: true,
                    msg: ""
                });
////                录音时开启等待
                this.setDataIsComplete({dataIsComplete:false});
                let onMediaSuccess = (stream) => {
                    let mediaRecorder = new MediaStreamRecorder(stream);
                    mediaRecorder.stream = stream;
                    mediaRecorder.recorderType = MediaStreamRecorder.StereoAudioRecorder;
                    mediaRecorder.audioChannels = 1;
                    mediaRecorder.mimeType = 'audio/wav';
                    mediaRecorder.ondataavailable =  (blob) =>{
                        let file = new File([blob], Date.now() + '.wav', {type: blob.type, lastModified: Date.now()});
                        let data = new FormData();
                        data.append('recording', file);
                        data.append('uid', 7);
                        data.append('type', 2);
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
                    this.setDataIsComplete({dataIsComplete:true});
                }, parseInt(second) * 1000);
                let mediaConstraints = {audio: true};
                captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
            },
        },
        created(){
        },

        computed: {
            ...mapState('index/course/index', {
                templates: state => state.templates,
                contentInfo: state => state.contentInfo,
                dataIsComplete:state=>state.dataIsComplete,
            }),
        },
        watch: {
            contentInfo(){
                this.isUpdate = true;
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 500)
            },
        },
        components: {}
    }
</script>

<style lang="less" scoped>
    .audio-player {
        display: none
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
</style>
