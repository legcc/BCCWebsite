<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-inside">
                            <ul class="course-content-list">
                                <li v-for="(item,index) in contentInfo.chars&&contentInfo.chars.tones" :key="index" ref="toneList">
                                    <ul class="content-list-spell">
                                        <li @click="playAudio($event,contentInfo.chars.initials[index].audio)">
                                            <div>{{contentInfo.chars.initials[index].letter}}</div>
                                        </li>
                                        <li @click="playAudio($event,contentInfo.chars.finals[index].audio)">
                                            <div>{{contentInfo.chars.finals[index].letter}}</div>
                                        </li>
                                    </ul>
                                    <ul class="content-list-tone">
                                        <li v-for="(item,index) in contentInfo.chars&&contentInfo.chars.tones"
                                            @click="bindAudio($event,index)"  :key="index">{{item.letter}}
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch({store, params, isServer, redirect}){
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}){
            return {extendData: params.extendData}
        }, data () {
            return {}
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            playAudio(ev, audio){
                this.$emit("playAudio", this.addPrefixHost(audio), ev);
            },
            bindAudio(ev, Index){
                const tones = this.contentInfo.leftTones;
                const _parent = this.$refs.toneList;
                let itIndex;
                _parent.forEach((item, index) => {
                    if (ev.target.parentNode.parentNode == item) {
                        itIndex = index;
                    }
                })
                this.playAudio(ev, tones[itIndex][Index]);
            }
        },
        created () {
        },
        computed: {
            contentInfo(){
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentInfo: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle
            }),
        }
    }
</script>

<style lang="less" scoped>
    .style-1 {

    .course_common_box {
        margin: 0 auto;
        text-align: center;

    .course-content {
        display: inline-block;
        background: #082B2F;
        border-radius: 10px;
        padding: 10px;
        box-sizing: border-box;

    .course-content-inside {
        border: 2px dashed white;
        background: #084B54;
        border-radius: 10px;
        padding: 20px 60px 20px 60px;
    }

    .content-list-spell, .content-list-tone {
        display: inline-block;
        vertical-align: top;

    li {
        display: inline-block;
    }

    }
    .content-list-spell {
        margin-right: 60px;

    li {
        background: #082B2F;
        padding: 3px;
        margin: 10px;
        border-radius: 5px;
        box-sizing: border-box;
        color: white;
        font-size: 25px;
        cursor: pointer;

    div {
        width: .8rem;
        /* height: 100%; */
        height: .42rem;
        display: grid;
        border: 0.02rem dotted white;
        border-radius: 0.05rem;
        background: #084B54;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;

    }

    .play-active {
        background: #619ABE;

    div {
        background: dodgerblue;
    }

    }
    }
    }
    .content-list-tone {

    li {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        border: 1px solid black;
        margin: 10px;
        line-height: 50px;
        background: linear-gradient(#006F70 0, #003235 90%);
        cursor: pointer;
        font-size: 30px;
        font-weight: 800;
        color: #00FDCF;
        vertical-align: top;
    }

    .play-active {
        border: 1px solid powderblue;
    }

    }

    }

    }

    }

</style>
