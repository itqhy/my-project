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
import PermissionModal from './PermissionModal';
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
    treeSelect: {}
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
      payload: { roleId: id },
      callback: result => {
        if (result.code === 0) {
          message.success('删除成功');
        } else {
          message.error(result.message);
        }
      },
    });
  };

  render() {
    const { loading, permission: { trees, data } } = this.props;
    const { selectRows } = this.state;
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
              <Tooltip placement="top" title="查看" onClick={() => this.handleModalVisible(record, 'see')}>
                <Icon type="eye" />
              </Tooltip>
            </span>
            <Divider type="vertical" />
            <span onClick={() => this.handleModalVisible(record, 'update')} className="control-btn blue">
              <Tooltip placement="top" title="修改">
                <Icon type="edit" />
              </Tooltip>
            </span>
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteHandler(record.roleId)}>
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
              <PermissionModal type="add">
                <Button type="primary" disabled={!this.state.treeSelect.id}>
                  新建
                </Button>
              </PermissionModal>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              rowSelections={rowSelections}
              rowKey={record => record.permissionId}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </Grid>

        </Card>

      </PageHeaderLayout>
    );
  }
}
