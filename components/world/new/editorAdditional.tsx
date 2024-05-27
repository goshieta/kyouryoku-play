import React, { ReactNode } from "react";
import styled from "styled-components";

interface ButtonProps {
  active: boolean;
  onMouseDown: (event: React.MouseEvent) => void;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  active,
  onMouseDown,
  children,
}) => (
  <StyledButton active={active} onMouseDown={onMouseDown}>
    {children}
  </StyledButton>
);

interface StyledButtonProps {
  active: boolean;
}

const StyledButton = styled.span<StyledButtonProps>`
  cursor: pointer;
  color: ${({ active }) => (active ? "black" : "#ccc")};
  margin: 0 5px;
`;

export const Icon = styled.span`
  font-size: 18px;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #eee;
  margin-bottom: 10px;
  padding: 10px;
`;
