# vue-element-manage

> 基于在ElementUI的基础上集成适合vue管理系统使用的table,form,Pagination,Dialog组件
> 使用公共的方法(清空对象值)

## Install
npm install

##  Usage
# test制作自己的组件包
1.想在自己本地测试不提交npm的话可以先npm run build 然后再npm pack 生成tgz的压缩包。（记住 顺序很重要）
2.然后再其他项目或者本地项目npm install 刚生成的.tgz压缩包
3.在install使用的npm不能和你现使用的项目package.json的name重名
4.在项目中如果是export default install的话（属于组件挂载到全局）,直接<search-common></search-common>就可以了，也可以按需加载
5.你发布的npm包名不可重复，没有问题话基本上就咱们就传上去吧！

# search
<search-common v-bind:searchForm="searchFormData" ref="searchForm"></search-common>
# table
<table-common v-bind:formDateTable="formDateTable" @selectsRow="getTableCurrentSelected"></table-common>
# pagination
<pagination-common v-bind:formDatePagination="paginationDate"   @changeCurrentPage="setCurrentPage"  @changePageSize="setPageSize"></pagination-common>

参考现有ht platform_vue项目的
对公共方法的使用如下
import commonMethods from "vue-element-manage";
commonMethods.clearObject(this.searchFormData.keys);

-----------2020-07-24 新增表格单元格被点击事件------------------



