import styled from 'styled-components';

import { ShrinkedLabel } from './mixins';

export const InputContainer = styled.div`
  position: relative;
`;

export const StyledInput = styled.input`
  background-color: ${props => props.theme.colors.gray};
  border: 1px solid ${props => props.theme.colors.gray};
  color: ${props => props.theme.colors.black};
  font-size: 1em;
  height: 50px;
  line-height: 50px;
  padding: 16px 20px 0;
  ${props => (props.type !== 'checkbox' ? `display: block;` : '')};
  ${props => (props.type !== 'checkbox' ? `width: 100%;` : '')};
  border-radius: 10px;
  ${props => (props.type !== 'checkbox' ? `margin: 5px 0px 15px` : '')};
  transition: background 0.3s;

  &:hover,
  &:focus {
    background-color: ${props => props.theme.colors.white};
    border: 1px solid ${props => props.theme.colors.border};
  }

  &:focus + .input-label {
    ${ShrinkedLabel}
  }
`;

export const Label = styled.label`
  color: ${props => props.theme.colors.black_50};
  cursor: text;
  font-size: 1em;
  font-weight: 800;
  text-align: left;
  transition: ease 0.2s;
  position: absolute;
  left: 20px;
  top: 45%;
  transform: translateY(-40%);
  pointer-events: none;

  &.label_active {
    ${ShrinkedLabel}
  }
`;
