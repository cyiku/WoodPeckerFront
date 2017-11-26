import React from 'react';
import {MyTablePage} from "./myTable";
import { connect } from 'react-redux';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class DataSourcePage extends React.Component {

    state = {
        newsNum: 0,
        weiboNum: 0,
        forumNum: 0,
        tiebaNum: 0,
    }

    componentDidMount(){

        const { currentKwd } = this.props;
        if (currentKwd !== undefined) {
            // post到服务器
        }
    }


    render() {
        return (

            <div className="row" style={{marginTop:15}}>
                <div className="col-xl-3 col-sm-6 mb-3" >
                    <div className="card text-white bg-warning o-hidden h-100">
                        <div className="card-body">
                            <div className="card-body-icon">
                                <i className="fa fa-fw fa-file"/>
                            </div>
                            <div className="mr-5">新闻类：{this.state.newsNum}条</div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-3" >
                    <div className="card text-white bg-primary o-hidden h-100">
                        <div className="card-body">
                            <div className="card-body-icon">
                                <i className="fa fa-fw fa-weibo"/>
                            </div>
                            <div className="mr-5">微博类：{this.state.newsNum}条</div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-3" >
                    <div className="card text-white bg-secondary o-hidden h-100">
                        <div className="card-body">
                            <div className="card-body-icon">
                                <i className="fa fa-fw fa-comments-o"/>
                            </div>
                            <div className="mr-5">论坛类：{this.state.newsNum}条</div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-3" >
                    <div className="card text-white bg-success o-hidden h-100">
                        <div className="card-body">
                            <div className="card-body-icon">
                                <i className="fa fa-fw fa-child"/>
                            </div>
                            <div className="mr-5">贴吧类：{this.state.newsNum}条</div>
                        </div>
                    </div>
                </div>
            </div>
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

const connectedDataSourcePage= connect(mapStateToProps)(DataSourcePage);
export { connectedDataSourcePage as DataSourcePage };

