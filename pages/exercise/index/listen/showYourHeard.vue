<template>
    <div class="theme-1" v-if="templateStyle==='level-1'">
        <ul class="list">
            <li class="list-item">
                <div class="bell" aspect-ratio="562/560">
                    <div class="round"></div>
                    <div class="hourHand" :style="houer2deg(9)"></div>
                    <div class="minuteHand"></div>
                </div>
                <div class="answer-cloud">
                    <em>1</em>
                </div>
            </li>
            <li class="list-item">
                <div class="bell" aspect-ratio="562/560">
                    <div class="round"></div>
                    <div class="hourHand"></div>
                    <div class="minuteHand"></div>
                </div>
                <div class="answer-cloud">
                    <em>1</em>
                </div>
            </li>
            <li class="list-item">
                <div class="bell" aspect-ratio="562/560">
                    <div class="round"></div>
                    <div class="hourHand"></div>
                    <div class="minuteHand"></div>
                </div>
                <div class="answer-cloud">
                    <em>1</em>
                </div>
            </li>
        </ul>
    </div>

</template>
<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    import R from 'ramda';
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
    })
    export default class showYourHeard extends Vue {

        houer2deg(num) {
            return `transform:translate(100%,-50%) rotate(${num * 30}deg)`;
        }

        minute2deg(num) {
            return `transform:translate(100%,-50%) rotate(${num * 6}deg)`;
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

    .theme-1 {
        text-align: center;
        .list {
            display: inline-block;
            margin-top: 20px;
        }
        .list-item {
            display: inline-block;
            margin: 30px;
        }
        .bell {
            width: 220px;
            position: relative;
            background: url("~~assets/img/exercise/bell.png") no-repeat;
            background-size: 100% 100%;
            &[aspect-ratio='562/560'] {
                aspect-ratio: '562:560';
            }
        ;
            &:before {
                content: '';
                display: block;
                width: 1px;
                margin-left: -1px;
                height: 0;
            }
            .round {
                width: 16px;
                height: 16px;
                border: 1px solid black;
                left: 6px;
                top: 5px;
                border-radius: 50%;
                background-color: #ce5d68;
                z-index: 20;
                position: absolute;
                right: 0;
                bottom: 0;
                margin: auto;
            }
            .hourHand {
                width: 3px;
                height: 50px;
                position: absolute;
                background-color: black;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                /*一秒是360/60=6deg*/
                transform: translate(100%, -50%) rotate(160deg);
                transition: transform .5s ease-in;
                transform-origin: bottom;
                margin: auto;
            }
            .minuteHand {
                width: 3px;
                height: 80px;
                position: absolute;
                background-color: black;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                /*一秒是360/12=30deg*/
                transform: translate(100%, -50%) rotate(220deg);
                transition: transform .5s ease-in;
                transform-origin: bottom;
                margin: auto;
            }
            .content {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;

            }

        }
        .answer-cloud {

            width: 110px;
            height: 110px;
            margin: 20px auto auto auto;
            text-align: center;
            background: url(~~assets/img/main_content/exercise/cloud.png) no-repeat;
            background-size: 100% 100% !important;
            background-position: center 5px !important;
            line-height: 110px;
            font-size: 40px;
            vertical-align: middle;
            cursor: pointer;
            font-family: GothamRounded-Medium;
            color: #042bfb;
        }
    }

</style>