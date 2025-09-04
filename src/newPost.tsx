import styled from "@emotion/styled";
import { useState } from "react";
import { supabase } from "./lib/supabase";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const TitleInput = styled.input`
  width: 400px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  width: 400px;
  height: 300px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
`;

const UploadButton = styled.button`
  width: 200px;
  border: none;
  border-radius: 10px;
  background-color: blue;
  color: white;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
`;

const NewPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleUploadButton = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
    }

    try {
      const result = await supabase.from("posts").insert({ title, content });
      const error = result.error;
      if (error) {
        console.error("작성 실패 : ", error);
        alert("작성에 실패했습니다. 다시 시도해주세요.");
      } else {
        alert("작성 성공!");
        navigate("/");
      }
    } catch (err) {
      console.error("작성 실패 : ", err);
      alert("게시물 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <h1>게시글 작성</h1>
      <TitleInput
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <UploadButton onClick={handleUploadButton}>작성</UploadButton>
    </Container>
  );
};

export default NewPost;
