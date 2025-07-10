import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { userService } from '../../services/user.service';

export default function Login() {
    const navigate = useNavigate();
    const [apiErrorMessage, setApiErrorMessage] = useState(null);
    const errorTimeoutRef = useRef(null);

    useEffect(() => {
        if (userService.isAuthenticated) {
            navigate('/leads', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        return () => {
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
        };
    }, []);

    if (userService.isAuthenticated) {
        return null;
    }

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
                navigate('/leads', { replace: true });
            }).catch(error => {
                setError('apiError', { message: error.message || error });
                setApiErrorMessage(error.message || error);
                if (errorTimeoutRef.current) {
                    clearTimeout(errorTimeoutRef.current);
                }
                errorTimeoutRef.current = setTimeout(() => {
                    setApiErrorMessage(null);
                }, 10000); // 10 segundos
            });
    }

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
            <h4 className="mb-4">Login</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group mb-3">
                    <label>Usuário</label>
                    <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.username?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label>Senha</label>
                    <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                {(apiErrorMessage || errors.apiError) && (
                    <div className="alert alert-danger mt-2">{apiErrorMessage || errors.apiError?.message}</div>
                )}
                <button disabled={formState.isSubmitting} className="btn btn-primary my-2 w-100">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Login
                </button>
            </form>
        </div>
    );
} 