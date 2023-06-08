import { type NextPage } from "next";
import Header from "@/components/Header";
import Board from "@/components/Board";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Board />
    </>
  );
};

export default Home;
