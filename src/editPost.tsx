import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useNavigate, useParams } from "react-router-dom";

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

const EditButton = styled.button`
  width: 200px;
  border: none;
  border-radius: 10px;
  background-color: blue;
  color: white;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
`;

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error("조회 실패:", error);
        alert("게시글을 불러오는데 실패했습니다.");
      } else if (data) {
        setTitle(data.title);
        setContent(data.content);
      }
    } catch (err) {
      console.error("조회 실패:", err);
      alert("게시글을 불러오는데 실패했습니다.");
      navigate("/");
    }
  };

  const handleEditButton = async () => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ title, content })
        .eq("id", id);
      if (error) {
        console.error("수정 실패:", error);
        alert("수정에 실패했습니다. 다시 시도해주세요.");
      } else {
        alert("수정 성공!");
        navigate(`/post/${id}`);
      }
    } catch (err) {
      console.log("수정 실패");
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <Container>
      <h1>게시글 수정</h1>
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
      <EditButton onClick={handleEditButton}>수정</EditButton>
    </Container>
  );
};

export default EditPost;
