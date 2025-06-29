// src/routes/CreateUserRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { FormDataProvider } from "../core/components/CreateUser/context/FormDataContext";
import FormUser from "../core/components/CreateUser/Forms/FormUser/FormUser";
import FormDepartments from "../core/components/CreateUser/Forms/FormDepartments/FormDepartments";
import FormRoles from "../core/components/CreateUser/Forms/FormRoles/FormRoles";
import FormPermissions from "../core/components/CreateUser/Forms/FormPermissions/FormPermissions";
import UserSummary from "../core/components/CreateUser/Summary/UserSummary";

const CreateUserRoutes = () => {
  return (
    <FormDataProvider>
      <Routes>
        <Route path="createuser" element={<FormUser />} />
        <Route path="departamentform" element={<FormDepartments />} />
        <Route path="roleform/:department" element={<FormRoles />} />
        <Route path="permissionsform/:department/:role" element={<FormPermissions />} />
        <Route path="usersummary" element={<UserSummary />} />
      </Routes>
    </FormDataProvider>
  );
};

export default CreateUserRoutes;

