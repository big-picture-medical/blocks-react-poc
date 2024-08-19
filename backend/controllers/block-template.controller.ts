import { Request, Response } from 'express';
import { getBlockTemplates } from '../services/block-template.service';

export const all = async (req: Request, res: Response) => {
  try {
    const result = await getBlockTemplates();
    return res.status(200).send(JSON.parse(result).data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

