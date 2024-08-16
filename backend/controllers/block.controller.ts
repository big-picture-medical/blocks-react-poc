import { Request, Response } from 'express';
import { getBlocksList } from '../services/block.service';

export const all = async (req: Request, res: Response) => {
  try {
    const result = await getBlocksList();
    return res.status(200).send(JSON.parse(result).data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

