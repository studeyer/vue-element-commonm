<template>
  <div class="dialog-component-wrap">
    <!--form-->
    <el-dialog
      :title="formDate.title"
      :visible.sync="centerDialogVisible"
      :width="dialogWidth"
      :top="formDate.top ? formDate.top : '20vh'"
      :modal="true"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="true"
      @close="closeDialog"
      border-radius="4px"
      :append-to-body="true"
      :custom-class="formDate.size  == 'small' ? 'dialog-wrap-custom-small' : 'dialog-wrap-custom'"
      center
    >
      <el-form
        :style="formDate.formContentStyle ? formDate.formContentStyle :'' "
        :model="formDate"
        v-for="(item,index) in formDate.values"
        :key="index"
        ref="formDate"
        v-if="formDate.dialogType == 'formType'"
        :label-position="formDate.labelPosition ? formDate.labelPosition : 'right' "
        @submit.native.prevent
      >
        <!--input 类-->
        <el-form-item
          :label="item.label"
          :label-width="formLabelWidth"
          v-show="item.isShow"
          v-if="item.valueType=='typeInput'"
        >
          <!--失去焦点-->
          <el-input
            v-if="item.valueType=='typeInput' && item.blur"
            v-model="formDate.keys[item.modal]"
            @blur="item.blur(formDate.keys[item.modal])"
            :key="index"
            :readonly="item.readOnly"
            :placeholder="item.valuePlaceHolder"
            autocomplete="off"
            :type="item.inputType ? item.inputType : 'text'"
            v-bind:class="{ readonly: item.readOnly }"
          ></el-input>
          <el-input
            v-else-if="item.valueType=='typeInput'"
            v-model="formDate.keys[item.modal]"
            autocomplete="off"
            :placeholder="item.valuePlaceHolder"
            :key="index"
            :readonly="item.readOnly"
            :type="item.inputType ? item.inputType : 'text'"
            v-bind:class="{ readonly: item.readOnly }"
          ></el-input>
        </el-form-item>

        <!--带说明文字-input类-->
        <el-form-item
          v-else-if="item.valueType=='typeInputExplain'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-row>
            <el-col :span="item.valueProportion">
              <el-input
                v-model="formDate.keys[item.modal]"
                autocomplete="off"
                :placeholder="item.valuePlaceHolder"
                :key="index"
                :readonly="item.readOnly"
                v-bind:class="{ readonly: item.readOnly }"
              ></el-input>
            </el-col>
            <el-col :span="item.explainProportion">
              <span class="item-explain">{{item.explainValue}}</span>
            </el-col>
          </el-row>
        </el-form-item>

        <!--select 类-->
        <el-form-item
          v-else-if="item.valueType=='typeSelect'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-select
            v-if="item.valueType=='typeSelect' && item.selectChangeHandel"
            v-model="formDate.keys[item.modal]"
            :placeholder="item.valuePlaceHolder"
            @change="item.selectChangeHandel"
          >
            <el-option
              v-for="(key,index) in item.modalOptions"
              :label="key.optionLabel"
              :value="key.optionValue"
              :key="index"
            ></el-option>
          </el-select>
          <el-select
            v-else
            v-model="formDate.keys[item.modal]"
            :placeholder="item.valuePlaceHolder"
          >
            <el-option
              v-for="(key,index) in item.modalOptions"
              :label="item.optionLabel ? key[item.optionLabel] : 'optionLabel'"
              :value="item.optionValue ? key[item.optionValue] : 'optionValue'"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 文本-->
        <el-form-item
          v-else-if="item.valueType=='typeText'"
          :label="item.label"
          :label-width="formLabelWidth"
          v-show="item.isShow"
        >
          <el-input
            v-model="formDate.keys[item.modal]"
            autocomplete="off"
            :placeholder="item.valuePlaceHolder"
            :key="index"
            class="input-txt-type"
            :readonly="item.readOnly"
          ></el-input>
        </el-form-item>
        <!-- 文本-->
        <!-- radio单选-->
        <el-form-item
          v-else-if="item.valueType=='typeRadio'"
          :label="item.label"
          :label-width="formLabelWidth"
          v-show="item.isShow"
        >
          <el-radio-group v-model="formDate.keys[item.modal]">
            <el-radio
              v-for="(itemRadio,indexRadio) in item.radioOptions"
              :key="indexRadio"
              :label="item.optionValue ? itemRadio[item.optionValue] :itemRadio.optionValue"
            >{{item.optionLabel ? itemRadio[item.optionLabel] :itemRadio.optionLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- radio单选-end-->
        <el-form-item
          v-else-if="item.valueType=='customSlot'"
          :label="item.label"
          :label-width="formLabelWidth"
          v-show="item.isShow"
        >
          <div>
            <slot :name="item.slotName" v-slot:item></slot>
          </div>
        </el-form-item>
        <!--testarea-->
        <el-form-item
          v-else-if="item.valueType=='typeTextarea'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="formDate.keys[item.modal]"
            autocomplete="off"
            :placeholder="item.valuePlaceHolder"
            :key="index"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            class="input-txt-type"
            :readonly="item.readOnly"
          ></el-input>
        </el-form-item>
        <!-- 时间 -->
        <el-form-item
          v-else-if="item.valueType=='typeTimePicker'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="formDate.keys[item.modal]"
            :type="item.pickerType ? item.pickerType: 'datetimerange'"
            range-separator="-"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <!--上传图片-->
        <el-form-item
          v-else-if="item.valueType=='typeUpload'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="dialog-uploader"
            :action="item.uploadUrl ? item.uploadUrl : ''"
            :style="dialogUploadStyle"
            :show-file-list="true"
            :file-list="item.fileList"
            :before-upload="item.beforeUpload"
            :on-change="item.handleChange"
            :on-remove="item.handleRemove"
            :auto-upload="false"
            ref="uploadFile"
            :name="item.name"
            :headers="item.headers"
            list-type="picture-card"
            :http-request="item.handleUpload"
            accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
          >
            <img v-if="item.fileList.length > 0 " class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!--上传文件-->
        <el-form-item
          v-else-if="item.valueType=='typeUploadFile'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <div class="dialog_upload_btn_place">
            <p>选择文件</p>
            <input type="file" value="选择文件" @change="item.uploadFileChange($event.target.files[0])" />
          </div>
          <div class="dialog_upload_file_name">
            <p>{{item.currentFileName}}</p>
          </div>
        </el-form-item>
        <el-form-item
          v-else-if="item.valueType=='typeTextDiv'"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <div>{{ formDate.keys[item.modal] }}</div>
        </el-form-item>
      </el-form>
      <!-- 提示信息-->
      <div class="message-html" v-if="formDate.messageInfo">
        <p
          v-for="(item,index) in formDate.messageInfo.messageMaster"
          :key="index"
          :style="item.style ? item.style :''"
        >
          <!--<img src="@/assets/images/common/ic_info.png" />-->
          {{item.value}}
        </p>
        <span v-if="formDate.messageInfo.messageDeputy">{{formDate.messageInfo.messageDeputy}}</span>
      </div>

      <span slot="footer" class="dialog-footer" v-if="formDate.submitHandelList">
        <el-button
          v-for="(item,index) in formDate.submitHandelList"
          :type="item.buttonType"
          @click="item.submitHandel"
          :loading="formDate.loading && formDate.loading !== undefined ? formDate.loading : false"
          :key="index"
        >{{item.submitName}}</el-button>
      </span>

      <!--表格-->
      <el-table
        :data="formDate.tableData"
        size="small"
        border="border"
        :max-height="formDate.tableMaxHeight ? formDate.tableMaxHeight : '650'"
        :height="formDate.tableHeight ? formDate.tableHeight : '600'"
        v-if="formDate.dialogType == 'tableType'"
        header-row-class-name="table-header"
        cell-class-name="tb-style"
        @select="selectsRow"
        @select-all="selectsRow"
      >
        <!--选择框-->
        <el-table-column
          v-if="formDate.showSelect"
          type="selection"
          label
          width="55"
          :selectable="selectLimit"
        ></el-table-column>
        <!--序列号-->
        <el-table-column v-if="formDate.showSerialNumber" type="index" label="序号"></el-table-column>
        <!--表头-->
        <el-table-column
          v-for="(item,index) in formDate.tableColum"
          v-if="item.prop !== 'tool' && item.show"
          :prop="item.prop"
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
          :width="item.width"
        >
          <template slot-scope="scope">
            <!--操作项是否显示下拉-->
            <div class="table-control-toll">
              <el-button
                v-for="(toolitem,index) in item.toolList"
                @click="toolitem.handel(scope.row)"
                type="text"
                size="small"
                :key="index"
                v-if="((toolitem.isLimit && toolitem.showKeyValue.indexOf(scope.row[toolitem.showKey]) !== -1 ) || !toolitem.isLimit)"
                v-html="toolitem.name"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap" v-if="formDate.pagination!=null">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="formDate.pagination.currentPage"
          :page-sizes="formDate.pagination.pageSizes"
          :page-size="formDate.pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :hide-on-single-page="singlePageValue"
          :total="formDate.pagination.totalNumber"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "dialogCommon",
  data() {
    return {
      dialogUploadStyle: { width: "100%", height: "auto" },
      centerDialogVisible: false,
      singlePageValue: false,
      lockReadOnly: true,
      myLoading: null,
      formLabelWidth: "90px",
      dialogWidth: "420px"
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    formDate: {
      type: Object,
      default: {}
    },
    loding: {
      type: Boolean,
      default: false
    }
  },

  created() {
    this.$nextTick(() => {
      this.centerDialogVisible = this.dialogVisible;
      this.formLabelWidth =
        typeof this.formDate.formLabelWidth !== "undefined"
          ? (this.formLabelWidth = this.formDate.formLabelWidth)
          : (this.formLabelWidth = "90px");
      this.dialogWidth =
        typeof this.formDate.dialogWidth !== "undefined"
          ? (this.dialogWidth = this.formDate.dialogWidth)
          : (this.dialogWidth = "420px");
      this.dialogUploadStyle =
        typeof this.formDate.dialogUploadStyle !== "undefined"
          ? (this.dialogUploadStyle = this.formDate.dialogUploadStyle)
          : (this.dialogUploadStyle = {
              width: "100%",
              height: "auto"
            });
    });
  },
  mounted() {
    this.$nextTick(() => {});
  },
  watch: {
    centerDialogVisible: function(newVal, oldVal) {
      this.centerDialogVisible = newVal;
    }
  },
  methods: {
    closeDialog() {
      this.centerDialogVisible = false;
      this.$emit("closeDialog", false);
      if (this.formDate.dialogType == "formType") {
        for (let name in this.formDate.keys) {
          this.formDate.keys[name] = "";
        }
      }
    },
    getLoading() {
      this.myLoading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      });
    },
    selectChange(value) {},
    selectsRow(selection, row) {
      this.$emit("selectsRow", selection, row);
    },
    // 设置是否可以选中
    selectLimit(selection, row) {
      if (typeof this.formDateTable.limitSelected !== "undefined") {
        return (
          selection[this.formDateTable.limitSelected.limitKeywords] ==
          this.formDateTable.limitSelected.limitAllowWords
        );
      } else {
        return true;
      }
    },
    handleSizeChange(val) {
      this.$emit("changePageSize", val);
    },
    handleCurrentChange(val) {
      this.$emit("changeCurrentPage", val);
    }
  }
};

