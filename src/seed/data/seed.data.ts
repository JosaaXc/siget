import { ValidRoles } from "src/auth/interfaces";


export const USERS_SEED = [
    {
        email: 'josafat719@gmail.com',
        password: 'Hola123',
        roles: [ValidRoles.student]
    },
    {
        email: 'erickcapilla@gmail.com',
        password: 'Hola123',
        roles: [ValidRoles.admin, ValidRoles.coordinador, ValidRoles.coordinador]
    },
    {
        email: 'paty123@gmail.com',
        password: 'Hola123',
        roles: [ValidRoles.asesor, ValidRoles.titular_materia, ValidRoles.revisor]
    }
];