import styled from 'styled-components'

export const Head = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 0 16px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #e0e0e0;
    justify-content: space-between;

    .user-info {
        display: flex;
        align-items: center;

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 12px;
            object-fit: cover;
        }

        .name-status {
            display: flex;
            flex-direction: column;

            .name {
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }

            .status {
                font-size: 12px;
                color: #4caf50;
            }
        }
    }

    .actions {
        display: flex;
        align-items: center;

        svg {
            margin-left: 16px;
            color: #555;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
                color: #007bff;
            }
        }
    }
`;
