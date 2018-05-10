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

const status = ['正常', '锁定'];
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const TreeNode = Tree.TreeNode;

@connect(({ permission, loading }) => ({
  permission,
  loading: loading.models.permission,
}))
@Form.create()
export default class Permission extends React.Component {
  state = {
    modalVisible: false,
    selectedRows: [],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'permission/fetTree',
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

  render() {
    const { loading, permission: { trees } } = this.props;

    return (
      <PageHeaderLayout title="角色管理">
        <Tree checkable>{this.renderTreeNodes(trees)}</Tree>
      </PageHeaderLayout>
    );
  }
}
