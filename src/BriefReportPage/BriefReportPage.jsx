import React from 'react';
import { Button } from 'antd';
import {serverIP} from '../_helpers';
import { connect } from 'react-redux';

class BriefReportPage extends React.Component {
    // 剪报夹页面
    exportReport = () => {
        const {user} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token},
            body: JSON.stringify({})
        };
        fetch(serverIP + '/briefReport', requestOptions).then(res => res.blob().then(blob => {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(blob);
            var filename = '简报夹.doc';
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        }));
    };

    render() {

        return (
            <div style={{marginTop: 15, marginLeft:15}}>
                <h3>简报夹功能，将为您生成最新的关键字报告</h3>
                <Button type="primary" size="middle" style={{marginTop: 15}} onClick={this.exportReport}>一键导出简报夹</Button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    const { user } = authentication;
    return {
        user
    };
}

const connectedBriefReportPage = connect(mapStateToProps)(BriefReportPage);
export { connectedBriefReportPage as BriefReportPage };