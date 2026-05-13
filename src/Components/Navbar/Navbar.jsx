import React from 'react'
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
    <a href="/#">Home</a>
  </li>

  <li>
    <a href="/#">About</a>
  </li>

  <li>
    <a href="/#">Contact</a>
  </li>

</ul>

    </div>
<div className='companies'>

<div className='companies-navbar '>
        <ul className='companies-list'>

    <li>
    <a href="/#">Audi</a>
    </li>
    <li>
    <a href="/#">Bmw</a>
    </li>
    <li>
    <a href="/#">FORD</a>
    </li>
    <li>
    <a href="/#">Hyundai</a>
    </li>
    <li>
    <a href="/#">Nissan</a>
    </li>
    <li>
    <a href="/#">Porsche</a>
    </li>
    <li>
    <a href="/#">Toyota</a>
    </li>












        </ul>

    </div>

</div>
    
    
    
    
    </>
    
    
  )
}

export default Navbar 













