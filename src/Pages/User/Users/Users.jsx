import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../Components/common/Loader/Loader";
import Pagination from "../../../Components/common/Pagination/Pagination";

import { getAllUsersSchema } from "../../../schemas/user.schema";
import { getAllUsersAPI } from "../../../service/apis";

const Users = () => {
  const { userState } = useContext(UserContext);
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async (page) => {
    try {
      const { error, value } = getAllUsersSchema.validate(page);
      if (error) {
        return toast(error.message, { type: "error" });
      }
      setLoading(true);
      const response = await getAllUsersAPI(value);
      if (response.data.message) {
        return toast(response.data.message, { type: "warning" });
      }
      setTotalPages(Math.ceil(response.data.totalPages / 5));
      setUsers(response.data.users);
      setLoading(false);
      return response;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return toast(error.response.data.message, { type: "error" });
    }
  };

  useEffect(() => {
    getAllUsers(1);
  }, [userState]);
  return (
    <div>
      <ToastContainer />
      <div className="mt-4">
        <h4 className="text-center">Users</h4>
        <div className="text-center">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate("/add/users")}
          >
            Add Users
          </button>
        </div>
        <div className="container">
          <div style={{ marginTop: "20px" }}>
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              func={getAllUsers}
            />
          </div>
        </div>
        {users ? (
          <div>
            {loading ? (
              <Loader color={"primary"} />
            ) : (
              <div>
                {users.length > 0 ? (
                  <>
                    {users.map((user) => (
                      <div className="container mt-4 mb-2">
                        <div
                          onClick={() => navigate(`/profile/${user.id}`)}
                          className="card floatCard"
                        >
                          <div className="card-body">
                            <h5 class="card-title">
                              Name:{" "}
                              {userState && user.id === userState.id ? (
                                <span className="text-danger">
                                  {user.fullName} (You)
                                </span>
                              ) : (
                                <span className="text-primary">
                                  {user.fullName}
                                </span>
                              )}
                            </h5>
                            <ul className="list-group list-group-flush floatCard">
                              <li className="list-group-item">
                                Email: {user.email}
                              </li>
                              <li className="list-group-item">
                                Role: {user.role}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center mt-4">
                    No Users with reservations!
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginTop: "10px" }}>
            <Loader color={"primary"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
