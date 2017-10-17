<template>
    <div :class="isUpdate&&'fadeIn'">
        <div v-if="templateStyle==='level-4'">
            <div class="theme-1" v-if="content.image">
                <div class="template-content">
                    <div class="top-box">
                        <div class="img-border">
                            <loading-image class="teacher-img" alt=""
                                           :src="addPrefixHost(content.image)"></loading-image>
                        </div>
                        <ul class="description">
                            <li v-for="item in content.questions">
                                {{item}}
                            </li>
                        </ul>
                    </div>
                    <div class="under-box">
                                <textarea class="bottom-answer"
                                          placeholder="Please enter your answer here if Chinese input is possible on your keyboard.  If not, please save your handwriting in a separate file and upload it using the button on the right."></textarea>
                        <label class="upload-btn">
                            <input type="file" style="display: none">
                        </label>
                    </div>
                </div>
            </div>
            <div class="theme-2" v-else>
                <div class="template-content">
                    <div class="top-box">
                        <p class="description">{{content.description}}</p>
                    </div>
                    <ul class="question">
                        <li v-for="item in content.questions">
                            {{item}}
                        </li>
                    </ul>
                    <div class="under-box">
                                <textarea class="bottom-answer"
                                          placeholder="Please enter your answer here if Chinese input is possible on your keyboard.  If not, please save your handwriting in a separate file and upload it using the button on the right."></textarea>
                        <label class="upload-btn">
                            <input type="file" style="display: none"></label>

                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="coming-soon"></div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },

        data () {
            return {
                isUpdate: false
            }
        },
        methods: {},
        created(){
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
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

    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
    }

    .theme-1 {
        .template-content {
            width: 700px;
            margin: 4% 0 0 25.5%;
        }
        .template-content .top-box {
            width: 910px;
            margin-top: -20px;
        }
        .template-content .img-border {
            width: 320px;
            height: 228px;
            display: inline-block;
            box-sizing: border-box;
            padding: .12rem .16rem .26rem .2rem;
            background: url(~~assets/img/main_content/exercise/picture-border.png) no-repeat;
            background-size: contain;
        }
        .template-content .img-border .teacher-img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
            display: inline-block;
        }
        .template-content .description {
            font-family: Calibri Regular, Calibri;
            font-weight: 600;
            color: #006;
            text-align: left;
            line-height: 30px;
            font-size: 28px;
            vertical-align: top;
            display: inline-block;
            white-space: pre-line;
            width: 530px;
            min-height: 300px;
            margin-left: 15px;
        }
        .bottom-answer {
            width: 305px;
            height: 156px;
            margin-right: 50px;
            background: url(~~assets/img/main_content/exercise/textarea-bg.png) no-repeat;
            background-size: 100% 100%;
            padding: 9px 20px;
            border: none;
            outline: none;
            border-radius: 5px;
            overflow: hidden;
            font-family: Calibri;
            font-style: normal;
            font-size: 20px;
            color: #333;
            line-height: normal;
            display: inline-block;
            cursor: pointer;
            vertical-align: middle;
        }
        .template-content .upload-btn {
            display: inline-block;
            background: url(~~assets/img/main_content/exercise/upload.png) no-repeat;
            background-size: 100% 100%;
            width: 221px;
            height: 149px;
            vertical-align: middle;
            cursor: pointer;
        }
    }

    .theme-2 {
        text-align: center;
        .template-content {
            min-width: 740px;
            display: inline-block;
            margin-top: 30px;
        }

        .description {
            font-family: Calibri Regular, Calibri;
            font-weight: 700;
            color: #fff;
            text-align: left;
            line-height: 34px;
            font-size: 32px;
            vertical-align: top;
            text-indent: 2em;
            white-space: pre-line;
            width: 800px;
            margin-bottom: 20px;
        }
        .question {
            font-family: GothamRounded-Medium;
            color: #3c4e80;
            text-align: left;
            line-height: 1.4;
            font-size: 24px;
            vertical-align: middle;
            text-indent: 2em;
            width: 800px;
            margin-bottom: 20px;
        }
        .bottom-answer {
            width: 305px;
            height: 156px;
            margin-right: 50px;
            background: url(~~assets/img/main_content/exercise/textarea-bg.png) no-repeat;
            background-size: 100% 100%;
            padding: 9px 20px;
            border: none;
            outline: none;
            border-radius: 5px;
            overflow: hidden;
            font-family: Calibri;
            font-style: normal;
            font-size: 20px;
            color: #333;
            line-height: normal;
            display: inline-block;
            cursor: pointer;
            vertical-align: middle;
        }
        .template-content .upload-btn {
            display: inline-block;
            background: url(~~assets/img/main_content/exercise/upload.png) no-repeat;
            background-size: 100% 100%;
            width: 221px;
            height: 149px;
            vertical-align: middle;
            cursor: pointer;
        }
    }
</style>