// 组件formData说明
// formDate示例 每个values中的modal 与keys下的值 一一对应，Input绑定及修改、父页面调取直接取keys下面的值   submitHandelList为按钮执行的事件列表
// formDateUpdateGasCard: {
//   title: '销卡',
//     dialogType: 'formType',
//     messageInfo: {
//     messageMaster: '确定将当前卡注销吗?',
//       messageDeputy: '（注销后账户余额和积分不可恢复）'
//   },
//   keys: {
//     cardId: '',
//       name: '',
//       gas_card_money: '',
//       state: ''
//   },
//   values: [
//     {
//       label: '卡号：',
//       valueType: 'typeText',
//       modal: 'cardId',
//       blur: '',
//       readOnly: true,
//       isShow: true,
//       valuePlaceHolder: ''
//     },
//     {
//       label: '姓名：',
//       valueType: 'typeInput',
//       modal: 'name',
//       blur: '',
//       readOnly: true,
//       isShow: true,
//       valuePlaceHolder: ''
//     },
//     {
//       label: '油号',
//       valueType: 'typeSelect',
//       modal: 'gas_no',
//       blur: '',
//       readOnly: false,
//       isShow: true,
//       valuePlaceHolder: '请选择油号',
//       modalOptions: [
//         {
//           optionLabel: 95,
//           optionValue: 6.6
//         },
//         {
//           optionLabel: 98,
//           optionValue: 9.6
//         }
//       ]
//     },
// {
//   label: '油卡图片：',
//     valueType: 'typeUpload',
//   modal: 'client_id',
//   blur: '',
//   readOnly: false,
//   isShow: true,
//   valuePlaceHolder: '',
//   showFileList: false,
//   beforeUpload: this.addCardType(),
//   // imageUrl:'http://img.pconline.com.cn/images/upload/upc/tx/sns/1112/31/c0/10108860_10108860_1325309827140.jpg',
//   imageUrl:'',
//   action:'',
//
// },
//     {
//       label: '油卡状态：',
//       valueType: 'typeInput',
//       modal: 'state',
//       blur: '',
//       readOnly: true,
//       isShow: false,
//       valuePlaceHolder: ''
//     },
//   ],
//     submitHandelList: [
//     {
//       submitName: '确定',
//       submitHandel: this.destructionCardSubmit,
//       buttonType: 'primary'
//     },
//     {
//       submitName: '取消',
//       submitHandel: this.closeDialog,
//       buttonType: 'default'
//     }
//   ]
// },
</script>

