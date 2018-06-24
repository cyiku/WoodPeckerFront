import React from 'react';
import { Table, Card, Icon, Button, Modal, Radio } from 'antd';
import { CSVLink } from 'react-csv';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';
import { openNotificationWithIcon } from "../_helpers";
import {serverIP} from "../_helpers/serverIP";
// import { history } from '../_helpers';
import {errorProcess} from "../_helpers/error";

// 修改极性的提示框
const RadioGroup = Radio.Group;

class ShowTablePage extends React.Component {

    constructor(props) {
        super(props);

        // 获取keyword
        const {keyword} = this.props;

        this.state = {
            // 修改极性页面是否显示
            visible: false,
            // 修改前的极性，打开修改极性页面时获得
            before_modify_polarity: "",
            // 要修改的极性，点击修改极性页面时获得
            modify_polarity: "",
            // 修改的消息属于哪一个来源(小)，方便寻找
            modify_source: "",
            // 要修改的消息的id
            modify_id: "",
            // 表格
            data: [],
            pagination: {},
            loading: true,
            keyword: keyword,
            //记录所有改过的msg的情感极性，key：id，value：正，负，中
            modify_msg: {}
        };
    };

    componentDidMount () {
        const {keyword} = this.state;
        // 刚加载完页面，若keyword不为空，则获取该keyword的第一页数据
        if (keyword !== '' && keyword !== undefined) {
            this.getData(keyword, 1);
        }
    }

    componentDidUpdate () {
        const {keyword} = this.props;
        // 关键字更改时，重置表格，重新获取数据
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
        const msgId = record._id;

        // TODO：这里存在一个BUG，record.sentiment = 0的情况，即该消息还未进行分类，在网站上
        // 默认为中，这时修改消息的极性，假设修改的还为中，则此时sentiment=1，极性也就发生了变化，
        // 不会报未检测到改动的错误。

        // 根据id查看该消息是否修改过，获取该消息修改前对应的情感
        let before_modify_polarity = record.sentiment;
        if (this.state.modify_msg[msgId] !== undefined) {
            before_modify_polarity = this.state.modify_msg[msgId];
        }
        this.setState({
            visible: true,
            before_modify_polarity: before_modify_polarity,
            modify_id:record._id,
            modify_source:record.source,
        });
    };

    handleOk = (e) => {
        // 发送给服务端
        // alert(this.state.before_modify_polarity);
        // alert(this.state.modify_polarity);
        // 若该消息的情感未检测到更改
        // console.log('before: ' + this.state.before_modify_polarity);
        // console.log('modify: ' + this.state.modify_polarity);
        if (this.state.before_modify_polarity === this.state.modify_polarity) {
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
                }
            }
        );
        
        let {modify_msg} = this.state;
        // console.log(this.state.modify_id);
        // console.log(this.state.modify_polarity);
        modify_msg[this.state.modify_id] = this.state.modify_polarity;

        this.setState({
            visible: false,
            polarity:"",
            modify_source:"",
            modify_id:"",
            modify_msg: modify_msg,
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

    // 点击修改极性页面的正，负，中时触发
    onChange = (e) => {
        //let toInt = parseInt(e.target.value);
        this.setState({
            modify_polarity: e.target.value,
        });
    }

    // 更改页数时，重新根据页数来请求数据
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
          loading: true,
        });
        this.getData(this.props.keyword, pager.current);
    }

    getData = (keyword, page) => {
        const {type} = this.props;
        let title = '';
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
                        // 用户体验差，故不强制登出
                        //if (ans.status === -1)
                        //    history.push("/login");
                    }
                },
                error => errorProcess(error)
            )
        }
    };

    // record中sentiment属性是3 2 1，改成正，负，中
    getPolarity(record) {
        const {modify_msg} = this.state;
        const id = record._id;
        // 如果该消息是更改过的，则极性从modify_msg中读，否则读默认的属性
        // 这里由于数据类型不同，所以不能用=== 或者 === “3”
        if (modify_msg[id] !== undefined) {
            return modify_msg[id] == 3 ? "正" : (modify_msg[id] == 2 ? "负": "中");
        }
        else
            return record.sentiment == 3 ? "正" : (record.sentiment == 2 ? "负": "中");
    }

    render() {
        const {collection, title} = this.props;
        let { columns } = this.props;
        let { data } = this.state;

        columns = columns.concat(
            {title: '正负面', key: 'sentiment', render: (record) => (
                <Button onClick={event=>this.showModal(record)}>{this.getPolarity(record)}</Button>)},
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
                        <Radio style={radioStyle} value="3">正</Radio>
                        <Radio style={radioStyle} value="2">负</Radio>
                        <Radio style={radioStyle} value="1">中</Radio>
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

