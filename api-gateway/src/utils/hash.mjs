import * as bcrypt from "bcrypt";

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password,hash);
}

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 5);
}