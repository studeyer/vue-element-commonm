<template>
  <div class="table-wrap">
    <el-table
      :data="formDateTable.tableData"
      v-loading="formDateTable.loading ? formDateTable.loading : false"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.1)"
      size="small"
      :style="[{width:(formDateTable.tableWidth?formDateTable.tableWidth:'98%')},{margin:'0 auto'}]"
      :max-height="formDateTable.tableMaxHeight ? formDateTable.tableMaxHeight : '650'"
      :height="formDateTable.tableHeight ? formDateTable.tableHeight : '600'"
      header-row-class-name="table-header"
      cell-class-name="tb-style"
      @select="selectsRow"
      @select-all="selectsRow"
      @cell-click="cellClick"
      border
    >
      <!--选择框-->
      <el-table-column
        v-if="showSelect"
        type="selection"
        label
        width="55"
        :selectable="selectLimit"
      ></el-table-column>
      <!--序列号-->
      <el-table-column v-if="showSerialNumber" type="index" label="序号" :width="serialWidth"></el-table-column>
      <!--表头-->
      <el-table-column
        v-for="(item,index) in formDateTable.tableColum"
        v-if="item.prop !== 'tool' && item.show && item.formatter && !item.type"
        :prop="item.prop"
        :show-overflow-tooltip="true"
        :label="item.label"
        :width="item.width"
        :key="index"
        :formatter="item.formatter"
      ></el-table-column>
      <el-table-column
        v-else-if="item.prop !== 'tool' && item.show && !item.type"
        :prop="item.prop"
        :show-overflow-tooltip="true"
        :label="item.label"
        :width="item.width"
        :key="index"
      ></el-table-column>

      <el-table-column
        v-else-if="item.prop == 'tool'"
        :fixed="propFix"
        :label="item.label"
        text-align="left"
        background="#fff"
        :show-overflow-tooltip="true"
        :width="formDateTable.isSlideProp ? '120' :item.width"
      >
        <template slot-scope="scope">
          <!--操作项是否显示下拉-->
          <!--折叠操作列-->
          <div class="table-control-toll" v-if="isSlideProp">
            <el-button
              v-for="(toolitem,index) in item.toolList.filter(toolitem =>((toolitem.isLimit && toolitem.showKeyValue.indexOf(scope.row[toolitem.showKey]) !== -1 ) || !toolitem.isLimit))"
              @click="toolitem.handel(scope.row)"
              type="text"
              size="small"
              :key="index"
              v-if="((toolitem.isLimit && toolitem.showKeyValue.indexOf(scope.row[toolitem.showKey]) !== -1 ) || !toolitem.isLimit) && parseInt(index)  < 1"
              v-html="toolitem.name"
            ></el-button>
            <el-popover
              v-if="true"
              placement="bottom"
              title
              width="100"
              min-width="50"
              trigger="click"
            >
              <span
                class="tool-btn"
                v-for="(toolitem,index) in item.toolList.filter(toolitem =>((toolitem.isLimit && toolitem.showKeyValue.indexOf(scope.row[toolitem.showKey]) !== -1 ) || !toolitem.isLimit))"
                v-if="((toolitem.isLimit && toolitem.showKeyValue.indexOf(scope.row[toolitem.showKey]) !== -1 ) || !toolitem.isLimit) && index >=1 "
                @click="toolitem.handel(scope.row)"
                :key="index"
              >{{toolitem.name}}</span>
              <el-button
                type="text"
                size="small"
                isOpen="false"
                slot="reference"
                @click="setMore(scope)"
              >
                更多
                <i
                  :class="['el-icon--right',showToolSlide ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
                ></i>
              </el-button>
            </el-popover>
          </div>
          <!--不折叠操作列-->
          <div class="table-control-toll" v-if="!isSlideProp">
            <el-button
              v-for="(toolitem,index) in item.toolList"
              @click="toolitem.handel(scope.row)"
              type="text"
              size="small"
              :key="index"
              v-show="((toolitem.isLimit && toolitem.showKeyValue.indexOf(scope.row[toolitem.showKey]) !== -1 ) || !toolitem.isLimit) "
              v-html="toolitem.name"
            ></el-button>
          </div>
        </template>
      </el-table-column>

      <!--自定义组件列-->
      <el-table-column
        v-else-if="item.type && item.type=='customModule' && item.show"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :key="index"
      >
        <!--switch组件-->
        <template slot-scope="scope">
          <!--以下为自定义部分-->
          <!--switch组件  调用
          <table-common v-bind:formDateTable="formDateTable" @selectsRow="getTableCurrentSelected"
                      @switchRow="getTableCurrentSwitch" @nodeRow="getTableCurrentNode"  @radioRow="getTableCurrentRadio"></table-common>
          -->
          <el-switch
            v-if="item.moduleType == 'switch'"
            v-model="scope.row[item.prop]"
            :active-color="item.moduleConfig.activeColor? item.moduleConfig.activeColor : '#13ce66'"
            :inactive-color="item.moduleConfig.inactiveColor? item.moduleConfig.inactiveColor : '#ff4949'"
            :active-value="item.moduleConfig.activeValue ? item.moduleConfig.activeValue : 'true'"
            :inactive-value="item.moduleConfig.inactiveValue ? item.moduleConfig.inactiveValue : 'false'"
            @change="switchChange(scope.row)"
          ></el-switch>
          <!--switch组件--end-->
          <!-- radio组件 -->
          <el-radio
            v-if="item.moduleType == 'radio'"
            :label="scope.row[item.prop]"
            v-model="formDateTable.radioValue"
            @change.native="radioClick(scope.row)"
          >&nbsp;</el-radio>
          <!-- 图片组件 -->
          <!--<el-image
            v-if="item.moduleType == 'image' && scope.row.imageUrl!=''"
            style="width: 60px; height: 60px"
            :src="scope.row[item.prop]"
            fit="contain"
          >
          </el-image>-->
           <el-image v-if="item.moduleType == 'image'" :src="scope.row[item.prop]" class="tb-image" alt=""></el-image>
          <!-- <img v-if="item.moduleType == 'image'" :src="scope.row[item.prop]" alt /> -->
          <!-- 图片组件end -->
          <!--文本点击组件-->
          <span
            v-if="item.moduleType == 'bindHandle'"
            @click="nodeClick(scope.row)"
          >{{scope.row[item.prop]}}</span>
          <!--文本点击组件--end-->
          <!--文本自定义样式-->
          <div v-if="item.moduleType == 'customStyleText'" v-html="scope.row[item.prop]"></div>
          <!--文本自定义样式--end-->
          <!-- 输入编辑组件 -->
          <el-input
            type="text"
            v-if="item.moduleType == 'input'"
            v-model="scope.row[item.prop]"
            @blur="inputChange(scope.row[item.prop])"
          ></el-input>
          <!-- 输入编辑组件end -->
        </template>
      </el-table-column>

      <!--普通table-->
      <el-table-column
        v-else-if="item.show"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :key="index"
      ></el-table-column>
    </el-table>
  </div>
