import {Button, Form, Input, message, Select, Switch, Upload} from "antd";
import React, {useEffect, useState} from "react";
import axios from "axios";
import config from "../../config/config";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import jwt_decode from "jwt-decode";


const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
        message.error('Image must smaller than 1MB!');
    }
    return isJpgOrPng && isLt2M;
};

/**
 * 用户信息主页，也是通过session中的uid验证登录
 * @returns {Element}
 * @constructor
 */
let UserInfo = () => {

    const [form] = Form.useForm();
    // const [data, setData] = useState([]);
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    // 更新用户信息请求
    const onFinish = (values) => {
        console.log(values.Id = parseInt(jwt_decode(sessionStorage.getItem("jwt")).uid))
        console.log(values)
        axios.put(`${config.HTTP_REQUEST_URL}/user/${values.Id}/update`, values)
            .then((response) => {
                form.setFieldsValue(response.data)
                message.success("更新成功").then(() => {
                    // eslint-disable-next-line no-restricted-globals
                    window.location.href="mine"
                })
            })
            .catch((err) => {
                console.log("更新数据失败", err)
                message.error("更新数据失败")
            })
    }

    const [componentDisabled, setComponentDisabled] = useState(true);

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const handleChange = (info) => {
        console.log(info)
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    // 获取用户信息的请求
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post(`${config.HTTP_REQUEST_URL}/user/${jwt_decode(sessionStorage.getItem("jwt")).uid}`);
                console.log(response.data)
                form.setFieldsValue(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        fetchData();
    }, []);
    return (

        <div style={{
            // display: 'flex',
            // justifyContent: 'center',
            // // alignItems: 'center',
            // height: '73vh',
        }}>
            <Form>
                <Form.Item label={"编辑个人信息"}>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={false}
                            onClick={(e) => setComponentDisabled(!e)}/>
                </Form.Item>
            </Form>
            {/*<label>编辑个人信息</label>*/}
            <Form
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                disabled={componentDisabled}
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
                form={form}
            >

                <Form.Item
                    name="Email"
                    label="邮箱"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: '请输入你的邮箱!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="Password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="确认密码"
                    dependencies={['Password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('Password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="Name"
                    label="用户名"
                    tooltip="What do you want others to call you?"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your nickname!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="Phone"
                    label="电话号码"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your phone number!',
                        },
                    ]}
                >
                    <Input
                        addonBefore={
                            <Form.Item name="prefix" noStyle>
                                <Select
                                    style={{
                                        width: 70,
                                    }}
                                >
                                    {/* eslint-disable-next-line react/jsx-no-undef */}
                                    <Option value="86">+86</Option>
                                    {/*<Option value="87">+87</Option>*/}
                                </Select>
                            </Form.Item>
                        }
                        style={{
                            width: '100%',
                        }}
                        disabled
                    />
                </Form.Item>
                <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={`${config.HTTP_REQUEST_URL}/user/${jwt_decode(sessionStorage.getItem("jwt")).uid}/avatar`}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        // data={{"uid": parseInt(sessionStorage.getItem("uid"))}}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="avatar"
                                style={{
                                    width: '100%',
                                }}
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                    {/*<Upload action="/upload.do" listType="picture-card">*/}
                    {/*    <button*/}
                    {/*        style={{*/}
                    {/*            border: 0,*/}
                    {/*            background: 'none',*/}
                    {/*        }}*/}
                    {/*        type="button"*/}
                    {/*    >*/}
                    {/*        <PlusOutlined />*/}
                    {/*        <div*/}
                    {/*            style={{*/}
                    {/*                marginTop: 8,*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            Upload*/}
                    {/*        </div>*/}
                    {/*    </button>*/}
                    {/*</Upload>*/}
                </Form.Item>
                <Form.Item label="信息更新">
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
            <Form>
                <Form.Item label="退出登录">
                    <Button type="primary" danger onClick={() => {
                        sessionStorage.clear()
                        message.success("退出成功")
                            .then(() => {
                                window.location.href = "mine"
                            })
                    }}>
                        退出登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}


export default UserInfo