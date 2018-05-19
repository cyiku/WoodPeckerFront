import React from 'react';
import { Table, Card, Icon, Button, Modal, Radio } from 'antd';
import { CSVLink } from 'react-csv';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';
import { openNotificationWithIcon } from "../_helpers";
import {serverIP} from "../_helpers/serverIP";
import { history } from '../_helpers';
import {errorProcess} from "../_helpers/error";

const RadioGroup = Radio.Group;
class ShowTablePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // 修改极性
            visible: false,  // 修改极性的页面
            unmodified_polarity: "",
            modify_polarity: "",
            modify_source: "",
            modify_id: "",
            // 表格
            data: [],
            pagination: {},
            loading: true,
            keyword: '',
        };
    };

    componentDidMount () {
        const {keyword} = this.props;
        if (keyword !== '' && keyword !== undefined) {
            this.setState(preState => ({
                ...preState,
                keyword: keyword,
            }));
            this.getData(keyword, 1);
        }
    }

    componentDidUpdate () {
        const {keyword} = this.props;
        if (keyword !== '' && keyword !== undefined && keyword !== this.state.keyword) {
            const pager = { ...this.state.pagination };
            pager.current = 1;
            this.setState(preState => ({
                ...preState,
                keyword: keyword,
                data: [],
                pagination: pager,
                loading: true,
            }));
            this.getData(keyword, 1);
        }
    }

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
                    //if (ans.status === -1)
                    //    history.push("/login");
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

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
        });
        this.getData(this.props.keyword, pager.current);
    }

    getData = (keyword, page) => {
        const {type} = this.props;
        let secondIp = '', title = '';
        if (type === 'agency') {
            title = '培训机构';
        } else if (type === 'portal') {
            title = '门户网站';
        } else if (type === 'weibo') {
            title = '微博';
        } else if (type === 'forum') {
            title = '论坛';
        }
        if (keyword !== undefined && keyword !== '' && page >= 1) {
            console.log(keyword + ' getting source data...');
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': keyword, 'page': page, 'type': type})
            };

            fetch(serverIP + '/getInfo', requestOptions).then(
                response => {
                    if (!response.ok) {
                        return Promise.reject(response.statusText);
                    }
                    return response.json();
                }
            ).then(
                ans => {
                    const pagination = { ...this.state.pagination };
                    pagination.total = 1000;
                    if(ans.status === 1) {
                        this.setState(preState => ({
                            ...preState,
                            data: ans.result,
                            pagination:pagination,
                            loading: false,
                        }));
                        openNotificationWithIcon("success", "获取" + title + "消息成功");
                    } else {
                        openNotificationWithIcon("error", ans.message);
                        //if (ans.status === -1)
                        //    history.push("/login");
                    }
                },
                error => errorProcess(error)
            )
        }
    };

    render() {

        const {collection, title} = this.props;
        let { columns } = this.props;
        let { data } = this.state;

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
                    <Table columns={columns} dataSource={data} rowKey={'_id'} onChange={this.handleTableChange} loading={this.state.loading} pagination={this.state.pagination}/>
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
    const {columns, data, type, title, collection, keyword} = ownProps;
    return {
        user, columns, data, type, title, collection, tableCollection, keyword
    };
}

const connectedShowTablePage = connect(mapStateToProps)(ShowTablePage);
export { connectedShowTablePage as ShowTablePage };