<style lang="less">
.dialog-wrap-custom,
.dialog-wrap-custom-small {
  background: #fff;
  border-radius: 4px;
  .el-dialog__body {
    padding-bottom: 20px;
    .el-form {
      .el-form-item {
        margin-top: 0;
        margin-bottom: 16px;
      }
    }
  }
  .el-dialog__footer {
    .el-button {
      font-size: 12px;
      padding: 9px 23px;
    }
  }
  .el-input__inner {
    line-height: 36px;
    height: 36px;
    font-size: 14px;
  }
  .el-date-editor--datetimerange.el-input,
  .el-date-editor--datetimerange.el-input__inner {
    width: 100%;
  }
  .dialog-component-wrap {
    .el-dialog--center {
      border-radius: 4px;
      .el-dialog__body {
        padding: 10px 50px 10px !important;
      }
    }

    .el-dialog--center {
      border-radius: 4px;
    }
  }

  .dialog-uploader {
    overflow: hidden;

    .el-upload-list--picture-card {
      width: 100%;
      height: 100%;
      overflow: hidden;

      .el-upload-list__item {
        width: 100%;
        height: 100%;
      }
    }

    .el-upload--picture-card {
      width: 100%;
      height: 100%;
      background: rgb(235, 235, 235);

      i {
        display: none;
      }
    }

    img {
      width: 100%;
      height: 100%;
      display: block;
      margin: 0;
      padding: 0;
    }
  }

  .dialog_upload_btn_place {
    display: inline-block;
    vertical-align: middle;
    height: 32px;
    border: none;
    background: red;
    color: #fff;
    line-height: 32px;
    text-align: center;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    p {
      padding: 0 20px;
    }
    input {
      position: absolute;
      left: 0;
      top: 0;
      border: none;
      z-index: 1;
      width: 100%;
      height: 100%;
      cursor: pointer;
      opacity: 0;
    }
  }
  .dialog_upload_file_name {
    display: inline-block;
    margin-left: 10px;
  }
  .el-dialog__header {
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  }

  .message-html {
    width: 100%;
    background: rgb(245, 247, 250);
    /*background: red;*/
    padding: 15px 0;
    text-align: center;
    margin-bottom: 5px;
    letter-spacing: 0.5px;
    font-family: "Microsoft YaHei";

    p {
      line-height: 20px;
      vertical-align: middle;
      overflow: hidden;
      height: 20px;
      font-size: 13px;
      margin-bottom: 10px;
      color: rgb(48, 49, 51);

      img {
        width: 16px;
        height: 16px;
        position: relative;
        top: 2px;
        padding-right: 5px;
      }
    }

    span {
      font-size: 13px;
      color: rgb(144, 147, 153);
    }
  }

  .input-txt-type {
    background: none;
    border: none;

    input {
      border: none;
      outline: none;
    }
  }

  .el-button {
    font-size: 12px;
    padding: 8px 23px;
  }

  .el-dialog__footer {
    text-align: right;
    padding: 10px 20px 40px;
    .dialog-footer {
      text-align: right;

      .button {
        padding-left: 23px;
        padding-right: 23px;
      }
    }
  }

  .el-button:focus,
  .el-button:hover {
    background: #fff;
    color: red;
    border-color: rgb(220, 223, 230);
  }

  .el-button--primary {
    background: red !important;
    border-color:red !important;
  }

  .el-button--primary:hover,
  .el-button--primary:focus {
    background: red !important;
    border-color: red !important;
    color: #fff;
  }

  .el-select {
    width: 100%;
  }

  .el-select-dropdown__list {
    padding-bottom: 10px;
  }

  .el-dialog--center {
    border-radius: 4px;

    .el-dialog__body {
      padding: 10px 50px 10px !important;
    }
  }

  .el-form-item {
    margin-bottom: 16px;
  }

  .item-explain {
    margin-left: 15px;
    font-size: 13px;
    letter-spacing: 0.5px;
  }

  .readonly {
    background: rgb(242, 246, 250);

    input {
      background: rgb(242, 246, 250);
      border: none;
    }
  }
}
.dialog-wrap-custom-small {
  .el-dialog__body {
    .el-form {
      .el-form-item {
        margin-top: 0;
        margin-bottom: 0px;
      }
    }
  }
}
</style>
