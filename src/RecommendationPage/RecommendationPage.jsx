import React from 'react';
import { Modal, Card, Icon, Input, Table } from 'antd';
import { Checkbox } from 'antd';
import { connect } from 'react-redux';
import { keywordActions } from '../_actions';
import {serverIP} from '../_helpers';
//import { history } from '../_helpers';
//import {alertActions} from "../_actions/alert.actions";
import { openNotificationWithIcon } from "../_helpers";
import {errorProcess} from "../_helpers/error";

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

class RecommendationPage extends React.Component {

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
        keyword: [
            // {"name": "贾跃亭", "popularity": "30%"},
            // {"name": "比特币", "popularity": "20%"},
            // {"name": "苏炳添", "popularity": "15%"}
        ],
        date: "",
    };

    componentDidMount() {
        this.getTypes();
        this.getRecommend();
        const { user, dispatch, keyword} = this.props;
        if (keyword == null) {
            dispatch(keywordActions.getKws(user));
        }
    }


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
                            type('贴吧', ans.result.forum),
                            type('门户网站', ans.result.portal),
                            type('微博', ans.result.weibo),
                            type('培训机构', ans.result.agency),
                        ]
                    }));
                } else {
                    openNotificationWithIcon("error", ans.message);
                }
            },
            error => errorProcess(error)
        );
    };

    getRecommend = () => {
        const { user } = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({})
        };
        fetch(serverIP + '/getRecommend', requestOptions).then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            }).then(
            ans => {
                if(ans.status === 1) {
                    // recomends: 将word由string转为list;keyword:将word由list转为[{"name":}]
                    let keyword = [];
                    let recommends = ans.result.words.split(" ");
                    let date = ans.result.date;
                    for (let i = 0;i < recommends.length; ++i) {
                        // 如果是空，直接略过
                        if (recommends[i].length === 0)
                            continue;
                        keyword.push({"name": recommends[i]});
                    }
                    // 处理一下日期的格式，将_由年月日替代
                    date = date.slice(0,4) + "年" + date.slice(5,7) + "月" + date.slice(8,10) + "日" +
                            date.slice(11,13) + "时" + date.slice(14,16) + "分" + date.slice(17,19) + "秒";
                    this.setState(preState => ({
                        ...preState,
                        keyword: keyword,
                        date: date
                    }));
                } else {
                    openNotificationWithIcon("error", ans.message);
                }
            },
            error => errorProcess(error)
        );
    };

    // 删除
    showConfirm = (event, name) => {

        const { user } = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({"word": name, "date": this.state.date})
        };
        fetch(serverIP + '/delRecommend', requestOptions).then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            }).then(
            ans => {
                if(ans.status === 1) {
                    // 删除成功，更新前端
                    let newKwd = JSON.parse(JSON.stringify(this.state.keyword));
                    for (let i = 0; i < newKwd.length; ++i) {
                        if (newKwd[i].name === name)
                            newKwd.splice(i, 1);
                    }
                    this.setState(preState => ({
                        ...preState,
                        keyword: newKwd
                    }));
                    openNotificationWithIcon("success", "删除推荐成功");
                } else {
                    openNotificationWithIcon("error", ans.message);
                }
            },
            error => errorProcess(error)
        );
    };


    // 管理关键字对话框
    showUpdateModal = (isUpdated, event) => {

        // 用于更新this.state.sites
        const newTypes = this.state.types;

        let modelKw = event.target.getAttribute("value");

        let title = '新加关键字';
        for (let i = 0; i < newTypes.length; ++i) {
            newTypes[i].indeterminate = true;
            newTypes[i].checkAll = false;
            newTypes[i].checkedList = [];
        }

        this.setState(preState => ({
            ...preState,
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
        newSites[index].checkAll = checkedList.length === this.state.types[index].subsites.length;

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
        const { keyword, date } = this.state;
        const columns = [
            {title: '关键字名称', dataIndex: 'name'},
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <a title="加入我的关键字" onClick={(event)=>this.showUpdateModal(true, event)} value={record.name}><Icon type="plus" value={record.name}/></a>
                    <a title="不感兴趣" onClick={(event)=>this.showConfirm(event, record.name)} style={{marginLeft:5}}><Icon type="delete"/></a>
                </span>
            )},
        ];

        return (
            <Card style={{marginTop: 15, marginLeft:15}} title={
                <span>关键字推荐,更新于: {date}</span>
            }>

                <Table dataSource={keyword} columns={columns}/>


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
                    <div style={{marginTop:10}}>
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
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </Modal>

            </Card>

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

const connectedRecommendationPage= connect(mapStateToProps)(RecommendationPage);
export { connectedRecommendationPage as RecommendationPage };
