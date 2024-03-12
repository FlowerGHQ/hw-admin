const AUDIT_MANAGEMENT = {
    AUDIT_STATUS: {
        0: { value: 0, zh: '等待一审', en: 'Pending First Audit' },
        1: { value: 1, zh: '等待二审', en: 'Pending Second Audit' },
        2: { value: 2, zh: '二审通过', en: 'Approval Second Audit' },
        3: { value: 3, zh: '一审不通过', en: 'The First Audit Was Rejected' },
        4: { value: 4, zh: '二审不通过', en: 'The Second Audit Was Rejected' },
    },
    AUDIT_STATUS_MAP: {
        PENDING_FIRST: 0, // 等待一审
        PENDING_SECOND: 1, // 等待二审
        APPROVAL_SECOND: 2, // 二审通过
        REJECT_FIRST: 3, // 一审不通过
        REJECT_SECOND: 4, // 二审不通过
    },
    STATUS_MAP: {
        0: { zh: '等待一审', en: 'Pending First Audit' },
        1: { zh: '等待二审', en: 'Pending Second Audit' },
        2: { zh: '二审通过', en: 'Approval Second Audit' },
        3: { zh: '一审不通过', en: 'The First Audit Was Rejected' },
        4: { zh: '二审不通过', en: 'The Second Audit Was Rejected' },
    },
    STATUS_COLOR_MAP: {
        0: 'yellow',
        1: 'yellow',
        2: 'green',
        3: 'red',
        4: 'red',
    },
    AUDIT_RESULT: {
        1: { key: 1, zh: '通过', en: 'Approve', value: 1 },
        2: { key: 2, zh: '不通过', en: 'Reject', value: 2 },
    },
    AUDIT_RESULT_MAP: {
        APPROVE: 1, // 通过
        REJECT: 2, // 不通过
    }
};

export default AUDIT_MANAGEMENT;
