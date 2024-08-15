import config from "../../config/config";
import axios from "axios";
import {Avatar, Button, List, message, Skeleton, Space, Spin} from "antd";
import React, {useEffect, useState} from "react";
import jwt_decode from "jwt-decode";
const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

/**
 * 此处为导航栏中“帖子管理”的页面，根据session中uid的值来判断与查找帖子,未登录会跳转去mine页面
 * 另外还会查询session中admin的值，admin为1时，即表示当前用户为管理员。会展示所有帖子
 * @returns {Element}
 * @constructor
 */
const DataListByUser = () => {
    const [initLoading, setInitLoading] = useState(true);
    const [list, setList] = useState([]);
    let admin = false, uid = null;
    // 登录判断
    useEffect(() => {
        if(sessionStorage.getItem("jwt")== null){
            message.warning("请先登录").then(() => {
                window.location.href = "mine"
            })
        }else{
            let decode = jwt_decode(sessionStorage.jwt)
            admin = decode.admin
            uid = decode.uid
            setInitLoading(false)
            fetchData()
        }

    }, []);

    // 初始获取帖子信息的请求
    const fetchData = () => {
        let data = {}
        if(!admin){
            data.user_id = uid
        }
        // console.log(sessionStorage.getItem("admin"))
        axios.post(`${config.HTTP_REQUEST_URL}/post/all`, data)
            .then((res) => {
                if(res.status === 200) {
                    console.log(res.data)
                    setList(res.data)
                }else{
                    message.error("查询出错，请联系管理员")
                }
            })
            .catch((err) => {
                message.error("未查询到数据")
            })
    }


    // 删除帖子的请求
    const DelPost = (pid) => {
        console.log(pid)
        axios.delete(`${config.HTTP_REQUEST_URL}/post/${pid}/delete`)
            .then((res) => {
                if(res.status === 200){
                    message.success(" 删除成功")
                    setList(prevList => prevList.filter(item => item.Pid !== pid))
                    // list.splice(pid-1, 1)
                }
            })
            .catch((err) => {
                message.error("删除失败")
            })
    }

    return (
        // 数据来源于list
        <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 10,
            }}
            dataSource={list}
            // 更改item的相关属性
            renderItem={(item) => (
                <List.Item
                    actions={[<a key="list-loadmore-edit" href={`addPost`} onClick={() => {
                        sessionStorage.setItem("pid", item.Pid)
                        sessionStorage.setItem("title", item.Title)
                        sessionStorage.setItem("content", item.Content)
                    }}>编辑</a>, <a key="list-loadmore-more" onClick={() => DelPost(item.Pid)}>删除</a>]}
                >
                    <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                            // avatar={<Avatar src={item.picture.large} />}
                            title={<a href={`post/${item.Pid}`}>{item.Title}</a>}
                            // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                        <div>{item.IsSolved ? "已解决" : "未解决"}</div>
                    </Skeleton>
                </List.Item>
            )}
        />
    );
}

export default DataListByUser