import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE7]">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Registration Pending Approval</h2>
        <p className="text-gray-600 mb-6">
          Your registration has been successfully submitted and is pending approval from the administrator.
          Once approved, you will receive an email notification, and you will be able to log in to your account.
        </p>
        <Button
          onClick={() => navigate("/login")}
          className="w-full  text-white py-2 rounded hover:bg-[#213555]"
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
};

export default PendingApproval;
