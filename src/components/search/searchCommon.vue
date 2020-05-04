<template>
  <div class="search-form-common" :class="{'search-opend':openSearch}">
    <el-form :model="searchForm" :label-width="labelWidth" :label-position="labelPosition" class="demo-ruleForm">
      <el-row :gutter="0">
        <el-col :xs="inputBoxSize.xs" :sm="inputBoxSize.sm" :md="inputBoxSize.md" :lg="inputBoxSize.lg"
                :xl="inputBoxSize.xl">
          <el-col :span="24">
            <el-col v-for="(item,index) in searchForm.values" :xs="inputSize.xs" :sm="inputSize.sm" :md="inputSize.md"
                    :lg="inputSize.lg" :key="index"
                    v-show="item.isShow">
              <el-form-item :label="item.valueLable">
                <!--input-->
                <el-col :span="20" v-if="item.type==='input'">
                  <el-input v-model="searchForm.keys[item.modal]" :placeholder="item.valuePlaceholder"></el-input>
                </el-col>
                <!--date-picker-->
                <el-col :span="23" v-else-if="item.type==='date-range'">
                  <el-date-picker
                    v-model="searchForm.keys[item.modal]"
                    type="datetimerange"
                    range-separator="-"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :start-placeholder="item.startPlaceHolder"
                    :end-placeholder="item.endPlaceHolder">
                  </el-date-picker>
                </el-col>
                <!--select-->
                <el-col :span="18" v-else-if="item.type==='select'">
                  <el-select v-model="searchForm.keys[item.modal]" :placeholder="item.valuePlaceholder" clearable>
                    <el-option
                      v-for="selectItem in item.selectValues"
                      :key="selectItem.label"
                      :label="selectItem.label"
                      :value="selectItem.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-col>
        </el-col>

        <el-col :xs="btnToolSize.xs" :sm="btnToolSize.sm" :md="btnToolSize.md" :lg="btnToolSize.lg"
                :xl="btnToolSize.xl">
          <el-row :class="[{'button-left':buttnAlign=='left'},{'button-right':buttnAlign=='right'}]">
            <el-button v-for="(item,index) in searchForm.submitHandelList" :type="item.buttonType"
                       @click="item.submitHandel" :key="index">{{item.submitName}}
            </el-button>
            <el-button v-if="isOpenSearchList" type="slide"
                       @click="openSearchList">
              {{openSearchTxt}}
              <i :class="['el-icon--right',openSearch ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
            </el-button>
          </el-row>
        </el-col>

      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "searchCommon",
    data() {
      return {
        inputBoxSize: {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 17,
          xl: 17,
        },
        btnToolSize: {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 7,
          xl: 7,
        },
        inputSize: {
          xs: 24,
          sm: 24,
          md: 12,
          lg: 8,
          xl: 8,
        },
        labelWidth: '100px',
        labelPosition: 'left',
        buttnAlign: 'right',
        isExportExl: false,
        isOpenSearchList: false,
        openSearch: false,
        openSearchTxt: '展开',
      }
    },
    props: {
      searchForm: {
        type: Object,
        default: {},
      }
    },
    watch: {
      searchForm: {
        handler(newValue, oldValue) {
          this.isOpenSearchList = typeof (newValue.defaultHandel) !== "undefined" && newValue.defaultHandel.isOpenSearchList ? newValue.defaultHandel.isOpenSearchList : false;
        },
        deep: true
      }
    },
    created() {
      //设置默认值
      this.labelPosition = typeof (this.searchForm.styles) !== "undefined" && this.searchForm.styles.labelPosition ? this.searchForm.styles.labelPosition : 'left';
      this.labelWidth = typeof (this.searchForm.styles) !== "undefined" && this.searchForm.styles.labelWidth ? this.searchForm.styles.labelWidth : '100px';
      this.isOpenSearchList = typeof (this.searchForm.defaultHandel) !== "undefined" && this.searchForm.defaultHandel.isOpenSearchList ? this.searchForm.defaultHandel.isOpenSearchList : false;
    },
    methods: {
      //展开列表
      openSearchList() {
        if (!this.openSearch) {
          //展开
          this.searchForm.values.forEach((value, key) => {
            value.isShow = true;
          });

          this.inputBoxSize = {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 24,
            xl: 24,
          };
          this.btnToolSize = {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 24,
            xl: 24,
          };
          this.inputSize = {
            xs: 24,
            sm: 24,
            md: 12,
            lg: 6,
            xl: 6,
          };
          this.buttnAlign = 'left';
          this.openSearchTxt = '收起';
          this.openSearch = true;

        } else {
          this.searchForm.values.forEach((value, key) => {
            if (key < 3) {
              value.isShow = true;
            } else {
              value.isShow = false;
              //收起清空收起项中的参数
              this.searchForm.keys[value.modal] = '';
            }
          });

          this.inputBoxSize = {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 17,
            xl: 17,
          };
          this.btnToolSize = {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 7,
            xl: 7,
          };
          this.inputSize = {
            xs: 24,
            sm: 24,
            md: 12,
            lg: 8,
            xl: 8,
          };
          this.buttnAlign = 'right';
          this.openSearchTxt = '展开';
          this.openSearch = false;
        }
      },

    },
  }
</script>

<style lang="less">

  .search-form-common {
    width: 98%;
    background: #fff;
    padding: 22px 1% 0;
    border-radius: 4px;


    .el-date-editor{
      .el-range__icon{
        line-height: 28px;
      }
      .el-range__close-icon{
        line-height: 28px;
      }
    }

    .search-opend {
      padding-bottom: 22px;
    }

    .el-form-item__label{
      height: 36px;
      line-height: 36px;
    }
    .el-input{
      height: 36px;
      line-height: 36px;

      .el-input__inner{
        height: 36px;
        line-height: 36px;
      }
      .el-input__icon{
        line-height: 36px;
      }
    }
    .el-button{
      padding:9px 28px;
      font-size: 12px;
      font-family: PingFangMedia;
    }
    .el-button.el-button--slide{
      border: none;
      background: none;
      padding:0 20px;
    }
    .el-button.el-button--slide:hover{
      background: none;
    }

    .button-right {
      text-align: right;
    }

    .button-left {
      text-align: left;
    }
    .el-select{
      width: 100%;
    }
    .el-date-editor--datetimerange {
      width: auto !important;
      font-size: 12px;
    }
    .el-range-editor.el-input__inner{
      height: 36px;
      line-height: 36px;
    }

    .el-select-dropdown__list {
      padding: 6px 10px !important;
    }
  }
</style>
