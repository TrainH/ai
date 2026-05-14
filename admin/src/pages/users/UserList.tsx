import { List, Datagrid, TextField, EmailField, DateField, EditButton, BooleanField } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" label="이름" />
            <EmailField source="email" label="이메일" />
            <TextField source="role" label="권한" />
            <TextField source="status" label="상태" />
            <BooleanField source="marketingAgreed" label="마케팅 동의" />
            <DateField source="createdAt" label="가입일" />
            <EditButton />
        </Datagrid>
    </List>
);
