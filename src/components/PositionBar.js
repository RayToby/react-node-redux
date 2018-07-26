import React, { Component } from 'react';
import{
    Row,
    Col
} from 'antd';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { post } from '../actions/request';

export default class PositionBar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.getCityPosition();
    }

    getCityPosition = () => {
        post('/findCityPosition',{
           
        })
        .then((res) => {
            if(res && res.code === 0) {
                const data = res.data;
                let newDataBar = [];
                let newDataPie = [];
                let xian = {},beijing = {},shanghai = {},shenzhen = {},guangzhou = {},chengdu = {},hefei = {},zhengzhou = {},hangzhou = {},nanjing = {},fuzhou = {},xiamen = {},chongqing = {},changsha = {},wuhan = {};
                newDataBar.push(data.counts_xian, data.counts_beijing, data.counts_shanghai, data.counts_shenzhen, data.counts_guangzhou, data.counts_chengdu, data.counts_hefei, data.counts_zhengzhou, data.counts_hangzhou, data.counts_nanjing, data.counts_fuzhou, data.counts_xiamen, data.counts_chongqing, data.counts_changsha, data.counts_wuhan )
                for( let i in data) {
                    switch(i) {
                        case 'counts_xian':
                            xian.value = data[i];
                            xian.name = '西安';
                            break;
                        case 'counts_beijing':
                            beijing.value = data[i];
                            beijing.name = '北京';
                            break;
                        case 'counts_shanghai':
                            shanghai.value = data[i];
                            shanghai.name = '上海';
                            break;
                        case 'counts_shenzhen':
                            shenzhen.value = data[i];
                            shenzhen.name = '深圳';
                            break;
                        case 'counts_guangzhou':
                            guangzhou.value = data[i];
                            guangzhou.name = '广州';
                            break;
                        case 'counts_chengdu':
                            chengdu.value = data[i];
                            chengdu.name = '成都';
                            break;
                        case 'counts_hefei':
                            hefei.value = data[i];
                            hefei.name = '合肥';
                            break;
                        case 'counts_zhengzhou':
                            zhengzhou.value = data[i];
                            zhengzhou.name = '郑州';
                            break;
                        case 'counts_hangzhou':
                            hangzhou.value = data[i];
                            hangzhou.name = '杭州';
                            break;
                        case 'counts_nanjing':
                            nanjing.value = data[i];
                            nanjing.name = '南京';
                            break;
                        case 'counts_fuzhou':
                            fuzhou.value = data[i];
                            fuzhou.name = '福州';
                            break;
                        case 'counts_xiamen':
                            xiamen.value = data[i];
                            xiamen.name = '厦门';
                            break;
                        case 'counts_chongqing':
                            chongqing.value = data[i];
                            chongqing.name = '重庆';
                            break;
                        case 'counts_changsha':
                            changsha.value = data[i];
                            changsha.name = '长沙';
                            break;
                        case 'counts_wuhan':
                            wuhan.value = data[i];
                            wuhan.name = '武汉';
                            break;
                        
                    }
                }
                newDataPie.push(xian,beijing,shanghai,shenzhen,guangzhou,chengdu,hefei,zhengzhou,hangzhou,nanjing,fuzhou,xiamen,chongqing,changsha,wuhan);
                this.toBar(newDataBar);
                this.toPie(newDataPie);
            }
        })
        .catch((err) => {
            console.error(err)
        });
        
    }

    toBar = (data) => {
        var myChart = echarts.init(document.getElementById('bar'));
        // 绘制图表
        myChart.setOption({
            title: { text: '各大城市职位数' },
            tooltip: {},
            xAxis: {
                data: ["西安", "北京", "上海", "深圳", "广州", "成都", "合肥", "郑州", "杭州", "南京", "福州", "厦门", "重庆", "长沙", "武汉"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: data
            }]
        });
    }

    toPie = (data) => {
        var myChart = echarts.init(document.getElementById('pie'));
        // 绘制图表
        myChart.setOption({
            title : {
                text: '各大城市职位数占比',
                subtext: '数据来自拉钩',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ["西安", "北京", "上海", "深圳", "广州", "成都", "合肥", "郑州", "杭州", "南京", "福州", "厦门", "重庆", "长沙", "武汉"]
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });
    }

    render() {
        return(
            <div>
                <Row  gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24}>
                        <div id="bar" style={{ width: 800, height: 600 }}></div>
                    </Col>
                    <Col md={12} sm={24}>
                        <div id="pie" style={{ width: 800, height: 600 }}>111</div>
                    </Col>
                </Row>
            </div>
        )
    }
}