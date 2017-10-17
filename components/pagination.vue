<template>
    <div class="footer-pagination">
        <el-pagination
                class="info-pagination"
                layout="prev, pager, next"
                :page-size="pageSize"
                :current-page="_pageNum"
                @current-change="changePage"
                :total="tableData.length">
        </el-pagination>
    </div>
</template>
<script>
    import Vue from 'vue';
    import pagination from 'element-ui/lib/pagination'
    Vue.use(pagination);
    export default {
        props: {
            tableData: {
                type: Array,
                default: () => []
            },
            pageNum: {
                type: Number,
                default: 1
            },
            pageSize: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {}
        },
        methods: {
            changePage(curIndex){
                this.$emit('update:pageNum', curIndex)
            }
        },
        created(){
        },
        computed: {
            _pageNum(){
                return this.pageNum;
            }
        }
    }
</script>
<style lang="less">
    @borderColor: lighten(#E8EAF1, -10%);
    .footer-pagination {
        margin-top: .16rem;
        font-family: GothamRounded-Book;
        font-size: 12px;
        color: #6B7788;
        height: .35rem;
        text-align: center;
        .info-pagination {
            margin-right: -.06rem;
            .el-pager li {
                height: .32rem;
                width: .32rem;
                line-height: .32rem;
                color: #7f8290;
            }
            .el-pager li.active {
                border-color: #607592;
                background-color: #607592;
                color: white;
            }
            .btn-prev, .btn-next {
                width: .52rem;
                height: .32rem;
                line-height: .32rem;
            }
        }
    }

    .ts-ow {
        float: left;
        color: #7d8b9f;
    }

    .el-icon-arrow-left:before {
        content: "PRE";
    }

    .el-icon-arrow-right:before {
        content: "NEXT";
    }
</style>
