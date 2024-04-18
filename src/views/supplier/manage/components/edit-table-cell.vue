<template>
    <div class="edit-cell" v-if="type === 'input'">
        <div class="editable-cell-input-wrapper" v-if="isEditable">
            <a-input
                v-model:value="showData"
                :maxlength="maxLength"
                showCount
                :required="required"
                :rules="rules"
                ref="inputRef"
            ></a-input>
            <CheckOutlined class="editable-cell-icon-check" @click="tabCellSave()" />
        </div>
        <div class="editable-cell-text-wrapper" v-else>
            <span class="text" v-if="text">
                <a-tooltip placement="topLeft" :title="text">
                    {{ text }}
                </a-tooltip>
            </span>
            <span v-else> - </span>
            <EditOutlined class="editable-cell-icon" @click="tableEdit()" />
        </div>
    </div>
    <!-- input-number -->
    <div class="edit-cell" v-else-if="type === 'input-number'">
        <div class="editable-cell-input-wrapper" v-if="isEditable">
            <a-input-number
                v-model:value="showData"
                :min="minNumber"
                :max="maxNumber"
                :precision="precisionNumber"
            ></a-input-number>
            <CheckOutlined class="editable-cell-icon-check" @click="tabCellSave()" />
        </div>
        <div class="editable-cell-text-wrapper" v-else>
            <span class="text" v-if="text">
                <a-tooltip placement="topLeft" :title="text">
                    {{ text }}
                </a-tooltip>
            </span>
            <span v-else> - </span>
            <EditOutlined class="editable-cell-icon" @click="tableEdit()" />
        </div>
    </div>
    <!-- 分组 -->
    <div class="edit-cell" v-else-if="type === 'select' && !isSort">
        <div class="editable-cell-select-wrapper" v-if="isEditable">
            <a-select v-model:value="showData" :mode="mode" :options="selectOptions" @change="handleSelectChange">
            </a-select>
            <span class="editable-cell-icon-check" @click="tabCellSave()">
                {{ $t('supply-chain.determine') }}
            </span>
        </div>
        <div class="editable-cell-text-wrapper" v-else>
            <span class="text" v-if="filterOption(text)">
                <a-tooltip placement="topLeft" :title="filterOption(text)">
                    {{ filterOption(text) }}
                </a-tooltip>
            </span>
            <span v-else> - </span>
            <span @click="tableEdit()" class="editable-cell-icon"> {{ $t('supply-chain.change') }}</span>
        </div>
    </div>
    <!-- 不分组 -->
    <div class="edit-cell" v-else-if="type === 'select' && isSort">
        <div class="editable-cell-select-wrapper" v-if="isEditable">
            <a-select v-model:value="showData" :mode="mode" @change="handleSelectChange">
                <a-select-opt-group v-for="item in selectOptions">
                    <template #label>
                        <span>{{ item.label }}</span>
                    </template>
                    <a-select-option v-for="child in item.options" :value="child.value">
                        {{ child.label }}
                    </a-select-option>
                </a-select-opt-group>
            </a-select>
            <span class="editable-cell-icon-check" @click="tabCellSave()">
                {{ $t('supply-chain.determine') }}
            </span>
        </div>
        <div class="editable-cell-text-wrapper" v-else>
            <span class="text" v-if="filterOption(text)">
                <a-tooltip placement="topLeft" :title="filterOption(text)">
                    {{ filterOption(text) }}
                </a-tooltip>
            </span>
            <span v-else> - </span>
            <span @click="tableEdit()" class="editable-cell-icon"> {{ $t('supply-chain.change') }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, toRefs, watch } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';

