import React, { PureComponent } from 'react';
// import $ from 'jquery';
import {
    Table,
    Col,
    Row,
    Card,
    Form,
    Select,
    Input,
    Button,
    Radio
} from 'antd';
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.js';
import { post } from '../actions/request';
import styles from '../style/style.less';
import PositionBar from './PositionBar';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
class Content extends PureComponent {
    state = {
        dataList: [],
        name: '',
        sex: '',
        age: '',
        page: 1,
        pageSize: 10,
        loading: false
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

        this.getDataList();
    }
    //请求数据
    getDataList = () => {
        this.setState({ loading: true });
        this.props.form.validateFields((err, fieldsValue) => {
            if(err) return;
            post('/findData',{
                page: 1,
                pageSize: this.state.pageSize,
                ...fieldsValue
            })
            .then((res) => {
                if(res && res.code === 0) {
                    this.setState({
                        dataList: res.data.dataList,
                        total: res.data.total,
                        loading: false,
                        page: 1
                    });
                }
            })
            .catch((err) => {
                console.error(err)
            });
        });
    }

    onClickPage = (currentPage, pageSize) => {
        this.setState({ loading: true, page: currentPage, pageSize: pageSize });
        this.props.form.validateFields((err, fieldsValue) => {
            if(err) return;
            post('/findData',{
                page: currentPage,
                pageSize: pageSize,
                ...fieldsValue
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
        });
    }

    reset = () => {
        this.setState({ loading: true });
        this.props.form.resetFields();
        post('/findData',{
            page: 1,
            pageSize: 10,
        })
        .then((res) => {
            if(res && res.code === 0) {
                this.setState({
                    dataList: res.data.dataList,
                    total: res.data.total,
                    loading: false,
                    page: 1,
                    pageSize: 10
                });
            }
        })
        .catch((err) => {
            console.error(err)
        });
    }

    onRadioChange = () => {

    }

    renderForm = () => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
        return (
        <Form >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="公司名称" {...formItemLayout}>
                    {getFieldDecorator('company_name',{
                        initialValue: "",
                    })(<Input placeholder="请输入公司名称"/>)}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="职位" {...formItemLayout}>
                    {getFieldDecorator('position',{
                        initialValue: "",
                    })(<Input placeholder="请输入职位名称"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="地点" {...formItemLayout}>
                        {getFieldDecorator('address',{
                            initialValue: "",
                        })(<Input placeholder="请输入地点"/>
                            )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                    <FormItem label="薪资范围" {...formItemLayout}>
                    {getFieldDecorator('salary',{
                        initialValue: "",
                    })(
                        <RadioGroup onChange={this.onRadioChange}>
                            <Radio value={''}>不限</Radio>
                            <Radio value={1}>小于5k</Radio>
                            <Radio value={2}>5-10k</Radio>
                            <Radio value={3}>10-15k</Radio>
                            <Radio value={4}>15-25k</Radio>
                            <Radio value={5}>大于25k</Radio>
                        </RadioGroup>
                    )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <span className={styles.submitButtons}>
                        <Button type="primary" htmlType="submit" onClick={() => this.getDataList()}>
                            查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                            重置
                        </Button>
                    </span>
                </Col>
            </Row>
        </Form>
        );
    }

    render() {
        const { dataList, total, page, pageSize, loading } = this.state;
        const columns = [{
            title: '企业logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (value, row, index) => {
                return(
                    <img key={index} src={value} width="50" alt="**"/>
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
            dataIndex: 'address',
            key: 'address',
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
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    <Table 
                        dataSource={dataList}
                        columns={columns}
                        loading={loading}
                        pagination={pagination}  
                        style={{marginTop: '40px',marginBottom:'40px'}}  
                    />
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={24} sm={24}>
                            <p>城市职位</p>
                            <PositionBar />
                        </Col>
                        {/* <Col md={12} sm={24}>
                            
                        </Col> */}
                    </Row>
                </Card>
            </div>
            
        )
    }
}

export default Form.create()(Content);