<template>
    <div class="edit-cell" v-if="type === 'input'">
        <div class="editable-cell-input-wrapper" v-if="isEditable">
            <a-input v-model:value="showData"></a-input>
            <CheckOutlined class="editable-cell-icon-check" @click="tabCellSave()" />
        </div>
        <div class="editable-cell-text-wrapper" v-else>
            {{ text || '-' }}
            <EditOutlined class="editable-cell-icon" @click="tableEdit()" />
        </div>
    </div>
    <div class="edit-cell" v-else-if="type === 'select'">
        <div class="editable-cell-select-wrapper" v-if="isEditable">
            <a-select v-model:value="showData" :mode="mode" :options="selectOptions" @change="handleSelectChange">
            </a-select>
            <span class="editable-cell-icon-check" @click="tabCellSave()">
                {{ $t('supply-chain.determine') }}
            </span>
        </div>
        <div class="editable-cell-text-wrapper" v-else>
            {{ filterOption(text) || '-' }}
            <span @click="tableEdit()" class="editable-cell-icon"> {{ $t('supply-chain.change') }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, toRefs, watch } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';

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
});

const isEditable = ref(false);
const { column, text, record, index } = toRefs(props.cellData);
const showData = ref('');
const emit = defineEmits(['handleCellSave']);

watch();

// methods
const tabCellSave = () => {
    isEditable.value = false;
    if (props.type === 'input' || (props.type === 'select' && props.mode !== 'multiple')) {
        record.value[column.value.dataIndex] = showData.value;
    } else if (props.type === 'select' && props.mode === 'multiple') {
        record.value[column.value.dataIndex] = showData.value.join(',');
    }
    emit('handleCellSave', { record: record.value, index: index.value, column: column.value });
};
const tableEdit = () => {
    isEditable.value = true;
    if (props.type === 'input' || (props.type === 'select' && props.mode !== 'multiple')) {
        showData.value = text.value;
    } else if (props.type === 'select' && props.mode === 'multiple') {
        showData.value = text.value.split(',').map(item => item.trim());
    }
    console.log(showData.value);
};
const filterOption = text => {
    if (props.mode === 'multiple') {
        let arr = text.split(',');
        arr = arr.map(item => item.trim());
        let result = [];
        props.selectOptions.forEach(item => {
            if (arr.includes(item.value)) {
                result.push(item.value);
            }
        });
        return result.join(',');
    } else {
        return props.selectOptions.find(item => item.value == text)?.label;
    }
};
const handleSelectChange = value => {
    console.log(value, 'value');
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
    }
}
.editable-cell-text-wrapper {
    display: flex;
    align-items: center;
    .editable-cell-icon {
        cursor: pointer;
        color: #006ef9;
        margin-left: 8px;
    }
}
</style>
