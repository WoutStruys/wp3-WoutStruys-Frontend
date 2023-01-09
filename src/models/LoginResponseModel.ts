export default interface LoginResponseModel {
    user : {
        _id: string
        username: string
        roles: [string]
    }
    
}