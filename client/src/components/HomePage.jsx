import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertical center */
  align-items: center;     /* horizontal center */
  height: 100vh;           /* full viewport height */
  width: 100vw;            /* full viewport width */
  background: rgba(1, 4, 10, 1);     /* light gray background */
`;

const Title = styled.h1`
  margin-bottom: 40px;
  font-size: 2rem;
`;

const Button = styled.button`
  margin: 10px;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #4a90e2;
  color: white;
  transition: background 0.3s;

  &:hover {
    background: #357ab8;
  }
`;

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Welcome to Skylark</Title>
      <Button onClick={() => navigate("/login")}>Login</Button>
      <Button onClick={() => navigate("/register")}>Register</Button>
    </Container>
  );
}
