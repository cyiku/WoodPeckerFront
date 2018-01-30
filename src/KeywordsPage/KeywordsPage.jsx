import React from 'react';
import { Modal, Input } from 'antd';
import { Checkbox, Button, Icon, Table } from 'antd';
import { connect } from 'react-redux';
import { keywordActions } from '../_actions';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import { openNotificationWithIcon } from "../_helpers";

const CheckboxGroup = Checkbox.Group;

function type(name, subsites) {
    const type = {};
    type.name = name;
    type.subsites = subsites;
    type.indeterminate = true;
    type.checkAll = false;
    type.checkedList = [];
    return type;
}

class KeywordsPage extends React.Component {

    state = {
        // modal是否显示
        updateVisible: false,
        // modal输入框中默认显示
        modelKw: '关键字名称',
        // modal是否为updated
        isUpdated: false,
        updatedIndex: null,
        title: '',
        deleteVisible: false,
        deleteIndex: null,
        // checkbox, 从服务器读
        types: [
            type('贴吧', []),
            type('门户网站', []),
            type('微博', []),
            type('培训机构', []),
        ],
    };

    getTypes = () => {
        const {user} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({})
        };
        console.log("getting site type...");
        fetch(serverIP + '/getSites', requestOptions).then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            }).then(
            ans => {
                if(ans.status === 1) {
                    //console.log(ans.result);
                    this.setState(preState => ({
                        ...preState,
                        types: [
                            type('论坛', ans.result.forum),
                            type('门户网站', ans.result.portal),
                            type('微博', ans.result.weibo),
                            type('培训机构', ans.result.agency),
                        ]
                    }));
                } else {
                    openNotificationWithIcon("error", ans.message);
                    if (ans.status === -1)
                        history.push("/login");
                }
            },
            error => {
                if (error.message === "Failed to fetch") {
                    openNotificationWithIcon("error", "连接服务器失败");
                } else {
                    openNotificationWithIcon("error", "服务器内部错误,请联系管理员,抱歉！");
                }
                //history.push("/login");
            }
        );
    };

    componentDidMount(){
        const { user, dispatch, keyword } = this.props;
        if (keyword === null)
            dispatch(keywordActions.getKws(user));
        this.getTypes();
    }

    // 删除
    // showConfirm = (event, index) => {
    //     this.setState({
    //         deleteVisible: true,
    //         deleteIndex: index,
    //     });
    // };

    showConfirm = (event, name) => {
        const {keyword} = this.props;
        let index = -1;
        for (let i = 0; i < keyword.length; ++i) {
            if (keyword[i].name === name)
                index = i;
        }
        this.setState({
            deleteVisible: true,
            deleteIndex: index,
        });
    };

    // 管理关键字对话框
    // showUpdateModal = (isUpdated, event) => {
    //
    //     // 用于更新this.state.sites
    //     const newTypes = this.state.types;
    //     // 用于更新this.modelKw
    //     let modelKw = "关键字名称";
    //
    //     let title = '';
    //
    //     var updatedIndex = null;
    //
    //     if (isUpdated) {
    //         // 如果是修改关键字操作
    //         title = '修改关键字';
    //
    //         // 根据点击的index得到要跟新的keyword
    //         const index = event.target.getAttribute("value");
    //         const keyword = this.props.keyword[index];
    //         updatedIndex = index;
    //
    //         modelKw = keyword.name;
    //
    //         for (let i = 0; i < newTypes.length; ++i) {
    //             newTypes[i].indeterminate = true;
    //             newTypes[i].checkAll = false;
    //             // checkedList是所有站点与用户原先选的站点的交集
    //             newTypes[i].checkedList = this.state.types[i].subsites.filter(v=>keyword.sites.includes(v))
    //         }
    //
    //     } else {
    //         title = '新加关键字';
    //         for (let i = 0; i < newTypes.length; ++i) {
    //             newTypes[i].indeterminate = true;
    //             newTypes[i].checkAll = false;
    //             newTypes[i].checkedList = [];
    //         }
    //     }
    //
    //     this.setState(preState => ({
    //         ...preState,
    //         updatedIndex: updatedIndex,
    //         isUpdated: isUpdated,
    //         title: title,
    //         modelKw: modelKw,
    //         updateVisible: true,
    //         types: newTypes
    //     }));
    // };

    // 管理关键字对话框
    showUpdateModal = (isUpdated, keyword, event) => {

        // 用于更新this.state.sites
        const newTypes = this.state.types;
        // 用于更新this.modelKw
        let modelKw = "关键字名称";

        let title = '';

        var updatedIndex = null;

        if (isUpdated) {
            // 如果是修改关键字操作
            title = '修改关键字';
            modelKw = keyword.name;
            const allkwd = this.props.keyword;
            for (let i = 0; i < allkwd.length; ++i) {
                if (allkwd[i].name === modelKw)
                    updatedIndex = i;
            }

            for (let i = 0; i < newTypes.length; ++i) {
                newTypes[i].indeterminate = true;
                newTypes[i].checkAll = false;
                // checkedList是所有站点与用户原先选的站点的交集
                newTypes[i].checkedList = this.state.types[i].subsites.filter(v=>keyword.sites.includes(v))
            }

        } else {
            title = '新加关键字';
            for (let i = 0; i < newTypes.length; ++i) {
                newTypes[i].indeterminate = true;
                newTypes[i].checkAll = false;
                newTypes[i].checkedList = [];
            }
        }

        this.setState(preState => ({
            ...preState,
            updatedIndex: updatedIndex,
            isUpdated: isUpdated,
            title: title,
            modelKw: modelKw,
            updateVisible: true,
            types: newTypes
        }));
    };

    // ok按钮
    handleOk = () => {
        // this.setState({
        //     confirmLoading: true,
        // });
        const {user, dispatch, keyword} = this.props;

        // 获取新的keyword
        let postKw = this.state.modelKw;

        if (this.state.isUpdated) {
            // 更新操作
            let kwList = [];
            for (let i = 0; i < this.state.types.length; ++i) {
                kwList = kwList.concat(this.state.types[i].checkedList);
            }
            const newkeyword = {'name': postKw, 'sites': kwList};
            const updatedIndex = this.state.updatedIndex;
            const updatedID = keyword[updatedIndex].keywordid;
            dispatch(keywordActions.updKws(user, newkeyword, updatedIndex, updatedID));

        } else {
            if (postKw === '') {
                openNotificationWithIcon("error", "关键字不能为空");
                return;
            }

            // 添加操作
            for (let i = 0; i < this.props.keyword.length; ++i) {
                if (this.props.keyword[i].name === postKw) {
                    openNotificationWithIcon("error", "关键字已存在");
                    this.setState({
                        confirmLoading: false,
                    });
                    return;
                }
            }

            let kwList = [];
            for (let i = 0; i < this.state.types.length; ++i) {
                kwList = kwList.concat(this.state.types[i].checkedList);
            }
            console.log(kwList);
            if (kwList === []) {
                openNotificationWithIcon("error", "监控站点不能为空");
                return;
            }

            const newkeyword = {'name': postKw, 'sites': kwList};

            dispatch(keywordActions.addKws(user, newkeyword));
        }


        setTimeout(() => {
            this.setState({
                updateVisible: false,
                confirmLoading: false,
            });
        }, 1000);
    };

    // 取消按钮
    handleCancel = () => {
        this.setState({
            updateVisible: false,
        });
    };

    // 处理输入
    handleChange = (e) => {
        const { value } = e.target;
        this.setState({ modelKw: value });
    };

    // CheckboxGroup
    onChange = (checkedList, index) => {

        const newSites = this.state.types;

        newSites[index].checkedList = checkedList;
        newSites[index].indeterminate = !!checkedList.length && (checkedList.length < this.state.types[index].subsites.length);
        newSites[index].checkAll = checkedList.length === this.state.types[0].subsites.length;

        this.setState(preState => ({
            ...preState,
            types: newSites
        }));
    };

    // Checkbox
    onCheckAllChange = (index,event) => {

        const newSites = this.state.types;

        newSites[index].checkedList = event.target.checked ? this.state.types[index].subsites : [];
        newSites[index].indeterminate = false;
        newSites[index].checkAll = event.target.checked;

        this.setState(preState => ({
            ...preState,
            sites: newSites
        }));

    };

    handleDeleteOk = (e) => {
        const {user, dispatch, keyword} = this.props;
        const {deleteIndex} = this.state;
        dispatch(keywordActions.delKws(user, keyword, deleteIndex));
        this.setState({
            deleteVisible: false,
        });
    };

    handleDeleteCancel = (e) => {
        this.setState({
            deleteVisible: false,
        });
    };

    render() {

        let { keyword } = this.props;
        if (keyword === null)
            keyword = [];

        const columns = [
            {title: '关键词名称', dataIndex: 'name'},
            {title: '爬取站点', render: (record) => (
                record.sites.map((eachSite, index)=>
                    <span style={{marginRight:5}} key={index}>{eachSite}</span>
                )
            )},
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <a title="修改话题" onClick={(event)=>this.showUpdateModal(true, record, event)}><Icon type="edit"/></a>
                    <a title="删除关键字" onClick={(event)=>this.showConfirm(event, record.name)} style={{marginLeft:5}}><Icon type="delete"/></a>
                </span>
            )},
        ];
        return (
            <div style={{marginTop: 15, marginLeft:15}}>

                {/*此时Button对应的操作是添加关键字*/}
                <Button type="primary" onClick={event=>this.showUpdateModal(false, event)}>新加关键字</Button>

                {/*显示关键词*/}
                <div style={{marginTop:10}}>
                    <Table dataSource={keyword} columns={columns}/>
                </div>

                <Modal title={this.state.title}
                       visible={this.state.updateVisible}
                       onOk={this.handleOk}
                       confirmLoading={this.state.confirmLoading}
                       onCancel={this.handleCancel}
                >
                    <div>
                        <label>关键字名称</label>
                        <Input  onChange={this.handleChange} placeholder={this.state.modelKw} style={{marginTop:10}}/>
                    </div>
                    <div style={{marginTop: 10}}>
                        <label>爬取站点</label>
                        <div style={{marginTop:10}}>
                            {
                                this.state.types.map((site, index)=>
                                    <div key={index} style={{marginBottom:10}}>
                                        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                            <Checkbox
                                                indeterminate={site.indeterminate}
                                                onChange={(event)=>this.onCheckAllChange(index,event)}
                                                checked={site.checkAll}
                                            >
                                                {site.name}
                                            </Checkbox>
                                        </div>
                                        <br />
                                        <CheckboxGroup options={site.subsites}  value={this.state.types[index].checkedList} onChange={(checkedList)=>this.onChange(checkedList, index)} />
                                        <br />
                                        <br />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </Modal>

                <Modal
                    title="提示框"
                    visible={this.state.deleteVisible}
                    onOk={this.handleDeleteOk}
                    onCancel={this.handleDeleteCancel}
                >
                    <p>是否删除? </p>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication, keyword } = state;
    const { user } = authentication;
    return {
        user,keyword,
    };
}

const connectedKeywordsPage= connect(mapStateToProps)(KeywordsPage);
export { connectedKeywordsPage as KeywordsPage };
