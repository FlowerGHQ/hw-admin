import Static from './static';

const Util = {
    // 客户来源
    sourceTypeFilter(val, to = 'key') {
        const MAP = Static.SOURCE_TYPE_MAP;
        let ITEM = MAP[val + ''] || { key: '' };
        return ITEM[to] || '未知';
    },
};
export default Util;
