import { useEffect, useState, useTransition } from "react";
import { Icon } from "../Icon";
import { User } from "../../services/user";
import "./UserTable.css";

type UserTableProps = {
  users: User[];
  onDeleteUser: (id: string) => void;
  openEditUserModal: (user: User) => void;
};

const TABLE_ROW_HEADERS: {
  name: keyof User;
  label: string;
}[] = [
  { name: "gender", label: "Gender" },
  { name: "firstName", label: "First name" },
  { name: "lastName", label: "Last name" },
  { name: "age", label: "Age" },
];

export const UserTable = ({
  users,
  onDeleteUser,
  openEditUserModal,
}: UserTableProps) => {
  const [, startTransition] = useTransition();
  const [sortedUsers, setSortedUsers] = useState<User[]>(users);

  const sortUsersAsc = (key: keyof User) => {
    startTransition(() => {
      setSortedUsers(
        [...sortedUsers].sort((a, b) =>
          b[key].toString().localeCompare(a[key].toString())
        )
      );
    });
  };

  const sortUsersDesc = (key: keyof User) => {
    startTransition(() => {
      setSortedUsers(
        [...sortedUsers].sort((a, b) =>
          a[key].toString().localeCompare(b[key].toString())
        )
      );
    });
  };

  useEffect(() => {
    setSortedUsers(users);
  }, [users]);

  return (
    <div className="table-container">
      <table>
        <TableHeader
          sortUsersAsc={sortUsersAsc}
          sortUsersDesc={sortUsersDesc}
        />
        <tbody>
          {sortedUsers.map((user) => (
            <TableRow
              user={user}
              openEditUserModal={openEditUserModal}
              onDeleteUser={onDeleteUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHeader = ({
  sortUsersAsc,
  sortUsersDesc,
}: {
  sortUsersAsc: (key: keyof User) => void;
  sortUsersDesc: (key: keyof User) => void;
}) => (
  <thead>
    <tr>
      {TABLE_ROW_HEADERS.map(({ name, label }) => (
        <th key={name}>
          {label}
          <ColumnSort
            onSortAsc={() => sortUsersAsc(name)}
            onSortDesc={() => sortUsersDesc(name)}
          />
        </th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({
  user,
  openEditUserModal,
  onDeleteUser,
}: {
  user: User;
  openEditUserModal: (user: User) => void;
  onDeleteUser: (id: string) => void;
}) => {
  const { id, gender, firstName, lastName, age } = user;
  return (
    <tr key={id}>
      <td>{gender}</td>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{age}</td>
      <UserActions
        onEdit={() => openEditUserModal(user)}
        onDelete={() => onDeleteUser(id)}
      />
    </tr>
  );
};

const ColumnSort = ({
  onSortAsc,
  onSortDesc,
}: {
  onSortAsc: () => void;
  onSortDesc: () => void;
}) => (
  <div className="sorting-arrows">
    <button onClick={onSortAsc} aria-label="Sort asc">
      <Icon name="upArrow" />
    </button>
    <button onClick={onSortDesc} aria-label="Sort desc">
      <Icon name="downArrow" />
    </button>
  </div>
);

const UserActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="user-actions">
    <td>
      <button type="button" className="edit-button" onClick={onEdit}>
        Edit
      </button>
    </td>
    <td>
      <button
        type="button"
        onClick={onDelete}
        className="delete-button"
        aria-label="Delete user">
        <Icon name="bin" />
      </button>
    </td>
  </div>
);