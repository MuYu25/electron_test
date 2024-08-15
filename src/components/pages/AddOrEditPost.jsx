import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Select, Upload} from 'antd';
import axios from "axios";
import config from "../../config/config";
import {Option} from "antd/es/mentions";
import jwt_decode from "jwt-decode";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */
let jwt = sessionStorage.getItem("jwt");
let data = (jwt === null ? null : jwt_decode(jwt))
const onFinish = (values) => {
    values.user = {id: parseInt(data.uid)}
    console.log(values);
    if(sessionStorage.getItem("pid") === null){
        axios.post(`${config.HTTP_REQUEST_URL}/post/add`,values)
            .then((res) => {
                if(res.status === 200){
                    message.success("新增帖子成功")
                }
            })
            .catch((err) => {
                message.error("添加帖子失败")
                console.error("添加帖子失败", err)
            })
    }else{
        values.pid = parseInt(sessionStorage.getItem("pid"))
        axios.put(`${config.HTTP_REQUEST_URL}/post/${values.pid}/update`, values)
            .then((res) => {
                if(res.status === 200){
                    message.success(res.data)
                    sessionStorage.removeItem("pid")
                    sessionStorage.removeItem("title")
                    sessionStorage.removeItem("content")
                }else{
                    message.error("帖子更新失败, 请联系管理员")
                }
            })
            .catch((err) => {
                message.error("帖子更新失败")
                console.error(err)
            })
    }
};


class test extends React.Component {
    state = {
        imageUrl :''
    }

    constructor() {
        super();
    }
    handleChange = info => {

    }

    onFinish = values => {
        values.user = {id: parseInt(data.uid)}
        console.log(values);
        if(sessionStorage.getItem("pid") === null){
            axios.post(`${config.HTTP_REQUEST_URL}/post/add`,values)
                .then((res) => {
                    if(res.status === 200){
                        message.success("新增帖子成功")
                    }
                })
                .catch((err) => {
                    message.error("添加帖子失败")
                    console.error("添加帖子失败", err)
                })
        }else{
            values.pid = parseInt(sessionStorage.getItem("pid"))
            axios.put(`${config.HTTP_REQUEST_URL}/post/${values.pid}/update`, values)
                .then((res) => {
                    if(res.status === 200){
                        message.success(res.data)
                        sessionStorage.removeItem("pid")
                        sessionStorage.removeItem("title")
                        sessionStorage.removeItem("content")
                    }else{
                        message.error("帖子更新失败, 请联系管理员")
                    }
                })
                .catch((err) => {
                    message.error("帖子更新失败")
                    console.error(err)
                })
        }
    };



}
// 添加帖子与修改帖子页面，使用浏览器的session验证登录
const AddOrEditPost = () => {
    if (jwt === null){
        message.error("请先登录,正在跳转登录页面").then(() => {
            window.location.href="mine"
        })
    }

    const [form] = Form.useForm();
    useEffect(() => {
        async function fetchData() {
            try {
                let data = {
                    pid : sessionStorage.getItem("pid"),
                    title : sessionStorage.getItem("title"),
                    content : sessionStorage.getItem("content")
                }
                // console.log(data)
                if(data.pid !== null && data.title !== null && data.content !== null){
                    form.setFieldsValue(data);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        fetchData();
    }, []);

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

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

    return (
        // 请注意替换Form.item中的name属性， 会影响到这个会决定了onFinish函数中values的key
        <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            style={{
                maxWidth: 600,
            }}
            form={form}
            validateMessages={validateMessages}
        >
            <Form.Item
                name={"title"}
                label="标题"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={"description"}
                label={"物品描述"}
                rules={[
                    {
                        required: true,
                    },
                ]}
            ><Input />
            </Form.Item>
            <Form.Item
                name={"image"}
                label={"图片"}
            >
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    // 上传图片前的检测
                    beforeUpload={(file) => {
                        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                        if (!isJpgOrPng) {
                            message.error('You can only upload JPG/PNG file!');
                        }
                        const isLt10M = file.size / 1024 / 1024 < 10;
                        if (!isLt10M) {
                            message.error('Image must smaller than 10MB!');
                        }
                        return isJpgOrPng && isLt10M;
                    }}
                    // 上传图片的函数
                    onChange={(info) => {
                        console.log(info)
                        if (info.file.status === 'uploading') {
                            setLoading(true);
                            return;
                        }

                        if (info.file.status === 'done') {
                            // Get this url from response in real world.
                            const reader = new FileReader();
                            reader.addEventListener('load', () => {
                                setLoading(false);
                                setImageUrl(reader.result);
                            });
                            reader.readAsDataURL(info.file.originFileObj);
                        }else if(info.file.status === 'error') {
                            message.error(`${info.file.name}上传失败`);
                        }
                    }}
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
            </Form.Item>
            <Form.Item name={"content"} label="内容">
                <Input.TextArea rows={6}/>
            </Form.Item>
            <Form.Item name={"IsSolved"} label="是否解决">
                <Select
                    defaultValue="未解决"
                    style={{ width: 120 }}
                >
                    <Option value={true} >已解决</Option>
                    <Option value={false}>未解决</Option>

                </Select>
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    ...layout.wrapperCol,
                    offset: 8,
                }}
            >
                <Button type="primary" htmlType="submit">
                    {sessionStorage.getItem("pid") !== null ? "更新":"添加"}
                </Button>
            </Form.Item>
        </Form>
    )
}
export default AddOrEditPost;