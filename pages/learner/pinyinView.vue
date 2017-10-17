<template>
    <div class="pinyin-view">
        <div class="main-top">
            VIEW YOUR PINYIN
        </div>
        <audio :src="realAudioPath" ref="audioPlayer" class="audioPlayer"></audio>
        <div class="info-desc">
            The blue background indicates that you have studied Pinyin,and the white background indicates Pinyin for
            learning.You can click on a
            phonetic alphabet and select the pronunciation area above the table to learn pronunciation.
        </div>
        <div class="view-content">
            <div class="content-shop">
                <div class="shop-head">
                    <em>Initial</em>
                    <ul>
                        <li @click="playAudio(0)">—</li>
                    </ul>
                </div>
                <div class="shop-box">
                    <ul>
                        <li v-for="(list,index) in dataOptions.initials" :class="list.study == 1 &&'atv-be'"
                            @click="setAudio($event,[list.initials_audio])">{{list.letter}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="content-shop">
                <div class="shop-head">
                    <em>Final</em>
                    <ul>
                        <li v-for="(item,index) in finalOption" @click="playAudio(index)">{{item}}</li>
                    </ul>
                </div>
                <div class="shop-box">
                    <ul>
                        <li v-for="(list,index) in dataOptions.finals" :class="list.study == 1&&'atv-be'"
                            @click="setAudio($event,[list.finals_audio1,list.finals_audio2,list.finals_audio3,list.finals_audio4])">
                            {{list.letter}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch({store, redirect}){
            await store.dispatch("index/learner/pinyinView/getData");
        },
        data () {
            return {
                CURRENT_PATH: [{
                    name: "Performance",
                    url: "learner-statistics"
                }, {
                    name: "PINYIN",
                    url: "learner-pinyinView"
                }],
                element: "",
                audioPathArr: "",
                realAudioPath: "",
                finalOption: ["—", "/", "V", "\\"]
            }
        },
        methods: {
            playAudio(i){
                if (this.audioPathArr.length) {
                    this.realAudioPath = this.addPrefixHost(this.audioPathArr[i]);
                    setTimeout(_ => {
                        this.$refs.audioPlayer.play();
                    })
                }
            },
            ...mapActions('index/learner/learner', [
                'changeCurrentPath'
            ]),
            setAudio(event, audioPathArr){
                if (this.element) {
                    this.element.classList.remove("active")
                }
                event.target.classList.add("active");
                this.element = event.target;
                this.audioPathArr = audioPathArr;
            },
            changeCondition(){
            }
        },
        computed: {
            ...mapState("index/learner/pinyinView", {
                dataOptions: state => state.dataOptions
            }),
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        components: {}
    }
</script>

<style lang="less">
    @import "~~assets/less/learner/pinyin";
</style>
