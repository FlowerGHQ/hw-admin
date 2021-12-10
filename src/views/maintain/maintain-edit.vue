<template>
  <div id="MaintainEdit">
    <div class="borderStyle">
      <div class="header">新建工单</div>
      <div class="body">
        <div class="form">
          <div class="contentTitle">工单内容</div>
          <a-form :model="form" :label-col="15" :wrapper-col="12" class="formContent">
            <a-form-item label="工单分类" :colon="false" required class="typeLabel">
              <a-radio-group v-model:value="form.type">
                <a-radio :value="1" class="formRadio">维修工单</a-radio>
                <a-radio :value="2" class="formRadio">特批工单</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="工单名称"  :colon="false" required class="typeLabel">
              <a-input v-model:value="form.name" placeholder="最多输入100字符" class="boxOne"/>
            </a-form-item>

            <a-form-item label="问题描述" :colon="false" required class="typeLabel">
              <a-textarea v-model:value="form.desc" :rows="5"  placeholder="请输入内容" class="boxtwo"/>
            </a-form-item>
          </a-form>
        </div>
        <div class="form">
          <div class="contentTitle">车主信息</div>
          <a-form :model="form" :label-col="15" :wrapper-col="12" class="formContent">
            <a-form-item label="维修方式"  :colon="false" required class="typeLabel">
              <a-radio-group v-model:value="form.channel">
                <a-radio :value="1" class="formRadio">上门</a-radio>
                <a-radio :value="2" class="formRadio">到店</a-radio>
                <a-radio :value="3" class="formRadio">寄修</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="产品类型"  :colon="false" required class="typeLabel">
              <a-radio-group v-model:value="form.item_type">
                <a-radio :value="1" class="formRadio">车辆</a-radio>
                <a-radio :value="2" class="formRadio">电池</a-radio>
                <a-radio :value="3" class="formRadio">其他零部件</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="维修类别" :colon="false" required class="typeLabel">
              <a-radio-group v-model:value="form.repair_method">
                <a-radio :value="1" class="formRadio">维修</a-radio>
                <a-radio :value="2" class="formRadio">保养</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="车辆编号" :colon="false" required class="typeLabel">
              <a-input v-model:value="form.vehicle_code" placeholder="请输入车辆编号" class="boxOne"/>
            </a-form-item>
          </a-form>
        </div>
      </div>


      <div class="formBtns">
        <a-button type="primary" class="formBtnYes" @click="save">提交</a-button>
        <a-button class="formBtnNo">取消</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Core from '../../core';
export default {
  name: 'MaintainEdit',
  components: {},
  props: {},
  data() {
    return {
      form: {
        type: 0,
        name: '',
        desc: '',
        channel: 0,
        item_type: 0,
        repair_method: 0,
        vehicle_code: ''
      }
    };
  },
  watch: {},
  computed: {},
  mounted() {
  },
  methods: {
    save() {
        var form = this.form
        Core.Api.Repair.save({
            ...form,

        }).then(
            
        )
    }
  }
};

</script>

<style lang="less" scoped>

#MaintainEdit {

  .borderStyle {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color:#FFFFFF;


    .header {
      font-weight: 500;
      font-size: 18px;
      line-height: 25px;
    }

    .body {
      margin-top: 26px;
      display: flex;
      flex-direction: column;

      .form {
        display: flex;
        flex-direction: row;

        .contentTitle {
          margin-left: 142px;
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          width: 118px;
        }
      }

    }
    .formBtns {
      border-top:1px solid #EDF1F4;
      display:flex;
      margin-left: 268px;
      padding-top:19.5px;
      .formBtnYes{
        background: #006EF9;
        border-radius: 2px;
        width: 100px;
        heigth: 32px;
      }
      .formBtnNo{
        font-size: 14px;
        color:#006EF9;
        line-height: 20px;
        width: 100px;
        heigth: 32px;
        border: 1px solid #006EF9;
      }
    }

  }
}

</style>

<style lang="less">
#MaintainEdit {
  .body {
    .form {
      .contentTitle {
      }

      .formContent {
        .typeLabel {
          .ant-form-item-required {
            font-size: 12px;
            color: #8090A6;
            margin: -8px 26px 0px 0px;
          }

          .ant-radio-wrapper {
            font-size: 12px;
            color: #363D42;

            .ant-radio, ant-radio-checked {
              margin-top: -2px;
            }

            span {
              margin-top: -12px;
            }


          }

          .boxOne {
            background: #FFFFFF;
            border: 1px solid #E5E8EB;
            //box-sizing: border-box;
            border-radius: 3px;
            width: 420px;
            heigth: 36px;
          }
        }
      }
    }
  }
}
</style>