import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Form,
    Card,
    Tree,
    Modal,
    message,
} from 'antd';
import role from '../../models/role';
const TreeNode = Tree.TreeNode;

@connect(({ permission, loading }) => ({
    permission,
    loading: loading.models.permission,
}))
export default class RolePermission extends React.PureComponent {
    state = {
        visible: false,
        halfCheckedKeys: [],
        checkedKeys: []
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.permission.rolePermissionIds) {
            console.log(nextProps.permission.rolePermissionIds);
            this.setState({ checkedKeys: nextProps.permission.rolePermissionIds });
        }
    }

    handleUpdData = () => {
        const { onOk } = this.props;

    }


    showModelHandler = (e) => {
        const { dispatch, roleId } = this.props;
        dispatch({
            type: 'permission/getRolePermission',
            payload: roleId
        });

        this.setState({
            visible: true,
        });
    }

    hideModelHandler = () => {
        this.setState({
            visible: false,
        });
    };

    onCheck = (checkedKeys, { checkedNodes, halfCheckedKeys }) => {
        this.setState({ checkedKeys: checkedKeys, halfCheckedKeys: halfCheckedKeys })
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
        const { loading, permission: { trees, data, rolePermissionIds }, children } = this.props;
        const { visible } = this.state;
        console.log(this.state)
        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>

                <Modal
                    title={"分配权限"}
                    visible={visible}
                    destroyOnClose={true}
                    onOk={this.handleUpdData}
                    onCancel={() => this.hideModelHandler()}
                    width={600}>
                    <Card style={{ height: 400, overflowY: 'scroll' }}>
                        {
                            loading ?
                                'loading tree'
                                : <Tree
                                    showLine
                                    defaultExpandAll={true}
                                    checkable={true}
                                    onCheck={this.onCheck}
                                    defaultCheckedKeys={rolePermissionIds}
                                >{this.renderTreeNodes(trees)}
                                </Tree>

                        }

                    </Card>

                </Modal>
            </span>


        );
    }
}