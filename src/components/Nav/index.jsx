import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faBook,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/router';

import Button from '../Button';

const NavContainer = styled.div`
  background: ${props => props.theme.colors.background_nav};
  position: fixed;
  border-right: 2px solid ${props => props.theme.colors.border};
  min-height: 100vh;
  width: 250px;
  overflow-y: auto;
  left: 0;
  padding: 0 8px;
  padding-top: 24px;
  margin-top: 70px;
  z-index: 99999;
  transition: transform 0.1s ease-in-out;

  &.open {
    transform: translateX(0%) !important;
    height: 100%;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    border: 0;
    margin-top: 60px;
    padding-left: 24px;
    padding-right: 24px;
    transform: translateX(-100%);
    width: 100%;
  }
`;

const NavContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  text-align: center;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .navlist_button {
    border: 0;
    height: 50px;
    font-size: 1em;
    text-align: left;
    font-weight: 700;
    opacity: 0.8;
    margin: 0 !important;
    display: flex;
    align-items: center;
    padding: 12px 16px;

    a {
      color: ${props => props.theme.colors.black};
    }

    .navlist_button__icon {
      font-size: 1.2em;
      align-items: flex-start;
      margin-right: 17px;
    }

    &.active,
    &:hover {
      opacity: 1;
      background: ${props => props.theme.colors.gray};
    }

    &.active {
      a {
        color: ${props => props.theme.colors.green};
      }
    }

    @media screen and (max-width: ${props =>
        props.theme.breakpoints.mobile}px) {
      font-size: 1.1em;
      height: 60px;

      .navlist_button__icon {
        font-size: 1.3em;
      }
    }
  }
`;

const NavButton = ({ link, icon, text }) => {
  const router = useRouter();
  let active = '';
  const path = router.pathname === '/' || router.pathname.split('/')[1];

  if (`/${path}` === link) {
    active = 'active';
  }

  return (
    <Link href={link}>
      <Button className={`navlist_button ${active}`}>
        <a>
          <FontAwesomeIcon icon={icon} className="navlist_button__icon" />
          <span className="navlist_button__description">{text}</span>
        </a>
      </Button>
    </Link>
  );
};
const Nav = () => {
  const navOpen = useSelector(state => state.nav.open);
  const { types } = useSelector(state => state.user);

  return (
    <NavContainer className={navOpen ? 'open' : ''}>
      <NavContent>
        <NavList>
          {types === 'administrator' && (
            <>
              <NavButton
                link="/admin"
                icon={faUser}
                text="Painel Administrativo"
              />
              <hr />
            </>
          )}
          <NavButton link="/" icon={faHome} text="Página Inicial" />
          <NavButton
            link="/propriedades"
            icon={faMapMarkerAlt}
            text="Propriedades"
          />
          <NavButton
            link="/caderno-produtor"
            icon={faBook}
            text="Caderno Produtor"
          />
        </NavList>
      </NavContent>
    </NavContainer>
  );
};

export default Nav;
