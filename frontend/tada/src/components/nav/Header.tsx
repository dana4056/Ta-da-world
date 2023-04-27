// import { useState } from 'react';

const logo = require('../../assets/images/topLogo.png');


function Header() : JSX.Element {
	return (
		<div className='w-full pt-1 pb-8 flex justify-between'>
			<img className='w-32' src={logo}/>
		</div>
	);
}
  
export default Header;
