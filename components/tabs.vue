<template>
    <div>
        <div class="tabs">
            <ul>
                <template v-for="(label,index) in labels">
                    <li class="tabs-item" :class="active===label&&'tabs-item-active'"
                        @click="changeLabel(index,$event)">
                        <span>{{label}}</span>
                    </li>
                </template>
            </ul>
        </div>
        <template v-for="(label,index) in labels">
            <slot :name="label" v-if="active===label"></slot>
        </template>
    </div>
</template>

<script>
    import Vue from "vue";
    export default {
        props: {labels: Array, defaultActive: String},
        data () {
            return {
                active: ""
            }
        },
        methods: {
            changeLabel(index, event){
                if (event.offsetX > event.target.offsetWidth && event.target.nextElementSibling) {
                    index++;
                    Vue.set(this, "active", this.labels[index]);
                    this.$emit("changeTab", this.labels[index]);
                } else if (event.offsetX < 0 && event.target.previousElementSibling) {
                    index--;
                    Vue.set(this, "active", this.labels[index]);
                    this.$emit("changeTab", this.labels[index]);
                } else {
                    Vue.set(this, "active", this.labels[index]);
                    this.$emit("changeTab", this.labels[index]);
                }
            }
        },
        created(){
            this.active = this.defaultActive;
        },
        computed: {},
        components: {}
    }
</script>

<style lang="less" scoped>
    .tabs {
        margin: 0 auto;
        border-bottom: 1px solid #EBEDF6;
        overflow: hidden;
        transition: border 250ms ease;
        ul {
            margin: 0px;
            padding: 0px;
            overflow: hidden;
            float: left;
            padding-left: .48rem;
            list-style-type: none;

            li {
                display: block;
                float: right;
                padding: .1rem .18rem .08rem;
                background-color: #F2F5FE;
                margin-right: .46rem;
                z-index: 2;
                position: relative;
                cursor: pointer;
                color: #607592;
                text-transform: uppercase;
                font: 600 13px/20px roboto, "Open Sans", Helvetica, sans-serif;
                transition: all 250ms ease;
                font-family: GothamRounded-Medium;
                font-size: 12px;
                span {
                    z-index: 9;
                    position: relative;
                }
            }

            li:after, li:before {
                display: block;
                content: " ";
                position: absolute;
                top: 0;
                height: 100%;
                width: 100%;
                background-color: #F2F5FE;
                transition: all 250ms ease;
                z-index: 1;
                border-top: 1px solid #e3e5ef;
                /*box-shadow: rgba(0,0,0,.1) 3px 2px 5px, inset rgba(255,255,255,.09) -1px 0;*/
            }

            li:before {
                right: -.24rem;
                transform: skew(30deg, 0deg);
                border-right: 1px solid #e3e5ef;
                /*box-shadow: rgba(0,0,0,.1) 3px 2px 5px, inset rgba(255,255,255,.09) -1px 0;*/
            }

            li:after {
                left: -24px;
                transform: skew(-30deg, 0deg);

                border-left: 1px solid #e3e5ef;
                /*box-shadow: rgba(0,0,0,.1) -3px 2px 5px, inset rgba(255,255,255,.09) 1px 0;*/
            }

        }

    }

    .tabs ul li.tabs-item-active {
        z-index: 3;
        background: #ffffff;
    }

    .tabs ul li.tabs-item-active,
    .tabs ul li.tabs-item-active:before,
    .tabs ul li.tabs-item-active:after {
        background: #ffffff;
        color: #607592;
    }

</style>
