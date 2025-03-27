import Register from "@/components/auth/signup";
import React from "react";

const SignupPage = ({ location }: any) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Register location={location} />
    </div>
  );
};
export default SignupPage;
