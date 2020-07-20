<template>
    <div class="page-content">
        <el-table
            stripe
            :data="tableData"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            style="font-size:16px"
        >
            <el-table-column 
                v-for="item in labelList"
                :key="item.label"
                :label="item.label" 
                :prop="item.prop" 
                :width="item.width"
            ></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div class="flex flex_start">
                        <el-button
                            v-for="(item,index) in scope.row.handBtnList"
                            :key="item.text"
                            :disabled="item.disabled" 
                            @click="eventsOpen(scope.$index, scope.row, index)"
                        >{{item.text}}</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <div class="teams flex flex_around">
                        <p>主队</p>
                        <p>客队</p>
                    </div>
                    <div class="flex flex_around">
                        <div class="btn flex flex_column">
                            <el-button
                                v-for="(item,index) in hostBtnList"
                                :key="item.text"
                                :type="item.type" 
                                :plain="item.plain"
                                style="width:100%;margin:0 0 20px 0;"
                                @click="eventsAttack(index,'1')"
                            >{{item.text}}</el-button>
                        </div>
                        <div class="btn flex flex_column">
                            <el-button 
                                v-for="(item,index) in guestBtnList"
                                :key="item.text"
                                :type="item.type" 
                                :plain="item.plain"
                                style="width:100%;margin:0 0 20px 0;"
                                @click="eventsAttack(index,'2')"
                            >{{item.text}}</el-button>
                        </div>
                    </div>
                    <div class="flex flex_center" style="margin-top:20px;">
                        <span>补时</span>
                        <el-input-number 
                            :min="1" 
                            :max="30" 
                            label="补时"
                            v-model="minValue" 
                            @change="minChange"
                        ></el-input-number>
                        <span>分钟</span>
                        <el-button type="primary" plain @click="minAdd">提交补时</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            :total="20"
            :page-size="5"
            layout="prev, pager, next"
            class="flex flex_center"
            style="margin-top:20px">
        </el-pagination>
    </div>
</template>

