<template>
    <div class="RepairInvoice">
        <div class="top">
            <div class="top-dis">
                <a-descriptions title="User Info" layout="vertical">
                    <a-descriptions-item label="UserName">Zhou Maomao</a-descriptions-item>
                    <a-descriptions-item label="Telephone">1810000000</a-descriptions-item>
                    <a-descriptions-item label="Live">Hangzhou, Zhejiang</a-descriptions-item>
                    <a-descriptions-item label="Address" span="2">
                    No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                    </a-descriptions-item>
                    <a-descriptions-item label="Remark">empty</a-descriptions-item>
                </a-descriptions>
            </div>
            <div class="middle-dis">

            </div>
            <div class="bottom-table">

            </div>
        </div>
        <div class="bottom"></div>
    </div>
</template>
<script lang="ts">
import { Dayjs } from 'dayjs';
import { defineComponent, reactive, ref, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';

interface FormState {
  name: string;
  region: string | undefined;
  date1: Dayjs | undefined;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}
export default defineComponent({
  setup() {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      name: '',
      region: undefined,
      date1: undefined,
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    });
    const rules = {
      name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
      ],
      region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
      date1: [{ required: true, message: 'Please pick a date', trigger: 'change', type: 'object' }],
      type: [
        {
          type: 'array',
          required: true,
          message: 'Please select at least one activity type',
          trigger: 'change',
        },
      ],
      resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
      desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          console.log('values', formState, toRaw(formState));
        })
        .catch(error => {
          console.log('error', error);
        });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    return {
      formRef,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      formState,
      rules,
      onSubmit,
      resetForm,
    };
  },
});
</script>
<style lang="less" scoped>
#RepairInvoice {
    .ant-collapse-content-box {
        padding: 0px;
    }
    .gray-panel.info {
        .left {
            font-size: 12px;
            color: #465670;
            span {
                color: #A5ACB8;
            }
        }
        .right {
            .fcc();
            font-size: 12px;
            .staff {
                color: rgba(0, 0, 0, 0.85);
                margin-right: 12px;
                font-weight: 500;
            }
            .status {
                .fcc();
                .i_point {
                    margin-right: 6px;
                }
            }
        }
        .panel-content {
            .fsb(flex-start);
            padding-bottom: 15px;
        }
        .info-item {
            flex: 1;
            font-size: 12px;
            .key {
                color: #8090A6;
            }
            .value {
                margin-top: 10px;
                color: #363D42;
            }
        }
    }
    .steps-container {
        margin: 20px;
    }
}
</style>
