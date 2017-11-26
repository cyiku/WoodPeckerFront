import React from 'react';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';
import {DetailedWeiboPage} from "./detailedWeiboMsg";
import { keywordActions } from '../_actions';


import {KwsListPage2} from "./KwsListPage2";
import {DataSourcePage} from "./DataSourcePage";
import {PublishNumPage} from "./PublishNumPage";
import {EmotionPage} from "./EmotionPage";
import {DataDistributionPage} from "./DataDistributionPage";
import {MapPage} from "./MapPage";
import {WordCloudPage} from "./WordCloudPage";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';





class KwAnalysisPage extends React.Component {

    componentDidMount () {
        const{ user, dispatch, keyword } = this.props;
        if (keyword.length === 0)
            dispatch(keywordActions.getKws(user));
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
        let currentKwd = this.props.location.state;
        const {keyword} = this.props;

        if (currentKwd === undefined && keyword.length > 0)
            currentKwd = keyword[0].name;
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    {/*关键字展示*/}
                    <KwsListPage2 currentKwd={currentKwd} keyword={keyword}/>

                    {/*不同来源数量展示*/}
                    <DataSourcePage currentKwd={currentKwd}/>

                    {/*发布量图和情感图*/}
                    <div className="row">

                        <div className="col-md-6">
                            <PublishNumPage currentKwd={currentKwd}/>
                        </div>

                        <div className="col-md-6">
                            <EmotionPage currentKwd={currentKwd}/>
                        </div>
                    </div>

                    {/*数据源分布与词云图*/}
                    <div className="row">
                        {/*数据源分布*/}
                        <div className="col-md-6">
                            <DataDistributionPage currentKwd={currentKwd}/>
                        </div>
                        {/*相关词分布*/}
                        <div className="col-md-6">
                            <WordCloudPage currentKwd={currentKwd}/>
                        </div>
                    </div>

                    {/*地域分布*/}
                    <div className="row">
                        <MapPage currentKwd={currentKwd}/>
                    </div>

                    {/*具体微博展示*/}
                    <DetailedWeiboPage/>
                </div>
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

const connectedKwAnalysisPage= connect(mapStateToProps)(KwAnalysisPage);
export { connectedKwAnalysisPage as KwAnalysisPage };
