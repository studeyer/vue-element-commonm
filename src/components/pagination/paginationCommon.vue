<template>
  <div class="pagination-wrap">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="formDatePagination.currentPage"
      :page-sizes="formDatePagination.pageSizes"
      :page-size="formDatePagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :hide-on-single-page="value"
      :total="formDatePagination.totalNumber">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "paginationCommon",
    data() {
      return {
       value:false,
      };
    },
    props:{
      formDatePagination:{
        type:Object,
        default:{},
      }
    },
    methods:{
      handleSizeChange(val) {
        this.$emit('changePageSize',val);
      },
      handleCurrentChange(val) {
        this.$emit('changeCurrentPage',val);
      },

    },

  }
</script>

<style lang="less" scoped>
  .el-pager{
    background: #f00;
  }
  .pagination-wrap{
    width: 100%;
    height: 50px;
    background: #fff;
    line-height: 50px;
    padding-top:15px;
    margin-left: -20px;
  }
  .el-pagination{
    text-align: right;
  }

</style>
