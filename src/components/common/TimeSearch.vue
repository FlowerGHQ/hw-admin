<template>
<a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
    <template #suffixIcon><i class="icon i_calendar"/></template>
</a-range-picker>
</template>

<script>
import Core from '../../core';

export default {
    components: {},
    props: {},
    emits: ['search'],
    data() {
        return {
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        handleSearch() {
            this.$emit('search', ...this.create_time);
        }
    },
}
</script>