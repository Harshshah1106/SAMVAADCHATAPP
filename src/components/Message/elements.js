import styled from 'styled-components';

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.isSender ? 'row-reverse' : 'row'};
  margin-bottom: 10px;
`;

export const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isSender ? 'flex-end' : 'flex-start'};
`;

export const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: ${props => props.isSender ? '0 0 0 10px' : '0 10px 0 0'};
`;

export const MessageBubble = styled.div`
  background-color: ${props => props.isSender ? '#007bff' : '#f1f0f0'};
  color: ${props => props.isSender ? 'white' : 'black'};
  border-radius: 18px;
  padding: 10px 15px;
  max-width: 60%;
  word-wrap: break-word;
`;

export const Timestamp = styled.span`
  font-size: 0.75rem;
  color: #999;
  margin-top: 5px;
`;
