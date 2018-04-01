import React from 'react';
import { connect } from 'react-redux';
import {ShowPicPage} from "./ShowPicPage";
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import {userActions} from "../_actions/user.actions";
import {alertActions} from "../_actions/alert.actions";
import { openNotificationWithIcon } from "../_helpers";
import {errorProcess} from "../_helpers/error";

class PublishNumPage extends React.Component {

    state = {
        keyword: '',
        backgroundColor: '#FBFBFB',
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['论坛','微博', '门户网站', '培训机构']
        },

        calculable : true,


        xAxis : [
            {
                axisLabel:{
                    rotate: 30,
                    interval:0
                },
                axisLine:{
                    lineStyle :{
                        color: '#CECECE'
                    }
                },
                type : 'category',
                boundaryGap : false,
                data : function (){
                    var list = [];
                    for (var i = 1; i <= 10; i++) {
                        if(i<= 12){
                            list.push('2017-'+i + '-01');
                        }else{
                            list.push('2018-'+(i-12) + '-01');
                        }
                    }
                    return list;
                }()
            }
        ],
        yAxis : [
            {

                type : 'value',
                axisLine:{
                    lineStyle :{
                        color: '#CECECE'
                    }
                }
            }
        ],
        series : [
            {
                name:'门户网站',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#ffc107'],
                data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name:'微博',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#007bff'],
                data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name:'论坛',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#868e96'],
                data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name:'培训机构',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#28a745'],
                data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }

        ],
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show:true,
                    excludeComponents :['toolbox'],
                    pixelRatio: 2,
                    title:'导出',
                }
            }
        }
    };

    getData = () => {
        const { currentKwd, dispatch } = this.props;

        console.log(currentKwd + ' getting publish data...');
        if (currentKwd !== undefined) {
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token  },
                body: JSON.stringify({ 'keyword': currentKwd})
            };

            fetch(serverIP + '/getPublishNum', requestOptions).then(
                response => {
                    if (!response.ok) {
                        return Promise.reject(response.statusText);
                    }
                    return response.json();
                }
            ).then(
                ans => {
                    if(ans.status) {
                        //console.log(ans.result);
                        openNotificationWithIcon('success', currentKwd + '获取发布量折线图成功');
                        this.setState(preState => ({
                            ...preState,
                            keyword: currentKwd,
                            xAxis : [
                                {
                                    axisLabel:{
                                        rotate: 30,
                                        interval:0
                                    },
                                    axisLine:{
                                        lineStyle :{
                                            color: '#CECECE'
                                        }
                                    },
                                    type : 'category',
                                    boundaryGap : false,
                                    data : ans.result.date
                                }
                            ],
                            series : [
                                {
                                    name:'门户网站',
                                    type:'line',
                                    symbol:'none',
                                    smooth: 0.2,
                                    color:['#ffc107'],
                                    data:ans.result.num.portal
                                },
                                {
                                    name:'微博',
                                    type:'line',
                                    symbol:'none',
                                    smooth: 0.2,
                                    color:['#007bff'],
                                    data:ans.result.num.weibo
                                },
                                {
                                    name:'论坛',
                                    type:'line',
                                    symbol:'none',
                                    smooth: 0.2,
                                    color:['#868e96'],
                                    data:ans.result.num.forum
                                },
                                {
                                    name:'培训机构',
                                    type:'line',
                                    symbol:'none',
                                    smooth: 0.2,
                                    color:['#28a745'],
                                    data:ans.result.num.agency
                                }

                            ],
                        }));

                    } else {
                        openNotificationWithIcon("error", ans.message);
                        if (ans.status === -1)
                            history.push("/login");
                    }
                },
                error => errorProcess(error)
            )
        }
    };
    componentDidMount(){
        this.getData();
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
            <ShowPicPage data={this.state} type={'line'} title={'发布量折线图'}/>
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

const connectedPublishNumPage= connect(mapStateToProps)(PublishNumPage);
export { connectedPublishNumPage as PublishNumPage };

