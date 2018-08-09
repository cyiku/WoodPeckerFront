import React from 'react';
import { Modal, Input } from 'antd';
import { Checkbox, Button, Icon, Table } from 'antd';
import { connect } from 'react-redux';
import { keywordActions } from '../_actions';
import { serverIP } from '../_helpers';
import { openNotificationWithIcon } from "../_helpers";
import { errorProcess } from "../_helpers/error";

const CheckboxGroup = Checkbox.Group;
 
function newType(name, subsites) {
    // 生成几大类站点
    const type = {};
    type.name = name;
    type.subsites = subsites;
    type.indeterminate = true;  // 实现全选效果
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
        types: [
            newType('贴吧', []),
            newType('门户网站', []),
            newType('微博', []),
            newType('培训机构', []),
            newType('商务资讯', []),
            newType('行业动态', []),
        ],
    };

    getTypes = () => {
        // 获取所有大类包含的站点
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
                    this.setState(preState => ({
                        ...preState,
                        types: [
                            newType('论坛', ans.result.forum),
                            newType('门户网站', ans.result.portal),
                            newType('微博', ans.result.weibo),
                            newType('培训机构', ans.result.agency),
                            newType('商务资讯', ans.result.business),
                            newType('行业动态', ans.result.industry),
                        ]
                    }));
                } else {
                    openNotificationWithIcon("error", ans.message);
                }
            },
            error => errorProcess(error)
        );
    };

    componentDidMount(){
        const { user, dispatch, keyword } = this.props;
        // 刚打开页面时，获取所关注的关键字
        if (keyword === null)
            dispatch(keywordActions.getKws(user));
        this.getTypes();
    }

    showConfirm = (event, name) => {
        // 要删除关键字时的提示框
        // name: 要删除的关键字的名称
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

    showUpdateModal = (isUpdated, keyword, event) => {
        // 更新或新加关键字时显示的对话框
        // keyword: 要删除的关键字
        // isUpdated: 是否更新，即是更新还是新添操作
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

    handleOk = () => {
        // 点击ok按钮
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
            // 添加操作
            if (postKw === '') {
                openNotificationWithIcon("error", "关键字不能为空");
                return;
            }
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
        // 动画效果
        setTimeout(() => {
            this.setState({
                updateVisible: false,
                confirmLoading: false,
            });
        }, 1000);
    };

    handleCancel = () => {
        // 取消按钮
        this.setState({
            updateVisible: false,
        });
    };

    handleChange = (e) => {
        // 处理输入
        const { value } = e.target;
        this.setState({ modelKw: value });
    };

    onChange = (checkedList, index) => {
        // CheckboxGroup
        const newSites = this.state.types;

        newSites[index].checkedList = checkedList;
        newSites[index].indeterminate = !!checkedList.length && (checkedList.length < this.state.types[index].subsites.length);
        newSites[index].checkAll = checkedList.length === this.state.types[0].subsites.length;

        this.setState(preState => ({
            ...preState,
            types: newSites
        }));
    };

    
    onCheckAllChange = (index, event) => {
        // Checkbox
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
        // 点击删除页面的ok按钮
        const {user, dispatch, keyword} = this.props;
        const {deleteIndex} = this.state;
        dispatch(keywordActions.delKws(user, keyword, deleteIndex));
        this.setState({
            deleteVisible: false,
        });
    };

    handleDeleteCancel = (e) => {
        // 点击删除页面的取消按钮
        this.setState({
            deleteVisible: false,
        });
    };

    render() {

        let { keyword } = this.props;
        if (keyword === null)
            keyword = [];

        const columns = [
            {title: '关键字名称', dataIndex: 'name'},
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
                        <Input  onChange={this.handleChange} value={this.state.modelKw} style={{marginTop:10}}/>
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
