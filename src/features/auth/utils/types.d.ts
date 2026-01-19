export type User =
  | {
      username: string;
      image: string;
      roles: string[];
      userId: string;
      paddleCustomerId: string;
    }
  | undefined;
