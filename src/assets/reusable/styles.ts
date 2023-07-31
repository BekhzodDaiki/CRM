import styled from 'styled-components';

export const CenterPos = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #7F7FD5;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

export const Card = styled.div`
  box-shadow: 0px 10px 25px 0px rgb(29 17 3 / 12%);
  position: relative;
  padding: 50px;
  border-radius: 8px;
  border: 3px solid #f1f1f1;
  z-index: 2;
  background: rgba(255, 255, 255, 0.28);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;