import NavBar from "./components/NavBar";
import Main from "./components/Main";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Blog from "./components/Blog";

export default function Home() {
  return (
    <>
      <NavBar />
      <Main />
      <Projects />
      <Blog />
      <Contact />
    </>
  );
}
