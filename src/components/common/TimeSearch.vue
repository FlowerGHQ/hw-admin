<template>
<a-range-picker v-model:value="createTime" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
    <template #suffixIcon><i class="icon i_calendar"/></template>
</a-range-picker>
</template>

<script>
import Core from '../../core';

export default {
    name: 'TimeSearch',
    components: {},
    props: {
        type: {
            type: String,
            default: '',
        }
    },
    emits: ['search'],
    data() {
        return {
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            createTime: [],
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        handleSearch() {
            this.$emit('search', this.type, ...this.createTime);
        },
        handleReset() {
            this.createTime = []
        }
    },
}
</script>