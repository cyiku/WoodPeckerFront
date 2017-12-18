import React from 'react';
import { connect } from 'react-redux';
import {ShowPicPage} from "./ShowPicPage";
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import {userActions} from "../_actions/user.actions";
import {alertActions} from "../_actions/alert.actions";
import { openNotificationWithIcon } from "../_helpers";
// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class EmotionPage extends React.Component {

    state = {
        keyword: '',
        backgroundColor: '#FBFBFB',
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['正面','负面']
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
                name:'正面',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#ffc107'],
                data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name:'负面',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#007bff'],
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
                    title:'导出'
                }
            }
        }
    };

    getData = () => {
        const { currentKwd,dispatch } = this.props;
        console.log(currentKwd + ' getting emotion data...');
        if (currentKwd !== undefined) {
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': currentKwd })
            };

            fetch(serverIP + '/getPolarity', requestOptions).then(
                response => {
                    if (!response.ok) {
                        return Promise.reject(response.statusText);
                    }
                    return response.json();
                }
            ).then(
                ans => {
                    if(ans.status) {
                        openNotificationWithIcon('success', currentKwd + '获取情感分析成功');
                        this.setState(preState => ({
                            ...preState,
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
                            keyword: currentKwd,
                            series : [
                                {
                                    name:'正面',
                                    type:'line',
                                    symbol:'none',
                                    smooth: 0.2,
                                    color:['#ffc107'],
                                    data: ans.result.num.positive
                                },
                                {
                                    name:'负面',
                                    type:'line',
                                    symbol:'none',
                                    smooth: 0.2,
                                    color:['#007bff'],
                                    data:ans.result.num.negative
                                },

                            ],
                        }));
                    } else {
                        alert(ans.reason);
                        if (ans.logout)
                            history.push("/login");
                    }
                },
                error => {
                    if (localStorage.getItem('user') !== null) {
                        dispatch(userActions.logout());
                        dispatch(alertActions.error(error));
                        if (error.message === "Failed to fetch") {
                            alert("登录过期, 请重新登录");
                        } else {
                            alert("服务器内部错误,请联系管理员,抱歉！");
                        }
                    }
                }
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
            <ShowPicPage data={this.state} type={'line'} title={'情感分析图'}/>
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

const connectedEmotionPage = connect(mapStateToProps)(EmotionPage);
export { connectedEmotionPage as EmotionPage };

