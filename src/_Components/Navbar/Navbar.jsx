import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/logo-parts.webp'


const Navbar = () => {
  return (
    <>
    <div className='navbar '>
      <ul className='logo-list flex items-center gap-2'>
        <li>
          <img src={logo} alt='logo' className='logo' />
        </li>
        <li className='logo-text '>
          <span >Gear <span className='logo-red '>Hub </span></span>
          <span className='logo-subtext'>Auto Parts and Accessories</span>
        </li>

      </ul>
        

        <ul className='nav-links'>
  <li>
    <Link to="/">Home</Link>
  </li>

  <li>
    <a href="/#about">About</a>
  </li>

  <li>
    <a href="/#">Contact</a>
  </li>
  <li>
    <Link to="/products">All Products</Link>
  </li>
  <li>
    <Link to="/login">Login</Link>
  </li>
  {/* <li>
    <Link to="/signup">Signup</Link>
  </li> */}

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













