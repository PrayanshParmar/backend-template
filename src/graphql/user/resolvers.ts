import UserServices, { createUserProps, loginUserProps } from "../../services/user";

const queries = {
    loginUser: async(_:any, props:loginUserProps) => {
        const token = await UserServices.loginUser(props);
        return token;
    }
};

const mutations = {
  createUser: async (_: any, props:createUserProps) => {
    const res = await UserServices.createUser(props);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
