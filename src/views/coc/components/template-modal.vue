<template>
	<div class="tamplate-modal">
		<a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
			<template #title>
				<span>{{ ModalTitle }}</span>
			</template>
			<!-- 动态插槽 -->
			<template #footer>
				<a-button @click="handleCancel" v-if="!formdisabled">
					{{ $t("coc.coc_btn_cancel") }}
				</a-button>
				<a-button type="primary" @click="handleOk">
					{{ $t("coc.coc_btn_comfirm") }}
				</a-button>
			</template>
			<!-- 内容form表单 -->
			<a-form
				:form="form"
				:layout="formLayout"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
			>
				<a-form-item :label="$t('coc.coc_lable_name')">
					<a-input
						v-model:value="form.name"
						:disabled="formdisabled"
						:placeholder="$t('coc.coc_placeholder_name')"
					/>
				</a-form-item>
				<a-form-item :label="$t('coc.coc_lable_version')">
					<a-input
						v-model:value="form.version_number"
						:disabled="formdisabled"
						:placeholder="$t('coc.coc_placeholder_version')"
					/>
				</a-form-item>
				<a-form-item
					:label="$t('coc.coc_lable_validity_date')"
					:label-col="labelCol"
				>
					<a-range-picker
						:show-time="{ format: 'HH:mm:ss' }"
						v-model:value="coc_validity_date"
						:disabled="formdisabled"
						format="YYYY-MM-DD HH:mm:ss"
						:placeholder="[$t('coc.coc_start_date'), $t('coc.coc_start_date')]"
					/>
				</a-form-item>
				<a-form-item :label="$t('coc.coc_lable_apply_vehicle')">
					<!-- select -->
					<a-select
						v-model:value="form.model"
						mode="multiple"
						showArrow
						:disabled="formdisabled"
						:placeholder="$t('coc.coc_placeholder_apply_vehicle')"
					>
						<a-select-option
							v-for="(item, index) in option"
							:key="index"
							:value="item"
						>
							{{ item }}
						</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :label="$t('coc.coc_lable_template')">
					<!-- 上传组件 正方形带+ -->
					<a-upload
						:multiple="true"
						v-model:file-list="fileList"
						list-type="picture-card"
						:disabled="formdisabled"
						action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
						:show-upload-list="false"
						:before-upload="beforeUpload"
						@change="handleChange"
					>
						<img v-if="imageUrl" :src="imageUrl" alt="avatar" />
						<div v-else>
							<loading-outlined v-if="loading"></loading-outlined>
							<plus-outlined v-else></plus-outlined>
							<div class="ant-upload-text">
								{{ $t("coc.coc_placeholder_upload") }}
							</div>
						</div>
					</a-upload>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, toRefs, watch ,useAttrs } from "vue"
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue"
const { ctx } = getCurrentInstance()
const { $t, $message } = ctx.$root
import Core from "@/core"
const { Api, Util } = Core
// 查询接口
const { viewCocTemplate, getCateGoryList, addCocTemplate } = Api.COC
// 穿透给父元素的方法
const attrs = useAttrs()
const { onGetTableData } = attrs
console.log("attrs: ", onGetTableData)

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	ModalTitle: {
		type: String,
		default: "",
	},
	openType: {
		type: String,
		default: "",
	},
	rowId: {
		type: Number,
		default: null,
	}
})
const $emit = defineEmits(["update:visible", "update:form"])
// form表单
const form = ref({
	name: "",
	version_number: "",
	model: [],
})
const coc_validity_date = ref([])
const option = ref([])
let formdisabled = ref(false)
// form布局
const formLayout = ref("horizontal")
const labelCol = ref({ style: { width: "100px" } })
const wrapperCol = ref({ span: 16 })
// 上传组件
const fileList = ref([])
const loading = ref(false)
const imageUrl = ref("")

onMounted(() => {
	getCateGory()
})

watch(
	[() => props.visible, () => props.openType, () => props.rowId],
	(newVal, oldVal) => {
		if (newVal[0]) {
			switch (newVal[1]) {
				case "add":
					formdisabled.value = false
					resetData()
					break
				case "detail":
					formdisabled.value = true
					getDetail(newVal[2])
					break
				case "edit":
					formdisabled.value = false
					getDetail(newVal[2])
					break
			}
		}
	},
	{
		deep: true,
	}
)

const resetData = () => {
	form.value = {
		name: "",
		version_number: "",
		model: [],
	}
	fileList.value = []
	coc_validity_date.value = []
}

const getDetail = async (id) => {
	const res = await viewCocTemplate({ id })
	resetData()
	form.value = res
	form.value.model = res.model.split(",")
	// antdesign的日期组件需要传入moment对象
	// 时间戳转moment对象 案例：1655366541 => 2022-02-15 10:42:21
	// moment对象转时间戳 案例：moment("2022-02-15 10:42:21").valueOf() => 1655366541000
	// moment对象转时间戳 案例：moment("2022-02-15 10:42:21").unix() => 1655366541
	// 时间戳转moment对象 案例：moment.unix(1655366541) => 2022-02-15 10:42:21
	if (res.effective_start_time && res.effective_end_time) {
		coc_validity_date.value = [
			Util.momentFilter(res.effective_start_time),
			Util.momentFilter(res.effective_end_time),
		]
	} else {
		coc_validity_date.value = []
	}
}
const addTemplate = async (searchForm) => {
	addCocTemplate(searchForm).then(res => { 
		if (props.openType === "add") { 
			$message.success($t("coc.coc_add_success"))
		} else { 
			$message.success($t("coc.coc_edit_success"))
		}
		$emit("update:visible", false)
		// 重置表单
		resetData()
		// 刷新列表
		onGetTableData()
	})
}

// 获取下拉框数据
const getCateGory = async () => {
	const res = await getCateGoryList()
	option.value = res
}
// 上传组件
const beforeUpload = (file) => {
	console.log("beforeUpload: ", file)
}

const handleChange = (info) => {
	console.log("handleChange: ", info)
}

// modal
const handleOk = () => {
	const { openType } = toRefs(props)
		let reqForm = Util.deepCopy(form.value)
		reqForm.model = reqForm.model.join(",")
		reqForm.effective_start_time = coc_validity_date.value[0].unix()
		reqForm.effective_end_time = coc_validity_date.value[1].unix()
	if (openType.value === "add") {
		// 新增
		addTemplate(reqForm)
	} else if (openType.value === "edit") {
		addTemplate(reqForm)
		// 编辑
	} else if (openType.value === "detail") {
		// 查看
		$emit("update:visible", false)
	}
}
const handleCancel = () => {
	$emit("update:visible", false)
	// 重置表单
	resetData()
}
</script>

<style lang="less" scoped>
:deep(.ant-form-item-label) {
	label {
		display: inline-flex;
		white-space: normal;
		height: 100%;
		margin-right: 8px;
		// 与右侧内容对齐
		align-items: center;
	}
}
</style>
