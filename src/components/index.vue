<template>
    <div class="page-content">
        <el-table
            stripe
            highlight-current-row
            :data="matchList"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            style="font-size:16px"
            @expand-change="toggleRowExpansion"
            @current-change="toggleRowExpansion"
        >
            <el-table-column 
                v-for="item in labelList"
                :key="item.label"
                :label="item.label" 
                :prop="item.prop"
            ></el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <div class="flex flex_start flex_center">
                        <el-button
                            v-for="(item,index) in handBtnList"
                            :key="item.text"
                            :disabled="item.disabled" 
                            @click="eventsOpen(index)"
                        >{{item.text}}</el-button>
                    </div>
                    <div class="btns">
                        <div class="teams flex flex_around">
                            <p>主队</p>
                            <p>客队</p>
                        </div>
                        <div class="flex flex_center">
                            <div :class="['team flex flex_column flex_wrap', 
                                {'flex_wrap_reverse':item.i === '1'}]"
                                v-for="(item,index) in teamBtnList"
                                :key="item.i">
                                <div class="btn"
                                    v-for="(key,btnindex) in item.btnList"
                                    :key="key.default"
                                 >
                                    <el-input-number 
                                        :min="1" 
                                        :max="100"
                                        v-if="key.numVal"
                                        v-model="key.numVal"
                                        size="small"
                                        controls-position="right"
                                        style="width:100%;"
                                        @change="eventsNum(key.numVal,index,btnindex)"
                                    ></el-input-number>
                                    <el-button
                                        :type="key.btnType" 
                                        :plain="key.plain"
                                        style="width:100%;"
                                        @click="eventsAttack(index,btnindex)"
                                    >{{key.default}}</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex_center" style="margin-top:20px;">
                            <span>补时</span>
                            <el-input-number 
                                :min="1" 
                                :max="30" 
                                label="补时"
                                :disabled="minDisable"
                                v-model="minValue" 
                                @change="minChange"
                                @focus="minDisable = true"
                                @blur="minDisable = false"
                            ></el-input-number>
                            <span>分钟</span>
                            <el-button type="primary" plain @click="minAdd">提交补时</el-button>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            :total="8"
            :page-size="5"
            :current-page="currentPageIndex"
            @current-change="currentPage"
            layout="prev, pager, next"
            class="flex flex_center"
            style="margin-top:20px">
        </el-pagination>
    </div>
</template>

