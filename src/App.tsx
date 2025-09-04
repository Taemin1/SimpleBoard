import styled from "@emotion/styled";
import PostList from "./components/postList";
import { useNavigate } from "react-router-dom";

const Container = styled.div``;

const Title = styled.h1`
  margin-top: 3rem;
  margin-bottom: 2rem;
`;

const NewBoardButton = styled.button`
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const App = () => {
  const navigate = useNavigate();
  const handleNewBoardButton = () => {
    navigate("/newpost");
  };
  return (
    <Container>
      <Title>게시판</Title>
      <NewBoardButton onClick={handleNewBoardButton}>새 글 작성</NewBoardButton>
      <PostList />
    </Container>
  );
};

export default App;
