<template>
    <div class="edit-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t("i.edit") }}
            </div>
        </div>
        
        <a-form
            ref="formRef"
            name="custom-validation"
            :model="formState"
            :rules="rules"
            v-bind="layout"
            @finish="handleFinish"
            @validate="handleValidate"
            @finishFailed="handleFinishFailed"
        >
            <div class="form-block">
                <div class="form-title">
                    <div class="title">{{ $t("supply_chain.contact") }}</div>
                </div>
                <div class="form-content">
                    <div class="form-item">
                        <div class="key">{{ $t("supply_chain.type_supply") }}</div>
                        <div class="value">
                            <a-radio-group
                                v-model:value="specific"
                            >
                                <a-radio :value="1">{{ $t("i.single") }}</a-radio>
                                <a-radio :value="2">{{ $t("i.multiple") }}</a-radio>
                            </a-radio-group>
                            
                        </div>
                    </div>
                </div>
            </div>

            
            <div class="form-block">
                <!-- 基本信息 -->
                <div class="form-title">
                    <div class="title">{{ $t("n.information") }}</div>
                </div>
                <div class="form-content">
                    <!-- 名称  v-if="this.specific.mode === 1"-->
                    <div class="form-item required">
                        <div
                            class="key"
                        >
                            {{ $t("n.name") }}
                        </div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                :maxlength="50"
                            />
                        </div>
                    </div>
                    <!-- 英文名 v-if="this.specific.mode === 1" -->
                    <div class="form-item required">
                        <div
                            class="key"
                        >
                            {{ $t("n.name_en") }}
                        </div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                :maxlength="50"
                            />
                        </div>
                    </div>
                    <!-- 颜色 -->
                    <div class="form-item">
                        <div class="key">{{ $t("d.color") }}</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                            />
                        </div>
                    </div>
                    <!-- 颜色英文 -->
                    <div class="form-item">
                        <div class="key">{{ $t("d.color_en") }}</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-block">
                <div class="form-title">
                    <div  class="title">
                        联系方式
                    </div>

                </div>
                <div class="form-content">
                    <div class="form-item">
                        <div class="key">{{ $t("i.mode") }}</div>
                        <div class="value" >
                            <a-form-item has-feedback name="pass">
                                <a-input v-model:value="formState.pass" type="password" autocomplete="off" />
                            </a-form-item>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t("i.mode") }}</div>
                        <div class="value" style="background-color: aliceblue;">
                            <a-form-item has-feedback name="pass">
                                <a-input v-model:value="formState.pass" type="password" autocomplete="off" />
                            </a-form-item>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t("i.mode") }}</div>
                        <div class="value" >
                            <a-form-item has-feedback  name="checkPass">
                                <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" />
                            </a-form-item>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t("i.mode") }}</div>
                        <div class="value" >
                            <a-form-item has-feedback  name="age">
                                <a-input-number v-model:value="formState.age" />
                            </a-form-item>
                        </div>
                    </div>
                    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                        <a-button type="primary" html-type="submit">Submit</a-button>
                        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
                    </a-form-item>

                </div>
            </div>
        </a-form>
    </div>
  </template>
  <script>
  import { defineComponent, reactive, ref } from 'vue';
  export default defineComponent({
    setup() {
      const formRef = ref();
      const formState = reactive({
        pass: '',
        checkPass: '',
        age: undefined,
      });
      const specific = ref(1)
      let checkAge = async (_rule, value) => {
        if (!value) {
          return Promise.reject('Please input the age');
        }
        if (!Number.isInteger(value)) {
          return Promise.reject('Please input digits');
        } else {
          if (value < 18) {
            return Promise.reject('Age must be greater than 18');
          } else {
            return Promise.resolve();
          }
        }
      };
      let validatePass = async (_rule, value) => {
        if (value === '') {
          return Promise.reject('Please input the password');
        } else {
          if (formState.checkPass !== '') {
            formRef.value.validateFields('checkPass');
          }
          return Promise.resolve();
        }
      };
      let validatePass2 = async (_rule, value) => {
        if (value === '') {
          return Promise.reject('Please input the password again');
        } else if (value !== formState.pass) {
          return Promise.reject("Two inputs don't match!");
        } else {
          return Promise.resolve();
        }
      };
      const rules = {
        pass: [{
          required: true,
          validator: validatePass,
          trigger: 'change',
        }],
        checkPass: [{
          validator: validatePass2,
          trigger: 'change',
        }],
        age: [{
          validator: checkAge,
          trigger: 'change',
        }],
      };
      const layout = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 14,
        },
      };
      const handleFinish = values => {
        console.log(values, formState);
      };
      const handleFinishFailed = errors => {
        console.log(errors);
      };
      const resetForm = () => {
        formRef.value.resetFields();
      };
      const handleValidate = (...args) => {
        console.log(args);
      };
      return {
        formState,
        formRef,
        rules,
        layout,
        handleFinishFailed,
        handleFinish,
        resetForm,
        handleValidate,
        specific
      };
    },
  });
  </script>
  <style lang="less" scoped>
      .ant-form-item {
          margin-bottom: 0px;
      }

      :deep(.ant-form-item-control) {
          max-width: 100% !important;
      }
  </style>