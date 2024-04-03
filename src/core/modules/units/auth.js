// 一级过滤
function itemFilter(item, splitKey) {
    if (!item.list[splitKey[1]]) {
        console.log('noexist item', item.list);
        item.list[splitKey[1]] = {
            key: splitKey[1],
            list: [],
            itemSelect: [],
        };
    } else {
        console.log('exist item', item.list);
    }
}
// 二级过滤
function subItemFilter(item, splitKey, auth, level = 2) {
    // 判断上一层是否存在
    console.log('splitKey', splitKey.length - 1);
    let subItem = item.list[splitKey[1]];
    let lg = splitKey.length - 1;

    let pushItem = { key: splitKey[2], list: [] };

    if (subItem) {
        const findIndex = subItem.list.findIndex(el => el.key === splitKey[2]);
        if (findIndex === -1) {
            // no exist
            subItem.list.push(pushItem);
        } else {
            let dataItem = { ...subItem.list[findIndex] };
            if (lg === level) {
                // 只有在第二层的时候才会将id传进去作为之后checkout 选中的value
                dataItem.id = auth.id;
            }
            subItem.list.splice(findIndex, 1, dataItem);
        }
        console.log('exist subItem', subItem);
    } else {
        subItem = {
            key: splitKey[1],
            list: [],
            itemSelect: [],
        };
        subItem.list.push(pushItem);
        item.list[splitKey[1]] = subItem; // 最后赋值
        console.log('noexist subItem', subItem);
    }

    item.list[splitKey[1]].itemCheckAll = itemCheckAllFilter(item.list[splitKey[1]].list || []);
}
// 三级过滤
function threeItemFilter(item, splitKey, auth) {
    let subList = item.list[splitKey[1]]?.list;

    if (!subList) {
        subItemFilter(item, splitKey, auth);
    }
    subList = item.list[splitKey[1]]?.list;

    const threeItem = subList.find(el => el.key === splitKey[2]);
    threeItem.list.push({ id: auth.id, key: splitKey[3] });
    console.log('threeItem', threeItem);
}

// 汇集二级一下的所有可选项
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

class Auth {
    constructor(authItems) {
        this.authItems = authItems;
    }

    handleAuthGrouping(data) {
        data.forEach(auth => {
            let splitKey = auth.key.split('.'); // ['test', 'oneMange1', 'bookList', 'edit']
            let lg = splitKey.length - 1;
            let item = this.authItems.find(i => splitKey[0] === i.key);

            if (item) {
                // 2，3需判断上一层是否存在
                switch (lg) {
                    case 1:
                        itemFilter(item, splitKey);
                        break;
                    case 2:
                        subItemFilter(item, splitKey, auth);
                        break;
                    case 3:
                        threeItemFilter(item, splitKey, auth);
                        break;
                }
            }
        });
        console.log('this.authItems', this.authItems);
    }

    itemCheckAllFilter(list) {
        itemCheckAllFilter(list);
    }   
}

let list = [
    {
        id: 3,
        key: 'test.oneMange1.bookList.edit',
        name: '编辑',
        path: '',
        scope_type: 10,
    },
    {
        id: 2,
        key: 'test.oneMange1.bookList',
        name: 'book列表1',
        path: '',
        scope_type: 10,
    },
    {
        id: 1,
        key: 'test.oneMange1',
        name: '管理1',
        path: '',
        scope_type: 10,
    },
    {
        id: 4,
        key: 'test.oneMange1.bookList.delete',
        name: '删除',
        path: '',
        scope_type: 10,
    },  
    {
        id: 5,
        key: 'test.oneMange2',
        name: '管理2',
        path: '',
        scope_type: 10,
    },  
    {
        id: 6,
        key: 'test.oneMange2.orderList',
        name: '订单',
        path: '',
        scope_type: 10,
    },  
];

/**
 * node:
 * {
 *   id: 0,
 *   key: '',
 *   route: '',
 *   name: ''
 *   parent: node,
 *   children: []
 * }
 *  
 * */ 

function processAuthList(authList) {
    let tree = {
        route: '',
        name: ''
    };
    travelAuth(authList, tree);
    return tree;
}

// 拆分 key='test.aa.bb.cc'
function getNextLevelNodeNameList(authList, prefix) {
    let items = {};
    authList.forEach((node, i) => {
        let nodeKey = node.key;
        if (prefix !== undefined) {
            if (nodeKey.indexOf(prefix) < 0) {
                return;
            }
        }

        prefix = prefix || "";

        let subKey = nodeKey.substring(prefix.length)
        let parts = subKey.split(".").filter(s => s !== '');
        if (parts.length == 0) {
            return;
        }
        let key = parts[0];
        items[key] = key;
    });

    return Object.keys(items);
}

// 根据prefix过滤相应开头的数据
function getSubAuthList(authList, prefix) {
    return authList.filter(node => node.key.indexOf(prefix) === 0);
}

function travelAuth(authList, node, parentRoute) {
    console.log('travel', parentRoute);

    let children = [];

    let currentLevelNodeNameList = getNextLevelNodeNameList(authList, parentRoute);
    console.log('nextLevel', currentLevelNodeNameList);

    if (currentLevelNodeNameList.length === 0) {
        node.key = node.route + "." + node.name;
        return;
    }

    currentLevelNodeNameList.forEach((name, _) => {
        let route = parentRoute + "." + name;
        if (node.route === '') {
            route = name;
        }

        console.log('getSubAuthList', route);
        let childAuthList = getSubAuthList(authList, route);
        if (childAuthList.length === 0) {
            return;
        }

        let childNode = {
            id: 0,
            route: parentRoute,
            name: name,
            parent: node
        }

        travelAuth(authList, childNode, route);

        children.push(childNode);
    });

    node.children = children;
}


export default Auth;
