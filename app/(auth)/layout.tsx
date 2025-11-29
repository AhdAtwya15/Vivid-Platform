import { ReactNode } from "react"

interface IProps
{
    children:ReactNode

}

const AuthLayout = ({children}:IProps) => {
  return (
    <div className="flex justify-center pt-40">
        {children}

    </div>
  )
}

export default AuthLayout