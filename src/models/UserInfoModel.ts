export default interface UserInfoModel {
    user : {
        _id: string
        username: string
        roles: [string]
        hashedPassword: string
        taskIds: [string]
    }
}