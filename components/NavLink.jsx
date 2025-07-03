import { useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export { NavLink };

NavLink.propTypes = {
    href: PropTypes.string.isRequired,
    exact: PropTypes.bool
};

NavLink.defaultProps = {
    exact: false
};

function NavLink({ children, href, exact, ...props }) {
    const { pathname } = useLocation();
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    if (isActive) {
        props.className = (props.className || '') + ' active';
    }
    return <Link to={href} {...props}>{children}</Link>;
}