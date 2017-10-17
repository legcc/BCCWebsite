<template>
    <footer class="footer">
        <p class="ts-ow">Showing {{(_pageNum - 1) * pageSize}}s to {{_pageNum * pageSize}} of {{tableData.length}} entries</p>
        <el-pagination
                class="table-info-pagination ts-pn"
                layout="prev, pager, next"
                :page-size="pageSize"
                :current-page="_pageNum"
                @current-change="changePage"
                :total="tableData.length">
        </el-pagination>
    </footer>
</template>

<script type="es6">
    import pagination from 'element-ui/lib/pagination'
    import Vue from 'vue';
    import Component from  'vue-class-component'
    @Component({
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
    })
    export default class tabPagination extends Vue {

        changePage(curIndex) {
            this.$emit('update:pageNum', curIndex)
        }

        get _pageNum() {
            return this.pageNum;
        }
    }
</script>

<style lang="less">
    .footer {
        margin-top: .16rem;
        font-family: GothamRounded-Book;
        font-size: 12px;
        color: #6B7788;
        height: .35rem;
        .table-info-pagination {
            float: right;
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

    .ts-pn {
        float: right;
    }

    .el-icon-arrow-left:before {
        content: "PRE";
    }

    .el-icon-arrow-right:before {
        content: "NEXT";
    }
</style>