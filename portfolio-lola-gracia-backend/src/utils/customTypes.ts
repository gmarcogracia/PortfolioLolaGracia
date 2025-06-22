export type CreateUserParams = {
    username:string;
    password:string;
}
export type UpdateUserParams = {
    username:string;
    password:string;
}
export type GrantRoleParams = {
    role:number;

}
export type createArticleParams = {
    content:string;
    title:string;
    slug:string;
}