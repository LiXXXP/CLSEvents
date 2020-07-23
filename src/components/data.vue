<template>
    <div class="page-content">
        <div class="header">
            <p>
                <span>[90:00]</span>
                <span>中超</span>
                <span>2020/07/25 18:00</span>
            </p>
            <div class="team flex flex_center">
                <div class="flex flex_center">
                    <span>山东鲁能泰山</span>
                    <span class="score">0</span>
                </div>
                <p>vs</p>
                <div class="flex flex_center">
                    <span class="score">0</span>
                    <span>北京中赫国安</span>
                </div>
            </div>
        </div>
        <div class="flex flex_between">
            <div class="left" ref="chat_main">
                <div ref="events_list"
                    :class="['list',
                        safeList.includes(item.event.type)?'Safe':
                        dangerList.includes(item.event.type)?'Danger':
                        offenseList.includes(item.event.type)?'Offense':''
                    ]"
                    v-for="item in eventsList"
                    :key=""
                >
                    <span>
                        {{new Date(parseInt(item.event.timestamp)).toLocaleTimeString()}}
                    </span>
                    <span>[{{item.event.game_time}}]</span>
                    <span>{{item.event.type}}</span>
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
                            offenseList.includes(item.event.type)?'Offense':''
                        }}
                    </span>
                </div>
            </div>
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
        </div>
    </div>
</template>

<script>
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
                safeList: [
                    'Start','Stop','SUB1',
                    'SUB2','SHB1','SHB2',
                    'O1','O2','TI1','TI2',
                    'KO1','KO2','Start RT2',
                    'Stop RT1','OFF_DAT'
                ],
                dangerList: [
                    'SHG1','SHG2','GOAL1','GOAL2',
                    'RC1','RC2','YC1','YC2',
                    'F1','F2','ON_DAT1','ON_DAT2'
                ],
                offenseList: [
                    'CR1','CR2','FK1','FK2',
                    'PEN1','PEN2','GK1','GK2'
                ],
                websock: null,     // WebSocket
                pageParam: {},     // 页面参数
            }
        },
        mounted () {
            this.pageParam = {
                time: getUrlParam('game_time')
            }
            // 初始化
            this.initWebSocket()
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
                console.log(redata)
                this.datasCount(redata)
                this.eventsList.push(redata)
                let _this = this
                this.$nextTick(() => {
                    _this.$refs.chat_main.scrollTop = _this.$refs.chat_main.scrollHeight
                })
            },
            // 关闭
            websocketclose(e){
                console.log('断开连接',e)
            },
            // 赛事统计
            datasCount(data) {
                this.datasList.forEach( e => {
                    if(e.type1 === data.event.type) {
                        e.home = data.event.stat
                        if(!data.event.stat) {
                            e.home = data.event.scoreA
                        }
                    } else if(e.type2 === data.event.type) {
                        e.away = data.event.stat
                        if(!data.event.stat) {
                            e.away = data.event.scoreB
                        }
                    }
                })
            }
        },
        destroyed () {
            // 销毁监听
            this.websock.close()
        }
    }
</script>

<style lang="less" scoped>
    @home: #8A2BE2;
    @away: #FF8C00;
    @bg1: #83b271;
    @bg2: #f67280;
    @bg3: #ffb480;
    @bg4: #7a9eb1;
    .page-content {
        .header {
            height: 100px;
            padding: 20px 0;
            margin-bottom: 30px;
            background-color: #ebeef5;
            border-radius: 4px;
            border: 1px solid #ebeef5;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            p {
                text-align: center;
                span {
                    padding: 0 10px;
                    &:first-child {
                        font-weight: 600;
                    }
                }
            }
        }
        .team {
            font-size: 22px;
            margin-top: 30px;
            .score {
                font-size: 30px;
                padding: 0 50px;
                font-weight: 600;
            }
        }
        .left {
            width: 650px;
            height: 600px;
            overflow-y: auto;
            overflow-x: hidden;
            .list {
                color: #fff;
                padding: 5px 0;
                margin-bottom: 5px;
                border-radius: 4px;
                background-color: @bg4;
                &.Safe {
                    background-color: @bg1;
                }
                &.Danger {
                    background-color: @bg2;
                }
                &.Offense {
                    background-color: @bg3;
                }
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
            width: 450px;
            height: 600px;
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
</style>
