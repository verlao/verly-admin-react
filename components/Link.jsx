import { Link as RouterLink } from 'react-router-dom';

export { Link };

function Link({ href, children, ...props }) {
  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
}
