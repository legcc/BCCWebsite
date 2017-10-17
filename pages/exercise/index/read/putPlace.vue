<template>
    <div class="container">
        <article v-for="(people,index) in content.people" class="pic-container">
            <!--<template v-if="index%2===0">-->
            <!--<ul>-->
            <!--<li>{{people.name}}</li>-->
            <!--<li><img :src="addPrefixHost(people.bodyImage)" alt=""></li>-->
            <!--</ul>-->
            <!--<ul>-->
            <!--<li><img :src="addPrefixHost(content.eyeImgs[index].eyeImg)" alt=""></li>-->
            <!--<li><img :src="addPrefixHost(content.headImgs[index].eyeImg)" alt=""></li>-->
            <!--<li><img :src="addPrefixHost(content.mouthImgs[index].eyeImg)" alt=""></li>-->
            <!--</ul>-->
            <!--</template>-->
            <!--<template v-else>-->
            <!--<ul>-->
            <!--<li><img :src="addPrefixHost(content.eyeImgs[index].eyeImg)" alt=""></li>-->
            <!--<li><img :src="addPrefixHost(content.headImgs[index].eyeImg)" alt=""></li>-->
            <!--<li><img :src="addPrefixHost(content.mouthImgs[index].eyeImg)" alt=""></li>-->
            <!--</ul>-->
            <!--<ul>-->
            <!--<li>{{people.name}}</li>-->
            <!--<li><img :src="addPrefixHost(people.bodyImage)" alt=""></li>-->
            <!--</ul>-->
            <!--</template> -->

            <template v-if="index%2===0">
                <ul class="pic-list">
                    <li class="people-name">{{people.name}}</li>
                    <li class="body-pic-container" :class="activeBodyIndex===index&&'active'"
                        @click="chooseBody(index,people.order)"><img src="~assets/img/img-loading.png" class="body"
                                                                     alt=""></li>
                </ul>
                <ul class="pic-list">
                    <li class="choose-list-item" @click="putComponent('eyes',content.eyeImgs[index])"
                        :class="isActive('eyes',content.eyeImgs[index])">
                        <img src="~assets/img/img-loading.png" class="eyes" alt=""></li>
                    <li class="choose-list-item" @click="putComponent('head',content.headImgs[index])"
                        :class="isActive('head',content.headImgs[index])">
                        <img src="~assets/img/img-loading.png" class="head" alt=""></li>
                    <li class="choose-list-item" @click="putComponent('mouth',content.mouthImgs[index])"
                        :class="isActive('mouth',content.mouthImgs[index])">
                        <img src="~assets/img/img-loading.png" class="mouth" alt=""></li>
                </ul>
            </template>
            <template v-else>
                <ul class="pic-list">
                    <li class="choose-list-item" @click="putComponent('eyes',content.eyeImgs[index])"
                        :class="isActive('eyes',content.eyeImgs[index])">
                        <img src="~assets/img/img-loading.png" class="eyes" alt=""></li>
                    <li class="choose-list-item" @click="putComponent('head',content.headImgs[index])"
                        :class="isActive('head',content.headImgs[index])">
                        <img src="~assets/img/img-loading.png" class="head" alt=""></li>
                    <li class="choose-list-item" @click="putComponent('mouth',content.mouthImgs[index])"
                        :class="isActive('mouth',content.mouthImgs[index])">
                        <img src="~assets/img/img-loading.png" class="mouth" alt=""></li>
                </ul>
                <ul class="pic-list">
                    <li class="people-name">{{people.name}}</li>
                    <li class="body-pic-container" :class="activeBodyIndex===index&&'active'"
                        @click="chooseBody(index,people.order)"><img src="~assets/img/img-loading.png" class="body"
                                                                     alt=""></li>
                </ul>
            </template>
        </article>
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
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ])
        },
        computed: {
            ...mapState('index/exercise/index', {
                contentInfo: state => state.contentInfo,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        }
    })
    export default class chooseNumber extends Vue {
        peopleArr = [];
        activeBodyIndex = null;

        chooseBody(index, order) {
            this.activeBodyIndex = index;
            this.peopleArr[index].order = order;
            this.checkAnswer();
        }

        putComponent(key, component) {
            if (this.activeBodyIndex !== null) {
                const containObj = R.find(R.propEq(key, component))(this.peopleArr);
                if (containObj) {
                    delete containObj[key];
                    Vue.set(this.peopleArr, this.activeBodyIndex, R.assoc(key, component)(this.peopleArr[this.activeBodyIndex]));
                } else {
                    Vue.set(this.peopleArr, this.activeBodyIndex, R.assoc(key, component)(this.peopleArr[this.activeBodyIndex]));
                }
                this.checkAnswer();
            } else {
                this.$message.warning("Please choose a body first !");
            }
        }

        checkAnswer() {
            let answers = [];
            this.peopleArr.forEach(item => {
                if (R.keys(item).length === 4 && item.order === item.eyes.order && item.order === item.head.order && item.order === item.mouth.order) {
                    answers.push(true);
                } else {
                    answers.push(false);

                }
            });
            this.setAnswer({
                answer: R.all(R.clone)(answers),
                msg: `Correct order:${R.reduce((pre, item) => (pre += ` ${item.type}: ${item.answerOrder}`), "")(this.content.answerOrders)}`
            })
        }

        created() {
            this.peopleArr = R.map(R.always({}))(this.content.people);
            this.init();

        }

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.content.answerOrders && `Correct order:${R.reduce((pre, item) => (pre += ` ${item.type}: ${item.answerOrder}`), "")(this.content.answerOrders)}`
                })
            })
        }

        isActive(key, component) {
            let index = R.findIndex(R.propEq(key, component))(this.peopleArr);
            index++;
            return `active-${index}`
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
        text-align: center;
        .pic-container {
            margin-top: 100px;
            display: inline-block;
            vertical-align: middle;
        }
        .pic-list {
            display: inline-block;
            vertical-align: middle;
            margin: 0 20px;
            .people-name {
                color: #692f13;
                text-align: center;
                font-family: GothamRounded-Medium;
                font-size: 28px;
            }
            .body-pic-container {
                padding: 70px 60px;
                cursor: pointer;
                @include fullBgWithMainContentPicName("picture-border-yellow.png");
                &.active {
                    @include fullBgWithMainContentPicName("sentence_bg_active.png")
                }
            }
            .choose-list-item {
                border: 2px solid transparent;
                $colorArr: (#3f3bf9, #f956ae);
                border-radius: 6px;
                padding: 8px 15px;
                margin: 5px 0;
                cursor: pointer;
                @for $index from 1 to 3 {
                    &.active-#{$index} {
                        border: 2px solid #{nth($colorArr,$index)};
                    }
                }
            }
            .body {
                @include exerciseImage((width:(88px), height:(132px)), 100px)
            }
            .eyes {
                @include exerciseImage((width:(72px), height:(25px)), 60px);
            }
            .head {
                @include exerciseImage((width:(95px), height:(128px)), 100px);
            }
            .mouth {
                @include exerciseImage((width:(20px), height:(18px)), 20px);
            }
        }

    }

</style>