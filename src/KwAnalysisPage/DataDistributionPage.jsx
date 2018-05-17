import React from 'react';
import { connect } from 'react-redux';
import {ShowPicPage} from "./ShowPicPage";
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import { openNotificationWithIcon } from "../_helpers";
import {userActions} from "../_actions/user.actions";
import {alertActions} from "../_actions/alert.actions";
import {errorProcess} from "../_helpers/error";

class DataDistributionPage extends React.Component {

    state = {
        keyword: '',
        title : {
            text: '关键字数据源',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['论坛','微博','门户网站','培训机构']
        },
        series : [
            {
                name: '来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:0, name:'论坛'},
                    {value:0, name:'微博'},
                    {value:0, name:'门户网站'},
                    {value:0, name:'培训机构'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show:true,
                    excludeComponents :['toolbox'],
                    pixelRatio: 2,
                    title:'导出'
                }
            }
        }
    };


    getData = () => {
        const { currentKwd } = this.props;

        console.log(currentKwd + ' getting pie data...');
        if (currentKwd !== undefined) {
            const {user, dispatch} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': currentKwd})
            };
            console.log(requestOptions);

            fetch(serverIP + '/getDataSourceNum', requestOptions).then(
                response => {
                    if (!response.ok) {
                        return Promise.reject(response.statusText);
                    }
                    return response.json();
                }
            ).then(
                ans => {
                    if(ans.status === 1) {
                        openNotificationWithIcon('success', currentKwd + '获取数据源数量成功');
                        this.setState(preState => ({
                            ...preState,
                            keyword: currentKwd,
                            series : [
                                {
                                    name: '来源',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '60%'],
                                    data:[
                                        {value:ans.result.num.forum, name:'论坛'},
                                        {value:ans.result.num.weibo, name:'微博'},
                                        {value:ans.result.num.portal, name:'门户网站'},
                                        {value:ans.result.num.agency, name:'培训机构'}
                                    ],
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ],
                        }));
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

    componentDidMount(){
        this.getData()
    }

    componentDidUpdate() {
        const { currentKwd } = this.props;
        if (currentKwd === this.state.keyword){

        } else {
            this.getData();
        }
    }


    render() {
        return (
            <ShowPicPage data={this.state} type={'pie'} title={'数据源分布'}/>
        );
    }
}


function mapStateToProps(state, ownProps) {
    const { authentication } = state;
    const { user } = authentication;
    const { currentKwd } = ownProps;
    return {
        user, currentKwd
    };
}

const connectedDataDistributionPage = connect(mapStateToProps)(DataDistributionPage);
export { connectedDataDistributionPage as DataDistributionPage };

