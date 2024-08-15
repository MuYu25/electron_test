import React from 'react';
import {Button, Image, Table} from 'antd';
const columns = [
    {
        title: '认领物品相关帖子',
        width: 150,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        render: (path) => <a href={`/index/post/` + path}>path</a>
    },
    {
        title: '帖子大致描述',
        width: 200,
        dataIndex: 'description',
        key: 'age',
        fixed: 'left',
    },
    {
        title: '提供人or认领人',
        dataIndex: 'owner',
        key: '1',
        width: 150,
    },
    {
        title: '认领or提供人描述',
        dataIndex: 'ownerDescription',
        key: '2',
        width: 300,
    },
    {
        title: '图片',
        dataIndex: 'image',
        key: '8',
        render: (path) => <Image width={200} src={"/postImage/" + path}/>
    },
    {
        title: '审核',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => <Button type={"primary"}>审核</Button>
    },
];
const data = [
    {
        key : 0,
        name: `14`,
        description: `捡到一把黑色雨伞`,
        owner: `金泽锋`,
        ownerDescription: `捡到一把雨伞，这个伞是在一食堂丢的，整体为黑色的伞，无其他配色。是一把自动伞`,
        image: `IMG_20240526_135258.jpg`
    }
];
// for (let i = 0; i < 100; i++) {
//     data.push({
//         key: i,
//         name: `${i}`,
//         description: `description ${i}`,
//         owner: `owmer ${i}`,
//         ownerDescription: `ownerDescription ${i}`,
//         Description: `Description ${i}`,
//     });
// }
const Claim = () => (
    <Table
        columns={columns}
        dataSource={data}
        scroll={{
            x: 1500,
            y: 500,
        }}
    />
);
export default Claim;