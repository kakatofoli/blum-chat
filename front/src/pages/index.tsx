import { Box } from '@chakra-ui/react';
import type { NextPage, NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Auth from '../components/Auth/Auth';
import Chat from '../components/Chat/Chat';
import { Session } from 'next-auth'

const Home: NextPage = () => {

  const { data: session } = useSession();

  const reloadedSession = () => {};

  console.log('Aqui está o callback do google', session)

  return (
    <Box>
      {session?.user.username ? <Chat /> : <Auth session={session} reloadSession={reloadedSession} />}
    </Box>
  )
};

export async function getServerSideProps(contex: NextPageContext) {

  const session = await getSession(contex);

  return {
    props: {
      session,
    }
  }
}

export default Home
