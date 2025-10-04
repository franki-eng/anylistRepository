import { registerEnumType } from "@nestjs/graphql";



export enum ValidRoles {
    admin = 'admin',
    user = 'user',
    superUser = 'superUser',
}

// aca etoy registrando un enum con graphql 
registerEnumType( ValidRoles, {
  name: 'ValidRoles', // Este nombre debe coincidir con el nombre usado en GraphQL
  description: 'Roles válidos dentro del sistema', // opcional
});