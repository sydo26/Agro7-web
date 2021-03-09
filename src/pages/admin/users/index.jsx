import React, { useCallback } from 'react';
import Head from 'next/head';

import Container from '../../../components/Container';
import Nav from '../../../components/Nav';
import Navbar from '../../../components/Navbar';
import Breadcrumb from '../../../components/Breadcrumb';
import {
  Section,
  SectionHeader,
  SectionBody
} from '../../../components/Section';

import { CardContainer } from '../../../components/CardContainer';
import { privateRoute } from '../../../components/PrivateRoute';
import NotFound from '../../../components/NotFound';
import Table from '../../../components/Table';

import Loader from '../../../components/Loader';
import Error from '../../../components/Error';
import { useFetch } from '../../../hooks/useFetch';
import ActionButton from '../../../components/ActionButton';
import { useModal } from '../../../hooks/useModal';

function AdminUsers({ permission }) {
  const { data, error } = useFetch(`/users/find/all`);
  const { addModal, removeModal } = useModal();

  if (!permission) return <NotFound />;
  if (error) return <Error />;

  const handleDeleteModal = useCallback(
    id => {
      addModal({
        title: 'Deletar Usuário',
        text: 'Deseja realmente deletar este usuário?',
        confirm: true,
        onConfirm: () => console.log(id),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  return (
    <>
      <Head>
        <title>Painel Adminstrativo | Gerenciar Usuários - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/admin', name: 'Painel Adminstrativo' },
                  { route: '/admin/users', name: 'Gerenciar Usuários' }
                ]}
              />
              <h2>Gerenciar Usuários</h2>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && (
                  <div className="table-responsive">
                    <Table>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>E-mail</th>
                          <th>Documento</th>
                          <th>Telefone</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.users &&
                          data.users.map(user => (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.documents}</td>
                              <td>{user.phone}</td>
                              <td>
                                <ActionButton
                                  id={user.id}
                                  path="/admin/users"
                                  onDelete={() => handleDeleteModal(user.id)}
                                />
                              </td>
                            </tr>
                          ))) || (
                          <tr>
                            <td colSpan="5">Não há usuários cadastrados</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )) || <Loader />}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(AdminUsers);
// export default privateRoute(['adminstrator'])(AdminUsers);
