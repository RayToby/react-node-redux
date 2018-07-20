import React, { PureComponent } from 'react';
import fetch from 'isomorphic-fetch';
// import $ from 'jquery';
import {
    Table
} from 'antd';
import 'antd/dist/antd.css';

export default class Content extends PureComponent {
    state = {
        dataList: [],
        name: '',
        sex: '',
        age: '',
    }

    componentDidMount() {
        // fetch('/introduce')
        // .then((response) => {
        //     if (response.status >= 400) {
        //         throw new Error("Bad response from server");
        //     }
        //     return response.json();
        // })
        // .then((res) => {
        //     this.setState({
        //         data: res,
        //         name: res.name,
        //         sex: res.sex,
        //         age: res.age
        //     });
        // });

        // $.get('http://localhost:8888/introduce',function(res) {
        //     console.log(res)
        // })

        fetch('/laGou')
        .then((response) => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then((res) => {
            let data = eval('(' + res + ')');
            this.setState({
                dataList: data,
            });
        });
    }

    render() {
        const { dataList } = this.state;
        const columns = [{
            title: '企业logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (value, row, index) => {
                return(
                    <img key={index} src={value} width="50"/>
                )
            }
        }, {
            title: '职位名称',
            dataIndex: 'position',
            key: 'position',
        }, {
            title: '公司名称',
            dataIndex: 'company_name',
            key: 'company_name',
        }, {
            title: '地点',
            dataIndex: 'adress',
            key: 'adress',
        }, {
            title: '行业 + 公司情况',
            dataIndex: 'industry',
            key: 'industry',
        }, {
            title: '要求',
            dataIndex: 'requirement',
            key: 'requirement',
            render: (value, row, index) => {
                return(
                    <span key={index}>{value.substring(value.indexOf('经验'))}</span>
                )
            }
        }, {
            title: '薪资',
            dataIndex: 'salary',
            key: 'salary',
        }, {
            title: '公司详情',
            dataIndex: 'detail',
            key: 'detail',
            render: (value, row, index) => {
                return(<a href={value} key={index} target='_blank'>查看详情</a>)
            }
        }]; 
        return(
            <div style={{paddingLeft: '20'}}>
                <div>111</div>
                <Table dataSource={dataList} columns={columns}/>
            </div>
            
        )
    }
}