import React, { useState } from 'react';
import {Button, Drawer, FloatButton, Form, Input, message} from 'antd';
import {LikeFilled, LikeOutlined, MessageOutlined} from "@ant-design/icons";
import axios from "axios";
import config from "../../config/config";
import {useParams} from "react-router-dom";
import jwt_decode from "jwt-decode";

/**
 * 这个组件的作用是帖子详情页（post）中，右下角点赞与评论按钮的功能与实现。需要根据/index/post/{pid}中的pid来更新帖子的信息
 * @returns {Element}
 * @constructor
 */
const Toys = () => {
    let jwt = sessionStorage.getItem("jwt");
    let data = (jwt === null ? null : jwt_decode(jwt))
    let { pid } = useParams();
    const like = [
        [false, "点赞"],
        [true, "取消点赞"]
    ]
    const [likeStatus, setLikeStatus] = useState(0);

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
    return (
        <>
            <FloatButton
                tooltip={<div>{like[likeStatus][1]}</div>}
                icon={(likeStatus === 0 ? <LikeOutlined /> : <LikeFilled /> )}
                shape="circle"
                style={{
                    right: 24 + 70 + 70,
                }}
                onClick={() => {
                    if(likeStatus === 0){
                        axios.post(`${config.HTTP_REQUEST_URL}/post/${parseInt(pid)}/addLike`)
                            .then((() => {
                                message.success("点赞成功")
                            }))
                            .catch(() => {
                                message.error("点赞失败，请联系管理员")
                            })
                    }
                    setLikeStatus(likeStatus ^ 1)
                }}
            />
            <FloatButton.Group
                shape="circle"
                style={{
                    right: 24 + 70,
                }}
            >
                <FloatButton
                    icon={<MessageOutlined />}
                    onClick={showDrawer}
                />
            </FloatButton.Group>
            <FloatButton.Group shape="circle">
                <FloatButton.BackTop visibilityHeight={0} />
            </FloatButton.Group>
            <Drawer title="评论" onClose={onClose} open={open}>
                <Form
                    onFinish={onFinish}
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item
                        name="Content"
                    >
                        <Input.TextArea placeholder="请友善交流" rows={6}/>
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
export default Toys;