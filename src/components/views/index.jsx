import React, { useState } from 'react';
import {
    FileAddFilled, FileExcelFilled,
    PieChartOutlined, QuestionCircleOutlined,
    UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Breadcrumb, FloatButton, Layout, Menu, theme} from 'antd';
import {Outlet} from "react-router-dom";
import jwt_decode from "jwt-decode";



/**
 * 主页的总体布局
 * @returns {Element}
 * @constructor
 */
const Index = () => {
    const { Header, Content, Footer, Sider } = Layout;
    function getItem(label, key, icon, children) {
        return {key, icon, children, label,
        };
    }
    const items = [
        getItem('主页', '', <PieChartOutlined />),
        getItem('发布&更新帖子', 'addPost', <FileAddFilled />),
        getItem("帖子管理", "edit", <FileExcelFilled/>),
        getItem("认领审核", "claim", <FileExcelFilled/>),
        getItem("注册账号", "register", <UserAddOutlined/>),
        getItem('我的', 'mine',<UserOutlined />),
    ];
    const [collapsed, setCollapsed] = useState(false);
    // 控制主页显示内容
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    let jwt = sessionStorage.getItem("jwt");
    let data = (jwt === null ? null : jwt_decode(jwt))

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(255,255,255, 0.2)',
                    borderRadius: 6,
                    textAlign: 'center',
                    color: "white"
                }}>
                    {/*若session中admin1不为空，左上角显示管理员，其次在判读session中的uid是否为空*/}
                    {
                        jwt === null ? "游客" : (data.admin ? "管理员" : "普通用户")
                    }
                </div>
                {/*<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" />*/}
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}
                      onClick={(e)=>{
                        // 待补充 左侧导航栏的点击事件 e.key
                          window.location = "/index/" + e.key
                      }}
                />

            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,

                        }}
                    >
                        <Outlet/>
                        {/*Bill is a cat.*/}
                        {/*主要展示页面内容选择*/}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    {/*Ant Design ©{new Date().getFullYear()} Created by Ant UED*/}
                </Footer>
            </Layout>
        </Layout>

    );
};
export default Index;