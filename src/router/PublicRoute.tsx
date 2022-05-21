import { useContext } from "react";
import { Route, Redirect } from "wouter";
import { AuthContext } from "../providers/AuthProvider";

const PrivateRoute: React.FC<{
    component: React.FC;
    path: string;
}> = (props) => {
    return !useContext(AuthContext)?.user ? (<Route path={props.path} component={props.component} />) : (<Redirect to="/" />)
};
export default PrivateRoute;