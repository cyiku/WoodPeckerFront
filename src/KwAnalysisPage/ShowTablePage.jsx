import React from 'react';
import { Table } from 'antd';
import { CSVLink } from 'react-csv';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class ShowTablePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchedContent: [],
            searchInput: '',
        };
    };

    componentDidMount(){

        //console.log(this.props);
        //dispatch(collectionActions.getCollection(user, type));
        //dispatch(collectionActions.getCollection(user, 'table'));
        const {tableCollection} = this.props;
        if (tableCollection.length === 0) {
            const {user, dispatch} = this.props;
            dispatch(collectionActions.getCollection(user, 'table'));
        }

        const { data } = this.props;
        this.setState(preState => ({
            searchedContent: data,
        }));

    }


    /**
     * 初次打开时图标更换
     * @param id
     * @param collection
     * @returns {*}
     */
    hasCollected = (id, collection) => {
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
        const {user, dispatch, type, collection} = this.props;

        let icon = document.getElementById(iconID);
        if (icon.getAttribute("class") === "fa fa-star-o") {
            // 收藏

            dispatch(collectionActions.addCollection(user, data, type));
            icon.setAttribute("class", "fa fa-star"); // 更换图标

        } else {
            // 取消收藏

            for (let i = 0; i < collection.length; ++i) {
                dispatch(collectionActions.delCollection(user, [data[0]['id']], type))
            }

            icon.setAttribute("class", "fa fa-star-o"); //更换图标
        }
    };


    /**
     * 收藏(取消收藏)searchedContent
     * @param event: 鼠标点击收藏(取消收藏)的事件
     */
    collectionAll = (event) => {

        const { user, dispatch } = this.props;
        const type = 'table';

        let icon = document.getElementById('all');
        if (icon.getAttribute("class") === "fa fa-star-o") {
            // 收藏

            dispatch(collectionActions.addCollection(user, this.state.searchedContent, type));
            icon.setAttribute("class", "fa fa-star");
        } else {

            let dataidlist = [];
            for (let i = 0; i < this.state.searchedContent.length; ++i) {
                dataidlist.push(this.state.searchedContent[i]['id'])
            }

            dispatch(collectionActions.delCollection(user, dataidlist, type));
            icon.setAttribute("class", "fa fa-star-o"); //更换图标
        }

    };


    /**
     * 表格的搜索功能
     */
    search = () => {
        const {data} = this.props; // 拿到全部内容

        // 根据每条消息中的content匹配searchInput的内容
        let searchedContent = [];
        for (let i = 0; i < data.length; ++i) {
            if (data[i]['content'].indexOf(this.state.searchInput) !== -1) {
                searchedContent.push(data[i]);
            }
        }

        // 重置state, 刷新对应的dom
        this.setState(
            preState => ({
                ...preState,
                searchedContent: searchedContent
            })
        );
    };


    /**
     * searchInput被更改时, 实时更新this.state.searchInput中的值
     * @param event: searchInput被修改事件
     */
    handlechange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };


    render() {
        const {collection, title} = this.props;

        let { columns } = this.props;
        columns = columns.concat(
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <a href="javascript:void(0);" onClick={event => this.collectionOneRow(event, this.objToJSON(record), record.id)}><i className={this.hasCollected(record.id, collection)} id={record.id}/></a>
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
                </div>


                <div className="card-body">
                    <div className="table-responsive">
                        <Table columns={columns} dataSource={this.state.searchedContent} rowKey={'id'}/>
                    </div>
                </div>


                <div className="card-body py-2 small">
                    <a className="mr-3 d-inline-block" href='javascript:void(0);' onClick={event => this.collectionAll(event)} >
                        <i className="fa fa-star-o" id="all"> 收藏</i>
                    </a>
                    <CSVLink data={this.state.searchedContent}
                             filename={new Date().toLocaleString()}
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

