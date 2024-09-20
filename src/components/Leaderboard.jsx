import React from 'react';
import { Table } from 'antd';

const Leaderboard = ({ leaderboard }) => {
    // Sort the leaderboard by score in descending order
    const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score);

    // Define table columns including rank
    const columns = [
        {
            title: 'Rank',
            key: 'rank',
            render: (text, record, index) => index + 1, // Display rank based on the sorted index
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            sorter: (a, b) => b.score - a.score, // Sort by score
        },
    ];

    return (
        <Table
            dataSource={sortedLeaderboard}
            columns={columns}
            rowKey="email"
            pagination={false}
            style={{ marginTop: '20px' }}
        />
    );
};

export default Leaderboard;
