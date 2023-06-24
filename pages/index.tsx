import { type NextPage } from "next";
import Header from "@/components/Header";
import Board from "@/components/Board";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Header />
      { sessionData ? <Board />  : <></>}
    </>
  );
};

export default Home;
