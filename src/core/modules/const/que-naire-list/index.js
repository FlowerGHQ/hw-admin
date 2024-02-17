const QUE_NAIRE_LIST = {
    STATUS_MAP: {
        0: { key: '0', value: '1', text: '全部' },
        1: { key: '1', value: '2', text: '使用中' },
        2: { key: '2', value: '3', text: '已停用' },
    },
    STATUS_FILTER_MAP: {
        0: '未知',
        1: '使用中',
        2: '已停用',
    },
    STATUS_FILTER_COLOR_MAP: {
        0: 'grey',
        1: 'green',
        2: 'red',
    },
    STATUS: {
        IN_USE: 1,
        STOPPED: 2,
    },
};

export default QUE_NAIRE_LIST;
