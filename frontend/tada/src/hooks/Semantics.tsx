import tw from 'tailwind-styled-components';

interface StyledGraColor {
	from: string;
	to: string;
}

export const GraButton = tw.div<StyledGraColor>`
	w-60 h-12
	flex justify-center items-center 
	shadow-lg rounded-xl
	font-semibold text-white 
	${({ from, to }) => `
		bg-gradient-to-r ${from} ${to}
	`}
`;

export const Button = tw.div`
  flex justify-center items-center 
  w-full h-11 
  bg-blue rounded-lg 
  text-white font-bold
  m-1
`;

export const Label = tw.label`
	h-8
	text-base font-extrabold
`;

export const Input = tw.input`
	w-full h-8
	text-base
	bg-white2 rounded-lg border-2 border-gray
	py-4 px-3 mt-2 mb-8 mx-1
`;


export const Modal  = tw.div`
	hidden fixed top-0 right-0 bottom-0 left-0 z-50
	bg-gray5/70
`;

export const ModalSection = tw.div`
	flex flex-col justify-center items-center
 	w-full h-96 max-w-xs
	bg-white2 rounded-lg border-8 border-white2
	py-2 px-1
`;

export const ModalHeader  = tw.div`
	flex justify-between items-center
	w-full
	text-gray4 text-lg font-bold
	mb-2
`;

const Semantics = {
	Button,
	GraButton,
	Label,
	Input,
	Modal
};

export default Semantics;