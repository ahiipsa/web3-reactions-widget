import styled from "styled-components";

export const Button = styled.button<{ $width?: string }>`
  font-family: 'Tahoma', system-ui;
  font-size: 1rem;
  font-weight: 200;
  border: none;
  text-decoration: none;

  width: ${(props) => props.$width || '128px'};
  color: white;
  background: #00aee9;
  border-radius: 5px;
  padding: 8px 16px;
  text-align: center;
  &:hover {
    color: #fff;
    background: #101042;
    cursor: pointer;
  }
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`
