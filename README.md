# vue-element-manage

> 基于在ElementUI的基础上集成适合vue管理系统使用的table,form,Pagination,Dialog组件

## Install
npm install

##  Usage
# search
<searce-common v-bind:searchForm="searchFormData" ref="searchForm"></searce-common>
# table
<table-common v-bind:formDateTable="formDateTable" @selectsRow="getTableCurrentSelected"></table-common>
# pagination
<pagination-common v-bind:formDatePagination="paginationDate"   @changeCurrentPage="setCurrentPage"  @changePageSize="setPageSize"></pagination-common>

参考现有ht platform_vue项目的


