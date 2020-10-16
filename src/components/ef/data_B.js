var data_B = {
    name: '流程B',
    nodeList: [{
            id: 'nodeA',
            name: '流程B-节点A',
            type: 'task',
            left: '18px',
            top: '223px',
            ico: 'el-icon-user-solid'
        },
        {
            id: 'nodeB',
            type: 'task',
            name: '流程B-节点B',
            left: '351px',
            top: '96px',
            ico: 'el-icon-goods'
        },
        {
            id: 'nodeC',
            name: '流程B-节点C',
            type: 'task',
            left: '354px',
            top: '351px',
            ico: 'el-icon-present'
        }, {
            id: 'nodeD',
            name: '流程B-节点D',
            type: 'task',
            left: '723px',
            top: '215px',
            ico: 'el-icon-present'
        }
    ],
    lineList: [{
        from: 'nodeA',
        to: 'nodeB'
    }, {
        from: 'nodeA',
        to: 'nodeC'
    }, {
        from: 'nodeB',
        to: 'nodeD'
    }, {
        from: 'nodeC',
        to: 'nodeD'
    }]
}

export function getDataB() {
    return data_B
}