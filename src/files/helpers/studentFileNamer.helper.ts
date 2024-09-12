import { Request } from 'express';


export const studentFileNamer = (req: Request, file: Express.Multer.File, callback: Function) => {
    if(!file) return callback(new Error('No file uploaded'), false)

    const fileExtension = file.originalname.split('.').pop()
    const acceptedTopicId = req.query.acceptedTopicId as String;

    const fileName = `${acceptedTopicId}.${fileExtension}`; 

    callback(null, fileName)
}