import Weather from "./Weather";

function App() {
  return (
    <>
      <div className="h-screen bg-cover bg-center" style={{ backgroundImage: 'url("background.jpg")' }}>
        <Weather></Weather>
      </div>
    </>
  );
}

export default App;
