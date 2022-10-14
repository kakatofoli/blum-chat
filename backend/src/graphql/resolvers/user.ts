import { CreateUsernameResponse, GraphQLContext } from "../../util/types";

const resolvers = {
    Query: {
        searchUsers: () => {},
    },
    Mutation: {
        createUsername: async (_: any, args: { username: string }, context: GraphQLContext): Promise<CreateUsernameResponse> => {
            const { username } = args;
            const { session, prisma } = context;
            
            if(!session?.user){
                return {
                    error: 'Acesso não autorizado'
                }
            }

            const { id: userID } = session.user;
            try {
                
                const existingUser = await prisma.user.findUnique({
                    where: {
                        username,
                    },
                });

                if (existingUser){
                    return{
                        error: 'Username já está em uso, escolha outro',
                    };
                }

                await prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        username
                    }
                });

                return { seccess: true };

            } catch (error: any) {
                console.log("Erro ao criar o usuário: ", error);
                return {
                    error: error.message
                }
            }
        },
    },
};

export default resolvers;