<template>

    <nuxt-child></nuxt-child>

</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        async fetch(ctx){
            let {store, params, isServer, redirect} = ctx;
            const home = "/learner";
            if (isServer) {
                redirect(home);
                return void(0)
            }
            if (params.exercise) {
//                store.dispatch("index/learner/learner/changeEntryActive", "myCourse");
//                store.dispatch("index/learner/learner/changeEntryActive", "My Course");
                await store.dispatch('index/exercise/index/setExerciseTemplates', params.exercise.templates);
                await store.dispatch('index/exercise/index/setExerciseModuleName', params.moduleName);
//                临时使用模板长度作为总页码 因为后端获取的总页码不对
                await store.dispatch('index/exercise/index/setExerciseTotalPage', params.exercise.templates.length);
            } else {
                redirect(home);
            }
        },
        layout ({store}) {
//           控制使用哪个模板来包裹当前路由下的子组件
            return `exercise_level_${store.state.exerciseLayout}`;
//            return `exercise_level_2`;
        },
        data () {
            return {}
        },
        methods: {},
        created(){
        },

        computed: {},
        components: {}
    }
</script>

<style lang="less" scoped>

</style>
