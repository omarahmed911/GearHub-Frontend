import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../../utils/authService'
import './Navbar.css'
import logo from '../../assets/logo-parts.webp'

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token;

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <>
    <div className='navbar '>
      <ul className='logo-list flex items-center gap-2'>
        <li>
          <Link to="/"><img src={logo} alt='logo' className='logo' /></Link>
        </li>
        <li className='logo-text '>
          <span >Gear <span className='logo-red '>Hub </span></span>
          <span className='logo-subtext'>Auto Parts and Accessories</span>
        </li>
      </ul>

      <ul className='nav-links items-center'>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">All Products</Link></li>
        {isLoggedIn ? (
          <>
            {user.role === 'TRADER' ? (
              <li><Link to="/trader">Trader Panel</Link></li>
            ) : (
              <>
                <li><Link to="/orders">My Orders</Link></li>
                <li><Link to="/cart">Cart</Link></li>
              </>
            )}
            <li>
              <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </div>
    <div className='companies'>

<div className='companies-navbar '>
        <ul className='companies-list'>


    <li>
    <Link to="/products">BMW</Link>
    </li>
    <li>
    <Link to="/products">FORD</Link>
    </li>
    <li>
    <Link to="/products">Hyundai</Link>
    </li>
    <li>
    <Link to="/products">Nissan</Link>
    </li>
    <li>
    <Link to="/products">Honda</Link>
    </li>
    <li>
    <Link to="/products">Toyota</Link>
    </li>












        </ul>

    </div>

</div>
    
    
    
    
    </>
    
    
  )
}

export default Navbar 













