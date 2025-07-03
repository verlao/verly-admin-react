import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import * as Yup from "yup";
import React from "react";
import { IMaskInput } from "react-imask";
import { Link } from "../../components";
import { customerService, alertService } from "../../services";

React.useLayoutEffect = React.useEffect;

export { AddEdit };

function AddEdit(props) {
  const savedCustomer = props?.customer;
  const isAddMode = props.customer ? false : true;
  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nome precisa ser preenchido."),
    address: Yup.object().shape({
      logradouro: Yup.string().required("Logradouro precisa ser preenchido."),
      number: Yup.string(),
      reference: Yup.string(),
    }),
    phone: Yup.object().shape({
      one: Yup.string().required("Celular precisa ser preencido."),
    })


    // complemento: Yup.string().required("Complemento precisa ser preenchido."),
    // bairro: Yup.string().required("Bairro precisa ser preenchido."),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, setValue, getValues, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const [customer, setCustomer] = useState({})

  function onSubmit(data) {
    return isAddMode ? createUser(data) : updateUser(savedCustomer.id, data);
  }

  async function findAddress(cep) {
    const address = await customerService.getAddressByCep(cep.replace("-", ""));
    setValue('address.logradouro', address.logradouro)
    setValue('address.complemento', address.complemento);
    setValue('address.bairro', address.bairro);
    setValue('address.localidade', address.localidade);
    return address;
  }
  async function createUser(data) {
    try {
      data.cpf = data.cpf.replace(".", "");
      data.phone.one = data.phone.one.replace("(", "").replace(")", "").replace("-", "").replace("_", "");
      data.phone.two = data.phone.two.replace("(", "").replace(")", "").replace("-", "").replace("_", "");
      await customerService.create(data);
      reset();
      alertService.success("Cliente adicionado", { keepAfterRouteChange: true });
      window.location.href = "/customers";
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
        window.location.href = "/customers";
      })
      .catch(alertService.error);
  }


  useEffect(() => {
    if (!isAddMode) {
      customerService.getById(props.customer.id).then(customer => {
        setValue('name', customer.name)
        setValue('cpf', customer.cpf)
        setValue('address.cep', customer.address.cep)
        setValue('address.logradouro', customer.address.logradouro)
        setValue('address.complemento', customer.address.complemento)
        setValue('address.bairro', customer.address.bairro)
        setValue('address.localidade', customer.address.localidade)
        setValue('phone.one', customer.phone.one)
        setValue('phone.two', customer.phone.two)
        setCustomer(customer);
      });
    }
  }, []);

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
              <IMaskInput
                mask="000.000.000-00"
                name="cpf"
                type="text"
                autoComplete="disabled"
                {...register("cpf")}
                className={`form-control form-control-lg ${errors.cpf ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.cpf?.message}</div>
            </div>
            <div className="col-12 col-md-6">
              <label>Celular</label>
              <IMaskInput
                mask="(00)00000-0000"
                name="phoneOne"
                type="text"
                autoComplete="disabled"
                {...register("phone.one")}
                className={`form-control form-control-lg ${errors.phone?.one ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.phone?.one?.message}</div>
            </div>
            <div className="col-12 col-md-6">
              <label>Telefone</label>
              <IMaskInput
                mask="(00)00000-0000"
                name="phone.two"
                type="text"
                autoComplete="disabled"
                {...register("phone.two")}
                className={`form-control form-control-lg ${errors.phoneTwo ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.phoneTwo?.message}</div>
            </div>
            <div className="col-12 col-md-6">
              <label>Cep</label>
              <IMaskInput
                mask="00000-000"
                name="cep"
                type="text"
                autoComplete="disabled"
                onBlurCapture={() => findAddress(getValues("address.cep"))}
                {...register("address.cep")}
                className={`form-control form-control-lg ${errors.cep ? "is-invalid" : ""}`}
              />
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
              <button
                onClick={() => reset(formOptions.defaultValues)}
                type="button"
                disabled={formState.isSubmitting}
                className="btn btn-warning btn-lg w-100 mb-2 mb-md-0"
              >
                Limpar
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
