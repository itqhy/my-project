import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Form,
    Card,
    Button,
    DatePicker,
    Badge,
    Divider,
    Row,
    Col,
    Input,
    Select,
    Modal,
    message,
    Popconfirm
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './UserTableList.less';


const status = ['正常', '锁定'];
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD";

const CreateForm = Form.create()(props => {
    const { modalVisible, form, handleAdd, handleModalVisible, modalStatus, record, handleUpdate } = props;
    const { getFieldDecorator, getFieldsValue } = form;
    const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 16 },
    };


    const handleAddData = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            handleAdd(fieldsValue);
        });
    }

    const handleUpdData = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            handleUpdate(fieldsValue);
        });
    }


    return (
        <Modal title={modalStatus == 'update' ? '编辑用户' : '新建用户'}
            visible={modalVisible}
            destroyOnClose={true}
            onOk={modalStatus === 'update' ? handleUpdData : handleAddData}
            onCancel={() => handleModalVisible()} width={600}>
            <Form layout="horizontal">
                <Row gutter={8}>
                    <Col md={12} sm={24}>
                        <FormItem label="账号" {...formItemLayout}>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入账号' }],
                                initialValue: modalStatus === 'update' ? (record ? record.username : '') : ''
                            })(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24}>
                        <FormItem label="姓名" {...formItemLayout}>
                            {getFieldDecorator('realname', {
                                rules: [{ required: true, message: '请输入姓名' }],
                                initialValue: modalStatus === 'update' ? (record ? record.realname : '') : ''
                            })(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    {modalStatus === 'update' &&
                        <Col md={0} sm={0}>
                            <FormItem>
                                {getFieldDecorator('userId', { initialValue: record.userId })(<Input />)}
                            </FormItem>
                        </Col>
                    }
                </Row>
                <Row gutter={8}>
                    <Col md={12} sm={24}>
                        <FormItem label="邮箱" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: '请输入邮箱' },
                                { type: 'email', message: '请输入正确的邮箱格式' },],
                                initialValue: modalStatus === 'update' ? (record ? record.email : '') : ''
                            })(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24}>
                        <FormItem label="电话" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入联系方式' },],
                                initialValue: modalStatus === 'update' ? (record ? record.phone : '') : ''
                            })(<Input placeholder="请输入" />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col md={12} sm={24}>
                        <FormItem label="性别" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('sex', {
                                rules: [{ required: true, message: '请选择性别' }],
                                initialValue: modalStatus === 'update' ? (record && String(record.sex)) : undefined
                            })(<Select placeholder="请选择性别" style={{ width: 180 }} allowClear>
                                <Select.Option key="1">男</Select.Option>
                                <Select.Option key="0">女</Select.Option>
                            </Select>)}
                        </FormItem>
                    </Col>

                    {/* <Col md={12} sm={24}>
                        <FormItem label="出生日期" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('birthday', {
                                rules: [{ required: true, message: '请选择出生日期' },],
                                initialValue: modalStatus === 'update' ? (record ? moment(record.birthday) : null) : null
                            })(<DatePicker placeholder="请选择出生日期" style={{ width: 180 }} allowClear />)
                            }
                        </FormItem>
                    </Col> */}

                </Row>
            </Form>
        </Modal>
    );
});




