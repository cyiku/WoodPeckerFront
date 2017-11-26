import React from 'react';
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';
import {ShowPicPage} from "./ShowPicPage";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class PublishNumPage extends React.Component {

    state = {
        backgroundColor: '#FBFBFB',
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['新闻','微博', '论坛', '贴吧']
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
                name:'新闻',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#ffc107'],
                data:[800, 300, 500, 800, 300, 600,500,600, 700]
            },
            {
                name:'微博',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#007bff'],
                data:[600, 700, 600, 800, 700, 600,880,660, 640]
            },
            {
                name:'论坛',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#868e96'],
                data:[200, 250, 270, 300, 310, 390,240,235, 245]
            },
            {
                name:'贴吧',
                type:'line',
                symbol:'none',
                smooth: 0.2,
                color:['#28a745'],
                data:[430, 400, 440, 450, 500, 550,600,650, 550]
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

    componentDidMount(){

        const { currentKwd } = this.props;
        if (currentKwd !== undefined) {
            // post到服务器
        }
    }

    collection = (event, data, id, type) => {
        const {user, dispatch} = this.props;

        let icon = document.getElementById(id);
        if (icon.getAttribute("class") === "fa fa-star-o") {
            // 收藏
            icon.setAttribute("class", "fa fa-star");

            dispatch(collectionActions.addCollection(user, data, type));

            if (icon.innerHTML !== "") {
                icon.innerHTML = " 取消收藏";
            }
        } else {
            // 取消收藏
            icon.setAttribute("class", "fa fa-star-o");

            dispatch(collectionActions.delCollection(user, data.id, type));

            if (icon.innerHTML !== "") {
                icon.innerHTML = " 收藏";
            }
        }
    };


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

