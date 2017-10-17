<template>
    <div class="head-image">
        <!--
        <section class="head-image-tips">tips</section>
        -->
        <article class="main-content">
            <section class="head-btn-group">
                <label class="function-key">Local Upload
                    <input type="file" class="file-list" @change="changeHeadImage">
                </label>
            </section>
            <section>
                <p class="file-size-hints">Only support JPG,PNG images, and files less than 2M.</p>
                <div class="image-wrapx160" v-loading.body="loading">
                    <div ref="container" class="segmented-wrap"></div>
                </div>
                <div class="small-image-container">
                    <p>Your upload image head will automatically generate two sizes. Please note
                        whether the small size of the avatar is clear.
                    </p>
                    <div class="image-wrapx100">
                        <img src="~assets/img/myBCC/headImage/100x100.svg" ref="100Image" alt="headImage">
                        <em class="small-wrap-px">120*120px</em>
                    </div>
                    <div class="image-wrapx60">
                        <img src="~assets/img/myBCC/headImage/60x60.svg" ref="60Image" alt="headImage">
                        <em class="small-wrap-px">60*60px</em>
                    </div>
                </div>
            </section>
            <button class="function-key" @click="updateHeadImage">Confirm</button>
        </article>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex';
    import Component from 'vue-class-component';
    import Clipper from '~/plugins/clipper';
    import axios from 'axios';
    @Component({
        async fetch({isServer, store}){
            //加载数据
            //将Session中的authUser信息更新至store
            await store.dispatch("index/myBCC/userSetting/updateAuthUser", store.state.authUser);
        },
        computed: {
            ...mapState("index/myBCC/userSetting", {
                userInfo: state => state.currentAuthUser
            })
        },
    })
    export default class headImage extends Vue {
        defaultHeadImage = require('~~/assets/img/myBCC/headImage/160x160.svg');
        clipper = "";
        loading = false;

        changeHeadImage(event) {
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                this.clipper.drawImg(e.target.result);
            }
            fileReader.readAsDataURL(event.target.files[0]);
        }

        changeBase64ToBlob(dataURI) {
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
            var byteString = atob(dataURI.split(',')[1]); //base64 解码
            var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
            var intArray = new Uint8Array(arrayBuffer); //创建视图
            for (var i = 0; i < byteString.length; i += 1) {
                intArray[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([intArray], {type: mimeString}); //转成blob
            return new File([blob], Date.now() + '.' + blob.type, {
                type: blob.type,
                lastModified: Date.now()
            });
        }

        async updateHeadImage() {
            const firstImageData = new Promise(resolve => {
                this.clipper.clip((data) => {
                    this.$refs['100Image'].src = data;
                    resolve(data);
                }, {
                    format: 'base64',
                    outputSize: 120
                })
            });
            const secondImageData = new Promise(resolve => {
                this.clipper.clip((data) => {
                    this.$refs['60Image'].src = data;
                    resolve(data);
                }, {
                    format: 'base64',
                    outputSize: 60
                })
            });
            const imageList = await Promise.all([
                firstImageData, secondImageData
            ]);
            this.loading = true;
            let formData = new FormData();
            formData.append('uid', this.$store.state.authUser.uid);
            formData.append('big_head_image', this.changeBase64ToBlob(imageList[0]));
            formData.append('small_head_image', this.changeBase64ToBlob(imageList[1]));
            let res = (await axios.post(`${this.httpPath}/api/user/changeHeadImage`, formData));
            console.log(res);
            let httpData = res.data;
            //处理成功后交互
            if (httpData.status_code === 200) {
                this.loading = false;
                this.submitPrevent = false;
                this.$refs['100Image'].src = httpData.data["big_head_image"];
                this.$refs['60Image'].src = httpData.data["small_head_image"];
                //更新用户头像至Session缓存
                const res = await axios.post(`${this.httpPath.replace(/\/proxy/, "")}/api/changeHeadImage`, {
                    data: {
                        headImage: httpData.data["big_head_image"],
                        smallHeadImage: httpData.data["small_head_image"]
                    }
                });
                this.$_message("Update Success!");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.loading = false;
                this.submitPrevent = false;
                this.$_message("Update Failed!");
            }
        }

        created() {
            let that = this;
            this.$nextTick(async (data) => {
                this.clipper = new Clipper(this.$refs.container, {
                    coverShape: 'rect',
                    coverColor: 'transparent',
                    coverSize: 0.8,
                    coverOpacity: 0.8
                });
                this.clipper.drawImg(this.defaultHeadImage);


                if (that.userInfo.headImage) {
                    this.$refs['container'].src = that.$store.state.authUser.headImage;

                    this.$refs['100Image'].src = that.$store.state.authUser.headImage;
                }
                if (that.userInfo.smallHeadImage) {
                    this.$refs['60Image'].src = that.$store.state.authUser.smallHeadImage;
                }
            })
        }
    }
</script>
<style lang="less">
    @import "~~assets/less/myBCC/headImage.less";
</style>