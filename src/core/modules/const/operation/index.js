const OPERATION = {
    locationList: [
        {
            label: 'top_message',
            value: '1',
        },
        {
            label: 'message_aggregation',
            value: '2',
        },
    ],
    OPERATION_TYPE: {
        0: { value: 0, zh: '全部', en: 'All' },
        1: { value: 1, zh: '已发布', en: 'Have Released' },
        2: { value: 2, zh: '未发布', en: 'Unpublish' },
    },
    OPERATION_TYPE_MAP: {
        REPORT: 1,
        AD: 2,
    },
    AREA_TYPE_MAP: {
        ALL: 1,
        PART: 2,
    },
};

export default OPERATION;
