import React from 'react';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';

import { keywordActions } from '../_actions';
import { Link } from 'react-router-dom';

//import {KwsListPage2} from "./KwsListPage2";
import {DataSourcePage} from "./DataSourcePage";
import {PublishNumPage} from "./PublishNumPage";
import {EmotionPage} from "./EmotionPage";
//import {DataDistributionPage} from "./DataDistributionPage";
import {MapPage} from "./MapPage";
//import {WordCloudPage} from "./WordCloudPage";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';





class KwAnalysisPage extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            currentKwd: ''
        };
    }

    componentDidMount () {
        const{ user, dispatch, keyword } = this.props;
        if (keyword === null)
            dispatch(keywordActions.getKws(user));
    };

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

    clickKeyword = (event) => {
        let targets = document.getElementsByClassName("keyword");

        for (let i = 0; i < targets.length; ++i) {
            targets[i].setAttribute("class", "btn btn-secondary keyword");
        }
        event.target.setAttribute("class", "btn btn-primary keyword");

        let newKwd = event.target.getAttribute("value");

        this.setState(preState => ({
            ...preState,
            currentKwd: newKwd
        }));

    };

    render() {

        const propsCK = this.props.location.state;

        let {keyword} = this.props;
        if (keyword === null)
            keyword = [];

        if(this.state.currentKwd === '') {
            if (propsCK !== undefined) {
                this.setState(preState => ({
                    ...preState,
                    currentKwd: propsCK
                }));
            } else if (keyword.length > 0) {
                this.setState(preState => ({
                    ...preState,
                    currentKwd: keyword[0].name
                }));
            }

        }

        const {currentKwd} = this.state;
        let kwdButtonClass = {};

        for (let i = 0; i < keyword.length; i++) {
            if (keyword[i].name === currentKwd) {
                kwdButtonClass[keyword[i].name] = "btn btn-primary keyword";
            } else {
                kwdButtonClass[keyword[i].name] = "btn btn-secondary keyword";
            }
        }

        console.log(currentKwd + ' getting analysis data...');
        let keywordDiv = <div>暂无关键字</div>;
        if (currentKwd !== '')
            keywordDiv =
                <div className="container-fluid">
                    {/*关键字展示
                    <KwsListPage2 currentKwd={currentKwd} keyword={keyword}/>
                    */}

                    <div>
                        {
                            keyword.map( (oneKwd, index)=>
                                <button
                                    className={kwdButtonClass[oneKwd.name]}
                                    key={index}
                                    style={{color:"white", marginLeft:10}}
                                    onClick={this.clickKeyword}
                                    value={oneKwd.name}
                                >
                                    {oneKwd.name}
                                </button>
                            )
                        }
                        <Link
                            to="/keywords"
                            style={{color:"white", marginLeft:10}}
                            className="btn btn-danger"
                        >
                            管理关键字
                        </Link>
                    </div>

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

                    {/*数据源分布与词云图
                        <div className="row">

                            <div className="col-md-6">
                                <DataDistributionPage currentKwd={currentKwd}/>
                            </div>

                            <div className="col-md-6">
                                <WordCloudPage currentKwd={currentKwd}/>
                            </div>
                        </div>
                        */}


                        <div className="row">
                            <MapPage currentKwd={currentKwd}/>
                        </div>


                    {/*具体微博展示
                    <WeiboTablePage/>
                    <ForumTablePage/>
                    <PortalTablePage/>
                    <AgencyTablePage/>
                    */}
                </div>;

        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
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

const connectedKwAnalysisPage= connect(mapStateToProps)(KwAnalysisPage);
export { connectedKwAnalysisPage as KwAnalysisPage };
