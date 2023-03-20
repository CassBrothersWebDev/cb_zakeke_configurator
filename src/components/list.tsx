import styled from "styled-components";

export const List = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

export const ListItem = styled.li<{ selected?: boolean, available?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 20px 30px;
  cursor: ${(props) => (props.available ? "pointer": "not-allowed")};
  margin-right: 20px;
  border: ${(props) => (props.selected ? "2px solid #002240" : "none")};
  opacity: ${(props) => (props.available ? "1" : "0.5")};
  
  &:hover {
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
  }
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -20%;
    width: 140%;
    height: 2px;
    background-color: black;
    transform: translateY(-50%) rotate(45deg);
    display: ${(props) => (props.available ? "none" : "block")};
  }

  ${(props) => !props.available && `
    border: 2px solid black;
  `}

  
 
`;

export const ListItemImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin-bottom: 20px;
`;
