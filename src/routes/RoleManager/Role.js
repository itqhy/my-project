import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Form,
    Card,
    Button,
    Badge,
    Divider,
    Row,
    Col,
    Input,
    Select,
    Modal,
    message,
    InputNumber,
    Dropdown,
    menu,
    Icon,
    Menu,
    Popconfirm
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Role.less';
const { TextArea } = Input;

const status = ['正常', '锁定'];
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD";

const CreateForm = Form.create()(props => {
    const { modalVisible, form, handleAdd, handleModalVisible, modalStatus, record, handleUpdate } = props;
    const { getFieldDecorator, getFieldsValue } = form;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
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
        <Modal title={modalStatus == 'update' ? '编辑角色' : '新建角色'}
            visible={modalVisible}
            destroyOnClose={true}
            onOk={modalStatus === 'update' ? handleUpdData : handleAddData}
            onCancel={() => handleModalVisible()} width={600}>
            <Form layout="horizontal" hideRequiredMark={true}>
                <Row gutter={8}>
                    <Col md={12} sm={24}>
                        <FormItem label="名称" {...formItemLayout} >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入名称' }],
                                initialValue: modalStatus === 'update' ? (record ? record.name : '') : ''
                            })(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24}>
                        <FormItem label="标题" {...formItemLayout} >
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: '请输入标题' }],
                                initialValue: modalStatus === 'update' ? (record ? record.title : '') : ''
                            })(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    {modalStatus === 'update' &&
                        <Col md={0} sm={0}>
                            <FormItem>
                                {getFieldDecorator('roleId', { initialValue: record.roleId })(<Input />)}
                            </FormItem>
                        </Col>
                    }
                </Row>
                <Row gutter={8}>
                    <Col md={12} sm={24}>
                        <FormItem label="排序" {...formItemLayout} >
                            {getFieldDecorator('orders', {
                                rules: [{ required: true, message: '请输入排序' }],
                                initialValue: modalStatus === 'update' ? (record ? record.orders : '') : ''
                            })(<InputNumber min={1} placeholder="请输入序号" style={{ width: 200 }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col md={24} sm={48}>
                        <FormItem label="描述" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} >
                            {getFieldDecorator('description', {
                                rules: [{ required: false, message: '请输入描述' },],
                                initialValue: modalStatus === 'update' ? (record ? record.description : '') : ''
                            })(<TextArea placeholder="请输入" autosize={{ minRows: 5 }} />)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
});




@connect(({ role, loading }) => ({
    role,
    loading: loading.models.role
}))
@Form.create()
export default class Role extends React.Component {
    state = {
        modalVisible: false,
        selectedRows: [],
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'role/fetch',
        });
    }

    //查询
    handleSearch = e => {
        e.preventDefault();

        const { form, dispatch } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.setState({ formValues: fieldsValue });

            dispatch({
                type: 'role/fetch',
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
            type: 'role/fetch',
            payload: params,
        });
    }

    //新增
    handleAdd = (fields) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/add',
            payload: fields,
            callback: (result) => {
                if (result.code === 0) {
                    message.success('添加成功');
                    this.setState({ modalVisible: false });
                    this.handleFormReset();
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
            type: 'role/update',
            payload: fields,
            callback: (result) => {
                if (result.code === 0) {
                    message.success('修改成功');
                    this.setState({ modalVisible: false });
                    this.handleFormReset();
                } else {
                    message.error(result.message);
                }
            }
        });
    }



    //表格选中
    handleSelectRows = (rows) => {
        this.setState({ selectedRows: rows })
    }


    //删除
    deleteHandler = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/remove',
            payload: { roleId: id },
            callback: (result) => {
                if (result.code === 0) {
                    message.success('删除成功');
                    this.handleFormReset();
                } else {
                    message.error(result.message);
                }
            }
        })
    }

    //重置查询条件
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        dispatch({ type: 'role/fetch', });
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
                        <FormItem label="名称或标题">
                            {getFieldDecorator('name')(<Input placeholder="请输入名称或标题" />)}
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
        const { loading, role: { data } } = this.props;
        const { modalVisible, modalStatus, record, selectedRows } = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleUpdate: this.handleUpdate,
            handleModalVisible: this.handleModalVisible,
        }

        const rowSelections = {
            type: 'radio'
        }

        const columns = [
            {
                title: 'ID',
                dataIndex: 'roleId',
                align: 'center'
            },
            {
                title: '名称',
                dataIndex: 'name'
            },
            {
                title: '标题',
                dataIndex: 'title'
            },
            {
                title: '描述',
                dataIndex: 'description',
                align: 'center'
            },
            {
                title: '排序',
                dataIndex: 'orders',
                sorter: true,
                align: 'center'
            },
            {
                title: '创建时间',
                dataIndex: 'ctime',
                sorter: true,
                align: 'center',
                render: val => <span> {moment(val).format('YYYY-MM-DD HH:mm:ss')} </span>
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
                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteHandler(record.roleId)}>
                            <a href="">删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        ];

        const menu = (
            <Menu selectedKeys={[]}>
                <Menu.Item key="remove">删除</Menu.Item>
                <Menu.Item key="approval">批量审批</Menu.Item>
            </Menu>
        );

        return (
            <PageHeaderLayout title="角色管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>

                            <Button icon="plus" type="primary" onClick={() => this.handleAddModalVisible(true)}>新建</Button>


                            {selectedRows.length > 0 && (
                                <span>
                                    <Button icon="plus" type="default">删除</Button>
                                    <Dropdown overlay={menu}>
                                        <Button>
                                            更多操作 <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                </span>
                            )}
                        </div>
                    </div>
                    <StandardTable
                        loading={loading}
                        selectedRows={selectedRows}
                        rowSelections={rowSelections}
                        data={data}
                        rowKey={record => record.roleId}
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


