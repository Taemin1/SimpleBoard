import { supabase } from "./lib/supabase";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updatedAt?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const HeaderSection = styled.h1`
  margin-bottom: 2rem;
  margin-top: 3rem;
`;

const Title = styled.div`
  width: 400px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
`;

const Textarea = styled.div`
  width: 400px;
  height: 300px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
`;

const HomeButton = styled.button`
  width: 200px;
  height: 50px;
  border: none;
  border-radius: 10px;
  background-color: green;
  color: white;
  font-size: 20px;
  cursor: pointer;
`;

const Post = () => {
  const [post, setPost] = useState<Post | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const result = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      const error = result.error;
      if (error) {
        console.error("조회 실패 : ", error);
        alert("게시글을 불러오는데 실패했습니다. 다시 시도해주세요.");
      } else {
        setPost(result.data);
      }
    } catch (err) {
      console.error("조회 실패 : ", err);
      alert("게시글을 불러오는데 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <HeaderSection>게시글 조회</HeaderSection>
      <Title>{post?.title}</Title>
      <Textarea>{post?.content}</Textarea>
      <HomeButton onClick={() => navigate("/")}>홈으로</HomeButton>
    </Container>
  );
};

export default Post;
