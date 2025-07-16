import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import * as Yup from "yup";
import React from "react";
import { IMaskInput } from "react-imask";
import { Link } from "../../components";
import { customerService, alertService } from "../../services";
import { useNavigate } from "react-router-dom";

React.useLayoutEffect = React.useEffect;

export { AddEdit };

function AddEdit(props) {
  const savedCustomer = props?.customer;
  const isAddMode = props.customer ? false : true;
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nome precisa ser preenchido."),
    address: Yup.object().shape({
      logradouro: Yup.string().required("Logradouro precisa ser preenchido."),
      number: Yup.string(),
      reference: Yup.string(),
    }),
    phone: Yup.object().shape({
      one: Yup.string(), 
      two: Yup.string(), 
    })
  
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, setValue, getValues, handleSubmit, reset, formState, control } = useForm(formOptions);
  const { errors } = formState;
  const [customer, setCustomer] = useState({})
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  function onSubmit(data) {
    return isAddMode ? createUser(data) : updateUser(savedCustomer.id, data);
  }

  async function findAddress(cep) {
    if (!cep || cep.replace(/[^0-9]/g, '').length !== 8) {
      return;
    }

    setIsLoadingCep(true);
    try {
      const cleanCep = cep.replace(/[^0-9]/g, '');
      const address = await customerService.getAddressByCep(cleanCep);
      
      if (address && address.erro !== true) {
        setValue('address.logradouro', address.logradouro || '');
        setValue('address.complemento', address.complemento || '');
        setValue('address.bairro', address.bairro || '');
        setValue('address.localidade', address.localidade || '');
        alertService.success('Endereço encontrado!');
      } else {
        alertService.error('CEP não encontrado. Verifique se o CEP está correto.');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alertService.error('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setIsLoadingCep(false);
    }
  }
  async function createUser(data) {
    try {
      data.cpf = (data.cpf || "").replace(/[^0-9]/g, "");
      data.phone.one = (data.phone.one || "").replace(/[^0-9]/g, "");
      data.phone.two = (data.phone.two || "").replace(/[^0-9]/g, "");
      await customerService.create(data);
      reset();
      alertService.success("Cliente adicionado", { keepAfterRouteChange: true });
      navigate("/customers");
    } catch (message_2) {
      return console.error(message_2);
    }
  }

  function updateUser(id, data) {
    return customerService
      .update(id, data)
      .then(() => {
        reset();
        alertService.success("Cliente editado", { keepAfterRouteChange: true });
        navigate("/customers");
      })
      .catch(alertService.error);
  }


  useEffect(() => {
    if (!isAddMode && props.customer) {
      // Fallback seguro para phone
      let phoneObj = { one: '', two: '' };
      if (typeof props.customer.phone === 'string') {
        phoneObj.one = props.customer.phone;
      } else if (typeof props.customer.phone === 'object' && props.customer.phone !== null) {
        phoneObj = {
          one: props.customer.phone.one || '',
          two: props.customer.phone.two || ''
        };
      }
      // Formatar CPF para exibição, se existir
      const formattedCpf = props.customer.cpf
        ? props.customer.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        : '';
      reset({
        name: props.customer.name || '',
        cpf: formattedCpf,
        address: {
          cep: props.customer.address?.cep || '',
          logradouro: props.customer.address?.logradouro || '',
          complemento: props.customer.address?.complemento || '',
          bairro: props.customer.address?.bairro || '',
          localidade: props.customer.address?.localidade || '',
          number: props.customer.address?.number || '',
          reference: props.customer.address?.reference || ''
        },
        phone: {
          one: phoneObj.one,
          two: phoneObj.two
        }
      });
      setCustomer(props.customer);
    }
  }, [isAddMode, props.customer, reset]);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">{isAddMode ? "Adicionar Cliente" : "Editar Cliente"}</h2>
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-100" style={{maxWidth: 500}}>
          <div className="row g-3">
            <div className="col-12">
              <label>Nome</label>
              <input
                name="name"
                type="text"
                autoComplete="off"
                {...register("name")}
                className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="col-12 col-md-6">
              <label>CPF</label>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    {...field}
                    mask="000.000.000-00"
                    type="text"
                    autoComplete="disabled"
                    className={`form-control form-control-lg ${errors.cpf ? "is-invalid" : ""}`}
                  />
                )}
              />
              <div className="invalid-feedback">{errors.cpf?.message}</div>
            </div>
            <div className="col-12 col-md-6">
              <label>Celular</label>
              <Controller
                name="phone.one"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    {...field}
                    mask="(00)00000-0000"
                    type="text"
                    autoComplete="disabled"
                    className={`form-control form-control-lg ${errors.phone?.one ? "is-invalid" : ""}`}
                  />
                )}
              />
              <div className="invalid-feedback">{errors.phone?.one?.message}</div>
            </div>
            <div className="col-12 col-md-6">
              <label>Telefone</label>
              <Controller
                name="phone.two"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    {...field}
                    mask="(00)00000-0000"
                    type="text"
                    autoComplete="disabled"
                    className={`form-control form-control-lg ${errors.phoneTwo ? "is-invalid" : ""}`}
                  />
                )}
              />
              <div className="invalid-feedback">{errors.phoneTwo?.message}</div>
            </div>
            <div className="col-12 col-md-6">
              <label>Cep</label>
              <div className="position-relative">
                <Controller
                  name="address.cep"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      {...field}
                      mask="00000-000"
                      type="text"
                      autoComplete="disabled"
                      value={field.value || ''}
                      onAccept={val => field.onChange(val)}
                      onBlurCapture={() => findAddress(getValues("address.cep"))}
                      onComplete={value => findAddress(value)}
                      className={`form-control form-control-lg ${errors.cep ? "is-invalid" : ""}`}
                      style={{ width: '100%', maxWidth: 250, letterSpacing: 2 }}
                    />
                  )}
                />
                {isLoadingCep && (
                  <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="invalid-feedback">{errors.cep?.message}</div>
            </div>
            <div className="col-12">
              <label>Logradouro</label>
              <input
                name="address.logradouro"
                type="text"
                autoComplete="off"
                {...register("address.logradouro")}
                className={`form-control form-control-lg ${errors.address?.logradouro ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.address?.logradouro?.message}</div>
            </div>
            <div className="col-12 col-md-3">
              <label>Número</label>
              <input
                name="number"
                type="number"
                autoComplete="off"
                {...register("address.number")}
                className={`form-control form-control-lg ${errors.address?.number ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.address?.number?.message}</div>
            </div>
            <div className="col-12 col-md-6">
              <label>Complemento</label>
              <input
                name="complemento"
                type="text"
                autoComplete="disabled"
                {...register("address.complemento")}
                className={`form-control form-control-lg ${errors.complemento ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.complemento?.message}</div>
            </div>
            <div className="col-12 col-md-3">
              <label>Referência</label>
              <input
                name="reference"
                type="text"
                autoComplete="off"
                {...register("address.reference")}
                className={`form-control form-control-lg ${errors.address?.reference ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.address?.reference?.message}</div>
            </div>
            <div className="col-12 col-md-6">
              <label>Bairro</label>
              <input
                name="bairro"
                type="text"
                autoComplete="disabled"
                {...register("address.bairro")}
                className={`form-control form-control-lg ${errors.bairro ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.bairro?.message}</div>
            </div>
            <div className="col-12">
              <label>Cidade</label>
              <input
                name="address.localidade"
                type="text"
                autoComplete="disabled"
                {...register("address.localidade")}
                className={`form-control form-control-lg ${errors.cidade ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.cidade?.message}</div>
            </div>
            <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2 mt-4">
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="btn btn-primary btn-lg w-100 mb-2 mb-md-0"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Salvar
              </button>
              <Link href="/customers" className="btn btn-secondary btn-lg w-100">
                Voltar
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
