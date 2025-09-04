import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updatedAt?: string;
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostItem = styled.div`
  display: flex;
  width: 400px;
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 1rem;
  gap: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const PostTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
`;

const TitleSection = styled.div`
  display: flex;
  gap: 1rem;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: gray;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
`;

const PostMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
  justify-content: space-between;
`;

const MetaItem = styled.span``;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${(props) => (props.$active ? "#007bff" : "white")};
  color: ${(props) => (props.$active ? "white" : "#333")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.$active ? "#0056b3" : "#f8f9fa")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemPerPage = 3;

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const start = (currentPage - 1) * itemPerPage;
      const end = start + itemPerPage - 1;

      const { data, error, count } = await supabase
        .from("posts")
        .select("*", { count: "exact" })
        .range(start, end)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("조회 실패:", error);
        alert("게시글을 불러오는데 실패했습니다.");
      } else {
        setPosts(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error("조회 실패:", err);
      alert("조회에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) {
        console.error("삭제 실패 : ", error);
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      } else {
        alert("삭제 성공!");
        fetchPosts();
      }
    } catch (err) {
      console.error("살제 실패: ", err);
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const totalPages = Math.ceil(totalCount / itemPerPage);

  return (
    <ListContainer>
      {posts.map((post) => (
        <PostItem key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
          <TitleSection>
            <PostTitle>{post.title}</PostTitle>
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                deletePost(post.id);
              }}
            >
              삭제
            </DeleteButton>
            <EditButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/editpost/${post.id}`);
              }}
            >
              수정
            </EditButton>
          </TitleSection>
          <PostMeta>
            <MetaItem>
              작성일: {new Date(post.created_at).toLocaleString()}
            </MetaItem>
            {post.updatedAt && (
              <MetaItem>
                수정일: {new Date(post.updatedAt).toLocaleString()}
              </MetaItem>
            )}
          </PostMeta>
        </PostItem>
      ))}
      <PaginationContainer>
        <PageButton
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
          disabled={currentPage === 1}
        >
          이전
        </PageButton>
        {[...Array(totalPages)].map((_, index) => (
          <PageButton
            key={index + 1}
            $active={currentPage === index + 1}
            onClick={() => {
              setCurrentPage(index + 1);
            }}
          >
            {index + 1}
          </PageButton>
        ))}
        <PageButton
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </PageButton>
      </PaginationContainer>
    </ListContainer>
  );
};

export default PostList;
