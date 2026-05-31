import { useNavigate } from 'react-router-dom'; 
import mainbanner from '../assets/Main-Banner-1.png';
import NavigationBar from '../components/NavigationBar';
import img1 from '../assets/home-image-1.png';
import img2 from '../assets/home-image-2.png';
import img3 from '../assets/home-image-3.png';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate(); 

  const handleOrderClick = () => {
    navigate('/order'); 
  };

  return (
    <div className="bg-paleblue">
      <NavigationBar />
      <div
        className="relative h-[360px] md:h-[520px] bg-blue/10"
        style={{
          backgroundImage: `url(${mainbanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 max-w-7xl mx-auto p-3 mt-20">
          <h1 className="max-w-xl text-5xl leading-tight font-bold text-white">
            YOU CLICK.
          </h1>
          <h1 className="max-w-xl text-5xl leading-tight font-bold text-white">
            WE'LL DELIVER.
          </h1>
          <h1 className="max-w-xl text-5xl leading-tight font-bold" style={{color: '#00AAEF'}}>
          SUPER QUICK.
          </h1>
          <p className="text-black mt-2 text-xl font-bold" style={{ color: '#EEEEEE' }}>
            On-time gas delivery, every home, every day.
          </p>
          <button
            onClick={handleOrderClick} 
            type="button" 
            className="bg-blue text-white rounded-md px-5 p-3 mt-10 hover:bg-light-blue transition-all"
          >
            Order Gas Cylinders
          </button>
        </div>
      </div>
      <div className="flex max-w-5xl mx-auto justify-center items-center mt-8 mb-8 gap-4 px-1">
        <img src={img1} alt="" className="w-5/5 max-w-md h-auto object-contain"/>
        <img src={img2} alt="" className="w-5/5 max-w-md h-auto object-contain"/>
        <img src={img3} alt="" className="w-5/5 max-w-md h-auto object-contain"/>
      </div>
      <Footer />
    </div>
  );
}