@connect(({ user, loading }) => ({
    user,
    loading: loading.models.user
}))
@Form.create()
export default class UserList extends React.Component {
    state = {
        modalVisible: false,
        selectedRows: [],
        formValues: {},
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'user/fetch',
        });
    }

    handleSearch = e => {
        e.preventDefault();

        const { form, dispatch } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.setState({ formValues: fieldsValue });

            if (fieldsValue['createtime'] != undefined) {
                fieldsValue = {
                    ...fieldsValue,
                    'createtime': fieldsValue['createtime'].format(dateFormat)
                }
            }


            dispatch({
                type: 'user/fetch',
                payload: fieldsValue,
            });

        });
    }


    handleStandardTableChange = (pagination, filtersArg, sorter) => {

        const { dispatch } = this.props;
        const { formValues } = this.state;

        const params = {
            current: pagination.current,
            size: pagination.pageSize,
            ...formValues,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}`;
            params.order = `${sorter.order}`;
        }

        dispatch({
            type: 'user/fetch',
            payload: params,
        });
    }

    //新增
    handleAdd = (fields) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'user/add',
            payload: fields,
            callback: (result) => {
                if (result.code === 0) {
                    message.success('添加成功');
                    this.setState({ modalVisible: false });
                } else {
                    message.error(result.message);
                }
            }
        });
    }
    //修改
    handleUpdate = (fields) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'user/update',
            payload: fields,
            callback: (result) => {
                if (result.code === 0) {
                    message.success('修改成功');
                    this.setState({ modalVisible: false });
                } else {
                    message.error(result.message);
                }
            }
        });
    }


    //重置查询条件
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        dispatch({ type: 'user/fetch', });
    }

    //表格选中
    handleSelectRows = (rows) => {
        this.setState({ selectedRows: rows })
    }

    //批量删除
    handleDelteBeatch = () => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;
        if (!selectedRows) return;
        Modal.confirm({
            title: '你确定要删除吗?',
            onOk() {
                dispatch({

                    type: 'user/deleteBatch',
                    payload: { no: selectedRows.map(row => row.id).join('-') },

                    callback: (result) => {
                        if (result.code == 0) {
                            message.success('删除成功');
                            console.log(this)
                            // this.setState({ selectRows: [] });
                        } else {
                            message.error(result.message);
                        }
                    }

                });
            },
        })

    }

    //删除
    deleteHandler = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'user/remove',
            payload: { userId: id },
            callback: (result) => {
                if (result.code === 0) {
                    message.success('删除成功');
                } else {
                    message.error(result.message);
                }
            }
        })
    }


    //隐藏显示form
    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
        });
    }

    handleAddModalVisible = flag => {
        this.setState({
            modalStatus: 'add',
            modalVisible: !!flag
        })
    }

    handleEditModalVisible = (flag, record) => {
        this.setState({
            modalVisible: !!flag,
            record: record,
            modalStatus: 'update'
        });
    }


    renderForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSearch}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="用户名称">
                            {getFieldDecorator('username')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="状态">
                            {getFieldDecorator('locked')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Select.Option value="0">启用</Select.Option>
                                    <Select.Option value="1">冻结</Select.Option>
                                </Select>)
                            }
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="注册日期">
                            {getFieldDecorator('createtime')(<DatePicker style={{ width: '100%' }} format={dateFormat} placeholder="请输入注册日期" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                查询
                             </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                            </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {

        const { loading, user: { data } } = this.props;
        const { modalVisible, modalStatus, record, selectedRows } = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleUpdate: this.handleUpdate,
            handleModalVisible: this.handleModalVisible,
        }


        const columns = [
            {
                title: 'ID',
                dataIndex: 'userId',
                align: 'center'
            },
            {
                title: '账号',
                dataIndex: 'username'
            },
            {
                title: '姓名',
                dataIndex: 'realname'
            },
            {
                title: '性别',
                dataIndex: 'sex',
                align: 'center',
                render: (val) => {
                    if (val === 1) {
                        return <span>男</span>
                    }
                    return <span>女</span>
                }
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                align: 'center'
            },
            {
                title: '电话',
                dataIndex: 'phone',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'ctime',
                sorter: true,
                align: 'center',
                render: val => <span> {moment(val).format('YYYY-MM-DD HH:mm:ss')} </span>
            },
            {
                title: '状态',
                dataIndex: 'locked',
                render: val => <span>{status[val]}</span>
            },
            {
                title: '操作',
                align: 'center',
                render: (text, record) => (
                    <span>
                        <a href="">详情</a>
                        <Divider type="vertical" />
                        <a href="javascript:void(0);" onClick={() => this.handleEditModalVisible(true, record)} >修改</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteHandler(record.userId)}>
                            <a href="">删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        ];



        return (
            <PageHeaderLayout title="用户管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>

                            <Button icon="plus" type="primary" onClick={() => this.handleAddModalVisible(true)}>新建</Button>


                            {selectedRows.length > 0 && <Button icon="plus" type="default" onClick={() => this.handleDelteBeatch()}>删除</Button>}
                        </div>
                    </div>
                    <StandardTable
                        loading={loading}
                        selectedRows={selectedRows}
                        data={data}
                        rowKey={record => record.userId}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange} />
                </Card>

                {/* 新增 */}
                <CreateForm
                    {...parentMethods}
                    modalVisible={modalVisible}
                    modalStatus={modalStatus}
                    record={record} />>
            </PageHeaderLayout>
        );
    }
}


