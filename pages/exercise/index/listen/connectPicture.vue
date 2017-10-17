<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="style-1" v-if="templateStyle==='level-1'">
            <div class="practice_listen_match practice_common_box">
                <div class="listen_match_left">
                    <div class="listen_match_figure">
                        <div class="center_cell">
                            <template v-for="item in content.words">
                                <loading-image
                                        class="head-img"
                                        :src="addPrefixHost(item.image)">

                                </loading-image>
                                <span>{{item.english}}</span>
                            </template>
                        </div>
                    </div>
                    <div class="listen_match_like">
                        <div class="center_cell"><p>
                            <span>{{content.relationWord.pinyin}}</span>
                            <span>
                                {{content.relationWord.chinese}}
                            </span></p>
                        </div>
                    </div>
                    <div class="listen_match_blank">
                        <div class="center_cell">
                            <div @drop="drop($event,item.relationImage,index)" v-for="(item,index) in content.words"
                                 @dragover="allowDrop"></div>
                        </div>
                    </div>
                </div>
                <div class="listen_match_right">
                    <div class="center_cell">
                        <div
                                v-for="(item,index) in content.words"
                                @drop="drop($event,null,index)"
                                @dragover="allowDrop">
                            <img
                                    :id="`img${index}`"
                                    class="select-picture"
                                    :src="addPrefixHost(item.relationImage)"
                                    draggable="true" @dragstart="drag($event,item.relationImage)">
                        </div>
                    </div>
                </div>
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
                answers: [],
                isUpdate: false
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            allowDrop(ev){
                ev.preventDefault();
            },
            init(){
                this.$nextTick(_ => {
                    this.setAnswer({
                        answer: false,
                        msg: this.content.answerSentences && R.pipe(
                            R.map(
                                R.pipe(
                                    R.props('english', 'chinese', 'pinyin'), R.filter(R.clone)
                                )
                            )
                            , R.unnest, R.join("\n"))(this.content.answerSentences)
                    });

                })
            },
            drag(ev, img) {
                ev.dataTransfer.setData("id", ev.target.id);
                ev.dataTransfer.setData("image", img);
            },

            drop(ev, relationImage, index) {
                ev.preventDefault();
                const id = ev.dataTransfer.getData("id");
                const image = ev.dataTransfer.getData("image");
                if (ev.target.tagName === "DIV" && ev.target.children.length === 0) {
                    this.answers[index] = R.equals(image, relationImage);
                    let answer = false;
                    if (this.answers.length === this.content.words.length) {
                        answer = R.all(R.ifElse(R.clone, R.T, R.F))(this.answers);
                    }
                    this.setAnswer({
                        answer,
                        msg: R.pipe(R.map(R.prop('english')), R.join("、"))(this.content.words)
                    });
                    ev.target.appendChild(document.getElementById(id));
                }
            }
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answers: [],
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600);
                this.init();

            }
        },
        components: {loadingImage},
        mounted(){
            this.init();
        },
        computed: {
            ...mapState('index/exercise/index', {
                content: state => state.contentInfo ? state.contentInfo.content : {},
                templateStyle: state => state.templateStyle
            }),
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

    .style-1 {
        .practice_common_box {
            width: 750px;
            display: block;
            margin: 2% auto 0 auto;
            position: relative;
            text-align: center;
            &:after {
                content: "";
                display: block;
                clear: both;
            }
        }
        .listen_match_left {
            width: 500px;
            height: 100%;
            float: left;
            border-radius: 40px;
        }
        .listen_match_figure {
            display: table;
            height: 100%;
            width: 35%;
            float: left;
        }
        .listen_match_figure div {
            width: 100%;
            height: 100%;
        }
        .center_cell {
            display: table-cell;
            vertical-align: middle;

        }
        .listen_match_figure .head-img {
            max-width: 1.25rem;
            max-height: 1.4rem;
            display: block;
            margin: 0 auto;
            background-size: 85% 80% !important;
            background-position: center 0px !important;
            line-height: 195px;
            color: #0000FF;
            font-family: "Corbel";
            font-size: 18px;
            &:not(:first-child) {
                margin-top: 16px;
            }
        }
        .listen_match_like {
            width: 30%;
            height: 100%;
            float: left;
            display: table;
        }
        .center_cell {
            display: table-cell;
            vertical-align: middle;
        }
        .listen_match_like p {
            display: block;
            width: 130px;
            height: 100px;
            background: url(~~assets/img/main_content/exercise/cloud.png) no-repeat;
            background-size: 100% 100%;
            background-position: center;
            color: #0000FF;
            font-size: 24px;
            margin-top: 90%;
            padding-top: 25px;
        }
        .listen_match_like p span {
            display: block;
        }
        .listen_match_blank {
            display: table;
            width: 35%;
            height: 100%;
        }
        .center_cell {
            display: table-cell;
            vertical-align: middle;
        }
        .listen_match_blank div {
            display: block;
            width: 170px;
            height: 125px;
            background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
            background-size: 100% 100%;
            background-position: -4px 2.5px;
            margin: 0 auto;
            line-height: 120px;
            cursor: pointer;
        }
        .listen_match_right {
            width: 180px;
            height: 100%;
            float: right;
            display: table;
        }
        .center_cell {
            display: table-cell;
            vertical-align: middle;
        }
        .listen_match_right div {
            cursor: pointer;
            display: block;
            width: 170px;
            height: 125px;
            background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
            background-size: 100% 100% !important;
            background-position: -4px 2px !important;
            margin: 0 auto;
            line-height: 120px;
        }
        .select-picture {
            width: 130px;
            height: 90px;
            margin-top: 10%;
            cursor: move;
        }
    }
</style>
