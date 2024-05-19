import { Request } from 'express';

interface User {
    id: string;
}

export const studentFileNamer = (req: Request & { user: User }, file: Express.Multer.File, callback: Function) => {
    if(!file) return callback(new Error('No file uploaded'), false)

    const fileExtension = file.originalname.split('.').pop()
    const userId = req.user.id; 

    const fileName = `${userId}.${fileExtension}`; 

    callback(null, fileName)
}
  