import { NavLink } from './NavLink';
import { useState, useEffect } from 'react'
import { userService } from '../services'

export default function Nav() {
    const [user, setUser] = useState({})

    useEffect(() => {
        // const subscription = userService?.user.subscribe(x => setUser(x));
        // return () => subscription?.unsubscribe();
    }, [])

    function logout() {
        userService?.logout();
    }

    if (!user) return null;

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink href="/" exact className="nav-item nav-link">Inicio</NavLink>
                <NavLink href="/customers" className="nav-item nav-link">Clientes</NavLink>
                <NavLink href="/products" className="nav-item nav-link">Produtos</NavLink>
                <NavLink href="/costs" className="nav-item nav-link">Custos</NavLink>
                {/* <NavLink href="/products" className="nav-item nav-link">Pedidos</NavLink> */}
                <NavLink href="/cash-flow" className="nav-item nav-link">Caixa</NavLink>
                <a onClick={logout} className="nav-item nav-link">Logout</a>
            </div>
        </nav>
    );
}