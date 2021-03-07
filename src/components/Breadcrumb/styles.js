import styled from 'styled-components';

export const BreadcrumbContainer = styled.div`
  color: ${props => props.theme.colors.black_50};
  margin-bottom: 4px;

  h5 {
    display: inline-block;
    height: 20px;
    vertical-align: bottom;
  }

  a {
    color: ${props => props.theme.colors.black_50};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  span {
    pointer-events: none;
    padding: 0px 6px;

    .separator {
      width: 7px !important;
    }
  }
`;
