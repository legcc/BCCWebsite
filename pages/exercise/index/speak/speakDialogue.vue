<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="container">
            <article class="content">
                <section class="dialogue">
                    <h2 class="question">{{content.description}}</h2>
                    <ul class="answer-list">
                        <li class="answer" v-for="item in content.questions"> {{item}}</li>
                    </ul>
                </section>
                <button @click="speakToggle($event,content.readTime)" class="record-player">{{speakCountDown}}</button>
            </article>
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
    import loadingImage from '~/components/loadingImage'


    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        data () {
            return {
                isUpdate: false,
                speakCountDown: ""
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            speakToggle(el, time){
                this.speakCountDown = +time;
                if (!(/active/.test(el.target.className))) {
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
                            this.speakCountDown = "";
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
        }, watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {};
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600)
            }
        },

        components: {loadingImage,}
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

    .container {
        text-align: center;
    }

    .content {
        display: inline-block;
        .dialogue {
            text-align: left;
            max-width: 6.5rem;
            margin-top: .3rem;
            font-size: 26px;
            .question {
                font-size: 28px;
            }
            .answer-list {
                list-style: disc inside;
                margin-top: .2rem;
            }
            .answer {
                text-indent: .2em;
            }
        }
        .record-player {
            background: url(~~assets/img/main_content/exercise/record-yellow.png) no-repeat;
            width: 100px;
            height: 100px;
            margin: .3rem auto 0 auto;
            background-size: 100% 100%;
            color: #aa6817;
            font-size: 28px;
            font-family: GothamRounded-Medium;
            line-height: 100px;
            text-align: center;
            &.active {
                transition: all .1s ease-in;
                background-image: url(~~assets/img/main_content/exercise/bgr-yellow.png);
            }
        }
    }
</style>
