import React, { useState } from 'react';
import {Button, Drawer, Form, Input, message, Radio, Space, Upload} from 'antd';
import jwt_decode from "jwt-decode";
import {useParams} from "react-router-dom";
import axios from "axios";
import config from "../../config/config";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
const ClaimDrawer = () => {
    let jwt = sessionStorage.getItem("jwt");
    let data = (jwt === null ? null : jwt_decode(jwt))
    let { pid } = useParams();
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const onFinish = (values) => {
        console.log(values)
        values.pid = parseInt(pid)
        if(values !== null){
            values.userName = data.name
            values.uid = parseInt(data.uid)
        }
        axios.post(`${config.HTTP_REQUEST_URL}/post/addComment`, values)
            .then((res) => {
                if(res.status === 200){
                    message.success("添加成功")
                }
            })
            .catch((err) => {
                console.error(err)
                message.error("评论失败，请联系管理员")
            })
    }

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
        <>
            <Space>
                <Button type="primary" onClick={showDrawer}>
                    认领或归还物品
                </Button>
            </Space>
            <Drawer
                title="提交认领申请"
                placement={"left"}
                closable={false}
                onClose={onClose}
                open={open}
            >
                <Form
                    onFinish={onFinish}
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item name="aaa">
                        <Input placeholder={"请提供物品描述"}/>
                    </Form.Item>
                    <Form.Item name={"image"} label={"图片"}>
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
                    <Form.Item
                        name="Content"
                    >
                        <Input.TextArea placeholder="请提供更具体的信息" rows={6}/>
                    </Form.Item>
                    <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type={"primary"} htmlType="submit" style={{
                            width: "300px"
                        }}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};
export default ClaimDrawer;
