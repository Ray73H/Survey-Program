import { Outlet } from "react-router-dom";

function SignInLayout() {
    return (
        <div className="flex">
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

export default SignInLayout;