import { useState } from 'react';
import SideBar from './SideBar';

// import logo from "../../assets/images/logo.png";
import { FiAlignRight } from 'react-icons/fi';

function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const toggleSide = () => {
		setIsOpen(true);
	};

	return (
		<div>
			{/* <img src={logo}/> */}
			<FiAlignRight size="28" onClick={toggleSide}/>
			<SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	);
}
  
export default Header;
