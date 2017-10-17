<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="practice_picture_talk theme-1">
            <div class="picture_talk_content">
                <div class="center_cell">
                    <ul class="picture_talk_issue" :class="isOverflow(content.sentence.length,2)">
                        <li v-for="item in content.sentence">
                            <ul>
                                <li>{{item.english}}</li>
                                <li>{{item.pinyin}}</li>
                                <li>{{item.chinese}}</li>
                            </ul>
                        </li>
                    </ul>
                    <div class="picture_talk_bg">
                        <loadingImage class="image" :src="addPrefixHost(content.image)"></loadingImage>
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
            return {isUpdate: false,}
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            isOverflow(cur, max){
                return cur > max && 'overflow'
            }
        },
        created(){
            this.$nextTick(_ => {
                this.setAudioInfo({player: {display: 'none'}});
            })
        },
        destroyed(){
            this.setAudioInfo({player: {display: 'block'}});
        },
        watch: {
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
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
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

    .theme-1 {
        width: 750px;
        height: 100%;
        display: block;
        margin: 40px auto 20px auto;
        position: relative;
        .picture_talk_content {
            width: 100%;
            height: 100%;
            position: relative;
            display: table;
            .center_cell {
                display: table-cell;
                vertical-align: middle;
            }
            .picture_talk_issue {
                width: 300px;
                color: #3c4e80;
                font-size: 18px;
                font-family: GothamRounded-Medium;
                display: table;
                background: url(~~assets/img/main_content/exercise/practice_bg_w.png) no-repeat;
                background-size: 100% 100%;
                background-position: 2px center;
                padding: .5rem 0 .5rem .2rem;
                position: absolute;
                bottom: 0;
                left: -2.7rem;
                &.overflow {
                    font-size: 16px;
                    padding: .2rem 0 .2rem .2rem;
                }
            }
            .picture_talk_issue p {
                display: table-cell;
                vertical-align: middle;
                text-align: initial;
            }
            .picture_talk_bg {
                min-width: 840px;
                /* width: 640px; */
                height: 440px;
                background-position: 60px 30px;
                margin: 0 auto;
                text-align: center;
                line-height: 4.4rem;
                .image {
                    max-height: 4.4rem;
                    min-height: 2.6rem;
                    max-width: 8.4rem;
                    vertical-align: middle;
                }
            }
        }
    }

</style>
