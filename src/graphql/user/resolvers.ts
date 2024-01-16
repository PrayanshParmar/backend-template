import UserServices, { createUserProps, loginUserProps } from "../../services/user";

const queries = {
    loginUser: async(_:any, props:loginUserProps) => {
        const token = await UserServices.loginUser(props);
        return token;
    },
    getCurrentLoggedInUser: async (_:any, parameters: any, context: any) => {
        console.log(context);
        if(context && context.user){
            const id = context.user.id;
            const user = await UserServices.getUserById(id);
            return user;
        }
        throw new Error("Nothing");
    }
};

const mutations = {
  createUser: async (_: any, props:createUserProps) => {
    const res = await UserServices.createUser(props);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
