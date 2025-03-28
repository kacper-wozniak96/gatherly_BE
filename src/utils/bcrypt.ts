import * as bcrypt from 'bcrypt';

export namespace BCrypt {
  export const hash = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  export const compare = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
  };
}
