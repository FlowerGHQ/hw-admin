const AUDIT_MANAGEMENT = {
    AUDIT_STATUS: {
        1: { value: 1, zh: '等待一审', en: 'Pending First Audit' },
        2: { value: 2, zh: '二审通过', en: 'Approval Second Audit' },
        3: { value: 3, zh: '一审不通过', en: 'The First Audit Was Rejected' },
        4: { value: 4, zh: '等待二审', en: 'Pending Second Audit' },
        5: { value: 5, zh: '二审不通过', en: 'The Second Audit Was Rejected' },
    },
    AUDIT_STATUS_MAP: {
        PENDING_FIRST: 1, // 等待一审
        APPROVAL_SECOND: 2, // 二审通过
        REJECT_FIRST: 3, // 一审不通过
        PENDING_SECOND: 4, // 等待二审
        REJECT_SECOND: 5, // 二审不通过
    },
    STATUS_MAP: {
        1: { zh: '等待一审', en: 'Pending First Audit' },
        2: { zh: '二审通过', en: 'Approval Second Audit' },
        3: { zh: '一审不通过', en: 'The First Audit Was Rejected' },
        4: { zh: '等待二审', en: 'Pending Second Audit' },
        5: { zh: '二审不通过', en: 'The Second Audit Was Rejected' },
    },
    STATUS_COLOR_MAP: {
        1: 'yellow',
        2: 'green',
        3: 'red',
        4: 'yellow',
        5: 'red',
    },
    AUDIT_RESULT: {
        2: { key: 2, zh: '通过', en: 'Approve', value: 2 },
        3: { key: 3, zh: '不通过', en: 'Reject', value: 3 },
    },
    AUDIT_RESULT_MAP: {
        APPROVE: 2, // 通过
        REJECT: 3, // 不通过
    }
};

export default AUDIT_MANAGEMENT;
