import logo from "./logo.svg";
import "./App.css";
import ChatComponent from "./ChatComponent";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";
import "/node_modules/primeflex/primeflex.css";
function App() {
  return (
    <PrimeReactProvider>
      <ChatComponent />
    </PrimeReactProvider>
  );
}

export default App;
