import React, {Component} from 'react';
import {
    HashRouter as Router,
    Route,
} from 'react-router-dom'

import './App.css';

import Balances from "./components/Balances";

import {Layout} from 'antd';

const {Content, Footer} = Layout;

class App extends Component {
    render() {
        return (
            <Router>
                <Layout className="layout" style={{height:"100vh"}}>
                    <Content>
                        <div>
                            <Route exact path="/" component={Balances}/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        RuDEX © 2019
                    </Footer>
                </Layout>
            </Router>
        );
    }
}

export default App;