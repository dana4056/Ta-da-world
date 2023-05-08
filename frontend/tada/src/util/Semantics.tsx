import tw from 'tailwind-styled-components';

interface StyledGraColor {
	from: string;
	to: string;
}

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	valid: boolean | null;
}

export const CustomInput = tw.input<CustomInputProps>`
	h-10 px-4 mb-5 border shadow-lg placeholder:text-sm placeholder:text-gray2 text-gray5 w-60 rounded-xl
	${({ valid }) => (valid === false ? 'border-2 border-red' : 'border-gray2')}
`;

export const CustomButton = tw.button<{ valid: boolean | null }>`
h-10 text-white shadow-lg rounded-xl w-60
	${({ valid }) => {
		if (valid === false) {
			return 'bg-red text-sm';
		}
		return 'bg-gradient-to-r from-orange to-orange2 font-semibold';
	}}
`;

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
  w-full h-10 
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

export const Modal = tw.div`
	hidden fixed top-0 right-0 bottom-0 left-0 z-50
	bg-gray5/70
`;

export const ModalSection = tw.div`
	flex flex-col justify-center items-center
 	w-full h-96 max-w-xs
	bg-white2 rounded-lg border-8 border-white2
	py-2 px-1
`;

export const ModalHeader = tw.div`
	flex justify-between items-center
	w-full
	text-gray4 text-lg font-bold
	mb-3
`;

export const WhiteBox = tw.div`
	w-11/12
	flex flex-col items-center
	bg-white rounded-3xl
	text-gray4 text-base font-bold
	my-3 py-2 px-2
`;

export const Circle = tw.div`
	w-14 h-14
	flex items-center justify-center
	bg-red rounded-full shadow-lg
	text-white text-base font-black
	py-2 px-2 mx-2 z-10
`;

const Semantics = {
	Button,
	GraButton,
	Label,
	Input,
	Modal,
	WhiteBox,
	Circle,
	CustomInput,
	CustomButton,
};

export default Semantics;
