const SUPPLAY = {
    SUPPLAY_TYPE: {
        '1': { value: 1, zh:'零件类', en: 'Part Class', t: 'supply-chain.part' },
        '2': { value: 2, zh:'代理类', en: 'Broker Class', t: 'supply-chain.broker' },
        '3': { value: 3, zh:'外协类', en: 'Outsourcing Class', t: 'supply-chain.outsourcing' },
        '4': { value: 4, zh:'模具类', en: 'Mold Class', t: 'supply-chain.mold' },
        '5': { value: 5, zh:'客指类', en: 'CustomerRefers Class', t: 'supply-chain.customer_refers' },
    },
    SUPPLAY_TYPE_MAP: {        
        part: 1,
        broker: 2,
        outsourcing: 3,
        mold: 4,
        customer_refers: 5,
    }
}

export default SUPPLAY