<template>
    <div class="data-content" v-if="dataS">
        <el-row>
            <el-col :xs="16" :sm="16" :md="18" :lg="24" :xl="24">
                <div class="header flex flex_between">
                    <div
                        :class="[
                            'block',
                            {
                                'safe': dataS.event.type.indexOf('1') > -1 && safeList.includes(dataS.event.type),
                                'danger': dataS.event.type.indexOf('1') > -1 && dangerList.includes(dataS.event.type),
                                'offense': dataS.event.type.indexOf('1') > -1 && offenseList.includes(dataS.event.type),
                                'unimport': dataS.event.type.indexOf('1') > -1 && unimportList.includes(dataS.event.type)
                            }
                        ]"
                    >
                        <p>[{{gameTime}}]</p>
                        <div class="team flex flex_center">
                            <span>山东鲁能泰山</span>
                            <span class="score">
                                {{pageParam.scoreA}}
                            </span>
                        </div>
                    </div>
                    <div
                        :class="[
                            'block',
                            {
                                'safe': dataS.event.type.indexOf('2') > -1 && safeList.includes(dataS.event.type),
                                'danger': dataS.event.type.indexOf('2') > -1 && dangerList.includes(dataS.event.type),
                                'offense': dataS.event.type.indexOf('2') > -1 && offenseList.includes(dataS.event.type),
                                'unimport': dataS.event.type.indexOf('2') > -1 && unimportList.includes(dataS.event.type)
                            }
                        ]"
                    >
                        <div class="match">
                            <span>中超</span>
                            <span>2020/07/25 18:00</span>
                        </div>
                        <div class="team flex flex_center">
                            <span class="score">
                                {{pageParam.scoreB}}
                            </span>
                            <span>北京中赫国安</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="16" :sm="16" :md="18" :lg="24" :xl="24">
                <div class="left" ref="chat_main">
                    <div ref="events_list"
                        :class="['list',
                            {
                                'safe': safeList.includes(item.event.type),
                                'danger': dangerList.includes(item.event.type),
                                'offense': offenseList.includes(item.event.type),
                                'unimport': unimportList.includes(item.event.type)
                            }
                        ]"
                        v-for="item in eventsList"
                        :key=""
                    >
                        <span>
                            {{new Date(parseInt(item.event.timestamp)).toLocaleTimeString()}}
                        </span>
                        <span>[{{item.event.game_time}}]</span>
                        <span>{{item.event.type}}</span>
                        <span>{{item.event.explain}}</span>
                        <span 
                            :class="[
                                'block',
                                item.event.type.indexOf('1') > -1 ? 'home' : 'away'
                            ]"
                        >
                                {{item.event.type.indexOf('1') > -1 ? 'Home': 'Away'}}
                        </span>
                        <span>
                            {{
                                safeList.includes(item.event.type)?'Safe':
                                dangerList.includes(item.event.type)?'Danger':
                                offenseList.includes(item.event.type)?'Offense':
                                unimportList.includes(item.event.type)?'':''
                            }}
                        </span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="16" :sm="16" :md="18" :lg="24" :xl="24">
                <div class="right">
                    <p class="title">赛事技术统计</p>
                    <div class="list flex flex_around"
                        v-for="item in datasList"
                        :key="item.info">
                        <p>{{item.home}}</p>
                        <p>{{item.info}}</p>
                        <p>{{item.away}}</p>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { MessageBox, Message } from 'element-ui'
    import { getUrlParam } from '@/scripts/utils'

    export default {
        data() {
            return {
                eventsList: [],       // 赛事事件列表
                datasList: [          // 统计列表
                    {
                        home: 0,
                        away: 0,
                        info: '进球',
                        type1: 'GOAL1',
                        type2: 'GOAL2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '角球',
                        type1: 'CR1',
                        type2: 'CR2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '任意球',
                        type1: 'FK1',
                        type2: 'FK2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '点球',
                        type1: 'PEN1',
                        type2: 'PEN2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '替补',
                        type1: 'SUB1',
                        type2: 'SUB2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '犯规',
                        type1: 'F1',
                        type2: 'F2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '红牌',
                        type1: 'RC1',
                        type2: 'RC2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '黄牌',
                        type1: 'YC1',
                        type2: 'YC2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '射门',
                        type1: 'GK1',
                        type2: 'GK2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '射正',
                        type1: 'SHG1',
                        type2: 'SHG2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '射偏',
                        type1: 'SHB1',
                        type2: 'SHB2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '越位',
                        type1: 'O1',
                        type2: 'O2',
                    },
                    {
                        home: 0,
                        away: 0,
                        info: '界外球',
                        type1: 'TI1',
                        type2: 'TI2',
                    },
                    
                ],
                safeList: [    // 安全事件
                    'Start','Stop','SUB1',
                    'SUB2','SHB1','SHB2',
                    'KO1','KO2','Start RT2',
                    'Stop RT1','OFF_DAT'
                ],
                dangerList: [   // 危险事件
                    'SHG1','SHG2','GOAL1','GOAL2',
                    'RC1','RC2','YC1','YC2',
                    'F1','F2','ON_DAT1','ON_DAT2'
                ],
                offenseList: [   // 进攻事件
                    'CR1','CR2','FK1','FK2',
                    'PEN1','PEN2','GK1','GK2'
                ],
                unimportList: [   // 不重要事件
                    'O1','O2','TI1','TI2'
                ],
                eventArr: [    // 重要事件弹窗
                    {
                        event: 'GOAL1',
                        info: '主队进球'
                    },
                    {
                        event: 'GOAL2',
                        info: '客队进球'
                    },
                    {
                        event: 'RC1',
                        info: '主队红牌'
                    },
                    {
                        event: 'RC2',
                        info: '客队红牌'
                    },
                    {
                        event: 'PEN1',
                        info: '主队点球'
                    },
                    {
                        event: 'PEN2',
                        info: '客队点球'
                    },
                    {
                        event: 'CR1',
                        info: '主队角球'
                    },
                    {
                        event: 'CR2',
                        info: '客队角球'
                    }
                ],
                websock: null,      // WebSocket
                pageParam: {},      // 页面参数 
                dataS: null,        // webSocket最新数据
                timer: null,        // 定时器
                // 分钟
                minute: localStorage.getItem('minute') || 0,
                // 秒
                second: localStorage.getItem('second') || 0,
                // 比赛静时间
                gameTime: '00:00'
            }
        },
        mounted () {
            this.pageParam = {
                scoreA: 0,
                scoreB: 0,
                match: getUrlParam('match'),
                date: getUrlParam('date'),
                teamA: getUrlParam('teamA'),
                teamB: getUrlParam('teamB')
            }
            // 初始化
            this.initWebSocket()
            if(localStorage.getItem('minute') || localStorage.getItem('second')) {
                this.startTime(true)
            }
        },
        methods: {
            // 初始化weosocket
            initWebSocket(){ 
                const wsuri = "ws://47.95.42.37/bcjj/football/websocket/server"
                this.websock = new WebSocket(wsuri)
                this.websock.onmessage = this.websocketonmessage
                this.websock.onerror = this.websocketonerror
                this.websock.onclose = this.websocketclose
            },
            // 连接建立失败重连
            websocketonerror(){
                this.initWebSocket()
            },
            // 数据接收
            websocketonmessage(e){
                const redata = JSON.parse(e.data)
                // console.log(redata)
                this.dataS = redata
                // 赛事统计
                this.datasCount(redata)
                let goalArr = ['GOAL1','GOAL2']
                if(goalArr.includes(redata.event.type)) {
                    this.pageParam.scoreA = redata.event.scoreA
                    this.pageParam.scoreB = redata.event.scoreB
                }
                // 事件滚动
                this.eventsList.push(redata)
                let _this = this
                this.$nextTick(() => {
                    _this.$refs.chat_main.scrollTop = _this.$refs.chat_main.scrollHeight
                })
                // 重要事件弹框
                this.eventArr.forEach( e => {
                    if(e.event === redata.event.type) {
                        MessageBox.alert(e.info)
                    }
                })
            },
            // 关闭
            websocketclose(e){
                console.log('断开连接',e)
                Message.error('连接断开')
            },
            // 赛事统计
            datasCount(data) {
                if(!data.event.stat) {
                    let goalArr = ['GOAL1','GOAL2']
                    if(goalArr.includes(data.event.type)) {
                        this.datasList[0].home = data.event.scoreA
                        this.datasList[0].away = data.event.scoreB
                    }
                } else {
                    this.datasList.forEach( e => {
                        if(e.type1 === data.event.type) {
                            e.home = data.event.stat
                        } else if(e.type2 === data.event.type) {
                            e.away = data.event.stat
                        }
                    })
                }
            },
            // 比赛时间计时
            startTime(bolean) {
                let _this = this
                if (bolean === true) {
                    _this.timer = setInterval(function () {
                        if (_this.second >= 0) {
                            _this.second++
                        }
                        if (_this.second > 59) {
                            _this.second = 0
                            _this.minute++
                        }
                        let gameSecond, gameMinute
                        if(_this.second < 10) {
                            gameSecond = `0${_this.second}`
                        } else {
                            gameSecond = _this.second
                        }
                        if(_this.minute < 10) {
                            gameMinute = `0${_this.minute}`
                        } else {
                            gameMinute = _this.minute
                        }
                        localStorage.setItem('minute',gameMinute)
                        localStorage.setItem('second',gameSecond)
                        _this.gameTime = `${gameMinute}:${gameSecond}`
                    }, 1000)
                } else {
                    clearInterval(_this.timer)
                }
            }
        },
        destroyed () {
            // 销毁监听
            this.websock.close()
        },
        watch: {
            dataS(newVal,old) {
                // 比赛静时间
                if(this.dataS && this.dataS.event.type === 'Start') {
                    this.startTime(true)
                }
                if(this.dataS && this.dataS.event.type === 'Stop RT1') {
                    this.startTime(false)
                    this.gameTime = '45:00'
                    localStorage.setItem('minute',45)
                    localStorage.setItem('second',0)
                }
                if(this.dataS && this.dataS.event.type === 'Start RT2') {
                    this.startTime(true)
                }
                if(this.dataS && this.dataS.event.type === 'Stop') {
                    this.startTime(false)
                    localStorage.removeItem('minute')
                    localStorage.removeItem('second')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @home: #8A2BE2;
    @away: #FF8C00;
    @bg1: #83b271;
    @bg2: #f67280;
    @bg3: #ffb480;
    @bg5: #eaeaea;
    .data-content {
        width: 880px;
        margin: 0 auto;
        .header {
            margin-bottom: 10px;
            background-color: #ebeef5;
            border-radius: 0 0 4px 4px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            .block {
                width: calc(50%);
                padding: 10px 0 15px;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                p {
                    text-align: right;
                    font-weight: 600;
                    margin-right: 20px;
                }
                .match {
                    span {
                        padding: 0 15px;
                    }
                }
                .team {
                    font-size: 22px;
                    padding-top: 10px;
                    .score {
                        font-size: 30px;
                        padding: 0 50px;
                        font-weight: 600;
                    }
                }
            }
        }
        .left {
            height: 550px;
            overflow-y: auto;
            overflow-x: hidden;
            .list {
                color: #000;
                padding: 5px 0;
                margin-bottom: 5px;
                border-radius: 4px;
                span {
                    margin-left: 20px;
                }
                .block {
                    padding: 0 3px;
                    border-radius: 2px;
                    background-color: #fff;
                    &.home {
                        color: @home;
                    }
                    &.away {
                        color: @away;
                    }
                }
            }
        }
        .right {
            height: 550px;
            .title {
                color: #eff0f4;
                padding: 10px 0;
                text-align: center;
                background-color: #65799b;
                border-bottom: 1px solid #d6e4f0;
            }
            .list {
                border-bottom: 1px solid #d6e4f0;
                p {
                    width: 100px;
                    padding: 7px 0;
                    font-weight: 600;
                    &:nth-child(2) {
                        color: #020438;
                        font-weight: 400;
                        text-align: center;
                        background-color: #a6d0e4;
                    }
                    &:nth-child(3) {
                        text-align: right;
                    }
                }
            }
        }
        .left,
        .right {
            padding: 20px;
            border-radius: 4px;
            box-sizing: border-box;
            background-color: #fff;
            border: 1px solid #ebeef5;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
    }
    .safe {
        background-color: @bg1;
    }
    .danger {
        background-color: @bg2;
    }
    .offense {
        background-color: @bg3;
    }
    .unimport {
        background-color: @bg5;
    }
</style>
