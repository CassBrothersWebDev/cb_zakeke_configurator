import styled from "styled-components";

export const List = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

export const ListItem = styled.li<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 20px 30px;
  cursor: pointer;
  margin-right: 20px;
  border: ${(props) => (props.selected ? "2px solid #002240" : "none")};

  &:hover {
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
  }

 
`;

export const ListItemImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin-bottom: 20px;
`;
