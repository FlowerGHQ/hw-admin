<template>
    <div ref="wrap">
        <a-modal
            v-model:visible="visible"
            :title="$t('item-bom.import_category_data')"
            :okText="$t('item-bom.confirm')"
            :cancelText="$t('item-bom.cancel')"
            @ok="handleOk"
            centered
            :closable="false"
            class="export-modal"
            @cancel="visible = false"
            :getContainer="() => wrap">
            <div class="main">
                <div class="title">{{$t('item-bom.change_version_number')}}：0002</div>
                <div class="success-tips">
                    <div class="success-icon">
						<img src="../../../../assets/images/bom/完成.png" alt="">
                    </div>
                    <div class="success-text">{{ $t('item-bom.parsing_completion') }}</div>
                    <div class="success-or-fail">
                        {{ $t('item-bom.parsing_success') }}
                        <span class="success-txt">32</span>
                        {{$t('item-bom.strip')}} {{$t('item-bom.data')}}， {{$t('item-bom.failure')}}
                        <span class="fail-txt">2</span>
						{{$t('item-bom.strip')}}
                    </div>
                </div>
                <div class="tips">
                    {{ $t('item-bom.import_failure_data') }}
                </div>
                <div class="table">
                    <a-table
                        :columns="tableColumns"
                        :data-source="tableData"
						bordered
						:pagination="false"
                        :scroll="{ x: true }">
                    </a-table>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref ,computed} from "vue";
import { useI18n } from "vue-i18n";
const $t = useI18n().t;
const visible = ref(true);
const wrap = ref(null);
const tableColumns = computed(()=>{
	const result = [
        { 
            title: $t('item-bom.category'), 
            dataIndex: "category", 
            key: "category",
			align:'center',
			width:160
		},
        { 
            title: $t('item-bom.parsing_success_number'), 
            dataIndex: "parsing_success_number", 
            key: "parsing_success_number",
			align:'center'
        },
        { 
            title: $t('item-bom.parsing_failure_number'), 
            dataIndex: "parsing_failure_number", 
            key: "parsing_failure_number",
			align:'center'
        },
    ]
    return result
})
const tableData = ref([
	{
		id:0,
		category:'前叉组',
		parsing_success_number:14,
		parsing_failure_number:0
	},
	{
		id:1,
		category:'电机组',
		parsing_success_number:13,
		parsing_failure_number:2
	},
	{
		id:2,
		category:'其他组二',
		parsing_success_number:13,
		parsing_failure_number:0
	},
	{
		id:3,
		category:'其他组二',
		parsing_success_number:13,
		parsing_failure_number:0
	},
	{
		id:4,
		category:'其他组二',
		parsing_success_number:14,
		parsing_failure_number:0
	}
])

</script>

<style lang="less" scoped>
:deep(.export-modal) {
    .ant-modal-content {
        border-radius: 4px;
        .ant-modal-header {
            padding: 16px 24px;
            height: auto !important;
            border-color: #e2e2e2;
            .ant-modal-title {
                color: #1d2129;
                font-weight: 600;
                font-size: 16px;
                line-height: 1;
            }
        }
        .ant-modal-footer {
            text-align: center;
            .ant-btn {
                min-width: 60px;
                border-radius: 4px;
            }
        }
        .ant-modal-body {
            padding: 24px;
			.main{
				.title{
					width: 146px;
					height: 32px;
					padding: 6px 18px 6px 10px;
					color: #1D2129;
					font-weight: 500;
					background-color: #F2F3F5;
					border-radius: 4px;
					margin-bottom: 18px;
				}
				.success-tips{
					display: flex;
					align-items: center;
					margin-bottom: 4px;
					.success-icon{
						width: 16px;
						height: 16px;
						line-height: 1;
						margin-right: 4px;
						img{
							width: 100%;
							height: 100%;
						}
					}
					.success-text{
						color: #26AB54;
						margin-right: 4px;
					}
					.success-or-fail{
						.success-txt{
							color: #26AB54;
						}
						.fail-txt{
							color: #F53F3F;
						}
					}
				}
				.tips{
					margin-bottom: 11px;
					background-color: #F8F8F8;
					padding-top: 4px;
					padding-bottom: 3px;
					padding-left: 7px;
					color:  #666;
				}
				.table{
					border-radius: 4px;
					.ant-table-thead ,
					.ant-table-container,
					tr,
					th {
						border-color: #e2e2e2 !important;
					}
				}
			}

        }
    }
}
</style>
