// import { useState } from 'react';

const logo = require('../../assets/images/topLogo.png');


function Header() : JSX.Element {
	return (
		<div className='w-full flex justify-between'>
			<img className='w-28' src={logo}/>
		</div>
	);
}
  
export default Header;
