import React from 'react';
import { Modal, Button } from 'antd';
import { Checkbox } from 'antd';
import { connect } from 'react-redux';
import { keywordActions } from '../_actions';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

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
        fetch(serverIP + '/getSites', requestOptions).then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            }).then(
            ans => {
                if(ans.status === 1) {
                    console.log(ans.result);
                    this.setState(preState => ({
                        ...preState,
                        types: [
                            type('贴吧', ans.result.tieba),
                            type('门户网站', ans.result.portal),
                            type('微博', ans.result.weibo),
                            type('培训机构', ans.result.agency),
                        ]
                    }));
                } else {
                    alert(ans.message);
                    if (ans.status === -1)
                        history.push("/login");
                }
            },
            error => {
                if (error.message === "Failed to fetch") {
                    alert("登录过期, 请重新登录");
                } else {
                    alert("服务器内部错误,请联系管理员,抱歉！");
                }
                history.push("/login");
            }
        );
    };

    componentDidMount(){
        const { user, dispatch, keyword } = this.props;
        if (keyword.length === 0)
            dispatch(keywordActions.getKws(user));
        this.getTypes();
    }

    // 删除
    showConfirm = (event, index) => {
        const {user, dispatch, keyword} = this.props;
        dispatch(keywordActions.delKws(user, keyword, index.index));
    };


    // 管理关键字对话框
    showUpdateModal = (isUpdated, event) => {

        // 用于更新this.state.sites
        const newTypes = this.state.types;
        // 用于更新this.modelKw
        let modelKw = "关键字名称";

        let title = '';

        var updatedIndex = null;

        if (isUpdated) {
            // 如果是修改关键字操作
            title = '修改关键字';

            // 根据点击的index得到要跟新的keyword
            const index = event.target.getAttribute("value");
            const keyword = this.props.keyword[index];
            updatedIndex = index;

            modelKw = keyword.name;

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
        this.setState({
            confirmLoading: true,
        });
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
            for (let i = 0; i < this.props.keyword.length; ++i) {
                if (this.props.keyword[i].name === postKw) {
                    alert("关键字已存在");
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


    render() {
        const { keyword } = this.props;
        console.log(keyword);
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">

                            {/*此时Button对应的操作是添加关键字*/}
                            <Button type="primary" onClick={event=>this.showUpdateModal(false,event)}><i className="fa fa-plus m-r-5"/>新加关键字</Button>

                            {/*显示关键词*/}
                            <div style={{marginTop:10}}>
                                <table className="table table-email f-s-14">
                                    <thead>
                                    <tr>
                                        <th>关键字名称</th>
                                        <th>爬取站点</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        keyword.map((keyword, index)=>
                                        <tr className="ng-scope" key={index} id={index}>
                                            <td style={{width: "15%"}} className="ng-binding" value={keyword.name}><span>{keyword.name}</span></td>
                                            <td style={{width: "35%"}} className="ng-binding">
                                            {
                                                keyword.sites.map((eachSite, index)=>
                                                    <span style={{marginRight:5}} key={index}>{eachSite}</span>
                                                )
                                            }
                                            </td>
                                            <td style={{width: "10%"}}>
                                                <a title="修改话题" onClick={(event)=>this.showUpdateModal(true, event)} value={index}><i className="fa fa-edit" value={index}/></a>
                                                <a title="删除关键字" onClick={(event)=>this.showConfirm(event, {index})} value={index} style={{marginLeft:5}}><i className="fa fa-trash-o" value={index}/></a>
                                            </td>
                                        </tr>)
                                    }
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <Modal title={this.state.title}
                               visible={this.state.updateVisible}
                               onOk={this.handleOk}
                               confirmLoading={this.state.confirmLoading}
                               onCancel={this.handleCancel}
                        >
                            <div className="form-group">
                                <label>关键字名称</label>
                                <input type="text" name="txt_departmentname" data-bind="value:Name" className="form-control" id="txt_departmentname"  onChange={this.handleChange} value={this.state.modelKw}/>
                            </div>
                            <div className="form-group">
                                <label>爬取站点</label>
                                <div className="m-b-15">
                                    <ul className="nav nav-pills nav-stacked nav-sm panel-body">
                                        <li>
                                            {
                                                this.state.types.map((site, index)=>
                                                    <div key={index}>
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
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Modal>

                    </div>
                </div>
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
