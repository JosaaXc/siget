export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    if(!file) return callback( new Error('No file uploaded'), false)

    const validMimetypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ] 
    if(validMimetypes.includes(file.mimetype)) return callback( null, true)

    callback(null, false)

}