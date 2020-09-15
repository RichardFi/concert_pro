import React from 'react';
import { Redirect, Route, Switch} from 'react-router-dom';
import Layout from 'antd/lib/layout';
import LeftNav from '../common/leftNav';
import Artists from '../artists';
import Header from '../common/header'
import Concerts from '../concerts';

const { Footer, Sider, Content } = Layout;

export default function Admin() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <LeftNav>
        </LeftNav>
      </Sider>
      <Layout>        
        <Header></Header>
        <Content style={{ margin: 20, backgroundColor: '#fff' }}>
          <Switch>
            <Route path='/' exact component={Artists}></Route>
            <Route path='/concert' component={Concerts}></Route>
            <Redirect to="/" />
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#ccc' }}>©2020 Created by Yongrui Pan for CAB432 </Footer>
      </Layout>
    </Layout>
  );
}