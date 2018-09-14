import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { Card, Icon } from 'antd';
import { CSVLink } from 'react-csv';
import {serverIP} from '../_helpers';
// import { history } from '../_helpers';
import { openNotificationWithIcon } from "../_helpers";
import {errorProcess} from "../_helpers/error";
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { keywordActions } from '../_actions';

class ClusteringPage extends React.Component {
    // 话题聚类页面
    state = {
        columns : [
            {title: '话题ID', dataIndex: 'id', width: 200},
            {title: '相关信息', dataIndex: 'content'},
        ],
        contents: [
            {'id': 1, 'content': ""},
        ],
        time: "",
        currentKwd: ''
    };

    componentDidMount () {
        const{ user, dispatch, keyword } = this.props;
        if (keyword === null)
            dispatch(keywordActions.getKws(user));
    };

    clickKeyword = (event) => {
        let newKwd = event.target.getAttribute("value");
        // 如果此时keyword没变化，则无需反复请求
        if (newKwd === this.state.currentKwd || newKwd === null)
            return;

        let targets = document.getElementsByClassName("keyword");
        
        // 如果keyword变化，更改图标
        for (let i = 0; i < targets.length; ++i) {
            targets[i].setAttribute("class", "btn btn-secondary keyword");
        }
        event.target.setAttribute("class", "btn btn-primary keyword");

        // 重新获取新消息
        this.getClusteringMsg(newKwd);
    }


    getClusteringMsg(keyword){
        const {user} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({'keyword': keyword})
        };
        // console.log(keyword + 'get cluster')
        fetch(serverIP + '/getClustering', requestOptions).then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            }
        ).then(
            ans => {
                if(ans.status === 1) {
                    this.setState(preState => ({
                        ...preState,
                        contents: ans.result.topic,
                        time: ans.result.time,
                        currentKwd: keyword
                    }));
                } else {
                    openNotificationWithIcon("error", ans.message);
                }
            },
            error => errorProcess(error)
        )
    }

    render() {

        let {keyword} = this.props;
        if (keyword === null)
            keyword = [];
        if (this.state.currentKwd === '' && keyword.length > 0) {
            this.getClusteringMsg(keyword[0].name)
        }

        const {currentKwd} = this.state;
        let kwdButtonClass = {};

        for (let i = 0; i < keyword.length; i++) {
            if (keyword[i].name === currentKwd) {
                kwdButtonClass[keyword[i].name] = "primary";
            } else {
                kwdButtonClass[keyword[i].name] = "default";
            }
        }
        
        let keywordDiv = <div>暂无关键字</div>;
        if (currentKwd !== '') {
            let { columns, contents, time } = this.state;

            keywordDiv = 
                <div>
                    <div style={{marginBottom:15}}>
                        {
                            keyword.map( (oneKwd, index)=>
                                <Button
                                    size="large"
                                    type={kwdButtonClass[oneKwd.name]}
                                    key={index}
                                    onClick={this.clickKeyword}
                                    value={oneKwd.name}
                                    style={{marginRight:15}}
                                >
                                    {oneKwd.name}
                                </Button>
                            )
                        }
                        <Button type="primary" size="large"><Link to="/keywords">管理关键字</Link></Button>
                    </div>

                    <Card style={{marginTop: 15, marginLeft:15}} title={
                        <span>话题聚类,更新于: {time.replace(/'/g, '')}</span>}>
                        <Table columns={columns} dataSource={contents} rowKey={'id'}/>
                        <div>
                            <CSVLink data={contents}
                                    filename={new Date().toLocaleString()  + '.csv'}
                                    target="_blank"
                                    title="导出"
                            >
                                <Icon type="download" /> 导出
                            </CSVLink>
                        </div>
                    </Card>
                </div>;
        }

        return (
            <div style={{marginTop: 15, marginLeft:15}}>
                {keywordDiv}
            </div>

        );
    }
}

function mapStateToProps(state) {
    const { authentication, keyword } = state;
    const { user } = authentication;
    return {
        user, keyword
    };
}

const connectedClusteringPage = connect(mapStateToProps)(ClusteringPage);
export { connectedClusteringPage as ClusteringPage };