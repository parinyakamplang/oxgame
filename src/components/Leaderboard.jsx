import React from 'react';
import '../App.css'

const Leaderboard = ({ leaderboard }) => {
    // Sort the leaderboard by score in descending order
    const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score);

    return (
        <div className="st_viewport">
            <div className="st_wrap_table">
                <div className="st_table_header">
                    <h2>Leaderboard</h2>
                    <div className="st_row">
                        <div className="st_column _rank">Rank</div>
                        <div className="st_column _name">Email</div>
                        <div className="st_column _score">Score</div>
                    </div>
                </div>
                <div className="st_table">
                    {sortedLeaderboard.map((item, index) => (
                        <div className="st_row" key={item.email} data-table_id={index % 2}>
                            <div className="st_column _rank">{index + 1}</div>
                            <div className="st_column _name">{item.email}</div>
                            <div className="st_column _score">{item.score}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
