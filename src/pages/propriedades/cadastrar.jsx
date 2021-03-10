import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';

import { privateRoute } from '@/components/PrivateRoute';
import getFormData from '@/helpers/getFormData';
import { Alert } from '@/components/Alert/index';

import errorMessage from '@/helpers/errorMessage';

import PropertiesService from '@/services/PropertiesService';
import Router from 'next/router';
import AddressesService from '@/services/AddressesService';

const schema = yup.object().shape({
  name: yup
    .string()
    .min(4, 'O nome precisa ter no mínimo 4 caracteres')
    .required('O campo nome é obrigatório!'),
  area: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A área precisa ser definida')
    .positive('A área precisa ter um valor positivo'),
  type_dimension: yup.string().min(1).max(1).required(),
  type_owner: yup.string().min(1).required(),
  latitude: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A latidute é obrigatória'),
  longitude: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A longitude é obrigatória'),
  state: yup
    .string()
    .min(2, 'O estado tem que ter no mínimo 2 caracteres')
    .max(15, 'Você não pode ultrapassar 15 caracteres no nome do estado')
    .required('Você precisa informar o estado da propriedade.'),
  neighborhood: yup
    .string()
    .min(2, 'O nome do bairro tem que ter no mínimo 2 caracteres')
    .max(50, 'Você não pode ultrapassar 50 caracteres no nome do bairro')
    .required('Você precisa informar o bairro da propriedade'),
  city: yup
    .string()
    .min(2, 'O nome da cidade tem que ter no mínimo 2 caracteres')
    .max(50, 'O nome da cidade não pode ultrapassar 50 caracteres')
    .required('Você precisa informar a cidade da propriedade'),
  postcode: yup
    .string()
    .min(
      9,
      'Você tem que digitar no mínimo e no máximo 9 caracteres, para o CEP. Ex: 00000000'
    )
    .max(
      9,
      'Você tem que digitar no mínimo e no máximo 9 caracteres para o CEP. Ex: 00000000'
    )
    .required('Você precisa informar o CEP da propriedade'),
  street: yup
    .string()
    .min(4, 'O nome da rua tem que ter no mínimo 4 caracteres')
    .max(50, 'O nome da rua não pode ultrapassar 50 caracteres')
    .required('Você precisa informar a rua da propriedade'),
  number: yup
    .string()
    .max(50, 'O número não pode ultrapassar 50 caracteres')
    .required('Você precisa informar o número da propriedade'),
  complements: yup
    .string()
    .max(100, 'O complemento não pode ultrapassar 100 caracteres')
    .nullable()
});

function PropertiesRegister() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const neighborhoodRef = useRef(null);
  const streetRef = useRef(null);
  const postalcodeRef = useRef(null);

  useEffect(
    () => () => {
      setAlert({ type: '', message: '' });
      setDisableButton(false);
      setActiveStep(1);
      setLoadingAddresses(false);
    },
    []
  );

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        area: null,
        type_dimension: 'm',
        type_owner: 'proprietario',
        latitude: null,
        longitude: null,
        state: null,
        neighborhood: null,
        city: null,
        postcode: null,
        street: null,
        number: null,
        complements: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      area: null,
      type_dimension: 'm',
      type_owner: 'proprietario',
      latitude: null,
      longitude: null,
      state: null,
      neighborhood: null,
      city: null,
      postcode: null,
      street: null,
      number: null,
      complements: null
    });
  };

  const handleChangeCep = e => {
    const { value } = e.target;
    if (value.length === 9) {
      setLoadingAddresses(true);
      AddressesService.getCep(value.replace('-', '')).then(res => {
        if (res.data !== '') {
          const { state, city, neighborhood, street } = res.data;
          if (!stateRef.current.value) {
            stateRef.current.setValue(state);
          }
          if (!cityRef.current.value) {
            cityRef.current.setValue(city);
          }
          if (!neighborhoodRef.current.value) {
            neighborhoodRef.current.setValue(neighborhood);
          }
          if (!streetRef.current.value) {
            streetRef.current.setValue(street);
          }
        }
        setLoadingAddresses(false);
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);
    schema
      .validate(getData())
      .then(async data => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        await PropertiesService.create(data).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            setAlert({
              type: 'success',
              message: 'Propriedade cadastrada com sucesso!'
            });

            setTimeout(() => {
              Router.push('/propriedades');
              setDisableButton(false);
            }, 1000);
          }
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
      });
  };

  return (
    <>
      <Head>
        <title>Cadastrar propriedade - Agro7</title>
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
                  { route: '/properties', name: 'Propriedades' }
                ]}
              />
              <h2>Cadastre uma propriedade</h2>
              <p>Aqui você irá cadastrar uma propriedade</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}

                <form
                  id="registerForm"
                  ref={formRef}
                  method="post"
                  onSubmit={event => handleSubmit(event)}
                >
                  <MultiStep activeStep={activeStep}>
                    <Step label="Dados" onClick={() => setActiveStep(1)}>
                      <h4 className="step-title">Dados da Propriedade</h4>

                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Nome da propriedade"
                            name="name"
                            initialValue=""
                          />
                        </div>
                        <div>
                          <Select
                            options={[
                              { value: 'proprietario', label: 'Proprietário' }
                            ]}
                            label="Quem é você para esta propriedade?"
                            value="proprietario"
                            name="type_owner"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            label="Área"
                            name="area"
                            initialValue=""
                          />
                        </div>
                        <div>
                          <Select
                            options={[{ value: 'm', label: 'Metros' }]}
                            label="Unidade de medida"
                            value="m"
                            name="type_dimension"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Estado"
                            name="state"
                            initialValue=""
                            ref={stateRef}
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Cidade"
                            name="city"
                            initialValue=""
                            ref={cityRef}
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="CEP"
                            name="postcode"
                            initialValue=""
                            mask="cep"
                            disabled={loadingAddresses}
                            ref={postalcodeRef}
                            handleChange={handleChangeCep}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Bairro"
                            name="neighborhood"
                            initialValue=""
                            ref={neighborhoodRef}
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Rua"
                            name="street"
                            initialValue=""
                            ref={streetRef}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Número"
                            name="number"
                            initialValue=""
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Complementos"
                            name="complements"
                            initialValue=""
                          />
                        </div>
                      </div>
                    </Step>
                    <Step label="Selecionar" onClick={() => setActiveStep(2)}>
                      <h4 className="step-title">Selecionar Propriedade</h4>

                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            label="Latitude"
                            name="latitude"
                            initialValue=""
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            label="Longitude"
                            name="longitude"
                            initialValue=""
                          />
                        </div>
                      </div>
                    </Step>
                  </MultiStep>

                  <div className="form-group buttons">
                    {activeStep !== 1 && (
                      <div>
                        <Button
                          type="button"
                          onClick={() => setActiveStep(activeStep - 1)}
                        >
                          Voltar
                        </Button>
                      </div>
                    )}
                    <div>
                      {activeStep !== 2 && (
                        <Button
                          type="button"
                          onClick={() => setActiveStep(activeStep + 1)}
                        >
                          Continuar
                        </Button>
                      )}

                      {activeStep === 2 && (
                        <Button
                          disabled={disableButton}
                          className="primary"
                          type="submit"
                        >
                          Cadastrar propriedade
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(PropertiesRegister);
