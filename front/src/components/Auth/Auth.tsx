import { Button, Center, Stack, Text, Image, Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface AuthProps {
    session: Session | null;
    reloadSession: () => void;
}

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {

    const [username, setUsername] = useState("");

    const onSubmit = async () => {
        try {
            /**
             * 
             */
        } catch (error) {
            console.log('Erro ao criar o usuário', error);
        }
    }

  return (
    <Center height='100vh'>
        <Stack align='center' spacing={8}>
            {session ? (
                <>
                    <Text fontSize='3xl'>
                        Digite seu nome de Usuário
                    </Text>
                    <Input placeholder='Nome de usuário' value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <Button width='100%' onClick={onSubmit}>Salvar</Button>
                </>
            ) : (
                <>
                    <Text fontSize='3xl'>
                        BLUM Chat
                    </Text>
                    <Button onClick={() => signIn('google')} leftIcon={<Image height='20px' src="/images/google.png" />}>
                        Acessar com o Google
                    </Button>
                </>
            )}
        </Stack>
    </Center>
  )
};

export default Auth;