const $t = useI18n().t;
const props = defineProps({
    cellData: {
        type: Object,
        default: () => {},
    },
    type: {
        type: String,
        default: 'input',
    },
    selectOptions: {
        type: Array,
        default: () => [],
    },
    mode: {
        type: String,
        default: '',
    },
    isSort: {
        type: Boolean,
        default: false,
    },
    maxLength: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 0,
    },
    precision: {
        type: Number,
        default: 0,
    },
    min: {
        type: Number,
        default: 0,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    requiredRules: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(['handleCellSave']);

const isEditable = ref(false);
// const { column, text, record, index } = toRefs(props.cellData);
const column = computed(() => props.cellData.column);
const text = computed(() => props.cellData.text);
const record = computed(() => props.cellData.record);
const index = computed(() => props.cellData.index);
const maxNumber = computed(() => props.max);
const precisionNumber = computed(() => props.precision);
const minNumber = computed(() => props.min);

const isRequired = computed(() => {
    return props.isRequired;
});
const requiredRules = computed(() => {
    return props.requiredRules;
});

const inputRef = ref(null);
const showData = ref(undefined);

// methods
const tabCellSave = () => {
    if (
        props.type === 'input' ||
        props.type === 'input-number' ||
        (props.type === 'select' && props.mode !== 'multiple')
    ) {
        console.log('showData', props.required, props.rules);
        if (isRequired.value) {
            for (let i = 0; i < requiredRules.value.length; i++) {
                // pattern
                if (requiredRules.value[i].pattern) {
                    if (!requiredRules.value[i].pattern.test(showData.value)) {
                        message.error(requiredRules.value[i].message);
                        return;
                    }
                }
            }
            record.value[column.value.dataIndex] = showData.value;
        } else {
            record.value[column.value.dataIndex] = showData.value;
        }
    } else if (props.type === 'select' && props.mode === 'multiple') {
        record.value[column.value.dataIndex] =
            showData.value && showData.value.length > 0 ? showData.value.join(',') : '';
    }
    isEditable.value = false;
    emit('handleCellSave', { record: record.value, index: index.value, column: column.value });
};
const tableEdit = () => {
    isEditable.value = true;
    if (
        props.type === 'input' ||
        props.type === 'input-number' ||
        (props.type === 'select' && props.mode !== 'multiple')
    ) {
        showData.value = text?.value || undefined;
    } else if (props.type === 'select' && props.mode === 'multiple') {
        showData.value = text?.value ? text.value.split(',').map(item => item.trim()) : undefined;
    }
};
const filterOption = text => {
    if (props.mode === 'multiple' && !props.isSort) {
        let arr = text ? text.split(',') : [];
        arr = arr.map(item => item.trim());
        let result = [];
        props.selectOptions.forEach(item => {
            if (arr.includes(item.value)) {
                result.push(item.value);
            }
        });
        return result.join(',');
    } else if (props.mode === 'multiple' && props.isSort) {
        let arr = text ? text.split(',') : [];
        arr = arr.map(item => item.trim());
        let result = [];
        props.selectOptions.forEach(item => {
            if (item.options && item.options.length > 0) {
                item.options.forEach(child => {
                    if (arr.includes(child.value)) {
                        result.push(child.value);
                    }
                });
            }
        });
        return result.join(',');
    } else {
        return props.selectOptions.find(item => item.value == text)?.label;
    }
};
const handleSelectChange = value => {
    showData.value = value;
};
</script>

<style lang="less" scoped>
.editable-cell-input-wrapper {
    display: flex;
    align-items: center;
    .editable-cell-icon-check {
        cursor: pointer;
        color: #006ef9;
        margin-left: 4px;
    }
    .ant-input {
        flex: 1;
        min-width: 150px;
    }
}
.editable-cell-select-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .editable-cell-icon-check {
        cursor: pointer;
        color: #006ef9;
        margin-left: 4px;
    }
    .ant-select {
        flex: 1;
        min-width: 150px;
    }
}
.editable-cell-text-wrapper {
    display: flex;
    align-items: center;
    .text {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }
    .editable-cell-icon {
        cursor: pointer;
        color: #006ef9;
        margin-left: 8px;
    }
}
</style>
