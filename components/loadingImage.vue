<template>

    <img :src="url" draggable="false">
</template>
<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    const loadingImg = require("~/assets/img/img-loading.svg");
    @Component({
        props: ['src'],
        watch: {
            src() {
                this.url = loadingImg;
                this.newImg.src = this.src;
                this.newImg.onerror = () => {    // 图片加载错误时的替换图片
                    this.newImg.src = loadingImg;
                };
                this.newImg.onload = () => { // 图片加载成功后把地址给原来的img
                    this.url = this.newImg.src
                }
            }
        }
    })
    export default class loadingImage extends Vue {
        url = loadingImg;
        newImg = new Image();

        mounted() {
            this.url = loadingImg;
            var newImg = new Image()
            newImg.src = this.src
            newImg.onerror = () => {    // 图片加载错误时的替换图片
                newImg.src = loadingImg;
            }
            newImg.onload = () => { // 图片加载成功后把地址给原来的img
                this.url = newImg.src
            }
        }
    }
</script>
<style lang="less" scoped>


</style>