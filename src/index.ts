import express, {Express, Request, Response} from 'express';
import { ApolloServer} from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const PORT = Number(process.env.PORT) || 8000;
const app:Express = express();

async function startServer() {
    const  server = new ApolloServer({
        typeDefs: `

        type User {
            id: ID!
            name: String!
            username: String!
            email: String!
            phone: String!
            website: String!
        }
        type Todo{
            id: ID!
            title: String!
            completed: Boolean
            user: User
        }

        type Query{
            getTodos: [Todo]
            getAllUsers: [User]
            getUser(id: ID!): User
        }
        `,
        resolvers: {
            Todo:{
                user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data,
            },
            Query: {
                getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser: async (parent,{id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
                
            }
        }
    });
    
    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.json());

    await server.start();
    app.use('/graphql',expressMiddleware(server));
    app.listen(PORT,()=> console.log(`Server running on port: ${PORT}`)
    )

}

startServer();



// app.get('/',(req: Request, res: Response) => {
//     res.json("Hy");
// })

// app.get('/health',(req: Request, res: Response) => {
//     res.json("Every thing is fine");
// })

// app.listen(PORT, () => {
//     console.log(`Server running on Port: ${PORT}`);
// })


