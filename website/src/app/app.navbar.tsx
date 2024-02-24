import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <Link to="home">Home</Link>
      <Link to="bio">Bio</Link>
      <Link to="support">Support</Link>
    </nav>
  );
};

export default NavBar;
