<template>
    <a-range-picker
        v-model:value="createTime"
        valueFormat="X"
        @change="handleSearch"
        :show-time="defaultTime"
        :allow-clear="false"
        :placeholder="[$t('crm_def.start_time'), $t('crm_def.end_time')]"
    >
        <template #suffixIcon><i class="icon i_calendar" /></template>
    </a-range-picker>
</template>

<script>
import Core from '../../core';

export default {
    name: 'TimeSearch',
    components: {},
    props: {
        value: {
            type: Array,
            default: [],
        },
        keys: {
            type: Array,
            default: ['begin_time', 'end_time'],
        },
        defaultTime: {
            type: Array,
            default: () => Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
        },
    },
    emits: ['search'],
    data() {
        return {
            // defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            createTime: this.value,
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        handleSearch() {
            let obj = {};
            obj[this.keys[0]] = this.createTime[0];
            obj[this.keys[1]] = this.createTime[1];
            console.log('handleSearch obj:', obj, this.createTime);
            this.$emit('search', obj);
        },
        handleReset() {
            this.createTime = [];
            let obj = {};
            obj[this.keys[0]] = this.createTime[0];
            obj[this.keys[1]] = this.createTime[1];
            this.$emit('search', obj);
        },
    },
};
</script>
