import React from 'react';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';
import { keywordActions } from '../_actions';
import { Link } from 'react-router-dom';
import {DataDistributionPage} from "./DataDistributionPage";
import {PublishNumPage} from "./PublishNumPage";
import {EmotionPage} from "./EmotionPage";
import {MapPage} from "./MapPage";
import { Button } from 'antd';
import { Row, Col } from 'antd';

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
                kwdButtonClass[keyword[i].name] = "primary";
            } else {
                kwdButtonClass[keyword[i].name] = "default";
            }
        }

        console.log(currentKwd + ' getting analysis data...');
        let keywordDiv = <div>暂无关键字</div>;
        if (currentKwd !== '')
            keywordDiv =
                <Row>
                    {/*关键字展示
                    <KwsListPage2 currentKwd={currentKwd} keyword={keyword}/>
                    */}

                    <div style={{marginBottom:15}}>
                        {
                            keyword.map( (oneKwd, index)=>
                                <Button
                                    size="large"
                                    type={kwdButtonClass[oneKwd.name]}
                                    key={index}
                                    onClick={this.clickKeyword}
                                    value={oneKwd.name}
                                    style={{marginRight:15}}
                                >
                                    {oneKwd.name}
                                </Button>
                            )
                        }

                        <Button type="primary" size="large"><Link to="/keywords">管理关键字</Link></Button>

                    </div>

                    {/*不同来源数量展示*/}
                    {/*<DataSourcePage currentKwd={currentKwd}/>*/}

                    {/*发布量图和情感图*/}

                    <Row gutter={16} style={{marginBottom:15}}>
                        <Col span={12}><PublishNumPage currentKwd={currentKwd}/></Col>
                        <Col span={12}><EmotionPage currentKwd={currentKwd}/></Col>
                    </Row>

                    {/*数据源分布与词云图*/}
                    <Row gutter={16} style={{marginBottom:15}}>

                        <Col span={12}>
                            <DataDistributionPage currentKwd={currentKwd}/>
                        </Col>

                        {/*<Col span={12}>*/}
                            {/*<WordCloudPage currentKwd={currentKwd}/>*/}
                        {/*</Col>*/}
                    </Row>



                    <div style={{marginBottom:15}}>
                       <MapPage currentKwd={currentKwd}/>
                    </div>


                    {/*具体微博展示
                    <WeiboTablePage/>
                    <ForumTablePage/>
                    <PortalTablePage/>
                    <AgencyTablePage/>
                    */}
                </Row>;

        return (
            <div style={{marginTop: 15, marginLeft:15}}>
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
