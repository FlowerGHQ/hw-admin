// 一级过滤
function itemFilter(item, splitKey) {
    if (!item.list[splitKey[1]]) {
        console.log('noexist item', item.list);
        item.list[splitKey[1]] = {
            key: splitKey[1],
            list: [],
        };
    } else {
        console.log('exist item', item.list);
    }
}
// 二级过滤
function subItemFilter(item, splitKey, auth, level = 2) {
    // 判断上一层是否存在
    console.log("splitKey", splitKey.length - 1);
    let subItem = item.list[splitKey[1]];
    let lg = splitKey.length - 1

    let pushItem = { key: splitKey[2], list: [] }

    

    if (subItem) {
        const findIndex = subItem.list.findIndex(el => el.key === splitKey[2]);
        if (findIndex === -1) {
            // no exist
            subItem.list.push(pushItem);
        } else {
            let dataItem = { ...subItem.list[findIndex] }
            if (lg === level) {
                // 只有在第二层的时候才会将id传进去作为之后checkout 选中的value
                dataItem.id = auth.id
            }    
            subItem.list.splice(findIndex, 1, dataItem)                 
        }
        console.log('exist subItem', subItem);
    } else {
        subItem = {
            key: splitKey[1],
            list: [],
        };
        subItem.list.push(pushItem);
        item.list[splitKey[1]] = subItem; // 最后赋值
        console.log('noexist subItem', subItem);
    }
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
}

export default Auth;
