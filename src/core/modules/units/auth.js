// 分解
function getNextLevelNodeNameList(authList, prefix = undefined) {
    // console.log('prefix', prefix);
    let items = {};
    authList.forEach((node, i) => {
        let nodeKey = node.key;

        // 阻止不属于 prefix 和 其子级
        if (prefix) {
            if (!nodeKey === prefix || !nodeKey.startsWith(prefix + '.')) {
                return;
            }
        }

        let parts = nodeKey.split('.');
        let prefixParts = prefix.split('.');
        prefixParts.forEach(el => {
            let i = parts.indexOf(el);
            if (i !== -1) {
                parts.splice(i, 1);
            }
        });

        // console.log("parts", parts);
        if (parts.length == 0) {
            return;
        }
        let key = parts[0];
        items[key] = key;
    });

    return Object.keys(items);
}

// 递归
function travelAuth(authList, node, parentRoute) {
    let list = [];
    let currentLevelNodeNameList = getNextLevelNodeNameList(authList, parentRoute);
    // console.log('currentLevelNodeNameList', currentLevelNodeNameList);

    if (currentLevelNodeNameList.length === 0) {
        return;
    }

    currentLevelNodeNameList.forEach((key, _) => {
        let currentrRoute = parentRoute + '.' + key;
        let childNode = {
            parentRoute: parentRoute,
            key: key,
        };
        const find = authList.find(el => el.key === currentrRoute);

        if (find) {
            childNode.id = find.id;
            childNode.scope_type = find.scope_type;
        }

        travelAuth(authList, childNode, currentrRoute);

        list.push(childNode);
    });

    node.list = list;

    /**
     *  itemSelect: [], // checkout 选中的
        itemCheckAll: [], // list底下所有选中项id
    */
    if (parentRoute.split('.').length === 2) {
        node.itemSelect = [];
        node.itemCheckAll = [node.id].concat(itemCheckAllFilter(node.list));
    }
}

// 汇集二级下的所有可选项id  [1,2,3,4]
function itemCheckAllFilter(list) {
    let itemCheckAll = [];

    const processList = currentList => {
        currentList.forEach(el => {
            if (el.id) {
                itemCheckAll.push(el.id);
            }

            if (el.list?.length) {
                processList(el.list);
            }
        });
    };

    processList(list);

    // 去重
    return [...new Set(itemCheckAll)];
}

/**
 * @param {*} disabledList [] 禁用数据 [1,2]
 * @description 根据 disabledList.includes  给相对应的数据添加禁用属性
 */
function addDisabled(disabledList, authList) {
    authList.forEach(el => {
        if (el.id && disabledList.includes(el.id)) {
            el.disabled = true;
        }

        if (el.list && el.list.length !== 0) {
            addDisabled(disabledList, el.list);
        }
    });
}

class Auth {
    constructor(authItems) {
        this.authItems = authItems;
    }

    /**
     *
     * @param { Array } authList
     */
    processAuthList(authList) {
        this.authItems.forEach(el => {
            const find = authList.find(item => el.key === item.key);
            if (find) {
                el.id = find.id;
            }

            travelAuth(authList, el, el.key);
        });
        console.log('this.authItems', this.authItems);
    }

    /**
     * @description 添加禁用属性 到相应数据
     * @param { Array } ids
     */
    addDisableItem(ids) {
        addDisabled(ids, this.authItems);
    }

    /**
     * @description 根据回显数据返回的 select  将对应的 itemSelect加上被选中的id
     * @param { Array } authList
     */
    echoAuth(authList) {
        // [{}. {}, {id: 1, key: "xxx.xxx"}]
        authList.forEach(el => {
            let parts = el.key.split('.')[0];
            const find = this.authItems.find(el => el.key === parts);

            if (find) {
                find.select.push(el.id);
                find.select = [...new Set(find.select)];
            }
        });

        // 根据回显数据返回的 select  将对应的 itemSelect加上被选中的id
        this.authItems.forEach(item => {
            // 模块赋值
            item.templateSelect = item.select.includes(item.id) ? [item.id] : [];

            // 二级统计
            item.list.forEach(subItem => {
                let result = [];
                subItem.itemCheckAll?.forEach(i => {
                    let bool = item.select.includes(i);
                    if (bool) {
                        result.push(i);
                    }
                });
                subItem.itemSelect = result;
            });
        });
        // console.log("echoAuth", this.authItems);
    }

    clearAuthItemsSelect(authList) {
        let clearList = authList || this.authItems || [];
        // 每次调用这个方法把之前的清空
        clearList.forEach(el => {
            el.select = [];
        });
    }

    /**
     *
     * @description itemSelect 合并 && 只保留 不等于 disable: true
     * @param { Array } authList
     * @returns
     */
    mergeItemSelect(authList) {
        let result = [];
        authList.forEach(el => {
            if (el.itemSelect) {
                result.push(...el.itemSelect);
            }
            if (el.list && el.list?.length !== 0) {
                result.push(...this.mergeItemSelect(el.list));
            }
        });

        return [...new Set(result)];
    }

    /**
     * @description 过滤tab数据
     * @param {Object Array} tabList
     * @returns {Object Array}
     */
    tabFilter(tabList) {
        let result = null
        if (tabList instanceof Array) {
            result = []
            tabList.forEach((el, index) => {                
                if (el.list?.length) {                    
                    result.push(el)
                }
            });
        } else if (tabList instanceof Object) {
            result = {}
            for (const key in tabList) {
                if (tabList[key].list?.length) {                    
                    result[key] = tabList[key]
                }
            }
        }

        return result;
    }
}

export default Auth;
