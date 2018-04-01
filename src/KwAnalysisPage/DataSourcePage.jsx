import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import {alertActions} from "../_actions/alert.actions";
import { openNotificationWithIcon } from "../_helpers";
import {errorProcess} from "../_helpers/error";

class DataSourcePage extends React.Component {

    state = {
        keyword: '',
        forum: 0,
        weibo: 0,
        portal: 0,
        agency: 0,
    };

    getData = () => {
        const { currentKwd, dispatch } = this.props;

        console.log(currentKwd + ' getting source data...');

        if (currentKwd !== undefined) {
            const {user} = this.props;
            //openNotificationWithIcon('info', '获取数据源分布');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': currentKwd })
            };

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
                        openNotificationWithIcon('success', currentKwd + '获取各数据源数量成功');
                        this.setState(preState => ({
                            ...preState,
                            keyword: currentKwd,
                            forum: ans.result.num.forum,
                            weibo: ans.result.num.weibo,
                            portal: ans.result.num.portal,
                            agency: ans.result.num.agency,
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

            <Row style={{marginTop:15}} gutter={16}>
                <Col className="gutter-row" span={6}>
                    <div className="gutter-box" style={{backgroundColor: "#878e95"}}>论坛类：{this.state.forum}条</div>
                </Col>
                <Col className="gutter-row" span={6}>
                    <div className="gutter-box">微博类：{this.state.weibo}条</div>
                </Col>
                <Col className="gutter-row" span={6}>
                    <div className="gutter-box">门户网站类：{this.state.portal}条</div>
                </Col>
                <Col className="gutter-row" span={6}>
                    <div className="gutter-box">培训机构类：{this.state.agency}条</div>
                </Col>
                {/*<div className="col-xl-3 col-sm-6 mb-3" >*/}
                    {/*<div className="card text-white bg-warning o-hidden h-100">*/}
                        {/*<div className="card-body">*/}
                            {/*<div className="card-body-icon">*/}
                                {/*<i className="fa fa-fw fa-file"/>*/}
                            {/*</div>*/}
                            {/*<div className="mr-5">论坛类：{this.state.forum}条</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

                {/*<div className="col-xl-3 col-sm-6 mb-3" >*/}
                    {/*<div className="card text-white bg-primary o-hidden h-100">*/}
                        {/*<div className="card-body">*/}
                            {/*<div className="card-body-icon">*/}
                                {/*<i className="fa fa-fw fa-weibo"/>*/}
                            {/*</div>*/}
                            {/*<div className="mr-5">微博类：{this.state.weibo}条</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

                {/*<div className="col-xl-3 col-sm-6 mb-3" >*/}
                    {/*<div className="card text-white bg-secondary o-hidden h-100">*/}
                        {/*<div className="card-body">*/}
                            {/*<div className="card-body-icon">*/}
                                {/*<i className="fa fa-fw fa-comments-o"/>*/}
                            {/*</div>*/}
                            {/*<div className="mr-5">门户网站类：{this.state.portal}条</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

                {/*<div className="col-xl-3 col-sm-6 mb-3" >*/}
                    {/*<div className="card text-white bg-success o-hidden h-100">*/}
                        {/*<div className="card-body">*/}
                            {/*<div className="card-body-icon">*/}
                                {/*<i className="fa fa-fw fa-child"/>*/}
                            {/*</div>*/}
                            {/*<div className="mr-5">培训机构类：{this.state.agency}条</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </Row>
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

