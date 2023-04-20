type GreetingsProps = {
  name: string;
};

function MainPage({ name }: GreetingsProps) {
  return (
      <div className="bg-red-700">
        왜안놰../ Hello, {name}
      </div>
  );
}

MainPage.defaultProps = {
 name: '캠프해'
};

export default MainPage;