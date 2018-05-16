import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Form,
    Card,
    Tree,
    Modal,
    Input,
    Select,
    message,
    InputNumber,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const formItemLayout = {  // 表单布局
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};

@connect()
@Form.create()
export default class PermissionModal extends React.PureComponent {
    state = {
        visible: false,
    }

    handleUpdData = () => {
        const { onOk } = this.props;
    }

    //显示modal
    modlalVisible = flag => {
        this.setState({
            visible: !!flag,
        });
    }

    render() {
        const { visible } = this.state;
        const { children, form, type } = this.props;
        const { getFieldDecorator } = form;
        return (
            <span>
                <span onClick={() => this.modlalVisible(true)}>
                    {children}
                </span>

                <Modal
                    title={{ 'see': '查看', 'add': '新增', 'update': '修改' }[type]}
                    visible={visible}
                    destroyOnClose={true}
                    onOk={this.handleUpdData}
                    onCancel={() => this.modlalVisible()}
                    width={600}>

                    <Form>
                        <FormItem
                            label="权限类型"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('type', {
                                initialValue: 1,
                                rules: [
                                    { required: true, message: '必填' },
                                ],
                            })(
                                <Select disabled={type === 'see'}                                >
                                    <Option key={1} value={1}>目录</Option>
                                    <Option key={2} value={2}>菜单</Option>
                                    <Option key={3} value={3}>按钮</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="所属上级"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('systemId', {
                                initialValue: undefined,
                                rules: [
                                    { required: true, message: '必填' },
                                ],
                            })(
                                <Select disabled={type === 'see'}                                >
                                    <Option key={1} value={1}>启用</Option>
                                    <Option key={-1} value={-1}>禁用</Option>
                                </Select>
                            )}
                        </FormItem>


                        <FormItem
                            label="权限名"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formTitle', {
                                initialValue: undefined,
                                rules: [
                                    { required: true, whitespace: true, message: '必填' },
                                    { max: 12, message: '最多输入12位字符' }
                                ],
                            })(
                                <Input placeholder="请输入权限名" disabled={this.state.operateType === 'see'} />
                            )}
                        </FormItem>
                        <FormItem
                            label="Code"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formCode', {
                                initialValue: undefined,
                                rules: [
                                    { required: true, whitespace: true, message: '必填' },
                                    { max: 12, message: '最多输入12位字符' }
                                ],
                            })(
                                <Input placeholder="请输入权限Code" disabled={this.state.operateType === 'see'} />
                            )}
                        </FormItem>
                        <FormItem
                            label="路径"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('uri', {
                                initialValue: undefined,
                                rules: [
                                    { required: true, whitespace: true, message: '必填' },
                                    { max: 12, message: '最多输入12位字符' }
                                ],
                            })(
                                <Input placeholder="请输入权限名" disabled={this.state.operateType === 'see'} />
                            )}
                        </FormItem>
                        <FormItem
                            label="图标"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('icon', {
                                initialValue: undefined,
                                rules: [
                                    { required: true, whitespace: true, message: '必填' },
                                    { max: 12, message: '最多输入12位字符' }
                                ],
                            })(
                                <Input placeholder="请输入权限名" disabled={this.state.operateType === 'see'} />
                            )}
                        </FormItem>
                        <FormItem
                            label="排序"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formSorts', {
                                initialValue: 0,
                                rules: [{ required: true, message: '请输入排序号' }],
                            })(
                                <InputNumber min={0} max={99999} style={{ width: '100%' }} disabled={this.state.operateType === 'see'} />
                            )}
                        </FormItem>
                        <FormItem
                            label="状态"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formConditions', {
                                initialValue: 1,
                                rules: [{ required: true, message: '请选择状态' }],
                            })(
                                <Select
                                    disabled={this.state.operateType === 'see'}
                                >
                                    <Option key={1} value={1}>启用</Option>
                                    <Option key={-1} value={-1}>禁用</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </span>


        );
    }
}