<script>
    import { Message } from 'element-ui'
    import { getEventList, postEvents } from '@/scripts/request'
    
    export default {
        name: 'index',
        data() {
            return {
                labelList: [               // 赛事列表对应标题
                    {
                        label: '比赛日期',
                        prop: 'date',
                    },
                    {
                        label: '时间',
                        prop: 'time',
                    },
                    {
                        label: '星期',
                        prop: 'week',
                    },
                    {
                        label: '主队',
                        prop: 'host_team',
                    },
                    {
                        label: '客队',
                        prop: 'visit',
                    },
                    {
                        label: '场地',
                        prop: 'area',
                    }
                ],
                handBtnList: [],           // 主客队开球按钮
                teamBtnList: [],           // 主客队操控按钮
                matchList: [],             // 赛事列表
                getRowKeys(row) {          // 获取当前行id
                    return row.matchId
                },
                expands: [],               // 展开的行数id
                minValue: 1,               // 补时时间值
                type: '',                  // 参数type值
                matchId: -1,               // 赛事id
                minDisable: false,         // 禁止手动输入补时时长
                currentPageIndex: 1,       // 当前页
                eventNum: 1,               // 角球 红牌 黄牌数量
                timeType: 0,               // 上下半场补时 0: 上半场，1: 下半场
            }
        },
        mounted() {
            this.getEventsData()
            this.eventInit()
        },
        methods:{
            // 按钮初始
            eventInit() {
                this.minValue = 1 // 补时时间值
                // 主客队开球按钮
                this.handBtnList = [
                    {
                        text: '主队开球',
                        disabled: false
                    },
                    {
                        text: '客队开球',
                        disabled: false
                    },
                    {
                        text: '上半场结束',
                        disabled: false
                    },
                    {
                        text: '下半场开始',
                        disabled: false
                    }
                ]
                // 主客队操控按钮
                this.teamBtnList = [
                    {
                        i: '1',
                        btnList: [
                            {
                                btnType: 'warning',
                                type1: 'warning',
                                type2: 'danger',
                                text1: '主队进攻',
                                text2: '主队进攻中...',
                                default: '主队进攻',
                                info1: 'AT1',
                                info2: 'OFF_AT1',
                                plain: false,
                            },
                            {
                                btnType: 'success',
                                type1: 'success',
                                type2: 'danger',
                                text1: '主队安全',
                                text2: '主队安全中...',
                                default: '主队安全',
                                plain: false,
                                info1: 'SAFE1',
                                info2: 'CSAFE1',
                            },
                            {
                                btnType: 'danger',
                                type1: 'danger',
                                type2: 'danger',
                                text1: '主队危险进攻',
                                text2: '主队危险中...',
                                default: '主队危险进攻',
                                info1: 'ON_DAT1',
                                info2: 'OFF_DAT1',
                                plain: false,
                            },
                            {
                                btnType: 'info',
                                default: '主队危险任意球',
                                info: 'DFK1'
                            },
                            {
                                btnType: 'success',
                                default: '主队进球确认',
                                info: 'CONF_GOAL1'
                            },
                            {
                                btnType: 'danger',
                                default: '主队进球取消',
                                info: 'CGOAL1'
                            },
                            {
                                btnType: 'danger',
                                default: '主队两黄变一红',
                                info: 'YC_RC1'
                            },
                            {
                                btnType: 'warning',
                                default: '主队黄牌',
                                info: 'YELLCARD1',
                                numVal: 1,
                            },
                            {
                                btnType: 'danger',
                                default: '主队红牌',
                                info: 'REDCARD1',
                                numVal: 1,
                            },
                            {
                                btnType: 'info',
                                default: '主队角球',
                                info: 'CORNER1',
                                numVal: 1,
                            },
                            {
                                btnType: 'info',
                                default: '主队点球',
                                info: 'PENALTY1'
                            },
                            {
                                btnType: 'success',
                                default: '主队点球射进',
                                info: 'IN_PENALTY1'
                            },
                            {
                                btnType: 'danger',
                                default: '主队点球射失',
                                info: 'LOST_PENALTY1'
                            },
                        ]
                    },
                    {
                        i: '2',
                        btnList: [
                            {
                                btnType: 'warning',
                                type1: 'warning',
                                type2: 'danger',
                                text1: '客队进攻',
                                text2: '客队进攻中...',
                                default: '客队进攻',
                                info1: 'AT2',
                                info2: 'OFF_AT2',
                                plain: false,
                            },
                            {
                                btnType: 'success',
                                type1: 'success',
                                type2: 'danger',
                                text1: '客队安全',
                                text2: '客队安全中...',
                                default: '客队安全',
                                info1: 'SAFE2',
                                info2: 'CSAFE2',
                                plain: false,
                            },
                            {
                                btnType: 'danger',
                                type1: 'danger',
                                type2: 'danger',
                                text1: '客队危险进攻',
                                text2: '客队危险中...',
                                default: '客队危险进攻',
                                info1: 'ON_DAT2',
                                info2: 'OFF_DAT2',
                                plain: false,
                            },
                            {
                                btnType: 'info',
                                default: '客队危险任意球',
                                info: 'DFK2'
                            },
                            {
                                btnType: 'success',
                                default: '客队进球确认',
                                info: 'CONF_GOAL2'
                            },
                            {
                                btnType: 'danger',
                                default: '客队进球取消',
                                info: 'CGOAL2'
                            },
                            {
                                btnType: 'danger',
                                default: '客队两黄变一红',
                                info: 'YC_RC2'
                            },
                            {
                                btnType: 'warning',
                                default: '客队黄牌',
                                info: 'YELLCARD2',
                                numVal: 1,
                            },
                            {
                                btnType: 'danger',
                                default: '客队红牌',
                                info: 'REDCARD2',
                                numVal: 1,
                            },
                            {
                                btnType: 'info',
                                default: '客队角球',
                                info: 'CORNER2',
                                numVal: 1,
                            },
                            {
                                btnType: 'info',
                                default: '客队点球',
                                info: 'PENALTY2'
                            },
                            {
                                btnType: 'success',
                                default: '客队点球射进',
                                info: 'IN_PENALTY2'
                            },
                            {
                                btnType: 'danger',
                                default: '客队点球射失',
                                info: 'LOST_PENALTY2'
                            },
                        ]
                    }
                ]
            },
            // 展开行
            toggleRowExpansion(row){
                this.expands = []
                this.eventInit()
                this.expands.push(row.matchId)
                this.matchId = row.matchId
            },
            // 主队,客队开球
            eventsOpen( btnIndex ) {
                if ( btnIndex === 0 ) { // 主队开球
                    this.handBtnList[1].disabled = true
                    this.type = 'KO1'
                    localStorage.clear()
                }
                if ( btnIndex === 1 ) { // 客队开球
                    this.handBtnList[0].disabled = true
                    this.type = 'KO2'
                    localStorage.clear()
                }
                if( btnIndex === 2 ) { // 上半场结束
                    this.type = 'Stop RT1'
                    localStorage.setItem('timeType','0')
                }
                if( btnIndex === 3 ) { // 下半场开始
                    this.type = 'Start RT2'
                    localStorage.setItem('timeType','1')
                }
                this.handBtnList[btnIndex].disabled = true
                // 参数
                let params = {
                    match_id: this.matchId,
                    event:{
                        type: this.type,
                        timestamp: (new Date()).valueOf()
                    }
                }
                this.postEventsData(params)
            },
            // 进攻
            eventsAttack(index, btnIndex) {
                let btnThis = this.teamBtnList[index].btnList[btnIndex]
                if( typeof(btnThis.plain) == 'undefined' ) {
                    this.type = btnThis.info
                } else if(btnThis.plain) {
                    btnThis.default = btnThis.text1
                    btnThis.btnType = btnThis.type1
                    btnThis.plain = false
                    this.type = btnThis.info2
                } else {
                    btnThis.default = btnThis.text2
                    btnThis.btnType = btnThis.type2
                    btnThis.plain = true
                    this.type = btnThis.info1
                }
                // 判断点球 红牌 黄牌数量
                let params = null
                if(btnThis.numVal) {
                    // 参数
                    params = {
                        match_id: this.matchId,
                        event:{
                            stat: btnThis.numVal,
                            type: this.type,
                            timestamp: (new Date()).valueOf()
                        }
                    }
                } else {
                    // 参数
                    params = {
                        match_id: this.matchId,
                        event:{
                            type: this.type,
                            timestamp: (new Date()).valueOf()
                        }
                    }
                }
                this.postEventsData(params)
            },
            // 角球 红牌 黄牌数量
            eventsNum(value,index, btnIndex) {
                this.teamBtnList[index].btnList[btnIndex].numVal = value
            },
            // 补时
            minChange(value) {
                this.minValue = value
            },
            // 提交补时
            minAdd() {
                // 参数
                if(localStorage.getItem('timeType') === '1') {
                    this.type = 'Extra Time2'
                } else {
                    this.type = 'Extra Time1'
                }
                let params = {
                    match_id: this.matchId,
                    event: {
                        stat: this.minValue,
                        type: this.type,
                        timestamp: (new Date()).valueOf()
                    }
                }
                this.postEventsData(params)
            },
            // 分页
            currentPage(val) {
                this.currentPageIndex = val
                this.getEventsData()
            },
            // 获取赛事列表
            getEventsData() {
                // 获取赛事列表
                let _this = this
                let params = {
                    page: _this.currentPageIndex
                }
                getEventList(params).then( res=> {
                    _this.matchList = res
                })
            },
            // 接口方法
            postEventsData(params) {
                postEvents(params).then(res => {
                    if(res === 1) {
                        Message.success('操作成功')
                    } else {
                        Message.error('操作失败')
                    }
                })
            }
        },
        watch: {
            matchId( newVal, oldVal ) {
                let _this = this
                document.onkeydown = function(e) {
                    //事件对象兼容
                    let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
                    let btnThis = ''
                    //按键1
                    if (e1 && e1.keyCode === 49) {
                        btnThis = _this.teamBtnList[0].btnList[0]
                    }
                    //按键2
                    if (e1 && e1.keyCode === 50) {
                        btnThis = _this.teamBtnList[1].btnList[0]
                    }
                    if(e1 && e1.keyCode === 49 || e1 && e1.keyCode === 50) {
                        if(btnThis.plain) {
                            btnThis.default = btnThis.text1
                            btnThis.btnType = btnThis.type1
                            btnThis.plain = false
                            _this.type = btnThis.info2
                        } else {
                            btnThis.default = btnThis.text2
                            btnThis.btnType = btnThis.type2
                            btnThis.plain = true
                            _this.type = btnThis.info1
                        }
                        Message.warning(btnThis.default)
                        let params = {
                            match_id: newVal,
                            event:{
                                type: _this.type,
                                timestamp: (new Date()).valueOf()
                            }
                        }
                        _this.postEventsData(params)
                    }
                }
            }
        }
    }
</script>

<style lang='less' scoped>
    .page-content {
        .btns {
            .teams {
                margin: 20px 0;
                font-size: 18px;
                font-weight: 600;
            }
            .team {
                height: 360px;
                margin-left: 50px;
                &:first-child {
                    margin-left: 0;
                    margin-right: 50px;
                }
                .btn {
                    width: 140px;
                    margin: 0 40px 20px 0;
                }
            }
        }
        span {
            padding: 0 20px;
        }
    }
</style>
<style lang="less">
    .el-input__inner {
        font-size: 16px;
    }
</style>
