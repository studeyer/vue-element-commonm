<template>
  <div class="common_detail_wrap">
    <div class="title">
      <p class="title-btn" @click="toAddMoFangMerchant(undefined,'add')">添加新版本</p>
      <div class="border-line"></div>
    </div>
    <!--table-->
    <table-common 
    	v-bind:formDateTable="formDateTable" 
      @cellClick="cellClick"></table-common>
    <!--paginotaion-->
    <pagination-common
      v-bind:formDatePagination="paginationDate"
      @changeCurrentPage="setCurrentPage"
      @changePageSize="setPageSize"
    ></pagination-common>
    <div v-if="dialogComponentState">
      <dialog-common
        :dialogVisible="dialogComponentState"
        v-bind:formDate="formDataDialog"
        ref="dialogCommon"
        @closeDialog="updateDialogState"
      ></dialog-common>
    </div>
  </div>
</template>

<script>
//import tableCommon from "../components/tableCommon";
//import paginationCommon from "../components/paginationCommon";
//import dialogCommon from "../components/dialogCommon";
import {
  getNowFormatDate,
  getMessageBox,
  clearObject
} from "../assets/js/commonMethods";

export default {
  name: "managementAppVersion",
  data() {
    return {
      lodingState: true,
      // 上传文件数据
      uploadData: {
        uploadUrl: "",
        station_id: "",
        delImage: "",
        currentImgUrl: ""
      },
      //公用组件弹窗数据
      dialogComponentState: false,
      formDataDialog: {},
      formDateTable: {
        tableData: [],
        tableColum: [
        	{
						prop: "imageUrl",
						label: "商品图片",
						// width: "100",
						show: true,
						type: "customModule",
						moduleType: "image"
					},
        	{
						prop: "paixu",
						label: "商品图片",
						// width: "100",
						show: true,
						type: "customModule",
						moduleType: "image",
					},
          {
            prop: "name",
            label: "平台",
            width: "150",
            show: true
          },
          {
            prop: "mainAccount",
            label: "版本号",
            // width: '100',
            show: true
          },
          {
            prop: "os",
            label: "app类型",
            // width: '150',
            show: true
          },
          {
            prop: "is_force",
            label: "强制更新",
            show: true,
          },
          {
            prop: "title",
            label: "更新标题",
            // width: '100',
            show: true
          },
          {
            prop: "create_time",
            label: "	更新日期",
            // width: '100',
            show: true
          },
          {
            prop: "tool",
            label: "操作",
            width: "140",
            toolList: [
              {
                isLimit: false,
                name: "下载",
                handel: this.toAddMoFangMerchant
              },
              {
                isLimit: false,
                name: "编辑",
                handel: this.toAddMoFangMerchant
              },
              {
                isLimit: false,
                name: "删除",
                handel: this.selfUseStateChange
              }
            ],
            show: true
          }
        ],
        loading: false
      },
      paginationDate: {
        totalNumber: 0,
        currentPage: 1,
        pageSizes: [10, 20, 30],
        pageSize: 10
      }
    };
  },
  created() {
    this.getGoodsList();
  },

  methods: {
    //获取列表-更改分页
    getGoodsList() {
    	console.log("获取列表-更改分页")
    	this.formDateTable.tableData =[{
    		create_time: "2019-05-13 09:50:50",
				file_path: "/gasStationAppVersion/20190513095254/轶善正式 .apk",
				id: "488210149996412928",
				is_force: "是",
				note: "支付规则NFC更新",
				os: "android",
				mainAccount: "1.0",
				name: "更新支付规则NFC",
				title: "123456",
				url: "https://yishanol.com/ht_platform/gasStationApp/getLatestAndroid.do?project=pos",
				imageUrl:'https://s3.pstatp.com/toutiao/xitu_juejin_web/img/logo.a7995ad.svg',
				paixu:"http://172.168.20.105:8080/jenkins/static/1559200c/images/headshot.png",
				version: "69"
    	}]
    	console.log(this.formDateTable.tableData)
//    findMerchantsByPage({
//      pageNumber: this.paginationDate.currentPage,
//      pageSize: this.paginationDate.pageSize
//    }).then(res => {
//      this.formDateTable.loading = false;
//      if (res.code == 200000) {
//        this.formDateTable.tableData =
//          res.data.pageData !== null ? res.data.pageData : [];
//        this.paginationDate.totalNumber = parseInt(res.data.totalItems);
//      } else {
//        getMessageBox(res.msg);
//      }
//    });
    },
    //停用启用
    selfUseStateChange(row) {
      let toState = row.state == 1 ? 0 : 1;
      enableOrDisable({
        id: row.id,
        state: toState
      }).then(res => {
        this.lodingState = false;
        if (res.code == 200000) {
          this.getGoodsList();
          getMessageBox("修改成功");
        } else {
          getMessageBox(res.msg);
        }
      });
    },

    //状态
    selftate(row, column) {
      let resultState = "";
      switch (row.state) {
        case 0:
          resultState = "无效";
          break;
        case 1:
          resultState = "有效";
          break;
      }
      return resultState;
    },

    //创建商户号/修改--显示弹窗
    toAddMoFangMerchant(row, type = "edit") {
      // type 为’add'是为新增，edit为编辑
      this.formDataDialog = {
        title: type != "add" ? "编辑版本" : "添加新版本",
        dialogType: "formType",
        dialogWidth: "600px",
        top: "10vh",
        dialogUploadStyle: {
          width: "198px",
          height: "124px",
          overflow: "hidden",
          lineHeight: "1",
          file: ""
        },
        keys: {
          telphone: type != "add" ? row.telphone : "",
          state: type != "add" ? row.state : 2,
          userName: type != "add" ? row.userName : "",
          file: ""
        },
        values: [
          {
            label: "平台",
            valueType: "typeSelect",
            modal: "mainAccount",
            blur: "",
            readOnly: false,
            isShow: true,
            optionLabel: "label",
            optionValue: "value",
            modalOptions: [
              {
                value: "",
                label: "请选择"
              },
              {
                value: "1",
                label: "yishan"
              },
              {
                value: "2",
                label: "公众号"
              },
              {
                value: "3",
                label: "轶善在线"
              },
              {
                value: "4",
                label: "北京市平安加油站"
              }
            ]
          },
          {
            label: "app标识",
            valueType: "typeSelect",
            modal: "mainAccount",
            blur: "",
            readOnly: false,
            isShow: true,
            optionLabel: "label",
            optionValue: "value",
            modalOptions: [
              {
                value: "",
                label: "请选择"
              },
              {
                value: "1",
                label: "yishan"
              },
              {
                value: "2",
                label: "公众号"
              },
              {
                value: "3",
                label: "轶善在线"
              },
              {
                value: "4",
                label: "北京市平安加油站"
              }
            ]
          },
          {
            label: "强制更新",
            valueType: "typeRadio",
            modal: "state",
            blur: "",
            isShow: true,
            radioOptions: [
              {
                optionLabel: "是",
                optionValue: 1
              },
              {
                optionLabel: "否",
                optionValue: 2
              }
            ]
          },
          {
            label: "版本号",
            valueType: "typeInput",
            modal: "telphone",
            blur: "",
            readOnly: false,
            isShow: true,
            valuePlaceHolder: "版本号"
          },
          {
            label: "更新标题",
            valueType: "typeInput",
            modal: "userName",
            blur: "",
            readOnly: false,
            isShow: true,
            valuePlaceHolder: "更新标题"
          },
          {
            label: "更新日志",
            valueType: "typeTextarea",
            modal: "userName",
            blur: "",
            readOnly: false,
            isShow: true,
            valuePlaceHolder: "更新日志"
          },
          {
            label: "下载地址",
            valueType: "typeInput",
            modal: "userName",
            blur: "",
            readOnly: false,
            isShow: true,
            valuePlaceHolder: "下载地址"
          },
          {
            label: "证书文件",
            valueType: "typeUploadFile",
            modal: "file",
            blur: "",
            readOnly: false,
            isShow: true,
            currentFileName: "未选择任何文件",
            uploadFileChange: this.getUploadFile
          }
        ],
        submitHandelList: [
          {
            submitName: "确定",
            submitHandel:
              type != "add"
                ? this.dialogEditMerchantSubmit
                : this.dialogAddMerchantSubmit,
            buttonType: "primary"
          },
          {
            submitName: "取消",
            submitHandel: this.closeDialog,
            buttonType: "default"
          }
        ]
      };
      this.dialogComponentState = true;
    },
    //创建商户号--确定添加
    dialogAddMerchantSubmit() {
      this.closeDialog();
    },
    //修改商户号--确定添加
    dialogEditMerchantSubmit() {
      this.closeDialog();
    },

    // 更改页数
    setCurrentPage(data) {
      this.paginationDate.currentPage = data;
      this.getGoodsList();
    },
    // 更改每页显示条数
    setPageSize(data) {
      this.paginationDate.pageSize = data;
      this.getGoodsList();
    },
    // 公用dialog组件事件
    closeDialog() {
      this.dialogComponentState = false;
      this.$refs.dialogCommon.closeDialog();
    },
    updateDialogState(data) {
      this.dialogComponentState = data;
    },
		cellClick(row, column, cell){
			console.log(row)
		},
    // 公用dialog组件事件-end

    // 公用dialog--当前上传文件
    getUploadFile(file) {
      this.formDataDialog.keys.file = file;
      this.formDataDialog.values.filter(ele => {
        return ele.modal == "file";
      })[0].currentFileName = file.name;
    }
  }
};
</script>

<style lang="less" scoped>
	.common_detail_wrap{
		/deep/ .table-wrap{
			.tb-style:nth-child(1){
				color: red;
			}
		}
	}
</style>
