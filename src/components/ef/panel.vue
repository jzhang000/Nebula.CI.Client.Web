<template>
    <div v-if="easyFlowVisible" style="height:100vh; position: fixed;width:100%">
        <el-row>
            <!--顶部工具菜单-->
            <el-col :span="24">
                <div class="ef-tooltar" >
                    <el-button plain @click="returnPipelinePage" style='background:#447788;color:#ffffff' icon="el-icon-back" size="mini">返回</el-button>
                    <el-button plain @click="savePipeline" style='background:#447788;color:#ffffff' icon="el-icon-edit-outline" size="mini">保存</el-button>
                </div>
            </el-col>
        </el-row>
        <div style="display: flex;height: calc(100% - 140px);">
            <div style="width: 230px;border-right: 1px solid #dce3e8;">
                <node-menu @addNode="addNode" ref="nodeMenu"></node-menu>
            </div>
            <div id="efContainer" ref="efContainer" class="container" v-flowDrag style="heght:100%">
                <template v-for="node in data.nodeList">
                    <flow-node
                            :id="node.id"
                            :key="node.id"
                            :node="node"
                            :activeElement="activeElement"
                            @changeNodeSite="changeNodeSite"
                            @nodeRightMenu="nodeRightMenu"
                            @clickNode="clickNode"
                            @dbclick="dbclick"
                    >
                    </flow-node>
                </template>
                <!-- 给画布一个默认的宽度和高度 -->
                <div style="position:absolute;top: 2000px;left: 2000px;">&nbsp;</div>
            </div>
            <!-- 右侧表单 -->
            <div style="width: 400px;border-left: 1px solid #dce3e8;background-color: #FBFBFB">    
                <iframe :src="src" id="propertyIframe" ref="iframe" width="100%" height="100%" frameborder="no" border="0" ></iframe>
            </div>
        </div>
        <!-- 流程数据详情 -->
        <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    // import { jsPlumb } from 'jsplumb'
    // 使用修改后的jsplumb
    import './jsplumb'
    import { easyFlowMixin } from './mixins'
    import flowNode from './node'
    import nodeMenu from './node_menu'
    import FlowInfo from './info'
    import FlowNodeForm from './node_form'
    import lodash from 'lodash'
    import { getDataB } from './data_B'
    import api from '@/api'

    export default {
        data() {
            return {
                // jsPlumb 实例
                jsPlumb: null,
                // 控制画布销毁
                easyFlowVisible: true,
                // 控制流程数据显示与隐藏
                flowInfoVisible: false,
                // 是否加载完毕标志位
                loadEasyFlowFinish: false,
                // 数据
                data: {},
                // 激活的元素、可能是节点、可能是连线
                activeElement: {
                    // 可选值 node 、line
                    type: undefined,
                    // 节点ID
                    nodeId: undefined,
                    // 连线ID
                    sourceId: undefined,
                    targetId: undefined
                },
                zoom: 0.5,
                src : "",
                iframeWin: {},
                i : 0,
                pipelineName:""
            }
        },
        // 一些基础配置移动该文件中
        mixins: [easyFlowMixin],
        components: {
            draggable, flowNode, nodeMenu, FlowInfo, FlowNodeForm
        },
        directives: {
            'flowDrag': {
                bind(el, binding, vnode, oldNode) {
                    if (!binding) {
                        return
                    }
                    el.onmousedown = (e) => {
                        if (e.button == 2) {
                            // 右键不管
                            return
                        }
                        //  鼠标按下，计算当前原始距离可视区的高度
                        let disX = e.clientX
                        let disY = e.clientY
                        el.style.cursor = 'move'

                        document.onmousemove = function (e) {
                            // 移动时禁止默认事件
                            e.preventDefault()
                            const left = e.clientX - disX
                            disX = e.clientX
                            el.scrollLeft += -left

                            const top = e.clientY - disY
                            disY = e.clientY
                            el.scrollTop += -top
                        }

                        document.onmouseup = function (e) {
                            el.style.cursor = 'auto'
                            document.onmousemove = null
                            document.onmouseup = null
                        }
                    }
                }
            }
        },
        mounted() {
            window.addEventListener("message", this.handleIframeMessage);

            this.jsPlumb = jsPlumb.getInstance()
            this.$nextTick(() => {
                // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
                //判断是否当前页面刷新，如果刷新会丢失pipelineList数据，需要重新拉取数据
                api.GET_PIPELINE_BY_ID_API(this.$route.params.pipelineId).then(res => {
                    this.pipelineName = res.name
                    if(res.diagram == "{}" || res.diagram == "" || res.diagram == null) {
                        this.dataReload({name:res.name, nodeList:[], lineList:[]})
                    } else {
                        this.dataReload(JSON.parse(res.diagram))
                    }
                })
            })
        },
        methods: {
            // 返回唯一标识
            getUUID() {
                return Math.random().toString(36).substr(3, 10)
            },
            jsPlumbInit() {
                this.jsPlumb.ready(() => {
                    // 导入默认配置
                    this.jsPlumb.importDefaults(this.jsplumbSetting)
                    // 会使整个jsPlumb立即重绘。
                    this.jsPlumb.setSuspendDrawing(false, true);
                    // 初始化节点
                    this.loadEasyFlow()
                    // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
                    this.jsPlumb.bind('click', (conn, originalEvent) => {
                        this.activeElement.type = 'line'
                        this.activeElement.sourceId = conn.sourceId
                        this.activeElement.targetId = conn.targetId
                        /*
                        this.$refs.nodeForm.lineInit({
                            from: conn.sourceId,
                            to: conn.targetId,
                            label: conn.getLabel()
                        })
                        */
                    })
                    // 连线
                    this.jsPlumb.bind("connection", (evt) => {
                        let from = evt.source.id
                        let to = evt.target.id
                        if (this.loadEasyFlowFinish) {
                            this.data.lineList.push({from: from, to: to})
                        }
                    })

                    // 添加快捷键删除
                    document.addEventListener('keyup', (conn, originalEventConn) => {
                        let event = originalEventConn || window.event
                        // 8--backspace, 46--delete
                        if (event.keyCode === 46) {
                           this.deleteElement()
                        }
                    })

                    // 删除连线回调
                    this.jsPlumb.bind("connectionDetached", (evt) => {
                        this.deleteLine(evt.sourceId, evt.targetId)
                    })

                    // 改变线的连接节点
                    this.jsPlumb.bind("connectionMoved", (evt) => {
                        this.changeLine(evt.originalSourceId, evt.originalTargetId)
                    })

                    // 连线右击
                    this.jsPlumb.bind("contextmenu", (evt) => {
                        console.log('contextmenu', evt)
                    })

                    // 连线
                    this.jsPlumb.bind("beforeDrop", (evt) => {
                        let from = evt.sourceId
                        let to = evt.targetId
                        if (from === to) {
                            this.$message.error('节点不支持连接自己')
                            return false
                        }
                        if (this.hasLine(from, to)) {
                            this.$message.error('该关系已存在,不允许重复创建')
                            return false
                        }
                        if (this.hashOppositeLine(from, to)) {
                            this.$message.error('不支持两个节点之间连线回环');
                            return false
                        }
                        this.$message.success('连接成功')
                        return true
                    })

                    // beforeDetach
                    this.jsPlumb.bind("beforeDetach", (evt) => {
                        console.log('beforeDetach', evt)
                    })
                    this.jsPlumb.setContainer(this.$refs.efContainer)
                })
            },
            // 加载流程图
            loadEasyFlow() {
                // 初始化节点
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    // 设置源点，可以拖出线连接其他节点
                    this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
                    // // 设置目标点，其他源点拖出的线可以连接该节点
                    this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(node.id, {
                        containment: 'parent',
                        stop: function (el) {
                        }
                    })
                }
                // 初始化连线
                for (var i = 0; i < this.data.lineList.length; i++) {
                    let line = this.data.lineList[i]
                    var connParam = {
                        source: line.from,
                        target: line.to,
                        label: line.label ? line.label : '',
                        connector: line.connector ? line.connector : '',
                        anchors: line.anchors ? line.anchors : undefined,
                        paintStyle: line.paintStyle ? line.paintStyle : undefined,
                    }
                    this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
                }
                this.$nextTick(function () {
                    this.loadEasyFlowFinish = true
                })
            },
            setLineLabel(from, to, label) {
                var conn = this.jsPlumb.getConnections({
                    source: from,
                    target: to
                })[0]
                if (!label || label === '') {
                    conn.removeClass('flowLabel')
                    conn.addClass('emptyFlowLabel')
                } else {
                    conn.addClass('flowLabel')
                }
                conn.setLabel({
                    label: label,
                })
                this.data.lineList.forEach(function (line) {
                    if (line.from == from && line.to == to) {
                        line.label = label
                    }
                })

            },
            // 删除激活的元素
            deleteElement() {
                if (this.activeElement.type === 'node') {
                    this.deleteNode(this.activeElement.nodeId)
                } else if (this.activeElement.type === 'line') {
                    this.$confirm('确定删除所点击的线吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var conn = this.jsPlumb.getConnections({
                            source: this.activeElement.sourceId,
                            target: this.activeElement.targetId
                        })[0]
                        this.jsPlumb.deleteConnection(conn)
                    }).catch(() => {
                    })
                }
            },
            // 删除线
            deleteLine(from, to) {
                this.data.lineList = this.data.lineList.filter(function (line) {
                    if (line.from == from && line.to == to) {
                        return false
                    }
                    return true
                })
            },
            // 改变连线
            changeLine(oldFrom, oldTo) {
                this.deleteLine(oldFrom, oldTo)
            },
            // 改变节点的位置
            changeNodeSite(data) {
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    if (node.id === data.nodeId) {
                        node.left = data.left
                        node.top = data.top
                    }
                }
            },
            /**
             * 拖拽结束后添加新的节点
             * @param evt
             * @param nodeMenu 被添加的节点对象
             * @param mousePosition 鼠标拖拽结束的坐标
             */
            addNode(evt, nodeMenu, mousePosition) {
                var screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
                let efContainer = this.$refs.efContainer
                var containerRect = efContainer.getBoundingClientRect()
                var left = screenX, top = screenY
                // 计算是否拖入到容器中
                if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
                    this.$message.error("请把节点拖入到画布中")
                    return
                }
                left = left - containerRect.x + efContainer.scrollLeft
                top = top - containerRect.y + efContainer.scrollTop
                // 居中
                left -= 85
                top -= 16
                var nodeId = this.getUUID()
                // 动态生成名字
                /*
                var origName = nodeMenu.name
                var nodeName = origName
                var index = 1
                while (index < 10000) {
                    var repeat = false
                    for (var i = 0; i < this.data.nodeList.length; i++) {
                        let node = this.data.nodeList[i]
                        if (node.name === nodeName) {
                            nodeName = origName + index
                            repeat = true
                        }
                    }
                    if (repeat) {
                        index++
                        continue
                    }
                    break
                }
                */
                var node = {
                    id: nodeId,
                    name: nodeMenu.name,
                    annoName: nodeMenu.annoName,
                    configUrl: nodeMenu.configUrl,
                    resultUrl: nodeMenu.resultUrl,
                    left: left + 'px',
                    top: top + 'px',
                    property:'',
                    ico : nodeMenu.icon
                }
                /**
                 * 这里可以进行业务判断、是否能够添加该节点
                 */
                this.data.nodeList.push(node)
                this.$nextTick(function () {
                    this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
                    this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(nodeId, {
                        containment: 'parent'
                    })
                })
            },
            /**
             * 删除节点
             * @param nodeId 被删除节点的ID
             */
            deleteNode(nodeId) {
                this.$confirm('确定要删除节点' + nodeId + '?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    /**
                     * 这里需要进行业务判断，是否可以删除
                     */
                    this.data.nodeList = this.data.nodeList.filter(function (node) {
                        if (node.id === nodeId) {
                            // 伪删除，将节点隐藏，否则会导致位置错位
                            // node.show = false
                            return false
                        }
                        return true
                    })
                    this.$nextTick(function () {
                        this.jsPlumb.removeAllEndpoints(nodeId);
                    })

                    this.src = ""
                }).catch(() => {
                })
                return true
            },
            clickNode(node) {    
                this.src = node.configUrl     
                let iframes = document.getElementById('propertyIframe')
                iframes.onload = () => {
                    this.$refs.iframe.contentWindow.postMessage(
                    {
                        cmd: "clickNode",
                        params: {
                            type: node.name,
                            property:node.property
                        },
                    },"*"); 
                }

                this.$refs.iframe.contentWindow.postMessage(
                {
                        cmd: "clickNode",
                        params: {
                            type: node.name,
                            property:node.property
                        },
                },"*"); 
                
                this.activeElement.type = 'node'
                this.activeElement.nodeId = node.id
            },
            // 是否具有该线
            hasLine(from, to) {
                for (var i = 0; i < this.data.lineList.length; i++) {
                    var line = this.data.lineList[i]
                    if (line.from === from && line.to === to) {
                        return true
                    }
                }
                return false
            },
            // 是否含有相反的线
            hashOppositeLine(from, to) {
                return this.hasLine(to, from)
            },
            nodeRightMenu(nodeId, evt) {
                this.menu.show = true
                this.menu.curNodeId = nodeId
                this.menu.left = evt.x + 'px'
                this.menu.top = evt.y + 'px'
            },
            dbclick(data){
                var node = this.data.nodeList.find(a => a.id == data.id)
                node.name = data.name
                this.clickNode(node)
            },
            repaintEverything() {
                console.log('重绘')
                this.jsPlumb.repaint()
            },
            // 流程数据信息
            dataInfo() {
                this.flowInfoVisible = true
                this.$nextTick(function () {
                    this.$refs.flowInfo.init()
                })
            },
            // 加载流程图
            dataReload(data) {
                this.easyFlowVisible = false
                this.data.nodeList = []
                this.data.lineList = []
                this.$nextTick(() => {
                    data = lodash.cloneDeep(data)
                    this.easyFlowVisible = true
                    this.data = data
                    this.$nextTick(() => {
                        this.jsPlumb = jsPlumb.getInstance()
                        this.$nextTick(() => {
                            this.jsPlumbInit()
                        })
                    })
                })
            },
            // 模拟载入数据dataB
            dataReloadB() {
                this.dataReload(getDataB())
            },
            returnPipelinePage(){
                this.$router.push("/ci/job/" + this.$route.params.pipelineId)
            },
            // 下载数据
            downloadData() {
                this.$confirm('确定要下载该pipeline配置数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, '\t'));
                    var downloadAnchorNode = document.createElement('a')
                    downloadAnchorNode.setAttribute("href", datastr);
                    downloadAnchorNode.setAttribute("download", 'data.json')
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                    this.$message.success("正在下载中,请稍后...")
                }).catch(() => {
                })
            },
            handleIframeMessage(event) {
                let nodelist = this.data.nodeList
                var node = nodelist.find(a => a.id == this.activeElement.nodeId)
                if(event.data.cmd == "property"){
                    node.property = event.data.params.data
                    this.$message.success("节点 " + node.annoName + " 属性保存成功");
                }  
            },
            savePipeline(){
                let pipelineData = {name : this.pipelineName, diagram : JSON.stringify(this.data), id :this.$route.params.pipelineId}
                api.SAVE_PIPELINE_API(pipelineData).then(res => {
                    this.$message.success('保存pipeline配置成功');
                    this.$router.push({path: '/ci/job/' + this.$route.params.pipelineId});
                })
            }
        }
    }
</script>