</template>
<!--参数示例-->
<!--formDateTable: {
          tableData: [], ==>table数据
          tableColum: [   ==>设置表头
            {
              prop: 'discount_id',
              label: '活动ID',
              width: '200',
              show: true
            },
            {
              prop: 'state',
              label: '状态',
              width: '200',
              show: true,
              formatter: this.formatState,  ==>对数据进行修改 this.formatState为父组件中的方法
            },
            {
             prop: 'latest_sync_error',
                 type: 'customModule',
                 moduleType: 'bindHandle',
                 moduleConfig: {
                 activeColor: '#69dc5d',
                 inactiveColor: '#e6eaee',
                 activeValue: '启用',
                 inactiveValue: '停用',
             },
             label: '异常',
              width: '',
              show: true
             },
             {
              prop: 'state',
              type: 'customModule',   ==》自定义组件
              moduleType: 'switch',   ==》自定义组件中的switch组件
              moduleConfig: {
                activeColor: '#69dc5d',
                inactiveColor: '#e6eaee',
                activeValue: '启用',
                inactiveValue: '停用',
              },
              label: '状态',
              width: '',
              show: true
            },

            {
              prop: 'latest_sync_error',
              label: '异常',
              width: '',
              show: true
            },
            {
              prop: 'tool',     ==>操作栏
              label: '操作',
              width: '',
              toolList: [
                {
                  isLimit: false,  ==>是否限制显示
                  name: '详情',
                  handel: this.toDetail,   ==>执行的方法，this.toDetail为父组件中的方法
                  showKey: '',            ==>限制显示的健值
                  showKeyValue: [],       ==>限制条件，

                },
                {
                  isLimit: false,
                  name: '删除',
                  handel: this.removeItem,
                  showKey: '',
                  showKeyValue: []
                },

              ],
              show: true
            }

          ],
          showSelect: false,  ==> 是否显示复选框
          limitSelected: {    ==> 是否可以选中
            limitKeywords: '',    ==>不可选 中的key
            limitAllowWords: '',    ==>不可选中的限制
          },
          showSerialNumber: false,   ==>是否显示列表前的序列号
          isSlideProp: false,   ==>是否显在操作列表显示更多按钮
        },-->
