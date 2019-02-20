import React, {Component} from 'react';
import {
    HashRouter as Router,
    Route,
} from 'react-router-dom'

import './App.css';

import Balances from "./components/Balances";

import {Layout} from 'antd';

const {Content, Header, Footer} = Layout;

class App extends Component {
    render() {
        return (
            <Router>
                <Layout className="layout">
                    <Header>
                        <h1 className="header">RuDEX Balances</h1>
                    </Header>
                    <Content style={{padding: "10px"}}>
                        <div>
                            <Route exact path="/" component={Balances}/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center', position: "sticky", bottom: "0"}}>
                        RuDEX © 2019
                    </Footer>
                </Layout>
            </Router>
        );
    }
}

export default App;