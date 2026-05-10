import './Homepage.css'
import popularSearch1 from '../../assets/brand-toyota-1716782448.webp'
import popularSearch2 from '../../assets/brand-nissan.webp'
import popularSearch3 from '../../assets/brand-hyundai.webp'
import popularSearch4 from '../../assets/brand-honda.webp'
import popularSearch5 from '../../assets/brand-ford.webp'
import popularSearch6 from '../../assets/brand-acura.webp'

function Home() {
  return (
    <>

    <div className='home'>
        <div className='home-content'>
    <span className='home-title'>Shop Gear  Hub Parts by Brand</span>
    <p className='home-description'>Your one-stop shop for all your automotive needs. We offer a wide range of products and services to keep your vehicle running smoothly.</p>


      <div className="search-box  flex  max-w-2xl mx-auto  rounded-full shadow-lg overflow-hidden">
        <input 
          type="text" 
          placeholder="Search for parts, brands, or accessories..." 
          className="input-box py-4 px-6 text-gray-700 leading-tight focus:outline-none"
        />
        <button className="button-box  bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 transition-colors duration-300 focus:outline-none">
          Search
        </button>
      </div>


        </div>
        

<div className='foot-text d-flex justify-center items-center'>
        <div>
          <span>
          Popular Searches
        </span>
          </div>


      </div>

  <div>
            <ul>
              <li>
            <img src={popularSearch6} alt="Popular Search 6" />
          </li> 
          <li>
            <img src={popularSearch1} alt="Popular Search 1" />
          </li>
          <li>
            <img src={popularSearch2} alt="Popular Search 2" />
          </li>
          <li>
            <img src={popularSearch5} alt="Popular Search 5" />
          </li>
          <li>
            <img src={popularSearch3} alt="Popular Search 3" />
          </li>
          
          <li>
            <img src={popularSearch4} alt="Popular Search 4" />
          </li>
          
          
        </ul>
            </div> 


    </div>
    

    <div className='description-about'>
      <span className='description-title'>
        Shop Genuine Parts and Accessories
      </span>

      <span className='description-subtitle'>
      at Discounted Pricing
      </span>
      <p className='description-text'>
        At Gear Hub Parts Online, we make it easier to shop for auto parts online. Find the right part at the right price by searching our collection of Gear Hub catalogs by part name, part number, or your VIN. Each brand is powered by our network of dealership parts departments to ensure full inventory availability and fast shipping speeds nationwide.Don't wait longer than you need to for your parts and accessories, shop with Gear Hub Parts Online today. Select your brand to start shopping!
      </p>

    </div>

    <div className='footer flex flex-col justify-between w-full h-[30vh] bg-[#252525] text-white py-8 px-12 mt-12'>
      <div className='max-w-7xl w-full mx-auto flex justify-center '>
        {/* Navigation Column */}
        <div className='left-side flex flex-col'>
          <h3 className='Navigation-side font-bold text-2xl mb-5 pb-2  '>Navigation</h3>
          <div className='link-footer flex flex-col gap-3 text-sm'>
            <a href='#' className='text-white hover:text-gray-300 transition-colors duration-200'>Home</a>
            <a href='#' className='text-white hover:text-gray-300 transition-colors duration-200'>About</a>
            <a href='#' className='text-white hover:text-gray-300 transition-colors duration-200'>Contact</a>
            <a href='#' className='text-white hover:text-gray-300 transition-colors duration-200'>Reviews</a>
          </div>
        </div>
        
        {/* Policies Column */}
        <div className=' right-side flex flex-col'>
          <h3 className=' Navigation-side text-white font-bold text-lg mb-4 pb-2 '>Policies</h3>
          <div className='link-footer flex flex-col gap-3 text-sm'>
            <a href='#' className='text-white hover:text-gray-300 transition-colors duration-200'>Shipping Policy</a>
            <a href='#' className='text-white hover:text-gray-300 transition-colors duration-200'>Return Policy</a>
            <a href='#' className='text-white hover:text-gray-300 transition-colors duration-200'>Privacy Policy</a>
            <a href='#' className='text-white hover:text-gray-300 transition-colors duration-200'>Sitemap</a>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className='bottom-bar max-w-7xl w-full mx-auto flex justify-between items-center text-sm pt-4 border-t border-[#333]'>
        <a href='#' className=' text-white underline hover:text-gray-300'>Terms of Service & Conditions</a>
        <span>Copyright © 2026 Gear Hub Parts Online</span>
      </div>
    </div>

    
    
    
    
    
    
    
    
    
    
    </>
  )
}

export default Home;