<template>
    <div class="container">
        <div class="progress-container">
            <svg width="90%" height="100%" class="svg-progress" ref="svg">
                <circle r="40%" cy="50%" cx="50%" stroke-width="5" stroke="purple" fill="none"></circle>
                <circle r="40%" cy="50%" cx="50%" stroke-width="6" class="progress-bar" stroke="rgba(235,234,247,1)"
                        :stroke-dasharray="round" :stroke-dashoffset="progressPresent(percent)" fill="none"></circle>
            </svg>
            <aside class="count">
                <strong class="num">{{percent}}</strong><em class="icon">%</em>
            </aside>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Component from 'vue-class-component'
    import R from 'ramda'
    @Component({
        props: {
            percent: Number,
        },
        computed: {},
        methods: {
            progressPresent(percent){
                return percent / 100 * this.round
            }
        },
    })
    export default class progress extends Vue {
        round = 0;
        created() {
            this.$nextTick(_ => {
                this.round = Math.PI * this.$refs.svg.width.baseVal.value * .5 * 2
            })
        }
    }
</script>
<style lang="scss" scoped>
    .svg-progress {
        transform: rotate(-90deg);
    }

    @keyframes init {
        from {
            stroke-dashoffset: 0;
        }
    }

    .progress-bar {
        transition: stroke-dashoffset 1200ms cubic-bezier(.99, .01, .62, .94);
        animation: init .6s ease-in;
    }

    .progress-container {
        width: 240px;
        height: 240px;
        position: relative;
        .count {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            line-height: 240px;
            text-align: center;
            .num, .icon {
                color: purple;
                vertical-align: middle;
                font-size: 46px;
                font-family: GothamRounded-Medium;
            }
        }
    }
</style>