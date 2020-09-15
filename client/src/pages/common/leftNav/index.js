import React from 'react';
import { LeftNavWrap, } from './style';
import { Link } from 'react-router-dom';
import Menu from 'antd/lib/menu';

export default function LeftNav() {
    return (
        <LeftNavWrap>
            <Menu 
                defaultSelectedKeys={['0']}
                mode="inline"
                theme="dark"
            >
                <Menu.Item key="0">
                    <Link to='/home'>
                        <span>Related Artists</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="1">
                    <Link to='/concert'>
                        <span>Concerts</span>
                    </Link>
                </Menu.Item>
            </Menu>
        </LeftNavWrap>
    )
}
