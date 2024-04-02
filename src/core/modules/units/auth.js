class Auth {
    constructor(authItems) {
        this.authItems = authItems
    }

    handleAuthGrouping(data) {
        data.forEach(auth => {
            let splitKey = auth.key.split('.');
            let lg = splitKey.length - 1;
            let item = this.authItems.find(i => splitKey[0] === i.key);

            if (item) {
                switch (lg) {
                    case 1:
                        item.list[splitKey[1]] = {
                            key: splitKey[1],
                            list: [],
                        };
                        break;
                    case 2:
                        const $2 = item.list[splitKey[1]];
                        $2.list.push({ id: auth.id, key: splitKey[2], list: [] });
                        console.log('$2', $2);
                        break;
                    case 3:
                        const $2Item = item.list[splitKey[1]].list;
                        const $3 = $2Item.find(el => el.key === splitKey[2]);
                        $3.list.push({ id: auth.id, key: splitKey[3] });
                        console.log('$3', $3);
                        break;
                }
            }
        });

        console.log('this.authItems', this.authItems);
    }
}
