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
    const base = import.meta.env.BASE_URL || '/verly-admin-react/';
    let fullHref;

    if (href.startsWith(base)) {
        fullHref = href;
    } else if (href.startsWith('/')) {
        fullHref = href;
    } else {
        fullHref = base.replace(/\/$/, '') + '/' + href.replace(/^\/+/,'');
    }

    const isActive = exact ? pathname === fullHref : pathname.startsWith(fullHref);
    if (isActive) {
        props.className = (props.className || '') + ' active';
    }
    return <Link to={fullHref} {...props}>{children}</Link>;
}