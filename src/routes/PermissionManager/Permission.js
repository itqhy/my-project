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
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Permission.less';
const { TextArea } = Input;

const statusMap = ['禁止', '正常'];
const typeMap = ["目录","菜单","按钮"];
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
    defaultExpandAll: true,
  };

  componentDidMount() {
   this.refresh();
  }

  //刷新
  refresh(){
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


  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    // this.setState({
    //   expandedKeys,
    //   autoExpandParent: false,
    // });
  }
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }
  onSelect = (selectedKeys, info) => {
    const key = selectedKeys[0];
    const data = {pid:key};
    this.props.dispatch({
      type: 'permission/fetch',
      payload: data
    });
  }

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
        render:val=><span>{typeMap[val-1]}</span>
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
      // {
      //   title: '操作',
      //   align: 'center',
      //   render: (text, record) => (
      //     <span>
      //       <a href="">详情</a>
      //       <Divider type="vertical" />
      //       <a href="javascript:void(0);" onClick={() => this.handleEditModalVisible(true, record)}>
      //         修改
      //       </a>
      //       <Divider type="vertical" />
      //       <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteHandler(record.permissionId)}>
      //         <a href="">删除</a>
      //       </Popconfirm>
      //     </span>
      //   ),
      // },
    ];
    const rowSelections = {
      type: 'radio',
    };

    return (
      <PageHeaderLayout title="角色管理">

        <Card bordered={false}>

          <Grid style={{ width: '15%' }} bordered={"false"}>
            <Tree
              showLine
              onExpand={this.onExpand}
              //  expandedKeys={this.state.expandedKeys}
              defaultExpandAll={this.state.defaultExpandAll}
              onCheck={this.onCheck}
              //  checkedKeys={this.state.checkedKeys}
              onSelect={this.onSelect}
            >{this.renderTreeNodes(trees)}
            </Tree>
          </Grid>

          <Grid style={{ width: '83%', marginLeft: 30 }} bordered={"false"}>
            <div style={{  marginBottom: '2em'}}>
              <Button type="primary" >
                新建
              </Button>
              <Button type="default" style={{marginLeft:'1em'}}>
                删除
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
          </Grid>

        </Card>

      </PageHeaderLayout>
    );
  }
}
