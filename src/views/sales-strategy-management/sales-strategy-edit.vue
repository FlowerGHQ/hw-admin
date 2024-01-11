<template>
    <div class="sales-strategy-edit">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">销售策略</div>
            </div>
            <div class="search-container">
                <a-form
                    ref="formRef"
                    name="custom-validation"
                    :model="formState"
                    :rules="rules">
					<!-- 策略名称 -->
					<a-row :gutter="24">
						<a-col :span="8">
							<a-form-item has-feedback label="策略名称" name="salesName">
								<a-input
									v-model:value="formState.name"
									allowClear
									showCount
									:placeholder="$t('def.input')"
									:maxlength="100"
								/>
                    		</a-form-item>
						</a-col>
					</a-row>
					<!-- 适用商品 -->
					<a-row :gutter="24">
						<a-col :span="8">
							<a-form-item has-feedback label="适用商品" name="shops">
								<!-- 选择商品的按钮 -->
								<a-button type="primary" @click="showModal">
									选择商品
								</a-button>
							</a-form-item>
						</a-col>
					</a-row>
					<!-- 策略类型 -->
					<a-row :gutter="24">
						<a-col :span="8">
							<a-form-item has-feedback label="策略类型" name="strategyType">
								<a-select
									v-model:value="formState.strategyType"
									:placeholder="$t('def.select')"
									:options="strategyTypeOptions"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<!-- 赠送规则 -->
					<a-row :gutter="24">
						<a-col :span="8">
							<a-form-item has-feedback label="赠送规则" name="giftRules">
								<div class="gift-rules-first">
									<span>起送门槛</span>
									<a-input-number 
										v-model:value="formState.number" 
										:placeholder="$t('def.p_set')"
										:min="1"
									/>
									<span class="unit">
										辆
									</span>
									<span>
										每满
									</span>
									<a-input-number 
										v-model:value="formState.number" 
										:placeholder="$t('def.p_set')"
										:min="1"
									/>
									<span class="unit">
										辆
									</span>
									<span>
										送
									</span>
									<a-input-number 
										v-model:value="formState.number" 
										:placeholder="$t('def.p_set')"
										:min="1"
									/>
								</div>
								<div class="gift-rules-second">

								</div>
							</a-form-item>
						</a-col>
					</a-row>
                </a-form>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="(record) => record.id"
                    :pagination="false">
                    <template #bodyCell="{ column, text, record, index }">
                        <!-- 
                            序号的计算方式:当前的页数-1*每页的条数+当前的索引+1
                         -->
                        <template v-if="column.dataIndex === 'serial_number'">
                            {{
                                (pagination.current - 1) * pagination.size +
                                index +
                                1
                            }}
                        </template>
                        <!-- 策略名称 -->
                        <template v-if="column.dataIndex === 'strategy_name'">
                            <!-- 超过5个字符 -->
                            <div
                                class="strategy_name-cell"
                                v-if="text.length > 5">
                                <a-tooltip placement="topLeft" :title="text">
                                    {{ text }}
                                </a-tooltip>
                            </div>
                            <div class="strategy_name-cell-common" v-else>
                                {{ text }}
                            </div>
                        </template>
                        <!-- 地区赠品 -->
                        <template v-if="column.dataIndex === 'area_and_gift'">
                            <!-- 超过5个字符 -->
                            <div
                                class="strategy_name-cell-wrap"
                                v-if="text.length > 20">
                                <a-tooltip placement="topLeft" :title="text">
                                    {{ text }}
                                </a-tooltip>
                            </div>
                            <div class="strategy_name-cell-common" v-else>
                                {{ text }}
                            </div>
                        </template>
                        <!-- 操作 -->
                        <template v-if="column.dataIndex === 'operation'">
                            <!-- 启用 -->
                            <a-button type="link">{{
                                $t("sales-strategy-management.enable")
                            }}</a-button>
                            <!-- 删除 -->
                            <a-button type="link">{{
                                $t("sales-strategy-management.delete")
                            }}</a-button>
                            <!-- 查看编辑 -->
                            <a-button type="link">{{
                                $t("sales-strategy-management.view_and_edit")
                            }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from "../../core";
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
// 使用useTable
import { useTable } from "@/hooks/useTable";
import { useI18n } from "vue-i18n";
const $t = useI18n().t;
const $i18n = useI18n();
const formState = reactive({
    number:null
});
const strategyTypeOptions = ref([
	{
		label: "每满送",
		value: "1",
	},
	{
		label: "整单送",
		value: "2",
	},
]);
const request = () =>
    new Promise((resolve, reject) => {
        let arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push({
                id: 1,
                serial_number: 1,
                strategy_name:
                    "测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1",
                type: "整车",
                gift_rule: "测试1",
                area_and_gift:
                    "【美国】说明书（45435435454）、充电线（werwerwer）、充电器（werwerwer）、充电头（werwerwer）",
                creation_time: "2021-08-09 10:00:00",
                effective_status: "有效",
            });
        }
        setTimeout(() => {
            resolve({
                count: 10,
                list: arr,
            });
        }, 1000);
    });

const {
    loading,
    tableData,
    pagination,
    search,
    onSizeChange,
    refreshTable,
    onPageChange,
    searchParam,
} = useTable({ request });

const tableColumns = computed(() => {
    let columns = [
        {
            title: $t("sales-strategy-management.serial_number"),
            dataIndex: "serial_number",
            width: 80,
            fixed: "left",
            align: "center",
        },
        {
            title: $t("sales-strategy-management.strategy_name"),
            dataIndex: "strategy_name",
            key: "strategy_name",
        },
        {
            title: $t("sales-strategy-management.type"),
            dataIndex: "type",
            key: "type",
        },
        {
            title: $t("sales-strategy-management.gift_rule"),
            dataIndex: "gift_rule",
            key: "gift_rule",
        },
        {
            title: $t("sales-strategy-management.area_and_gift"),
            dataIndex: "area_and_gift",
            key: "area_and_gift",
        },
        {
            title: $t("sales-strategy-management.creation_time"),
            dataIndex: "creation_time",
            key: "creation_time",
        },
        {
            title: $t("sales-strategy-management.area_and_gift"),
            dataIndex: "effective_status",
            key: "effective_status",
        },
        {
            title: $t("sales-strategy-management.operation"),
            dataIndex: "operation",
            key: "operation",
            fixed: "right",
            width: 200,
        },
    ];
    return columns;
});
</script>

<style lang="less" scoped>
.sales-strategy-edit {
	.search-container{
		.ant-form {
			flex: 1;
			.ant-row{
				
			}
		}
	}
}
</style>
