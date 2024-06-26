import { useAuthContext } from "./AuthContext";
import { ResourceAccessProps } from "./AuthTypes"; 

export const useVerifyResourceAccess = (props: Omit<ResourceAccessProps, "children" | "fallback">): boolean => {

    // destructure the requiredRolesOrResources, requiredAll, and additionalUserRolesOrResources from props
    // and get the userRolesOrResources from the useAuthContext hook
    const { requiredRolesOrResources = [], requiredAll, additionalUserRolesOrResources } = props; 
    const { userRolesOrResources = [] } = useAuthContext();

    // if required roles is empty, return true 
    if(requiredRolesOrResources?.length === 0) return true;

    // if additionalUserRolesOrResources is provided, add them to userRolesOrResources
    // it is important to create a copy of userRolesOrResources before 
    // adding additionalUserRolesOrResources
    // to avoid mutating the original userRolesOrResources array
    const userRolesOrResourcesCpy = [...userRolesOrResources];
    if (additionalUserRolesOrResources && additionalUserRolesOrResources.length > 0) {
        userRolesOrResourcesCpy.push(...additionalUserRolesOrResources);
    }

    // convert userRolesOrResources to lower case
    const userRoles = userRolesOrResourcesCpy.map((role) => role.toLowerCase());
    const requiredRoles = requiredRolesOrResources.map((role) => role.toLowerCase());

    // if requiredAll is true, check if the user has all the required roles
    if (requiredAll) {
        return requiredRoles.every((role) => userRoles.includes(role));
    }

    // if requiredAll is false, check if the user has any of the required roles
    return requiredRoles.some((role) => userRoles.includes(role));
}

export const VerifyResourceAccess: React.FC<ResourceAccessProps> = (props) => {
    const { children, fallback, ...rest } = props;
    const hasAccess = useVerifyResourceAccess(rest);

    if(hasAccess) {
        return children;
    }

    return (
        fallback ? fallback : null
    );
}