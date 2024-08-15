import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space, Spin } from 'antd';
import axios from 'axios';
import React, {Component} from "react";
import config from "../../config/config";



/**
 * 主页中的展示列表
 * @returns {Element}
 * @constructor
 */
class DataList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null, // 加载的数据
            isLoading: false, // 是否正在加载数据
            error: null // 加载数据时出现的错误信息
        };

    }

    componentDidMount() {
        this.setState({ isLoading: true }); // 设置正在加载数据的状态
        let data = Array.from({
            length: 15,
        }).map((_, i) => ({
            href: `${config.HTTP_REQUEST_URL}/post`,
            title: `ant design part ${i}`,
            avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
            description:
                'Ant Design, a design language for background applications, is refined by Ant UED Team.',
            content:
                'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        }));
        axios.post(`${config.HTTP_REQUEST_URL}/post/all`)
            .then(res => {
                // console.log(res.data)
                if(res.data === null) return ;
                data = res.data.map((element, index) => {
                    console.log(element);
                    return {
                        href: `/index/post/${element.Pid}`,
                        title: `${element.Title}`,
                        avatar: (element.User.ImagePath === undefined ? "/image/picture.jpg" : `/avatar/${element.User.ImagePath}`),
                        description: (element.IsSolved ? "已解决" : "未解决"),
                        content:`${element.Content}`,
                        likes: element.Likes,
                        favorites: element.Favorites,
                        imageUrl : element.ImageUrl,
                        comments : element.Comments,
                    }
                })
                this.setState({data:data, isLoading: false}); // 更新数据和正在加载数据的状态
            })
            .catch(error => {
                console.log(error)
                this.setState({error: error, isLoading: false }); // 更新错误信息和正在加载数据的状态
            })
    }


    render() {
        const IconText = ({icon, text}) => (
            <Space>
                {React.createElement(icon)}
                {text}
            </Space>
        );
        const {data, isLoading, error} = this.state;
        if (isLoading) return <Spin/>
        if (error) return <div>{error.message}</div>
        if (data === null) return null;
        return (
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={data}
                // footer={
                //     <div>
                //         <b>ant design</b> footer part
                //     </div>
                // }
                renderItem={(item) => (
                    <List.Item
                        key={item.title}
                        actions={[
                            <IconText icon={StarOutlined} text={item.favorites} key="list-vertical-star-o"/>,
                            <IconText icon={LikeOutlined} text={item.likes} key="list-vertical-like-o"/>,
                            <IconText icon={MessageOutlined} text={item.comments} key="list-vertical-message"/>,
                        ]}
                        // extra={
                        //     <img
                        //         width={272}
                        //         alt="logo"
                        //         src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        //     />
                        // }
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar}/>}
                            title={<a href={item.href}>{item.title}</a>}
                            description={item.description}
                        />
                        { item.content.length > 20 ? item.content.slice(0, 98 - 3) + "..." : item.content}
                    </List.Item>
                )}
            />
        )
    }

}

export default DataList