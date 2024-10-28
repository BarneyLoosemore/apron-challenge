import { useEffect, useRef, useState } from "react";
import { UserForm, UserSchema } from "./components/UserForm";
import "./App.css";
import { Icon } from "./components/Icon";
import { UserTable } from "./components/UserTable";
import {
  User,
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "./services/user";
import { displayToast } from "./helpers/displayToast";

const AddUserButton = ({ onClick }: { onClick: () => void }) => (
  <button className="add-user-button" onClick={onClick}>
    <Icon name="plus" />
    Add user
  </button>
);

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<{
    formTitle: string;
    submitButtonText: string;
    defaultValues?: Partial<UserSchema>;
    onSubmit: (data: UserSchema) => void;
  } | null>();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = () => dialogRef.current?.close();
  const openDialog = () => dialogRef.current?.showModal(); // using dialog.showModal() gives us a lot of free a11y wins, e.g. esc to close, focus trapping, etc.

  const refetchUsers = async () => {
    try {
      const users = await fetchUsers();
      setUsers(users);
    } catch (e) {
      setNetworkError(`Failed to fetch users: ${(e as Error).message}`);
    }
  };

  const onAddUser = async (formValues: UserSchema) => {
    closeDialog();
    try {
      await addUser(formValues);
      await refetchUsers();
      displayToast("User added");
    } catch (e) {
      setNetworkError(`Failed to add user: ${(e as Error).message}`);
    }
  };

  const onEditUser = async (formValues: UserSchema, id: string) => {
    closeDialog();
    try {
      await updateUser(formValues, id);
      await refetchUsers();
    } catch (e) {
      setNetworkError(`Failed to edit user: ${(e as Error).message}`);
    }
    displayToast("User saved");
  };

  const onDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      await refetchUsers();
      displayToast("User deleted");
    } catch (e) {
      setNetworkError(`Failed to delete user: ${(e as Error).message}`);
    }
  };

  const openEditUserModal = (user: User) => {
    const { id, age, ...rest } = user;
    setActiveForm({
      formTitle: "Edit user",
      submitButtonText: "Edit",
      defaultValues: {
        age,
        ...rest,
      },
      onSubmit: (formValues) => onEditUser(formValues, id),
    });
    openDialog();
  };

  const openAddUserModal = () => {
    setActiveForm({
      formTitle: "Add user",
      submitButtonText: "Add",
      defaultValues: {
        gender: "" as never,
        firstName: "",
        lastName: "",
        age: "" as never,
      },
      onSubmit: onAddUser,
    });
    openDialog();
  };

  useEffect(() => {
    refetchUsers();
  }, []);

  if (!users)
    return (
      <main>
        <h1>Loading users..</h1>
      </main>
    );

  return (
    <main>
      <h1>Users</h1>
      <AddUserButton onClick={openAddUserModal} />
      <dialog ref={dialogRef}>
        {activeForm && <UserForm closeDialog={closeDialog} {...activeForm} />}
      </dialog>
      {networkError && <p className="error-message">{networkError}</p>}
      <UserTable {...{ users, onDeleteUser, openEditUserModal }} />
    </main>
  );
};

export default App;
