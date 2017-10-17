<template>
    <container>
        <div slot="body" class="body-container">
            <nuxt/>
        </div>
    </container>
</template>

<script>
    import container from "~/functional/container";
    export default {
        head: {
            titleTemplate: '%s',
            script: [{innerHTML: require("~/static/reset/reset.js")}, {innerHTML: "reset(document)"}]
        },
        components: {
            container
        }
    }
</script>

<style lang="less">
    body {
        background: #EAEDF6;
        .body-container {
            min-height: 5.5rem;
        }
    }

    .page-enter-active, .page-leave-active {
        transition: opacity .2s ease-in-out
    }

    .page-enter, .page-leave-active {
        opacity: 0;
    }

</style>
