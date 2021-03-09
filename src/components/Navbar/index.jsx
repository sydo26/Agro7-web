import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCog,
  faSignOutAlt,
  faChevronUp,
  faChevronDown,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

import { NavbarContainer } from './styles';

import { NavToogleAction } from '../../store/modules/Nav/actions';
import Tooltip from '../Tooltip';

import AuthService from '../../services/AuthService';

const Navbar = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const navOpen = useSelector(state => state.nav.open);
  const { email } = useSelector(state => state.user);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    AuthService.logout();
    Router.push('/login');
  };

  return (
    <>
      <NavbarContainer open={open}>
        <div className="navbar__content">
          <div className="navbar__content__logo">
            <FontAwesomeIcon
              icon={!navOpen ? faBars : faTimes}
              onClick={() => dispatch(NavToogleAction())}
              className="navbar_toggle__icon"
            />
            <Image src="/logo/logo.png" width="100" height="40" />
          </div>
          <div className="navbar__content__right">
            <div className="navbar_button select" onClick={() => handleClick()}>
              <div className="navbar_button__image">
                <Image src="/user-placeholder.png" width={24} height={24} />
              </div>
              <h5>
                <span className="navbar_button__text">{email}</span>
                <FontAwesomeIcon
                  icon={!open ? faChevronDown : faChevronUp}
                  className="navbar_button__icon"
                />
              </h5>
              <Tooltip opened={open} clickAction={handleClick}>
                <ul>
                  <Link href="/configuracoes">
                    <li>
                      <span style={{ width: '100%' }}>
                        <FontAwesomeIcon icon={faCog} className="icon" />{' '}
                        Configurações
                      </span>
                    </li>
                  </Link>
                  <li onClick={() => handleLogout()}>
                    <span>
                      <FontAwesomeIcon icon={faSignOutAlt} className="icon" />{' '}
                      Sair
                    </span>
                  </li>
                </ul>
              </Tooltip>
            </div>
          </div>
        </div>
      </NavbarContainer>
    </>
  );
};

export default Navbar;
