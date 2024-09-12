import { Request } from 'express';

export const updateFileNamer = (req: Request, file: Express.Multer.File, callback: Function) => {
    if (!file) return callback(new Error('No file uploaded'), false);

    const fileExtension = file.originalname.split('.').pop();
    const topicDocumentId = req.query['topic-document'] as string;

    const fileName = `${topicDocumentId}.${fileExtension}`;

    callback(null, fileName);
}