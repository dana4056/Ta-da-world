import tw from 'tailwind-styled-components';

export const Button = tw.div`
  flex justify-center items-center 
  w-3/5 h-12 
  bg-red rounded-lg 
  text-white font-bold
`;

export const Label = tw.label`
	h-8
	text-base font-bold
`;

export const Input = tw.input`
	w-full h-8
	text-base
	bg-white2 rounded-lg border-2 border-gray
	py-4 px-3 mt-2 mb-8 mx-1
`;

const Semantics = {
	Button,
	Label,
	Input
};

export default Semantics;