<script>
var app0;
export default {
  name: "tableCommon",
  data() {
    return {
      refrach: false,
      serialWidth: "50px",
      showToolSlide: false,
      toolsLength: 5,
      openSearch: false,
      showSelect: false,
      showSerialNumber: false,
      propFix: true,
      tmpArr: [],
      loading: true,
      loadingTable: true,
      loadingText: "数据加载中...",
      isSlideProp: false
    };
  },
  props: {
    formDateTable: {
      type: Object,
      default: {}
    }
  },
  beforeCreate: function() {
    app0 = this;
  },
  created() {
    //设置默认值
    this.showSelect =
      typeof this.formDateTable.showSelect !== "undefined"
        ? this.formDateTable.showSelect
        : (this.showSelect = false);
    this.showSerialNumber =
      typeof this.formDateTable.showSerialNumber !== "undefined"
        ? this.formDateTable.showSerialNumber
        : (this.formDateTable.showSerialNumber = false);
    this.propFix =
      typeof this.formDateTable.propFix !== "undefined"
        ? this.formDateTable.propFix
        : (this.formDateTable.propFix = "right");
    this.serialWidth =
      typeof this.formDateTable.serialWidth !== "undefined"
        ? this.formDateTable.serialWidth
        : (this.formDateTable.serialWidth = "50px");
    this.isSlideProp =
      typeof this.formDateTable.isSlideProp !== "undefined"
        ? this.formDateTable.isSlideProp
        : false;
  },
  watch: {
    formDateTable: {
      handler(newValue, oldValue) {
        this.refrach = false;
        this.loadingText =
          typeof newValue.loadingText !== "undefined"
            ? newValue.loadingText
            : this.loadingText;
        this.$nextTick(() => {
          this.refrach = true;
        });
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    handleClick(row) {
      console.log(row);
    },

    selectsRow(selection, row) {
      this.$emit("selectsRow", selection, row);
    },
    //单元格点击
    cellClick(row, column, cell, event){
    	this.$emit("cellClick", row, column, cell);
    },
    //switch操作变化
    switchChange(row) {
      this.$emit("switchRow", row);
    },
    //input操作变化
    inputChange(row) {
      this.$emit("inputRow", row);
    },
    // radio选择
    radioClick(row) {
      this.$emit("radioRow", row);
    },
    //文本节点点击事件
    nodeClick(row) {
      this.$emit("nodeRow", row);
    },
    //设置是否可以选中
    selectLimit(selection, row) {
      if (typeof this.formDateTable.limitSelected !== "undefined") {
        return selection[this.formDateTable.limitSelected.limitKeywords] ==
          this.formDateTable.limitSelected.limitAllowWords
          ? true
          : false;
      } else {
        return true;
      }
    },
    //显示查看更多
    setMore(scope) {},
    //改变table中值
    formData(row, collum, cellValue) {}
  }
};
</script>

<style lang="less">
@colorActive: #f938ab;
.el-popover {
  min-width: 50px;
}

.el-table__header-wrapper {
  background: rgb(245, 247, 250);
}

.form-table-wrap .el-button {
  font-size: 13px;
}

.el-table_1_column_1 {
  border-right: 1px solid red;
}

.el-table__row {
  td:nth-of-type(last) {
    background: red;
  }
}

.tool-btn {
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: block;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
  padding-left: 10px;
}

.tool-btn:hover {
  color: @colorActive;
}

.table-wrap {
  margin: 0;
  background: #fff;
  width: 100%;
  padding-top: 10px;

  .el-table::before {
    height: 0;
    border: none;
  }

  .el-table::after {
    height: 0;
    border: none;
  }

  .el-table--border {
    border: none;
  }

  .el-popover {
    text-align: center;
  }

  .tb-style:last-child {
    border-right: 1px solid #ebeef5;
  }

  .tb-style {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 48px;
    line-height: 48px;
    padding-top: 0;
    padding-bottom: 0;
    border-right: none;
    border-right: 1px solid #ebeef5;

    .cell {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 13px;
      border: none;
    }
    .el-image{
      width:60px;
      height:60px;
    }
  }

  .el-table__fixed-right {
    border-top: 1px solid #ebeef5 !important;
  }

  .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0 !important;
  }

  .el-table__header-wrapper {
    border: 1px solid #ebeef5;
    border-bottom: none;
    background: rgb(245, 247, 250);
    box-sizing: border-box;
    .el-table__header {
      border-right: 1px solid #ebeef5;
    }
    .el-table__header::after {
      height: 1px;
    }
    .el-table thead {
      border-right: 1px solid #ebeef5 !important;
    }

    .table-header {
      border-right: 1px solid #ebeef5 !important;
      border-collapse: collapse;
      overflow: hidden;
      .cell {
        font-weight: normal;
      }
    }
  }

  .el-table__body-wrapper {
    .el-table__body {
      border: 1px solid #ebeef5;
      border-top: none;
      border-bottom: none;
      box-sizing: border-box;
      border-collapse: collapse;

      tbody {
        border-right: 3px solid #ebeef5;
      }
    }
  }

  .table-header {
    height: 50px;

    th {
      background: #fbfbfb;
      color: rgb(51, 51, 51);
      font-family: PingFang;
      font-size: 14px;
      border-right: 1px solid #ebeef5 !important;
    }
  }

  .el-button {
    width: auto;
  }

  .table-control-toll {
    position: relative;
    color: rgb(245, 108, 108);
    width: 200px;

    .el-button {
      width: auto !important;
      margin: 0 6px 0 0;
      padding-left: 5px;
      padding-right: 5px;
      border: none;
    }

    .el-button:hover {
      background: none !important;
    }

    .el-button--text {
      color: @colorActive;

      span {
        color: @colorActive;
      }
    }

    .tool-lise {
      width: 50%;
      border: 1px solid #000;
      position: absolute;
      left: 50%;
      top: 20px;
      margin-left: -30%;
    }
  }
}
</style>