<script>
    import { Message } from 'element-ui'
    import { getEventList } from '@/scripts/request'
    
    export default {
        name: 'index',
        data() {
            return {
                labelList: [               // 赛事列表对应标题
                    {
                        label: '比赛日期',
                        prop: 'date',
                        width: 110
                    },
                    {
                        label: '时间',
                        prop: 'time',
                        width: 70
                    },
                    {
                        label: '星期',
                        prop: 'week',
                        width: 60
                    },
                    {
                        label: '主队',
                        prop: 'host_team',
                        width: 125
                    },
                    {
                        label: '客队',
                        prop: 'guest_team',
                        width: 125
                    },
                    {
                        label: '场地',
                        prop: 'area',
                        width: 190
                    }
                ],
                hostBtnList: [             // 主队操作按钮列表
                    {
                        type: 'primary',
                        text: '主队危险进攻',
                        plain: false
                    },
                    {
                        type: 'success',
                        text: '主队进攻',
                        plain: false
                    },
                    {
                        type: 'info',
                        text: '主队危险任意球',
                        plain: false
                    },
                    {
                        type: 'warning',
                        text: '主队进球确认',
                        plain: false
                    },
                    {
                        type: 'danger',
                        text: '主队进球取消',
                        plain: false
                    }
                ],
                guestBtnList: [             // 客队操作按钮列表
                    {
                        type: 'primary',
                        text: '客队危险进攻',
                        plain: false
                    },
                    {
                        type: 'success',
                        text: '客队进攻',
                        plain: false
                    },
                    {
                        type: 'info',
                        text: '客队危险任意球',
                        plain: false
                    },
                    {
                        type: 'warning',
                        text: '客队进球确认',
                        plain: false
                    },
                    {
                        type: 'danger',
                        text: '客队进球取消',
                        plain: false
                    }
                ],
                tableData: [
                    {
                        "id": 0,
                        "date": "2020-07-25",
                        "time": "18:00",
                        "week": "六",
                        "host_team": "山东鲁能泰山",
                        "guest_team": "北京中赫国安",
                        "area": '苏州奥林匹克体育中心'
                    },
                    {
                        "id": 1,
                        "date": "2020-07-25",
                        "time": "18:00",
                        "week": "六",
                        "host_team": "广州恒大淘宝",
                        "guest_team": "北京中赫国安",
                        "area": '大连体育中心体育场'
                    },
                    {
                        "id": 2,
                        "date": "2020-07-25",
                        "time": "18:00",
                        "week": "六",
                        "host_team": "山东鲁能",
                        "guest_team": "北京中赫国安",
                        "area": '大连体育中心体育场'
                    },
                    {
                        "id": 3,
                        "date": "2020-07-25",
                        "time": "18:00",
                        "week": "六",
                        "host_team": "山东鲁能",
                        "guest_team": "北京中赫国安",
                        "area": '大连体育中心体育场'
                    },
                    {
                        "id": 4,
                        "date": "2020-07-25",
                        "time": "18:00",
                        "week": "六",
                        "host_team": "山东鲁能",
                        "guest_team": "北京中赫国安",
                        "area": '大连体育中心体育场'
                    }
                ],
                getRowKeys(row) {          // 获取当前行id
                    return row.id
                },
                expands: [],               // 展开的行数id
                minValue: 1,               // 补时时间值
                type: '',                  // 参数type值
                matchId: -1,               // 赛事id
            }
        },
        mounted() {
            this.tableData.forEach(element => {
                // 添加操作按钮
                element.handBtnList = [
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
            })
        },
        methods:{
            // 按钮初始
            eventInit() {
                this.hostBtnList[0].text = '主队危险进攻'
                this.hostBtnList[0].type = 'primary'
                this.hostBtnList[0].plain = false
                this.guestBtnList[0].text = '客队危险进攻'
                this.guestBtnList[0].type = 'primary'
                this.guestBtnList[0].plain = false
            },
            // 主队,客队开球
            eventsOpen(index, row, btnIndex ) {
                this.eventInit()
                this.matchId = row.id
                // 主队开球
                if ( btnIndex === 0 ) {
                    this.expands = []
                    this.expands.push(row.id)
                    row.handBtnList[1].disabled = true
                    this.type = 'KO1'
                }
                // 客队开球
                if ( btnIndex === 1 ) {
                    this.expands = []
                    this.expands.push(row.id)
                    row.handBtnList[0].disabled = true
                    this.type = 'KO2'
                }
                // 上半场结束
                if( btnIndex === 2 ) {
                    this.expands = []
                    this.type = 'Stop RT1'
                }
                // 下半场开始
                if( btnIndex === 3 ) {
                    this.expands = []
                    this.expands.push(row.id)
                    this.type = 'Start RT2'
                }
                row.handBtnList[btnIndex].disabled = true
                // 参数
                let params = {
                    match_id: row.id,
                    event:{
                        type: this.type,
                        timestamp: Date.parse(new Date())
                    }
                }
            },
            // 进攻
            eventsAttack(index, team) {
                if(this.matchId === -1) {
                    Message.error('请先选择开球')
                } else {
                    // 危险进攻
                    if(index === 0) {
                        if (team === '1') {
                            if(this.hostBtnList[index].plain) {
                                this.hostBtnList[index].text = '主队危险进攻'
                                this.hostBtnList[index].type = 'primary'
                                this.hostBtnList[index].plain = false
                                this.type = 'OFF_DAT' + team
                            } else {
                                this.hostBtnList[index].text = '主队危险中...'
                                this.hostBtnList[index].type = 'danger'
                                this.hostBtnList[index].plain = true
                                this.type = 'ON_DAT' + team
                            }
                        } else {
                            if(this.guestBtnList[index].plain) {
                                this.guestBtnList[index].text = '客队危险进攻'
                                this.guestBtnList[index].type = 'primary'
                                this.guestBtnList[index].plain = false
                                this.type = 'OFF_DAT' + team
                            } else {
                                this.guestBtnList[index].text = '客队危险中...'
                                this.guestBtnList[index].type = 'danger'
                                this.guestBtnList[index].plain = true
                                this.type = 'ON_DAT2' + team
                            }
                        }
                    }
                    // 进攻
                    if(index === 1) {
                        this.type = 'AT' + team
                    }
                    // 危险任意球
                    if(index === 2) {
                        this.type = 'DFK' + team
                    }
                    // 进球确认
                    if(index === 3) {
                        this.type = 'CONF_GOAL' + team
                    }
                    // 进球取消
                    if(index === 4) {
                        this.type = 'CGOAL' + team
                    }
                    // 参数
                    let params = {
                        match_id: this.matchId,
                        event:{
                            type: this.type,
                            timestamp: Date.parse(new Date())
                        }
                    }
                }
            },
            // 补时
            minChange(value) {
                this.minValue = value
            },
            // 提交补时
            minAdd() {
                // 参数
                if(this.type === 'Start RT2') {
                    this.type = 'Extra Time2'
                } else {
                    this.type = 'Extra Time1'
                }
                let params = {
                    match_id: this.matchId,
                    event:{
                        stat: this.minValue,
                        type: this.type,
                        timestamp: Date.parse(new Date())
                    }
                }
            }
        },
        watch: {
            matchId(oldVal,newVal) {
                document.onkeydown = function(e) {
                    //事件对象兼容
                    let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
                    //按键1
                    if (e1 && e1.keyCode == 49) {
                        Message.success('主队进攻')
                        this.type = 'AT1'
                    }
                    //按键2
                    if (e1 && e1.keyCode == 50) {
                        Message.success('客队进攻')
                        this.type = 'AT2'
                    }
                    let params = {
                        match_id: newVal,
                        event:{
                            type: this.type,
                            timestamp: Date.parse(new Date())
                        }
                    }
                }
            }
        }
    }
</script>

<style lang='less' scoped>
    .page-content {
        .teams {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .btn {
            width: 160px;
        }
        span {
            padding: 0 20px;
        }
    }
</style>

<style lang="less">
    .el-table__expand-column {
        .cell {
            display: none;
        }
    }
</style>
