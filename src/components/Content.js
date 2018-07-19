import React, { PureComponent } from 'react';
import fetch from 'isomorphic-fetch';
// import $ from 'jquery';
import {
    Table
} from 'antd';
import 'antd/dist/antd.css';

export default class Content extends PureComponent {
    state = {
        data: [],
        name: '',
        sex: '',
        age: '',
    }

    componentDidMount() {
        fetch('/introduce')
        .then((response) => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then((res) => {
            this.setState({
                data: res,
                name: res.name,
                sex: res.sex,
                age: res.age
            });
        });
        // $.get('http://localhost:8888/introduce',function(res) {
        //     console.log(res)
        // })
    }

    render() {
        const { data } = this.state;
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
          }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
        }]; 
        return(
            <div style={{paddingLeft: '20'}}>
                <div>111</div>
                <Table dataSource={data} columns={columns}/>
            </div>
            
        )
    }
}