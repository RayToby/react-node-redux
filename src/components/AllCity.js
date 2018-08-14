import React, { Component } from 'react';
import { post } from '../actions/request'
import {
    Row,
    Col,
    Table,
    Card
} from 'antd';

export default class AllCity extends Component {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        dataList: [],
        total: 0
    }

    componentDidMount() {
        this.setState({ loading: true });
        post('/getAllCityNew',{
            page: 1,
            pageSize:this.state.pageSize,
            positionName: '',
            education: '',
            city: '',
            workYear: '',
            salary: '',
            companyFullName: '',
            industryField: ''
        }).then((res) => {
            if(res && res.code === 0){
                this.setState({
                    dataList: res.data.dataList,
                    total: res.data.total,
                    loading: false,
                    page: 1
                });
            }

        }).catch((err) => {
                console.error(err)
        });
    }

    onClickPage = (currentPage, pageSize) => {
        this.setState({ loading: true, page: currentPage, pageSize: pageSize });
        // this.props.form.validateFields((err, fieldsValue) => {
        //     if(err) return;
            post('/findData',{
                page: currentPage,
                pageSize:pageSize,
                positionName: '',
                education: '',
                city: '',
                workYear: '',
                salary: '',
                companyFullName: '',
                industryField: ''
            })
            .then((res) => {
                if(res && res.code === 0) {
                    this.setState({
                        dataList: res.data.dataList,
                        total: res.data.total,
                        loading: false
                    });
                }
            })
            .catch((err) => {
                console.error(err)
            });
        // });
    }


    render() {
        const { dataList, total, page, pageSize, loading } = this.state;
        const columns = [{
            title: '企业logo',
            dataIndex: 'companyLogo',
            key: 'companyLogo',
            render: (value, row, index) => {
                const newValue = '//www.lgstatic.com/thumbnail_120x120/'+value;
                return(
                    <img key={index} src={newValue} width="50" alt="**"/>
                )
            }
        }, {
            title: '职位名称',
            dataIndex: 'positionName',
            key: 'positionName',
        }, {
            title: '公司名称',
            dataIndex: 'companyFullName',
            key: 'companyFullName',
        }, {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
        }, {
            title: '薪资',
            dataIndex: 'salary',
            key: 'salary',
        }, {
            title: '融资情况',
            dataIndex: 'financeStage',
            key: 'financeStage',
        }, {
            title: '工作经验',
            dataIndex: 'workYear',
            key: 'workYear',
        }, {
            title: '工作性质',
            dataIndex: 'jobNature',
            key: 'jobNature',
        }, {
            title: '所属领域',
            dataIndex: 'industryField',
            key: 'industryField',
        }, {
            title: '职位福利',
            dataIndex: 'positionAdvantage',
            key: 'positionAdvantage',
        }, {
            title: '职位详情',
            dataIndex: 'positionId',
            key: 'positionId',
            render: (value, row, index) => {
                const positionUrl = 'https://www.lagou.com/jobs/'+value+'.html';
                return(
                    <a key={index} href={positionUrl} target='_blank'>查看详情</a>
                )
            }
        }, {
            title: '公司详情',
            dataIndex: 'companyId',
            key: 'companyId',
            render: (value, row, index) => {
                const companyUrl = 'https://www.lagou.com/gongsi/'+value+'.html';
                return(<a href={companyUrl} key={index} target='_blank'>查看详情</a>)
            }
        }]; 
        let pagination = {
            total: total,
            defaultCurrent: page,
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (current, pageSize) => {
              this.onClickPage(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClickPage(current, pageSize)
            },
        };
        return(
            <div style={{padding: '20'}}>
                <Card>
                    {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
                    <Table 
                        dataSource={dataList}
                        columns={columns}
                        loading={loading}
                        pagination={pagination}  
                        style={{marginTop: '40px',marginBottom:'40px'}}  
                    />
                </Card>
            </div>
        )
    }
}