import { useEffect } from 'react';

// import { userService } from 'services';

export { Layout };

function Layout({ children }) {
    // const navigate = useNavigate();

    useEffect(() => {
        // Se necessário, redirecionar usando useNavigate do react-router-dom
        // redirect to home if already logged in
        // if (userService.userValue) {
        //     navigate('/');
        // }
    }, []);

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            {children}
        </div>
    );
}