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
          <span >GearHub </span>
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

  <li>
    <a href="/#">Reviews</a>
  </li>
</ul>

    </div>
<div className='companies'>

<div className='companies-navbar '>
        <ul className='companies-list'>
    <li>
    <a className='list-style' href="/#">Acura</a>
    </li>
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
    <a href="/#">GM</a>
    </li>
    <li>
    <a href="/#">Hyundai</a>
    </li>
    <li>
    <a href="/#">Infiniti</a>
    </li>
    <li>
    <a href="/#">Jaguar</a>
    </li>
    <li>
    <a href="/#">Kia</a>
    </li>
    <li>
    <a href="/#">Land Rover</a>
    </li>
    <li>
    <a href="/#">Lexus</a>
    </li>
    <li>
    <a href="/#">Mazda</a>
    </li>
    <li>
    <a href="/#">Mitsubishi</a>
    </li>
    <li>
    <a href="/#">Mopar</a>
    </li>
    <li>
    <a href="/#">Nissan</a>
    </li>
    <li>
    <a href="/#">Porsche</a>
    </li>
    <li>
    <a href="/#">Subaru</a>
    </li>
    <li>
    <a href="/#">Toyota</a>
    </li>
    <li>
    <a href="/#">Volkswagen</a>
    </li>
    <li>
    <a href="/#">Volvo</a>
    </li>












        </ul>

    </div>

</div>
    
    
    
    
    </>
    
    
  )
}

export default Navbar 













