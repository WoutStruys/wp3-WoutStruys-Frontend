export default interface IUser{
  _id: number
  username: string
  roles: [string]
  taskIds: [string]
  isEdit: boolean
}
