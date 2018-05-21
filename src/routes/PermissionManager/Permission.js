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
  Tree,
  Popconfirm,
  Tooltip
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Icons } from '../../utils/json';
import styles from './Permission.less';
const { TextArea } = Input;

const statusMap = ['禁止', '正常'];
const typeMap = ["目录", "菜单", "按钮"];
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const TreeNode = Tree.TreeNode;
const Grid = Card.Grid;

@connect(({ permission, loading }) => ({
  permission,
  loading: loading.models.permission,
}))
@Form.create()
export default class Permission extends React.Component {
  state = {
    selectRows: [],
    treeSelect: {},
    visible: false, //是否显示modal
    permissionType: 1, //目录 菜单 按钮 （1，2, 3）
    record: {}
  };

  componentDidMount() {
    this.refresh();
  }

  //刷新
  refresh() {
    this.props.dispatch({
      type: 'permission/fetTree',
    });
    this.props.dispatch({
      type: 'permission/fetch',
    });
  }



  //表格排序、分页变动
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      current: pagination.current,
      size: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}`;
      params.order = `${sorter.order}`;
    }

    dispatch({
      type: 'permission/fetch',
      payload: params,
    });
  };

  //表格选中
  selectRows = (record, selected, selectedRows) => {
    this.setState({ selectRows: selectedRows });
  }


  // //选择树
  // onSelect = (selectedKeys, info) => {
  //   const key = selectedKeys[0];
  //   const data = { pid: key };
  //   this.props.dispatch({
  //     type: 'permission/fetch',
  //     payload: data
  //   });
  // }

  /** 点击树目录时触发 **/
  onSelect = (selectedKeys, e) => {
    console.log('选择的什么：', e);
    if (e.selected) {   // 选中时才触发
      const p = e.node.props;
      this.props.dispatch({
        type: 'permission/fetch',
        payload: { pid: p.eventKey }
      });
      this.setState({
        treeSelect: { title: p.title, id: p.eventKey },
      });
    } else {
      this.setState({
        treeSelect: {},
      });
    }
  };


  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return <TreeNode {...item} />;
    });
  };


  //删除
  deleteHandler = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'permission/remove',
      payload: { id: id },
      callback: result => {
        if (result.code === 0) {
          message.success('删除成功');
        } else {
          message.error(result.message);
        }
      },
    });
  };

  showModal = (flag, record, type) => {
    this.setState({ visible: flag, type: type, record: record });
    if (type === 'update') this.setState({ permissionType: record.permissionType });
  }

  changeType = (permissionType) => {
    this.setState({ permissionType: permissionType });
  }

  //新增、修改确认
  onOk = () => {
    const { dispatch } = this.props;
    const { visible, permissionType, type } = this.state;
    const { form } = this.props;
    if (type === 'see') {
      this.setState({ visible: false });
      return;
    }

    form.validateFields((err, values) => {
      console.log(values)
      if (err) return;
      if (type === 'update') {
        dispatch({
          type: 'permission/update',
          payload: values,
          callback: result => {
            if (result.code === 0) {
              message.success('修改成功');
              this.setState({ visible: false });
            } else {
              message.error(result.message);
            }
          },
        });

      } else {
        dispatch({
          type: 'permission/add',
          payload: {
            pid: this.state.treeSelect.id,
            ...values
          },
          callback: result => {
            if (result.code === 0) {
              message.success('添加成功');
              this.setState({ visible: false });
            } else {
              message.error(result.message);
            }
          },
        });
      }

      this.refresh(); //刷新
    });

  }

  render() {
    const { loading, permission: { trees, data }, form } = this.props;
    const { selectRows, visible, permissionType, type, record } = this.state;
    const { getFieldDecorator } = form;
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
    const columns = [
      {
        title: 'ID',
        dataIndex: 'permissionId',
        align: 'center',
      },
      // {
      //   title: '所属系统',
      //   dataIndex: 'systemId',
      // },
      {
        title: '所属上级',
        dataIndex: 'pid',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: val => <span>{typeMap[val - 1]}</span>
      },
      {
        title: '权限值',
        dataIndex: 'permissionValue',
      },
      {
        title: '链接',
        dataIndex: 'uri',
      },
      {
        title: '图标',
        dataIndex: 'icon',
        render: val => <Icon type={val}/>
      },

      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render: val => <span>{statusMap[val]}</span>
      },
      {
        title: '排序',
        dataIndex: 'orders',
        sorter: true,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'ctime',
        sorter: true,
        align: 'center',
        render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>,
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <span>
            <span className="control-btn green" >
              <Tooltip placement="top" title="查看" onClick={() => this.showModal(true, record, 'see')}>
                <Icon type="eye" />
              </Tooltip>
            </span>

            <Divider type="vertical" />

            <span className="control-btn blue">
              <Tooltip placement="top" title="修改" onClick={() => this.showModal(true, record, 'update')}>
                <Icon type="edit" />
              </Tooltip>
            </span>
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteHandler(record.permissionId)}>
              <span className="control-btn red">
                <Tooltip placement="top" title="删除">
                  <Icon type="delete" />
                </Tooltip>
              </span>
            </Popconfirm>
          </span>
        ),
      },
    ];
    const rowSelections = {
      type: 'radio',
      onSelect: this.selectRows
    };

    return (
      <PageHeaderLayout title="角色管理">

        <Card bordered={false}>
          <Grid style={{ width: '15%' }} bordered={"false"} >

            <Tree
              defaultExpandAll={true}
              onSelect={this.onSelect}>
              <TreeNode title="权限管理系统" key="0" >
                {this.renderTreeNodes(trees)}
              </TreeNode>
            </Tree>
          </Grid>

          <Grid style={{ width: '83%', marginLeft: 30 }} >
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.showModal(true, null, 'add')} disabled={!this.state.treeSelect.id}>
                新建
                </Button>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              rowSelections={rowSelections}
              rowKey={record => record.permissionId}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />

            {/* 增改查 */}
            <Modal
              title={{ 'see': '查看', 'add': '新增', 'update': '修改' }[type]}
              visible={visible}
              destroyOnClose={true}
              onOk={() => this.onOk()}
              onCancel={() => this.showModal(false)}
              width={600}>

              <Form>
                <FormItem
                  label="权限类型"
                  {...formItemLayout}
                >
                  {getFieldDecorator('type', {
                    initialValue: record ? record.type : 1,
                    rules: [
                      { required: true, message: '必填' },
                    ],
                  })(
                    <Select disabled={type === 'see'} onChange={this.changeType} >
                      <Option key={1} value={1}>目录</Option>
                      <Option key={2} value={2}>菜单</Option>
                      <Option key={3} value={3}>按钮</Option>
                    </Select>
                  )}

                  {type === 'update' && (
                    <span>
                      <FormItem style={{ display: 'none' }}>
                        {getFieldDecorator('permissionId', { initialValue: record.permissionId })(<Input />)}
                      </FormItem>
                      <FormItem style={{ display: 'none' }}>
                        {getFieldDecorator('pid', { initialValue: record.pid })(<Input />)}
                      </FormItem>
                    </span>
                  )}
                </FormItem>
                <FormItem
                  label="所属上级"
                  {...formItemLayout}
                >
                  {getFieldDecorator('systemId', {
                    initialValue: record ? record.systemId : 1,
                    rules: [
                      { required: true, message: '必填' },
                    ],
                  })(
                    <Select disabled={type === 'see'}                                >
                      <Option key={1} value={1}>权限管理系统</Option>
                      <Option key={2} value={2}>内容管理系统</Option>
                      <Option key={3} value={3}>支付管理系统</Option>
                      <Option key={4} value={4}>用户管理系统</Option>
                      <Option key={5} value={5}>存储管理系统</Option>
                    </Select>
                  )}
                </FormItem>


                <FormItem
                  label="权限名"
                  {...formItemLayout}
                >
                  {getFieldDecorator('name', {
                    initialValue: record ? record.name : undefined,
                    rules: [
                      { required: true, whitespace: true, message: '必填' },
                      { max: 12, message: '最多输入12位字符' }
                    ],
                  })(
                    <Input placeholder="请输入权限名" disabled={type === 'see'} />
                  )}
                </FormItem>
                <FormItem
                  label="Code"
                  {...formItemLayout}
                >
                  {getFieldDecorator('permissionValue', {
                    initialValue: record ? record.permissionValue : undefined,
                    rules: [
                      { required: true, whitespace: true, message: '必填' },
                      { max: 12, message: '最多输入12位字符' }
                    ],
                  })(
                    <Input placeholder="请输入权限Code" disabled={type === 'see'} />
                  )}
                </FormItem>
                {permissionType === 2 && <FormItem
                  label="路径"
                  {...formItemLayout}
                >
                  {getFieldDecorator('uri', {
                    initialValue: record ? record.uri : undefined,
                    rules: [
                      { max: 12, message: '最多输入12位字符' }
                    ],
                  })(
                    <Input placeholder="请输入权限名" disabled={type === 'see'} />
                  )}
                </FormItem>
                }
                {permissionType === 1 && <FormItem
                  label="图标"
                  {...formItemLayout}
                >
                  {getFieldDecorator('icon', {
                    initialValue: record ? record.icon : undefined,
                    rules: [
                      { max: 12, message: '最多输入12位字符' }
                    ],
                  })(
                    <Select
                      dropdownClassName={styles.iconSelect}
                      disabled={type === 'see'}
                    >
                      {
                        Icons.map((item, index) => {
                          return <Option key={index} value={item}><Icon type={item} /></Option>;
                        })
                      }
                    </Select>
                  )}
                </FormItem>
                }
                <FormItem
                  label="排序"
                  {...formItemLayout}
                >
                  {getFieldDecorator('orders', {
                    initialValue: record ? record.orders : 1,
                    rules: [{ required: true, message: '请输入排序号' }],
                  })(
                    <InputNumber min={0} max={99999} style={{ width: '100%' }} disabled={type === 'see'} />
                  )}
                </FormItem>
                <FormItem
                  label="状态"
                  {...formItemLayout}
                >
                  {getFieldDecorator('status', {
                    initialValue: record ? record.status : 1,
                    rules: [{ required: true, message: '请选择状态' }],
                  })(
                    <Select disabled={type === 'see'}                                >
                      <Option key={1} value={1}>启用</Option>
                      <Option key={0} value={0}>禁用</Option>
                    </Select>
                  )}
                </FormItem>
              </Form>
            </Modal>


          </Grid>

        </Card>

      </PageHeaderLayout>
    );
  }
}
