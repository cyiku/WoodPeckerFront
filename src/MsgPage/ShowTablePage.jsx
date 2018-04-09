import React from 'react';
import { Table, Card, Icon, Button, Modal, Radio } from 'antd';
import { CSVLink } from 'react-csv';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';
import { openNotificationWithIcon } from "../_helpers";
import {serverIP} from "../_helpers/serverIP";
import { history } from '../_helpers';

const RadioGroup = Radio.Group;
class ShowTablePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchedContent: [],
            searchInput: '',
            visible: false,
            //isCollection: false,
            // 修改极性
            unmodified_polarity: "",
            modify_polarity: "",
            modify_source: "",
            modify_id: "",
        };
    };


    /**
     * 初次打开时图标更换
     * @param id
     * @param collection
     * @returns {*}
     */
    hasCollected = (id, collection) => {
        if (collection === null)
            return "star-o";
        for (let i = 0; i < collection.length; ++i) {
            if (collection[i]['_id'] === id)
                return "star"
        }
        return "star-o"
    };


    /**
     * 将object类型转换成Json
     * @param record: object类型
     */
    objToJSON = (record) => {
        let str = JSON.stringify([record]); // object list to str
        return JSON.parse(str);   // str to json
    };


    /**
     * 收藏(取消收藏)表格中的 一条 消息
     * @param event: 鼠标点击收藏(取消收藏)的事件
     * @param data: 消息对应的类型, 为JsonArray,[{'content':'', 'id':''...}]
     * @param iconID: 消息对应的收藏Icon的ID, 和消息的ID一致
     */
    collectionOneRow = (event, data, iconID) => {

        /**
         * user: 为了发送请求时后台辨识用户
         * dispatch: react-redux
         * type: collection是Json, key为type, 添加和删除时, 加入type, 方便增删
         * typeCollection: 相关类型的收藏, 为list
         */
        const {user, dispatch, type} = this.props;

        let icon = document.getElementById(iconID);
        if (icon.getAttribute("class") === "anticon anticon-star-o") {
            // 收藏

            dispatch(collectionActions.addCollection(user, data, type));
            icon.setAttribute("class", "anticon anticon-star"); // 更换图标

        } else {
            // 取消收藏
            dispatch(collectionActions.delCollection(user, [data[0]['_id']], type));
            icon.setAttribute("class", "anticon anticon-star-o"); //更换图标
        }
    };

    showModal = (record) => {
        this.setState({
            visible: true,
            unmodified_polarity: record.sentiment > 0.7 ? "正" : (record.sentiment < 0.3 ? "负": "中"),
            modify_id:record._id,
            modify_source:record.source,
        });
    };

    handleOk = (e) => {
        // 发送给服务端
        if (this.state.unmodified_polarity === this.state.modify_polarity) {
            openNotificationWithIcon("error", "未检测到改动");
            return;
        }

        const {user} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({ 'source': this.state.modify_source, 'id': this.state.modify_id, 'polarity': this.state.modify_polarity })
        };
        fetch(serverIP + '/modifyPolarity', requestOptions).then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            }
        ).then(
            ans => {
                if (ans.status === 1) {
                    openNotificationWithIcon("success", "感谢您的反馈:)");
                } else {
                    openNotificationWithIcon("error", ans.message);
                    if (ans.status === -1)
                        history.push("/login");
                }
            }
        );

        this.setState({
            visible: false,
            polarity:"",
            modify_source:"",
            modify_id:"",
        });


    };

    handleCancel = (e) => {

        this.setState({
            visible: false,
            polarity:"",
            modify_source:"",
            modify_id:"",
        });
    };

    onChange = (e) => {
        this.setState({
            modify_polarity: e.target.value,
        });
    }

    /**
     * 收藏(取消收藏)searchedContent
     * @param event: 鼠标点击收藏(取消收藏)的事件
     */
    // collectionAll = (event) => {
    //
    //     const { user, dispatch } = this.props;
    //     const type = 'table';
    //
    //     let icon = document.getElementById('all');
    //     if (icon.getAttribute("class") === "fa fa-star-o") {
    //         // 收藏
    //
    //         dispatch(collectionActions.addCollection(user, this.state.searchedContent, type));
    //         icon.setAttribute("class", "fa fa-star");
    //         icon.innerHTML = "取消收藏";
    //     } else {
    //
    //         let dataidlist = [];
    //         for (let i = 0; i < this.state.searchedContent.length; ++i) {
    //             dataidlist.push(this.state.searchedContent[i]['id'])
    //         }
    //
    //         dispatch(collectionActions.delCollection(user, dataidlist, type));
    //         icon.setAttribute("class", "fa fa-star-o"); //更换图标
    //         icon.innerHTML = "收藏";
    //     }
    //
    // };


    /**
     * 表格的搜索功能
     */
    /*
    search = () => {
        const {data} = this.props; // 拿到全部内容

        // 根据每条消息中的content匹配searchInput的内容
        let searchedContent = [];
        let searchedContentId = [];
        for (let i = 0; i < data.length; ++i) {
            if (data[i]['content'].indexOf(this.state.searchInput) !== -1) {
                searchedContent.push(data[i]);
                searchedContentId.push(data[i].id);
            }
        }

        //this.isCollection(searchedContentId);

        // 重置state, 刷新对应的dom
        this.setState(
            preState => ({
                ...preState,
                searchedContent: searchedContent
            })
        );
    };
    */

    /*
    isCollection = (searchedContentId) => {
        const {user} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({'type': "table", 'dataid': searchedContentId})
        };
        console.log(requestOptions.body);
        fetch(serverIP + '/isCollection', requestOptions).then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            }).then(
            ans => {
                if(ans.status === 1) {
                    console.log(ans.result.iscollection);
                    if (ans.result.iscollection === true) {
                        this.setState(
                            preState => ({
                                ...preState,
                                isCollection: true
                            })
                        );
                    } else {
                        this.setState(
                            preState => ({
                                ...preState,
                                isCollection: false
                            })
                        );
                    }

                } else {
                    openNotificationWithIcon("error", ans.message);
                    if (ans.status === -1)
                        history.push("/login");
                }
            },
            error => {
                openNotificationWithIcon("error", "服务器内部错误,请联系管理员,抱歉！");
                history.push("/login");
            }
        );
    };
    */

    /**
     * searchInput被更改时, 实时更新this.state.searchInput中的值
     * @param event: searchInput被修改事件
     */
    /*
    handlechange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };
    */


    render() {

        const {collection, title} = this.props;
        let { data, columns } = this.props;

        let isLoading = false;
        if (data === null) {
            data = [];
            isLoading = true;
        }

        columns = columns.concat(
            {title: '正负面', key: 'sentiment', render: (record) => (
                <Button onClick={event=>this.showModal(record)}>{record.sentiment > 0.7 ? "正" : (record.sentiment < 0.3 ? "负": "中")}</Button>)},
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <a href="javascript:void(0);" onClick={event => this.collectionOneRow(event, this.objToJSON(record), record._id)}><Icon type={this.hasCollected(record._id, collection)} id={record._id}/></a>
                    <CSVLink data={this.objToJSON(record)}
                             filename={new Date().toLocaleString()}
                             target="_blank"
                             title="导出"
                             style={{marginLeft:5}}
                    >
                        <Icon type="download" />
                    </CSVLink>
                </span>
            )},
        );

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (
            <div>

                <Card title={
                    <span>{title}</span>
                }>
                    <Table columns={columns} dataSource={data} rowKey={'_id'} loading={isLoading}/>
                    <CSVLink data={data}
                             filename={new Date().toLocaleString() + '.csv'}
                             target="_blank"
                             title="导出"
                             className="mr-3 d-inline-block"
                    >
                        <Icon type="download" /> 导出
                    </CSVLink>
                </Card>

                <Modal
                    title="修改情感极性"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <RadioGroup onChange={this.onChange} value={this.state.modify_polarity}>
                        <Radio style={radioStyle} value="正">正</Radio>
                        <Radio style={radioStyle} value="负">负</Radio>
                        <Radio style={radioStyle} value="中">中</Radio>
                    </RadioGroup>
                </Modal>
            </div>
        );
    }
}


function mapStateToProps(state, ownProps) {

    const  tableCollection = state['collection']['table'];
    const  user = state['authentication']['user'];
    const {columns, data, type, title, collection} = ownProps;
    return {
        user, columns, data, type, title, collection, tableCollection
    };
}

const connectedShowTablePage = connect(mapStateToProps)(ShowTablePage);
export { connectedShowTablePage as ShowTablePage };

