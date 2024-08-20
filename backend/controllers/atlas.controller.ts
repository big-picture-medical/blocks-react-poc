import { Request, Response } from 'express';
import {
  createEhr,
  fetchBlockConfiguration, fetchComposition,
  getBlockConfigurationsList,
  getBlockTemplates,
  submitComposition,
  validateComposition,
  fetchTerminology
} from '../services/atlas.service';

export const getBlockConfigurations = async (req: Request, res: Response) => {
  try {
    const result = JSON.parse(await getBlockConfigurationsList(req.body?.type, req.body?.templateKey));
    return res.status(result?.code ?? 200).send(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const result = JSON.parse(await getBlockTemplates());
    return res.status(result?.code ?? 200).send(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

export const createPatientInEhr = async (req: Request, res: Response) => {
  try {
    const result = JSON.parse(await createEhr(req.body?.subjectId));
    return res.status(result?.code ?? 200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

export const getBlockConfiguration = async (req: Request, res: Response) => {
  try {
    const result = JSON.parse(await fetchBlockConfiguration(req.body?.id, req.body?.version));
    return res.status(result?.code ?? 200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

export const getTerminology = async (req: Request, res: Response) => {
  try {
    const result = JSON.parse(await fetchTerminology(req.query));
    return res.status(result?.code ?? 200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

export const submitBlockComposition = async (req: Request, res: Response) => {
  try {
    const result = JSON.parse(await submitComposition(req.body));
    return res.status(result?.code ?? 200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

export const validateBlockComposition = async (req: Request, res: Response) => {
  try {
    const result = JSON.parse(await validateComposition());
    return res.status(result?.code ?? 200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

export const getComposition = async (req: Request, res: Response) => {
  try {
    const result = JSON.parse(await fetchComposition(req.query.composition_id as string));
    return res.status(result?.code ?? 200).send(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};
