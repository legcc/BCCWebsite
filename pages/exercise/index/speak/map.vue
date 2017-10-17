<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <h2 class="sentence">{{content.sentence}}</h2>
        <div class="map">
            <loadingImage @dragstart="false" :src="addPrefixHost(this.content.backgroudImage)" class="background"
                          alt=""></loadingImage>
            <img ref="moveImage" draggable="false" :src="addPrefixHost(this.content.moveImage)" class="icon" alt=""
                 :style="randomXY"
                 @mousemove="move($event)"
                 @mousedown="moveBegin($event)"
                 @mouseout="leave($event)"
                 @mouseup="leave($event)">
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    import R from 'ramda';
    import utils from '~/plugins/utils';
    import loadingImage from '~/components/loadingImage'
    @Component({
        components: {loadingImage},
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ])
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerArr: [],
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600)
            }
        }, destroyed(){
            this.setAudioInfo({player: {display: 'block'}});
        }
    })
    export default class map extends Vue {
        isUpdate = false;
        start = {};
        touched = false;

        created() {
            this.$nextTick(_ => {
                setTimeout(_ => {
                    this.setAudioInfo({player: {display: 'none'}});
                }, 600)
            })
        }

        moveBegin(ev) {
            const start = this.start;
            start.x = ev.offsetX;
            start.y = ev.offsetY;
            this.touched = true;
        }

        leave(ev) {
            this.touched = false;
        }

        get randomXY() {
            return {right: utils.getRandomNum(0, 600) + 'px', bottom: utils.getRandomNum(0, 303) + 'px'}
        }

        move(ev) {
            if (this.touched) {
                const start = this.start;
                const style = this.$refs.moveImage.style;
                style.right = +style.right.replace(/px/, "") + start.x - ev.offsetX + 'px';
                style.bottom = +style.bottom.replace(/px/, "") + start.y - ev.offsetY + 'px';
            }
        }

    }
</script>
<style lang="scss" scoped>
    @import "~~assets/sass/mixins";
    @import "~~assets/sass/functions";

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
        margin-top: 40px;
        text-align: center;
        .sentence {
            display: inline-block;
            max-width: 600px;
            text-align: left;
            font-family: GothamRounded-Book;
            font-size: 28px;
            color: #ff8f2f;
        }
        .map {
            margin: 20px auto;
            background-size: 100% 100%;
            $width: 700px;
            width: $width;
            height: getHeightFromAspectRatio((width:(1366px), height:(768px)), $width);
            position: relative;
            .background {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
                height: 100%;
            }
            .icon {
                width: 60px;
                height: 80px;
                position: absolute;
                right: 0;
                bottom: 0;
                cursor: move;
            }
        }
    }
</style>