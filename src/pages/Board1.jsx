import React, { useEffect, useState } from 'react';
import PageBanner from '../components/PageBanner';
import axios from 'axios';

const Board1 = () => {

    // 0. 상수, 변수
    const num = 1;

    // 1. 상태변수 초기값이 변경될 수 있는 변수
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);
    const [text, setText] = useState("");
    const [cnt, setCnt] = useState(10);

    // 2. 함수(호출되지 않으면 실행 안됨)
    // 글쓰기 같은 경우는 사용자가 글쓰기 버튼을 눌렀을때
    // 글목록은 사용자에 의해 호출되는게 아니고 자동으로 호출되어야함
    const boardList = async () => {
        const url = `/api/board/select.json?page=${page}&text=${text}&cnt=${cnt}`;
        const { data } = await axios.get(url);

        console.log(data);

        // 받은 게시글 목록을 rows에 보관
        setRows(data.rows);
    };

    // 3. 이펙트
    useEffect(() => {
        boardList();
    }, []);

    return (
        <div>

            <PageBanner
                eyebrow="COMMUNITY BOARD"
                title="함께 배우고 성장하는 게시판1"
                description="질문하고, 공유하고, 함께 성장하는 PKNU AI Campus입니다."
            />

            <table>
                <tbody>
                    {
                        rows.map((item, idx) => (
                            <tr key={item._id}>
                                <td>{idx}</td>
                                <td>{item._id}</td>
                                <td>{item.title}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>
    );
};

export default Board1;