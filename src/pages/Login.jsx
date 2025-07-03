import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Layout } from '../../components/account';
import { userService } from '../../services/user.service';

export default Login;

function Login() {
    const navigate = useNavigate()
    const user = userService?.userValue

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('O Usuário não pode estar vazio.'),
        password: Yup.string().required('A senha não pode estar vazia.')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ username, password }) {
        return userService.login(username, password)
        .then(() => {
            navigate('/', { replace: true })
        }).catch(error => {
            setError('apiError', { message: error.message || error })
        })
    }
    return (
        <Layout>
            <div className="login-card-container">
                <h4 className="card-header mb-4">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Usuário</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Senha</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        {errors.apiError && (
                            <div className="alert alert-danger mt-2">{"Sistema fora!"}</div>
                        )}
                        <button disabled={formState.isSubmitting} className="btn btn-primary my-2">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
} 