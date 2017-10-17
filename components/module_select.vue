<template>

    <ul class="select">
        <li>
            <input class="select_close" type="radio" name="awesomeness" id="awesomeness-close" value=""/>
            <span class="select_label select_label-placeholder">Awesomeness Level</span>
        </li>

        <li class="select_items">
            <input class="select_expand" type="radio" name="awesomeness" id="awesomeness-opener"/>
            <label class="select_closeLabel" for="awesomeness-close"></label>

            <ul class="select_options">
                <li class="select_option">
                    <input class="select_input" type="radio" name="awesomeness" id="awesomeness-ridiculous"/>
                    <label class="select_label" for="awesomeness-ridiculous">ridiculous</label>
                </li>

                <li class="select_option">
                    <input class="select_input" type="radio" name="awesomeness" id="awesomeness-reasonable"/>
                    <label class="select_label" for="awesomeness-reasonable">reasonable</label>
                </li>

                <li class="select_option">
                    <input class="select_input" type="radio" name="awesomeness" id="awesomeness-lacking"/>
                    <label class="select_label" for="awesomeness-lacking">lacking</label>
                </li>

                <li class="select_option">
                    <input class="select_input" type="radio" name="awesomeness" id="awesomeness-awesomeless"/>
                    <label class="select_label" for="awesomeness-awesomeless">awesomeless</label>
                </li>
            </ul>

            <label class="select_expandLabel" for="awesomeness-opener"></label>
        </li>
    </ul>

</template>

<script>
    const move = require('move-js')
    export default {
        data () {
            return {
                selected: null,
                name: [
                    'Jack',
                    'Tom',
                    'Obama',
                    'Vince',
                    'Peter',
                    'Bob'
                ]
            }
        },
        methods: {
            select: function (value) {

                this.show = false
                this.selected = value

            }
        },
        created()
        {
            this.selected = this.name[0]
        },
        computed: {}
    }
</script>

<style lang="less" scoped>


    .select {
        width: 2.25rem;
        height: .4rem;
        cursor: pointer;
        background-color: white;
        box-shadow: 0 .02rem 0 white;
        border-radius: .02rem;
        border: .01rem solid #999999;
        position: relative;
        &_expand {
            width: 0;
            height: .4rem;
            position: absolute;
            top: 0;
            right: 0;

            &::after {
                content: '\003E';
                position: absolute;
                top: 50%;
                right: 0;
                transform: translate(-50%, -50%) rotate(90deg) scaleY(1.75);
                color: #3e3e3e;
                pointer-events: none;
                z-index: 2;
                transition: all 250ms cubic-bezier(.4, .25, .3, 1);
                opacity: .6;
            }

            &:hover::after {
                opacity: 1
            }

            &:checked::after {
                transform: translate(-50%, -50%) rotate(90deg) scaleX(-1) scaleY(1.75);
            }
        }

        &_expandLabel {
            display: block;
            width: 100%;
            height: .4rem;
            position: absolute;
            top: 0;
            left: 0;
            cursor: pointer;
        }

        &_close {
            display: none;
        }

        &_closeLabel {
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            display: none;
        }

        &_items {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: .02rem;
            padding-top: .4rem;
        }

        &_input {
            display: none;
        }

        &_label {
            transition: all 250ms cubic-bezier(.4, .25, .3, 1);
            display: block;
            height: 0;
            line-height: .4rem;
            overflow: hidden;
            color: #3e3e3e;
            background-color: #fff;
            cursor: pointer;
            padding-left: .2rem;

            &-placeholder {
                height: .4rem;
                vertical-align: middle;
                position: absolute;
                top: 0;
                left: 0;
                opacity: .6;
                background-color: transparent;
            }
        }

        &_expand:checked {
            + .select_closeLabel {
                display: block;
                + .select_options {
                    border: .01rem solid #999999;
                    .select_label {
                        height: .4rem;
                        position: relative;
                        &:hover {
                            background-color: #f7f7f7
                        }
                    }

                    + .select_expandLabel {
                        display: none;
                    }
                }
            }
        }

        &_input:checked + .select_label {
            height: .4rem;
            margin-top: .4rem;

        }
    }

</style>
