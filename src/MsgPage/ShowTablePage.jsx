import React from 'react';
import { Table } from 'antd';
import { CSVLink } from 'react-csv';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';
//import {serverIP} from '../_helpers';
//import { history } from '../_helpers';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';
import '../CollectionNewsPage/CollectionNewsPage.css';

class ShowTablePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchedContent: [],
            searchInput: '',
            //isCollection: false,
        };
    };

    componentDidMount(){

        //console.log(this.props);
        //dispatch(collectionActions.getCollection(user, type));
        //dispatch(collectionActions.getCollection(user, 'table'));

        /*
        const {tableCollection} = this.props;
        if (tableCollection.length === undefined) {
            const {user, dispatch} = this.props;
            dispatch(collectionActions.getCollection(user, 'table'));
        }
        let dataid = [];
        for (let i = 0; i < data.length; ++i) {
            dataid.push(data[i].id);
        }
        */
    }


    /**
     * 初次打开时图标更换
     * @param id
     * @param collection
     * @returns {*}
     */
    hasCollected = (id, collection) => {
        if (collection === null)
            return "fa fa-star-o";
        for (let i = 0; i < collection.length; ++i) {
            if (collection[i]['id'] === id)
                return "fa fa-star"
        }
        return "fa fa-star-o"
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
        if (icon.getAttribute("class") === "fa fa-star-o") {
            // 收藏

            dispatch(collectionActions.addCollection(user, data, type));
            icon.setAttribute("class", "fa fa-star"); // 更换图标

        } else {
            // 取消收藏
            dispatch(collectionActions.delCollection(user, [data[0]['_id']], type));
            icon.setAttribute("class", "fa fa-star-o"); //更换图标
        }
    };


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
                    alert(ans.message);
                    if (ans.status === -1)
                        history.push("/login");
                }
            },
            error => {
                alert("服务器内部错误,请联系管理员,抱歉！");
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

        /*
        let collectionDiv;
        if (this.state.isCollection === false)
            collectionDiv = <i className="fa fa-star-o" id="all"> 收藏</i>;
        else
            collectionDiv = <i className="fa fa-star" id="all"> 取消收藏</i>;
        */
        columns = columns.concat(
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <a href="javascript:void(0);" onClick={event => this.collectionOneRow(event, this.objToJSON(record), record._id)}><i className={this.hasCollected(record._id, collection)} id={record._id}/></a>
                    <CSVLink data={this.objToJSON(record)}
                             filename={new Date().toLocaleString()}
                             target="_blank"
                             title="导出">
                        <i className="fa fa-fw fa-share-square-o"/>
                    </CSVLink>
                    <a href=" " title="发送"><i className="fa fa-fw fa-send-o"/></a>
                </span>
            )},
        );

        return (
            <div className="card mb-3">
                <div className="card-header">
                    <i className="fa fa-table">{title}</i>
                    {/*
                    <div style={{float:"right"}}>
                        <div className="input-group">
                            <input className="form-control" type="text" placeholder="搜正文..." id="searchInput" onChange={this.handlechange} name={"searchInput"}/>
                            <span className="input-group-btn">
                                <button className="btn btn-primary" type="button" onClick={this.search}>
                                    <i className="fa fa-search"/>
                                </button>
                            </span>
                        </div>
                    </div>
                    */}
                </div>


                <div className="card-body">
                    <div className="table-responsive">
                        <Table columns={columns} dataSource={data} rowKey={'_id'}/>
                    </div>
                </div>


                <div className="card-body py-2 small">
                    {/*
                    <a className="mr-3 d-inline-block" href='javascript:void(0);' onClick={event => this.collectionAll(event)} >
                        {collectionDiv}
                    </a>
                    */}
                    <CSVLink data={data}
                             filename={new Date().toLocaleString() + '.csv'}
                             target="_blank"
                             title="导出"
                             className="mr-3 d-inline-block"
                    >
                        <i className="fa fa-fw fa-share-square-o"/>导出
                    </CSVLink>
                    <a className="d-inline-block" href="  "><i className="fa fa-fw fa-send-o"/>发送</a>
                </div>

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

