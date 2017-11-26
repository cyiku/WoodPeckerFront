import React from 'react';
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';
import {ShowPicPage} from "./ShowPicPage";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class EmotionPage extends React.Component {

    state = {
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
                    for (var i = 10; i <= 18; i++) {
                        if(i<= 12){
                            list.push('2016-'+i + '-01');
                        }else{
                            list.push('2017-'+(i-12) + '-01');
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
                data:[800, 300, 500, 800, 300, 600,500,600, 700]
            },
            {
                name:'负面',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#007bff'],
                data:[600, 700, 600, 800, 700, 600,880,660, 640]
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

    componentDidMount(){

        const { currentKwd } = this.props;
        if (currentKwd !== undefined) {
            // post到服务器
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

