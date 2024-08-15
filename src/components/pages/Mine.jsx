import React, { useEffect, useState} from "react";
import axios from "axios";
import config from "../../config/config";
import {
    Button,
    Checkbox,
    Form,
    Input,
    message,
} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import UserInfo from "./UserInfo";
import jwt_decode from 'jwt-decode';
/**
 * 此处为导航栏中“我的”页面，主要用途是根据用户是否登录返回不同的页面，login页面在此函数内
 * 用户已登录时，会展示UserInfo页面。
 * @returns {*}
 * @constructor
 */
function Mine(){

    // const [PageIndex, SetPageIndex] = useState()
    // useEffect(() => {
    //     // 此处想写验证token，有精力就写，无精力就用session
    //     // axios.get(`${config.HTTP_REQUEST_URL}`)
    //     //     .then(response => {
    //     //         console.log(response.data)
    //     //         setPostData(response.data);
    //     //     })
    //     //     .catch(err => {
    //     //         // 处理错误
    //     //         console.error(err)
    //     //     });
    // }, [])

    let LoginPage = () => {
        const onFinish = (values) => {
            // console.log('Received values of form: ', values);
            axios.post(`${config.HTTP_REQUEST_URL}/login`, values)
                .then((res) => {
                    console.log(res.data);
                    if(res.status === 200) {
                        sessionStorage.setItem("jwt", res.data.jwt)
                        if(jwt_decode(res.data.jwt).admin === true){
                            message.success("欢迎管理员登录，正在跳转管理页面")
                                .then(() => {
                                    window.location.href = "edit"
                                })
                        }else{
                            message.success("登录成功,正在跳转主页")
                                .then(() => {
                                    window.location.href = "/index"
                                });
                        }
                    }
                })
                .catch((err) => {
                    message.error("账号或密码错误，请重试")
                })
        };
        return (
            <div style={{// 设置高度为视口的高度，使内容垂直居中
                display: 'flex',
                justifyContent: 'center',
                // alignItems: 'center',
                height: '73vh',}}>

                {/*请注意替换Form.item中的name属性， 会影响到这个会决定了onFinish函数中values的key */}
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    style={{
                        maxWidth: 300,
                    }}
                >
                    <Form.Item
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{width:'100%'}}>
                            登录
                        </Button>
                        Or <a href="register">现在注册!</a>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    // 根据session中uid的值判断是否登录，根据登录状态返回不同的页面
    let renderPage = () => {
        let PageIndex = sessionStorage.getItem("jwt")
        console.log(PageIndex);
        if(PageIndex === null) return <LoginPage />
        else return <UserInfo />
    }
    return (
        renderPage()
    )
}

export default Mine;